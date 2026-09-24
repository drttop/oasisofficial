import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { CasinoItem } from '../../types';
import { X, Save, Sparkles, Building2 } from 'lucide-react';

interface CasinoEditorModalProps {
  casinoToEdit: CasinoItem | null;
  onClose: () => void;
}

export const CasinoEditorModal: React.FC<CasinoEditorModalProps> = ({ casinoToEdit, onClose }) => {
  const { addCasino, updateCasino } = useSite();

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [region, setRegion] = useState<'manila' | 'clark'>('manila');
  const [regionLabel, setRegionLabel] = useState('마닐라 엔터테인먼트 시티');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [tableGames, setTableGames] = useState('바카라, 블랙잭, 룰렛 (400+ 테이블)');
  const [vipRooms, setVipRooms] = useState('프라이빗 VIP 정켓 살롱 완비');
  const [hotelRating, setHotelRating] = useState('5성급 특급 호텔');
  const [highlights, setHighlights] = useState('스위트룸 무료 숙박 및 전용 픽업 의전');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (casinoToEdit) {
      setName(casinoToEdit.name);
      setEnglishName(casinoToEdit.englishName);
      setRegion(casinoToEdit.region);
      setRegionLabel(casinoToEdit.regionLabel);
      setImage(casinoToEdit.image);
      setDescription(casinoToEdit.description);
      setFeaturesInput(casinoToEdit.features.join('\n'));
      setTableGames(casinoToEdit.tableGames);
      setVipRooms(casinoToEdit.vipRooms);
      setHotelRating(casinoToEdit.hotelRating);
      setHighlights(casinoToEdit.highlights);
      setIsFeatured(!!casinoToEdit.isFeatured);
    } else {
      setName('');
      setEnglishName('');
      setRegion('manila');
      setRegionLabel('마닐라 엔터테인먼트 시티');
      setImage('https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fm=webp&fit=crop&w=1200&q=80&ext=.webp');
      setDescription('');
      setFeaturesInput('5성급 스위트 호텔 직결\n프라이빗 VIP 룸 운영\n공항 패스트트랙 연계');
      setTableGames('바카라, 블랙잭, 룰렛 (300+ 테이블)');
      setVipRooms('프라이빗 VIP 하이리밋 살롱');
      setHotelRating('5성급 럭셔리');
      setHighlights('스위트룸 무료 바우처 지원 및 롤링 캐시백');
      setIsFeatured(false);
    }
  }, [casinoToEdit]);

  const handleRegionChange = (newReg: 'manila' | 'clark') => {
    setRegion(newReg);
    if (newReg === 'manila') {
      setRegionLabel('마닐라 엔터테인먼트 시티');
    } else {
      setRegionLabel('클락 경제자유구역 (Clark)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !image.trim()) return;

    const features = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const casinoData = {
      name: name.trim(),
      englishName: englishName.trim() || name.trim(),
      region,
      regionLabel,
      image: image.trim(),
      description: description.trim(),
      features: features.length > 0 ? features : ['5성급 특급 시설', '프라이빗 VIP 살롱'],
      tableGames: tableGames.trim(),
      vipRooms: vipRooms.trim(),
      hotelRating: hotelRating.trim(),
      highlights: highlights.trim(),
      isFeatured,
    };

    if (casinoToEdit) {
      updateCasino(casinoToEdit.id, casinoData);
    } else {
      addCasino(casinoData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E5B54F]" />
            <span>{casinoToEdit ? '카지노 정보 수정' : '신규 카지노 등록'}</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                카지노 이름 (한글) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 오카다 마닐라"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                영문 공식 명칭
              </label>
              <input
                type="text"
                placeholder="예: Okada Manila Resort & Casino"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">지역 구분</label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] bg-white"
              >
                <option value="manila">마닐라 (Manila)</option>
                <option value="clark">클락 (Clark)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">지역 상세 라벨</label>
              <input
                type="text"
                value={regionLabel}
                onChange={(e) => setRegionLabel(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              카지노 대표 이미지 URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">소개 설명</label>
            <textarea
              rows={2}
              placeholder="카지노 및 리조트에 대한 소개..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30308A] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">호텔 등급</label>
              <input
                type="text"
                value={hotelRating}
                onChange={(e) => setHotelRating(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">게이밍 테이블</label>
              <input
                type="text"
                value={tableGames}
                onChange={(e) => setTableGames(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">VIP 룸 정보</label>
              <input
                type="text"
                value={vipRooms}
                onChange={(e) => setVipRooms(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">오아시스 전용 단독 혜택</label>
            <input
              type="text"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              주요 특징 및 부대시설 (한 줄에 하나씩 입력)
            </label>
            <textarea
              rows={3}
              placeholder="세계 최대 규모 분수쇼&#10;5성급 스위트룸&#10;미슐랭 다이닝"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#30308A] rounded"
              />
              <span>메인 추천 리조트로 강조 표시</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#30308A] rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>저장하기</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
