import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const PublicHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('welcome');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['welcome', 'about', 'vision', 'team', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full backdrop-blur-md border-b transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B1118]/95 border-[#E9E7E5] dark:border-[rgba(160,180,195,0.18)] py-1.5 sm:py-2 shadow-sm'
          : 'bg-white/90 dark:bg-[#0B1118]/90 border-[#E9E7E5]/80 dark:border-[rgba(160,180,195,0.14)] py-2 sm:py-2.5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4 relative">
        {/* Brand Logo / Identity — Positioned at Extreme Left (Balanced size: not too big, not too small) */}
        <a
          href="#welcome"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('welcome');
          }}
          className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer shrink-0 z-10"
        >
          {/* Sized cleanly: 48px to 52px */}
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#478ED8] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs tracking-wider text-[#478ED8] dark:text-[#36C5D9] uppercase font-mono font-bold leading-tight">
              AETHERIX
            </span>
            <span className="font-extrabold tracking-tight text-sm sm:text-base text-[#191A1F] dark:text-[#F3F6F8] uppercase leading-tight">
              After The Fire
            </span>
          </div>
        </a>

        {/* Desktop Anchor Navigation Links — Substantially Bigger & Centered Pill Bar */}
        <nav className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center space-x-1.5 sm:space-x-2 bg-white/95 dark:bg-[#111C28]/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-[#D5D2CD] dark:border-[rgba(160,180,195,0.28)] shadow-sm z-10">
          {[
            { id: 'welcome', label: 'Welcome' },
            { id: 'about', label: 'About' },
            { id: 'vision', label: 'Vision' },
            { id: 'team', label: 'Team' },
            { id: 'contact', label: 'Contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-[15px] sm:text-base transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'bg-[#191A1F] dark:bg-[#36C5D9] text-white dark:text-[#0B1118] font-bold shadow-md'
                  : 'text-[#4B5563] dark:text-[#CBD5E1] hover:text-[#191A1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-medium'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA: Opens Research Dashboard, Theme Toggle & Mobile Toggle — Extreme Right */}
        <div className="flex items-center gap-3.5 shrink-0">
          <ThemeToggle />

          <Link
            to="/dashboard/overview"
            className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm sm:text-[15px] font-semibold bg-[#478ED8] text-white hover:bg-[#357AC3] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Research Dashboard</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-modal mx-4 mt-2 p-5 rounded-2xl flex flex-col gap-3 border border-gray-200/80 dark:border-[rgba(160,180,195,0.18)] dark:bg-[#111C28]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-mono uppercase text-gray-500 dark:text-[#AAB5C2]">Theme</span>
            <ThemeToggle />
          </div>
          {[
            { id: 'welcome', label: 'Welcome' },
            { id: 'about', label: 'About' },
            { id: 'vision', label: 'Vision' },
            { id: 'team', label: 'Team' },
            { id: 'contact', label: 'Contact & Feedback' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left py-2 px-3 text-sm font-medium text-[#18191D] dark:text-[#F3F6F8] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/dashboard/overview"
            className="w-full text-center py-2.5 rounded-xl bg-[#498ACF] text-white font-semibold text-xs mt-2"
          >
            Launch Research Dashboard
          </Link>
        </div>
      )}
    </header>
  );
};
