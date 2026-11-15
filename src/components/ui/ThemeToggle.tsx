import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Midnight Geospatial Dark Theme'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Midnight Geospatial Dark Mode'}
      className={`relative inline-flex items-center justify-center p-2.5 rounded-full border transition-all cursor-pointer ${
        isDark
          ? 'bg-[#172330] border-[rgba(160,180,195,0.18)] text-[#36C5D9] hover:bg-[#1B2937] hover:border-[#36C5D9]/40 shadow-midnight-sm'
          : 'bg-white border-gray-200 text-[#498ACF] hover:bg-gray-50 hover:border-gray-300 shadow-2xs'
      } ${className}`}
    >
      <span className="sr-only">
        {isDark ? 'Switch to Light Mode' : 'Switch to Midnight Geospatial Dark Mode'}
      </span>
      {isDark ? (
        <Sun className="w-4.5 h-4.5 pointer-events-none transition-transform duration-300 rotate-0 scale-100 hover:rotate-45" />
      ) : (
        <Moon className="w-4.5 h-4.5 pointer-events-none transition-transform duration-300 rotate-0 scale-100 hover:-rotate-12" />
      )}
    </button>
  );
};
