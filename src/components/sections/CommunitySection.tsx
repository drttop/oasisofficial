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
  Sparkles,
  Camera,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';

export const CommunitySection: React.FC = () => {
  const { posts, setSelectedPost, incrementPostView, siteConfig } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['전체', '커뮤니티', '공지사항', '프로모션', 'VIP매거진'];

  const filteredPosts = posts.filter((post) => {
    const matchCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleOpenPost = (post: PostItem) => {
    incrementPostView(post.id);
    setSelectedPost(post);
  };

  const categoryColorMap: Record<string, string> = {
    커뮤니티: 'bg-blue-50 text-blue-600 border-blue-200',
    공지사항: 'bg-red-50 text-red-600 border-red-200',
    프로모션: 'bg-amber-50 text-amber-600 border-amber-200',
    VIP매거진: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <section id="community" className="py-20 sm:py-28 bg-white text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <FileText className="w-3.5 h-3.5" />
            <span>OASIS VIP COMMUNITY & MAGAZINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {siteConfig.communityTitle || '오아시스 공식 커뮤니티 & VIP 소식'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed text-balance mx-auto">
            {siteConfig.communitySubtitle || '최신 카지노 프로모션, 특급 호텔 이벤트, 마닐라/클락 VIP 여행 팁 및 공식 공지사항을 확인하세요.'}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#30308A] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#30308A] focus:bg-white transition-all"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const cardImage = (post.images && post.images.length > 0) ? post.images[0] : post.thumbnail;
              const hasMultiplePhotos = (post.images && post.images.length > 1);

              return (
                <a
                  key={post.id}
                  href={getPostUrl(post.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPost(post);
                  }}
                  className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-[#30308A]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group no-underline text-inherit block"
                  title={`${post.title} 자세히 보기`}
                >
                  {/* Thumbnail if present */}
                  {cardImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={cardImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full shadow">
                            <Pin className="w-3 h-3" />
                            중요
                          </span>
                        )}
                      </div>

                      {/* Multiple Photos Indicator Badge */}
                      {hasMultiplePhotos && (
                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow">
                            <Camera className="w-3 h-3 text-[#E5B54F]" />
                            <span>사진 2장</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {!cardImage && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {post.category}
                          </span>
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                              <Pin className="w-3 h-3" />
                              중요
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#30308A] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.summary || post.content}
                      </p>
                    </div>

                    {/* Meta footer */}
                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[90px]">{post.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          조회 {post.viewCount}
                        </span>
                      </div>

                      <span className="text-[#30308A] font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        읽기
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

