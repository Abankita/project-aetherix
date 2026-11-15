import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Flame, Compass, ArrowLeft, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavItem {
  name: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'OVERVIEW', path: '/dashboard/overview' },
  { name: 'FIRE OVERVIEW', path: '/dashboard/fires' },
  { name: 'SATELLITE ANALYSIS', path: '/dashboard/satellite' },
  { name: 'WATERSHED ANALYSIS', path: '/dashboard/watersheds' },
  { name: 'RESULTS', path: '/dashboard/results' },
];

export const DashboardHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 w-full glass-nav px-4 sm:px-6 flex items-center justify-between border-b border-gray-200/60 dark:border-[rgba(160,180,195,0.14)] select-none">
      {/* Brand & Back Link */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/"
          title="Return to Public Website"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#498ACF] dark:bg-[#36C5D9] flex items-center justify-center text-white dark:text-[#0B1118] shadow-xs group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm tracking-tight text-[#18191D] dark:text-[#F3F6F8] uppercase">
                AFTER THE FIRE
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] text-gray-400 font-mono">
                /
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#498ACF] dark:text-[#36C5D9] bg-blue-50/70 dark:bg-[#172330] px-1.5 py-0.5 rounded border border-blue-100 dark:border-[rgba(160,180,195,0.14)]">
                <Compass className="w-2.5 h-2.5" />
                36.27°N 121.81°W
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#626873] dark:text-[#AAB5C2] uppercase hidden md:block">
              AETHERIX · Big Sur Satellite Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Shared Horizontal Top Navigation */}
      <nav className="hidden lg:flex items-center p-1 rounded-full bg-[#ECEEF2]/90 dark:bg-[#111C28] border border-gray-200/50 dark:border-[rgba(160,180,195,0.14)] shadow-inner">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-[#172330] text-[#18191D] dark:text-[#36C5D9] shadow-sm border border-transparent dark:border-[rgba(160,180,195,0.14)]'
                  : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8] hover:bg-black/5 dark:hover:bg-white/5'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Right Controls: Theme Toggle + Telemetry Badge + Public Site CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Working Theme Toggle */}
        <ThemeToggle />

        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#626873] dark:text-[#AAB5C2] bg-white dark:bg-[#111C28] px-2.5 py-1 rounded-full border border-gray-200 dark:border-[rgba(160,180,195,0.14)] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>EPSG:32610 · S2 + NISAR</span>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8] bg-white/80 dark:bg-[#172330] hover:bg-white dark:hover:bg-[#1B2937] border border-gray-200 dark:border-[rgba(160,180,195,0.14)] transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Public Site</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 glass-modal border-b border-gray-200 dark:border-[rgba(160,180,195,0.18)] dark:bg-[#111C28] p-4 shadow-xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-mono uppercase text-gray-400">Theme</span>
            <ThemeToggle />
          </div>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#498ACF] dark:bg-[#36C5D9] text-white dark:text-[#0B1118] shadow-xs'
                    : 'text-[#18191D] dark:text-[#F3F6F8] hover:bg-gray-100 dark:hover:bg-white/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs font-mono text-gray-500 dark:text-gray-400">
            <span>EPSG:32610 · Big Sur</span>
            <Link to="/" className="text-[#498ACF] dark:text-[#36C5D9] font-semibold">
              ← Exit to Public Site
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
