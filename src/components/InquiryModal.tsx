import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { X, Send, MessageCircle, Phone, CheckCircle2, Shield, Calendar, MapPin, Sparkles } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const { isInquiryModalOpen, setIsInquiryModalOpen, siteConfig, addInquiryLead } = useSite();

  const [name, setName] = useState('');
  const [contactType, setContactType] = useState<'telegram' | 'kakao' | 'phone'>('telegram');
  const [contactValue, setContactValue] = useState('');
  const [targetRegion, setTargetRegion] = useState('마닐라 (오카다/솔레어/COD)');
  const [expectedDate, setExpectedDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isInquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactValue.trim()) return;

    addInquiryLead({
      name: name.trim(),
      contactType,
      contactValue: contactValue.trim(),
      targetRegion,
      expectedDate: expectedDate.trim() || '미정 (상담 후 결정)',
      message: message.trim() || '빠른 VIP 상담을 희망합니다.',
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsInquiryModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setContactValue('');
      setMessage('');
      setExpectedDate('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1E1E4F] text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#E5B54F] mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>24/7 PRIVATE VIP CONCIERGE</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            오아시스 VIP 1:1 비공개 맞춤 상담
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            필리핀 최고급 카지노 혜택과 호텔 예약, 전용 의전을 비공개로 설계해 드립니다.
          </p>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900">상담 신청이 정상 접수되었습니다</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                남겨주신 <strong>{contactValue}</strong> ({contactType === 'telegram' ? '텔레그램' : contactType === 'kakao' ? '카카오톡' : '전화'})으로 전담 VIP 실장이 10분 이내에 1:1 비공개 안내를 드립니다.
              </p>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 border border-slate-200 space-y-1">
              <p className="font-semibold text-slate-800">■ 빠른 직접 상담 안내</p>
              <p>대기 없이 즉시 상담을 원하시면 아래 공식 채널로 바로 메시지를 보내주세요.</p>
              <div className="flex gap-2 pt-2">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#229ED9] rounded-lg"
                >
                  텔레그램 바로가기
                </a>
                <a
                  href={siteConfig.kakaoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-950 bg-[#FEE500] rounded-lg"
                >
                  카카오톡 바로가기
                </a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800"
            >
              확인 및 닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                성함 / 닉네임 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 김대표 또는 홍길동 VIP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            {/* Contact Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                선호 연락 수단 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setContactType('telegram')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    contactType === 'telegram'
                      ? 'border-[#229ED9] bg-[#229ED9]/10 text-[#229ED9]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  텔레그램
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('kakao')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    contactType === 'kakao'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  카카오톡
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('phone')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    contactType === 'phone'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  전화/문자
                </button>
              </div>
            </div>

            {/* Contact Value */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {contactType === 'telegram' ? '텔레그램 아이디' : contactType === 'kakao' ? '카카오톡 아이디' : '연락처 (휴대폰 번호)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={
                  contactType === 'telegram'
                    ? '@아이디 또는 유저네임'
                    : contactType === 'kakao'
                    ? '카카오톡 ID 입력'
                    : '010-0000-0000'
                }
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            {/* Region / Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  방문 희망 지역
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] bg-white"
                >
                  <option value="마닐라 (오카다/솔레어/COD)">마닐라 (오카다/솔레어/COD)</option>
                  <option value="클락 (한 카지노/디하이츠)">클락 (한 카지노/디하이츠)</option>
                  <option value="마닐라 + 클락 연계 일정">마닐라 + 클락 연계 일정</option>
                  <option value="골프 투어 + VIP 의전">골프 투어 + VIP 의전</option>
                  <option value="기타 맞춤 일정">기타 맞춤 일정</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  예상 방문 일정
                </label>
                <input
                  type="text"
                  placeholder="예: 9월 중순 (3박4일)"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
                />
              </div>
            </div>

            {/* Message / Requests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                상담 문의 내용 및 요청사항
              </label>
              <textarea
                rows={3}
                placeholder="스위트룸 무료 숙박 조건, 롤링 혜택, 공항 픽업 차량 요청 등 궁금하신 사항을 자유롭게 적어주세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] resize-none"
              />
            </div>

            {/* Privacy note */}
            <div className="p-2.5 bg-slate-50 rounded-lg flex items-center gap-2 text-[11px] text-slate-500 border border-slate-200">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>입력하신 모든 정보는 100% 암호화되며 상담 종료 즉시 파기됩니다.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: siteConfig.pointColor || '#30308A' }}
            >
              VIP 1:1 비공개 상담 신청하기
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
