import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/navigation/DashboardHeader';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B1118] text-[#18191D] dark:text-[#F3F6F8] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200">
      <DashboardHeader />
      <div className="pt-16 flex-1 flex flex-col w-full">
        <Outlet />
      </div>
      {/* Shared Minimal Scientific Footer */}
      <footer className="w-full bg-white dark:bg-[#0D141D] border-t border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] py-6 px-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#626873] dark:text-[#AAB5C2]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#18191D] dark:text-[#F3F6F8]">AFTER THE FIRE RESEARCH CONSORTIUM</span>
            <span>·</span>
            <span>EPSG:32610 Big Sur AOI [36.2704° N, 121.8081° W]</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>DATA ATTRIBUTION: ESA SENTINEL-2 MSI · NASA/ISRO NISAR · USGS 3DEP</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
