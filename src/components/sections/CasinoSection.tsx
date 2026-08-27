import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Crown, Sparkles, Eye } from 'lucide-react';

export const CasinoSection: React.FC = () => {
  const { casinos, setSelectedCasino, siteConfig } = useSite();

  const casinoBadge = siteConfig.casinoBadge || 'MAJOR CASINO & VIP RESORTS';
  const casinoTitle = siteConfig.casinoTitle || '필리핀 메이저 카지노 공식 제휴 라인업';
  const casinoSubtitle = siteConfig.casinoSubtitle || '오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다.\n스위트룸 무료 숙박 및 프라이빗 VIP 살롱 혜택을 즉시 누려보세요.';

  return (
    <section id="casino" className="py-20 sm:py-28 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
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

        {/* Casino Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {casinos.map((casino) => (
            <div
              key={casino.id}
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
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
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
                  <h3 className="text-xl font-bold tracking-tight text-white drop-shadow">
                    {casino.name}
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
                    className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-[#30308A] text-slate-800 hover:text-[#30308A] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-[#30308A]" />
                    <span>호텔 & 카지노 상세정보 보기</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
