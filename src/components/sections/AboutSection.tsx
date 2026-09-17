import React from 'react';
import { useSite } from '../../context/SiteContext';
import { ShieldCheck, Sparkles, Award, CheckCircle2, MessageCircle, Send, Landmark, Clock, Users, Building2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { siteConfig } = useSite();

  const title = siteConfig.aboutTitle || 'PAGCOR · GAB · PCSO 필리핀 정부 공인\n13년 현지 직영 VIP 공식 에이전트';
  const subtitle = siteConfig.aboutSubtitle || '오아시스는 필리핀 정부 산하 PAGCOR, GAB, PCSO 정식 공인 에이전트로서 마닐라 및 클락 메이저 카지노 복합리조트와 직통 파트너십을 맺고 13년간 축적된 압도적인 현지 직영 케어 솔루션을 제공합니다.';
  const heading = siteConfig.aboutStoryHeading || '“13년의 현지 운영 노하우, 완벽한 현지 밀착 케어로 완성합니다”';
  const para1 = siteConfig.aboutStoryParagraph1 || '오아시스 공식 에이전트는 2011년 설립 이래 13년간 필리핀 현지에서 직접 상주하며 단 한 건의 사고 없는 무결점 VIP 운영을 고수해 왔습니다. 필리핀 정부 게이밍 규제기관(PAGCOR), 필리핀 경기감독위원회(GAB), 필리핀 자선복권공사(PCSO)와의 공식 파트너십을 통해 법적 리스크 없는 100% 안전한 여정을 보장합니다.';
  const para2 = siteConfig.aboutStoryParagraph2 || '단순한 중개를 넘어 마닐라(오카다, 솔레어, 시티오브드림즈) 및 클락(한 카지노, 디하이츠, 로이스) 현지 법인 인프라를 바탕으로, 공항 VIP 패스트트랙 입국부터 최고급 의전 차량, 5성급 스위트룸 무료 바우처, 전담 한국인 매니저의 24시간 현지 밀착 케어까지 원스톱으로 책임집니다.';
  const highlight = siteConfig.aboutStoryHighlight || '■ 오아시스 핵심 보증: PAGCOR · GAB · PCSO 정부 부처 공인 정식 라이센스 보유 | 13년 무사고 신뢰 | 100% 실시간 투명 전산 정산 | 완벽한 1:1 고객 프라이버시 보호';

  const stats = [
    { number: siteConfig.aboutStat1Num || '13+', label: siteConfig.aboutStat1Label || '년 현지 직영 VIP 운영' },
    { number: siteConfig.aboutStat2Num || '100%', label: siteConfig.aboutStat2Label || 'PAGCOR·GAB·PCSO 공인' },
    { number: siteConfig.aboutStat3Num || '20,000+', label: siteConfig.aboutStat3Label || '누적 VIP 고객 현지 케어' },
    { number: siteConfig.aboutStat4Num || '24 / 7', label: siteConfig.aboutStat4Label || '한국인 베테랑 현지 상주' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 min-h-[100dvh] flex flex-col justify-center bg-white text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20 lg:mb-28">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{siteConfig.aboutBadge || 'ABOUT OASIS AGENT'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line leading-[1.3] break-keep">
            {title.split('\n').map((line, idx, arr) => (
              <React.Fragment key={idx}>
                {line}
                {idx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-keep whitespace-pre-line">
            {subtitle}
          </p>
        </div>

        {/* Main 2-Column Clean Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          
          {/* Left: 3 Government Agency Official Accreditation Emblem Cards (PAGCOR, GAB, PCSO) */}
          <div className="lg:col-span-6">
            {/* 3 Government Agency Emblem Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              
              {/* 1. PAGCOR Card */}
              <div className="p-3 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-400/40 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#E5B54F] hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
                <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#E5B54F] via-[#F4D078] to-[#B38528] flex items-center justify-center text-slate-950 font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Landmark className="w-5 h-5 sm:w-9 sm:h-9 text-slate-950" />
                </div>
                <span className="text-sm sm:text-2xl font-black text-[#E5B54F] font-montserrat tracking-wider block">
                  PAGCOR
                </span>
                <span className="text-[9px] sm:text-sm text-white font-bold block mt-1 sm:mt-1.5 tracking-tighter sm:tracking-normal break-keep">
                  게이밍규제위원회
                </span>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 w-full">
                  <span className="text-[8px] sm:text-[11px] text-emerald-400 whitespace-nowrap tracking-tighter px-1.5 sm:px-3  font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    공식 승인
                  </span>
                </div>
              </div>

              {/* 2. GAB Card */}
              <div className="p-3 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-400/40 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-emerald-600 flex items-center justify-center text-slate-950 font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 sm:w-9 sm:h-9 text-slate-950" />
                </div>
                <span className="text-sm sm:text-2xl font-black text-emerald-300 font-montserrat tracking-wider block">
                  GAB
                </span>
                <span className="text-[9px] sm:text-sm text-white font-bold block mt-1 sm:mt-1.5 tracking-tighter sm:tracking-normal break-keep">
                  경기감독위원회
                </span>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 w-full">
                  <span className="text-[8px] sm:text-[11px] text-emerald-400 whitespace-nowrap tracking-tighter px-1.5 sm:px-3  font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    정부 승인
                  </span>
                </div>
              </div>

              {/* 3. PCSO Card */}
              <div className="p-3 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-sky-400/40 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300">
                <div className="w-10 h-10 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-blue-600 flex items-center justify-center text-slate-950 font-black mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 sm:w-9 sm:h-9 text-slate-950" />
                </div>
                <span className="text-sm sm:text-2xl font-black text-sky-300 font-montserrat tracking-wider block">
                  PCSO
                </span>
                <span className="text-[9px] sm:text-sm text-white font-bold block mt-1 sm:mt-1.5 tracking-tighter sm:tracking-normal break-keep">
                  자선복권관리공사
                </span>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10 w-full">
                  <span className="text-[8px] sm:text-[11px] text-emerald-400 whitespace-nowrap tracking-tighter px-1.5 sm:px-3  font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    공식 인가
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Narrative & Direct Local Care Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed break-keep">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug whitespace-pre-line">
                {heading}
              </h3>
              <p className="whitespace-pre-line text-slate-600">
                {para1}
              </p>
              <p className="whitespace-pre-line text-slate-600">
                {para2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

