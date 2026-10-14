import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  altText?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  altText = '오아시스 VIP 고화질 갤러리 사진',
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset zoom and pan when changing image or opening
  const resetTransform = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      resetTransform();
      // Lock background scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, initialIndex, images.length, resetTransform]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      resetTransform();
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    },
    [images.length, resetTransform]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      resetTransform();
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    },
    [images.length, resetTransform]
  );

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel((prev) => Math.min(3.0, prev + 0.5));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomLevel((prev) => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const toggleZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (zoomLevel > 1) {
      resetTransform();
    } else {
      setZoomLevel(2.0);
    }
  };

  // Drag to Pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    e.preventDefault();
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(3.0, prev + 0.5));
      } else if (e.key === '-') {
        setZoomLevel((prev) => {
          const next = Math.max(1, prev - 0.5);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      } else if (e.key === '0') {
        resetTransform();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose, resetTransform]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="고화질 원본 이미지 뷰어"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={() => {
        if (zoomLevel === 1) onClose();
      }}
    >
      {/* Top Header Bar */}
      <div
        className="w-full h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Counter & HD Resolution Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-white font-mono text-xs sm:text-sm font-bold bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>고화질 WebP</span>
            {imageDims && (
              <span className="hidden min-[480px]:inline font-mono text-amber-200/80 font-normal">
                ({imageDims.width} × {imageDims.height})
              </span>
            )}
          </span>
        </div>

        {/* Right: Zoom Level Controls & Close Button */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom In (+) */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-white/10"
            title="확대 (+)"
          >
            <ZoomIn className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">확대</span>
          </button>

          {/* Zoom Out (-) */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-white/10"
            title="축소 (-)"
          >
            <ZoomOut className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">축소</span>
          </button>

          {/* 1:1 Reset button */}
          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={resetTransform}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-amber-400/40"
              title="화면 맞춤"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">화면맞춤</span>
            </button>
          )}

          {/* Close (ESC) */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-white/10 ml-1"
            title="닫기 (ESC)"
          >
            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline">닫기</span>
          </button>
        </div>
      </div>

      {/* Center Image Display Area */}
      <div
        ref={containerRef}
        className={`flex-1 w-full relative flex items-center justify-center overflow-hidden p-1 sm:p-4 min-h-0 ${
          zoomLevel > 1
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-zoom-in'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={toggleZoom}
      >
        {/* Left Arrow (Desktop / Tablet) */}
        {images.length > 1 && zoomLevel === 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-xs border border-white/10 shadow-lg group"
            title="이전 사진 (좌측 화살표)"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Active Ultra High-Res Image with 1:1 Pixel Mapping and Pan/Zoom */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transitionDuration: isDragging ? '0ms' : '200ms',
          }}
        >
          <img
            ref={imgRef}
            src={currentImage}
            alt={`${altText} - ${currentIndex + 1}`}
            onLoad={(e) => {
              const target = e.currentTarget;
              setImageDims({ width: target.naturalWidth, height: target.naturalHeight });
            }}
            className={`max-h-[78vh] sm:max-h-[82vh] object-contain rounded-lg shadow-2xl transition-all w-auto h-auto ${
              imageDims && imageDims.height > imageDims.width
                ? 'max-w-[min(600px,95vw)]'
                : 'max-w-[min(1080px,95vw)]'
            }`}
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
            }}
            decoding="async"
            draggable={false}
          />
        </div>

        {/* Right Arrow (Desktop / Tablet) */}
        {images.length > 1 && zoomLevel === 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-all cursor-pointer backdrop-blur-xs border border-white/10 shadow-lg group"
            title="다음 사진 (우측 화살표)"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Instructions */}
      <div
        className="w-full pb-4 sm:pb-6 pt-2 px-4 flex flex-col items-center gap-2 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1.5 px-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
            {images.map((imgSrc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  resetTransform();
                }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                  currentIndex === idx
                    ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`썸네일 ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-white/60 text-center font-medium">
          더블클릭 또는 확대 버튼으로 고화질 원본을 확대하고 드래그하여 이동할 수 있습니다 · ESC로 닫기
        </p>
      </div>
    </div>
  );
};
