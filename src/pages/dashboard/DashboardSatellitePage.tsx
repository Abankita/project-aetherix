import React, { useState } from 'react';
import { ComparisonSlider } from '@/components/maps/ComparisonSlider';
import { StatisticsService } from '@/services/statisticsService';
import {
  Satellite,
  Radio,
  Sliders,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';

export const DashboardSatellitePage: React.FC = () => {
  const [analysisMode, setAnalysisMode] = useState<'optical' | 'radar' | 'combined'>('combined');
  const [polarization, setPolarization] = useState<'VV' | 'VH'>('VH');
  const [activeLayer, setActiveLayer] = useState<'dnbr' | 'sar' | 'agreement'>('dnbr');

  const concordanceSummary = {
    highConcordancePct: 74.1,
    opticalOnlyPct: 14.3,
    radarOnlyPct: 11.6,
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & 3-Mode Segmented Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#172330] border border-blue-200 dark:border-[rgba(160,180,195,0.14)] text-[#6599E8] dark:text-[#36C5D9] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <Satellite className="w-3.5 h-3.5" />
            Cross-Sensor Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Satellite Intelligence &amp; Change Analysis
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Interrogate pre- and post-fire observations independently across optical MSI bands and
            NISAR L-band SAR backscatter. Evaluate spatial concordance and surface penetration
            disparities across Big Sur catchments.
          </p>
        </div>

        {/* Primary 3 Analysis Modes (OPTICAL | RADAR | COMBINED) */}
        <div className="flex items-center p-1.5 rounded-full bg-[#ECEEF2] dark:bg-[#111C28] border border-gray-200/60 dark:border-[rgba(160,180,195,0.14)] shadow-inner self-start lg:self-auto">
          <button
            onClick={() => setAnalysisMode('optical')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              analysisMode === 'optical'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#6599E8] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-[#6599E8] pointer-events-none" />
            <span className="pointer-events-none">OPTICAL</span>
          </button>

          <button
            onClick={() => setAnalysisMode('radar')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              analysisMode === 'radar'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#A48DEB] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#A48DEB] pointer-events-none" />
            <span className="pointer-events-none">RADAR</span>
          </button>

          <button
            onClick={() => setAnalysisMode('combined')}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              analysisMode === 'combined'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#36C5D9] shadow-sm'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F28C45] pointer-events-none" />
            <span className="pointer-events-none">COMBINED</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: OPTICAL (Sentinel-2)                                              */}
      {/* ========================================================================= */}
      {analysisMode === 'optical' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#111C28] border border-blue-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#065EA1] dark:text-[#6599E8]">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase">Sensor Payload:</span>
              <span>ESA Copernicus Sentinel-2 MSI (Bands 8 &amp; 12)</span>
            </div>
            <div className="flex items-center gap-3 text-[#18191D] dark:text-[#AAB5C2]">
              <span>NBR = (B8 − B12) / (B8 + B12)</span>
              <span>·</span>
              <span>dNBR = NBR_pre − NBR_post</span>
            </div>
          </div>

          {/* Interactive Before & After Comparison Slider */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#6599E8]" />
                <span>Pre vs. Post Fire Observation (Comparison Slider)</span>
              </h3>
              <span className="text-xs font-mono text-gray-500 dark:text-[#788796] hidden sm:block">
                Drag slider or use Arrow Keys
              </span>
            </div>

            <ComparisonSlider
              beforeLabel="SENTINEL-2 PRE-FIRE (NBR)"
              afterLabel="SENTINEL-2 POST-FIRE (dNBR)"
              isRasterConnected={false}
            />
          </section>

          {/* Optical Severity Classification Thresholds */}
          <section className="p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              USGS Differential NBR Standard Severity Thresholds
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#F06470] font-bold">High Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">dNBR &gt; +0.440</div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">Complete canopy mortality</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#F49A48] font-bold">Moderate Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">+0.270 to +0.440</div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">Sub-canopy scorch / char</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#E9B75C] font-bold">Low Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">+0.100 to +0.270</div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">Understory ground fire</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#43C99A] font-bold">Unburned / Regrowth</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">&lt; +0.100</div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">No detected loss / foliage intact</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: RADAR (NISAR L-Band)                                              */}
      {/* ========================================================================= */}
      {analysisMode === 'radar' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-[#111C28] border border-purple-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#A48DEB]">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase">Sensor Payload:</span>
              <span className="text-[#18191D] dark:text-[#F3F6F8]">NASA/ISRO NISAR L-Band Radar Backscatter (24 cm Wavelength)</span>
            </div>
            <div className="flex items-center gap-3 text-[#626873] dark:text-[#AAB5C2]">
              <span>GCOV Radiometrically Calibrated Backscatter (γ0 dB)</span>
            </div>
          </div>

          {/* Polarization Toggle Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-[#111C28] rounded-2xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-[#858B95] dark:text-[#788796] font-semibold">
                POLARIZATION CHANNEL:
              </span>
              <button
                onClick={() => setPolarization('VH')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'VH'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span className="pointer-events-none">VH (Volume Cross-Pol)</span>
              </button>
              <button
                onClick={() => setPolarization('VV')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'VV'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span className="pointer-events-none">VV (Surface Co-Pol)</span>
              </button>
            </div>

            <span className="text-xs font-mono text-gray-500 dark:text-[#788796]">
              {polarization === 'VH'
                ? 'Volume scattering sensitive to multi-stem crown destruction'
                : 'Direct surface scattering sensitive to soil moisture and bare rock exposure'}
            </span>
          </div>

          {/* Comparison Slider for Radar Delta */}
          <section className="space-y-3">
            <ComparisonSlider
              beforeLabel={`NISAR PRE-FIRE ${polarization} (dB)`}
              afterLabel={`NISAR POST-FIRE ${polarization} (Δσ0 dB)`}
              isRasterConnected={false}
            />
          </section>

          {/* NISAR Mechanics Explainer */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Why L-Band Penetration Matters in Big Sur
              </h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Optical sensors (Sentinel-2) measure top-of-canopy leaf reflectance. Once leaves
                char or drop, optical differencing saturates. In contrast, NISAR's 24 cm wavelength
                penetrates coastal fog and scorch mantles, interacting directly with structural
                branches and trunk mass.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Backscatter Reduction Metric (Δσ0)
              </h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Healthy redwood/oak canopies create strong volumetric cross-pol depolarization (VH ~
                -14 dB). Post-fire canopy stripping drops backscatter by 4 to 8 dB due to loss of
                diffuse volumetric scatterers, providing an unambiguous metric of severe stand
                damage.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: COMBINED (Optical + Radar Synergy & Concordance)                   */}
      {/* ========================================================================= */}
      {analysisMode === 'combined' && (
        <div className="space-y-6">
          {/* Concordance Header */}
          <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-[#111C28] border border-teal-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#36C5D9] text-[#0B1118] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">
                  Dual-Sensor Concordance &amp; Discrepancy Matrix
                </h3>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
                  Evaluating areas where optical burn indices (dNBR) agree or diverge from radar
                  structural loss (Δσ0).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-[#43C99A] bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                68.4% OVERALL CONCORDANCE
              </span>
            </div>
          </div>

          {/* 3 Concordance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-600 dark:text-[#43C99A] font-bold">
                  High Concordance
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {concordanceSummary.highConcordancePct}%
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Both Sensors Detect High Severity</h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Both optical dNBR and SAR Δσ0 reflect catastrophic stand replacement. Typical in
                steep south-facing chaparral and exposed canyon crowns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#F28C45] font-bold">
                  Optical Over-Estimate
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {concordanceSummary.opticalOnlyPct}%
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">High dNBR, Low Radar Delta</h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Occurs where fast understory surface fires blackened ground ash, showing strong
                optical char while deep redwood branch and trunk structure remained intact.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#A48DEB] font-bold">
                  Radar Only Loss
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {concordanceSummary.radarOnlyPct}%
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">High Radar Delta, Low dNBR</h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Canopy moisture desiccation and structural branch collapse under heavy smoke or in
                shadowed north-facing drainages where optical SWIR response was degraded.
              </p>
            </div>
          </div>

          {/* Detailed Concordance Matrix Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-5">
            <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Areas of Sensor Agreement &amp; Disagreement
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-gray-50 dark:bg-[#172330] text-gray-500 dark:text-[#AAB5C2] border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
                  <tr>
                    <th className="py-3 px-4">VEGETATIVE ECOSYSTEM</th>
                    <th className="py-3 px-4">OPTICAL SEVERITY (dNBR)</th>
                    <th className="py-3 px-4">RADAR DELTA (Δσ0 VH)</th>
                    <th className="py-3 px-4">CONCORDANCE LEVEL</th>
                    <th className="py-3 px-4">GEOMORPHIC INTERPRETATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#18191D] dark:text-[#F3F6F8]">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Chaparral / Coastal Sage</td>
                    <td className="py-3.5 px-4 text-[#F06468] font-bold">High (+0.52)</td>
                    <td className="py-3.5 px-4 text-[#F06468] font-bold">Severe (-6.8 dB)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#43C99A] font-semibold">
                        High (92%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">Total consumption of shrub layer</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Redwood Canyon Bottoms</td>
                    <td className="py-3.5 px-4 text-[#F28C45] font-bold">Moderate (+0.38)</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-[#43C99A] font-bold">Low (-1.8 dB)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#E9B75C] font-semibold">
                        Discrepancy (48%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">Ground fire only; trunks survived</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Mixed Oak / Madrone Woodland</td>
                    <td className="py-3.5 px-4 text-[#F06468] font-bold">High (+0.48)</td>
                    <td className="py-3.5 px-4 text-[#F28C45] font-bold">Moderate (-4.2 dB)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#43C99A] font-semibold">
                        Moderate (74%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">Canopy scorch with partial limb survival</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">North-Facing Shadowed Slopes</td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 font-bold">Low (+0.18)</td>
                    <td className="py-3.5 px-4 text-[#F28C45] font-bold">Moderate (-3.9 dB)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-[#A48DEB] font-semibold">
                        Radar Advantage
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">Radar unaffected by topographic shadow</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
