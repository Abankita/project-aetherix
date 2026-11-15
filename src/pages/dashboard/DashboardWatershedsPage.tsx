import React, { useState } from 'react';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { StatisticsService } from '@/services/statisticsService';
import { DATA_SOURCES } from '@/config/dataSources';
import {
  Mountain,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const DashboardWatershedsPage: React.FC = () => {
  const watersheds = StatisticsService.getWatershedRankings();
  const [selectedHuc, setSelectedHuc] = useState<string>('180600060101'); // Default to Willow Creek
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'elevated'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedWatershed =
    watersheds.find((w) => w.huc12 === selectedHuc) || watersheds[0];

  const filteredWatersheds = watersheds.filter((w) => {
    if (filterSeverity === 'critical' && w.culvertVulnerability !== 'Critical') return false;
    if (
      filterSeverity === 'elevated' &&
      w.culvertVulnerability !== 'Critical' &&
      w.culvertVulnerability !== 'Elevated'
    )
      return false;
    if (
      searchQuery.trim() !== '' &&
      !w.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !w.huc12.includes(searchQuery.trim())
    )
      return false;
    return true;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-[#172330] border border-teal-200 dark:border-[rgba(160,180,195,0.14)] text-[#006972] dark:text-[#36C5D9] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <Mountain className="w-3.5 h-3.5 text-[#36C5D9]" />
            Hydrologic Unit Code (HUC-12) Catchment Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Watershed &amp; Terrain Geomorphology
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Hydrologic catchment analysis evaluating burn severity, terrain steepness (&gt;30°
            slope), and downstream sedimentation vulnerability across 11 HUC-12 units along the Big
            Sur Coastal Range.
          </p>
        </div>

        {/* Highest Vulnerability Telemetry Chip */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white dark:bg-[#111C28] p-3.5 rounded-2xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F06468] animate-pulse"></span>
            <div>
              <div className="text-[10px] font-mono uppercase text-gray-400 dark:text-[#788796]">
                Highest Priority Basin
              </div>
              <div className="text-sm font-bold text-[#18191D] dark:text-[#F3F6F8] font-mono">
                Willow Creek–Frontal (87.6)
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111C28] p-3.5 rounded-2xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
            <div className="text-[10px] font-mono uppercase text-gray-400 dark:text-[#788796]">Total Monitored Area</div>
            <div className="text-sm font-bold text-[#18191D] dark:text-[#F3F6F8] font-mono">
              11 Units · 68,490 ha
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Selection Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-[#111C28] rounded-2xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796] font-semibold mr-1">
            Filter Priority:
          </span>
          <div className="inline-flex rounded-full bg-[#ECEEF2] dark:bg-[#172330] p-1">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-white dark:bg-[#1B2937] text-[#18191D] dark:text-[#F3F6F8] shadow-2xs'
                  : 'text-gray-600 dark:text-[#AAB5C2] hover:text-black dark:hover:text-white'
              }`}
            >
              All 11 Basins
            </button>
            <button
              onClick={() => setFilterSeverity('elevated')}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
                filterSeverity === 'elevated'
                  ? 'bg-[#F28C45] text-white shadow-2xs'
                  : 'text-gray-600 dark:text-[#AAB5C2] hover:text-black dark:hover:text-white'
              }`}
            >
              Elevated Risk
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-all cursor-pointer ${
                filterSeverity === 'critical'
                  ? 'bg-[#F06468] text-white shadow-2xs'
                  : 'text-gray-600 dark:text-[#AAB5C2] hover:text-black dark:hover:text-white'
              }`}
            >
              Critical Risk
            </button>
          </div>
        </div>

        <div className="text-xs font-mono text-[#626873] dark:text-[#AAB5C2]">
          Click basin on map or list below to inspect geomorphic metrics
        </div>
      </div>

      {/* Main Interactive Map (VISUALLY DOMINANT) */}
      <InteractiveMap
        height="540px"
        selectedHuc12={selectedHuc}
        showWatersheds={true}
        showFires={true}
        onSelectWatershed={(huc12) => setSelectedHuc(huc12)}
      />

      {/* Selected Watershed Detailed Contextual Panel */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#36C5D9] font-semibold mb-1">
              <span>HUC-12: {selectedWatershed.huc12}</span>
              <span>·</span>
              <span>RANK #{selectedWatershed.priorityRank} OF 11</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#18191D] dark:text-[#F3F6F8]">
              {selectedWatershed.name} Catchment
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase ${
                selectedWatershed.culvertVulnerability === 'Critical'
                  ? 'bg-red-50 dark:bg-red-950/50 text-[#F06470] border border-red-200 dark:border-red-800'
                  : selectedWatershed.culvertVulnerability === 'Elevated'
                  ? 'bg-orange-50 dark:bg-orange-950/50 text-[#F49A48] border border-orange-200 dark:border-orange-800'
                  : 'bg-teal-50 dark:bg-teal-950/50 text-[#29C9D2] border border-teal-200 dark:border-teal-800'
              }`}
            >
              Vulnerability: {selectedWatershed.culvertVulnerability}
            </span>

            <div className="text-right">
              <div className="text-[10px] font-mono text-gray-400 dark:text-[#788796] uppercase">Priority Score</div>
              <div className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] font-mono">
                {selectedWatershed.monitoringPriorityScore} / 100
              </div>
            </div>
          </div>
        </div>

        {/* 6 Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Catchment Area</div>
            <div className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
              {selectedWatershed.areaHa.toLocaleString()} ha
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Basin Footprint</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Mean dNBR</div>
            <div className="text-lg font-bold text-[#F28C45] mt-1 font-mono">
              {selectedWatershed.meanDnbr}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Burn Severity</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Positive dNBR Area</div>
            <div className="text-lg font-bold text-[#F06468] mt-1 font-mono">
              {selectedWatershed.positiveDnbrPct}%
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
              {selectedWatershed.positiveDnbrAreaHa.toLocaleString()} ha
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">NISAR Δσ0 (SAR)</div>
            <div className="text-lg font-bold text-[#36C5D9] mt-1 font-mono">
              {selectedWatershed.nisarDeltaDb} dB
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Backscatter Drop</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Mean Elevation</div>
            <div className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
              {selectedWatershed.meanElevationM} m
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">3DEP DEM 10m</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
            <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Steep Slope (&gt;30°)</div>
            <div className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
              {selectedWatershed.steepTerrainPct}%
            </div>
            <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
              Mean Slope: {selectedWatershed.meanSlopeDeg}°
            </div>
          </div>
        </div>

        {/* Primary Hazard Description */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#172330] border border-blue-200/60 dark:border-[rgba(160,180,195,0.14)] text-xs text-[#065EA1] dark:text-[#36C5D9] flex items-center gap-3">
          <Info className="w-4 h-4 shrink-0 text-[#36C5D9]" />
          <span>
            <strong>Primary Downstream Threat:</strong> {selectedWatershed.primaryThreat}
          </span>
        </div>
      </div>

      {/* Watershed Rankings Table Section Beneath Map */}
      <section className="bg-white dark:bg-[#111C28] rounded-3xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] tracking-tight">
              All 11 Catchment Monitoring Rankings
            </h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
              Ranked in order of composite monitoring-priority score. Click any row to center and
              isolate on map.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-400 dark:text-[#788796] uppercase text-[11px]">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">HUC-12 Unit</th>
                <th className="py-3 px-3">Area (ha)</th>
                <th className="py-3 px-3">Mean dNBR</th>
                <th className="py-3 px-3">Positive dNBR %</th>
                <th className="py-3 px-3">Steep Slope (&gt;30°)</th>
                <th className="py-3 px-3">SAR Δσ0 (dB)</th>
                <th className="py-3 px-3">Priority Score</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredWatersheds.map((w) => {
                const isSelected = w.huc12 === selectedHuc;
                return (
                  <tr
                    key={w.huc12}
                    onClick={() => setSelectedHuc(w.huc12)}
                    className={`hover:bg-blue-50/50 dark:hover:bg-[#172330] cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/80 dark:bg-[#172330] font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#1B2937] text-[#18191D] dark:text-[#F3F6F8] inline-flex items-center justify-center font-bold text-[11px]">
                        {w.priorityRank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{w.name}</div>
                      <div className="text-[10px] text-gray-400 dark:text-[#788796]">{w.huc12}</div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-700 dark:text-[#AAB5C2]">{w.areaHa.toLocaleString()}</td>
                    <td className="py-3.5 px-3 font-semibold text-[#F28C45]">{w.meanDnbr}</td>
                    <td className="py-3.5 px-3 text-gray-700 dark:text-[#AAB5C2]">{w.positiveDnbrPct}%</td>
                    <td className="py-3.5 px-3 text-gray-700 dark:text-[#AAB5C2]">{w.steepTerrainPct}%</td>
                    <td className="py-3.5 px-3 text-[#36C5D9]">{w.nisarDeltaDb} dB</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1B2937] font-bold text-[#18191D] dark:text-[#F3F6F8]">
                        {w.monitoringPriorityScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#36C5D9]">
                      <ChevronRight className="w-4 h-4" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mandatory Scientific Disclaimer Card */}
      <section className="p-5 rounded-2xl bg-amber-50/70 dark:bg-[#111C28] border border-amber-200/80 dark:border-[rgba(160,180,195,0.14)] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-[#E9B75C] shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 dark:text-[#AAB5C2] leading-relaxed font-mono">
          <strong className="text-amber-950 dark:text-[#E9B75C]">SCIENTIFIC DISCLAIMER:</strong> {DATA_SOURCES.metadata.scientificDisclaimer}
        </div>
      </section>
    </div>
  );
};
