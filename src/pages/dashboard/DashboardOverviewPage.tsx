import React from 'react';
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
import { DATA_SOURCES } from '@/config/dataSources';

export const DashboardOverviewPage: React.FC = () => {
  const inventory = DATA_SOURCES.metadata.inventory;

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
            Investigating post-wildfire landscape dynamics across 23,310 hectares in Big Sur,
            California. Integrating high-acuity Sentinel-2 optical radiometry, NISAR radar
            backscatter, and USGS 3DEP watershed terrain models.
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

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#F49A48]/80 border border-[#F49A48]"></span>
              <span className="text-gray-700 dark:text-[#AAB5C2]">Timber Fire (5,800 ha)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#F06470]/80 border border-[#F06470]"></span>
              <span className="text-gray-700 dark:text-[#AAB5C2]">Plaskett Fire (7,420 ha)</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#29C9D2]/40 border border-[#29C9D2]"></span>
              <span className="text-gray-700 dark:text-[#AAB5C2]">11 HUC-12 Basins</span>
            </div>
          </div>
        </div>

        {/* Map Visual Component */}
        <InteractiveMap height="520px" showFires={true} showWatersheds={true} />
      </section>

      {/* Initial Processing Inventory (Clearly Labelled as Preliminary) */}
      <section className="p-6 rounded-2xl bg-amber-50/60 dark:bg-[#111C28] border border-amber-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-200/60 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-700 dark:text-[#E9B75C] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-[#F3F6F8] uppercase tracking-wider font-mono">
                Initial Processing Inventory — Preliminary Operational Baseline
              </h3>
              <p className="text-xs text-amber-900/80 dark:text-[#AAB5C2] mt-0.5">
                Current baseline counts for orthomosaic scenes and hydrological units.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-800 dark:text-[#E9B75C] bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-full w-fit">
            STAGE: PRE-RELEASE CAL/VAL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-[#1B2937] text-[#36C5D9] flex items-center justify-center font-bold text-lg font-mono">
              11
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                Preliminary Catchments
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                {inventory.huc12Units} HUC-12 Units
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-[#1B2937] text-[#6599E8] flex items-center justify-center font-bold text-lg font-mono">
              20
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                Baseline Scenes
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                {inventory.preFireScenes} Pre-Fire Scenes
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/80 dark:bg-[#172330] border border-amber-100 dark:border-[rgba(160,180,195,0.14)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-[#1B2937] text-[#F28C45] flex items-center justify-center font-bold text-lg font-mono">
              34
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-[#788796]">
                Evaluation Scenes
              </span>
              <div className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8]">
                {inventory.postFireScenes} Post-Fire Scenes
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
              ESA Copernicus · 5-Day Revisit
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#172330] text-[#A48DEB] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">NISAR L-Band Radar Backscatter</h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              Active microwave Synthetic Aperture Radar (24 cm wavelength) operating in dual
              polarization (VV/VH). Penetrates coastal advection fog and smoke to record woody
              biomass structure.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#A48DEB]">
              NASA / ISRO SAR · 12-Day Revisit
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#172330] text-[#F28C45] flex items-center justify-center">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#18191D] dark:text-[#F3F6F8]">USGS 3DEP High-Res DEM</h3>
            <p className="text-xs text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              10-meter seamless digital elevation model providing topographic slope gradients,
              elevation profiles, and stream network flow direction for debris-flow vulnerability.
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
                title: 'Catchment Hydro-Geomorphic Modeling',
                desc: 'Zonal aggregation across 11 HUC-12 basins with 3DEP LiDAR slope (>30°) to calculate empirical monitoring-priority rankings.',
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
