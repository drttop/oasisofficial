import React from 'react';
import { PostMapLocation } from '../types';

/**
 * Utilities for parsing and rendering post body content with:
 * 1. Font Size & Boldness / Rich typography system:
 *    - Font Sizes: [크기:특대], [크기:대], [크기:중], [크기:기본], [크기:소], [대제목], [소제목], [작은글씨]
 *    - Font Weights: **텍스트**, [굵게], [bold], [중간굵기], [semibold], [보통]
 *    - Highlights & Accents: [형광펜], [골드], [파랑], [빨강], [밑줄]
 *    - Block Elements: Markdown headings (##, ###), Quotes (> or [인용]), Bullet lists (- or •), Dividers (---)
 * 2. Media placeholders:
 *    - Photos: [사진1] ~ [사진6], [이미지1], [image1]
 *    - Google Maps: [지도:오카다 마닐라], [지도:오카다 마닐라|주소], [구글지도:장소명], [map:Query]
 */

export interface ContentSegment {
  type: 'text' | 'image' | 'map';
  text?: string;
  imageIndex?: number;
  imageUrl?: string;
  imageLabel?: string;
  mapQuery?: string;
  mapTitle?: string;
  mapAddress?: string;
  mapEmbedUrl?: string;
}

export function parsePostContent(
  content: string,
  images: string[] = [],
  defaultMap?: PostMapLocation
): ContentSegment[] {
  if (!content) return [];

  // Regex matching either photo tag or map tag
  // Group 1 & 2: Photos: [사진1], [image 2]
  // Group 3 & 4: Maps: [지도:장소명|주소], [구글지도:장소명], [map:query], [지도]
  const regex = /\[(?:(사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)|(지도|구글지도|googlemap|google_map|map)(?::\s*([^\]]+))?)\]/gi;
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Push preceding text segment if non-empty
    if (matchStart > lastIndex) {
      segments.push({
        type: 'text',
        text: content.substring(lastIndex, matchStart),
      });
    }

    // 1. Photo tag match
    if (match[1]) {
      const photoNumber = parseInt(match[2], 10);
      const photoIdx = photoNumber - 1; // 0-based index
      const imgUrl = images && images[photoIdx] ? images[photoIdx] : undefined;

      if (imgUrl) {
        segments.push({
          type: 'image',
          imageIndex: photoIdx,
          imageUrl: imgUrl,
          imageLabel: `사진 ${photoNumber}`,
        });
      } else {
        // Photo not found, output raw tag text
        segments.push({
          type: 'text',
          text: match[0],
        });
      }
    }
    // 2. Map tag match
    else if (match[3]) {
      const arg = match[4]?.trim();

      if (arg) {
        let title: string | undefined = undefined;
        let address: string | undefined = undefined;
        let query = arg;

        if (arg.includes('|')) {
          const parts = arg.split('|').map((p) => p.trim());
          title = parts[0] || undefined;
          address = parts[1] || undefined;
          query = address ? `${title || ''} ${address}`.trim() : title || arg;
        } else {
          title = arg;
          query = arg;
        }

        segments.push({
          type: 'map',
          mapTitle: title,
          mapAddress: address,
          mapQuery: query,
        });
      } else if (defaultMap && defaultMap.query) {
        segments.push({
          type: 'map',
          mapTitle: defaultMap.title,
          mapAddress: defaultMap.address,
          mapQuery: defaultMap.query,
          mapEmbedUrl: defaultMap.embedUrl,
        });
      } else {
        segments.push({
          type: 'text',
          text: match[0],
        });
      }
    }

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      text: content.substring(lastIndex),
    });
  }

  return segments;
}

/**
 * Checks if a specific photo index (0-based) is already placed in the content string
 */
export function isPhotoInContent(content: string, photoIndex: number): boolean {
  if (!content) return false;
  const photoNum = photoIndex + 1;
  const regex = new RegExp(`\\[(사진|이미지|image|IMAGE)[_\\s]*${photoNum}\\]`, 'i');
  return regex.test(content);
}

/**
 * Checks if any map tag is placed in the content string
 */
export function isMapInContent(content: string): boolean {
  if (!content) return false;
  const regex = /\[(지도|구글지도|googlemap|google_map|map)(?::[^\]]*)?\]/i;
  return regex.test(content);
}

/**
 * Returns the standard tag for a photo number, e.g. [사진1]
 */
export function getPhotoTag(photoNumber: number): string {
  return `[사진${photoNumber}]`;
}

/**
 * Returns the tag for a map, e.g. [지도:오카다 마닐라|주소]
 */
export function getMapTag(placeName: string, address?: string): string {
  if (address) {
    return `[지도:${placeName}|${address}]`;
  }
  return `[지도:${placeName}]`;
}

/**
 * Strips all formatting tags and HTML from content for clean summaries, cards, and meta tags.
 */
