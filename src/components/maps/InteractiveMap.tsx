import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapService, BasemapProvider } from '@/services/mapService';
import { DATA_SOURCES } from '@/config/dataSources';
import { MAP_THEME } from '@/config/mapTheme';
import { RotateCcw, Layers, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface InteractiveMapProps {
  center?: [number, number];
  zoom?: number;
  selectedFireId?: 'timber' | 'plaskett' | 'all';
  selectedHuc12?: string | null;
  showWatersheds?: boolean;
  showFires?: boolean;
  showSatellite?: boolean;
  defaultView?: string;
  onSelectFire?: (id: 'timber' | 'plaskett') => void;
  onSelectWatershed?: (huc12: string) => void;
  className?: string;
  height?: string;
  interactive?: boolean;
  showInternalControls?: boolean;
}

// In-memory cache for GeoJSON to guarantee instant loading without network failures
let cachedFireGeoJson: any = null;
let cachedHucGeoJson: any = null;

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = DATA_SOURCES.aoi.center,
  zoom = DATA_SOURCES.aoi.defaultZoom,
  selectedFireId = 'all',
  selectedHuc12 = null,
  showWatersheds = true,
  showFires = true,
  onSelectFire,
  onSelectWatershed,
  className = '',
  height = '540px',
  interactive = true,
  showInternalControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isFirstMount = useRef(true);
  const [loading, setLoading] = useState(true);
  const [hasWebGlError, setHasWebGlError] = useState(false);
  const { isDark } = useTheme();

  // Basemap provider state: defaults to clean live 'osm'
  const [provider, setProvider] = useState<BasemapProvider>('osm');

  // Inject vector layers into the map
  const addVectorLayers = useCallback(async (map: maplibregl.Map) => {
    try {
      // 1. Fire Perimeters GeoJSON
      if (!cachedFireGeoJson) {
        const fireRes = await fetch(DATA_SOURCES.vectorFiles.firePerimetersGeoJson);
        if (fireRes.ok) {
          cachedFireGeoJson = await fireRes.json();
        }
      }

      if (cachedFireGeoJson && map && !map.getSource('fire-perimeters')) {
        map.addSource('fire-perimeters', {
          type: 'geojson',
          data: cachedFireGeoJson,
        });

        // Fire fill layer
        map.addLayer({
          id: 'fire-perimeters-fill',
          type: 'fill',
          source: 'fire-perimeters',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'id'], 'timber'],
              MAP_THEME.fires.timber.outline,
              MAP_THEME.fires.plaskett.outline,
            ],
            'fill-opacity': 0.20,
          },
        });

        // Fire outline layer
        map.addLayer({
          id: 'fire-perimeters-line',
          type: 'line',
          source: 'fire-perimeters',
          paint: {
            'line-color': [
              'case',
              ['==', ['get', 'id'], 'timber'],
              MAP_THEME.fires.timber.outline,
              MAP_THEME.fires.plaskett.outline,
            ],
            'line-width': 2.5,
            'line-opacity': 0.95,
          },
        });

        if (interactive && onSelectFire) {
          map.on('click', 'fire-perimeters-fill', (e) => {
            if (e.features && e.features[0]) {
              const id = e.features[0].properties?.id;
              if (id === 'timber' || id === 'plaskett') {
                onSelectFire(id);
              }
            }
          });

          map.on('mouseenter', 'fire-perimeters-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'fire-perimeters-fill', () => {
            map.getCanvas().style.cursor = '';
          });
        }
      }

      // 2. HUC-12 Watersheds GeoJSON
      if (!cachedHucGeoJson) {
        const hucRes = await fetch(DATA_SOURCES.vectorFiles.watershedsGeoJson);
        if (hucRes.ok) {
          cachedHucGeoJson = await hucRes.json();
        }
      }

      if (cachedHucGeoJson && map && !map.getSource('huc12-watersheds')) {
        map.addSource('huc12-watersheds', {
          type: 'geojson',
          data: cachedHucGeoJson,
        });

        // Watershed fill layer
        map.addLayer({
          id: 'huc12-watersheds-fill',
          type: 'fill',
          source: 'huc12-watersheds',
          paint: {
            'fill-color': MAP_THEME.watersheds.default.outline,
            'fill-opacity': 0.07,
          },
        });

        // Watershed dashed boundaries
        map.addLayer({
          id: 'huc12-watersheds-line',
          type: 'line',
          source: 'huc12-watersheds',
          paint: {
            'line-color': MAP_THEME.watersheds.default.outline,
            'line-width': 1.5,
            'line-dasharray': [2, 2],
            'line-opacity': 0.85,
          },
        });

        if (interactive) {
          map.on('click', 'huc12-watersheds-fill', (e) => {
            if (e.features && e.features[0] && onSelectWatershed) {
              const huc12 = e.features[0].properties?.huc12;
              if (huc12) {
                onSelectWatershed(huc12);
              }
            }
          });

          map.on('mouseenter', 'huc12-watersheds-fill', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'huc12-watersheds-fill', () => {
            map.getCanvas().style.cursor = '';
          });
        }
      }
    } catch (err) {
      console.warn('Vector layer synchronization note:', err);
    } finally {
      setLoading(false);
    }
  }, [interactive, onSelectFire, onSelectWatershed]);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const initialStyle = MapService.getMapStyle(provider, isDark);

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: initialStyle,
        center: center,
        zoom: zoom,
        maxZoom: 18,
        minZoom: 2, // Allow zooming out freely across California and coastal region
        interactive: interactive,
        attributionControl: false,
      });

      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      }

      mapRef.current = map;

      const handleAddVectors = () => {
        addVectorLayers(map);
      };

      map.on('load', handleAddVectors);
      map.on('styledata', () => {
        if (map.isStyleLoaded()) {
          addVectorLayers(map);
        }
      });

      return () => {
        map.off('load', handleAddVectors);
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre WebGL initialization note:', err);
      setHasWebGlError(true);
      setLoading(false);
    }
  }, []);

  // Update style when theme (Light/Dark) or Provider changes, skipping first mount
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map) return;

    try {
      const nextStyle = MapService.getMapStyle(provider, isDark);
      map.setStyle(nextStyle);
    } catch (e) {
      console.warn('Style update deferred:', e);
    }
  }, [provider, isDark]);

  // Sync selected fire filtering
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('fire-perimeters-fill')) return;

    if (selectedFireId === 'all') {
      map.setPaintProperty('fire-perimeters-fill', 'fill-opacity', 0.20);
      map.setPaintProperty('fire-perimeters-line', 'line-opacity', 0.95);
      map.setPaintProperty('fire-perimeters-line', 'line-width', 2.5);
      MapService.flyToAOI(map);
    } else {
      map.setPaintProperty('fire-perimeters-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'id'], selectedFireId],
        0.35,
        0.06,
      ]);
      map.setPaintProperty('fire-perimeters-line', 'line-opacity', [
        'case',
        ['==', ['get', 'id'], selectedFireId],
        1.0,
        0.25,
      ]);
      map.setPaintProperty('fire-perimeters-line', 'line-width', [
        'case',
        ['==', ['get', 'id'], selectedFireId],
        3.5,
        1.5,
      ]);
      MapService.flyToFire(map, selectedFireId);
    }
  }, [selectedFireId]);

  // Sync watershed selection highlighting
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !map.getLayer('huc12-watersheds-fill')) return;

    if (selectedHuc12) {
      map.setPaintProperty('huc12-watersheds-fill', 'fill-color', [
        'case',
        ['==', ['get', 'huc12'], selectedHuc12],
        MAP_THEME.watersheds.selected.outline,
        MAP_THEME.watersheds.default.outline,
      ]);
      map.setPaintProperty('huc12-watersheds-fill', 'fill-opacity', [
        'case',
        ['==', ['get', 'huc12'], selectedHuc12],
        0.20,
        0.07,
      ]);
      map.setPaintProperty('huc12-watersheds-line', 'line-color', [
        'case',
        ['==', ['get', 'huc12'], selectedHuc12],
        MAP_THEME.watersheds.selected.outline,
        MAP_THEME.watersheds.default.outline,
      ]);
      map.setPaintProperty('huc12-watersheds-line', 'line-width', [
        'case',
        ['==', ['get', 'huc12'], selectedHuc12],
        3.0,
        1.5,
      ]);
      map.setPaintProperty('huc12-watersheds-line', 'line-opacity', [
        'case',
        ['==', ['get', 'huc12'], selectedHuc12],
        1.0,
        0.85,
      ]);
    } else {
      map.setPaintProperty('huc12-watersheds-fill', 'fill-color', MAP_THEME.watersheds.default.outline);
      map.setPaintProperty('huc12-watersheds-fill', 'fill-opacity', 0.07);
      map.setPaintProperty('huc12-watersheds-line', 'line-color', MAP_THEME.watersheds.default.outline);
      map.setPaintProperty('huc12-watersheds-line', 'line-width', 1.5);
      map.setPaintProperty('huc12-watersheds-line', 'line-opacity', 0.85);
    }
  }, [selectedHuc12]);

  // Toggle Visibility Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('fire-perimeters-fill')) {
      map.setLayoutProperty('fire-perimeters-fill', 'visibility', showFires ? 'visible' : 'none');
      map.setLayoutProperty('fire-perimeters-line', 'visibility', showFires ? 'visible' : 'none');
    }

    if (map.getLayer('huc12-watersheds-line')) {
      map.setLayoutProperty('huc12-watersheds-line', 'visibility', showWatersheds ? 'visible' : 'none');
      map.setLayoutProperty('huc12-watersheds-fill', 'visibility', showWatersheds ? 'visible' : 'none');
    }
  }, [showFires, showWatersheds]);

  const toggleProvider = () => {
    setProvider((prev) => (prev === 'carto' ? 'osm' : 'carto'));
  };

  const resetView = () => {
    if (mapRef.current) {
      MapService.flyToAOI(mapRef.current);
    }
  };

  // Safety fallback for loading overlay to ensure it never hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-md ${
        isDark ? 'bg-[#242526]' : 'bg-[#EBF0F2]'
      } ${className}`}
      style={{ height }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center gap-2 font-mono text-xs ${
            isDark ? 'bg-[#242526]/85 text-white' : 'bg-[#EBF0F2]/85 text-[#18191D]'
          }`}
        >
          <Loader2 className="w-5 h-5 animate-spin text-[#29C9D2] pointer-events-none" />
          <span>LOADING GEOSPATIAL MAP LAYERS...</span>
        </div>
      )}

      {/* MapLibre DOM Target */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* WebGL Fallback if WebGL is unavailable in headless or older environment */}
      {hasWebGlError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#EAE8E4] dark:bg-[#111C28] p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#478ED8]/10 text-[#478ED8] flex items-center justify-center mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <div className="text-sm font-semibold text-[#191A1F] dark:text-[#F3F6F8]">
            Monterey County Geospatial Boundary
          </div>
          <div className="text-xs text-[#6B7280] dark:text-[#AAB5C2] mt-1 font-mono">
            36.2704° N, 121.8081° W · Big Sur Study Area
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#172330] text-xs font-mono text-[#478ED8] border border-[#E9E7E5] dark:border-gray-700 shadow-2xs">
            11 Monitored HUC-12 Basins · 2 Fire Complexes
          </div>
        </div>
      )}

      {/* Top Left: Map Style / AOI Pill matching reference screenshot */}
      {interactive && showInternalControls && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleProvider}
            type="button"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium backdrop-blur-md bg-white/95 text-[#18191D] border border-gray-200/90 hover:bg-gray-50 shadow-sm dark:bg-[#121418]/90 dark:text-white dark:border-white/20 dark:hover:bg-[#121418] transition-all cursor-pointer"
            title="Toggle between MapTiler / OpenStreetMap Basemaps"
          >
            <Layers className="w-3.5 h-3.5 text-[#29C9D2] pointer-events-none" />
            <span className="pointer-events-none uppercase text-[11px] tracking-wider font-semibold">
              BIG SUR STUDY AREA · MONTEREY COUNTY, CA
            </span>
          </button>

          <button
            onClick={resetView}
            type="button"
            className="p-1.5 rounded-full backdrop-blur-md bg-white/95 text-[#18191D] hover:bg-gray-50 border border-gray-200/90 shadow-sm dark:bg-[#121418]/90 dark:text-white dark:hover:bg-[#121418] dark:border-white/20 transition-all cursor-pointer"
            title="Reset to Big Sur AOI"
          >
            <RotateCcw className="w-3.5 h-3.5 pointer-events-none text-[#29C9D2]" />
          </button>
        </div>
      )}

      {/* Top Right: Map Provider Status Callout */}
      {showInternalControls && (
        <div className="absolute top-4 right-14 z-10 hidden sm:flex items-center gap-1.5 bg-amber-50/95 dark:bg-[#121418]/85 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300 dark:border-amber-400/30 text-[10px] font-mono text-amber-900 dark:text-amber-200 pointer-events-none shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse"></span>
          <span>Awaiting MapTiler API Key in .env.local</span>
        </div>
      )}

      {/* Bottom Left: Exact Legend Pill from reference screenshot */}
      {showInternalControls && (
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2.5 bg-white/95 dark:bg-[#121418]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-200/90 dark:border-white/20 text-[11px] font-mono text-[#18191D] dark:text-white shadow-md pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F49A48] border border-amber-600/30 dark:border-white/40"></span>
            <span>Timber Fire (Orange)</span>
          </div>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F06470] border border-rose-600/30 dark:border-white/40"></span>
            <span>Plaskett Fire (Red)</span>
          </div>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#29C9D2] border border-teal-600/30 dark:border-white/40"></span>
            <span>HUC-12 Basins (Cyan)</span>
          </div>
        </div>
      )}
    </div>
  );
};
