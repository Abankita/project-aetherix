import React, { useState } from 'react';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { StatisticsService } from '@/services/statisticsService';
import {
  Flame,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const DashboardFiresPage: React.FC = () => {
  const [selectedFire, setSelectedFire] = useState<'timber' | 'plaskett' | 'all'>('all');
  const [showWatersheds, setShowWatersheds] = useState<boolean>(true);
  const [showTerrain, setShowTerrain] = useState<boolean>(true);
  const [showSatelliteUnderlay, setShowSatelliteUnderlay] = useState<boolean>(false);

  const stats = StatisticsService.getFireStatistics();
  const currentFireStats = selectedFire === 'all' ? null : stats[selectedFire];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Segmented Fire Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-[#172330] border border-orange-200 dark:border-[rgba(160,180,195,0.14)] text-[#F28C45] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <Flame className="w-3.5 h-3.5" />
            Fire Complexes &amp; Perimeters
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Explore the Fire Landscape
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Examine the Timber and Plaskett Fire study areas and their geographical relationship with
            surrounding watersheds. Select a fire complex below to view dedicated burn severity
            statistics and zoom to its boundary.
          </p>
        </div>

        {/* Segmented Pill Selector (STRICT TOP HORIZONTAL ORIENTATION) */}
        <div className="flex items-center p-1.5 rounded-full bg-[#ECEEF2] dark:bg-[#111C28] border border-gray-200/60 dark:border-[rgba(160,180,195,0.14)] shadow-inner self-start lg:self-auto">
          <button
            onClick={() => setSelectedFire('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedFire === 'all'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gray-900 dark:bg-gray-300"></span>
            <span>ALL FIRES</span>
          </button>

          <button
            onClick={() => setSelectedFire('timber')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedFire === 'timber'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F49A48] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F49A48]"></span>
            <span>TIMBER FIRE</span>
          </button>

          <button
            onClick={() => setSelectedFire('plaskett')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              selectedFire === 'plaskett'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F06470] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#F06470]"></span>
            <span>PLASKETT FIRE</span>
          </button>
        </div>
      </div>

      {/* Layer Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-[#111C28] rounded-2xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono uppercase text-[#858B95] dark:text-[#788796] font-semibold">LAYERS:</span>

          <button
            onClick={() => setShowWatersheds(!showWatersheds)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              showWatersheds
                ? 'bg-[#36C5D9]/15 text-[#006972] dark:text-[#36C5D9] border border-[#36C5D9]/30 font-semibold'
                : 'bg-gray-100 dark:bg-[#172330] text-gray-500 dark:text-[#788796] hover:bg-gray-200 dark:hover:bg-[#1B2937]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${showWatersheds ? 'opacity-100' : 'opacity-30'}`} />
            <span>Watershed Boundaries (HUC-12)</span>
          </button>

          <button
            onClick={() => setShowTerrain(!showTerrain)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              showTerrain
                ? 'bg-[#498ACF]/15 dark:bg-[#6599E8]/15 text-[#065EA1] dark:text-[#6599E8] border border-[#498ACF]/30 font-semibold'
                : 'bg-gray-100 dark:bg-[#172330] text-gray-500 dark:text-[#788796] hover:bg-gray-200 dark:hover:bg-[#1B2937]'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${showTerrain ? 'opacity-100' : 'opacity-30'}`} />
            <span>Terrain Shading (30m DEM)</span>
          </button>

          <button
            onClick={() => setShowSatelliteUnderlay(!showSatelliteUnderlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              showSatelliteUnderlay
                ? 'bg-[#36C5D9]/15 text-[#006972] dark:text-[#36C5D9] border border-[#36C5D9]/30 font-semibold'
                : 'bg-gray-100 dark:bg-[#172330] text-gray-500 dark:text-[#788796] hover:bg-gray-200 dark:hover:bg-[#1B2937]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SAR Backscatter Underlay</span>
          </button>
        </div>

        <div className="text-xs font-mono text-[#626873] dark:text-[#AAB5C2] hidden md:block">
          Click polygon on map or pills above to isolate fire
        </div>
      </div>

      {/* Main Interactive Map */}
      <InteractiveMap
        height="560px"
        selectedFireId={selectedFire}
        showWatersheds={showWatersheds}
        showSatellite={showSatelliteUnderlay}
        onSelectFire={(id) => setSelectedFire(id)}
      />

      {/* Dynamic Information Panel Based on Selection */}
      {selectedFire === 'all' ? (
        /* Summary Grid for Both Fires */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timber Fire Card */}
          <div
            onClick={() => setSelectedFire('timber')}
            className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs hover:border-[#F28C45] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F28C45]"></span>
                <h3 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8] group-hover:text-[#F28C45] transition-colors">
                  {stats.timber.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#F28C45] bg-orange-50 dark:bg-[#172330] px-2.5 py-1 rounded-full">
                5,800 HECTARES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Ignition Date</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{stats.timber.ignition}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Containment</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{stats.timber.containment}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean dNBR</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-semibold">{stats.timber.meanDnbr}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Canopy Loss</span>
                <span className="text-[#F06468] font-semibold">{stats.timber.canopyLossPct}%</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Severity Distribution</span>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
                <div style={{ width: `${stats.timber.severityBreakdown.high}%` }} className="bg-[#F06468]" title="High" />
                <div style={{ width: `${stats.timber.severityBreakdown.moderate}%` }} className="bg-[#F28C45]" title="Moderate" />
                <div style={{ width: `${stats.timber.severityBreakdown.low}%` }} className="bg-[#E9B75C]" title="Low" />
                <div style={{ width: `${stats.timber.severityBreakdown.unburned}%` }} className="bg-[#43C99A]" title="Unburned" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-[#AAB5C2]">
                <span>High: {stats.timber.severityBreakdown.high}%</span>
                <span>Mod: {stats.timber.severityBreakdown.moderate}%</span>
                <span>Low: {stats.timber.severityBreakdown.low}%</span>
              </div>
            </div>

            <div className="text-xs text-[#36C5D9] font-semibold flex items-center gap-1 pt-2">
              <span>Inspect isolated boundary &amp; radar telemetry →</span>
            </div>
          </div>

          {/* Plaskett Fire Card */}
          <div
            onClick={() => setSelectedFire('plaskett')}
            className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs hover:border-[#F06468] transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F06468]"></span>
                <h3 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8] group-hover:text-[#F06468] transition-colors">
                  {stats.plaskett.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#F06468] bg-red-50 dark:bg-[#172330] px-2.5 py-1 rounded-full">
                7,420 HECTARES
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Ignition Date</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{stats.plaskett.ignition}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Containment</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{stats.plaskett.containment}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean dNBR</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-semibold">{stats.plaskett.meanDnbr}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Canopy Loss</span>
                <span className="text-[#F06468] font-semibold">{stats.plaskett.canopyLossPct}%</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Severity Distribution</span>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
                <div style={{ width: `${stats.plaskett.severityBreakdown.high}%` }} className="bg-[#F06468]" title="High" />
                <div style={{ width: `${stats.plaskett.severityBreakdown.moderate}%` }} className="bg-[#F28C45]" title="Moderate" />
                <div style={{ width: `${stats.plaskett.severityBreakdown.low}%` }} className="bg-[#E9B75C]" title="Low" />
                <div style={{ width: `${stats.plaskett.severityBreakdown.unburned}%` }} className="bg-[#43C99A]" title="Unburned" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-[#AAB5C2]">
                <span>High: {stats.plaskett.severityBreakdown.high}%</span>
                <span>Mod: {stats.plaskett.severityBreakdown.moderate}%</span>
                <span>Low: {stats.plaskett.severityBreakdown.low}%</span>
              </div>
            </div>

            <div className="text-xs text-[#F06468] font-semibold flex items-center gap-1 pt-2">
              <span>Inspect isolated boundary &amp; radar telemetry →</span>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Selected Fire Inspection Panel */
        currentFireStats && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/90 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    selectedFire === 'timber' ? 'bg-[#F28C45]' : 'bg-[#F06468]'
                  }`}
                >
                  <Flame className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-[#18191D] dark:text-[#F3F6F8]">
                    {currentFireStats.name} Telemetry &amp; Impact
                  </h2>
                  <div className="text-xs font-mono text-[#626873] dark:text-[#AAB5C2]">
                    {currentFireStats.ignition} · {currentFireStats.containment}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedFire('all')}
                className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-mono font-medium bg-gray-100 dark:bg-[#172330] hover:bg-gray-200 dark:hover:bg-[#1B2937] text-gray-800 dark:text-[#F3F6F8] transition-all cursor-pointer"
              >
                ← Return to Overview (All Fires)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Burn Footprint</div>
                <div className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
                  {currentFireStats.hectares.toLocaleString()} ha
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
                  ({currentFireStats.acres.toLocaleString()} acres)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Perimeter Length</div>
                <div className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
                  {currentFireStats.perimeterKm} km
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Vector Perimeter</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Mean dNBR</div>
                <div className="text-xl font-extrabold text-[#F28C45] mt-1 font-mono">
                  {currentFireStats.meanDnbr}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
                  Max: {currentFireStats.maxDnbr}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Total Canopy Loss</div>
                <div className="text-xl font-extrabold text-[#F06468] mt-1 font-mono">
                  {currentFireStats.canopyLossPct}%
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Stand Replacement</div>
              </div>
            </div>

            {/* Key Field Findings */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796] font-semibold">
                Key Spatial &amp; Geomorphic Findings
              </h4>
              <div className="space-y-2">
                {currentFireStats.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-[#172330] border border-gray-200/60 dark:border-[rgba(160,180,195,0.12)] text-xs text-[#18191D] dark:text-[#F3F6F8] flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-[#36C5D9] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

      {/* Mission Acquisition Timeline Section */}
      <section className="bg-white dark:bg-[#111C28] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">
              <span>TEMPORAL OBSERVATION ORBIT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C5D9]"></span>
              <span className="text-[#626873] dark:text-[#AAB5C2]">SUMMER / FALL 2026 CAMPAIGN</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1">Acquisition Timeline</h3>
          </div>

          <div className="flex items-center gap-3 bg-[#ECEEF2] dark:bg-[#172330] p-1 rounded-full self-start md:self-auto text-xs font-mono">
            <span className="px-3 py-1 bg-white dark:bg-[#111C28] rounded-full text-[#18191D] dark:text-[#F3F6F8] shadow-2xs font-semibold">
              &lt;15% CLOUD COVER FILTER
            </span>
            <span className="text-gray-500 dark:text-[#AAB5C2] px-2 font-medium">60 TOTAL PASSES</span>
          </div>
        </div>

        {/* 3 Temporal Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Node 1: Pre-Fire Baseline */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#172330] border border-gray-200/70 dark:border-[rgba(160,180,195,0.12)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-[#1B2937] text-[#36C5D9] font-bold font-mono text-xs flex items-center justify-center">
                  01
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-[#788796] block">
                    BASELINE REGISTRATION
                  </span>
                  <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Pre-Fire Period</h4>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#18191D] dark:text-[#36C5D9]">
                15 July – 07 August 2026
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Initial BOA radiometry collection. 20 cloud-free Sentinel-2 MSI tiles establishing
                pre-ignition NDVI/NBR vegetative moisture indexes across dense Redwood/Chaparral
                drainages.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>Sentinel-2 MSI</span>
              <span className="text-emerald-600 dark:text-[#43C99A] font-semibold">20 Scenes Calibrated</span>
            </div>
          </div>

          {/* Node 2: Fire Propagation & Containment */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#172330] border border-gray-200/70 dark:border-[rgba(160,180,195,0.12)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#1B2937] text-[#F28C45] font-bold font-mono text-xs flex items-center justify-center">
                  02
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-[#788796] block">
                    ACTIVE IGNITION ORBIT
                  </span>
                  <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Fire Period</h4>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#F28C45]">
                08 August – 05 September 2026
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Dual fire propagation. NISAR L-band SAR backscatter acquisition penetrated dense
                marine smoke plumes, revealing sub-canopy thermal progression along coastal ridges.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>NISAR SAR (L-Band)</span>
              <span className="text-[#F28C45] font-semibold">Active Run Tracking</span>
            </div>
          </div>

          {/* Node 3: Immediate Post-Fire Assessment */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#172330] border border-gray-200/70 dark:border-[rgba(160,180,195,0.12)] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-[#1B2937] text-[#6599E8] font-bold font-mono text-xs flex items-center justify-center">
                  03
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-[#788796] block">
                    POST-FIRE RADIOMETRY
                  </span>
                  <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Post-Fire Period</h4>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#18191D] dark:text-[#6599E8]">
                06 September – 30 October 2026
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                34 clean post-fire passes ingested. Differential dNBR computation and radar
                depolarization delta calculated across all 11 watershed basins.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>S2 + NISAR Fusion</span>
              <span className="text-[#6599E8] font-semibold">34 Scenes Ingested</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
