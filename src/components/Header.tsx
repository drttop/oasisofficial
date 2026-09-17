import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Menu, X, ChevronRight } from 'lucide-react';
import { OasisLogoHorizontal } from './OasisLogoHorizontal';

export const Header: React.FC = () => {
  const { siteConfig } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [siteConfig.headerLogo]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: siteConfig.navMenu1 || '오아시스 소개', href: '#about', id: 'nav-about' },
    { label: siteConfig.navMenu2 || '카지노 소개', href: '#casino', id: 'nav-casino' },
    { label: siteConfig.navMenu3 || '필리핀 소개', href: '#philippines', id: 'nav-philippines' },
    { label: siteConfig.navMenu4 || '이용방법', href: '#process', id: 'nav-process' },
    { label: siteConfig.navMenu5 || '커뮤니티', href: '#community', id: 'nav-community' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'shadow-md bg-slate-950/95 backdrop-blur-md border-b border-slate-800'
            : 'border-b border-white/10 bg-slate-950'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-3.5' : 'py-4 sm:py-5'}`}>
          {/* Logo & Brand: Horizontal SVG Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center group transition-transform hover:scale-105"
            id="brand-logo-link"
          >
            {siteConfig.headerLogo && !imgError ? (
              <img
                src={siteConfig.headerLogo}
                alt={siteConfig.siteName || "OASIS VIP"}
                onError={() => setImgError(true)}
                className="h-8 sm:h-10 w-auto max-w-[220px] object-contain"
              />
            ) : (
              <OasisLogoHorizontal className="h-8 sm:h-10 w-auto max-w-[220px]" />
            )}
          </a>

          {/* Desktop 5 Menu Categories */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4" aria-label="메인 메뉴">
            {navItems.map((item) => (
              <a
                key={item.id}
                id={item.id}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="px-4 py-2 text-sm sm:text-[15px] font-bold text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E5B54F] transition-all duration-200 group-hover:w-3/4 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="모바일 메뉴 열기"
              id="btn-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation (Category Bar) */}
        <div className="lg:hidden w-full border-t border-slate-800/50 px-2 sm:px-4">
          <nav className="flex items-center justify-between py-2.5">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="text-[11px] min-[375px]:text-[12px] sm:text-[14px] font-medium text-white/80 hover:text-white hover:font-bold transition-colors whitespace-nowrap tracking-tight px-1"
            >
              홈
            </a>
            {navItems.map((item) => (
              <a
                key={`horiz-${item.id}`}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-[11px] min-[375px]:text-[12px] sm:text-[14px] font-medium text-white/80 hover:text-white hover:font-bold transition-colors whitespace-nowrap tracking-tight px-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={`mob-${item.id}`}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="flex items-center justify-between px-3 py-3 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#30308A]"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
