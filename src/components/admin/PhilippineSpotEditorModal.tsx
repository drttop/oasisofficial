import React, { useState } from 'react';
import { PhilippineTourSpot } from '../../types';
import { X, Save, Sparkles, MapPin, Tag } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spot: Omit<PhilippineTourSpot, 'id'> | PhilippineTourSpot) => void;
  initialData?: PhilippineTourSpot | null;
}

export const PhilippineSpotEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    category: initialData?.category || 'hotel',
    location: initialData?.location || '',
    image: initialData?.image || '',
    description: initialData?.description || '',
    tagsString: initialData?.tags?.join(', ') || '',
  });

  // Keep state updated if initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subtitle: initialData.subtitle,
        category: initialData.category,
        location: initialData.location,
        image: initialData.image,
        description: initialData.description,
        tagsString: initialData.tags.join(', '),
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        category: 'hotel',
        location: '',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        description: '',
        tagsString: '특급호텔, VIP의전, 스위트룸',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('카드 제목을 입력해주세요.');
      return;
    }

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      category: formData.category as PhilippineTourSpot['category'],
      location: formData.location || 'Metro Manila / Clark',
      image: formData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      description: formData.description,
      tags: tags.length > 0 ? tags : ['VIP의전', '필리핀투어'],
    };

    if (initialData?.id) {
      onSave({ ...payload, id: initialData.id });
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1E1E4F] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E5B54F]" />
            <h3 className="font-bold text-base">
              {initialData ? '필리핀 소개 카드 정보 수정' : '새로운 필리핀 소개 카드 등록'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                카드 메인 타이틀 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: 마닐라 베이 5성급 럭셔리 스위트 호텔"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                서브타이틀 / 호텔·시설명
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="예: 오카다 / 솔레어 / 그랜드 하얏트 BGC"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                지역/위치 레이블 (좌측 상단 배지)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="예: Metro Manila, Clark, BGC"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                카테고리 구분
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#30308A]"
              >
                <option value="hotel">특급 호텔 & 리조트</option>
                <option value="golf">명문 골프 투어</option>
                <option value="dining">BGC & 파인다이닝</option>
                <option value="travel_info">여행 & 안전 가이드</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                대표 이미지 URL (권장: 가로형 고해상도)
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-[#30308A]"
              />
              {formData.image && (
                <div className="mt-2 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
                  <img
                    src={formData.image}
                    alt="미리보기"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                    이미지 미리보기
                  </span>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                상세 설명문
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="오아시스 VIP 고객님께 제공되는 전용 혜택과 투어 안내 내용을 작성하세요."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                태그 목록 (쉼표 , 로 구분)
              </label>
              <input
                type="text"
                value={formData.tagsString}
                onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                placeholder="5성급 호텔, 스위트룸 무료지원, 오션뷰"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#30308A] hover:bg-[#25256e] text-white font-bold rounded-xl flex items-center gap-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? '수정 내용 저장' : '등록 완료'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
