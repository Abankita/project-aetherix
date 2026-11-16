import React, { useEffect, useState } from 'react';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { aetherixApi, FireSummary, RasterLayer } from '@/services/aetherixApi';
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
  const [availableLayers, setAvailableLayers] = useState<RasterLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState('');
  const [rasterOpacity, setRasterOpacity] = useState(0.78);
  const [summaries, setSummaries] = useState<Partial<Record<'timber' | 'plaskett', FireSummary>>>({});
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([aetherixApi.summary('timber'), aetherixApi.summary('plaskett')])
      .then(([timber, plaskett]) => alive && setSummaries({ timber, plaskett }))
      .catch((error: Error) => alive && setDataError(`Processed summaries unavailable: ${error.message}`));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    if (selectedFire === 'all') {
      setAvailableLayers([]);
      setActiveLayerId('');
      return;
    }
    Promise.all([aetherixApi.layers(selectedFire), aetherixApi.summary(selectedFire)])
      .then(([layerResponse, summary]) => {
        if (!alive) return;
        setAvailableLayers(layerResponse.layers);
        setActiveLayerId((current) => current && layerResponse.layers.some((layer) => layer.id === current)
          ? current
          : layerResponse.layers.find((layer) => layer.id.endsWith('_screening_score'))?.id || layerResponse.layers.find((layer) => layer.id.endsWith('_dnbr'))?.id || '');
        setSummaries((current) => ({ ...current, [selectedFire]: summary }));
        setDataError('');
      })
      .catch((error: Error) => alive && setDataError(`Processed fire data unavailable: ${error.message}`));
    return () => { alive = false; };
  }, [selectedFire]);

  const selectedSummary = selectedFire === 'all' ? null : summaries[selectedFire];
  const activeRaster = availableLayers.find((layer) => layer.id === activeLayerId) || null;

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
        {selectedFire !== 'all' && availableLayers.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <label htmlFor="processed-layer" className="text-gray-500 dark:text-[#AAB5C2]">Processed raster</label>
            <select id="processed-layer" value={activeLayerId} onChange={(event) => setActiveLayerId(event.target.value)} className="max-w-64 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-gray-700">
              {availableLayers.map((layer) => <option key={layer.id} value={layer.id}>[{layer.category}] {layer.name}</option>)}
            </select>
            <input aria-label="Raster opacity" type="range" min="0" max="1" step="0.05" value={rasterOpacity} onChange={(event) => setRasterOpacity(Number(event.target.value))} />
          </div>
        )}
      </div>

      {dataError && <div role="status" className="text-xs text-amber-700 dark:text-amber-300">{dataError}. Start the backend to load the processed layers.</div>}

      {/* Main Interactive Map */}
      <InteractiveMap
        height="560px"
        selectedFireId={selectedFire}
        showWatersheds={showWatersheds}
        showSatellite={showSatelliteUnderlay}
        onSelectFire={(id) => setSelectedFire(id)}
        rasterLayer={activeRaster}
        rasterOpacity={rasterOpacity}
      />

      {selectedSummary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" aria-live="polite">
          {[
            ['AOI pixels', selectedSummary.aoi_pixels.toLocaleString()],
            ['Common valid pixels', selectedSummary.common_valid_score_pixels.toLocaleString()],
            ['Valid coverage', `${selectedSummary.common_valid_score_percent.toFixed(2)}%`],
            ['Mean screening index', selectedSummary.screening_score.mean.toFixed(2)],
          ].map(([label, value]) => <div key={label} className="p-4 rounded-xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-gray-800"><div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">{label}</div><div className="text-xl font-bold mt-1 font-mono text-[#18191D] dark:text-[#F3F6F8]">{value}</div></div>)}
        </div>
      )}

      {selectedSummary && <p className="max-w-4xl text-sm leading-relaxed text-[#626873] dark:text-[#AAB5C2]">These are map-grid counts for {selectedSummary.name}, not hectares. “Valid coverage” is the share of the fire study grid with usable values across the combined score inputs. Mean dNBR summarizes the optical change layer; it is not a percent burned or a field-verified severity class.</p>}
      {/* Dynamic Information Panel Based on Selection */}
      {selectedFire === 'all' ? (
        /* Summary Grid for Both Fires */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timber Fire Card */}
          <div
            onClick={() => setSelectedFire('timber')}
            className="p-6 rounded-2xl bg-white dark:bg-[#111C28] shadow-xs transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F28C45]"></span>
                <h3 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8] group-hover:text-[#F28C45] transition-colors">
                  Timber Fire
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#F28C45] bg-orange-50 dark:bg-[#172330] px-2.5 py-1 rounded-full">
                {summaries.timber ? `${summaries.timber.aoi_pixels.toLocaleString()} AOI PIXELS` : 'LOADING SUMMARY'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Ignition Date</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{summaries.timber?.ignition_date || 'Loading processing summary'}</span>
              </div>
              <div>
                  <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Valid data coverage</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{summaries.timber ? `${summaries.timber.common_valid_score_percent.toFixed(1)}%` : '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean dNBR</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-semibold">{summaries.timber?.dNBR.mean.toFixed(3) ?? '—'}</span>
              </div>
              <div>
                  <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean NDVI loss</span>
                <span className="text-[#F06468] font-semibold">{summaries.timber?.NDVI_loss.mean.toFixed(3) ?? '—'}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Processed dNBR statistics · not field-calibrated severity</span>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-[#F28C45]" style={{ width: `${summaries.timber ? Math.max(0, Math.min(100, summaries.timber.common_valid_score_percent)) : 0}%` }} title="Common valid data coverage" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-[#AAB5C2]">
                <span>Mean: {summaries.timber?.dNBR.mean.toFixed(3) ?? '—'}</span>
                <span>Median: {summaries.timber?.dNBR.median.toFixed(3) ?? '—'}</span>
                <span>Valid: {summaries.timber?.dNBR.valid_pixels.toLocaleString() ?? '—'} px</span>
              </div>
            </div>

            <div className="text-xs text-[#36C5D9] font-semibold flex items-center gap-1 pt-2">
              <span>Inspect isolated boundary &amp; radar telemetry →</span>
            </div>
          </div>

          {/* Plaskett Fire Card */}
          <div
            onClick={() => setSelectedFire('plaskett')}
            className="p-6 rounded-2xl bg-white dark:bg-[#111C28] shadow-xs transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F06468]"></span>
                <h3 className="font-bold text-lg text-[#18191D] dark:text-[#F3F6F8] group-hover:text-[#F06468] transition-colors">
                  Plaskett Fire
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#F06468] bg-red-50 dark:bg-[#172330] px-2.5 py-1 rounded-full">
                {summaries.plaskett ? `${summaries.plaskett.aoi_pixels.toLocaleString()} AOI PIXELS` : 'LOADING SUMMARY'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Ignition Date</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{summaries.plaskett?.ignition_date || 'Loading processing summary'}</span>
              </div>
              <div>
                  <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Valid data coverage</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-medium">{summaries.plaskett ? `${summaries.plaskett.common_valid_score_percent.toFixed(1)}%` : '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean dNBR</span>
                <span className="text-gray-800 dark:text-[#F3F6F8] font-semibold">{summaries.plaskett?.dNBR.mean.toFixed(3) ?? '—'}</span>
              </div>
              <div>
                  <span className="text-gray-400 dark:text-[#788796] block text-[10px]">Mean NDVI loss</span>
                <span className="text-[#F06468] font-semibold">{summaries.plaskett?.NDVI_loss.mean.toFixed(3) ?? '—'}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Processed dNBR statistics · not field-calibrated severity</span>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-[#F06468]" style={{ width: `${summaries.plaskett ? Math.max(0, Math.min(100, summaries.plaskett.common_valid_score_percent)) : 0}%` }} title="Common valid data coverage" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 dark:text-[#AAB5C2]">
                <span>Mean: {summaries.plaskett?.dNBR.mean.toFixed(3) ?? '—'}</span>
                <span>Median: {summaries.plaskett?.dNBR.median.toFixed(3) ?? '—'}</span>
                <span>Valid: {summaries.plaskett?.dNBR.valid_pixels.toLocaleString() ?? '—'} px</span>
              </div>
            </div>

            <div className="text-xs text-[#F06468] font-semibold flex items-center gap-1 pt-2">
              <span>Inspect isolated boundary &amp; radar telemetry →</span>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Selected Fire Inspection Panel */
        selectedSummary && (
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
                    {selectedSummary.name} Processed Data Summary
                  </h2>
                  <div className="text-xs font-mono text-[#626873] dark:text-[#AAB5C2]">
                    Processing ignition reference: {selectedSummary.ignition_date} · 20 m analysis grid, {selectedSummary.crs}
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
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">AOI Grid Pixels</div>
                <div className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
                  {selectedSummary.aoi_pixels.toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
                  Analysis grid {selectedSummary.grid_width} × {selectedSummary.grid_height}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Valid Pixels</div>
                <div className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1 font-mono">
                  {selectedSummary.common_valid_score_pixels.toLocaleString()}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">Common score coverage</div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Mean dNBR</div>
                <div className="text-xl font-extrabold text-[#F28C45] mt-1 font-mono">
                  {selectedSummary.dNBR.mean.toFixed(3)}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-[#AAB5C2] font-mono mt-0.5">
                  Median: {selectedSummary.dNBR.median.toFixed(3)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
                <div className="text-xs font-mono uppercase text-gray-400 dark:text-[#788796]">Common Valid Coverage</div>
                <div className="text-xl font-extrabold text-[#F06468] mt-1 font-mono">
                  {selectedSummary.common_valid_score_percent.toFixed(2)}%
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
                {[
                  `Mean relative screening index: ${selectedSummary.screening_score.mean.toFixed(2)} (not a probability).`,
                  `Mean NDVI loss: ${selectedSummary.NDVI_loss.mean.toFixed(3)}; mean NDMI loss: ${selectedSummary.NDMI_loss.mean.toFixed(3)}.`,
                  `Mean NISAR HH/HV change: ${selectedSummary.NISAR_HH_change.mean.toFixed(2)} / ${selectedSummary.NISAR_HV_change.mean.toFixed(2)} dB (provisional backscatter change).`,
                ].map((finding, idx) => (
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
              <span className="text-[#626873] dark:text-[#AAB5C2]">SUPPLIED PROCESSING PHASES</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#18191D] dark:text-[#F3F6F8] mt-1">Acquisition Timeline</h3>
          </div>

          <div className="flex items-center gap-3 bg-[#ECEEF2] dark:bg-[#172330] p-1 rounded-full self-start md:self-auto text-xs font-mono">
            <span className="px-3 py-1 bg-white dark:bg-[#111C28] rounded-full text-[#18191D] dark:text-[#F3F6F8] shadow-2xs font-semibold">
              PRE / DURING / POST COMPOSITES
            </span>
              <span className="text-gray-500 dark:text-[#AAB5C2] px-2 font-medium">DATES AND PASS COUNTS NOT PROVIDED</span>
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
                    PRE-FIRE PHASE
                  </span>
                  <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Pre-Fire Period</h4>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#18191D] dark:text-[#36C5D9]">
                Pre-fire composite; date not supplied
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                Sentinel-2 pre-fire layers provide a reference for comparing vegetation and burn-index values with later phases. The package does not list acquisition dates or scene totals.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>Sentinel-2 MSI</span>
              <span className="text-emerald-600 dark:text-[#43C99A] font-semibold">Pre-fire phase data</span>
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
                    DURING-FIRE PHASE
                  </span>
                  <h4 className="font-bold text-sm text-[#18191D] dark:text-[#F3F6F8]">Fire Period</h4>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-[#F28C45]">
              During-fire phase; date not supplied
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                The supplied optical and provisional radar summaries include a during-fire phase. These aggregates do not provide a dated fire-progression track.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>NISAR SAR (L-Band)</span>
              <span className="text-[#F28C45] font-semibold">Phase summary available</span>
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
                Post-fire phase; date not supplied
              </div>

              <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                The post-fire layers support optical and radar change comparisons. dNBR is a spectral indicator and has not been calibrated here against field severity measurements.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-mono text-gray-500 dark:text-[#788796] flex justify-between">
              <span>S2 + NISAR Fusion</span>
              <span className="text-[#6599E8] font-semibold">Post-fire phase data</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
