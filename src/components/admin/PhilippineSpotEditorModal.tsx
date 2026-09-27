import React, { useState, useRef } from 'react';
import { PhilippineTourSpot } from '../../types';
import { X, Save, Sparkles, Upload, Image as ImageIcon, Loader2, RefreshCw, Trash2, Link as LinkIcon } from 'lucide-react';
import { compressImageFile } from '../../utils/imageUpload';

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

  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setShowUrlInput(Boolean(initialData.image && !initialData.image.startsWith('data:')));
    } else {
      setFormData({
        title: '',
        subtitle: '',
        category: 'hotel',
        location: '',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=800&q=80&ext=.webp',
        description: '',
        tagsString: '특급호텔, VIP의전, 스위트룸',
      });
      setShowUrlInput(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.');
      return;
    }

    try {
      setIsUploading(true);
      // Compress and convert to crisp, lightweight WebP DataURL (1600x1200 max, 0.86 quality)
      const compressed = await compressImageFile(file, 1600, 1200, 0.86);
      setFormData((prev) => ({ ...prev, image: compressed }));
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      alert('이미지를 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
      image: formData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=800&q=80&ext=.webp',
      description: formData.description,
      tags: tags.length > 0 ? tags : ['VIP의전', 'VIP서비스'],
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
              {initialData ? 'VIP 서비스 카드 정보 수정' : '새로운 VIP 서비스 카드 등록'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
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
                <option value="hotel">특급 호텔 & 리조트 (호텔 프리룸)</option>
                <option value="golf">명문 골프 & 의전 (골프 투어)</option>
                <option value="dining">BGC & 파인다이닝 (미식 투어)</option>
                <option value="travel_info">프라이빗 컨시어지 & 케어</option>
              </select>
            </div>

            {/* Direct Image File Upload & Preview Section */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800">
                  대표 이미지 등록 <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] text-[#30308A] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'URL 입력창 접기' : '또는 웹 이미지 URL로 입력'}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="vip-spot-file-input"
              />

              {/* Upload Dropzone / Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. File Upload Button / Area */}
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isUploading
                      ? 'border-[#30308A] bg-blue-50/50 cursor-wait'
                      : 'border-slate-300 hover:border-[#30308A] hover:bg-slate-50'
                  }`}
                >
                  {isUploading ? (
                    <div className="py-2 flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#30308A] animate-spin" />
                      <span className="text-xs font-bold text-[#30308A]">고화질 압축 변환 중...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-[#30308A]/10 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-[#30308A]" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 mb-0.5">
                        내 기기에서 사진 직접 업로드
                      </span>
                      <p className="text-[10px] text-slate-500">
                        클릭하여 갤러리/폴더에서 이미지 선택 (JPG, PNG, WebP)
                      </p>
                    </>
                  )}
                </div>

                {/* 2. Current Image Preview Card */}
                <div className="h-32 sm:h-auto min-h-[100px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-bold text-[11px] flex items-center gap-1 shadow cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>사진 변경</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                          className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>삭제</span>
                        </button>
                      </div>
                      <span className="absolute bottom-1 right-1.5 text-[9px] bg-black/70 text-white font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {formData.image.startsWith('data:') ? '직접 업로드됨 (고화질)' : '웹 이미지'}
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2">
                      <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-[10px]">등록된 이미지가 없습니다</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Direct URL Input Field */}
              {showUrlInput && (
                <div className="pt-1.5 animate-fadeIn">
                  <input
                    type="text"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono text-[11px] focus:ring-2 focus:ring-[#30308A]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    * 외부 이미지 웹 주소를 복사하여 붙여넣을 수도 있습니다.
                  </p>
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
                placeholder="오아시스 VIP 고객님께 제공되는 전용 혜택과 VIP 서비스 안내 내용을 작성하세요."
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
                placeholder="5성급 호텔, 스위트룸 무료지원, 오션뷰, 24시간 의전"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-[#30308A] hover:bg-[#25256e] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
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
