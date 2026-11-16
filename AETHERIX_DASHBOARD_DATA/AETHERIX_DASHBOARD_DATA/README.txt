AETHERIX DASHBOARD DATA PACKAGE
================================

STUDY AREA
Big Sur, California, USA
Timber Fire and Plaskett Fire

COORDINATE SYSTEMS
Analysis rasters: EPSG:32610
Web vectors: EPSG:4326
Integrated analysis resolution: 20 metres

FOLDER STRUCTURE
----------------

boundaries/
    timber_fire.geojson
    plaskett_fire.geojson

timber/
    sentinel2/
        stacks/
        bands/
    nisar/
        composites/
        changes/
        observation_counts/
    terrain/
    integrated/
    vectors/

plaskett/
    Same structure as timber/

metadata/
    layer_manifest.json
    dashboard_summary.json
    map_legends.json
    timeseries_summary.csv
    fire_comparison.csv
    file_inventory.csv
    validation_report.json

MAP DISPLAY
-----------

Use GeoTIFF layers through TiTiler.
Use GeoJSON for fire boundaries and watershed overlays.
Use MapLibre GL JS for interactive map rendering.

SENTINEL-2 STACK BAND ORDER
---------------------------
1. B2
2. B3
3. B4
4. B8
5. B11
6. B12
7. NDVI
8. NDMI
9. NBR

INTEGRATED STACK
----------------
NDVI_pre
NDVI_during
NDVI_post
NDMI_pre
NDMI_during
NDMI_post
NBR_pre
NBR_during
NBR_post
dNBR
HH_pre_dB
HH_during_dB
HH_post_dB
HV_pre_dB
HV_during_dB
HV_post_dB
HH_post_change_dB
HV_post_change_dB
Elevation
Slope
Screening_Score

SCIENTIFIC NOTES
----------------
NISAR GCOV HH/HV are gamma-zero backscatter measurements.
They are not coherence or displacement measurements.

dNBR and vegetation-index changes are spectral indicators.
The screening score is a relative multi-source index.
Neither is a field-calibrated burn severity classification.

NISAR provisional products are kept separate from validated products.

BACKEND
-------
Serve raster layers using TiTiler and FastAPI.
Serve GeoJSON, CSV and JSON using FastAPI endpoints.
Use layer_manifest.json to populate the frontend layer panel.