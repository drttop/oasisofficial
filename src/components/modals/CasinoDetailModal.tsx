import React from 'react';
import { useSite } from '../../context/SiteContext';
import { X, MapPin, Sparkles, Check, Building2, Crown, MessageCircle, Send, Star } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export const CasinoDetailModal: React.FC = () => {
  const { selectedCasino, setSelectedCasino, siteConfig } = useSite();

  if (!selectedCasino) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={getOptimizedImageUrl(selectedCasino.image, 1000, 80)}
            alt={selectedCasino.name}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={() => setSelectedCasino(null)}
            className="absolute top-4 right-4 p-2 bg-slate-950/60 hover:bg-slate-900 text-white rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#30308A] text-white text-xs font-bold uppercase tracking-wider">
                {selectedCasino.regionLabel}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#E5B54F] text-slate-950 text-xs font-bold flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {selectedCasino.hotelRating}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {selectedCasino.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-montserrat">
              {selectedCasino.englishName}
            </p>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-montserrat">
              OVERVIEW
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {selectedCasino.description}
            </p>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Building2 className="w-4 h-4 text-[#30308A]" />
                테이블 & 게이밍 구성
              </span>
              <p className="text-sm font-bold text-slate-900">{selectedCasino.tableGames}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Crown className="w-4 h-4 text-[#E5B54F]" />
                VIP 정켓 & 하이리밋 살롱
              </span>
              <p className="text-sm font-bold text-slate-900">{selectedCasino.vipRooms}</p>
            </div>
          </div>

          {/* Oasis Exclusive VIP Highlights */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>오아시스 공식 에이전트 단독 혜택</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 font-medium">
              {selectedCasino.highlights}
            </p>
          </div>

          {/* Facilities / Features list */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 font-montserrat">
              KEY FEATURES & AMENITIES
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCasino.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct CTA Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                {selectedCasino.name} VIP 예약 및 스위트룸 상담
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                오아시스 전담 실장이 호텔 바우처 및 공항 의전을 원스톱 지원합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <a
                href={siteConfig.kakaoUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-casino-kakao-btn"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-slate-950 font-bold text-xs bg-[#FEE500] hover:bg-[#fae100] transition-all flex items-center justify-center gap-1.5 border border-amber-300"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-slate-900" />
                <span>카카오톡 문의</span>
              </a>
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noreferrer"
                id="modal-casino-telegram-btn"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-white font-bold text-xs bg-[#0274b3] hover:bg-[#026aa2] transition-all flex items-center justify-center gap-1.5 border border-sky-400/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>텔레그램 문의</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setSelectedCasino(null)}
            className="px-5 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
