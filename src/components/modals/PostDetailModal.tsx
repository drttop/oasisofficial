import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import {
  X,
  Eye,
  User,
  Tag,
  MessageCircle,
  Send,
  Pin,
  Share2,
  Check,
  Copy,
  Link as LinkIcon,
  Maximize2,
  Image as ImageIcon,
  MapPin,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';
import { parsePostContent } from '../../utils/postContent';
import { GoogleMapEmbed } from '../community/GoogleMapEmbed';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export const PostDetailModal: React.FC = () => {
  const { selectedPost, setSelectedPost, siteConfig } = useSite();
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  if (!selectedPost) return null;

  const postUrl = getPostUrl(selectedPost.id);

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
    selectedPost.images && selectedPost.images.length > 0
      ? selectedPost.images.slice(0, 6)
      : selectedPost.thumbnail
      ? [selectedPost.thumbnail]
      : [];

  // Parse body content for inline photos like [사진1], [사진2] and maps [지도:...]
  const contentSegments = parsePostContent(selectedPost.content, displayImages, selectedPost.mapLocation);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                categoryColorMap[selectedPost.category] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {selectedPost.category}
            </span>
            {selectedPost.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                <Pin className="w-3 h-3" />
                중요 공지
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy URL Button */}
            <button
              onClick={handleCopyUrl}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                copied
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
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
                  <span>공유 / URL 복사</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedPost(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Post Title */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {selectedPost.title}
            </h2>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>조회 {selectedPost.viewCount}</span>
                </div>
              </div>

              {/* Dynamic Canonical URL preview badge */}
              <div
                onClick={handleCopyUrl}
                className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#30308A] bg-[#30308A]/5 hover:bg-[#30308A]/10 px-2.5 py-1 rounded-md cursor-pointer transition-colors"
                title="클릭하여 고유 URL 복사"
              >
                <LinkIcon className="w-3 h-3 text-[#30308A]" />
                <span className="font-mono truncate max-w-[200px]">?post={selectedPost.id}</span>
                <Copy className="w-2.5 h-2.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Uploaded Photos Top Gallery (Shown only when photos are not placed inline in the body) */}
          {showTopGallery && (
            <div className="space-y-2">
              {displayImages.length === 1 ? (
                // 1 Single Photo Banner
                <div
                  onClick={() => setZoomedImage(displayImages[0])}
                  className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in max-h-80"
                >
                  <img
                    src={getOptimizedImageUrl(displayImages[0], 1000, 80)}
                    alt={selectedPost.title}
                    className="w-full h-full max-h-80 object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow">
                      <Maximize2 className="w-3.5 h-3.5" />
                      클릭하여 크게 보기
                    </span>
                  </div>
                </div>
              ) : (
                // 2 to 6 Photos Grid
                <div className={`grid gap-3 ${
                  displayImages.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                }`}>
                  {displayImages.map((imgSrc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setZoomedImage(imgSrc)}
                      className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in h-44 sm:h-52"
                    >
                      <img
                        src={getOptimizedImageUrl(imgSrc, 600, 75)}
                        alt={`${selectedPost.title} - 사진 ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                        사진 {idx + 1}
                      </span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow">
                          <Maximize2 className="w-3.5 h-3.5" />
                          확대 보기
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Summary Box */}
          {selectedPost.summary && (
            <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#30308A] text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
              {selectedPost.summary}
            </div>
          )}

          {/* Body Content with Inline Photos Support */}
          <div className="text-slate-800 text-sm sm:text-[15px] leading-relaxed space-y-4">
            {contentSegments.map((segment, idx) => {
              if (segment.type === 'text') {
                return (
                  <div key={idx} className="whitespace-pre-line leading-relaxed">
                    {segment.text}
                  </div>
                );
              }

              if (segment.type === 'image' && segment.imageUrl) {
                return (
                  <div
                    key={idx}
                    onClick={() => setZoomedImage(segment.imageUrl!)}
                    className="my-5 group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 bg-slate-950 cursor-zoom-in transition-all"
                  >
                    <img
                      src={getOptimizedImageUrl(segment.imageUrl, 1000, 80)}
                      alt={`${selectedPost.title} - ${segment.imageLabel || '본문 사진'}`}
                      className="w-full max-h-[440px] object-cover sm:object-contain bg-slate-950 group-hover:scale-[1.01] transition-transform duration-300"
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
                  <div key={idx} className="my-5">
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

          {/* Dedicated Map Section if not placed inline */}
          {selectedPost.mapLocation && !hasInlineMap && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#30308A]" />
                위치 및 찾아오시는 길
              </span>
              <GoogleMapEmbed
                query={selectedPost.mapLocation.query}
                title={selectedPost.mapLocation.title}
                address={selectedPost.mapLocation.address}
                embedUrl={selectedPost.mapLocation.embedUrl}
              />
            </div>
          )}

          {/* Unplaced Photos (Uploaded by admin but not inserted into text body) */}
          {unplacedImages.length > 0 && !showTopGallery && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                첨부 사진
              </span>
              <div className={`grid gap-3 ${
                unplacedImages.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}>
                {unplacedImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomedImage(imgSrc)}
                    className="group relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 cursor-zoom-in h-36 sm:h-44"
                  >
                    <img
                      src={getOptimizedImageUrl(imgSrc, 600, 75)}
                      alt="첨부 사진"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm shadow">
                        <Maximize2 className="w-3.5 h-3.5" />
                        확대 보기
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {selectedPost.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* VIP Support Banner inside post */}
          <div className="p-5 rounded-2xl bg-[#1E1E4F] text-white space-y-3">
            <h4 className="text-sm font-bold text-[#E5B54F]">
              오아시스 24시간 VIP 실시간 상담 문의
            </h4>
            <p className="text-xs text-slate-300">
              본 게시글과 관련된 세부 혜택 및 카지노 예약/의전은 아래 1:1 채널로 즉시 상담 가능합니다.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={siteConfig.kakaoUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-post-kakao-btn"
                className="py-2.5 px-4 bg-[#FEE500] hover:bg-[#fae100] text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-300 transition-all hover:scale-105"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-slate-900" />
                <span>카카오톡 문의</span>
              </a>
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-post-telegram-btn"
                className="py-2.5 px-4 bg-[#0274b3] hover:bg-[#026aa2] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-400/40 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>텔레그램 문의</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopyUrl}
            className="text-xs text-slate-600 hover:text-[#30308A] font-semibold flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '고유 주소가 복사되었습니다' : '게시글 링크 공유'}</span>
          </button>
          
          <button
            onClick={() => setSelectedPost(null)}
            className="px-5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 cursor-pointer"
          >
            닫기
          </button>
        </div>

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
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 flex items-center gap-1 text-xs font-bold"
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

