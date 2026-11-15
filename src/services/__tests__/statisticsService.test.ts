import { describe, it, expect } from 'vitest';
import { StatisticsService } from '@/services/statisticsService';
import { DATA_SOURCES } from '@/config/dataSources';

describe('Geospatial Data & Statistics Services', () => {
  it('correctly loads Timber and Plaskett fire data', () => {
    const fires = StatisticsService.getFireStatistics();
    expect(fires.timber).toBeDefined();
    expect(fires.timber.hectares).toBe(5800);
    expect(fires.plaskett).toBeDefined();
    expect(fires.plaskett.hectares).toBe(7420);
  });

  it('contains exactly 11 HUC-12 watershed monitoring rankings', () => {
    const watersheds = StatisticsService.getWatershedRankings();
    expect(watersheds.length).toBe(11);
    expect(watersheds[0].name).toBe('Willow Creek–Frontal');
    expect(watersheds[0].monitoringPriorityScore).toBe(87.6);
  });

  it('calculates sensor concordance matrix summing to 100%', () => {
    const concordance = StatisticsService.getSensorConcordanceMatrix();
    expect(concordance.length).toBe(4);
    const totalPct = concordance.reduce((sum, item) => sum + item.percentage, 0);
    expect(Math.round(totalPct)).toBe(100);
  });

  it('correctly reports preliminary processing inventory', () => {
    const inv = DATA_SOURCES.metadata.inventory;
    expect(inv.huc12Units).toBe(11);
    expect(inv.preFireScenes).toBe(20);
    expect(inv.postFireScenes).toBe(34);
    expect(inv.isPreliminary).toBe(true);
  });
});
