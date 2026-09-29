import React, { Suspense } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { HeroSection } from './components/sections/HeroSection';
import { BottomFloatingBar } from './components/BottomFloatingBar';
import { SEOManager } from './components/SEOManager';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Settings, ArrowLeft } from 'lucide-react';

// Code-split below-the-fold sections to drastically reduce initial JavaScript execution & unused JS
const AboutSection = React.lazy(() =>
  import('./components/sections/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const CasinoSection = React.lazy(() =>
  import('./components/sections/CasinoSection').then((m) => ({ default: m.CasinoSection }))
);
const PhilippinesSection = React.lazy(() =>
  import('./components/sections/PhilippinesSection').then((m) => ({ default: m.PhilippinesSection }))
);
const PromotionSection = React.lazy(() =>
  import('./components/sections/PromotionSection').then((m) => ({ default: m.PromotionSection }))
);
const CommunitySection = React.lazy(() =>
  import('./components/sections/CommunitySection').then((m) => ({ default: m.CommunitySection }))
);
const ProcessSection = React.lazy(() =>
  import('./components/sections/ProcessSection').then((m) => ({ default: m.ProcessSection }))
);
const Footer = React.lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);

// Code-split heavy modals and pages to minimize initial JavaScript bundle and main-thread execution time
const CasinoDetailModal = React.lazy(() =>
  import('./components/modals/CasinoDetailModal').then((m) => ({ default: m.CasinoDetailModal }))
);
const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const PostDetailPage = React.lazy(() =>
  import('./components/community/PostDetailPage').then((m) => ({ default: m.PostDetailPage }))
);
const PostEditorPage = React.lazy(() =>
  import('./components/community/PostEditorPage').then((m) => ({ default: m.PostEditorPage }))
);

const preloadAdmin = () => {
  import('./components/admin/AdminDashboard');
};

