import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Radio,
  Mountain,
  Satellite,
  Compass,
  CheckCircle,
  Eye,
  Info,
  Mail,
  Linkedin,
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
    <div className="w-full">
      {/* ========================================================= */}
      {/* SECTION 1: WELCOME / HERO (FULL HEADING & CLEAN TOP)      */}
      {/* ========================================================= */}
      <section
        id="welcome"
        className="relative pt-8 pb-16 md:pt-12 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-200/80 bg-white dark:bg-[#0B1118] dark:border-[rgba(160,180,195,0.14)] transition-colors"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Editorial Header */}
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8] leading-[1.12] mb-6">
              After the fire, understand what changed.
            </h1>

            <p className="text-lg md:text-xl text-[#626873] dark:text-[#AAB5C2] leading-relaxed font-normal mb-8 max-w-2xl">
              An interactive research initiative combining satellite intelligence and watershed
              analysis to investigate post-wildfire landscape changes in Big Sur, California.
            </p>

            {/* Actions: Explore Research Dashboard + About the Project */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard/overview"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-[#18191D] text-white hover:bg-black dark:bg-[#36C5D9] dark:text-[#0B1118] dark:hover:bg-[#2EB0C2] transition-all shadow-md active:scale-95 group cursor-pointer"
              >
                <span className="pointer-events-none">Explore Research Dashboard</span>
                <ArrowUpRight className="w-4 h-4 pointer-events-none group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <button
                onClick={() => scrollTo('about')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-[#18191D] dark:text-[#F3F6F8] bg-white dark:bg-[#111C28] hover:bg-black/5 dark:hover:bg-white/5 border border-gray-300 dark:border-[rgba(160,180,195,0.2)] transition-all cursor-pointer"
              >
                <span className="pointer-events-none">About the Project</span>
                <ChevronDown className="w-4 h-4 pointer-events-none text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Real MapLibre Geospatial Map Hero (OpenStreetMap + Vector GeoJSON) */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200/80 dark:border-[rgba(160,180,195,0.2)] shadow-xl bg-white dark:bg-[#090D14]">
            {/* Real MapLibre GL instance displaying Big Sur AOI and Perimeters */}
            <InteractiveMap
              height="480px"
              showFires={true}
              showWatersheds={true}
              defaultView="hybrid"
              interactive={true}
            />

            {/* Bottom Preliminary Processing Inventory Strip (Adaptive Light / Dark) */}
            <div className="bg-[#F8F9FA] dark:bg-[#121418] px-6 py-4 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#18191D] dark:text-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#22B8C7]"></div>
                <div>
                  <span className="text-[#626873] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                    Preliminary Catchments
                  </span>
                  <span className="text-[#18191D] dark:text-white font-bold text-sm">
                    {inventory.huc12Units} HUC-12 Watershed Units
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#498ACF]"></div>
                <div>
                  <span className="text-[#626873] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                    Pre-Fire Observation Scenes
                  </span>
                  <span className="text-[#18191D] dark:text-white font-bold text-sm">
                    {inventory.preFireScenes} Pre-Fire Sentinel-2 Scenes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F28C45]"></div>
                <div>
                  <span className="text-[#626873] dark:text-gray-400 block text-[10px] uppercase font-semibold">
                    Post-Fire Observation Scenes
                  </span>
                  <span className="text-[#18191D] dark:text-white font-bold text-sm">
                    {inventory.postFireScenes} Post-Fire Sentinel-2 Scenes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-[#111C28] border border-blue-200/80 dark:border-[rgba(160,180,195,0.18)] text-xs font-mono text-[#065EA1] dark:text-[#AAB5C2] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-[#498ACF] dark:text-[#36C5D9]" />
              <span>
                <strong>Operational Inventory Notice:</strong> Preliminary processing inventory metrics shown. Vector boundaries displayed from actual project GeoJSON (EPSG:32610 UTM Zone 10N).
              </span>
            </div>
            <Link
              to="/dashboard/overview"
              className="text-[#498ACF] dark:text-[#36C5D9] hover:text-blue-900 dark:hover:text-cyan-300 font-bold underline shrink-0 cursor-pointer"
            >
              Open Console →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: ABOUT THE PROJECT                              */}
      {/* ========================================================= */}
      <section id="about" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0D141D] border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)] transition-colors">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl">
            <div className="text-xs uppercase font-mono tracking-widest text-[#498ACF] dark:text-[#36C5D9] font-semibold mb-3">
              Research Context
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8] mb-6">
              About the Project
            </h2>
            <p className="text-base sm:text-lg text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
              The project investigates post-wildfire landscape changes across the Timber and Plaskett
              fire complexes in Big Sur, California, using Sentinel-2 optical observations, NISAR radar
              observations, and watershed-level terrain analysis.
            </p>
          </div>

          {/* Clean Editorial Two-Column Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Scientific Pillars Detailed */}
            <div className="lg:col-span-7 space-y-6 text-[#18191D] dark:text-[#F3F6F8]">
              <div className="p-6 rounded-2xl bg-[#FAF8FE] dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-[#498ACF] dark:text-[#36C5D9]" />
                  <span>Why Big Sur and the Santa Lucia Range Matter</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Rising abruptly from the Pacific Ocean to over 1,500 meters, Big Sur represents one of
                  North America’s steepest coastal escarpments. Wildfires destroy stabilizing chaparral
                  and redwood root networks, leaving high-gradient catchments intensely susceptible to
                  debris flows and rockfalls that sever California State Route 1.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8FE] dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] flex items-center gap-2.5">
                  <Satellite className="w-5 h-5 text-[#498ACF] dark:text-[#6599E8]" />
                  <span>The Role of Sentinel-2 Multispectral Observations</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Sentinel-2 MSI captures fine-resolution (10m–20m) reflectance across near-infrared
                  (B8, 842nm) and shortwave-infrared (B12, 2190nm). The Normalized Burn Ratio (NBR) and
                  differential dNBR detect cellular chlorophyll degradation, scorched canopy foliage,
                  and bare soil charring.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8FE] dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] flex items-center gap-2.5">
                  <Radio className="w-5 h-5 text-[#22B8C7] dark:text-[#A48DEB]" />
                  <span>The Role of NISAR L-Band Radar Observations</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Persistent summer marine layer fog obstructs optical lenses along the coast. NISAR’s
                  24cm microwave wavelength penetrates cloud cover and superficial ash, directly measuring
                  canopy branch geometry and soil dielectric moisture changes with dual-pol backscatter.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8FE] dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-2xs space-y-2">
                <h3 className="text-base font-bold text-[#18191D] dark:text-[#F3F6F8] flex items-center gap-2.5">
                  <Mountain className="w-5 h-5 text-[#35B9BD] dark:text-[#36C5D9]" />
                  <span>Why Watershed and Terrain Analysis is Relevant</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Catchments function as integrated hydrological funnels. Coupling high-resolution USGS
                  3DEP digital elevation models with burn severity perimeters allows identifying steep slope
                  corridors (&gt;30°) that channel post-fire runoff directly into highway drainage infrastructure.
                </p>
              </div>
            </div>

            {/* Right: Study Location & Precomputed Satellite Composite Card */}
            <div className="lg:col-span-5 bg-[#FAF8FE] dark:bg-[#111C28] p-8 rounded-3xl border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)]">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#18191D] dark:text-[#F3F6F8]">
                  <Compass className="w-4 h-4 text-[#498ACF] dark:text-[#36C5D9]" />
                  <span>MONTEREY COUNTY STUDY AOI</span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  EPSG:32610
                </span>
              </div>

              {/* Genuine Big Sur Geospatial Map Preview */}
              <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-[rgba(160,180,195,0.2)] shadow-sm bg-black relative">
                <div className="p-3 bg-gray-900 text-white font-mono text-[11px] flex justify-between items-center">
                  <span>BIG SUR STUDY AOI · SATELLITE</span>
                  <span className="text-[#22B8C7]">EPSG:32610 UTM 10N</span>
                </div>
                <div className="h-60 w-full relative">
                  <InteractiveMap
                    height="100%"
                    zoom={9.2}
                    defaultView="satellite"
                    showFires={true}
                    showWatersheds={true}
                    interactive={false}
                  />
                </div>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-[rgba(160,180,195,0.14)]">
                  <span className="text-gray-500 dark:text-[#788796]">Study Location</span>
                  <span className="font-semibold text-gray-900 dark:text-[#F3F6F8]">Big Sur, California, USA</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-[rgba(160,180,195,0.14)]">
                  <span className="text-gray-500 dark:text-[#788796]">Central Coordinates</span>
                  <span className="font-semibold text-gray-900 dark:text-[#F3F6F8]">36.2704° N, 121.8081° W</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-200/60 dark:border-[rgba(160,180,195,0.14)]">
                  <span className="text-gray-500 dark:text-[#788796]">Monitored Basins</span>
                  <span className="font-semibold text-[#35B9BD] dark:text-[#36C5D9]">11 HUC-12 Units</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500 dark:text-[#788796]">Incident Complexes</span>
                  <span className="font-semibold text-[#F28C45]">Timber &amp; Plaskett Fires</span>
                </div>
              </div>

              <Link
                to="/dashboard/overview"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#498ACF] hover:bg-[#3572B0] dark:bg-[#36C5D9] dark:hover:bg-[#2EB0C2] text-white dark:text-[#0B1118] font-semibold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer"
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
        className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#FAF8FE] dark:bg-[#0B1118] border-b border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] transition-colors"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs uppercase font-mono tracking-widest text-[#498ACF] dark:text-[#36C5D9] font-semibold mb-3">
              Guiding Direction
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8] mb-8">
              Our Vision
            </h2>

            {/* Exact proposed vision statement */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[#18191D] dark:text-[#F3F6F8] leading-relaxed p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-sm">
              “To make post-wildfire landscape changes easier to observe, understand and investigate
              through the integration of satellite intelligence and geographical analysis.”
            </blockquote>
          </div>

          {/* Exactly Three Concise Research Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-cyan-400/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#172330] text-[#498ACF] dark:text-[#36C5D9] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mb-2">
                  Observe Landscape Changes
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Track multi-temporal burn severity perimeters, vegetative loss, and soil exposure
                  across the Santa Lucia coastal mountain range.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#498ACF] dark:text-[#36C5D9]">
                Objective 01 · Landscape Observation
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-cyan-400/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#172330] text-[#35B9BD] dark:text-[#36C5D9] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mb-2">
                  Understand Observations
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Synthesize optical spectral indices with L-band Synthetic Aperture Radar backscatter
                  to resolve discrepancies caused by ash charring and canopy moisture.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#35B9BD] dark:text-[#36C5D9]">
                Objective 02 · Sensor Concordance
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-cyan-400/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-[#172330] text-[#F28C45] flex items-center justify-center font-mono font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-lg font-bold text-[#18191D] dark:text-[#F3F6F8] mb-2">
                  Identify Priority Watersheds
                </h3>
                <p className="text-xs sm:text-sm text-[#626873] dark:text-[#AAB5C2] leading-relaxed">
                  Highlight steep coastal drainage basins (&gt;30° gradient) for further monitoring,
                  assisting local emergency managers and road maintenance teams.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[rgba(160,180,195,0.1)] text-xs font-mono text-[#F28C45]">
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
        className="relative py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F7F4] dark:bg-[#0B1118] border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)] transition-colors overflow-hidden"
      >
        {/* Subtle Geospatial / Topographic Contour Background Motif */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          {/* Topographic Contours SVG Pattern */}
          <svg
            className="absolute w-full h-full text-[#C87D55] dark:text-[#D98A60] opacity-[0.04] dark:opacity-[0.05]"
            viewBox="0 0 1200 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M-100 120 C 200 80, 450 180, 700 130 C 950 80, 1100 160, 1300 110" stroke="currentColor" strokeWidth="1.2" />
            <path d="M-100 190 C 180 150, 420 250, 680 200 C 940 150, 1120 230, 1300 180" stroke="currentColor" strokeWidth="1.2" />
            <path d="M-100 260 C 220 210, 480 320, 720 270 C 960 220, 1140 300, 1300 250" stroke="currentColor" strokeWidth="1.2" />
            <path d="M-100 330 C 190 280, 440 390, 710 340 C 980 290, 1150 370, 1300 320" stroke="currentColor" strokeWidth="1.2" />
            <path d="M-100 400 C 230 350, 470 460, 740 410 C 1000 360, 1170 440, 1300 390" stroke="currentColor" strokeWidth="1.2" />
            <path d="M-100 470 C 200 420, 460 530, 730 480 C 990 430, 1160 510, 1300 460" stroke="currentColor" strokeWidth="1.2" />
          </svg>

          {/* Restrained Geographic Grid Details */}
          <div className="absolute top-6 left-8 font-mono text-[10px] tracking-widest text-[#C87D55]/30 dark:text-[#D98A60]/30 hidden sm:block">
            + 36.27° N · 100m CONTOURS
          </div>
          <div className="absolute bottom-6 right-8 font-mono text-[10px] tracking-widest text-[#C87D55]/30 dark:text-[#D98A60]/30 hidden sm:block">
            + 121.81° W · EPSG:32610
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Refined Heading */}
          <div className="text-center max-w-xl mx-auto mb-14">
            <div className="text-xs uppercase font-mono tracking-widest text-[#C87D55] dark:text-[#D98A60] font-semibold mb-2.5">
              AETHERIX · PROJECT TEAM
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[46px] font-medium tracking-tight text-[#18191D] dark:text-[#F3F6F8] mb-3 leading-tight">
              Meet the Team
            </h2>
            <p className="text-sm sm:text-base text-[#626873] dark:text-[#AAB5C2]">
              The people behind AFTER THE FIRE.
            </p>
          </div>

          {/* EXACTLY TWO PROFILES — Balanced Two-Column Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={member.name}
                className="relative overflow-hidden p-8 sm:p-9 rounded-2xl bg-white/90 dark:bg-[#111C28]/95 border border-[#E8E6E1] dark:border-[rgba(160,180,195,0.14)] flex flex-col justify-between hover:border-[#C87D55]/60 dark:hover:border-[#D98A60]/60 transition-all shadow-xs group backdrop-blur-xs"
              >
                {/* Background Watermark Insignia/Logo */}
                <div
                  className="absolute -right-6 -bottom-6 w-44 h-44 pointer-events-none select-none text-[#C87D55]/[0.08] dark:text-[#D98A60]/[0.09] transition-transform duration-500 group-hover:scale-105"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                    <circle cx="50" cy="50" r="44" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="32" />
                    <circle cx="50" cy="50" r="18" />
                    <line x1="50" y1="2" x2="50" y2="98" strokeDasharray="2 2" />
                    <line x1="2" y1="50" x2="98" y2="50" strokeDasharray="2 2" />
                    <polygon points="50,22 58,42 78,50 58,58 50,78 42,58 22,50 42,42" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#858B95] dark:text-[#788796]">
                      AETHERIX RESEARCH
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C87D55] dark:text-[#D98A60]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-[26px] font-medium tracking-tight text-[#18191D] dark:text-[#F3F6F8] leading-snug">
                    {member.name}
                  </h3>
                </div>

                {/* Subtle Icon & Label Links */}
                <div className="relative z-10 flex items-center gap-6 mt-8 pt-5 border-t border-[#E8E6E1] dark:border-[rgba(160,180,195,0.12)]">
                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#18191D] dark:text-[#F3F6F8] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors cursor-pointer py-1"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="w-4 h-4 text-[#858B95] dark:text-[#788796] group-hover:text-[#C87D55] dark:group-hover:text-[#D98A60] transition-colors" />
                      <span>Email</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollTo('contact')}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#18191D] dark:text-[#F3F6F8] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors cursor-pointer py-1"
                      title={`Inquire with ${member.name} via Contact section`}
                      aria-label={`Contact ${member.name}`}
                    >
                      <Mail className="w-4 h-4 text-[#858B95] dark:text-[#788796] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors" />
                      <span>Email</span>
                    </button>
                  )}

                  <span className="text-gray-300 dark:text-gray-700">·</span>

                  {member.linkedinUrl ? (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#18191D] dark:text-[#F3F6F8] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors cursor-pointer py-1"
                      aria-label={`LinkedIn ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4 text-[#858B95] dark:text-[#788796] group-hover:text-[#C87D55] dark:group-hover:text-[#D98A60] transition-colors" />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollTo('contact')}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#18191D] dark:text-[#F3F6F8] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors cursor-pointer py-1"
                      title={`${member.name} · AETHERIX Research Consortium Profile`}
                      aria-label={`LinkedIn profile for ${member.name}`}
                    >
                      <Linkedin className="w-4 h-4 text-[#858B95] dark:text-[#788796] hover:text-[#C87D55] dark:hover:text-[#D98A60] transition-colors" />
                      <span>LinkedIn</span>
                    </button>
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
        className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#FAF8FE] dark:bg-[#0B1118] border-b border-gray-200 dark:border-[rgba(160,180,195,0.14)] transition-colors"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs uppercase font-mono tracking-widest text-[#498ACF] dark:text-[#36C5D9] font-semibold mb-3">
              Communication
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#18191D] dark:text-[#F3F6F8] mb-4">
              Get in Touch
            </h2>
            <p className="text-base text-[#626873] dark:text-[#AAB5C2]">
              Inquire about research findings, dataset access, or submit scientific suggestions and
              feedback.
            </p>

            {/* Selectable Tabs: CONTACT US | SHARE FEEDBACK */}
            <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs mt-6">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'contact'
                    ? 'bg-[#18191D] text-white shadow-xs dark:bg-[#36C5D9] dark:text-[#0B1118]'
                    : 'text-[#626873] hover:text-[#18191D] dark:text-[#AAB5C2] dark:hover:text-[#F3F6F8]'
                }`}
              >
                <span className="pointer-events-none">Contact Us</span>
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'bg-[#18191D] text-white shadow-xs dark:bg-[#36C5D9] dark:text-[#0B1118]'
                    : 'text-[#626873] hover:text-[#18191D] dark:text-[#AAB5C2] dark:hover:text-[#F3F6F8]'
                }`}
              >
                <span className="pointer-events-none">Share Feedback</span>
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-[#111C28] rounded-3xl border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-sm p-6 sm:p-10">
            {activeTab === 'contact' ? <ContactForm /> : <FeedbackForm />}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 6: FOOTER                                         */}
      {/* ========================================================= */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#18191D] dark:bg-[#080D14] text-white border-t border-gray-900 dark:border-[rgba(160,180,195,0.14)] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#498ACF] flex items-center justify-center text-white font-bold text-xs">
                AE
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#498ACF] dark:text-[#36C5D9] font-mono tracking-wider uppercase font-semibold">
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
                className="text-[#498ACF] dark:text-[#36C5D9] hover:text-blue-300 dark:hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
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

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 dark:border-gray-800/80 text-[11px] text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono">
          <div>
            © 2026 AETHERIX presents AFTER THE FIRE · Big Sur Ecological Resilience Initiative
          </div>
          <div>Open Access Scientific Geospatial License</div>
        </div>
      </footer>
    </div>
  );
};
