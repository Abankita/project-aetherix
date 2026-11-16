export interface RasterLayer {
  id: string;
  fire: 'timber' | 'plaskett';
  name: string;
  category: string;
  description: string;
  path: string;
  data_type: string;
  crs: string;
  resolution: number[] | null;
  bounds: number[] | null;
  band_count: number;
  nodata: number | null;
  units: string;
  visualization: { min: number | null; max: number | null; palette: string; rgb_bands: number[] | null };
  statistics?: Record<string, number>;
  tile_url: string;
}

export interface FireSummary {
  id: 'timber' | 'plaskett';
  name: string;
  ignition_date: string;
  crs: string;
  resolution_m: number;
  grid_width: number;
  grid_height: number;
  aoi_pixels: number;
  common_valid_score_pixels: number;
  common_valid_score_percent: number;
  screening_score: Record<string, number>;
  dNBR: Record<string, number>;
  NDVI_loss: Record<string, number>;
  NDMI_loss: Record<string, number>;
  NISAR_HH_change: Record<string, number>;
  NISAR_HV_change: Record<string, number>;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`AETHERIX API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

export const aetherixApi = {
  layers: (fire: string) => getJson<{ fire: string; layers: RasterLayer[]; categories: Record<string, RasterLayer[]> }>(`/api/layers?fire=${fire}`),
  summary: (fire: string) => getJson<FireSummary>(`/api/fires/${fire}/summary`),
  comparison: () => getJson<{ fires: Record<string, string | number>[]; note: string }>('/api/comparison'),
  timeseries: (fire: string) => getJson<{ fire: string; observations: Record<string, unknown>[]; date_fields_available: boolean; nisar_status: string }>(`/api/timeseries/${fire}`),
  watersheds: (fire: string) => getJson<{ type: 'FeatureCollection'; features: Array<{ properties: Record<string, unknown> }> }>(`/api/vectors/${fire}/watersheds`),
  tileTemplate: (layer: RasterLayer, bands?: number[]) => {
    const rgb = bands || (layer.band_count >= 9 ? [3, 2, 1] : undefined);
    return `${API_BASE}${layer.tile_url}${rgb ? `?bands=${rgb.join(',')}` : ''}`;
  },
  previewUrl: (fire: string, layer: RasterLayer | undefined, bands?: number[]) => {
    if (!layer) return undefined;
    const rgb = bands?.length ? `?bands=${bands.join(',')}` : '';
    return `${API_BASE}/api/previews/${fire}/${layer.id}.png${rgb}`;
  },
};