export function stripFormattingTags(content: string): string {
  if (!content) return '';
  return content
    // Remove HTML tags (tables, div, span, etc.)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    // Remove photo & map tags
    .replace(/\[(?:사진|이미지|image|IMAGE)[_\s]*[1-9][0-9]*\]/gi, '')
    .replace(/\[(?:지도|구글지도|googlemap|google_map|map)(?::[^\]]+)?\]/gi, '')
    // Remove font size tags
    .replace(/\[(?:크기|size):[^\]]+\]/gi, '')
    .replace(/\[\/(?:크기|size)\]/gi, '')
    .replace(/\[(?:특대|대제목|소제목|작은글씨)\]/gi, '')
    .replace(/\[\/(?:특대|대제목|소제목|작은글씨)\]/gi, '')
    // Remove weight & style tags
    .replace(/\[(?:굵게|bold|중간굵기|중간|semibold|medium|보통)\]/gi, '')
    .replace(/\[\/(?:굵게|bold|중간굵기|중간|semibold|medium|보통)\]/gi, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove color, highlight, quote tags
    .replace(/\[(?:형광펜|highlight|노랑|밑줄|u|골드|gold|파랑|blue|빨강|red|인용|quote|구분선)\]/gi, '')
    .replace(/\[\/(?:형광펜|highlight|노랑|밑줄|u|골드|gold|파랑|blue|빨강|red|인용|quote)\]/gi, '')
    // Remove markdown headings & quotes & bullets
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Helper to determine CSS classes for font sizes.
 */
function getFontSizeClass(val: string): string {
  const norm = val.trim().toLowerCase();
  if (['특대', 'xl', '24', '24px', '26', '28'].includes(norm)) {
    return 'text-2xl sm:text-3xl font-black text-slate-900 inline-block my-1 leading-snug';
  }
  if (['대', 'large', 'lg', '20', '20px', '22', '대제목'].includes(norm)) {
    return 'text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug';
  }
  if (['중', 'medium', 'md', '17', '17px', '18', '소제목'].includes(norm)) {
    return 'text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug';
  }
  if (['소', 'small', 'sm', '12', '12px', '13', '작은글씨'].includes(norm)) {
    return 'text-xs text-slate-500 leading-normal inline-block';
  }
  return 'text-sm sm:text-[15px] leading-relaxed';
}

/**
 * Parses inline string into React nodes supporting nested bold, sizes, underlines, highlights, and colors.
 */
function renderInlineContent(text: string, keyPrefix = 'inline'): React.ReactNode[] {
  if (!text) return [];

  // Master regex matching all inline tokens
  const regex = /(\[(?:크기|size):([^\]]+)\]([\s\S]*?)\[\/(?:크기|size)\])|(\[(대제목|소제목|특대|작은글씨)\]([\s\S]*?)\[\/\5\])|(\[(?:굵게|bold)\]([\s\S]*?)\[\/(?:굵게|bold)\])|(<b>([\s\S]*?)<\/b>)|(<strong>([\s\S]*?)<\/strong>)|(\*\*([^\*]+?)\*\*)|(\[(?:중간굵기|중간|semibold|medium)\]([\s\S]*?)\[\/(?:중간굵기|중간|semibold|medium)\])|(\[(?:밑줄|u)\]([\s\S]*?)\[\/(?:밑줄|u)\])|(<u>([\s\S]*?)<\/u>)|(\[(?:형광펜|highlight|노랑)\]([\s\S]*?)\[\/(?:형광펜|highlight|노랑)\])|(\[(?:골드|gold)\]([\s\S]*?)\[\/(?:골드|gold)\])|(\[(?:파랑|blue)\]([\s\S]*?)\[\/(?:파랑|blue)\])|(\[(?:빨강|red)\]([\s\S]*?)\[\/(?:빨강|red)\])|(\[(?:인용|quote)\]([\s\S]*?)\[\/(?:인용|quote)\])/i;

  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let counter = 0;

  while (remaining.length > 0) {
    const match = regex.exec(remaining);
    if (!match) {
      // No more tags, append remaining raw text
      nodes.push(remaining);
      break;
    }

    const matchIndex = match.index;
    if (matchIndex > 0) {
      nodes.push(remaining.substring(0, matchIndex));
    }

    const matchedFull = match[0];
    const nodeKey = `${keyPrefix}-${counter++}`;

    // 1. [크기:대]...[/크기]
    if (match[1]) {
      const sizeVal = match[2];
      const inner = match[3];
      nodes.push(
        <span key={nodeKey} className={getFontSizeClass(sizeVal)}>
          {renderInlineContent(inner, `${nodeKey}-sz`)}
        </span>
      );
    }
    // 2. [대제목]...[/대제목] or [소제목]... or [특대]... or [작은글씨]...
    else if (match[4]) {
      const tagType = match[5];
      const inner = match[6];
      nodes.push(
        <span key={nodeKey} className={getFontSizeClass(tagType)}>
          {renderInlineContent(inner, `${nodeKey}-named`)}
        </span>
      );
    }
    // 3. [굵게]...[/굵게]
    else if (match[7]) {
      const inner = match[8];
      nodes.push(
        <strong key={nodeKey} className="font-bold text-slate-900">
          {renderInlineContent(inner, `${nodeKey}-b`)}
        </strong>
      );
    }
    // 4. <b>...</b>
    else if (match[9]) {
      const inner = match[10];
      nodes.push(
        <strong key={nodeKey} className="font-bold text-slate-900">
          {renderInlineContent(inner, `${nodeKey}-b2`)}
        </strong>
      );
    }
    // 5. <strong>...</strong>
    else if (match[11]) {
      const inner = match[12];
      nodes.push(
        <strong key={nodeKey} className="font-bold text-slate-900">
          {renderInlineContent(inner, `${nodeKey}-str`)}
        </strong>
      );
    }
    // 6. **...**
    else if (match[13]) {
      const inner = match[14];
      nodes.push(
        <strong key={nodeKey} className="font-bold text-slate-900">
          {renderInlineContent(inner, `${nodeKey}-star`)}
        </strong>
      );
    }
    // 7. [중간굵기]...[/중간굵기]
    else if (match[15]) {
      const inner = match[16];
      nodes.push(
        <span key={nodeKey} className="font-semibold text-slate-800">
          {renderInlineContent(inner, `${nodeKey}-semi`)}
        </span>
      );
    }
    // 8. [밑줄]...[/밑줄]
    else if (match[17]) {
      const inner = match[18];
      nodes.push(
        <span key={nodeKey} className="underline underline-offset-4 decoration-[#30308A]/40 font-medium">
          {renderInlineContent(inner, `${nodeKey}-u`)}
        </span>
      );
    }
    // 9. <u>...</u>
    else if (match[19]) {
      const inner = match[20];
      nodes.push(
        <span key={nodeKey} className="underline underline-offset-4 decoration-[#30308A]/40 font-medium">
          {renderInlineContent(inner, `${nodeKey}-u2`)}
        </span>
      );
    }
    // 10. [형광펜]...[/형광펜]
    else if (match[21]) {
      const inner = match[22];
      nodes.push(
        <mark key={nodeKey} className="bg-amber-200/80 text-amber-950 px-1.5 py-0.5 rounded font-medium border border-amber-300/40">
          {renderInlineContent(inner, `${nodeKey}-hl`)}
        </mark>
      );
    }
    // 11. [골드]...[/골드]
    else if (match[23]) {
      const inner = match[24];
      nodes.push(
        <span key={nodeKey} className="text-[#B8860B] font-bold">
          {renderInlineContent(inner, `${nodeKey}-gold`)}
        </span>
      );
    }
    // 12. [파랑]...[/파랑]
    else if (match[25]) {
      const inner = match[26];
      nodes.push(
        <span key={nodeKey} className="text-[#30308A] font-bold">
          {renderInlineContent(inner, `${nodeKey}-blue`)}
        </span>
      );
    }
    // 13. [빨강]...[/빨강]
    else if (match[27]) {
      const inner = match[28];
      nodes.push(
        <span key={nodeKey} className="text-rose-600 font-bold">
          {renderInlineContent(inner, `${nodeKey}-red`)}
        </span>
      );
    }
    // 14. [인용]...[/인용]
    else if (match[29]) {
      const inner = match[30];
      nodes.push(
        <span
          key={nodeKey}
          className="my-2 pl-3.5 py-2 border-l-4 border-[#30308A] bg-slate-50 text-slate-700 italic rounded-r-lg font-medium block"
        >
          {renderInlineContent(inner, `${nodeKey}-quote`)}
        </span>
      );
    } else {
      nodes.push(matchedFull);
    }

    remaining = remaining.substring(matchIndex + matchedFull.length);
  }

  return nodes;
}

