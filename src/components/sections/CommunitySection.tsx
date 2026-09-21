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
import { isMapInContent } from '../../utils/postContent';

const POSTS_PER_PAGE = 8;

export const CommunitySection: React.FC = () => {
  const { posts, setSelectedPost, incrementPostView, siteConfig } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = ['전체', '공지사항', '프로모션', 'VIP매거진'];

  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (validCurrentPage - 1) * POSTS_PER_PAGE,
    validCurrentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenPost = (post: PostItem) => {
    incrementPostView(post.id);
    setSelectedPost(post);
  };

  const categoryColorMap: Record<string, string> = {
    커뮤니티: 'bg-blue-100 text-blue-900 border-blue-300 font-bold',
    공지사항: 'bg-red-100 text-red-900 border-red-300 font-bold',
    프로모션: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
    VIP매거진: 'bg-purple-100 text-purple-900 border-purple-300 font-bold',
  };

  return (
    <section id="community" className="py-10 sm:py-20 bg-white text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <FileText className="w-3.5 h-3.5" />
            <span>OASIS VIP COMMUNITY & MAGAZINE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            <span className="sm:hidden">
              오아시스 공지사항 &amp;
              <br />
              프로모션 소식
            </span>
            <span className="hidden sm:inline">
              {(!siteConfig.communityTitle || siteConfig.communityTitle === '오아시스 공식 커뮤니티 & VIP 소식')
                ? '오아시스 공지사항 & 프로모션 소식'
                : siteConfig.communityTitle}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-balance mx-auto">
            {siteConfig.communitySubtitle || '최신 카지노 프로모션, 특급 호텔 이벤트, 마닐라/클락 VIP 여행 팁 및 공식 공지사항을 확인하세요.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 mb-3.5 sm:mb-6 pb-2.5 sm:pb-3.5 border-b border-slate-100">
          {/* Categories */}
          <div className="flex items-center gap-1.5 sm:gap-4 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex-1 sm:flex-none px-2 sm:px-7 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold min-w-0 sm:min-w-[104px] text-center whitespace-nowrap transition-all cursor-pointer tracking-tight min-[390px]:tracking-normal sm:tracking-[0.1em] ${
                  selectedCategory === cat
                    ? 'bg-[#30308A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/90 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="제목, 내용 검색..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30308A] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Posts List / Magazine Cards */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">검색 조건에 일치하는 게시글이 없습니다.</p>
            <p className="text-xs text-slate-400">다른 키워드 또는 카테고리를 선택해 보세요.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {paginatedPosts.map((post) => {
              const cardImage = (post.images && post.images.length > 0) ? post.images[0] : post.thumbnail;
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
                    <div className="relative h-28 sm:h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={cardImage}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={360}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                        <span
                          className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${
                            categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold text-white bg-red-600 px-1.5 sm:px-2 py-0.5 rounded-full shadow">
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
                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-full shadow">
                            <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#E5B54F]" />
                            <span>사진 {post.images!.length}장</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                    <div className="space-y-1 sm:space-y-2">
                      {!cardImage && (
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2 flex-wrap">
                          <span
                            className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${
                              categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-red-100">
                              <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden min-[380px]:inline">중요</span>
                            </span>
                          )}
                          {hasMap && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-[#30308A] bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-200/60">
                              <MapPin className="w-2.5 h-2.5 text-[#E5B54F]" />
                              <span>지도</span>
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-xs sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-[#30308A] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {post.summary || post.content}
                      </p>
                    </div>

                    {/* Meta footer */}
                    <div className="pt-2 sm:pt-3 border-t border-slate-200/80 flex items-center justify-between text-[10px] sm:text-xs text-slate-600 font-medium">
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

                      <span className="text-[#30308A] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-[11px] sm:text-xs flex-shrink-0">
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

