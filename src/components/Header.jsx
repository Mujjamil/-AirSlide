import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Radio } from 'lucide-react';

export default function Header({ onLaunchPresentation, isPresentationOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      // Detect dark section (#how-it-works or #architecture)
      const darkElem = document.getElementById('architecture');
      if (darkElem) {
        const rect = darkElem.getBoundingClientRect();
        // If the dark section encompasses the top header area
        if (rect.top <= 70 && rect.bottom >= 70) {
          setIsDarkSection(true);
        } else {
          setIsDarkSection(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'OVERVIEW', href: '#overview' },
    { label: 'GESTURES', href: '#gestures' },
    { label: 'HOW IT WORKS', href: '#architecture' },
    { label: 'LIVE DEMO', href: '#demo' },
    { label: 'SPECS', href: '#specs' },
  ];

  if (isPresentationOpen) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-out select-none ${
        isScrolled
          ? isDarkSection
            ? 'bg-[#0C0D0F]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-sm'
            : 'bg-[#ECE8E1]/85 backdrop-blur-md border-b border-[#121316]/10 py-3.5 shadow-sm'
          : 'bg-transparent py-5 md:py-7'
      } ${isDarkSection ? 'text-[#F5F5F7]' : 'text-[#121316]'}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
        >
          {/* Geometric editorial mark */}
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={`w-5 h-5 transition-transform duration-500 group-hover:rotate-90 ${
                isDarkSection ? 'text-white' : 'text-[#121316]'
              }`}
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </div>
          <span className="font-mono text-xs md:text-sm font-semibold tracking-[0.22em] uppercase">
            AirSlide
          </span>
        </a>

        {/* Center Editorial Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-mono text-[11px] tracking-[0.18em] uppercase transition-colors relative py-1 group ${
                isDarkSection
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span className="mr-1.5 opacity-40">•</span>
              {link.label}
              <span
                className={`absolute bottom-0 left-3 right-0 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                  isDarkSection ? 'bg-white' : 'bg-black'
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Right CTA & Telemetry Pill */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-colors ${
              isDarkSection
                ? 'border-white/10 bg-white/5 text-zinc-300'
                : 'border-black/10 bg-black/5 text-zinc-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>WASM 60FPS</span>
          </div>

          <button
            onClick={onLaunchPresentation}
            className={`flex items-center gap-1.5 px-4 md:px-5 py-2 rounded-full font-mono text-xs tracking-wider uppercase font-medium transition-all duration-200 shadow-sm ${
              isDarkSection
                ? 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]'
                : 'bg-[#121316] text-[#ECE8E1] hover:bg-black hover:scale-[1.02]'
            }`}
          >
            <span>Launch Deck</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle Navigation"
            className="lg:hidden p-2 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-6 py-6 flex flex-col gap-4 mt-3 shadow-xl ${
            isDarkSection
              ? 'bg-[#0C0D0F] border-white/10 text-white'
              : 'bg-[#ECE8E1] border-black/10 text-black'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-mono text-xs tracking-widest uppercase py-2 border-b border-black/5"
            >
              • {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLaunchPresentation();
            }}
            className="mt-2 w-full py-3 rounded-full bg-[#121316] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span>Launch Full Presentation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
