import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Copy, Check, Compass } from 'lucide-react';

interface GoogleMapEmbedProps {
  query: string;
  title?: string;
  address?: string;
  embedUrl?: string;
  className?: string;
  height?: string;
  showActions?: boolean;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  query,
  title,
  address,
  embedUrl,
  className = '',
  height = 'h-64 sm:h-80',
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!query && !embedUrl) return null;

  // Resolve iframe src
  let resolvedSrc = '';
  if (embedUrl) {
    if (embedUrl.includes('<iframe') && embedUrl.includes('src="')) {
      const match = embedUrl.match(/src=["']([^"']+)["']/i);
      resolvedSrc = match ? match[1] : embedUrl;
    } else {
      resolvedSrc = embedUrl;
    }
  } else {
    const cleanQuery = query.trim();
    resolvedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cleanQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Google Maps External Search / Directions URL
  const targetQuery = address ? `${title || ''} ${address}`.trim() : query;
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(targetQuery)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(targetQuery)}`;

  const handleCopyAddress = async () => {
    const textToCopy = address || title || query;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const input = document.createElement('input');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const displayTitle = title || query;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Map Header */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#30308A] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <MapPin className="w-4 h-4 text-[#E5B54F]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-[#30308A] bg-[#30308A]/10 px-2 py-0.5 rounded uppercase tracking-wider font-montserrat">
                Google Maps
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {displayTitle}
              </h4>
            </div>
            {address && (
              <p className="text-[11px] text-slate-500 mt-0.5 truncate leading-normal">
                {address}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            {/* Copy Address Button */}
            {(address || title) && (
              <button
                type="button"
                onClick={handleCopyAddress}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="주소 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>주소 복사</span>
                  </>
                )}
              </button>
            )}

            {/* Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#30308A] hover:bg-[#25256e] text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors no-underline cursor-pointer"
              title="Google 지도에서 길찾기"
            >
              <Navigation className="w-3 h-3 text-[#E5B54F]" />
              <span>길찾기</span>
            </a>

            {/* View Full in Maps Button */}
            <a
              href={externalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 shadow-xs flex items-center gap-1 transition-colors no-underline cursor-pointer"
              title="Google 지도 앱/웹에서 크게 보기"
            >
              <ExternalLink className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">크게보기</span>
            </a>
          </div>
        )}
      </div>

      {/* Map Iframe Container */}
      <div className={`relative w-full ${height} bg-slate-100 overflow-hidden`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 z-10">
            <Compass className="w-6 h-6 text-[#30308A] animate-spin" />
            <span className="text-xs font-medium">구글 지도를 불러오는 중입니다...</span>
          </div>
        )}
        <iframe
          src={resolvedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Google Map - ${displayTitle}`}
          className="w-full h-full"
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      {/* Map Footer Note */}
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span>💡 지도를 마우스나 손가락으로 드래그하여 확대/축소 및 이동할 수 있습니다.</span>
        </span>
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#30308A] hover:underline font-medium text-[10px] shrink-0"
        >
          Google 지도로 열기 →
        </a>
      </div>
    </div>
  );
};
