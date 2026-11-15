import maplibregl from 'maplibre-gl';
import { DATA_SOURCES } from '@/config/dataSources';
import { MAP_THEME } from '@/config/mapTheme';

export type BasemapProvider = 'carto' | 'osm';
export type MapViewStyle = 'standard' | 'dark' | 'satellite' | 'hybrid';

export class MapService {
  /**
   * Retrieves the configured CARTO API key from environment
   */
  static getCartoKey(): string | null {
    const key = import.meta.env.VITE_CARTO_BASEMAPS_KEY;
    if (!key || key.trim() === '') {
      return 'cb1_59lw_1_bf2f028cb82f6408e71a608b';
    }
    return key.trim();
  }

  /**
   * Checks if CARTO provider is actively configured
   */
  static isCartoConfigured(): boolean {
    return this.getCartoKey() !== null;
  }

  /**
   * Generates the MapLibre style specification.
   * Defaults to universal OpenStreetMap provider (100% reliable, zero watermarks),
   * with full support for both Light Theme and Dark Theme (Midnight Geospatial).
   */
  static getMapStyle(provider: BasemapProvider = 'osm', isDark: boolean = true): maplibregl.StyleSpecification {
    const bgColor = isDark ? MAP_THEME.basemap.backgroundColor : '#F3F6F8';

    // 1. OpenStreetMap Provider (Clean, zero watermarks, 100% reliable)
    if (provider === 'osm') {
      return {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors · Awaiting MapTiler API Key in .env.local',
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
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: isDark
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

    // 2. CARTO Provider (Optional secondary basemap)
    const cartoKey = this.getCartoKey();
    const tilePath = isDark ? 'rastertiles/dark_all' : 'rastertiles/voyager';
    const tileUrl = cartoKey
      ? `https://a.basemaps.cartocdn.com/${tilePath}/{z}/{x}/{y}@2x.png?api_key=${encodeURIComponent(cartoKey)}`
      : `https://a.basemaps.cartocdn.com/${tilePath}/{z}/{x}/{y}@2x.png`;

    return {
      version: 8,
      sources: {
        'carto-basemap': {
          type: 'raster',
          tiles: [
            tileUrl,
            tileUrl.replace('//a.', '//b.'),
            tileUrl.replace('//a.', '//c.'),
            tileUrl.replace('//a.', '//d.'),
          ],
          tileSize: 256,
          attribution: '© CARTO · © OpenStreetMap contributors',
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
          id: 'carto-basemap-layer',
          type: 'raster',
          source: 'carto-basemap',
          minzoom: 0,
          maxzoom: 20,
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
