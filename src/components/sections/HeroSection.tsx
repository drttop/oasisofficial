import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import { Crown } from 'lucide-react';

const FALLBACK_HERO_IMAGE = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=2000&q=80';

export const HeroSection: React.FC = () => {
  const { bannerSlides } = useSite();
  const [imgSrc, setImgSrc] = useState<string>('');
  
  // Use only the 1st slide
  const slide = bannerSlides && bannerSlides.length > 0 ? bannerSlides[0] : null;

  const currentBg = imgSrc || (slide?.bgImage ? (
    slide.bgImage.includes('/assets/') || slide.bgImage.includes('oasis_gold_hero') 
      ? '/images/hero_bg.webp' 
      : slide.bgImage
  ) : '/images/hero_bg.webp');

  if (!slide) return null;

  const isLocalHero = currentBg.includes('hero_bg');

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[100dvh] flex items-center justify-center"
    >
      {/* Background Image - LCP Element */}
      <div className="absolute inset-0">
        <picture className="w-full h-full">
          {isLocalHero && (
            <>
              <source media="(max-width: 640px)" srcSet="/images/hero_bg_mobile.webp" type="image/webp" width="640" height="360" />
              <source media="(min-width: 641px)" srcSet="/images/hero_bg.webp" type="image/webp" width="1376" height="768" />
            </>
          )}
          <img
            src={currentBg}
            alt={slide.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1376}
            height={768}
            onError={() => {
              if (currentBg !== '/images/hero_bg.jpg') {
                setImgSrc('/images/hero_bg.jpg');
              } else {
                setImgSrc(FALLBACK_HERO_IMAGE);
              }
            }}
            className="w-full h-full object-cover object-center transform scale-105 transition-opacity duration-700"
            referrerPolicy="no-referrer"
          />
        </picture>
        {/* Subtle contrast dark gradient for luxury table atmosphere and crisp legibility */}
        <div className="absolute inset-0 bg-slate-950/65 via-slate-950/50 to-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />
      </div>

      {/* Hero Content Container - Center Aligned */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col items-center text-center -translate-y-6 sm:-translate-y-12 lg:-translate-y-14 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Certified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E5B54F] text-xs font-bold tracking-wider uppercase mb-6 shadow-lg break-keep">
          <Crown className="w-3.5 h-3.5 text-[#E5B54F] shrink-0" />
          <span>{slide.badge || 'PAGCOR OFFICIAL CERTIFIED VIP AGENCY'}</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.25] drop-shadow-xl max-w-4xl mx-auto mb-6 break-keep whitespace-pre-line">
          {slide.title.replace('필리핀 카지노 공식 VIP 에이전트', '필리핀 카지노 공식\nVIP 에이전트').split('\n').map((line, lIdx, arr) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto mb-10 drop-shadow break-keep whitespace-pre-line">
          {slide.subtitle.split('\n').map((line, lIdx, arr) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>

        {/* VIP Key Service Pillars Bar */}
        <div className="w-full max-w-3xl pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center backdrop-blur-[2px] break-keep">
          <div className="space-y-1">
            <span className="text-[#E5B54F] font-bold block text-sm sm:text-base tracking-wide">100% 무료</span>
            <span className="text-slate-300 text-xs break-keep">5성급 스위트룸 바우처</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#E5B54F] font-bold block text-sm sm:text-base tracking-wide">FAST-TRACK</span>
            <span className="text-slate-300 text-xs break-keep">공항 전용 패스트트랙</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#E5B54F] font-bold block text-sm sm:text-base tracking-wide">1:1 전담의전</span>
            <span className="text-slate-300 text-xs break-keep">최고급 알파드 리무진</span>
          </div>
          <div className="space-y-1">
            <span className="text-[#E5B54F] font-bold block text-sm sm:text-base tracking-wide">10년 무사고</span>
            <span className="text-slate-300 text-xs break-keep">실시간 투명 정산 원칙</span>
          </div>
        </div>
      </div>
    </section>
  );
};
