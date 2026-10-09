import React, { Suspense } from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { HeroSection } from './components/sections/HeroSection';
import { BottomFloatingBar } from './components/BottomFloatingBar';
import { SEOManager } from './components/SEOManager';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Settings } from 'lucide-react';
import { navigateToSection } from './utils/navigation';

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

    setSelectedPost(null);
    navigateToSection(targetId, { replace: true });
  };

  const handleCloseEditor = () => {
    closePostEditor();
    navigateToSection('community', { replace: true });
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
