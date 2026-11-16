from __future__ import annotations

import csv
import json
import os
from functools import lru_cache
from io import BytesIO
from pathlib import Path
from typing import Any

import numpy as np
import rasterio
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from rasterio.transform import from_bounds
from rasterio.warp import Resampling, reproject, transform


def find_data_root() -> Path:
    configured = Path(os.getenv("DATA_ROOT", "./AETHERIX_DASHBOARD_DATA/AETHERIX_DASHBOARD_DATA"))
    candidates = [configured, Path("./backend/data/AETHERIX_DASHBOARD_DATA"), Path("./AETHERIX_DASHBOARD_DATA/AETHERIX_DASHBOARD_DATA")]
    for path in candidates:
        if (path / "layer_manifest.json").is_file():
            return path.resolve()
    return configured.resolve()


DATA_ROOT = find_data_root()
app = FastAPI(title="AETHERIX processed geospatial data", version="1.0.0")
origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET"], allow_headers=["*"])


@lru_cache(maxsize=1)
def manifest() -> dict[str, Any]:
    return json.loads((DATA_ROOT / "layer_manifest.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def summary_file() -> dict[str, Any]:
    return json.loads((DATA_ROOT / "dashboard_summary.json").read_text(encoding="utf-8"))


def require_fire(fire: str) -> dict[str, Any]:
    result = manifest().get("fires", {}).get(fire)
    if result is None:
        raise HTTPException(404, detail=f"Unknown fire '{fire}'. Use timber or plaskett.")
    return result


def inventory() -> list[dict[str, str]]:
    with (DATA_ROOT / "metadata" / "file_inventory.csv").open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


@lru_cache(maxsize=300)
def raster_info(path: str) -> dict[str, Any]:
    with rasterio.open(path) as ds:
        return {
            "bounds": list(ds.bounds), "bounds_wgs84": list(rasterio.warp.transform_bounds(ds.crs, "EPSG:4326", *ds.bounds, densify_pts=21)),
            "crs": str(ds.crs), "resolution": list(ds.res), "band_count": ds.count, "data_type": ds.dtypes[0],
            "nodata": ds.nodata, "width": ds.width, "height": ds.height, "band_descriptions": list(ds.descriptions),
        }


def display_name(rel: str, fallback: str) -> tuple[str, str]:
    low = rel.lower()
    stem = Path(rel).stem
    if "/sentinel2/stacks/" in low:
        phase = "pre-fire" if stem.startswith("pre") else "during-fire" if stem.startswith("during") else "post-fire"
        return f"Sentinel-2 {phase.title()} Composite", f"Nine-band Sentinel-2 reflectance and index stack for the {phase} phase."
    if "/sentinel2/bands/" in low:
        phase = next((p for p in ("pre", "during", "post") if f"/bands/{p}/" in low), "phase")
        return f"Sentinel-2 {stem.upper()} · {phase.title()}", f"Sentinel-2 {stem.upper()} band or index for the {phase} phase."
    if "/nisar/composites/" in low:
        pol, phase = stem.split("_")[:2]
        return f"NISAR {pol} {phase.title()} Backscatter", f"Provisional gamma-zero {pol} backscatter composite in dB ({phase} phase)."
    if "/nisar/changes/" in low:
        pol, phase = stem.split("_")[:2]
        period = "during minus pre-fire" if phase == "during" else "post-fire minus pre-fire"
        return f"NISAR {pol} {phase.title()} Change", f"Provisional {period} gamma-zero backscatter change in dB."
    if "/nisar/observation_counts/" in low:
        pol, phase = stem.replace("_20m", "").replace("_count", "").split("_")[:2]
        return f"NISAR {pol} {phase.title()} Observation Count", f"Number of provisional {pol} observations in the {phase} phase."
    names = {
        "dnbr": ("Sentinel-2 dNBR", "Pre-fire NBR minus post-fire NBR; spectral change indicator, not field-calibrated burn severity."),
        "dnbr_gee_source": ("Sentinel-2 dNBR · GEE Source", "Original GEE dNBR export."),
        "ndvi_loss": ("Sentinel-2 NDVI Loss", "Pre-fire NDVI minus post-fire NDVI; vegetation-condition indicator."),
        "ndmi_loss": ("Sentinel-2 NDMI Loss", "Pre-fire NDMI minus post-fire NDMI; moisture-condition indicator."),
        "nisar_hh_change": ("NISAR HH Post-fire Change", "Post-fire minus pre-fire HH gamma-zero backscatter in dB; provisional."),
        "nisar_hv_change": ("NISAR HV Post-fire Change", "Post-fire minus pre-fire HV gamma-zero backscatter in dB; provisional."),
        "nisar_hh_during_change": ("NISAR HH During-fire Change", "During-fire minus pre-fire HH gamma-zero backscatter in dB; provisional."),
        "nisar_hv_during_change": ("NISAR HV During-fire Change", "During-fire minus pre-fire HV gamma-zero backscatter in dB; provisional."),
        "screening_score": ("Multi-source Screening Index", "Relative multi-source screening index, not a probability or calibrated severity score."),
        "elevation": ("Digital Elevation Model", "Elevation resampled to the fire analysis grid."),
        "slope": ("Terrain Slope", "Terrain slope in degrees on the fire analysis grid."),
        "integrated_stack_20m": ("Integrated Multi-source Analysis Stack", "21-band integrated stack; see band descriptions in metadata."),
    }
    return names.get(stem.lower(), (fallback, fallback))


def layer_records(fire: str) -> list[dict[str, Any]]:
    require_fire(fire)
    registered = {x["path"]: x for x in manifest().get("layers", []) if x.get("fire") == fire}
    output = []
    for row in inventory():
        rel = row.get("file", "")
        if not rel.startswith(fire + "/") or not rel.lower().endswith(".tif"):
            continue
        meta = registered.get(rel, {})
        category = meta.get("category") or ("Sentinel-2" if "/sentinel2/" in rel else "NISAR" if "/nisar/" in rel else "Terrain" if "/terrain/" in rel else "Integrated Analysis")
        if category.lower() == "integrated analysis":
            category = "Integrated Analysis"
        fallback = meta.get("name") or Path(rel).stem.replace("_", " ")
        name, generated_description = display_name(rel, fallback)
        ident = meta.get("id") or f"{fire}_{rel[len(fire)+1:].replace('/', '_').replace('.tif', '')}"
        bands = int(float(row.get("bands") or 1))
        lower = rel.lower()
        if bands >= 9 or "/sentinel2/bands/" in lower and Path(rel).stem.startswith("B"):
            default_min, default_max = 0.0, 0.3
        elif any(k in lower for k in ("ndvi", "ndmi", "nbr")) and "dnbr" not in lower:
            default_min, default_max = -1.0, 1.0
        elif "/nisar/observation_counts/" in lower:
            default_min, default_max = 0.0, 10.0
        elif "/nisar/" in lower:
            default_min, default_max = (-10.0, 10.0) if "change" in lower or "minus" in lower else (-25.0, 0.0)
        elif "slope" in lower:
            default_min, default_max = 0.0, 65.0
        elif "elevation" in lower:
            default_min, default_max = 0.0, 1500.0
        else:
            default_min, default_max = 0.0, 1.0
        path = (DATA_ROOT / rel).resolve()
        info = raster_info(str(path)) if path.is_file() else {}
        descriptions = info.get("band_descriptions") or []
        if bands == 9 and not any(descriptions):
            descriptions = [key for key, _ in sorted(manifest().get("sentinel2_band_order", {}).items(), key=lambda pair: pair[1])]
        elif bands == 21 and not any(descriptions):
            descriptions = manifest().get("integrated_stack_bands", [])
        output.append({
            "id": ident, "fire": fire, "name": name, "category": category,
            "description": meta.get("description", generated_description), "path": rel,
            "data_type": info.get("data_type", "float32"), "crs": info.get("crs", row.get("crs") or "EPSG:32610"),
            "resolution": info.get("resolution"), "bounds": info.get("bounds"), "bounds_wgs84": info.get("bounds_wgs84"),
            "band_count": info.get("band_count", bands), "band_descriptions": descriptions,
            "nodata": info.get("nodata"),
            "units": meta.get("units") or ("dB" if "_db" in lower or "/nisar/" in lower and "change" in lower else "count" if "_count_" in lower else "degrees" if "slope" in lower else "metres" if "elevation" in lower else "unitless"),
            "visualization": {"min": meta.get("display_min", default_min), "max": meta.get("display_max", default_max), "palette": meta.get("colormap", "viridis"), "rgb_bands": [3, 2, 1] if bands >= 9 else None},
            "legend": meta.get("colormap"), "statistics": meta.get("statistics"),
            "tile_url": f"/api/tiles/{fire}/{ident}/{{z}}/{{x}}/{{y}}.png",
        })
    return output


def resolve_raster(fire: str, layer_id: str) -> tuple[dict[str, Any], Path]:
    item = next((x for x in layer_records(fire) if x["id"] == layer_id), None)
    if item is None:
        raise HTTPException(404, detail=f"Unknown layer '{layer_id}' for {fire}.")
    path = (DATA_ROOT / item["path"]).resolve()
    if not path.is_relative_to(DATA_ROOT) or not path.is_file():
        raise HTTPException(404, detail="Raster file is missing.")
    return item, path


def response_png(arr: np.ndarray) -> Response:
    output = BytesIO()
    Image.fromarray(arr, "RGBA").save(output, format="PNG", optimize=True)
    return Response(output.getvalue(), media_type="image/png", headers={"Cache-Control": "public, max-age=86400"})


def rgba_scalar(values: np.ndarray, valid: np.ndarray, minimum: float, maximum: float, palette: str) -> np.ndarray:
    amount = np.nan_to_num(np.clip((values - minimum) / max(maximum - minimum, 1e-9), 0, 1), nan=0.0)
    if "rd" in palette.lower() or "div" in palette.lower():
        stops = np.array([[49,54,149],[116,173,209],[247,247,247],[244,109,67],[165,0,38]], dtype=np.float32)
    elif "ylor" in palette.lower() or "screen" in palette.lower():
        stops = np.array([[255,255,204],[254,217,118],[254,178,76],[240,59,32],[128,0,38]], dtype=np.float32)
    else:
        stops = np.array([[68,1,84],[59,82,139],[33,145,140],[94,201,98],[253,231,37]], dtype=np.float32)
    pos = amount * (len(stops)-1)
    lo = np.minimum(pos.astype(np.int16), len(stops)-2)
    frac = pos-lo
    arr = np.zeros((*values.shape,4), dtype=np.uint8)
    for i in range(3):
        arr[:,:,i] = (stops[lo,i]*(1-frac)+stops[lo+1,i]*frac).astype(np.uint8)
    arr[:,:,3] = valid.astype(np.uint8)*230
    return arr


@app.get("/healthz")
def health() -> dict[str, Any]:
    return {"status": "ok", "data_root": str(DATA_ROOT), "data_available": (DATA_ROOT / "layer_manifest.json").is_file()}


@app.get("/api/fires")
def fires() -> dict[str, Any]:
    result = []
    for fire, meta in manifest().get("fires", {}).items():
        boundary_path = DATA_ROOT / "boundaries" / f"{fire}_fire.geojson"
        boundary = json.loads(boundary_path.read_text(encoding="utf-8")) if boundary_path.is_file() else None
        result.append({"id": fire, **meta, "boundary": boundary})
    return {"fires": result}


@app.get("/api/fires/{fire_id}/summary")
def fire_summary(fire_id: str) -> dict[str, Any]:
    fire = require_fire(fire_id)
    values = summary_file().get("fires", {}).get(fire_id)
    if values is None:
        raise HTTPException(404, detail="Summary is unavailable.")
    ts = timeseries(fire_id)["observations"]
    return {"id": fire_id, "name": fire.get("name"), **values,
            "available_layers": [x["id"] for x in layer_records(fire_id)],
            "available_acquisition_dates": sorted({x["date"] for x in ts if x.get("date")}),
            "available_phases": sorted({x["phase"] for x in ts}),
            "quality": {"common_valid_pixels": values.get("common_valid_score_pixels"), "common_valid_coverage_percent": values.get("common_valid_score_percent"), "notes": summary_file().get("notes", [])}}


@app.get("/api/layers")
def layers(fire: str = Query(..., pattern="^(timber|plaskett)$")) -> dict[str, Any]:
    records = layer_records(fire)
    groups: dict[str, list[dict[str, Any]]] = {}
    for item in records:
        groups.setdefault(item["category"], []).append(item)
    return {"fire": fire, "categories": groups, "layers": records}


@app.get("/api/layers/{layer_id}/metadata")
def layer_metadata(layer_id: str, fire: str = Query(..., pattern="^(timber|plaskett)$")) -> dict[str, Any]:
    item, path = resolve_raster(fire, layer_id)
    return {**item, **raster_info(str(path))}


def tile_pixels(path: Path, z: int, x: int, y: int, indexes: list[int]) -> list[np.ndarray]:
    extent = 20037508.342789244
    span = extent*2/(2**z)
    left, right = -extent+x*span, -extent+(x+1)*span
    top, bottom = extent-y*span, extent-(y+1)*span
    dst = from_bounds(left,bottom,right,top,256,256)
    result=[]
    with rasterio.open(path) as ds:
        for index in indexes:
            arr=np.full((256,256),np.nan,dtype=np.float32)
            reproject(source=rasterio.band(ds,index),destination=arr,src_transform=ds.transform,src_crs=ds.crs,
                      dst_transform=dst,dst_crs="EPSG:3857",src_nodata=ds.nodata,dst_nodata=np.nan,resampling=Resampling.bilinear)
            result.append(arr)
    return result


@app.get("/api/tiles/{fire}/{layer_id}/{z}/{x}/{y}.png")
def tile(fire: str, layer_id: str, z: int, x: int, y: int, bands: str | None=None,
         minimum: float | None=None, maximum: float | None=None, palette: str | None=None) -> Response:
    item,path=resolve_raster(fire,layer_id)
    if z<0 or z>22 or x<0 or y<0 or x>=2**z or y>=2**z:
        raise HTTPException(400,detail="Invalid Web Mercator tile coordinates.")
    with rasterio.open(path) as ds:
        indexes=[int(v) for v in bands.split(",")] if bands else ([3,2,1] if ds.count>=9 else [1])
        count=ds.count
        nodata=ds.nodata
    if len(indexes) not in (1,3) or any(i<1 or i>count for i in indexes):
        raise HTTPException(400,detail=f"Select one band or three RGB bands from 1 to {count}.")
    channels=tile_pixels(path,z,x,y,indexes)
    valid=np.logical_and.reduce([np.isfinite(a) for a in channels])
    if len(channels)==3:
        low=minimum if minimum is not None else 0.0
        high=maximum if maximum is not None else 0.3
        rgba=np.zeros((256,256,4),dtype=np.uint8)
        for i,channel in enumerate(channels):
            rgba[:,:,i]=np.nan_to_num(np.clip((channel-low)/max(high-low,1e-9),0,1)*255,nan=0).astype(np.uint8)
        rgba[:,:,3]=valid.astype(np.uint8)*225
        return response_png(rgba)
    lo=minimum if minimum is not None else item["visualization"]["min"]
    hi=maximum if maximum is not None else item["visualization"]["max"]
    return response_png(rgba_scalar(channels[0],valid,lo,hi,palette or item["visualization"]["palette"]))


@app.get("/api/previews/{fire}/{layer_id}.png")
def preview(fire: str, layer_id: str, bands: str | None=None) -> Response:
    item,path=resolve_raster(fire,layer_id)
    with rasterio.open(path) as ds:
        indexes=[int(v) for v in bands.split(",")] if bands else ([3,2,1] if ds.count>=9 else [1])
        if len(indexes) not in (1,3) or any(i<1 or i>ds.count for i in indexes):
            raise HTTPException(400,detail="Invalid preview band selection.")
        scale=min(1.0,1024/max(ds.width,ds.height))
        h,w=max(1,round(ds.height*scale)),max(1,round(ds.width*scale))
        data=ds.read(indexes,out_shape=(len(indexes),h,w),resampling=Resampling.bilinear,masked=True)
    if len(indexes)==3:
        rgba=np.zeros((h,w,4),dtype=np.uint8)
        for i in range(3):
            values=np.asarray(data[i].filled(np.nan),dtype=np.float32)
            rgba[:,:,i]=np.nan_to_num(np.clip(values/0.3,0,1)*255,nan=0).astype(np.uint8)
        rgba[:,:,3]=(~np.logical_or.reduce(np.ma.getmaskarray(data),axis=0)).astype(np.uint8)*255
    else:
        values=np.asarray(data[0].filled(np.nan),dtype=np.float32)
        rgba=rgba_scalar(values,np.isfinite(values),item["visualization"]["min"],item["visualization"]["max"],item["visualization"]["palette"])
    return response_png(rgba)


@app.get("/api/vectors/{fire_id}/boundary")
def boundary(fire_id: str) -> dict[str, Any]:
    require_fire(fire_id)
    path=DATA_ROOT/"boundaries"/f"{fire_id}_fire.geojson"
    return json.loads(path.read_text(encoding="utf-8"))


@app.get("/api/vectors/{fire_id}/watersheds")
def watersheds(fire_id: str) -> dict[str, Any]:
    require_fire(fire_id)
    path=DATA_ROOT/fire_id/"vectors"/"watersheds.geojson"
    if not path.is_file(): raise HTTPException(404,detail="Watershed GeoJSON is unavailable.")
    return json.loads(path.read_text(encoding="utf-8"))


def timeseries(fire: str) -> dict[str, Any]:
    require_fire(fire)
    with (DATA_ROOT/"metadata"/"timeseries_summary.csv").open(encoding="utf-8-sig",newline="") as stream:
        rows=[r for r in csv.DictReader(stream) if r.get("fire")==fire]
    obs=[]
    for row in rows:
        obs.append({"source":row["source"],"layer":row["layer"],"phase":row["phase"],"date":row.get("date") or None,
                    "valid_pixels":int(row["valid_pixels"]),"mean":float(row["mean"]),"median":float(row["median"]),"units":row["units"],
                    "mean_observation_count":float(row["mean_observation_count"]) if row.get("mean_observation_count") else None,
                    "provisional":row["source"]=="NISAR"})
    return {"fire":fire,"observations":obs,"date_fields_available":any(x["date"] for x in obs),"nisar_status":"provisional GCOV products"}


@app.get("/api/timeseries/{fire_id}")
def timeseries_endpoint(fire_id: str) -> dict[str, Any]:
    return timeseries(fire_id)


@app.get("/api/comparison")
def comparison() -> dict[str, Any]:
    with (DATA_ROOT/"metadata"/"fire_comparison.csv").open(encoding="utf-8-sig",newline="") as stream:
        rows=list(csv.DictReader(stream))
    parsed=[{k:(v if k in ("fire","name","ignition_date") else float(v) if "." in v else int(v)) for k,v in row.items()} for row in rows]
    return {"fires":parsed,"note":"Study areas use independent grids; pixel locations are not directly comparable."}


@app.get("/api/inspect/{fire_id}")
def inspect(fire_id: str, lon: float, lat: float) -> dict[str, Any]:
    require_fire(fire_id)
    xs,ys=transform("EPSG:4326","EPSG:32610",[lon],[lat])
    values={}
    for item in layer_records(fire_id):
        if item["band_count"]!=1: continue
        _,path=resolve_raster(fire_id,item["id"])
        with rasterio.open(path) as ds:
            if not (ds.bounds.left<=xs[0]<=ds.bounds.right and ds.bounds.bottom<=ys[0]<=ds.bounds.top): continue
            sample=next(ds.sample([(xs[0],ys[0])],masked=True))[0]
            if not np.ma.is_masked(sample) and np.isfinite(sample): values[item["id"]]=float(sample)
    return {"fire":fire_id,"coordinates":{"longitude":lon,"latitude":lat},"values":values}
