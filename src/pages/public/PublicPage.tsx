import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Radio,
  Mountain,
  Satellite,
  Waves,
  Mail,
  Linkedin,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { InteractiveMap } from '@/components/maps/InteractiveMap';
import { ContactForm } from '@/components/forms/ContactForm';
import { FeedbackForm } from '@/components/forms/FeedbackForm';
import { DATA_SOURCES } from '@/config/dataSources';
import { TEAM_MEMBERS } from '@/config/team';

export const PublicPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'feedback'>('contact');
  const inventory = DATA_SOURCES.metadata.inventory;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full relative overflow-hidden bg-[#FAF7F5] dark:bg-[#0B1118] transition-colors">
      {/* ========================================================= */}
      {/* ATMOSPHERIC BACKGROUND: SANTA LUCIA COASTAL RIDGE SILHOUETTES */}
      {/* ========================================================= */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Soft atmospheric gradient washes */}
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-[#F5EFEA]/60 via-[#FAF7F5]/40 to-transparent dark:from-[#111C28]/40 dark:via-[#0B1118]/20 dark:to-transparent" />
        <div className="absolute top-[800px] left-0 right-0 h-[1200px] bg-gradient-to-b from-transparent via-[#F7F5F8]/50 to-[#FAF7F5]/60 dark:from-transparent dark:via-[#111C28]/20 dark:to-[#0B1118]/40" />
        <div className="absolute top-[2000px] left-0 right-0 bottom-0 bg-gradient-to-b from-[#FAF7F5]/60 via-[#F5EFEA]/40 to-[#FAF7F5] dark:from-[#0B1118] dark:via-[#111C28]/30 dark:to-[#0B1118]" />

        {/* Santa Lucia Mountain Ridges Decorative SVG Vector */}
        <svg
          className="absolute top-0 left-0 w-full h-[1400px] text-[#C49B80] dark:text-[#5B758F] opacity-[0.07] dark:opacity-[0.06]"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Distant Ridge */}
          <path
            d="M0,280 C240,240 400,290 600,260 C800,230 960,280 1200,250 C1320,235 1380,245 1440,240 L1440,900 L0,900 Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Mid Ridge */}
          <path
            d="M0,380 C180,340 360,400 580,360 C800,320 1020,390 1240,350 C1340,330 1400,345 1440,340 L1440,900 L0,900 Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          {/* Near Coastal Escarpment */}
          <path
            d="M0,520 C220,480 440,540 720,490 C1000,440 1200,530 1440,480 L1440,900 L0,900 Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
        </svg>

        {/* Lower Elevation Coastal Topographic Contours for Team & Contact */}
        <svg
          className="absolute top-[2100px] left-0 w-full h-[1200px] text-[#D8895B] dark:text-[#478ED8] opacity-[0.04] dark:opacity-[0.05]"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M-100 180 C 200 130, 480 240, 780 180 C 1080 120, 1260 220, 1540 170" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100 270 C 240 220, 520 330, 820 270 C 1120 210, 1300 310, 1540 260" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100 360 C 210 310, 490 420, 790 360 C 1090 300, 1270 400, 1540 350" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100 450 C 250 400, 530 510, 830 450 C 1130 390, 1310 490, 1540 440" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 w-full">
        {/* ========================================================= */}
        {/* SECTION 1: WELCOME / HERO (TWO-COLUMN EDITORIAL COMPOSITION) */}
        {/* ========================================================= */}
        <section
          id="welcome"
          className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Heading, Subtitle & Action Pills */}
              <div className="lg:col-span-5 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] leading-[1.12]">
                  After the fire, understand what changed.
                </h1>

                <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed font-normal max-w-xl">
                  An interactive research initiative combining satellite intelligence and watershed
                  analysis to investigate post-wildfire landscape changes in Big Sur, California.
                </p>

                {/* Actions: Explore Research Dashboard + About the Project */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/dashboard/overview"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-[#191A1F] text-white hover:bg-black dark:bg-[#36C5D9] dark:text-[#0B1118] dark:hover:bg-[#2EB0C2] transition-all shadow-sm active:scale-95 group cursor-pointer"
                  >
                    <span className="pointer-events-none">Explore Research Dashboard</span>
                    <ArrowUpRight className="w-4 h-4 pointer-events-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => scrollTo('about')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#191A1F] dark:text-[#F3F6F8] bg-white dark:bg-[#111C28] hover:bg-[#FAF7F5] dark:hover:bg-white/5 border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.2)] transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="pointer-events-none">About the Project</span>
                    <ChevronDown className="w-4 h-4 pointer-events-none text-[#6B7280] dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Geospatial Map Card */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.2)] shadow-xl bg-white dark:bg-[#090D14]">
                  {/* Card Header Bar */}
                  <div className="px-5 py-3.5 bg-white dark:bg-[#111C28] border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F5] dark:bg-[#172330] text-[#191A1F] dark:text-[#F3F6F8] font-mono text-[11px] font-semibold border border-[#E9E7E5] dark:border-gray-700">
                        BIG SUR STUDY AREA · MONTEREY COUNTY, CA
                      </span>
                      <button
                        onClick={() => {
                          const resetBtn = document.querySelector('[title="Reset view"]') as HTMLButtonElement;
                          if (resetBtn) resetBtn.click();
                        }}
                        className="p-1 rounded-lg text-[#6B7280] hover:text-[#191A1F] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                        title="Reset Map Orientation"
                        aria-label="Reset Map Orientation"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-[#6B7280] dark:text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Awaiting MapTiler API Key in .env.local</span>
                    </div>
                  </div>

                  {/* Real MapLibre Geospatial Map Instance */}
                  <div className="relative h-[410px] w-full bg-[#E5E3DF] dark:bg-[#090D14]">
                    <InteractiveMap
                      height="100%"
                      showFires={true}
                      showWatersheds={true}
                      defaultView="hybrid"
                      interactive={true}
                    />

                    {/* Compact In-Map Legend Pill */}
                    <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-[#111C28]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E9E7E5] dark:border-gray-700 shadow-sm flex items-center gap-3 text-[11px] font-mono">
                      <span className="flex items-center gap-1.5 text-[#191A1F] dark:text-gray-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F49A48]"></span>
                        <span>Timber Fire (Orange)</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#191A1F] dark:text-gray-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F06470]"></span>
                        <span>Plaskett Fire (Red)</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[#191A1F] dark:text-gray-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#29C9D2]"></span>
                        <span>HUC-12 Basins (Cyan)</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom Preliminary Processing Inventory Strip */}
                  <div className="bg-[#FAF7F5] dark:bg-[#121418] px-6 py-3.5 border-t border-[#E9E7E5] dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[#191A1F] dark:text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#29C9D2]"></div>
                      <div>
                        <span className="text-[#6B7280] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                          Preliminary Catchments
                        </span>
                        <span className="text-[#191A1F] dark:text-white font-bold text-xs">
                          {inventory.huc12Units} HUC-12 Watershed Units
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#478ED8]"></div>
                      <div>
                        <span className="text-[#6B7280] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                          Pre-Fire Observation Scenes
                        </span>
                        <span className="text-[#191A1F] dark:text-white font-bold text-xs">
                          {inventory.preFireScenes} Pre-Fire Sentinel-2 Scenes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#F49A48]"></div>
                      <div>
                        <span className="text-[#6B7280] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                          Post-Fire Observation Scenes
                        </span>
                        <span className="text-[#191A1F] dark:text-white font-bold text-xs">
                          {inventory.postFireScenes} Post-Fire Sentinel-2 Scenes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: ABOUT THE PROJECT                              */}
        {/* ========================================================= */}
        <section
          id="about"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]"
        >
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Clean Editorial Two-Column Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Research Context & 4 Scientific Pillars */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-[#478ED8] dark:text-[#36C5D9] font-bold mb-2">
                    Research Context
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] mb-4">
                    About the Project
                  </h2>
                  <p className="text-base text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                    The project investigates post-wildfire landscape changes across the Timber and
                    Plaskett fire complexes in Big Sur, California, using Sentinel-2 optical
                    observations, NISAR radar observations, and watershed-level terrain analysis.
                  </p>
                </div>

                {/* 4 Research Pillars with Icons */}
                <div className="space-y-4 pt-2">
                  {/* Pillar 1 */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#478ED8] dark:text-[#36C5D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Mountain className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#191A1F] dark:text-[#F3F6F8]">
                        Why Big Sur and the Santa Lucia Range Matter
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                        Rising abruptly from the Pacific Ocean to over 1,500 meters, Big Sur represents
                        one of North America’s steepest coastal escarpments. Wildfires destroy stabilizing
                        chaparral and redwood root networks, leaving high-gradient catchments intensely
                        susceptible to debris flows and rockfalls that sever California State Route 1.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#478ED8] dark:text-[#36C5D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Satellite className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#191A1F] dark:text-[#F3F6F8]">
                        The Role of Sentinel-2 Multispectral Observations
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                        Sentinel-2 MSI captures fine-resolution (10m–20m) reflectance across near-infrared
                        (B8, 842nm) and shortwave-infrared (B12, 2190nm). The Normalized Burn Ratio (NBR) and
                        differential dNBR detect cellular chlorophyll degradation, scorched canopy foliage,
                        and bare soil charring.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#478ED8] dark:text-[#36C5D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#191A1F] dark:text-[#F3F6F8]">
                        The Role of NISAR L-Band Radar Observations
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                        Persistent summer marine layer fog obstructs optical lenses along the coast. NISAR’s
                        24cm microwave wavelength penetrates cloud cover and superficial ash, directly
                        measuring canopy branch geometry and soil dielectric moisture changes with dual-pol
                        backscatter.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 4 */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#478ED8] dark:text-[#36C5D9] flex items-center justify-center shrink-0 mt-0.5">
                      <Waves className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#191A1F] dark:text-[#F3F6F8]">
                        Why Watershed and Terrain Analysis Is Relevant
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                        Catchments function as integrated hydrological funnels. Coupling high-resolution USGS
                        3DEP digital elevation models with burn severity perimeters allows identifying steep
                        slope corridors (&gt;30°) that channel post-fire runoff directly into highway drainage
                        infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Study Area Card & Satellite Preview */}
              <div className="lg:col-span-5 bg-white dark:bg-[#111C28] p-7 rounded-3xl border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]">
                  <div className="text-xs font-mono font-bold text-[#191A1F] dark:text-[#F3F6F8] tracking-wider uppercase">
                    MONTEREY COUNTY STUDY AOI
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800">
                    EPSG:32610
                  </span>
                </div>

                {/* Satellite Mini Map Preview */}
                <div className="rounded-2xl overflow-hidden border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.2)] shadow-2xs relative bg-black">
                  <div className="px-3.5 py-2 bg-[#121418] text-white font-mono text-[10px] flex justify-between items-center tracking-wider uppercase">
                    <span>BIG SUR STUDY AOI · SATELLITE</span>
                    <span className="text-[#29C9D2]">EPSG:32610 UTM 10N</span>
                  </div>
                  <div className="h-52 w-full relative">
                    <InteractiveMap
                      height="100%"
                      zoom={9.2}
                      defaultView="satellite"
                      showFires={true}
                      showWatersheds={true}
                      interactive={false}
                    />
                  </div>
                  <div className="px-3 py-2 bg-white/95 dark:bg-[#121418]/95 border-t border-[#E9E7E5] dark:border-gray-800 flex items-center justify-between text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-[#F49A48]">● Timber Fire</span>
                    <span className="flex items-center gap-1 text-[#F06470]">● Plaskett Fire</span>
                    <span className="flex items-center gap-1 text-[#29C9D2]">● HUC-12 Basins</span>
                  </div>
                </div>

                {/* Key Facts Table */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-[#E9E7E5]/70 dark:border-[rgba(160,180,195,0.14)]">
                    <span className="text-[#6B7280] dark:text-[#788796]">Study Location</span>
                    <span className="font-semibold text-[#191A1F] dark:text-[#F3F6F8]">Big Sur, California, USA</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E9E7E5]/70 dark:border-[rgba(160,180,195,0.14)]">
                    <span className="text-[#6B7280] dark:text-[#788796]">Central Coordinates</span>
                    <span className="font-semibold text-[#191A1F] dark:text-[#F3F6F8]">36.2704° N, 121.8081° W</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E9E7E5]/70 dark:border-[rgba(160,180,195,0.14)]">
                    <span className="text-[#6B7280] dark:text-[#788796]">Monitored Basins</span>
                    <span className="font-semibold text-[#29C9D2]">11 HUC-12 Units</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#6B7280] dark:text-[#788796]">Incident Complexes</span>
                    <span className="font-semibold text-[#F49A48]">Timber &amp; Plaskett Fires</span>
                  </div>
                </div>

                {/* Launch Research Dashboard Button */}
                <Link
                  to="/dashboard/overview"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#478ED8] hover:bg-[#357AC3] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Launch Research Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 pointer-events-none" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: OUR VISION (EXACT SPECIFICATION)               */}
        {/* ========================================================= */}
        <section
          id="vision"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]"
        >
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="text-xs uppercase font-mono tracking-widest text-[#478ED8] dark:text-[#36C5D9] font-bold mb-3">
                Guiding Direction
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] mb-8">
                Our Vision
              </h2>

              {/* Exact Proposed Vision Statement Box */}
              <blockquote className="text-xl sm:text-2xl font-medium tracking-tight text-[#191A1F] dark:text-[#F3F6F8] leading-relaxed p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-sm">
                “To make post-wildfire landscape changes easier to observe, understand and investigate
                through the integration of satellite intelligence and geographical analysis.”
              </blockquote>
            </div>

            {/* Exactly Three Concise Research Objectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Objective 1 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-[#D8895B]/40 transition-colors">
                <div>
                  <div className="px-2.5 py-1 rounded-lg bg-[#FDF3EB] dark:bg-[#1F1E24] text-[#D8895B] border border-[#F5DAC8] dark:border-[#523A2E] font-mono font-bold text-xs inline-block mb-4">
                    01
                  </div>
                  <h3 className="text-base font-bold text-[#191A1F] dark:text-[#F3F6F8] mb-2.5">
                    Observe Landscape Changes
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                    Track multi-temporal burn severity perimeters, vegetative loss, and soil exposure
                    across the Santa Lucia coastal mountain range.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#D8895B]">
                  Objective 01 · Landscape Observation
                </div>
              </div>

              {/* Objective 2 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-[#D8895B]/40 transition-colors">
                <div>
                  <div className="px-2.5 py-1 rounded-lg bg-[#FDF3EB] dark:bg-[#1F1E24] text-[#D8895B] border border-[#F5DAC8] dark:border-[#523A2E] font-mono font-bold text-xs inline-block mb-4">
                    02
                  </div>
                  <h3 className="text-base font-bold text-[#191A1F] dark:text-[#F3F6F8] mb-2.5">
                    Understand Observations
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                    Synthesise optical spectral indices with L-band Synthetic Aperture Radar
                    backscatter to resolve discrepancies caused by ash charring and canopy moisture.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#D8895B]">
                  Objective 02 · Sensor Concordance
                </div>
              </div>

              {/* Objective 3 */}
              <div className="p-7 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-[#D8895B]/40 transition-colors">
                <div>
                  <div className="px-2.5 py-1 rounded-lg bg-[#FDF3EB] dark:bg-[#1F1E24] text-[#D8895B] border border-[#F5DAC8] dark:border-[#523A2E] font-mono font-bold text-xs inline-block mb-4">
                    03
                  </div>
                  <h3 className="text-base font-bold text-[#191A1F] dark:text-[#F3F6F8] mb-2.5">
                    Identify Priority Watersheds
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                    Highlight steep coastal drainage basins (&gt;30° gradient) for further monitoring,
                    assisting local emergency managers and road maintenance teams.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#D8895B]">
                  Objective 03 · Monitoring Prioritization
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: MEET THE TEAM (EXACTLY TWO PROFILES)           */}
        {/* ========================================================= */}
        <section
          id="team"
          className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]"
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Heading */}
            <div className="text-center max-w-xl mx-auto mb-12">
              <div className="text-xs uppercase font-mono tracking-widest text-[#D8895B] font-bold mb-2.5">
                AETHERIX · PROJECT TEAM
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] mb-3">
                Meet the Team
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#AAB5C2]">
                The people behind AFTER THE FIRE.
              </p>
            </div>

            {/* EXACTLY TWO PROFILES — Balanced Two-Column Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {TEAM_MEMBERS.map((member, idx) => (
                <div
                  key={member.name}
                  className="relative p-7 sm:p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] flex flex-col justify-between hover:border-[#D8895B]/50 transition-all shadow-xs group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B7280] dark:text-[#788796]">
                        AETHERIX RESEARCH
                      </span>
                      <span className="text-xs font-mono font-bold text-[#D8895B]">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] leading-snug">
                      {member.name}
                    </h3>
                  </div>

                  {/* Icon & Label Links */}
                  <div className="flex items-center gap-6 mt-8 pt-5 border-t border-[#E9E7E5] dark:border-[rgba(160,180,195,0.12)]">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 text-xs font-mono text-[#191A1F] dark:text-[#F3F6F8] hover:text-[#D8895B] transition-colors cursor-pointer py-1"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="w-4 h-4 text-[#6B7280] group-hover:text-[#D8895B] transition-colors" />
                        <span>Email</span>
                      </a>
                    )}

                    <span className="text-[#E9E7E5] dark:text-gray-700">·</span>

                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono text-[#191A1F] dark:text-[#F3F6F8] hover:text-[#D8895B] transition-colors cursor-pointer py-1"
                        aria-label={`LinkedIn ${member.name}`}
                      >
                        <Linkedin className="w-4 h-4 text-[#6B7280] group-hover:text-[#D8895B] transition-colors" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: CONTACT & FEEDBACK                             */}
        {/* ========================================================= */}
        <section
          id="contact"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)]"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Heading & Switcher Tabs */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="text-xs uppercase font-mono tracking-widest text-[#478ED8] dark:text-[#36C5D9] font-bold mb-3">
                    Communication
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191A1F] dark:text-[#F3F6F8] mb-4">
                    Get in Touch
                  </h2>
                  <p className="text-sm text-[#6B7280] dark:text-[#AAB5C2] leading-relaxed">
                    Inquire about research findings, dataset access, or submit scientific suggestions
                    and feedback.
                  </p>
                </div>

                {/* Selectable Tabs: CONTACT US | SHARE FEEDBACK */}
                <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-[#111C28] border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'contact'
                        ? 'bg-[#191A1F] text-white shadow-xs dark:bg-[#36C5D9] dark:text-[#0B1118]'
                        : 'text-[#6B7280] hover:text-[#191A1F] dark:text-[#AAB5C2] dark:hover:text-[#F3F6F8]'
                    }`}
                  >
                    <span className="pointer-events-none">Contact Us</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'feedback'
                        ? 'bg-[#191A1F] text-white shadow-xs dark:bg-[#36C5D9] dark:text-[#0B1118]'
                        : 'text-[#6B7280] hover:text-[#191A1F] dark:text-[#AAB5C2] dark:hover:text-[#F3F6F8]'
                    }`}
                  >
                    <span className="pointer-events-none">Share Feedback</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Form Container Card */}
              <div className="lg:col-span-7 bg-white dark:bg-[#111C28] rounded-3xl border border-[#E9E7E5] dark:border-[rgba(160,180,195,0.14)] shadow-sm p-6 sm:p-8">
                {activeTab === 'contact' ? <ContactForm /> : <FeedbackForm />}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: FOOTER                                         */}
        {/* ========================================================= */}
        <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#121418] text-white border-t border-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#478ED8] flex items-center justify-center text-white font-bold text-xs">
                  AE
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#478ED8] dark:text-[#36C5D9] font-mono tracking-wider uppercase font-semibold">
                    AETHERIX PRESENTS
                  </span>
                  <span className="font-bold tracking-tight text-white uppercase text-sm leading-tight">
                    After The Fire
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Computational ecological monitoring, orthomosaic remote sensing, and vegetative delta
                analysis across the Big Sur coastal mountain range, Monterey County, California.
              </p>
            </div>

            <div className="flex flex-wrap gap-10 text-xs text-gray-400 font-medium">
              <div className="flex flex-col gap-2.5">
                <span className="font-mono uppercase text-gray-200 tracking-wider text-[11px]">
                  Navigation
                </span>
                <button
                  onClick={() => scrollTo('welcome')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">Welcome</span>
                </button>
                <button
                  onClick={() => scrollTo('about')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">About Us</span>
                </button>
                <button
                  onClick={() => scrollTo('vision')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">Our Vision</span>
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="font-mono uppercase text-gray-200 tracking-wider text-[11px]">
                  Consortium
                </span>
                <button
                  onClick={() => scrollTo('team')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">Research Team</span>
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="text-left hover:text-white transition-colors cursor-pointer"
                >
                  <span className="pointer-events-none">Contact & Feedback</span>
                </button>
                <Link
                  to="/dashboard/overview"
                  className="text-[#478ED8] dark:text-[#36C5D9] hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Research Dashboard →
                </Link>
              </div>

              <div className="flex flex-col gap-2.5 font-mono text-[11px]">
                <span className="uppercase text-gray-200 tracking-wider">Georeference</span>
                <span>EPSG:32610 UTM 10N</span>
                <span>BIG SUR, CA</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 pointer-events-none" />
                  SYSTEM: CALIBRATED
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-[11px] text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono">
            <div>
              © 2026 AETHERIX presents AFTER THE FIRE · Big Sur Ecological Resilience Initiative
            </div>
            <div>Open Access Scientific Geospatial License</div>
          </div>
        </footer>
      </div>
    </div>
  );
};
