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
          ? 'bg-white/95 dark:bg-[#0B1118]/95 border-gray-200/90 dark:border-[rgba(160,180,195,0.18)] py-2.5 shadow-xs'
          : 'bg-white/90 dark:bg-[#0B1118]/90 border-gray-200/70 dark:border-[rgba(160,180,195,0.14)] py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        {/* Brand Logo / Identity */}
        <a
          href="#welcome"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('welcome');
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#498ACF] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Flame className="w-4 h-4 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider text-[#498ACF] dark:text-[#36C5D9] uppercase font-mono font-bold leading-tight">
              AETHERIX
            </span>
            <span className="font-extrabold tracking-tight text-sm text-[#18191D] dark:text-[#F3F6F8] uppercase leading-tight">
              After The Fire
            </span>
          </div>
        </a>

        {/* Desktop Anchor Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs uppercase tracking-wider font-medium text-[#626873] dark:text-[#AAB5C2] bg-white/85 dark:bg-[#111C28]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200/80 dark:border-[rgba(160,180,195,0.18)] shadow-xs">
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
              className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'bg-[#18191D] dark:bg-[#36C5D9] text-white dark:text-[#0B1118] font-semibold shadow-xs'
                  : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA: Opens Research Dashboard, Theme Toggle & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <Link
            to="/dashboard/overview"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#498ACF] text-white hover:bg-[#3572B0] transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Research Dashboard</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
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
