import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Send, MessageCircle } from 'lucide-react';

export const BottomFloatingBar: React.FC = () => {
  const { siteConfig } = useSite();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(true);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 pointer-events-none transition-all duration-300 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      id="oasis-bottom-floating-bar"
    >
      <div className="max-w-md mx-auto px-4 w-full flex items-center justify-center gap-2.5 sm:gap-3 pointer-events-auto">
        {/* 1. KakaoTalk Button (Left) */}
        <a
          href={siteConfig.kakaoUrl}
          target="_blank"
          rel="noreferrer"
          id="floating-kakao-btn"
          className="flex-1 max-w-[210px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#FEE500] hover:bg-[#fae100] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(0,0,0,0.22)] border border-amber-300/60 transition-all duration-200 hover:scale-105 active:scale-95 group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-900/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
          </div>
          <div className="text-left leading-tight truncate">
            <span className="block text-[10px] text-amber-950/70 font-semibold">카카오톡 상담</span>
            <span className="font-extrabold text-xs sm:text-sm text-slate-950 truncate block">
              {siteConfig.kakaoId}
            </span>
          </div>
        </a>

        {/* 2. Telegram Button (Right) */}
        <a
          href={siteConfig.telegramUrl}
          target="_blank"
          rel="noreferrer"
          id="floating-telegram-btn"
          className="flex-1 max-w-[210px] px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#229ED9] hover:bg-[#1a8fc5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(34,158,217,0.35)] border border-sky-400/40 transition-all duration-200 hover:scale-105 active:scale-95 group"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Send className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-left leading-tight truncate">
            <span className="block text-[10px] text-sky-100 font-semibold">텔레그램 상담</span>
            <span className="font-extrabold text-xs sm:text-sm text-white truncate block">
              {siteConfig.telegramId}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
};
