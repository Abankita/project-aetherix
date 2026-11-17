import maplibregl from 'maplibre-gl';
import { DATA_SOURCES } from '@/config/dataSources';
import { MAP_THEME } from '@/config/mapTheme';

export type BasemapProvider = 'imagery' | 'carto' | 'osm';
export type MapViewStyle = 'standard' | 'dark' | 'satellite' | 'hybrid';

export class MapService {
  /**
   * Retrieves the configured CARTO API key from environment
   */
  static getCartoKey(): string | null {
    const key = import.meta.env.VITE_CARTO_BASEMAPS_KEY;
    if (!key || key.trim() === '') {
      return null;
    }
    return key.trim();
  }

  /**
   * Retrieves the configured MapTiler API key from environment
   */
  static getMapTilerKey(): string | null {
    const key = import.meta.env.VITE_MAPTILER_API_KEY;
    if (!key || key.trim() === '') {
      return null;
    }
    return key.trim();
  }

  /**
   * Checks if CARTO provider is actively configured
   */
  static isCartoConfigured(): boolean {
    return this.getCartoKey() !== null;
  }

  /** Generates realistic imagery by default, with CARTO and OSM map alternatives. */
  static getMapStyle(provider: BasemapProvider = 'carto', isDark: boolean = true): maplibregl.StyleSpecification {
    const bgColor = isDark ? MAP_THEME.basemap.backgroundColor : '#F3F6F8';
    const cartoKey = this.getCartoKey();
    const useImagery = provider === 'imagery';
    const useCarto = provider === 'carto' && cartoKey !== null;
    const tiles = useImagery
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : useCarto
      ? `https://basemaps.cartocdn.com/rastertiles/${isDark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoKey || '')}`
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = useImagery
      ? 'Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
      : useCarto
      ? '© CARTO · © OpenStreetMap contributors'
      : '© OpenStreetMap contributors';

    return {
      version: 8,
      sources: {
        'basemap-tiles': {
          type: 'raster',
          tiles: [tiles],
          tileSize: 256,
          attribution,
        },
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': bgColor,
          },
        },
        {
          id: 'basemap-layer',
          type: 'raster',
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 19,
          paint: !useImagery && !useCarto && isDark
            ? {
                'raster-saturation': -0.85,
                'raster-contrast': 0.25,
                'raster-brightness-min': 0.1,
                'raster-brightness-max': 0.55,
              }
            : {
                'raster-saturation': 0.0,
                'raster-contrast': 0.05,
              },
        },
      ],
    };
  }

  static flyToAOI(map: maplibregl.Map) {
    map.flyTo({
      center: DATA_SOURCES.aoi.center,
      zoom: DATA_SOURCES.aoi.defaultZoom,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }

  static flyToFire(map: maplibregl.Map, fireId: 'timber' | 'plaskett') {
    const config = DATA_SOURCES.fires[fireId];
    if (config) {
      map.flyTo({
        center: config.center,
        zoom: config.zoom,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }

  static fitToFireGeoJson(
    map: maplibregl.Map,
    collection: { features?: Array<{ properties?: Record<string, unknown>; geometry?: { coordinates?: unknown } }> } | null,
    fireId: 'timber' | 'plaskett',
  ) {
    const features = collection?.features?.filter((feature) => feature.properties?.id === fireId) ?? [];
    const bounds = new maplibregl.LngLatBounds();
    const addCoordinates = (coordinates: unknown) => {
      if (!Array.isArray(coordinates)) return;
      if (coordinates.length >= 2 && typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
        bounds.extend([coordinates[0], coordinates[1]]);
        return;
      }
      coordinates.forEach(addCoordinates);
    };

    features.forEach((feature) => addCoordinates(feature.geometry?.coordinates));
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 64, maxZoom: 12.5, duration: 800 });
    else this.flyToFire(map, fireId);
  }

  static flyToCoordinates(map: maplibregl.Map, center: [number, number], zoom: number = 11.8) {
    map.flyTo({
      center,
      zoom,
      speed: 1.2,
      curve: 1.4,
      essential: true,
    });
  }
}
