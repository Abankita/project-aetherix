import React, { useState } from 'react';
import { ComparisonSlider } from '@/components/maps/ComparisonSlider';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import {
  Satellite,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Calendar,
  Eye,
  Info,
  CheckCircle,
} from 'lucide-react';

export const DashboardSatellitePage: React.FC = () => {
  // Primary top-level comparison mode: 'cross-sensor' (default) | 'temporal'
  const [comparisonMode, setComparisonMode] = useState<'temporal' | 'cross-sensor'>('cross-sensor');

  // Sub-filter mode for Cross-Sensor view: 'combined' (default) | 'optical' | 'radar'
  const [analysisMode, setAnalysisMode] = useState<'optical' | 'radar' | 'combined'>('combined');

  // Temporal mode layer: 'pre-nbr' | 'post-nbr' | 'dnbr'
  const [temporalLayer, setTemporalLayer] = useState<'pre-nbr' | 'post-nbr' | 'dnbr'>('dnbr');

  // Optical side layer (Cross-sensor left map)
  const [opticalLayer, setOpticalLayer] = useState<'pre-optical' | 'post-optical' | 'dnbr'>('dnbr');

  // Radar side layer (Cross-sensor right map)
  const [radarLayer, setRadarLayer] = useState<'pre-sar' | 'post-sar' | 'sar-change'>('sar-change');

  // Polarization channel: 'VH' (Volume) | 'VV' (Surface)
  const [polarization, setPolarization] = useState<'VV' | 'VH'>('VH');

  const concordanceSummary = {
    highConcordancePct: 74.1,
    opticalOnlyPct: 14.3,
    radarOnlyPct: 11.6,
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Two Primary Comparison Modes */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#172330] border border-blue-200 dark:border-[rgba(160,180,195,0.14)] text-[#6599E8] dark:text-[#36C5D9] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <Satellite className="w-3.5 h-3.5" />
            Dual-Sensor Earth Observation · Big Sur
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Satellite Intelligence &amp; Change Analysis
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Interrogate pre- and post-fire observations independently across optical MSI bands and
            NISAR L-band SAR backscatter. Evaluate spatial concordance and canopy penetration
            disparities across Big Sur catchments.
          </p>
        </div>

        {/* PRIMARY 2 MODES: TEMPORAL COMPARISON | CROSS-SENSOR COMPARISON */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#ECEEF2] dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-inner self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setComparisonMode('temporal')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              comparisonMode === 'temporal'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#36C5D9] shadow-xs'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#498ACF]" />
            <span>TEMPORAL COMPARISON</span>
          </button>

          <button
            type="button"
            onClick={() => setComparisonMode('cross-sensor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              comparisonMode === 'cross-sensor'
                ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#36C5D9] shadow-xs'
                : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F28C45]" />
            <span>CROSS-SENSOR COMPARISON</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXPERIENCE 1: TEMPORAL COMPARISON — BEFORE VS AFTER FIRE                  */}
      {/* ========================================================================= */}
      {comparisonMode === 'temporal' && (
        <div className="space-y-6">
          {/* Scientific Metadata & Radiometry Formula Pill */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#111C28] border border-blue-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#065EA1] dark:text-[#6599E8]">
            <div className="flex items-center gap-2">
              <span className="font-semibold uppercase">Sensor Observation:</span>
              <span>ESA Copernicus Sentinel-2 MSI (NIR B8 @ 842nm &amp; SWIR B12 @ 2190nm)</span>
            </div>
            <div className="flex items-center gap-3 text-[#18191D] dark:text-[#AAB5C2]">
              <span>NBR = (B8 − B12) / (B8 + B12)</span>
              <span>·</span>
              <span>dNBR = NBR_pre − NBR_post</span>
            </div>
          </div>

          {/* Temporal Draggable Divider Interactive Map */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#498ACF]" />
                <span>Pre vs. Post Fire Observation (Comparison Slider)</span>
              </h3>
              <span className="text-xs font-mono text-gray-500 dark:text-[#788796] hidden sm:block">
                Drag slider or use Arrow Keys
              </span>
            </div>

            <ComparisonSlider
              beforeLabel="SENTINEL-2 PRE-FIRE (NBR)"
              afterLabel={
                temporalLayer === 'dnbr'
                  ? 'SENTINEL-2 POST-FIRE (dNBR)'
                  : 'SENTINEL-2 POST-FIRE (NBR)'
              }
              beforeDate="2024-06-14"
              afterDate="2024-08-28"
              activeLayer={temporalLayer}
              onLayerChange={setTemporalLayer}
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
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  dNBR &gt; +0.440
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  Complete canopy mortality
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#F49A48] font-bold">Moderate Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  +0.270 to +0.440
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  Sub-canopy scorch / char
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#E9B75C] font-bold">Low Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  +0.100 to +0.270
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  Understory ground fire
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#43C99A] font-bold">
                  Unburned / Regrowth
                </span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  &lt; +0.100
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  No detected loss / foliage intact
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPERIENCE 2: CROSS-SENSOR COMPARISON — OPTICAL VS RADAR                   */}
      {/* ========================================================================= */}
      {comparisonMode === 'cross-sensor' && (
        <div className="space-y-6">
          {/* Sub-Mode Selector Toolbar: COMBINED | OPTICAL | RADAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-[#858B95] dark:text-[#788796] font-semibold">
                Investigation View:
              </span>
              <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#172330] border border-gray-200/60 dark:border-[rgba(160,180,195,0.12)]">
                <button
                  type="button"
                  onClick={() => setAnalysisMode('combined')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    analysisMode === 'combined'
                      ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#36C5D9] shadow-2xs'
                      : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F28C45]" />
                  <span>COMBINED</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode('optical')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    analysisMode === 'optical'
                      ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#6599E8] shadow-2xs'
                      : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
                  }`}
                >
                  <Satellite className="w-3.5 h-3.5 text-[#6599E8]" />
                  <span>OPTICAL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalysisMode('radar')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    analysisMode === 'radar'
                      ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#A48DEB] shadow-2xs'
                      : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-[#A48DEB]" />
                  <span>RADAR</span>
                </button>
              </div>
            </div>

            {/* Polarization Channel Toggle (VH / VV) */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase text-[#858B95] dark:text-[#788796] font-semibold">
                POLARIZATION CHANNEL:
              </span>
              <button
                type="button"
                onClick={() => setPolarization('VH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'VH'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span>VH (Volume Cross-Pol)</span>
              </button>
              <button
                type="button"
                onClick={() => setPolarization('VV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'VV'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span>VV (Surface Co-Pol)</span>
              </button>
            </div>
          </div>

          {/* Optical Mode Specific Banner when in Optical Sub-Mode */}
          {analysisMode === 'optical' && (
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-[#111C28] border border-blue-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#065EA1] dark:text-[#6599E8]">
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">Sensor Observation:</span>
                <span>ESA Copernicus Sentinel-2 MSI (Bands 8 &amp; 12)</span>
              </div>
              <div className="flex items-center gap-3 text-[#18191D] dark:text-[#AAB5C2]">
                <span>NBR = (B8 − B12) / (B8 + B12)</span>
                <span>·</span>
                <span>dNBR = NBR_pre − NBR_post</span>
              </div>
            </div>
          )}

          {/* Radar Mode Specific Banner when in Radar Sub-Mode */}
          {analysisMode === 'radar' && (
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-[#111C28] border border-purple-200/80 dark:border-[rgba(160,180,195,0.14)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#A48DEB]">
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">Sensor Payload:</span>
                <span className="text-[#18191D] dark:text-[#F3F6F8]">
                  NASA/ISRO NISAR L-Band Radar Backscatter (24 cm Wavelength)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#626873] dark:text-[#AAB5C2]">
                <span>GCOV Radiometrically Calibrated Backscatter (γ0 dB)</span>
              </div>
            </div>
          )}

          {/* SIDE-BY-SIDE SYNCHRONIZED MAP VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT MAP: SENTINEL-2 OPTICAL */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[rgba(160,180,195,0.1)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6599E8]" />
                    <h3 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono">
                      Sentinel-2 Optical Radiometry
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#858B95] dark:text-[#788796]">
                    Acquisition: 2024-06-14 (Pre) · 2024-08-28 (Post)
                  </span>
                </div>

                {/* Layer Selector Left */}
                <select
                  value={opticalLayer}
                  onChange={(e) => setOpticalLayer(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-gray-100 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-[rgba(160,180,195,0.14)]"
                  aria-label="Sentinel-2 Optical Layer"
                >
                  <option value="dnbr">dNBR (Burn Severity)</option>
                  <option value="pre-optical">Pre-Fire Optical Observation</option>
                  <option value="post-optical">Post-Fire Optical Observation</option>
                </select>
              </div>

              {/* Map Canvas */}
              <InteractiveMap height="380px" showFires={true} showWatersheds={true} />

              <div className="flex items-center justify-between text-xs font-mono text-[#858B95] dark:text-[#788796] pt-1">
                <span>Band: Multi-Spectral SWIR/NIR</span>
                <span>Spatial: 10m Ground Resolution</span>
              </div>
            </div>

            {/* RIGHT MAP: NISAR L-BAND RADAR */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[rgba(160,180,195,0.1)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A48DEB]" />
                    <h3 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono">
                      NISAR L-Band Backscatter
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#858B95] dark:text-[#788796]">
                    Polarization: {polarization} · Wavelength: 24cm (L-band)
                  </span>
                </div>

                {/* Layer Selector Right */}
                <select
                  value={radarLayer}
                  onChange={(e) => setRadarLayer(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-gray-100 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-[rgba(160,180,195,0.14)]"
                  aria-label="NISAR Radar Layer"
                >
                  <option value="sar-change">Radar Backscatter Change (Δσ0)</option>
                  <option value="pre-sar">Pre-Fire Backscatter ({polarization})</option>
                  <option value="post-sar">Post-Fire Backscatter ({polarization})</option>
                </select>
              </div>

              {/* Map Canvas */}
              <InteractiveMap height="380px" showFires={true} showWatersheds={true} />

              <div className="flex items-center justify-between text-xs font-mono text-[#858B95] dark:text-[#788796] pt-1">
                <span>Product: GCOV Calibrated γ0 dB</span>
                <span>Penetration: Canopy &amp; Sub-Surface</span>
              </div>
            </div>
          </div>

          {/* Concordance Interpretation & Dual-Sensor Summary */}
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
                74.1% OVERALL CONCORDANCE
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
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Both Sensors Detect High Severity
              </h4>
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
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                High dNBR, Low Radar Delta
              </h4>
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
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                High Radar Delta, Low dNBR
              </h4>
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
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">
                      Total consumption of shrub layer
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">Redwood Canyon Bottoms</td>
                    <td className="py-3.5 px-4 text-[#F28C45] font-bold">Moderate (+0.38)</td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-[#43C99A] font-bold">
                      Low (-1.8 dB)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-[#E9B75C] font-semibold">
                        Discrepancy (48%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">
                      Ground fire only; trunks survived
                    </td>
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
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">
                      Canopy scorch with partial limb survival
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold">North-Facing Shadowed Slopes</td>
                    <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400 font-bold">
                      Low (+0.18)
                    </td>
                    <td className="py-3.5 px-4 text-[#F28C45] font-bold">Moderate (-3.9 dB)</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-[#A48DEB] font-semibold">
                        Radar Advantage
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#626873] dark:text-[#AAB5C2]">
                      Radar unaffected by topographic shadow
                    </td>
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
