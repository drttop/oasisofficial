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
  Image as ImageIcon,
  MapPin,
} from 'lucide-react';
import { getPostUrl } from '../../utils/seo';
import { isPhotoInContent, isMapInContent, FormattedPostContent } from '../../utils/postContent';
import { GoogleMapEmbed } from '../community/GoogleMapEmbed';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { initialPosts } from '../../data/initialData';

export const PostDetailModal: React.FC = () => {
  const { selectedPost, setSelectedPost, siteConfig } = useSite();
  const [copied, setCopied] = useState(false);

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
    매거진: 'bg-purple-50 text-purple-600 border-purple-200',
    유흥: 'bg-rose-50 text-rose-600 border-rose-200',
    맛집: 'bg-amber-50 text-amber-600 border-amber-200',
    핫플: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    프로모션: 'bg-amber-50 text-amber-600 border-amber-200',
    VIP매거진: 'bg-purple-50 text-purple-600 border-purple-200',
    커뮤니티: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  // Determine images to show strictly from the post
  const rawImages = (selectedPost.images && selectedPost.images.length > 0)
    ? selectedPost.images
    : (selectedPost.thumbnail ? [selectedPost.thumbnail] : []);

  const displayImages: string[] = rawImages.slice(0, 6);

  // Detect which photos are placed inline in body with [사진1] ~ [사진6]
  const inlineImageIndices = new Set(
    displayImages
      .map((_, idx) => (isPhotoInContent(selectedPost.content, idx) ? idx : -1))
      .filter((idx) => idx !== -1)
  );
  const hasInlineMap = isMapInContent(selectedPost.content);

  // If NO photos were placed in the body with tags, show the top gallery
  const showTopGallery = inlineImageIndices.size === 0 && displayImages.length > 0;

  // Unplaced photos (uploaded but not tagged in body)
  const unplacedImages = displayImages.filter((_, idx) => !inlineImageIndices.has(idx));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                categoryColorMap[selectedPost.category] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {selectedPost.category}
            </span>
            {selectedPost.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                <Pin className="w-3 h-3" />
                중요 공지
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share / Copy URL Button */}
            <button
              onClick={handleCopyUrl}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Post Title */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {selectedPost.title}
            </h2>
            
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 mt-3 pt-3">
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
                className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#30308A] bg-[#30308A]/5 hover:bg-[#30308A]/10 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
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
            <div className="space-y-4 sm:space-y-6 w-full max-w-full lg:max-w-[760px] mx-auto">
              {displayImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="oasis-post-gallery-wrap w-full flex items-center justify-center mx-auto"
                >
                  <img
                    src={imgSrc}
                    alt={`${selectedPost.title} - 사진 ${idx + 1}`}
                    onLoad={(e) => {
                      const target = e.currentTarget;
                      if (target.naturalHeight > target.naturalWidth) {
                        target.classList.add('is-portrait');
                        if (target.parentElement) target.parentElement.classList.add('is-portrait');
                      }
                    }}
                    className="oasis-post-gallery-img h-auto w-full lg:w-auto max-w-full lg:max-w-[760px] object-contain mx-auto rounded-xl sm:rounded-2xl block"
                    style={{ backgroundColor: 'transparent' }}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = initialPosts.find((p) => p.id === selectedPost.id);
                      if (fallback?.images?.[idx] && target.src !== fallback.images[idx]) {
                        target.src = fallback.images[idx];
                      } else if (fallback?.thumbnail && target.src !== fallback.thumbnail) {
                        target.src = fallback.thumbnail;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Summary Box */}
          {selectedPost.summary && (
            <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-[#30308A] text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
              {selectedPost.summary}
            </div>
          )}

          {/* Body Content with Full HTML, Tables, Inline Photos & Google Maps Support */}
          <div className="text-slate-800 text-sm sm:text-[15px] leading-relaxed space-y-4">
            <FormattedPostContent
              content={selectedPost.content}
              images={displayImages}
              defaultMap={selectedPost.mapLocation}
            />
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
            <div className="pt-4 border-t border-slate-100 space-y-4 w-full max-w-full lg:max-w-[760px] mx-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#30308A]" />
                첨부 사진
              </span>
              <div className="space-y-4 w-full">
                {unplacedImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="oasis-post-gallery-wrap w-full flex items-center justify-center mx-auto"
                  >
                    <img
                      src={imgSrc}
                      alt="첨부 사진"
                      onLoad={(e) => {
                        const target = e.currentTarget;
                        if (target.naturalHeight > target.naturalWidth) {
                          target.classList.add('is-portrait');
                          if (target.parentElement) target.parentElement.classList.add('is-portrait');
                        }
                      }}
                      className="oasis-post-gallery-img h-auto w-full lg:w-auto max-w-full lg:max-w-[760px] object-contain mx-auto rounded-xl block"
                      style={{ backgroundColor: 'transparent' }}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = initialPosts.find((p) => p.id === selectedPost.id);
                        if (fallback?.images && fallback.images[idx] && target.src !== fallback.images[idx]) {
                          target.src = fallback.images[idx];
                        }
                      }}
                    />
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
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 w-full">
              <a
                href={siteConfig.kakaoUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-post-kakao-btn"
                className="w-full py-2.5 sm:py-3 px-2 sm:px-4 bg-[#FEE500] hover:bg-[#fae100] text-slate-950 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 border border-amber-300 transition-all hover:scale-[1.02] active:scale-95 shadow-sm whitespace-nowrap text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-900 shrink-0" />
                <span className="truncate">카카오톡 상담</span>
              </a>
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-post-telegram-btn"
                className="w-full py-2.5 sm:py-3 px-2 sm:px-4 bg-[#0274b3] hover:bg-[#026aa2] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 border border-sky-400/40 transition-all hover:scale-[1.02] active:scale-95 shadow-sm whitespace-nowrap text-center"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="truncate">텔레그램 상담</span>
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
    </div>
  );
};

