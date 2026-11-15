export interface FireBoundaryProperties {
  id: string;
  name: string;
  ignitionDate: string;
  containmentDate: string;
  areaHa: number;
  perimeterKm: number;
  meanDnbr: number;
  highSeverityAreaHa: number;
  moderateSeverityAreaHa: number;
  lowSeverityAreaHa: number;
  color: string;
}

export interface WatershedProperties {
  huc12: string;
  name: string;
  areaHa: number;
  meanDnbr: number;
  positiveDnbrAreaHa: number;
  positiveDnbrPct: number;
  nisarDeltaDb: number;
  meanElevationM: number;
  meanSlopeDeg: number;
  steepTerrainPct: number; // Slope > 30 degrees
  monitoringPriorityScore: number; // 0-100
  priorityRank: number;
  color?: string;
}

export interface GeoJSONFeature<P = Record<string, any>> {
  type: 'Feature';
  id?: string | number;
  properties: P;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONFeatureCollection<P = Record<string, any>> {
  type: 'FeatureCollection';
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
  features: GeoJSONFeature<P>[];
}

export type FireFeatureCollection = GeoJSONFeatureCollection<FireBoundaryProperties>;
export type WatershedFeatureCollection = GeoJSONFeatureCollection<WatershedProperties>;

export interface MapLayerState {
  watersheds: boolean;
  firePerimeters: boolean;
  terrainShading: boolean;
  satelliteUnderlay: boolean;
  dnbrOverlay: boolean;
  radarOverlay: boolean;
}
