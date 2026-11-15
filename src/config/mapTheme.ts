/**
 * Centralised Geographical Map Styling System for AETHERIX — AFTER THE FIRE
 * Enforces unified geographical identity across all five dashboard routes and public hero.
 */

export const MAP_THEME = {
  // Base map background tone
  basemap: {
    backgroundColor: '#242526',
    defaultRasterId: 'osm-standard',
    attribution: '© OpenStreetMap contributors',
  },

  // Fire Complexes
  fires: {
    timber: {
      id: 'timber',
      name: 'Timber Fire',
      outline: '#F49A48',
      fill: 'rgba(244, 154, 72, 0.20)',
      fillRgb: [244, 154, 72],
      opacity: 0.20,
      lineWidth: 2.5,
      highlightLineWidth: 3.5,
      acres: 14332,
      hectares: 5800,
    },
    plaskett: {
      id: 'plaskett',
      name: 'Plaskett Fire',
      outline: '#F06470',
      fill: 'rgba(240, 100, 112, 0.20)',
      fillRgb: [240, 100, 112],
      opacity: 0.20,
      lineWidth: 2.5,
      highlightLineWidth: 3.5,
      acres: 18335,
      hectares: 7420,
    },
  },

  // HUC-12 Watershed Units
  watersheds: {
    default: {
      outline: '#29C9D2',
      fill: 'rgba(41, 201, 210, 0.07)',
      dashArray: [2, 2] as [number, number],
      lineWidth: 1.5,
      lineOpacity: 0.85,
    },
    selected: {
      outline: '#A8DDE0',
      fill: 'rgba(168, 221, 224, 0.20)',
      lineWidth: 3.0,
      lineOpacity: 1.0,
    },
    hover: {
      outline: '#5EE0E8',
      fill: 'rgba(41, 201, 210, 0.16)',
      lineWidth: 2.2,
      lineOpacity: 1.0,
    },
  },

  // Map Typography & Labels
  labels: {
    fontFamily: ['JetBrains Mono', 'monospace', 'sans-serif'],
    textColor: '#F3F6F8',
    textHaloColor: '#121418',
    textHaloWidth: 1.5,
    textSize: 11,
  },

  // Scientific Raster Legends
  rasterLegends: {
    dnbr: {
      title: 'Sentinel-2 Differential NBR (dNBR)',
      unit: 'Standard Burn Severity Index',
      stops: [
        { label: 'Unburned / Regrowth (< +0.100)', color: '#43C99A' },
        { label: 'Low Severity (+0.100 to +0.270)', color: '#E9B75C' },
        { label: 'Moderate Severity (+0.270 to +0.440)', color: '#F49A48' },
        { label: 'High Severity (> +0.440)', color: '#F06470' },
      ],
    },
    sarRadar: {
      title: 'NISAR L-Band SAR Backscatter Delta (Δσ0)',
      unit: 'Decibels (dB)',
      stops: [
        { label: 'Minimal Loss (> -1.5 dB)', color: '#43C99A' },
        { label: 'Moderate Canopy Scorch (-1.5 to -3.5 dB)', color: '#F49A48' },
        { label: 'High Biomass Combustion (-3.5 to -6.0 dB)', color: '#F06470' },
        { label: 'Catastrophic Stand Destruction (< -6.0 dB)', color: '#882233' },
      ],
    },
    concordance: {
      title: 'Dual-Sensor Synergy Classification',
      stops: [
        { label: 'Concordant Severe Burn', color: '#F06470', pct: 42.9 },
        { label: 'Concordant Moderate / Regrowth', color: '#F49A48', pct: 31.2 },
        { label: 'Optical Disparity (Surface Ash)', color: '#498ACF', pct: 14.3 },
        { label: 'Radar Disparity (Moisture/Roughness)', color: '#29C9D2', pct: 11.6 },
      ],
    },
  },
} as const;

export type MapTheme = typeof MAP_THEME;
