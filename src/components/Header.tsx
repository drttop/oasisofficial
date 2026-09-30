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
    activeInfoModal,
    setActiveInfoModal,
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
    { label: siteConfig.navMenu1 || '오아시스', href: '#about', id: 'nav-about' },
    { label: siteConfig.navMenu3 || 'VIP 서비스', href: '#philippines', id: 'nav-philippines' },
    { label: siteConfig.navMenu2 || '카지노 서비스', href: '#casino', id: 'nav-casino' },
    { label: siteConfig.navMenu4 || '프로모션', href: '#promotion', id: 'nav-promotion' },
    { label: siteConfig.navMenu5 || '커뮤니티', href: '#community', id: 'nav-community' },
    { label: siteConfig.navMenu6 || '이용방법', href: '#process', id: 'nav-process' },
  ];

  // Mobile horizontal bar: 홈 삭제, 이용방법 제외(상단 삼선에서만 표시)
  const mobileHorizontalNavItems = [
    { label: siteConfig.navMenu1 || '오아시스', href: '#about', id: 'mob-horiz-about' },
    { label: siteConfig.navMenu3 || 'VIP서비스', href: '#philippines', id: 'mob-horiz-philippines' },
    { label: siteConfig.navMenu2 || '카지노서비스', href: '#casino', id: 'mob-horiz-casino' },
    { label: siteConfig.navMenu4 || '프로모션', href: '#promotion', id: 'mob-horiz-promotion' },
    { label: siteConfig.navMenu5 || '커뮤니티', href: '#community', id: 'mob-horiz-community' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === '#about') {
      if (selectedPost) setSelectedPost(null);
      if (isPostEditorOpen) closePostEditor();
      setActiveInfoModal('about');
      if (typeof window !== 'undefined') {
        window.history.pushState({ section: 'about' }, '', `${window.location.pathname}#about`);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
      return;
    }

    if (href === '#process') {
      if (selectedPost) setSelectedPost(null);
      if (isPostEditorOpen) closePostEditor();
      setActiveInfoModal('process');
      if (typeof window !== 'undefined') {
        window.history.pushState({ section: 'process' }, '', `${window.location.pathname}#process`);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
      return;
    }

    const wasSubPageOpen = Boolean(activeInfoModal || selectedPost || isPostEditorOpen);

    if (activeInfoModal) {
      setActiveInfoModal(null);
    }

    if (selectedPost) {
      setSelectedPost(null);
    }

    if (isPostEditorOpen) {
      closePostEditor();
    }

    if (href === '#home') {
      if (typeof window !== 'undefined') {
        window.history.replaceState({ section: 'home', originSection: 'home' }, '', window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    const targetId = href.replace(/^#/, '');

    if (typeof window !== 'undefined' && href.startsWith('#')) {
      try {
        if (targetId === 'community' || targetId === 'promotion') {
          sessionStorage.setItem('oasis_current_board', targetId);
        }
        window.history.replaceState(
          { section: targetId, originSection: targetId },
          '',
          `${window.location.pathname}${href}`
        );
      } catch {}
    }

    const scrollToTarget = () => {
      const element = document.getElementById(targetId) || document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'instant' as ScrollBehavior,
        });
        return true;
      }
      return false;
    };

    if (wasSubPageOpen) {
      // Main landing page sections are mounting as subpage/modal closes.
      // Poll until the element exists and settle alignment to prevent layout shifts.
      let attempts = 0;
      let settledCount = 0;
      const tryScroll = () => {
        const found = scrollToTarget();
        if (found) {
          settledCount++;
          if (settledCount < 3 && attempts < 25) {
            attempts++;
            setTimeout(tryScroll, 30);
            return;
          }
        } else if (attempts < 30) {
          attempts++;
          setTimeout(tryScroll, attempts < 5 ? 16 : 40);
        }
      };
      requestAnimationFrame(() => {
        tryScroll();
      });
    } else {
      if (!scrollToTarget()) {
        let attempts = 0;
        const tryScroll = () => {
          if (!scrollToTarget() && attempts < 20) {
            attempts++;
            setTimeout(tryScroll, 25);
          }
        };
        requestAnimationFrame(tryScroll);
      }
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

          {/* Desktop 6 Menu Categories */}
          <nav
            className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 space-x-1 xl:space-x-3.5"
            aria-label="메인 메뉴"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                id={item.id}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="px-2.5 xl:px-3.5 py-2 text-xs sm:text-[14px] xl:text-[15px] font-bold text-white/90 hover:text-white transition-colors rounded-lg hover:bg-white/10 relative group tracking-[0.04em] whitespace-nowrap"
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
              className="p-2 rounded-lg text-white hover:bg-white/10 lg:hidden cursor-pointer"
              aria-label={mobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
              id="btn-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation (Category Bar - 홈 삭제, 이용방법은 상단 삼선에서만 표시) */}
        <div className="lg:hidden w-full border-t border-slate-800/50 px-2 sm:px-4">
          <nav className="flex items-center justify-around sm:justify-between w-full py-2.5" aria-label="모바일 카테고리 네비게이션">
            {mobileHorizontalNavItems.map((item) => (
              <a
                key={`horiz-${item.id}`}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-[12px] min-[360px]:text-[12.5px] min-[390px]:text-[14px] font-bold text-white/90 hover:text-white transition-colors whitespace-nowrap tracking-tight px-1 py-0.5"
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
          <nav className="space-y-1" aria-label="모바일 전체 사이트 메뉴">
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
          </nav>
        </div>
      )}
    </header>
  );
};
