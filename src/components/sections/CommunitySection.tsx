import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  FileText,
  Search,
  Pin,
  Eye,
  User,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  MapPin,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';
import { isMapInContent, stripFormattingTags } from '../../utils/postContent';
import { getResponsiveImageProps } from '../../utils/imageOptimizer';

const POSTS_PER_PAGE = 9;

const COMMUNITY_CATEGORIES = [
  { id: 'all', label: '전체보기' },
  { id: '매거진', label: '매거진' },
  { id: '유흥', label: '유흥' },
  { id: '맛집', label: '맛집' },
  { id: '핫플', label: '핫플' },
] as const;

export const CommunitySection: React.FC = () => {
  const { posts, setSelectedPost, incrementPostView, siteConfig, restoreAllPostsAndImages } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Exclude '공지사항' and '프로모션' (프로모션 is in its own dedicated board)
  const communityPosts = posts.filter(
    (post) => post.category !== '공지사항' && post.category !== '프로모션'
  );

  // Deduplicate strictly by unique post ID so no duplicate cards can ever be rendered
  const seenIds = new Set<string>();
  const uniqueCommunityPosts = communityPosts.filter((post) => {
    if (!post.id) return false;
    if (seenIds.has(post.id)) return false;
    seenIds.add(post.id);
    return true;
  });

  const categoryFilteredPosts = uniqueCommunityPosts.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  const filteredPosts = categoryFilteredPosts.filter((post) => {
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

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('community');
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
        sessionStorage.setItem('oasis_current_board', 'community');
        sessionStorage.setItem('oasis_last_post_category', post.category);
        window.history.replaceState(
          { section: 'community', originSection: 'community' },
          '',
          `${window.location.pathname}#community`
        );
      } catch {}
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    setSelectedPost(post);
  };

  const categoryColorMap: Record<string, string> = {
    매거진: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    유흥: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
    맛집: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    핫플: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    VIP매거진: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
    커뮤니티: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
  };

  return (
    <section id="community" className="py-10 sm:py-20 bg-white text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <FileText className="w-3.5 h-3.5" />
            <span>OASIS VIP COMMUNITY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {siteConfig.communityTitle &&
            siteConfig.communityTitle !== '오아시스 공지사항 & 프로모션 소식' &&
            siteConfig.communityTitle !== '오아시스 공식 커뮤니티 & VIP 소식'
              ? siteConfig.communityTitle
              : '오아시스 VIP 커뮤니티'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-balance mx-auto">
            {siteConfig.communitySubtitle && !siteConfig.communitySubtitle.includes('공지사항')
              ? siteConfig.communitySubtitle
              : '마닐라 & 클락 VIP 호텔, 골프, 파인다이닝 여행 정보 및 현지 생생한 소식을 확인하세요.'}
          </p>
        </div>

        {/* Category Filter Tabs & Search Bar Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {COMMUNITY_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? uniqueCommunityPosts.length
                  : uniqueCommunityPosts.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#30308A] text-white shadow-md shadow-[#30308A]/25 border border-[#30308A]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30308A] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Posts List / Magazine Cards */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">
              {searchQuery
                ? '검색 조건에 일치하는 게시글이 없습니다.'
                : selectedCategory !== 'all'
                ? `'${selectedCategory}' 카테고리에 등록된 게시글이 없습니다.`
                : '표시할 커뮤니티 게시글이 없습니다.'}
            </p>
            {searchQuery || selectedCategory !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                전체보기로 돌아가기
              </button>
            ) : (
              <button
                type="button"
                onClick={() => restoreAllPostsAndImages()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#30308A] text-white text-xs font-bold hover:bg-[#25256e] transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>커뮤니티 글 & 이미지 즉시 복원하기</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {paginatedPosts.map((post) => {
              const cardImage = post.thumbnail || (post.images && post.images.length > 0 ? post.images[0] : '');
              const hasMultiplePhotos = (post.images && post.images.length > 1);
              const hasMap = Boolean(post.mapLocation || isMapInContent(post.content));

              return (
                <a
                  key={post.id}
                  href={getPostUrl(post.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPost(post);
                  }}
                  className="bg-slate-50 hover:bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 hover:border-[#30308A]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group no-underline text-inherit block"
                  title={`${post.title} 자세히 보기`}
                >
                  {/* Thumbnail if present */}
                  {cardImage && (
                    <div className="relative h-28 min-[420px]:h-36 sm:h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        {...getResponsiveImageProps(cardImage, 600, '(max-width: 640px) 380px, (max-width: 1024px) 50vw, 380px')}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={360}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span
                          className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold border ${
                            categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold text-white bg-red-600 px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                            <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="hidden min-[380px]:inline">중요</span>
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
                          <span
                            className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold border ${
                              categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] min-[400px]:text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-red-100">
                              <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden min-[380px]:inline">중요</span>
                            </span>
                          )}
                          {hasMap && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[11px] font-bold text-[#30308A] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-200/60">
                              <MapPin className="w-2.5 h-2.5 text-[#E5B54F]" />
                              <span>지도</span>
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-xs min-[400px]:text-sm sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-[#30308A] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-[11px] min-[400px]:text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {stripFormattingTags(post.summary || post.content)}
                      </p>
                    </div>

                    {/* Meta footer */}
                    <div className="pt-1.5 sm:pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1 sm:gap-3 truncate">
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{post.viewCount}</span>
                        </span>
                        <span className="hidden min-[400px]:inline text-slate-400">·</span>
                        <span className="hidden min-[400px]:inline truncate max-w-[60px] sm:max-w-[90px]">
                          {post.author}
                        </span>
                      </div>

                      <span className="text-[#30308A] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[10px] sm:text-xs flex-shrink-0">
                        읽기
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
            <div className="mt-10 sm:mt-12 flex items-center justify-center gap-1.5 sm:gap-2">
              {/* Prev button */}
              <button
                onClick={() => handlePageChange(Math.max(1, validCurrentPage - 1))}
                disabled={validCurrentPage === 1}
                className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs sm:text-sm font-semibold cursor-pointer"
                aria-label="이전 페이지"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">이전</span>
              </button>

              {/* Page Numbers: 1, 2, 3, 4 ... */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[36px] sm:min-w-[42px] h-9 sm:h-10 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    validCurrentPage === pageNum
                      ? 'bg-[#30308A] text-white shadow-md shadow-[#30308A]/20 scale-105'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, validCurrentPage + 1))}
                disabled={validCurrentPage === totalPages}
                className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-xs sm:text-sm font-semibold cursor-pointer"
                aria-label="다음 페이지"
              >
                <span className="hidden sm:inline">다음</span>
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

