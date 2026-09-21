import React, { Suspense, useEffect } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { HeroSection } from './components/sections/HeroSection';
import { Footer } from './components/Footer';
import { BottomFloatingBar } from './components/BottomFloatingBar';
import { SEOManager } from './components/SEOManager';
import { Settings } from 'lucide-react';

// Lazy-load below-the-fold sections to ensure initial LCP & FCP load with zero main-thread blockage
const CommunitySection = React.lazy(() =>
  import('./components/sections/CommunitySection').then((m) => ({ default: m.CommunitySection }))
);
const AboutSection = React.lazy(() =>
  import('./components/sections/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const CasinoSection = React.lazy(() =>
  import('./components/sections/CasinoSection').then((m) => ({ default: m.CasinoSection }))
);
const PhilippinesSection = React.lazy(() =>
  import('./components/sections/PhilippinesSection').then((m) => ({ default: m.PhilippinesSection }))
);
const ProcessSection = React.lazy(() =>
  import('./components/sections/ProcessSection').then((m) => ({ default: m.ProcessSection }))
);

// Code-split heavy modals to minimize initial JavaScript bundle and main-thread execution time
const PostDetailModal = React.lazy(() =>
  import('./components/modals/PostDetailModal').then((m) => ({ default: m.PostDetailModal }))
);
const CasinoDetailModal = React.lazy(() =>
  import('./components/modals/CasinoDetailModal').then((m) => ({ default: m.CasinoDetailModal }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

const preloadAdmin = () => {
  import('./components/admin/AdminDashboard');
};

const MainAppContent: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, selectedPost, selectedCasino } = useSite();

  // Prefetch below-the-fold sections during browser idle time so scrolling is instant
  useEffect(() => {
    const prefetchBelowTheFold = () => {
      import('./components/sections/CommunitySection');
      import('./components/sections/AboutSection');
      import('./components/sections/CasinoSection');
      import('./components/sections/PhilippinesSection');
      import('./components/sections/ProcessSection');
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchBelowTheFold, { timeout: 2500 });
    } else {
      setTimeout(prefetchBelowTheFold, 1500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative selection:bg-[#30308A] selection:text-white">
      {/* Dynamic SEO & URL Route Manager */}
      <SEOManager />

      {/* Top Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* Hero Slider (LCP Priority Element) */}
        <HeroSection />

        {/* Below-the-fold sections */}
        <Suspense fallback={<div className="w-full min-h-[300px]" />}>
          {/* 1. 커뮤니티 (Community & Official Board) */}
          <CommunitySection />

          {/* 2. 오아시스 소개 (About Oasis) */}
          <AboutSection />

          {/* 3. 카지노 소개 (Casino Intro) */}
          <CasinoSection />

          {/* 4. 필리핀 소개 (Philippines Travel & Golf) */}
          <PhilippinesSection />

          {/* 5. 이용방법 (Process & FAQ) */}
          <ProcessSection />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Signature Sticky Bottom Floating Bar (KakaoTalk & Telegram 1-click) */}
      <BottomFloatingBar />

      {/* Modals & Dialogs (Loaded on-demand to optimize First Contentful Paint & TTI) */}
      <Suspense fallback={null}>
        {selectedPost && <PostDetailModal />}
        {selectedCasino && <CasinoDetailModal />}
        {isAdminOpen && <AdminDashboard />}
      </Suspense>

      {/* Floating Side Admin Mode Quick Trigger */}
      <div className="fixed right-4 bottom-24 z-40 hidden sm:block">
        <button
          onClick={() => setIsAdminOpen(true)}
          onMouseEnter={preloadAdmin}
          onFocus={preloadAdmin}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          title="관리자 CMS 대시보드 열기"
          id="btn-floating-admin-cms"
        >
          <Settings className="w-3.5 h-3.5 text-[#E5B54F] group-hover:rotate-90 transition-transform duration-300" />
          <span>관리자 CMS</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <MainAppContent />
    </SiteProvider>
  );
}
