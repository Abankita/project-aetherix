import React, { useState } from 'react';
import { StatisticsService } from '@/services/statisticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  FileText,
  Sparkles,
  Flame,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const DashboardResultsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'combined' | 'comparative' | 'limitations'>('combined');
  const { isDark } = useTheme();

  const concordance = StatisticsService.getSensorConcordanceStats();
  const fuelComparisons = StatisticsService.getFuelDynamicComparisons();
  const limitations = StatisticsService.getScientificLimitations();
  const watersheds = StatisticsService.getWatershedRankings().slice(0, 5);

  const pieData = concordance.map((c: { category: string; hectares: number; color: string }) => ({
    name: c.category,
    value: c.hectares,
    color: c.color,
  }));

  const watershedChartData = watersheds.map((w) => ({
    name: w.name.split(' ')[0],
    Priority: w.monitoringPriorityScore,
    SteepSlope: w.steepTerrainPct,
    MeanDNBR: Math.round(w.meanDnbr * 100),
  }));

  const gridStroke = isDark ? 'rgba(160, 180, 195, 0.14)' : '#E5E7EB';
  const axisTick = { fontSize: 11, fontFamily: 'JetBrains Mono', fill: isDark ? '#AAB5C2' : '#626873' };
  const tooltipStyle = {
    backgroundColor: isDark ? '#172330' : '#121418',
    borderColor: isDark ? 'rgba(160, 180, 195, 0.2)' : '#333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    fontFamily: 'JetBrains Mono',
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header and 3 Main Sub-Navigation Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#172330] border border-blue-200 dark:border-[rgba(160,180,195,0.14)] text-[#36C5D9] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <FileText className="w-3.5 h-3.5" />
            Empirical Results &amp; Synthesis Report
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Synthesis of Post-Wildfire Landscape Dynamics
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Quantitative analysis of optical-radar sensor concordance, fuel dynamics across the
            Timber and Plaskett fires, watershed vulnerability rankings, and explicit scientific
            limitations.
          </p>
        </div>

        {/* Tab Switcher: COMBINED | COMPARATIVE | LIMITATIONS */}
        <div className="flex items-center p-1.5 rounded-full bg-[#ECEEF2] dark:bg-[#111C28] border border-gray-200/60 dark:border-[rgba(160,180,195,0.14)] shadow-inner self-start lg:self-auto">
          <button
            onClick={() => setActiveTab('combined')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'combined'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#36C5D9] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#36C5D9]" />
            <span>Combined Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'comparative'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F28C45] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F28C45]" />
            <span>Comparative Dynamics</span>
          </button>

          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'limitations'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F06468] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#F06468]" />
            <span>Scientific Limitations</span>
          </button>
        </div>
      </div>

      {/* 4 Quantitative Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
          <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Evaluated Footprint</div>
          <div className="text-2xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] font-mono mt-1">23,310 ha</div>
          <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Big Sur Study Area</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
          <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Monitored Catchments</div>
          <div className="text-2xl font-extrabold text-[#36C5D9] font-mono mt-1">11 HUC-12</div>
          <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">68,490 ha Total Basins</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
          <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Calibrated Scenes</div>
          <div className="text-2xl font-extrabold text-[#6599E8] font-mono mt-1">54 Passes</div>
          <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">20 Pre- / 34 Post-Fire</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
          <div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">Overall Concordance</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-[#43C99A] font-mono mt-1">68.4%</div>
          <div className="text-[10px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Optical vs. Radar Coincidence</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMBINED SYNTHESIS & SENSOR CONCORDANCE                            */}
      {/* ========================================================================= */}
      {activeTab === 'combined' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart: Concordance Breakdown */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">
                  Sensor Concordance Classification
                </h3>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
                  Optical dNBR vs Radar SAR Overlap Across 23,310 ha
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {pieData.map((entry: { name: string; value: number; color: string }, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [`${val.toLocaleString()} ha`, 'Footprint']}
                      contentStyle={tooltipStyle}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {concordance.map((c: { category: string; percentage: number; color: string }, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-gray-700 dark:text-[#AAB5C2] truncate max-w-[200px]">{c.category}</span>
                    </div>
                    <span className="font-semibold text-[#18191D] dark:text-[#F3F6F8]">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Watershed Priority Bar Chart */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">
                  Catchment Monitoring Priority vs Geomorphic Slopes
                </h3>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
                  Top Coastal Basins: Composite Priority (0-100) vs Steep Slope (&gt;30°) %
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={watershedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis dataKey="name" tick={axisTick} stroke={isDark ? '#788796' : '#999'} />
                    <YAxis tick={axisTick} stroke={isDark ? '#788796' : '#999'} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: isDark ? '#AAB5C2' : '#626873' }} />
                    <Bar dataKey="Priority" fill="#36C5D9" radius={[4, 4, 0, 0]} name="Priority Score" />
                    <Bar dataKey="SteepSlope" fill="#A48DEB" radius={[4, 4, 0, 0]} name="Steep Slope (>30°) %" />
                    <Bar dataKey="MeanDNBR" fill="#F28C45" radius={[4, 4, 0, 0]} name="Mean dNBR (x100)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Key Spatial Findings Cards */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Core Conclusions From Sensor Synergy
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-[#172330] text-[#36C5D9] flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Chaparral Stand Replacement</h4>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Optical and L-band SAR show near-perfect agreement (&gt;90%) in pure chaparral
                  shrublands, confirming that high dNBR truly reflects full standing biomass
                  combustion.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#6599E8] flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Redwood Understory Survival</h4>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  In coastal redwood canyons, optical dNBR over-estimated damage by blackening of
                  surface needle litter. NISAR cross-polarization proved that over 65% of mature
                  redwood branch architecture survived.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-[#172330] text-[#F28C45] flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Post-Fire Hydro-Hazard Delineation</h4>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Combining burned upper-basin area with LiDAR slopes (&gt;30°) isolates 3 critical
                  canyons along Highway 1 where debris flows present acute risk to road
                  infrastructure.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPARATIVE DYNAMICS (Timber Fire vs. Plaskett Fire)               */}
      {/* ========================================================================= */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8]">
                Timber Fire vs. Plaskett Fire Dynamic Comparison
              </h3>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
                Contrasting burn severity profiles, vegetative mortality, and topographic
                susceptibility between the two wildfire complexes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timber Fire Column */}
              <div className="p-6 rounded-2xl bg-orange-50/50 dark:bg-[#172330] border border-orange-200/70 dark:border-[rgba(160,180,195,0.14)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-orange-200/60 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F49A48]"></span>
                    <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Timber Fire Complex</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F49A48]">5,800 ha</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-orange-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Mean dNBR:</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.timber.meanDnbr}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-orange-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">High Severity Ratio:</span>
                    <span className="font-bold text-[#F06470]">{fuelComparisons.timber.highSeverityPct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-orange-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Dominant Fuel:</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.timber.fuelType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-orange-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Steep Slope Area (&gt;30°):</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.timber.steepSlopePct}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-[#788796]">Mean Radar Backscatter Delta:</span>
                    <span className="font-bold text-[#29C9D2]">{fuelComparisons.timber.radarDeltaDb} dB</span>
                  </div>
                </div>
              </div>

              {/* Plaskett Fire Column */}
              <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-[#172330] border border-red-200/70 dark:border-[rgba(160,180,195,0.14)] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-red-200/60 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F06470]"></span>
                    <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Plaskett Fire Complex</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F06470]">7,420 ha</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-red-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Mean dNBR:</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.plaskett.meanDnbr}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-red-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">High Severity Ratio:</span>
                    <span className="font-bold text-[#F06470]">{fuelComparisons.plaskett.highSeverityPct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-red-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Dominant Fuel:</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.plaskett.fuelType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-red-100 dark:border-gray-800">
                    <span className="text-gray-500 dark:text-[#788796]">Steep Slope Area (&gt;30°):</span>
                    <span className="font-bold text-[#18191D] dark:text-[#F3F6F8]">{fuelComparisons.plaskett.steepSlopePct}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-[#788796]">Mean Radar Backscatter Delta:</span>
                    <span className="font-bold text-[#29C9D2]">{fuelComparisons.plaskett.radarDeltaDb} dB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SCIENTIFIC LIMITATIONS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'limitations' && (
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-[#172330] border border-amber-200 dark:border-[rgba(160,180,195,0.14)] text-amber-800 dark:text-[#E9B75C] text-xs font-mono font-medium uppercase mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Transparent Scientific Boundaries
              </div>
              <h3 className="text-2xl font-extrabold text-[#18191D] dark:text-[#F3F6F8]">
                Operational &amp; Methodological Limitations
              </h3>
              <p className="text-sm text-[#626873] dark:text-[#AAB5C2] mt-1">
                The after-fire intelligence pipeline operates under explicit remote sensing
                assumptions and constraints.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {limitations.map((item: { title: string; description: string }, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-50/70 dark:bg-[#172330] border border-gray-200/80 dark:border-[rgba(160,180,195,0.12)] space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F06468]">
                    <span>LIMITATION {idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">{item.title}</h4>
                  <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Conclusions */}
            <div className="p-6 rounded-2xl bg-teal-50/60 dark:bg-[#172330] border border-teal-200/80 dark:border-[rgba(160,180,195,0.14)] space-y-3">
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
                Conclusions
              </h4>
              <p className="text-xs text-[#18191D] dark:text-[#AAB5C2] leading-relaxed">
                Dual-sensor synergy combining Sentinel-2 optical radiometry and NISAR L-band SAR
                backscatter overcomes the fundamental optical saturation and smoke occlusion barriers
                inherent to single-sensor wildfire monitoring. In Big Sur's extreme coastal terrain,
                coupling these radiometric deltas with 3DEP LiDAR geomorphology provides a
                scientifically rigorous, repeatable baseline for post-fire catchment resilience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
