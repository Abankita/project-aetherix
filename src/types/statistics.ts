export interface FireStats {
  id: 'timber' | 'plaskett';
  name: string;
  hectares: number;
  acres: number;
  containment: string;
  ignition: string;
  perimeterKm: number;
  meanDnbr: number;
  maxDnbr: number;
  canopyLossPct: number;
  soilBurnIndex: string;
  severityBreakdown: {
    high: number; // percentage
    moderate: number;
    low: number;
    unburned: number;
  };
  keyFindings: string[];
}

export interface WatershedStats {
  huc12: string;
  name: string;
  areaHa: number;
  meanDnbr: number;
  positiveDnbrAreaHa: number;
  positiveDnbrPct: number;
  nisarDeltaDb: number;
  meanElevationM: number;
  meanSlopeDeg: number;
  steepTerrainPct: number;
  monitoringPriorityScore: number;
  priorityRank: number;
  culvertVulnerability: 'Critical' | 'Elevated' | 'Moderate' | 'Low';
  primaryThreat: string;
}

export interface SensorConcordance {
  category: string;
  areaHa: number;
  percentage: number;
  description: string;
  color: string;
}

export interface ProcessingInventory {
  huc12Units: number;
  preFireScenes: number;
  postFireScenes: number;
  spatialResolutionOptical: string;
  spatialResolutionRadar: string;
  crs: string;
  isPreliminary: boolean;
}
