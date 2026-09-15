import React, { useState } from 'react';
import { useSite, sortCasinos } from '../../context/SiteContext';
import { Crown, Sparkles, Eye, LayoutGrid } from 'lucide-react';
import { CasinoItem } from '../../types';

export const CasinoSection: React.FC = () => {
  const { casinos, setSelectedCasino, siteConfig } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const casinoBadge = siteConfig.casinoBadge || 'MAJOR CASINO & VIP RESORTS';
  const casinoTitle = siteConfig.casinoTitle || '필리핀 메이저 카지노 공식 제휴 라인업';
  const casinoSubtitle = siteConfig.casinoSubtitle || '오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다.\n스위트룸 무료 숙박 및 프라이빗 VIP 살롱 혜택을 즉시 누려보세요.';

  // Guaranteed order: 1. 오카다 마닐라, 2. 시티오브 드림즈, 3. 솔레어 리조트, 4. 뉴포트월드 리조트, 5. 한카지노, 6. 디하이츠리조트
  const orderedCasinos = sortCasinos(casinos);

  const getCategoryShortName = (casino: CasinoItem): string => {
    switch (casino.id) {
      case 'okada-manila':
        return '오카다 마닐라';
      case 'city-of-dreams':
        return '시티오브 드림즈';
      case 'solaire-resort':
        return '솔레어 리조트';
      case 'newport-world-resorts':
        return '뉴포트월드 리조트';
      case 'hann-casino-clark':
        return '한카지노';
      case 'dheights-clark':
        return '디하이츠리조트';
      default:
        return casino.name;
    }
  };

  const displayedCasinos =
    selectedCategory === 'all'
      ? orderedCasinos
      : orderedCasinos.filter((c) => c.id === selectedCategory);

  return (
    <section id="casino" className="py-20 sm:py-28 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <Crown className="w-3.5 h-3.5" />
            <span>{casinoBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line">
            {casinoTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance whitespace-pre-line">
            {casinoSubtitle}
          </p>
        </div>

        {/* Casino Service Category Tabs (Mobile & Desktop in Exact Order) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 mb-10 gap-2 scrollbar-none px-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] flex items-center gap-1.5 shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-[#30308A] text-white shadow-md shadow-[#30308A]/20 ring-2 ring-[#30308A]/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>전체 라인업</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                selectedCategory === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {orderedCasinos.length}
            </span>
          </button>

          {orderedCasinos.map((casino, idx) => {
            const isSelected = selectedCategory === casino.id;
            return (
              <button
                key={casino.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? 'all' : casino.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer min-h-[44px] flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-[#30308A] text-white shadow-md shadow-[#30308A]/20 ring-2 ring-[#30308A]/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-slate-100 text-[#30308A]'
                  }`}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{getCategoryShortName(casino)}</span>
              </button>
            );
          })}
        </div>

        {/* Casino Cards Grid (Sequential Order on both Mobile & Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCasinos.map((casino) => {
            // Find global sequential index (1 to 6)
            const globalIndex = orderedCasinos.findIndex((c) => c.id === casino.id) + 1;
            const formattedIndex = String(globalIndex).padStart(2, '0');

            return (
              <div
                key={casino.id}
                id={casino.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                  <img
                    src={casino.image}
                    alt={casino.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap items-center">
                    {/* Numeric Sequence Badge: 01, 02, 03... */}
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/75 backdrop-blur-md text-[#E5B54F] text-[11px] font-mono font-black border border-white/10">
                      NO.{formattedIndex}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[#30308A] text-white text-[11px] font-bold">
                      {casino.regionLabel}
                    </span>
                    {casino.isFeatured && (
                      <span className="px-2 py-1 rounded-md bg-[#E5B54F] text-slate-950 text-[11px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        추천 리조트
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold tracking-tight text-white drop-shadow flex items-baseline gap-2">
                      <span className="text-[#E5B54F] text-base font-mono font-extrabold">{globalIndex}.</span>
                      <span>{casino.name}</span>
                    </h3>
                    <p className="text-xs text-slate-300 font-montserrat truncate">
                      {casino.englishName}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {casino.description}
                  </p>

                  {/* Specs List */}
                  <div className="space-y-2 text-xs border-y border-slate-100 py-3">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">호텔 등급</span>
                      <span className="font-bold text-slate-900">{casino.hotelRating}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">게이밍 규모</span>
                      <span className="font-bold text-slate-900">{casino.tableGames}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="text-slate-500">VIP 전용 살롱</span>
                      <span className="font-bold text-[#30308A] truncate max-w-[180px]">{casino.vipRooms}</span>
                    </div>
                  </div>

                  {/* Oasis Benefit Highlight */}
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium line-clamp-2">{casino.highlights}</span>
                  </div>

                  {/* Card Action Button: 상세보기 */}
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedCasino(casino)}
                      className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-[#30308A] text-slate-800 hover:text-[#30308A] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 shadow-sm min-h-[44px]"
                    >
                      <Eye className="w-4 h-4 text-[#30308A]" />
                      <span>호텔 & 카지노 상세정보 보기</span>
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