const MainAppContent: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    selectedPost,
    setSelectedPost,
    selectedCasino,
    isPostEditorOpen,
    editingPost,
    closePostEditor,
    activeInfoModal,
    setActiveInfoModal,
  } = useSite();

  const handleBackToCommunity = () => {
    const isPromotion = selectedPost?.category === '프로모션';
    const targetId = isPromotion ? 'promotion' : 'community';
    const targetHash = isPromotion ? '#promotion' : '#community';

    setSelectedPost(null);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('oasis_current_board', targetId);
        window.history.replaceState({ section: targetId, originSection: targetId }, '', `${window.location.pathname}${targetHash}`);
      } catch {}

      let attempts = 0;
      const scrollToSection = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          if (Math.abs(elementPosition - headerOffset) > 8) {
            const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
            window.scrollTo({ top: offsetPosition, behavior: 'instant' as ScrollBehavior });
          }
        }
        if (attempts < 30) {
          attempts++;
          setTimeout(scrollToSection, attempts < 5 ? 25 : 80);
        }
      };

      requestAnimationFrame(() => {
        scrollToSection();
      });
    }
  };

  const handleCloseEditor = () => {
    closePostEditor();
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `${window.location.pathname}#community`);
      requestAnimationFrame(() => {
        const element = document.getElementById('community');
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
          window.scrollTo({ top: offsetPosition, behavior: 'instant' as ScrollBehavior });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }
      });
    }
  };

  const handleSavedPost = (savedPost: any) => {
    closePostEditor();
    if (savedPost && savedPost.id) {
      setSelectedPost(savedPost);
    } else {
      handleBackToCommunity();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col relative selection:bg-[#30308A] selection:text-white">
      {/* Dynamic SEO & URL Route Manager */}
      <SEOManager />

      {/* Top Header */}
      {!isPostEditorOpen && <Header />}

      {/* Main Content Area: Dedicated Standard Pages or Main Landing Sections */}
      <main className="flex-1 w-full">
        {isPostEditorOpen ? (
          /* 1. Dedicated Full-Page Post Editor (Admin Only Studio UX) */
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-3 border-[#30308A] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <PostEditorPage
              postToEdit={editingPost}
              onClose={handleCloseEditor}
              onSaved={handleSavedPost}
            />
          </Suspense>
        ) : selectedPost ? (
          /* 2. Dedicated Full-Page Post Detail (Standard Article Page & SEO Perfect) */
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-3 border-[#30308A] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <PostDetailPage
              post={selectedPost}
              onBack={handleBackToCommunity}
            />
          </Suspense>
        ) : activeInfoModal === 'about' ? (
          /* Dedicated View for About Oasis (Accessed via Menu) */
          <div className="w-full bg-white min-h-[85vh] animate-in fade-in duration-200">
            {/* Top Navigation Bar with Back Button */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setActiveInfoModal(null);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState({ section: 'home' }, '', window.location.pathname);
                    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#30308A] hover:text-white text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>메인화면으로 돌아가기</span>
              </button>
              <span className="text-xs sm:text-sm font-extrabold text-[#30308A] font-montserrat tracking-wider">
                ABOUT OASIS AGENT
              </span>
            </div>
            <Suspense
              fallback={
                <div className="min-h-[50vh] flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-[#30308A] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <AboutSection />
            </Suspense>
          </div>
        ) : activeInfoModal === 'process' ? (
          /* Dedicated View for VIP Service Process (Accessed via Menu) */
          <div className="w-full bg-slate-50 min-h-[85vh] animate-in fade-in duration-200">
            {/* Top Navigation Bar with Back Button */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setActiveInfoModal(null);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState({ section: 'home' }, '', window.location.pathname);
                    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#30308A] hover:text-white text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>메인화면으로 돌아가기</span>
              </button>
              <span className="text-xs sm:text-sm font-extrabold text-[#30308A] font-montserrat tracking-wider">
                VIP SERVICE PROCESS
              </span>
            </div>
            <Suspense
              fallback={
                <div className="min-h-[50vh] flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-[#30308A] border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <ProcessSection />
            </Suspense>
          </div>
        ) : (
          /* 3. Main Landing Page Sections: Simplified & Streamlined Flow */
          <>
            {/* 1. 메인타이틀 (Hero Slider, LCP Priority Element) */}
            <HeroSection />

            {/* Below-the-fold landing page sections streamed smoothly */}
            <Suspense fallback={null}>
              {/* 2. VIP 서비스 (Philippines Travel & VIP Care) */}
              <PhilippinesSection />

              {/* 3. 카지노 서비스 (Casino Intro) */}
              <CasinoSection />

              {/* 4. 프로모션 (Promotion Board) */}
              <PromotionSection />

              {/* 5. 커뮤니티 (Community Board) */}
              <CommunitySection />
            </Suspense>
          </>
        )}
      </main>

      {/* Footer */}
      {!isPostEditorOpen && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}

      {/* Signature Sticky Bottom Floating Bar (KakaoTalk & Telegram 1-click) */}
      {!isPostEditorOpen && <BottomFloatingBar />}

      {/* Modals & Dialogs (Loaded on-demand to optimize First Contentful Paint & TTI) */}
      <Suspense fallback={null}>
        {selectedCasino && <CasinoDetailModal />}
        {isAdminOpen && <AdminDashboard />}
      </Suspense>

      {/* Floating Side Admin Mode Quick Trigger */}
      {!isPostEditorOpen && (
        <div className="fixed right-4 bottom-24 z-40 hidden sm:block">
          <button
            onClick={() => setIsAdminOpen(true)}
            onMouseEnter={preloadAdmin}
            onFocus={preloadAdmin}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            title="관리자 CMS 대시보드 열기"
            aria-label="관리자 CMS 대시보드 열기"
            id="btn-floating-admin-cms"
          >
            <Settings className="w-3.5 h-3.5 text-[#E5B54F] group-hover:rotate-90 transition-transform duration-300" />
            <span>관리자 CMS</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <MainAppContent />
      </SiteProvider>
    </ErrorBoundary>
  );
}
