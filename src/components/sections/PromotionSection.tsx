import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  Gift,
  Search,
  Pin,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  MapPin,
  Percent,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';
import { isMapInContent, stripFormattingTags } from '../../utils/postContent';
import { getResponsiveImageProps } from '../../utils/imageOptimizer';

const POSTS_PER_PAGE = 6;

export const PromotionSection: React.FC = () => {
  const { posts, setSelectedPost, incrementPostView, siteConfig } = useSite();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Dedicated Promotion posts filter
  const promotionPosts = posts.filter((post) => post.category === '프로모션');

  const filteredPosts = promotionPosts.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (validCurrentPage - 1) * POSTS_PER_PAGE,
    validCurrentPage * POSTS_PER_PAGE
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('promotion');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = Math.max(0, elementPosition + window.pageYOffset - headerOffset);
      window.scrollTo({ top: offsetPosition, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleOpenPost = (post: PostItem) => {
    incrementPostView(post.id);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('oasis_current_board', 'promotion');
        sessionStorage.setItem('oasis_last_post_category', post.category);
        window.history.replaceState(
          { section: 'promotion', originSection: 'promotion' },
          '',
          `${window.location.pathname}#promotion`
        );
      } catch {}
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    setSelectedPost(post);
  };

  return (
    <section id="promotion" className="py-10 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white scroll-mt-20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5B54F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#30308A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#E5B54F] bg-[#E5B54F]/10 border border-[#E5B54F]/20 uppercase font-montserrat">
            <Sparkles className="w-3.5 h-3.5 text-[#E5B54F]" />
            <span>{siteConfig.promotionBadge || 'EXCLUSIVE PROMOTIONS & EVENTS'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {siteConfig.promotionTitle || '오아시스 VIP 특별 프로모션'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-balance mx-auto">
            {siteConfig.promotionSubtitle ||
              '특급 호텔 스위트룸 무료 숙박 바우처, 항공권 페이백, 롤링 1.5% 정산 등 오아시스 VIP 회원님만의 한정 혜택을 확인하세요.'}
          </p>
        </div>

        {/* Search Bar (Clean and responsive) */}
        <div className="flex items-center justify-end mb-4 sm:mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="프로모션 검색..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E5B54F] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Promotion Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700/80 space-y-3">
            <Gift className="w-10 h-10 mx-auto text-[#E5B54F]/60" />
            <p className="text-sm font-semibold text-slate-200">
              {searchQuery ? '일치하는 프로모션이 없습니다.' : '현재 진행 중인 새로운 프로모션을 준비 중입니다.'}
            </p>
            <p className="text-xs text-slate-400">
              실시간 맞춤 혜택 상담은 24시간 오아시스 고객센터로 문의해 주세요.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {paginatedPosts.map((post) => {
                const cardImage =
                  post.images && post.images.length > 0 ? post.images[0] : post.thumbnail;
                const hasMultiplePhotos = post.images && post.images.length > 1;
                const hasMap = Boolean(post.mapLocation || isMapInContent(post.content));

                return (
                  <a
                    key={post.id}
                    href={getPostUrl(post.id)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenPost(post);
                    }}
                    className="bg-slate-800/90 hover:bg-slate-800 rounded-xl sm:rounded-2xl border border-slate-700/80 hover:border-[#E5B54F]/50 shadow-lg hover:shadow-[#E5B54F]/10 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group no-underline text-inherit block"
                    title={`${post.title} 프로모션 확인`}
                  >
                    {/* Thumbnail if present */}
                    {cardImage && (
                      <div className="relative h-28 min-[420px]:h-36 sm:h-48 w-full overflow-hidden bg-slate-950">
                        <img
                          {...getResponsiveImageProps(
                            cardImage,
                            600,
                            '(max-width: 640px) 380px, (max-width: 1024px) 50vw, 380px'
                          )}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          width={600}
                          height={360}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                        <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                          <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold bg-[#E5B54F] text-slate-950 shadow-sm">
                            프로모션
                          </span>
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold text-white bg-red-600 px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                              <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden min-[380px]:inline">추천</span>
                            </span>
                          )}
                          {hasMap && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-white bg-[#30308A]/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow border border-white/20">
                              <MapPin className="w-2.5 h-2.5 text-[#E5B54F]" />
                              <span>지도</span>
                            </span>
                          )}
                        </div>

                        {/* Multiple Photos Indicator Badge */}
                        {hasMultiplePhotos && (
                          <div className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3">
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                              <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E5B54F]" />
                              <span>사진 {post.images!.length}장</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-2.5 min-[400px]:p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-3.5">
                      <div className="space-y-1 sm:space-y-2">
                        {!cardImage && (
                          <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2 flex-wrap">
                            <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold bg-[#E5B54F] text-slate-950">
                              프로모션
                            </span>
                            {post.isPinned && (
                              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold text-white bg-red-600 px-1.5 sm:px-2 py-0.5 rounded-full">
                                <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="hidden min-[380px]:inline">추천</span>
                              </span>
                            )}
                          </div>
                        )}

                        <h3 className="text-xs min-[400px]:text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-[#E5B54F] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-[11px] min-[400px]:text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {stripFormattingTags(post.summary || post.content)}
                        </p>
                      </div>

                      {/* Meta footer */}
                      <div className="pt-1.5 sm:pt-3 border-t border-slate-700/80 flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1 sm:gap-3 truncate">
                          <span className="flex items-center gap-0.5 sm:gap-1">
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>{post.viewCount}</span>
                          </span>
                          <span className="hidden min-[400px]:inline text-slate-600">·</span>
                          <span className="hidden min-[400px]:inline truncate max-w-[60px] sm:max-w-[90px]">
                            {post.author}
                          </span>
                        </div>

                        <span className="text-[#E5B54F] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[10px] sm:text-xs flex-shrink-0">
                          혜택 보기
                          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  disabled={validCurrentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="이전 프로모션 페이지"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all ${
                      validCurrentPage === pageNum
                        ? 'bg-[#E5B54F] text-slate-950 font-black shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  disabled={validCurrentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="다음 프로모션 페이지"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
