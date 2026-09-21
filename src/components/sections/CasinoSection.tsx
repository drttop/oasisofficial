import React from 'react';
import { useSite, sortCasinos } from '../../context/SiteContext';
import { Crown, Sparkles, Eye } from 'lucide-react';
import { getResponsiveImageProps } from '../../utils/imageOptimizer';

export const CasinoSection: React.FC = () => {
  const { casinos, setSelectedCasino, siteConfig } = useSite();

  const casinoBadge = siteConfig.casinoBadge || 'MAJOR CASINO & VIP RESORTS';
  const casinoTitle = siteConfig.casinoTitle || '필리핀 메이저 카지노 공식 제휴 라인업';
  const casinoSubtitle = siteConfig.casinoSubtitle || '오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다.\n스위트룸 무료 숙박 및 프라이빗 VIP 살롱 혜택을 즉시 누려보세요.';

  // Guaranteed order: 1. 오카다 마닐라, 2. 시티오브 드림즈, 3. 솔레어 리조트, 4. 뉴포트월드 리조트, 5. 한카지노, 6. 디하이츠리조트
  const orderedCasinos = sortCasinos(casinos);

  return (
    <section id="casino" className="py-20 sm:py-28 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <Crown className="w-3.5 h-3.5" />
            <span>{casinoBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line break-keep">
            {casinoTitle.replace('필리핀 메이저 카지노 제휴 라인업', '필리핀 메이저 카지노\n제휴 라인업').replace('필리핀 메이저 카지노 공식 제휴 라인업', '필리핀 메이저 카지노\n공식 제휴 라인업')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance whitespace-pre-line">
            {casinoSubtitle}
          </p>
        </div>

        {/* Casino Cards Grid (Sequential Order on both Mobile & Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
          {orderedCasinos.map((casino) => {
            return (
              <div
                key={casino.id}
                id={casino.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-28 min-[380px]:h-36 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    {...getResponsiveImageProps(casino.image, 600, '(max-width: 640px) 380px, (max-width: 1024px) 50vw, 380px')}
                    alt={casino.name}
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1 sm:gap-1.5 flex-wrap items-center">
                    <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#30308A] text-white text-[9px] sm:text-[11px] font-bold">
                      {casino.regionLabel}
                    </span>
                    {casino.isFeatured && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-[#E5B54F] text-slate-950 text-[9px] sm:text-[11px] font-bold flex items-center gap-0.5 sm:gap-1">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden min-[400px]:inline">추천 리조트</span>
                        <span className="min-[400px]:hidden">추천</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 text-white">
                    <h3 className="text-xs min-[360px]:text-sm sm:text-xl font-bold tracking-tight text-white drop-shadow truncate">
                      {casino.name}
                    </h3>
                    <p className="text-[9px] sm:text-xs text-slate-300 font-montserrat truncate">
                      {casino.englishName}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                  <p className="text-[11px] sm:text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {casino.description}
                  </p>

                  {/* Specs List */}
                  <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs border-y border-slate-100 py-1.5 sm:py-3">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">호텔 등급</span>
                      <span className="font-bold text-slate-900">{casino.hotelRating}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">게이밍</span>
                      <span className="font-bold text-slate-900 truncate max-w-[80px] sm:max-w-none text-right">{casino.tableGames}</span>
                    </div>
                  </div>

                  {/* Oasis Benefit Highlight */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[10px] sm:text-[11px] text-amber-900 flex items-start gap-1 sm:gap-1.5">
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium line-clamp-1 min-[380px]:line-clamp-2">{casino.highlights}</span>
                  </div>

                  {/* Card Action Button: 상세보기 */}
                  <div className="pt-1 sm:pt-2">
                    <button
                      onClick={() => setSelectedCasino(casino)}
                      className="w-full py-2 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl border border-slate-300 hover:border-[#30308A] text-slate-800 hover:text-[#30308A] text-[11px] sm:text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-1.5 bg-slate-50 hover:bg-slate-100 shadow-sm min-h-[36px] sm:min-h-[44px]"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#30308A]" />
                      <span className="hidden sm:inline">호텔 & 카지노 상세정보 보기</span>
                      <span className="sm:hidden">상세보기</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
