import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { PostItem } from '../../types';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Tag,
  Share2,
  Check,
  Copy,
  Link as LinkIcon,
  Maximize2,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Send,
  Pin,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';
import { parsePostContent, FormattedPostContent } from '../../utils/postContent';
import { GoogleMapEmbed } from './GoogleMapEmbed';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface PostDetailPageProps {
  post: PostItem;
  onBack: () => void;
  onEdit?: () => void;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({
  post,
  onBack,
  onEdit,
}) => {
  const { posts, setSelectedPost, siteConfig, incrementPostView, openPostEditor } = useSite();
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const postUrl = getPostUrl(post.id);

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const input = document.createElement('input');
        input.value = postUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const categoryColorMap: Record<string, string> = {
    공지사항: 'bg-red-50 text-red-600 border-red-200',
    프로모션: 'bg-amber-50 text-amber-600 border-amber-200',
    VIP매거진: 'bg-purple-50 text-purple-600 border-purple-200',
    커뮤니티: 'bg-blue-50 text-blue-600 border-blue-200',
    카지노소식: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    여행정보: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  // Determine images to show (prefer images array, fallback to thumbnail)
  const displayImages: string[] =
    post.images && post.images.length > 0
      ? post.images.slice(0, 6)
      : post.thumbnail
      ? [post.thumbnail]
      : [];

  // Parse body content for inline photos like [사진1], [사진2] and maps [지도:...]
  const contentSegments = parsePostContent(post.content, displayImages, post.mapLocation);
  const inlineImageIndices = new Set(
    contentSegments
      .filter((s) => s.type === 'image' && s.imageIndex !== undefined)
      .map((s) => s.imageIndex as number)
  );
  const hasInlineMap = contentSegments.some((s) => s.type === 'map');

  // If NO photos were placed in the body with tags, show the top gallery
  const showTopGallery = inlineImageIndices.size === 0 && displayImages.length > 0;

  // Unplaced photos (uploaded but not tagged in body)
  const unplacedImages = displayImages.filter((_, idx) => !inlineImageIndices.has(idx));

  // Previous & Next posts navigation
  const currentIndex = posts.findIndex((p) => String(p.id) === String(post.id));
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="w-full bg-slate-50/70 min-h-screen py-6 sm:py-10 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#30308A] hover:text-white text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer group shadow-2xs"
              title="커뮤니티 게시글 목록으로 돌아가기"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>커뮤니티 목록으로</span>
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>홈</span>
              <span>/</span>
              <span className="hover:text-slate-600 cursor-pointer" onClick={onBack}>커뮤니티</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">{post.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Post Button (if onEdit provided) */}
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-[#30308A] bg-white hover:bg-slate-50 text-slate-700 hover:text-[#30308A] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="게시글 수정하기"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#30308A]" />
                <span className="hidden sm:inline">글 수정</span>
              </button>
            )}

            {/* Share / Copy URL Button */}
            <button
              type="button"
              onClick={handleCopyUrl}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                copied
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
              title="게시글 고유 주소(URL) 복사"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>URL 복사됨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>공유</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Article Document */}
        <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* Article Header */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  categoryColorMap[post.category] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {post.category}
              </span>
              {post.isPinned && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  <Pin className="w-3 h-3 fill-red-500" />
                  중요 공지
                </span>
              )}
            </div>

            {/* Article Headline: Semantic Single H1 for the Dedicated Post Article Page */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight">
              {post.title}
            </h1>

            {/* Article Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-[#30308A]/10 text-[#30308A] flex items-center justify-center font-bold text-[11px]">
                    {post.author ? post.author[0] : 'O'}
                  </div>
                  <span>{post.author || '오아시스 VIP'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>조회 {post.viewCount?.toLocaleString() || 0}</span>
                </div>
              </div>

              {/* Direct Canonical URL Badge */}
              <button
                type="button"
                onClick={handleCopyUrl}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#30308A] bg-[#30308A]/5 hover:bg-[#30308A]/10 px-2.5 py-1 rounded-lg cursor-pointer transition-colors border border-[#30308A]/10"
                title="클릭하여 고유 URL 복사"
              >
                <LinkIcon className="w-3 h-3 text-[#30308A]" />
                <span className="font-mono truncate max-w-[200px]">?post={post.id}</span>
                <Copy className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Article Body Container */}
          <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">

            {/* Optional Summary Intro Callout */}
            {post.summary && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-blue-50/40 to-slate-50 border-l-4 border-[#30308A] text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {post.summary}
              </div>
            )}

            {/* Top Photo Gallery (Shown when photos are not placed inline in body) */}
            {showTopGallery && (
              <div className="space-y-3">
                {displayImages.length === 1 ? (
                  <div
                    onClick={() => setZoomedImage(displayImages[0])}
                    className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in max-h-96"
                  >
                    <img
                      src={getOptimizedImageUrl(displayImages[0], 1200, 80)}
                      alt={post.title}
                      className="w-full h-full max-h-96 object-cover group-hover:scale-[1.01] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-2 rounded-xl bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                        <Maximize2 className="w-3.5 h-3.5 text-[#E5B54F]" />
                        클릭하여 사진 크게 보기
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`grid gap-3 sm:gap-4 ${
                      displayImages.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                    }`}
                  >
                    {displayImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        onClick={() => setZoomedImage(imgSrc)}
                        className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in h-48 sm:h-56"
                      >
                        <img
                          src={getOptimizedImageUrl(imgSrc, 700, 75)}
                          alt={`${post.title} - 사진 ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                          사진 {idx + 1}
                        </span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow">
                            <Maximize2 className="w-3.5 h-3.5 text-[#E5B54F]" />
                            확대 보기
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Body Content with Smart Inline Photo & Map Embedding */}
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
              {contentSegments.map((segment, idx) => {
                if (segment.type === 'text') {
                  return (
                    <FormattedPostContent
                      key={idx}
                      content={segment.text || ''}
                      className="whitespace-normal leading-relaxed"
                    />
                  );
                }

                if (segment.type === 'image' && segment.imageUrl) {
                  return (
                    <div
                      key={idx}
                      onClick={() => setZoomedImage(segment.imageUrl!)}
                      className="my-6 group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 bg-slate-950 cursor-zoom-in transition-all"
                    >
                      <img
                        src={getOptimizedImageUrl(segment.imageUrl, 1200, 80)}
                        alt={`${post.title} - ${segment.imageLabel || '본문 사진'}`}
                        className="w-full max-h-[500px] object-cover sm:object-contain bg-slate-950 group-hover:scale-[1.01] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow border border-white/10">
                          <ImageIcon className="w-3.5 h-3.5 text-[#E5B54F]" />
                          {segment.imageLabel || '사진'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-2 rounded-xl bg-black/75 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-sm shadow-lg border border-white/20">
                          <Maximize2 className="w-4 h-4 text-[#E5B54F]" />
                          클릭하여 사진 확대
                        </span>
                      </div>
                    </div>
                  );
                }

                if (segment.type === 'map' && segment.mapQuery) {
                  return (
                    <div key={idx} className="my-6">
                      <GoogleMapEmbed
                        query={segment.mapQuery}
                        title={segment.mapTitle}
                        address={segment.mapAddress}
                        embedUrl={segment.mapEmbedUrl}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Dedicated Google Map Section if not placed inline in text */}
            {post.mapLocation && !hasInlineMap && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#30308A]" />
                  공식 장소 및 찾아오시는 길
                </span>
                <GoogleMapEmbed
                  query={post.mapLocation.query}
                  title={post.mapLocation.title}
                  address={post.mapLocation.address}
                  embedUrl={post.mapLocation.embedUrl}
                />
              </div>
            )}

            {/* Unplaced Attached Photos */}
            {unplacedImages.length > 0 && !showTopGallery && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                  추가 첨부 사진
                </span>
                <div
                  className={`grid gap-3 ${
                    unplacedImages.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                  }`}
                >
                  {unplacedImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setZoomedImage(imgSrc)}
                      className="group relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in h-40 sm:h-48"
                    >
                      <img
                        src={getOptimizedImageUrl(imgSrc, 700, 75)}
                        alt="첨부 사진"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow">
                          <Maximize2 className="w-3.5 h-3.5 text-[#E5B54F]" />
                          확대 보기
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
                <Tag className="w-4 h-4 text-slate-400 mr-1" />
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 24-Hour VIP Private Consultation Callout */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#1E1E4F] to-[#0F0F29] text-white space-y-3.5 shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5B54F]" />
                <h4 className="text-sm sm:text-base font-bold text-[#E5B54F]">
                  오아시스 24시간 VIP 1:1 전담 문의
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                본 게시글과 관련된 특급 호텔 스위트룸 예약, 롤링 1.5% 혜택 및 공항 리무진 의전 상담은 아래 공식 메신저로 24시간 언제든 편하게 문의해 주시기 바랍니다.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <a
                  href={siteConfig.kakaoUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="page-post-kakao-btn"
                  className="py-2.5 px-4 sm:px-5 bg-[#FEE500] hover:bg-[#fae100] text-slate-950 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-amber-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-900" />
                  <span>카카오톡 1:1 상담</span>
                </a>
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="page-post-telegram-btn"
                  className="py-2.5 px-4 sm:px-5 bg-[#0274b3] hover:bg-[#026aa2] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border border-sky-400/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>텔레그램 1:1 상담</span>
                </a>
              </div>
            </div>

          </div>

          {/* Article Footer & Previous / Next Navigation */}
          <div className="bg-slate-50/90 border-t border-slate-200/80 p-6 sm:p-8 space-y-6">
            
            {/* Prev / Next Post Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {prevPost ? (
                <div
                  onClick={() => {
                    setSelectedPost(prevPost);
                    incrementPostView(prevPost.id);
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#30308A]/40 hover:shadow-sm cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-[#30308A] shrink-0 transition-transform group-hover:-translate-x-1" />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">이전 게시글</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-[#30308A] transition-colors">
                      {prevPost.title}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200/40 text-slate-400 text-xs flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4 opacity-40" />
                  <span>이전 게시글이 없습니다</span>
                </div>
              )}

              {nextPost ? (
                <div
                  onClick={() => {
                    setSelectedPost(nextPost);
                    incrementPostView(nextPost.id);
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#30308A]/40 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between gap-3 text-right group"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-slate-400 block mb-0.5">다음 게시글</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-[#30308A] transition-colors">
                      {nextPost.title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#30308A] shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-100/50 border border-slate-200/40 text-slate-400 text-xs flex items-center justify-end gap-2 text-right">
                  <span>다음 게시글이 없습니다</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-xl bg-[#30308A] hover:bg-[#25256e] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>커뮤니티 목록으로 돌아가기</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-slate-500" />
                <span>맨 위로</span>
              </button>
            </div>

          </div>

        </article>

      </div>

      {/* Full-Screen Image Lightbox Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img
              src={zoomedImage}
              alt="확대 사진"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 text-white/90 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>닫기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
