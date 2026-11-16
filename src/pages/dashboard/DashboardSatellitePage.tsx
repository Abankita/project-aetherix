import React, { useEffect, useState } from 'react';
import { ComparisonSlider } from '@/components/maps/ComparisonSlider';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { aetherixApi, FireSummary, RasterLayer } from '@/services/aetherixApi';
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
  const [fireId, setFireId] = useState<'timber' | 'plaskett'>('timber');
  const [processedLayers, setProcessedLayers] = useState<RasterLayer[]>([]);
  const [phaseObservations, setPhaseObservations] = useState<Record<string, unknown>[]>([]);
  const [fireSummary, setFireSummary] = useState<FireSummary | null>(null);
  useEffect(() => {
    let active = true;
    Promise.all([aetherixApi.layers(fireId), aetherixApi.timeseries(fireId), aetherixApi.summary(fireId)]).then(([layerData, timeData, summary]) => {
      if (active) { setProcessedLayers(layerData.layers); setPhaseObservations(timeData.observations); setFireSummary(summary); }
    }).catch(() => active && setProcessedLayers([]));
    return () => { active = false; };
  }, [fireId]);
  // Primary top-level comparison mode: 'cross-sensor' (default) | 'temporal'
  const [comparisonMode, setComparisonMode] = useState<'temporal' | 'cross-sensor'>('cross-sensor');

  // Sub-filter mode for Cross-Sensor view: 'combined' (default) | 'optical' | 'radar'
  const [analysisMode, setAnalysisMode] = useState<'optical' | 'radar' | 'combined'>('combined');

  // Temporal mode layer: 'pre-nbr' | 'post-nbr' | 'dnbr'
  const [temporalLayer, setTemporalLayer] = useState<'pre-nbr' | 'post-nbr' | 'dnbr'>('dnbr');

  // Optical side layer (Cross-sensor left map)
  const [opticalLayer, setOpticalLayer] = useState<'natural' | 'false' | 'NDVI' | 'NDMI' | 'NBR' | 'dnbr'>('dnbr');
  const [opticalPhase, setOpticalPhase] = useState<'pre' | 'during' | 'post'>('post');

  // Radar side layer (Cross-sensor right map)
  const [radarLayer, setRadarLayer] = useState<'pre-sar' | 'during-sar' | 'post-sar' | 'during-change' | 'sar-change' | 'pre-count' | 'during-count' | 'post-count'>('sar-change');

  // The processed package contains HH and HV gamma-zero backscatter products.
  const [polarization, setPolarization] = useState<'HH' | 'HV'>('HV');

  const getRaster = (role: 'optical' | 'radar') => {
    if (role === 'optical') {
      if (opticalLayer === 'dnbr') return processedLayers.find((layer) => layer.path.endsWith('/integrated/dnbr.tif')) || null;
      if (opticalLayer === 'natural' || opticalLayer === 'false') {
        const phase = `${opticalPhase}_fire_stack_20m.tif`;
        return processedLayers.find((layer) => layer.path.endsWith(`/sentinel2/stacks/${phase}`)) || null;
      }
      return processedLayers.find((layer) => layer.path.endsWith(`/sentinel2/bands/${opticalPhase}/${opticalLayer}.tif`)) || null;
    }
    if (radarLayer.endsWith('-count')) {
      const phase = radarLayer.replace('-count', '');
      return processedLayers.find((layer) => layer.path.endsWith(`/nisar/observation_counts/${polarization}_${phase}_count_20m.tif`)) || null;
    }
    if (radarLayer === 'during-change') return processedLayers.find((layer) => layer.path.endsWith(`/nisar/changes/${polarization}_during_minus_pre_20m_dB.tif`)) || null;
    if (radarLayer === 'sar-change') return processedLayers.find((layer) => layer.path.endsWith(`/nisar/changes/${polarization}_post_minus_pre_20m_dB.tif`)) || null;
    const phase = radarLayer === 'pre-sar' ? 'pre' : radarLayer === 'during-sar' ? 'during' : 'post';
    return processedLayers.find((layer) => layer.path.endsWith(`/nisar/composites/${polarization}_${phase}_20m_dB.tif`)) || null;
  };
  const selectedOpticalBands = opticalLayer === 'false' ? [4, 3, 2] : opticalLayer === 'natural' ? [3, 2, 1] : undefined;
  const phaseSummary = (source: string, layer: string, phase: string) => phaseObservations.find((row) => row.source === source && row.layer === layer && row.phase === phase);
  const beforeNBR = processedLayers.find((layer) => layer.path.endsWith('/sentinel2/bands/pre/NBR.tif'));
  const postNBR = processedLayers.find((layer) => layer.path.endsWith('/sentinel2/bands/post/NBR.tif'));
  const dNBR = processedLayers.find((layer) => layer.path.endsWith('/integrated/dnbr.tif'));
  const afterRaster = temporalLayer === 'pre-nbr' ? beforeNBR : temporalLayer === 'dnbr' ? dNBR : postNBR;
  const layerPhaseLabel = (source: string, layer: string, phase: string) => {
    const row = phaseSummary(source, layer, phase);
    return row ? `Mean ${Number(row.mean).toFixed(3)} ${String(row.units)} · ${Number(row.valid_pixels).toLocaleString()} valid px` : 'Phase summary unavailable';
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
      <div className="flex items-center gap-2 text-xs font-mono">
        <label htmlFor="satellite-fire" className="text-gray-500 dark:text-[#AAB5C2]">Study area</label>
        <select id="satellite-fire" value={fireId} onChange={(event) => setFireId(event.target.value as 'timber' | 'plaskett')} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-gray-700">
          <option value="timber">Timber Fire</option><option value="plaskett">Plaskett Fire</option>
        </select>
      </div>
      <p className="max-w-5xl text-sm leading-relaxed text-[#626873] dark:text-[#AAB5C2]">Use the layer menus to compare a phase or index. Image colors show the selected layer’s relative values; the pixel summaries report averages across available cells. NDVI and NDMI describe vegetation greenness and moisture response, dNBR describes optical change, and NISAR HH/HV describe radar backscatter. None of these means alone is a field-measured damage score.</p>

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
              beforeDate="Pre-fire phase; acquisition date not supplied"
              afterDate={temporalLayer === 'pre-nbr' ? 'Pre-fire phase' : temporalLayer === 'dnbr' ? 'Pre-fire NBR minus post-fire NBR' : 'Post-fire phase; acquisition date not supplied'}
              beforeRasterSrc={aetherixApi.previewUrl(fireId, beforeNBR)}
              afterRasterSrc={aetherixApi.previewUrl(fireId, afterRaster)}
              activeLayer={temporalLayer}
              onLayerChange={setTemporalLayer}
              isRasterConnected={Boolean(beforeNBR && afterRaster)}
            />
          </section>

          {/* Reference thresholds; these classes are not applied to this dataset */}
          <section className="p-6 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Reference dNBR Thresholds · Not Applied to These Results
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#F06470] font-bold">High Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  dNBR &gt; +0.440
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  Reference class only; not a field assessment
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)] space-y-1">
                <span className="text-xs font-mono text-[#F49A48] font-bold">Moderate Severity</span>
                <div className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  +0.270 to +0.440
                </div>
                <div className="text-[11px] text-[#626873] dark:text-[#AAB5C2]">
                  Reference class only; not field calibrated here
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
                onClick={() => setPolarization('HV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'HV'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span>HV (Cross-Pol)</span>
              </button>
              <button
                type="button"
                onClick={() => setPolarization('HH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  polarization === 'HH'
                    ? 'bg-[#A48DEB] text-white shadow-2xs font-semibold'
                    : 'bg-gray-100 dark:bg-[#172330] text-gray-600 dark:text-[#AAB5C2] hover:bg-gray-200'
                }`}
              >
                <span>HH (Co-Pol)</span>
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
                    Processing phase: {opticalPhase} · dates are not included in the package inventory
                  </span>
                </div>

                {/* Layer Selector Left */}
                <select
                  value={opticalLayer}
                  onChange={(e) => setOpticalLayer(e.target.value as any)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-gray-100 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-[rgba(160,180,195,0.14)]"
                  aria-label="Sentinel-2 Optical Layer"
                >
                  <option value="natural">Sentinel-2 Natural Colour (B4, B3, B2)</option>
                  <option value="false">Sentinel-2 False Colour (B8, B4, B3)</option>
                  <option value="NDVI">Sentinel-2 NDVI</option>
                  <option value="NDMI">Sentinel-2 NDMI</option>
                  <option value="NBR">Sentinel-2 NBR</option>
                  <option value="dnbr">Sentinel-2 dNBR</option>
                </select>
              </div>

              {/* Map Canvas */}
              <div className="flex items-center gap-2 text-xs font-mono"><label htmlFor="optical-phase">Composite phase</label><select id="optical-phase" value={opticalPhase} onChange={(event) => setOpticalPhase(event.target.value as 'pre'|'during'|'post')} className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8]"><option value="pre">Pre-fire</option><option value="during">During-fire window</option><option value="post">Post-fire</option></select></div>
              <InteractiveMap height="380px" selectedFireId={fireId} rasterLayer={getRaster('optical')} rasterBands={selectedOpticalBands} showFires={true} showWatersheds={true} />

              <div className="flex items-center justify-between text-xs font-mono text-[#858B95] dark:text-[#788796] pt-1">
                <span>{getRaster('optical')?.name || 'Sentinel-2 optical layer'} · {getRaster('optical')?.units || 'unitless'}</span>
                <span>Display {getRaster('optical')?.visualization.min ?? '—'}–{getRaster('optical')?.visualization.max ?? '—'} · {getRaster('optical')?.resolution?.[0] || 20} m</span>
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
                  <option value="sar-change">Post minus pre backscatter change ({polarization})</option>
                  <option value="during-change">During minus pre backscatter change ({polarization})</option>
                  <option value="pre-sar">Pre-fire backscatter ({polarization})</option>
                  <option value="during-sar">During-fire-window backscatter ({polarization})</option>
                  <option value="post-sar">Post-fire backscatter ({polarization})</option>
                  <option value="pre-count">Pre-fire {polarization} observation count</option>
                  <option value="during-count">During-fire {polarization} observation count</option>
                  <option value="post-count">Post-fire {polarization} observation count</option>
                </select>
              </div>

              {/* Map Canvas */}
              <InteractiveMap height="380px" selectedFireId={fireId} rasterLayer={getRaster('radar')} showFires={true} showWatersheds={true} />

              <div className="flex items-center justify-between text-xs font-mono text-[#858B95] dark:text-[#788796] pt-1">
                <span>{getRaster('radar')?.name || 'NISAR backscatter'} · gamma-zero dB</span>
                <span>{getRaster('radar')?.units === 'count' ? `Observation counts · display ${getRaster('radar')?.visualization.min ?? '—'}–${getRaster('radar')?.visualization.max ?? '—'}` : `Provisional NISAR · display ${getRaster('radar')?.visualization.min ?? '—'}–${getRaster('radar')?.visualization.max ?? '—'} dB`}</span>
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
                  Processed Optical and Radar Summaries
                </h3>
                <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">
                  Evaluating areas where optical burn indices (dNBR) agree or diverge from radar
                  structural loss (Δσ0).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-[#43C99A] bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                {fireSummary ? `${fireSummary.aoi_pixels.toLocaleString()} AOI PIXELS · ${fireSummary.common_valid_score_percent.toFixed(2)}% VALID COVERAGE` : 'LOADING PROCESSED SUMMARY'}
              </span>
            </div>
          </div>

          {/* 3 Concordance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-600 dark:text-[#43C99A] font-bold">
                  Mean dNBR
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {fireSummary?.dNBR.mean.toFixed(3) ?? '—'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Optical spectral change
              </h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                The mean is the average dNBR value across valid cells in this fire grid. It describes spectral change and is not a calibrated damage or severity percentage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#F28C45] font-bold">
                  Mean NDVI Loss
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {fireSummary?.NDVI_loss.mean.toFixed(3) ?? '—'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Vegetation-condition indicator
              </h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                NDVI loss summarizes a change in vegetation index between the supplied phases. It is an index difference, not a direct count of dead plants or canopy cover.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#A48DEB] font-bold">
                  Mean NISAR HH / HV Change
                </span>
                <span className="text-lg font-bold font-mono text-[#18191D] dark:text-[#F3F6F8]">
                  {fireSummary ? `${fireSummary.NISAR_HH_change.mean.toFixed(2)} / ${fireSummary.NISAR_HV_change.mean.toFixed(2)} dB` : '—'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">
                Provisional gamma-zero backscatter
              </h4>
              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                HH and HV are radar polarizations. Their change is in decibels (dB); values can also shift with moisture, surface roughness, vegetation and viewing geometry. NISAR inputs are marked provisional in the package.
              </p>
            </div>
          </div>

          {/* Detailed Concordance Matrix Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-5">
            <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Available Optical and NISAR Phase Statistics
            </h4>
            <p className="text-sm leading-relaxed text-[#626873] dark:text-[#AAB5C2]">In the phase table, “mean” is the average reported raster value and “valid pixels” is the number of cells contributing to it. Observation counts show how many radar acquisitions contributed to a cell; higher counts mean more observations, not stronger fire impact. Dates are not available in the supplied phase summary.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-gray-50 dark:bg-[#172330] text-gray-500 dark:text-[#AAB5C2] border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
                  <tr>
                    <th className="py-3 px-4">SOURCE</th>
                    <th className="py-3 px-4">INDICATOR</th>
                    <th className="py-3 px-4">RADAR DELTA (Δσ0 VH)</th>
                    <th className="py-3 px-4">PHASE / UNIT</th>
                    <th className="py-3 px-4">MEAN / MEDIAN / VALID PIXELS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-[#18191D] dark:text-[#F3F6F8]">
                  {phaseObservations.map((row, index) => (
                    <tr key={`${String(row.source)}-${String(row.layer)}-${String(row.phase)}-${index}`}>
                      <td className="py-3.5 px-4 font-semibold">{String(row.source)}{row.provisional ? ' · provisional' : ''}</td>
                      <td className="py-3.5 px-4">{String(row.layer)} ({String(row.units)})</td>
                      <td className="py-3.5 px-4">{String(row.phase)}</td>
                      <td className="py-3.5 px-4 font-bold">{Number(row.mean).toFixed(3)} / {Number(row.median).toFixed(3)} / {Number(row.valid_pixels).toLocaleString()}</td>
                      <td className="py-3.5 px-4">{row.mean_observation_count == null ? '—' : Number(row.mean_observation_count).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
