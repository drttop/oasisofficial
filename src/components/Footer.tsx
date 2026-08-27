import React from 'react';
import { useSite } from '../context/SiteContext';

export const Footer: React.FC = () => {
  const { siteConfig, setIsAdminOpen } = useSite();

  return (
    <footer className="bg-slate-950 text-slate-400 py-6 border-t border-slate-800/80" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          {/* Copyright & Essential Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span className="font-semibold text-slate-300">
              {siteConfig.siteName || '오아시스 공식 에이전트'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span>대표: {siteConfig.representative || '강태진 대표 디렉터'}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span>{siteConfig.licenseNumber || 'PAGCOR · GAB · PCSO Official Certified VIP Agency'}</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400">
              Copyright © {new Date().getFullYear()} {siteConfig.siteName || 'OASIS'}. All rights reserved.
            </span>
          </div>

          {/* Admin CMS Access Link */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-slate-400 hover:text-slate-400 transition-colors text-[11px] underline underline-offset-2"
              title="관리자 설정"
            >
              관리자 모드
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

