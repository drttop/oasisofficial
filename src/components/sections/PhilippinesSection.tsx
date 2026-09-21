import React from 'react';
import { useSite } from '../../context/SiteContext';
import { Compass, MapPin, Sparkles } from 'lucide-react';

export const PhilippinesSection: React.FC = () => {
  const { philippineSpots, siteConfig } = useSite();

  const philippinesBadge = siteConfig.philippinesBadge || 'PHILIPPINES VIP TRAVEL & GOLF';
  const philippinesTitle = siteConfig.philippinesTitle || '필리핀 VIP 라이프스타일 & 여행 가이드';
  const philippinesSubtitle = siteConfig.philippinesSubtitle || '화려한 마닐라의 도심 라이프와 클락의 여유로운 명문 골프 코스까지,\n오아시스가 엄선한 프리미엄 필리핀 투어 정보를 안내해 드립니다.';

  return (
    <section id="philippines" className="py-20 sm:py-28 bg-white text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <Compass className="w-3.5 h-3.5" />
            <span>{philippinesBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line">
            {philippinesTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance whitespace-pre-line">
            {philippinesSubtitle}
          </p>
        </div>

        {/* Spots Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-8">
          {philippineSpots.map((spot) => (
            <div
              key={spot.id}
              className="rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-28 min-[380px]:h-36 sm:h-64 w-full overflow-hidden bg-slate-900">
                <img
                  src={spot.image}
                  alt={spot.title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5">
                  <span className="px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-[#1E1E4F] text-white text-[9px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-md">
                    <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#E5B54F]" />
                    {spot.location}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3.5 sm:left-4 sm:right-4 text-white">
                  <h3 className="text-xs min-[360px]:text-sm sm:text-xl font-bold tracking-tight text-white drop-shadow truncate">
                    {spot.title}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-300 font-medium mt-0.5 truncate">
                    {spot.subtitle}
                  </p>
                </div>
              </div>

              <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <p className="text-[11px] sm:text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {spot.description}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2">
                  {spot.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-[9px] sm:text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2 sm:pt-3 flex items-center gap-1 sm:gap-1.5 border-t border-slate-200 text-[10px] sm:text-xs font-bold text-[#30308A]">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5B54F]" />
                  <span className="truncate">오아시스 VIP 전용 혜택</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
