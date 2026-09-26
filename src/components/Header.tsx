import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    siteConfig,
    selectedPost,
    setSelectedPost,
    isPostEditorOpen,
    closePostEditor,
  } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

    if (selectedPost || isPostEditorOpen) {
      if (selectedPost) setSelectedPost(null);
      if (isPostEditorOpen) closePostEditor();

      if (typeof window !== 'undefined') {
        const cleanUrl = href === '#home' ? window.location.pathname : `${window.location.pathname}${href}`;
        window.history.replaceState({}, '', cleanUrl);
      }

      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Smoothly scroll to the target section once the main landing page elements are mounted
      let attempts = 0;
      const tryScroll = () => {
        const targetId = href.replace(/^#/, '');
        const element = document.getElementById(targetId) || document.querySelector(href);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        } else if (attempts < 20) {
          attempts++;
          setTimeout(tryScroll, 50);
        }
      };
      // Give React an animation frame to mount landing sections
      requestAnimationFrame(() => {
        setTimeout(tryScroll, 30);
      });
      return;
    }

    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace(/^#/, '');
    const element = document.getElementById(targetId) || document.querySelector(href);
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
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-3.5' : 'py-4 sm:py-5'}`}>
          {/* Logo & Brand: Official Luxury Gold Logo */}
          <div className="flex-shrink-0 flex items-center z-10">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="flex items-center group transition-transform hover:scale-105"
              id="brand-logo-link"
              aria-label="마닐라 오아시스에이전시 홈으로 이동"
            >
              <span className="sr-only">마닐라 오아시스에이전시 홈</span>
              <img
                src={siteConfig.headerLogo || "/images/oasis_header_logo.webp"}
                alt={siteConfig.siteName || "OASIS VIP"}
                width={200}
                height={42}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('oasis_header_logo.png')) {
                    target.src = '/images/oasis_header_logo.png';
                  }
                }}
                className="h-8 sm:h-10 w-auto max-w-[220px] object-contain"
              />
            </a>
          </div>

          {/* Desktop 5 Menu Categories (Centered with widened letter-spacing) */}
          <nav
            className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 space-x-2 xl:space-x-5"
            aria-label="메인 메뉴"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                id={item.id}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="px-3.5 xl:px-4 py-2 text-sm sm:text-[15px] font-bold text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10 relative group tracking-[0.06em]"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E5B54F] transition-all duration-200 group-hover:w-3/4 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Right Spacer & Mobile Menu Toggle Button */}
          <div className="flex items-center space-x-2 z-10">
            <div className="hidden lg:block w-[180px] xl:w-[220px] pointer-events-none" aria-hidden="true" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 lg:hidden"
              aria-label="모바일 메뉴 열기"
              id="btn-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation (Category Bar) */}
        <div className="lg:hidden w-full border-t border-slate-800/50 px-2 sm:px-4">
          <nav className="flex items-center justify-between w-full py-2.5">
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, '#home')}
              className="text-[11px] min-[360px]:text-[11.5px] min-[390px]:text-[13px] font-semibold text-white/85 hover:text-white transition-colors whitespace-nowrap tracking-tighter min-[390px]:tracking-tight px-0.5"
            >
              홈
            </a>
            {navItems.map((item) => (
              <a
                key={`horiz-${item.id}`}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-[11px] min-[360px]:text-[11.5px] min-[390px]:text-[13px] font-semibold text-white/85 hover:text-white transition-colors whitespace-nowrap tracking-tighter min-[390px]:tracking-tight px-0.5"
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
