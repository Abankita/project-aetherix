import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import {
  Satellite,
  Radio,
  Mountain,
  Flame,
  ArrowRight,
  Info,
  Database,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { aetherixApi, FireSummary, RasterLayer } from '@/services/aetherixApi';

export const DashboardOverviewPage: React.FC = () => {
  const [selectedFire, setSelectedFire] = useState<'timber' | 'plaskett'>('timber');
  const [summary, setSummary] = useState<FireSummary | null>(null);
  const [layers, setLayers] = useState<RasterLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [observations, setObservations] = useState<Record<string, unknown>[]>([]);
  const [watershedCount, setWatershedCount] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([aetherixApi.summary(selectedFire), aetherixApi.layers(selectedFire), aetherixApi.timeseries(selectedFire), aetherixApi.watersheds(selectedFire)])
      .then(([fireSummary, layerData, series, watershedData]) => {
        if (!active) return;
        setSummary(fireSummary);
        setLayers(layerData.layers);
        setSelectedLayerId((current) => current && layerData.layers.some((layer) => layer.id === current) ? current : '');
        setObservations(series.observations);
        setWatershedCount(watershedData.features.length);
      }).catch(() => active && setSummary(null));
    return () => { active = false; };
  }, [selectedFire]);
  const selectedLayer = layers.find((layer) => layer.id === selectedLayerId) || null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#111C28] border border-blue-200 dark:border-[rgba(160,180,195,0.14)] text-[#498ACF] dark:text-[#36C5D9] text-xs font-mono font-medium tracking-wide uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#498ACF] dark:bg-[#36C5D9] animate-pulse"></span>
            Mission Command · Big Sur Study Area
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8]">
            Research Platform Overview
          </h1>
          <p className="text-base text-[#626873] dark:text-[#AAB5C2] mt-2 max-w-2xl leading-relaxed">
            Inspecting the Timber and Plaskett processed study areas with Sentinel-2, provisional
            NISAR backscatter, terrain rasters and watershed boundaries from the completed package.
          </p>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/fires"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-[#111C28] hover:bg-gray-50 dark:hover:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-[#F28C45]" />
            <span>Fire Complexes</span>
          </Link>
          <Link
            to="/dashboard/satellite"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[#18191D] dark:bg-[#36C5D9] hover:bg-black dark:hover:bg-[#22B8C7] text-white dark:text-[#0B1118] shadow-sm transition-all"
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite Analysis</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>

      {/* Primary Map Section (PRIMARY VISUAL COMPONENT) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36C5D9]"></span>
            <h2 className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] tracking-tight">
              Interactive Study Area & Fire Boundaries
            </h2>
            <span className="text-xs font-mono text-[#626873] dark:text-[#788796] ml-2">EPSG:32610 UTM Zone 10N</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <select aria-label="Study area" value={selectedFire} onChange={(event) => setSelectedFire(event.target.value as 'timber' | 'plaskett')} className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-gray-700">
              <option value="timber">Timber Fire</option><option value="plaskett">Plaskett Fire</option>
            </select>
            <select aria-label="Map raster layer" value={selectedLayerId} onChange={(event) => setSelectedLayerId(event.target.value)} className="max-w-64 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#F3F6F8] border border-gray-200 dark:border-gray-700">
              <option value="">Satellite imagery · GeoJSON perimeter</option>
              {layers.map((layer) => <option key={layer.id} value={layer.id}>{layer.name}</option>)}
            </select>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded bg-white border border-slate-500"></span>
              <span className="text-gray-700 dark:text-[#AAB5C2]">Supplied fire perimeter GeoJSON</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#29C9D2]/40 border border-[#29C9D2]"></span>
              <span className="text-gray-700 dark:text-[#AAB5C2]">{watershedCount} HUC-12 watersheds ({selectedFire})</span>
            </div>
          </div>
        </div>

        {/* Map Visual Component */}
        <InteractiveMap height="520px" selectedFireId={selectedFire} rasterLayer={selectedLayer} showFires={true} showWatersheds={true} />
        {summary && <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['AOI pixels', summary.aoi_pixels.toLocaleString()],
              ['Common valid pixels', summary.common_valid_score_pixels.toLocaleString()],
              ['Valid-data coverage', `${summary.common_valid_score_percent.toFixed(2)}%`],
              ['Mean screening index', summary.screening_score.mean.toFixed(2)],
            ].map(([label, value]) => <div key={label} className="p-4 rounded-xl bg-white dark:bg-[#111C28] border border-gray-200 dark:border-gray-800"><div className="text-[11px] font-mono uppercase text-gray-400 dark:text-[#788796]">{label}</div><div className="text-xl font-bold mt-1 font-mono text-[#18191D] dark:text-[#F3F6F8]">{value}</div></div>)}
          </div>
          <p className="text-xs text-[#626873] dark:text-[#AAB5C2]">{selectedLayer ? `${selectedLayer.name} · ${selectedLayer.units} · display range ${selectedLayer.visualization.min ?? '—'}–${selectedLayer.visualization.max ?? '—'}.` : 'Satellite imagery with the supplied fire-perimeter GeoJSON overlay.'} Valid-data coverage is AOI data coverage, not burned area. The screening index is relative, not a probability.</p>
          <p className="max-w-4xl text-sm leading-relaxed text-[#626873] dark:text-[#AAB5C2]">In plain terms: AOI pixels are the grid cells inside this study area. Common valid pixels are the cells with usable values across the combined screening inputs. Coverage is the share of the grid with those values; it does not say how much land burned. Read the relative screening index alongside the selected map layer, not as a chance or risk percentage.</p>
        </>}
      </section>

      {/* Initial Processing Inventory (Clearly Labelled as Preliminary) */}
      <section className="p-6 rounded-2xl bg-amber-50/60 dark:bg-[#111C28] border border-amber-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-200/60 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-700 dark:text-[#E9B75C] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-[#F3F6F8] uppercase tracking-wider font-mono">
                Processed Data Package Inventory
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-[#AAB5C2] mt-0.5">
                Counts from the selected fire’s raster inventory, watershed GeoJSON and phase summary CSV.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-800 dark:text-[#E9B75C] bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-full w-fit">
            VALIDATED PACKAGE INVENTORY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-[#1B2937] text-[#36C5D9] flex items-center justify-center font-bold text-lg font-mono">
              {watershedCount}
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                HUC-12 Watersheds
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                {watershedCount} watershed features
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#1B2937] text-[#6599E8] flex items-center justify-center font-bold text-lg font-mono">
              {layers.filter((layer) => layer.path.includes('/sentinel2/stacks/')).length}
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                Sentinel-2 Phase Composites
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                Pre, during and post phase stacks when available
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-[#1B2937] text-[#F28C45] flex items-center justify-center font-bold text-lg font-mono">
              {observations.filter((row) => row.source === 'NISAR').length}
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                NISAR Phase Summaries
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                Provisional HH/HV phase records in the source CSV
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Datasets Cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#36C5D9]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#626873] dark:text-[#AAB5C2] font-mono">
            Core Sensor Datasets & Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#6599E8] flex items-center justify-center">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Sentinel-2 MSI Radiometry</h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              Optical surface reflectance bands across 20-meter resolution. Normalized Burn Ratio
              (NBR) calculated using Near-Infrared (Band 8: 842 nm) and Shortwave-Infrared (Band 12:
              2190 nm).
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#6599E8]">
              Processed Sentinel-2 phase stacks · 20 m analysis grid
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#172330] text-[#A48DEB] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">NISAR L-Band Radar Backscatter</h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              Provisional NISAR gamma-zero HH/HV backscatter composites and temporal differences,
              provided in dB. Backscatter also responds to moisture, roughness and acquisition geometry.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#A48DEB]">
              Provisional processed observations · date inventory unavailable
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#172330] text-[#F28C45] flex items-center justify-center">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">Terrain Elevation &amp; Slope</h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              Elevation and slope rasters resampled to the 20 m fire analysis grid. The package does
              not include watershed-level debris-flow vulnerability statistics.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#F28C45]">
              USGS 3D Elevation Program
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Workflow & Key Objectives */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Workflow */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#36C5D9]" />
            <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Scientific Analysis Workflow
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Data Ingestion & Ortho-Rectification',
                desc: 'Level-2A Bottom-of-Atmosphere (BOA) Sentinel-2 reflectance and NISAR GCOV radar backscatter georeferenced to EPSG:32610.',
              },
              {
                step: '02',
                title: 'Burn Severity & Backscatter Differencing',
                desc: 'Computation of pre- and post-fire NBR = (B8 - B12) / (B8 + B12), dNBR differencing, and radar backscatter delta (Δσ0 in dB).',
              },
              {
                step: '03',
                title: 'Terrain & Watershed Context',
                desc: 'Aligned elevation and slope surfaces are available with HUC-12 watershed boundaries for spatial context.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-mono text-xs font-bold text-[#36C5D9] bg-teal-50 dark:bg-[#172330] px-2 py-1 rounded h-fit">
                  {item.step}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#18191D] dark:text-[#F3F6F8]">{item.title}</h4>
                  <p className="text-xs text-[#626873] dark:text-[#AAB5C2] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Project Objectives */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#36C5D9]" />
            <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] uppercase font-mono tracking-wider">
              Key Project Objectives
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
              <span className="text-xs font-mono font-bold text-[#36C5D9] uppercase">
                Objective 1
              </span>
              <p className="text-xs text-[#18191D] dark:text-[#F3F6F8] font-medium mt-1">
                Quantify vegetation canopy mortality and stand replacement across the Timber and
                Plaskett fire perimeters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
              <span className="text-xs font-mono font-bold text-[#F28C45] uppercase">
                Objective 2
              </span>
              <p className="text-xs text-[#18191D] dark:text-[#F3F6F8] font-medium mt-1">
                Evaluate cross-sensor agreement and investigate where optical SWIR differencing
                diverges from L-band radar scattering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-[#172330] border border-gray-100 dark:border-[rgba(160,180,195,0.12)]">
              <span className="text-xs font-mono font-bold text-[#36C5D9] uppercase">
                Objective 3
              </span>
              <p className="text-xs text-[#18191D] dark:text-[#F3F6F8] font-medium mt-1">
                Prioritize coastal HUC-12 catchments for ongoing erosion, debris-flow hazard, and
                Highway 1 culvert monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
