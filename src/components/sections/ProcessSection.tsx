import React, { useState } from 'react';
import { useSite } from '../../context/SiteContext';
import {
  MessageSquare,
  Building2,
  Car,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const { serviceSteps, faqs, siteConfig } = useSite();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const stepIcons = [MessageSquare, Building2, Car, ShieldCheck, CheckCircle2];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="process" className="py-20 sm:py-28 bg-slate-50 text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider text-[#30308A] bg-[#30308A]/10 uppercase font-montserrat">
            <Clock className="w-3.5 h-3.5" />
            <span>VIP SERVICE PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {siteConfig.processTitle || '오아시스 VIP 의전 서비스 이용절차'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance whitespace-pre-line">
            {siteConfig.processSubtitle || '첫 상담부터 호텔 예약, 공항 패스트트랙, 현지 1:1 케어 및 출국 정산까지 빈틈없는 5단계 원스톱 VIP 프로세스로 모십니다.'}
          </p>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-6 mb-48 lg:mb-64 relative">
          {serviceSteps.map((step, idx) => {
            const Icon = stepIcons[idx] || MessageSquare;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl py-7 sm:py-8 px-3.5 sm:px-4 border-2 border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:border-[#30308A] transition-all duration-300 flex flex-col relative group overflow-hidden"
              >
                {/* Giant Watermark Number */}
                <div className="absolute -bottom-6 -right-4 text-[140px] font-black text-slate-50 group-hover:text-[#30308A]/5 transition-colors z-0 pointer-events-none select-none font-montserrat leading-none tracking-tighter">
                  {step.stepNumber}
                </div>

                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-[#30308A] group-hover:to-[#E5B54F] transition-all duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Step Number Top */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-400 group-hover:text-[#E5B54F] tracking-widest transition-colors mb-1">STEP</span>
                      <span className="font-montserrat text-4xl font-black text-[#30308A] tracking-tight group-hover:scale-105 origin-left transition-transform leading-none">
                        {step.stepNumber.replace(/^0+/, '')}
                      </span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-[#30308A]/50 shadow-sm group-hover:bg-[#30308A] group-hover:border-[#30308A] group-hover:text-[#E5B54F] group-hover:shadow-md transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <div className="space-y-3">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-[#30308A] transition-colors break-keep">
                        {step.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 font-montserrat uppercase tracking-widest">
                        {step.engTitle}
                      </p>
                    </div>
                    <div className="w-10 h-1 rounded-full bg-slate-200 group-hover:bg-[#E5B54F] transition-colors my-5" />
                    <p className="text-sm text-slate-600 leading-relaxed font-medium break-keep flex-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <HelpCircle className="w-4 h-4 text-[#30308A]" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {siteConfig.faqTitle || '자주 묻는 질문 (FAQ)'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {siteConfig.faqSubtitle || 'VIP 고객님들께서 가장 자주 문의하시는 내용을 정리했습니다.'}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-xl bg-white border border-slate-200/90 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#30308A]/10 text-[#30308A]">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
