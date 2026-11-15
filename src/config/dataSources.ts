/**
 * Geospatial Data Sources and Calibration Metadata Configuration
 * All paths, endpoints, and coordinate references are managed centrally here.
 */

export const DATA_SOURCES = {
  crs: {
    projected: 'EPSG:32610 (WGS 84 / UTM Zone 10N)',
    geographic: 'EPSG:4326 (WGS 84)',
  },
  aoi: {
    name: 'Big Sur Coastal Mountain Range',
    center: [-121.56, 36.12] as [number, number],
    bounds: [-121.78, 35.92, -121.35, 36.32] as [number, number, number, number],
    defaultZoom: 10.5,
  },
  fires: {
    timber: {
      center: [-121.65, 36.21] as [number, number],
      zoom: 11.5,
    },
    plaskett: {
      center: [-121.48, 36.02] as [number, number],
      zoom: 11.5,
    },
  },
  vectorFiles: {
    firePerimetersGeoJson: '/data/big_sur_fire_perimeter.geojson',
    watershedsGeoJson: '/data/huc12_watersheds.geojson',
    huc12WatershedsGeoJson: '/data/huc12_watersheds.geojson',
  },
  rasterAssets: {
    sentinelPreFireNbr: '/data/rasters/pre_fire_NBR.tif',
    sentinelPostFireNbr: '/data/rasters/post_fire_NBR.tif',
    sentinelDnbr: '/data/rasters/dNBR.tif',
    nisarPreFireBackscatter: '/data/rasters/pre_fire_backscatter.tif',
    nisarPostFireBackscatter: '/data/rasters/post_fire_backscatter.tif',
    nisarRadarChange: '/data/rasters/radar_change.tif',
    demElevation: '/data/rasters/big_sur_dem.tif',
    demSlope: '/data/rasters/big_sur_slope.tif',
  },
  metadata: {
    sensorOptical: 'ESA Copernicus Sentinel-2 MSI (10m - 20m)',
    sensorRadar: 'NASA/ISRO SAR NISAR L-Band (12-day repeat)',
    terrainModel: 'USGS 3DEP 10m / 30m Seamless Digital Elevation Model',
    inventory: {
      huc12Units: 11,
      preFireScenes: 20,
      postFireScenes: 34,
      isPreliminary: true,
      note: 'Initial processing inventory figures. Preliminary metrics subject to peer calibration and final ground validation.',
    },
    scientificDisclaimer:
      'Monitoring priority represents relative prioritisation for further monitoring. It is not a validated debris-flow probability or forecast.',
  },
};
