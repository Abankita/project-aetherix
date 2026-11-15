import { FireFeatureCollection, WatershedFeatureCollection, FireBoundaryProperties, WatershedProperties } from '@/types/geospatial';
import { DATA_SOURCES } from '@/config/dataSources';

class DataService {
  private fireGeoJsonCache: FireFeatureCollection | null = null;
  private watershedGeoJsonCache: WatershedFeatureCollection | null = null;

  async getFirePerimeters(): Promise<FireFeatureCollection> {
    if (this.fireGeoJsonCache) return this.fireGeoJsonCache;
    try {
      const res = await fetch(DATA_SOURCES.vectorFiles.firePerimetersGeoJson);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch fire perimeters`);
      const data: FireFeatureCollection = await res.json();
      this.fireGeoJsonCache = data;
      return data;
    } catch (err) {
      console.warn('Falling back to embedded fire perimeter cache:', err);
      // Return cached fallback if fetch fails in test or file environment
      return this.getFallbackFireData();
    }
  }

  async getFireById(id: string): Promise<FireBoundaryProperties | undefined> {
    const fires = await this.getFirePerimeters();
    const feature = fires.features.find((f) => f.properties.id === id);
    return feature?.properties;
  }

  async getWatersheds(): Promise<WatershedFeatureCollection> {
    if (this.watershedGeoJsonCache) return this.watershedGeoJsonCache;
    try {
      const res = await fetch(DATA_SOURCES.vectorFiles.watershedsGeoJson);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch watersheds`);
      const data: WatershedFeatureCollection = await res.json();
      this.watershedGeoJsonCache = data;
      return data;
    } catch (err) {
      console.warn('Falling back to embedded watershed cache:', err);
      return this.getFallbackWatershedData();
    }
  }

  async getWatershedByHuc12(huc12: string): Promise<WatershedProperties | undefined> {
    const watersheds = await this.getWatersheds();
    const feature = watersheds.features.find((f) => f.properties.huc12 === huc12);
    return feature?.properties;
  }

  getProcessingInventory() {
    return DATA_SOURCES.metadata.inventory;
  }

  private getFallbackFireData(): FireFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'timber',
          properties: {
            id: 'timber',
            name: 'Timber Fire',
            ignitionDate: 'July 14, 2024',
            containmentDate: 'August 28, 2024',
            areaHa: 5800,
            perimeterKm: 48.6,
            meanDnbr: 0.462,
            highSeverityAreaHa: 2180,
            moderateSeverityAreaHa: 2430,
            lowSeverityAreaHa: 980,
            color: '#F28C45',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-121.695, 36.255], [-121.635, 36.28], [-121.59, 36.24], [-121.625, 36.185], [-121.695, 36.255]]],
          },
        },
        {
          type: 'Feature',
          id: 'plaskett',
          properties: {
            id: 'plaskett',
            name: 'Plaskett Fire',
            ignitionDate: 'August 02, 2024',
            containmentDate: 'September 19, 2024',
            areaHa: 7420,
            perimeterKm: 62.4,
            meanDnbr: 0.518,
            highSeverityAreaHa: 3490,
            moderateSeverityAreaHa: 2810,
            lowSeverityAreaHa: 860,
            color: '#E85D63',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-121.52, 36.075], [-121.455, 36.09], [-121.41, 36.04], [-121.445, 35.975], [-121.52, 36.075]]],
          },
        },
      ],
    };
  }

  private getFallbackWatershedData(): WatershedFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: '180600060101',
          properties: {
            huc12: '180600060101',
            name: 'Willow Creek–Frontal',
            areaHa: 6420,
            meanDnbr: 0.428,
            positiveDnbrAreaHa: 4820,
            positiveDnbrPct: 75.1,
            nisarDeltaDb: -4.8,
            meanElevationM: 780,
            meanSlopeDeg: 34.5,
            steepTerrainPct: 64.2,
            monitoringPriorityScore: 87.6,
            priorityRank: 1,
            color: '#E85D63',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-121.485, 35.955], [-121.43, 35.99], [-121.455, 36.005], [-121.485, 35.955]]],
          },
        },
      ],
    };
  }
}

export const dataService = new DataService();