/**
 * High-performance React component to render formatted post text blocks.
 * Supports HTML tables, rich HTML formatting, headings, bullet points, quotes, dividers, and legacy tags.
 * Strictly avoids rendering `<h1>` tags to protect the 100-point SEO single-H1 rule!
 */
export const FormattedPostContent: React.FC<{
  content: string;
  images?: string[];
  defaultMap?: PostMapLocation;
  className?: string;
  onImageClick?: (src: string) => void;
}> = ({
  content,
  images = [],
  defaultMap,
  className = '',
  onImageClick,
}) => {
  if (!content) return null;

  const html = postContentToHtml(content, images, defaultMap, false /* viewer mode */);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const zoomEl = target.closest('[data-zoom-src]') as HTMLElement;
    if (zoomEl) {
      const src = zoomEl.getAttribute('data-zoom-src');
      if (src && onImageClick) onImageClick(src);
      return;
    }
    if (target.tagName === 'IMG') {
      const src = (target as HTMLImageElement).src;
      if (src && !src.includes('google.com/maps') && onImageClick) {
        onImageClick(src);
      }
    }
  };

  return (
    <div
      className={`oasis-article-content oasis-post-body space-y-3 leading-relaxed text-slate-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={handleClick}
    />
  );
};

/**
 * Creates clean viewer HTML for an inline photo in published posts
 */
export function createViewerPhotoHtml(photoIndex: number, imageUrl: string): string {
  const photoNum = photoIndex + 1;
  return `<figure class="my-6 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 bg-slate-950 flex items-center justify-center p-1 sm:p-2 cursor-zoom-in transition-all relative group" data-zoom-src="${imageUrl}">
    <img src="${imageUrl}" alt="사진 ${photoNum}" class="w-full h-auto max-h-[620px] object-contain mx-auto rounded-xl group-hover:scale-[1.01] transition-transform duration-300 pointer-events-none" loading="lazy" decoding="async" />
    <div class="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
      <span class="px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow border border-white/10">
        <span>📷</span> 사진 ${photoNum}
      </span>
    </div>
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center pointer-events-none">
      <span class="opacity-0 group-hover:opacity-100 transition-opacity px-3.5 py-2 rounded-xl bg-black/75 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-sm shadow-lg border border-white/20">
        🔍 클릭하여 사진 확대
      </span>
    </div>
  </figure>`;
}

/**
 * Creates clean viewer HTML for an inline map in published posts
 */
export function createViewerMapHtml(title: string, address?: string, query?: string): string {
  const finalQuery = (query || (address ? `${title} ${address}` : title)).trim();
  const safeQuery = encodeURIComponent(finalQuery);
  return `<div class="my-6 rounded-2xl overflow-hidden border border-indigo-200 shadow-sm bg-white p-3.5 space-y-2.5">
    <div class="flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-[#30308A] text-white flex items-center justify-center text-xs font-bold">📍</span>
      <div>
        <div class="font-bold text-slate-900 text-sm leading-tight">${title || finalQuery}</div>
        ${address ? `<div class="text-xs text-slate-500 leading-tight mt-0.5">${address}</div>` : ''}
      </div>
    </div>
    <div class="rounded-xl overflow-hidden border border-slate-200 h-56 sm:h-64 bg-slate-100 relative">
      <iframe src="https://maps.google.com/maps?q=${safeQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed" class="w-full h-full border-0" loading="lazy"></iframe>
    </div>
  </div>`;
}

/**
 * Creates visual HTML for an inline photo card inside the WYSIWYG editor
 */
export function createVisualPhotoHtml(photoIndex: number, imageUrl: string): string {
  const photoNum = photoIndex + 1;
  return `<div class="visual-photo-card my-4 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 select-none relative group" contenteditable="false" data-photo-idx="${photoIndex}">
    <div class="relative rounded-xl overflow-hidden shadow-sm max-h-[550px] bg-slate-950 flex items-center justify-center p-1">
      <img src="${imageUrl}" alt="사진 ${photoNum}" class="w-full max-h-[530px] object-contain mx-auto rounded-lg pointer-events-none" />
      <div class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5 shadow">
        <span>📷</span> 사진 ${photoNum}
      </div>
      <button type="button" class="delete-photo-btn absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow transition-all cursor-pointer">
        ✕ 본문에서 제거
      </button>
    </div>
    <div class="text-center text-[11px] text-slate-400 mt-1.5 font-medium">본문 삽입 사진 (원본 비율 & 고화질 확대 지원)</div>
  </div><p><br></p>`;
}

/**
 * Creates visual HTML for an inline map card inside the WYSIWYG editor
 */
export function createVisualMapHtml(title: string, address?: string, query?: string): string {
  const finalQuery = (query || (address ? `${title} ${address}` : title)).trim();
  const safeQuery = encodeURIComponent(finalQuery);
  return `<div class="visual-map-card my-4 p-4 bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 rounded-2xl border border-indigo-200/90 select-none relative" contenteditable="false" data-map-title="${title}" data-map-address="${address || ''}" data-map-query="${finalQuery}">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="w-7 h-7 rounded-xl bg-[#30308A] flex items-center justify-center text-white text-xs shadow-xs">📍</span>
        <div>
          <div class="font-bold text-slate-900 text-sm leading-tight">${title || finalQuery}</div>
          ${address ? `<div class="text-xs text-slate-500 leading-tight mt-0.5">${address}</div>` : ''}
        </div>
      </div>
      <button type="button" class="delete-map-btn px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 text-xs font-bold transition-all cursor-pointer">
        ✕ 본문에서 제거
      </button>
    </div>
    <div class="rounded-xl overflow-hidden border border-indigo-100 shadow-xs h-44 bg-slate-100 relative">
      <iframe src="https://maps.google.com/maps?q=${safeQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed" class="w-full h-full border-0 pointer-events-none" loading="lazy"></iframe>
    </div>
  </div><p><br></p>`;
}

/**
 * Detects whether content is formatted as HTML (contains HTML tags)
 */
export function isHtmlContent(str: string): boolean {
  if (!str) return false;
  return /<\/?(?:p|div|table|tbody|thead|tr|td|th|h[1-6]|ul|ol|li|blockquote|section|article|span|mark|strong|b|em|i|u|s|hr|img|iframe|font|center|figure|pre|code)\b/i.test(str);
}

/**
 * Ensures any bare <table> in HTML is wrapped in a responsive container with styling classes.
 * Uses DOMParser to avoid destroying inner tags, divs, and table structures.
 */
export function wrapTablesWithResponsiveContainer(html: string): string {
  if (!html || !html.includes('<table')) return html;
  if (typeof window === 'undefined') return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${html}</body>`, 'text/html');
    const tables = doc.querySelectorAll('table');
    if (tables.length === 0) return html;

    tables.forEach((table) => {
      table.classList.add('oasis-table');
      if (!table.classList.contains('min-w-full')) {
        table.classList.add('min-w-full', 'border-collapse', 'border', 'border-slate-300', 'rounded-xl', 'overflow-hidden', 'text-sm');
      }

      // Check if already in a responsive wrapper
      const parent = table.parentElement;
      if (
        parent &&
        (parent.classList.contains('oasis-table-wrap') ||
          parent.classList.contains('table-responsive') ||
          parent.classList.contains('overflow-x-auto'))
      ) {
        return;
      }

      const wrapper = doc.createElement('div');
      wrapper.className = 'oasis-table-wrap overflow-x-auto my-4 max-w-full';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    return doc.body.innerHTML;
  } catch {
    return html;
  }
}

/**
 * Converts post text (with HTML tables, rich formatting, [사진1], [형광펜], **bold**, ## Headings)
 * into real visual WYSIWYG HTML or viewer HTML.
 * Completely preserves user-written HTML, styling, tables, spans, and markdown without destructive stripping!
 */
export function postContentToHtml(
  content: string,
  images: string[] = [],
  defaultMap?: PostMapLocation,
  isEditorMode: boolean = false
): string {
  if (!content) return '<p><br></p>';

  // 1. Process inline Photo tags [사진1] ~ [사진6]
  let processed = content.replace(
    /\[(?:사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/gi,
    (match, p1) => {
      const photoNum = parseInt(p1, 10);
      const idx = photoNum - 1;
      const imgUrl = images[idx];
      if (imgUrl) {
        return isEditorMode
          ? createVisualPhotoHtml(idx, imgUrl)
          : createViewerPhotoHtml(idx, imgUrl);
      }
      if (isEditorMode) {
        return `<p class="my-1.5 leading-relaxed text-slate-500 font-mono">[사진 ${photoNum} 미등록]</p>`;
      }
      return '';
    }
  );

  // 2. Process inline Map tags [지도:장소명|주소]
  processed = processed.replace(
    /\[(?:지도|구글지도|googlemap|google_map|map)(?::\s*([^\]]+))?\]/gi,
    (match, arg) => {
      const trimmedArg = arg?.trim();
      let title = '';
      let address = '';
      let query = '';
      if (trimmedArg) {
        if (trimmedArg.includes('|')) {
          const spl = trimmedArg.split('|').map((p: string) => p.trim());
          title = spl[0];
          address = spl[1] || '';
          query = address ? `${title} ${address}` : title;
        } else {
          title = trimmedArg;
          query = trimmedArg;
        }
      } else if (defaultMap) {
        title = defaultMap.title || '대표 위치';
        address = defaultMap.address || '';
        query = defaultMap.query || title;
      }
      if (title || query) {
        return isEditorMode
          ? createVisualMapHtml(title || query, address, query)
          : createViewerMapHtml(title || query, address, query);
      }
      return match;
    }
  );

  // 3. Extract and protect all HTML block elements (tables, div wrappers, lists, blockquotes, pre, figure, existing p tags, etc.)
  // This guarantees that pre-existing HTML is 100% preserved without double-wrapping or mangling.
  const blockPlaceholders: string[] = [];
  const protectBlock = (htmlBlock: string): string => {
    let clean = htmlBlock.trim();
    if (clean.includes('<table')) {
      clean = wrapTablesWithResponsiveContainer(clean);
    }
    const token = `___OASIS_BLOCK_${blockPlaceholders.length}___`;
    blockPlaceholders.push(clean);
    return `\n\n${token}\n\n`;
  };

  // Protect responsive table wrappers and standalone tables
  processed = processed.replace(
    /(?:<div[^>]*class="[^"]*(?:oasis-table-wrap|table-responsive)[^"]*"[^>]*>[\s\S]*?<\/div>|<table[\s\S]*?<\/table>)/gi,
    (match) => protectBlock(match)
  );

  // Protect visual photo/map cards if already rendered (e.g. from editor)
  processed = processed.replace(
    /<div[^>]*class="[^"]*(?:visual-photo-card|visual-map-card)[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    (match) => protectBlock(match)
  );

  // Protect existing complete <p>...</p> tags
  processed = processed.replace(
    /<p\b[^>]*>[\s\S]*?<\/p>/gi,
    (match) => protectBlock(match)
  );

  // Protect existing <ul>...</ul> and <ol>...</ol>
  processed = processed.replace(
    /<(?:ul|ol)\b[^>]*>[\s\S]*?<\/(?:ul|ol)>/gi,
    (match) => protectBlock(match)
  );

  // Protect existing <blockquote>...</blockquote>
  processed = processed.replace(
    /<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi,
    (match) => protectBlock(match)
  );

  // Protect existing <figure>...</figure>
  processed = processed.replace(
    /<figure\b[^>]*>[\s\S]*?<\/figure>/gi,
    (match) => protectBlock(match)
  );

  // Protect existing <pre>...</pre>
  processed = processed.replace(
    /<pre\b[^>]*>[\s\S]*?<\/pre>/gi,
    (match) => protectBlock(match)
  );

  // 4. Now process remaining lines (headings, quotes, lists, dividers, and standard text)
  const lines = processed.split('\n');
  const htmlParts: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty line
    if (trimmed === '') {
      htmlParts.push('<p><br></p>');
      continue;
    }

    // Protected block token match
    const blockMatch = trimmed.match(/^___OASIS_BLOCK_(\d+)___$/);
    if (blockMatch) {
      const idx = parseInt(blockMatch[1], 10);
      if (blockPlaceholders[idx] !== undefined) {
        htmlParts.push(blockPlaceholders[idx]);
        htmlParts.push('<p><br></p>');
      }
      continue;
    }

    // Divider
    if (/^(\-{3,}|\*{3,}|_{3,}|\[구분선\])$/.test(trimmed)) {
      htmlParts.push('<hr class="my-4 border-t border-slate-200" />');
      continue;
    }

    // Heading 2 (## Title or [크기:대][굵게]Title)
    const h2Match = rawLine.match(/^##\s+(.*)$/);
    if (h2Match) {
      const formatted = inlineTagsToHtml(h2Match[1]);
      htmlParts.push(`<h2 class="text-xl sm:text-2xl font-bold text-slate-900 my-3 pb-1 border-b border-slate-100">${formatted}</h2>`);
      continue;
    }

    const h2TagMatch = trimmed.match(/^\[(?:크기|size):(대|large|lg|20)\](?:\[(?:굵게|bold)\])?([\s\S]*?)(?:\[\/(?:굵게|bold)\])?\[\/(?:크기|size)\]$/i);
    if (h2TagMatch) {
      const formatted = inlineTagsToHtml(h2TagMatch[2]);
      htmlParts.push(`<h2 class="text-xl sm:text-2xl font-bold text-slate-900 my-3 pb-1 border-b border-slate-100">${formatted}</h2>`);
      continue;
    }

    // Heading 3 (### Title or [크기:중]Title)
    const h3Match = rawLine.match(/^###\s+(.*)$/);
    if (h3Match) {
      const formatted = inlineTagsToHtml(h3Match[1]);
      htmlParts.push(`<h3 class="text-lg sm:text-xl font-bold text-slate-900 my-2.5">${formatted}</h3>`);
      continue;
    }

    const h3TagMatch = trimmed.match(/^\[(?:크기|size):(중|medium|md|17)\](?:\[(?:굵게|bold)\])?([\s\S]*?)(?:\[\/(?:굵게|bold)\])?\[\/(?:크기|size)\]$/i);
    if (h3TagMatch) {
      const formatted = inlineTagsToHtml(h3TagMatch[2]);
      htmlParts.push(`<h3 class="text-lg sm:text-xl font-bold text-slate-900 my-2.5">${formatted}</h3>`);
      continue;
    }

    // Blockquote (> Quote)
    const quoteMatch = rawLine.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      const formatted = inlineTagsToHtml(quoteMatch[1]);
      htmlParts.push(`<blockquote class="my-3 pl-4 py-2 border-l-4 border-[#30308A] bg-slate-50 text-slate-700 italic rounded-r-lg font-medium">${formatted}</blockquote>`);
      continue;
    }

    // Bullet List (- Item or • Item or * Item)
    const listMatch = rawLine.match(/^[-*•]\s+(.*)$/);
    if (listMatch) {
      const formatted = inlineTagsToHtml(listMatch[1]);
      htmlParts.push(`<ul class="list-disc ml-5 my-1 text-slate-800"><li>${formatted}</li></ul>`);
      continue;
    }

    // Already an HTML block tag starting on this line
    if (/^<(?:h[2-6]|blockquote|ul|ol|div|p|hr|figure|pre|table)\b/i.test(trimmed)) {
      htmlParts.push(inlineTagsToHtml(rawLine));
      continue;
    }

    // Standard Paragraph with inline tags & HTML formatting preserved
    const formatted = inlineTagsToHtml(rawLine);
    htmlParts.push(`<p class="my-1.5 leading-relaxed text-slate-800">${formatted}</p>`);
  }

  // 5. Restore any remaining block tokens (e.g. if inline or wrapped)
  let finalHtml = htmlParts.join('');
  for (let idx = 0; idx < blockPlaceholders.length; idx++) {
    finalHtml = finalHtml.replace(
      new RegExp(`___OASIS_BLOCK_${idx}___`, 'g'),
      () => blockPlaceholders[idx]
    );
  }

  // 6. Strictly avoid h1 in article body to preserve 100-point SEO single-H1 score
  finalHtml = finalHtml.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');

  // 7. Clean up redundant adjacent empty paragraph spacers
  finalHtml = finalHtml.replace(/(?:<p[^>]*><br\s*\/?>\s*<\/p>\s*){3,}/gi, '<p><br></p><p><br></p>');

  return finalHtml.trim();
}

/**
 * Converts inline legacy tokens to HTML while preserving valid user HTML tags, spans, and attributes.
 */
function inlineTagsToHtml(text: string): string {
  if (!text) return '';

  let html = text;

  // Convert legacy and browser-generated <font> tags into modern styled spans
  html = html.replace(/<font\b[^>]*\bsize=["']?([5-7])["']?[^>]*>([\s\S]*?)<\/font>/gi, '<span class="text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug">$2</span>');
  html = html.replace(/<font\b[^>]*\bsize=["']?4["']?[^>]*>([\s\S]*?)<\/font>/gi, '<span class="text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug">$2</span>');
  html = html.replace(/<font\b[^>]*\bsize=["']?3["']?[^>]*>([\s\S]*?)<\/font>/gi, '<span class="text-sm sm:text-base font-normal text-slate-800">$2</span>');
  html = html.replace(/<font\b[^>]*\bsize=["']?([1-2])["']?[^>]*>([\s\S]*?)<\/font>/gi, '<span class="text-xs text-slate-500 inline-block">$2</span>');
  html = html.replace(/<font\b[^>]*\bcolor=["']?([^"'>]+)["']?[^>]*>([\s\S]*?)<\/font>/gi, '<span style="color: $1;">$2</span>');
  html = html.replace(/<font\b[^>]*>([\s\S]*?)<\/font>/gi, '<span>$1</span>');

  // Convert legacy font size tags
  html = html.replace(/\[(?:크기|size):(특대|xl|24)\]([\s\S]*?)\[\/(?:크기|size)\]/gi, '<span class="text-2xl sm:text-3xl font-black text-slate-900 inline-block my-1 leading-snug">$2</span>');
  html = html.replace(/\[(?:크기|size):(대|large|lg|20)\]([\s\S]*?)\[\/(?:크기|size)\]/gi, '<span class="text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug">$2</span>');
  html = html.replace(/\[(?:크기|size):(중|medium|md|17)\]([\s\S]*?)\[\/(?:크기|size)\]/gi, '<span class="text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug">$2</span>');
  html = html.replace(/\[(?:크기|size):(소|small|sm|12)\]([\s\S]*?)\[\/(?:크기|size)\]/gi, '<span class="text-xs text-slate-500 inline-block">$2</span>');
  html = html.replace(/\[(대제목|특대)\]([\s\S]*?)\[\/\1\]/gi, '<span class="text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug">$2</span>');
  html = html.replace(/\[소제목\]([\s\S]*?)\[\/소제목\]/gi, '<span class="text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug">$2</span>');
  html = html.replace(/\[작은글씨\]([\s\S]*?)\[\/작은글씨\]/gi, '<span class="text-xs text-slate-500 inline-block">$2</span>');

  // Convert legacy highlight tags to real HTML <mark>
  html = html.replace(/\[(?:형광펜|highlight|노랑)\]([\s\S]*?)\[\/(?:형광펜|highlight|노랑)\]/gi, '<mark class="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-medium border border-amber-300/60">$1</mark>');

  // Convert legacy colors
  html = html.replace(/\[(?:골드|gold)\]([\s\S]*?)\[\/(?:골드|gold)\]/gi, '<span style="color: #b8860b; font-weight: bold;">$1</span>');
  html = html.replace(/\[(?:파랑|blue)\]([\s\S]*?)\[\/(?:파랑|blue)\]/gi, '<span style="color: #30308A; font-weight: bold;">$1</span>');
  html = html.replace(/\[(?:빨강|red)\]([\s\S]*?)\[\/(?:빨강|red)\]/gi, '<span style="color: #e11d48; font-weight: bold;">$1</span>');

  // Convert legacy weights
  html = html.replace(/\[(?:굵게|bold)\]([\s\S]*?)\[\/(?:굵게|bold)\]/gi, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\*\*([^\*]+?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\[(?:중간굵기|중간|semibold|medium)\]([\s\S]*?)\[\/(?:중간굵기|중간|semibold|medium)\]/gi, '<span class="font-semibold text-slate-800">$1</span>');

  // Convert legacy underline
  html = html.replace(/\[(?:밑줄|u)\]([\s\S]*?)\[\/(?:밑줄|u)\]/gi, '<u class="underline decoration-[#30308A]/40 font-medium">$1</u>');

  return html;
}

/**
 * Converts visual WYSIWYG HTML from contentEditable back into clean, portable post content.
 * 100% PRESERVES user HTML, tables, styling, tags, and formatting without destructive stripping!
 */
export function htmlToPostContent(htmlOrElement: HTMLElement | string): string {
  if (!htmlOrElement) return '';

  let container: HTMLElement;

  if (typeof htmlOrElement === 'string') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlOrElement}</div>`, 'text/html');
    container = (doc.body.firstElementChild || doc.body) as HTMLElement;
  } else {
    // Clone node so we never mutate the live visual editor DOM
    container = htmlOrElement.cloneNode(true) as HTMLElement;
  }

  // 1. Convert visual photo cards back to portable [사진N] shortcodes
  const photoCards = container.querySelectorAll('.visual-photo-card, [data-photo-idx]');
  photoCards.forEach((card) => {
    const idx = card.getAttribute('data-photo-idx');
    const photoNum = idx !== null ? Number(idx) + 1 : 1;
    const placeholder = document.createTextNode(`\n\n[사진${photoNum}]\n\n`);
    // Remove immediately following empty spacer paragraph if present
    const nextEl = card.nextElementSibling;
    if (nextEl && nextEl.tagName === 'P' && (nextEl.innerHTML === '<br>' || nextEl.innerHTML.trim() === '')) {
      nextEl.remove();
    }
    card.parentNode?.replaceChild(placeholder, card);
  });

  // 2. Convert visual map cards back to portable [지도:...] shortcodes
  const mapCards = container.querySelectorAll('.visual-map-card, [data-map-title]');
  mapCards.forEach((card) => {
    const title = card.getAttribute('data-map-title') || card.getAttribute('data-map-query') || '';
    const address = card.getAttribute('data-map-address') || '';
    const nextEl = card.nextElementSibling;
    if (nextEl && nextEl.tagName === 'P' && (nextEl.innerHTML === '<br>' || nextEl.innerHTML.trim() === '')) {
      nextEl.remove();
    }
    if (title) {
      const placeholder = document.createTextNode(`\n\n[지도:${title}${address ? `|${address}` : ''}]\n\n`);
      card.parentNode?.replaceChild(placeholder, card);
    } else {
      card.remove();
    }
  });

  // 3. Remove internal editor buttons or UI helpers if any slipped in
  container.querySelectorAll('.delete-photo-btn, .delete-map-btn').forEach((btn) => btn.remove());

  // 4. Remove internal decorative heading point bars so they never duplicate or stack on edits!
  container.querySelectorAll('span.w-1\\.5.h-5, span.w-1\\.5.h-4, span[class*="rounded-full"][class*="shrink-0"]').forEach((el) => {
    if (el.parentElement?.tagName === 'H2' || el.parentElement?.tagName === 'H3') {
      el.remove();
    }
  });

  // 5. Clean up any trailing/leading empty paragraph artifacts & normalize browser-generated divs
  let html = container.innerHTML;

  // Normalize browser-generated <div><br></div> to clean <p><br></p>
  html = html.replace(/<div><br\s*\/?><\/div>/gi, '<p><br></p>');
  html = html.replace(/<p[^>]*>\s*<\/p>/gi, '<p><br></p>');
  html = html.replace(/<div>\s*<\/div>/gi, '');

  // Normalize excessive <p><br></p> occurrences
  html = html.replace(/(?:<p[^>]*><br\s*\/?>\s*<\/p>\s*){3,}/gi, '<p><br></p><p><br></p>');
  html = html.replace(/^(?:<p[^>]*><br\s*\/?>\s*<\/p>\s*)+/i, '');
  html = html.replace(/(?:<p[^>]*><br\s*\/?>\s*<\/p>\s*)+$/i, '');

  return html.trim();
}

/**
 * Convenience helper to render post content to pristine viewer HTML
 */
export function renderPostContentToHtml(
  content: string,
  images: string[] = [],
  defaultMap?: PostMapLocation
): string {
  return postContentToHtml(content, images, defaultMap, false /* viewer mode */);
}

