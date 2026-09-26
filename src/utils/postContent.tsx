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
export const FormattedPostContent: React.FC<{ content: string; className?: string }> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  const html = postContentToHtml(content);

  return (
    <div
      className={`oasis-article-content oasis-post-body space-y-2.5 leading-relaxed text-slate-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

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
 * Converts post text (with [사진1], [형광펜], **bold**, ## Headings) into real visual WYSIWYG HTML
 */
/**
 * Converts post text (with HTML tables, rich formatting, [사진1], [형광펜], **bold**, ## Headings)
 * into real visual WYSIWYG HTML.
 * Completely compatible with user-written or pasted HTML tables, styling, spans, and markdown.
 */
export function postContentToHtml(
  content: string,
  images: string[] = [],
  defaultMap?: PostMapLocation
): string {
  if (!content) return '<p><br></p>';

  // 1. Protect & Extract HTML Tables so they aren't split by lines
  const tablePlaceholders: string[] = [];
  let processedContent = content;

  // Regex to match existing wrapped tables or raw <table> elements
  const tableRegex = /(?:<div[^>]*class="[^"]*(?:oasis-table-wrap|table-responsive)[^"]*"[^>]*>[\s\S]*?<\/div>|<table[\s\S]*?<\/table>)/gi;
  processedContent = processedContent.replace(tableRegex, (match) => {
    let cleanTable = match.trim();
    // Ensure table is wrapped in a responsive horizontal-scroll container
    if (!cleanTable.includes('oasis-table-wrap') && !cleanTable.includes('table-responsive')) {
      // Ensure table has styling classes if not already styled
      if (!cleanTable.includes('oasis-table')) {
        cleanTable = cleanTable.replace(
          /<table(\b[^>]*)>/i,
          '<table class="oasis-table min-w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-sm"$1>'
        );
      }
      cleanTable = `<div class="oasis-table-wrap overflow-x-auto my-4 max-w-full">${cleanTable}</div>`;
    }
    const placeholder = `___OASIS_TABLE_BLOCK_${tablePlaceholders.length}___`;
    tablePlaceholders.push(cleanTable);
    return `\n\n${placeholder}\n\n`;
  });

  const lines = processedContent.split('\n');
  const htmlParts: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Empty line
    if (trimmed === '') {
      htmlParts.push('<p><br></p>');
      continue;
    }

    // 2. Table Block placeholder match
    const tablePlaceholderMatch = trimmed.match(/^___OASIS_TABLE_BLOCK_(\d+)___$/);
    if (tablePlaceholderMatch) {
      const idx = parseInt(tablePlaceholderMatch[1], 10);
      if (tablePlaceholders[idx]) {
        htmlParts.push(tablePlaceholders[idx]);
        htmlParts.push('<p><br></p>');
      }
      continue;
    }

    // 3. Photo tag match [사진1] ~ [사진6] anywhere on line
    const photoRegex = /\[(?:사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/i;
    if (photoRegex.test(trimmed)) {
      const parts = trimmed.split(photoRegex);
      const match = trimmed.match(photoRegex);
      if (match) {
        const photoNum = parseInt(match[1], 10);
        const idx = photoNum - 1;
        const imgUrl = images[idx];
        const beforeText = parts[0]?.trim();
        const afterText = parts[2]?.trim();

        if (beforeText) {
          htmlParts.push(`<p class="my-1.5 leading-relaxed text-slate-800">${inlineTagsToHtml(beforeText)}</p>`);
        }
        if (imgUrl) {
          htmlParts.push(createVisualPhotoHtml(idx, imgUrl));
        } else {
          htmlParts.push(`<p class="my-1.5 leading-relaxed text-slate-500 font-mono">[사진 ${photoNum} 미등록]</p>`);
        }
        if (afterText) {
          htmlParts.push(`<p class="my-1.5 leading-relaxed text-slate-800">${inlineTagsToHtml(afterText)}</p>`);
        }
        continue;
      }
    }

    // 4. Map tag match [지도:장소명|주소]
    const mapRegex = /\[(?:지도|구글지도|googlemap|google_map|map)(?::\s*([^\]]+))?\]/i;
    if (mapRegex.test(trimmed)) {
      const match = trimmed.match(mapRegex);
      if (match) {
        const arg = match[1]?.trim();
        let title = '';
        let address = '';
        let query = '';
        if (arg) {
          if (arg.includes('|')) {
            const spl = arg.split('|').map((p) => p.trim());
            title = spl[0];
            address = spl[1] || '';
            query = address ? `${title} ${address}` : title;
          } else {
            title = arg;
            query = arg;
          }
        } else if (defaultMap) {
          title = defaultMap.title || '대표 위치';
          address = defaultMap.address || '';
          query = defaultMap.query || title;
        }
        if (title || query) {
          htmlParts.push(createVisualMapHtml(title || query, address, query));
          continue;
        }
      }
    }

    // 5. Divider
    if (/^(\-{3,}|\*{3,}|_{3,}|\[구분선\])$/.test(trimmed)) {
      htmlParts.push('<hr class="my-4 border-t border-slate-200" />');
      continue;
    }

    // 6. Heading 2 (## Title or [크기:대][굵게]Title)
    const h2Match = rawLine.match(/^##\s+(.*)$/);
    if (h2Match) {
      const formatted = inlineTagsToHtml(h2Match[1]);
      htmlParts.push(`<h2 class="text-xl sm:text-2xl font-bold text-slate-900 my-3 pb-1 border-b border-slate-100 flex items-center gap-2"><span class="w-1.5 h-5 bg-[#30308A] rounded-full inline-block shrink-0"></span><span>${formatted}</span></h2>`);
      continue;
    }

    const h2TagMatch = trimmed.match(/^\[(?:크기|size):(대|large|lg|20)\](?:\[(?:굵게|bold)\])?([\s\S]*?)(?:\[\/(?:굵게|bold)\])?\[\/(?:크기|size)\]$/i);
    if (h2TagMatch) {
      const formatted = inlineTagsToHtml(h2TagMatch[2]);
      htmlParts.push(`<h2 class="text-xl sm:text-2xl font-bold text-slate-900 my-3 pb-1 border-b border-slate-100 flex items-center gap-2"><span class="w-1.5 h-5 bg-[#30308A] rounded-full inline-block shrink-0"></span><span>${formatted}</span></h2>`);
      continue;
    }

    // 7. Heading 3 (### Title or [크기:중]Title)
    const h3Match = rawLine.match(/^###\s+(.*)$/);
    if (h3Match) {
      const formatted = inlineTagsToHtml(h3Match[1]);
      htmlParts.push(`<h3 class="text-lg sm:text-xl font-bold text-slate-900 my-2.5 flex items-center gap-2"><span class="w-1.5 h-4 bg-[#E5B54F] rounded-full inline-block shrink-0"></span><span>${formatted}</span></h3>`);
      continue;
    }

    const h3TagMatch = trimmed.match(/^\[(?:크기|size):(중|medium|md|17)\](?:\[(?:굵게|bold)\])?([\s\S]*?)(?:\[\/(?:굵게|bold)\])?\[\/(?:크기|size)\]$/i);
    if (h3TagMatch) {
      const formatted = inlineTagsToHtml(h3TagMatch[2]);
      htmlParts.push(`<h3 class="text-lg sm:text-xl font-bold text-slate-900 my-2.5 flex items-center gap-2"><span class="w-1.5 h-4 bg-[#E5B54F] rounded-full inline-block shrink-0"></span><span>${formatted}</span></h3>`);
      continue;
    }

    // 8. Blockquote (> Quote)
    const quoteMatch = rawLine.match(/^>\s*(.*)$/);
    if (quoteMatch) {
      const formatted = inlineTagsToHtml(quoteMatch[1]);
      htmlParts.push(`<blockquote class="my-3 pl-4 py-2 border-l-4 border-[#30308A] bg-slate-50 text-slate-700 italic rounded-r-lg font-medium">${formatted}</blockquote>`);
      continue;
    }

    // 9. Bullet List (- Item or • Item)
    const listMatch = rawLine.match(/^[-*•]\s+(.*)$/);
    if (listMatch) {
      const formatted = inlineTagsToHtml(listMatch[1]);
      htmlParts.push(`<ul class="list-disc ml-5 my-1 text-slate-800"><li>${formatted}</li></ul>`);
      continue;
    }

    // 10. Already an HTML block tag (h2, h3, h4, blockquote, ul, ol, div, p, hr, figure)
    if (/^<(?:h[2-6]|blockquote|ul|ol|div|p|hr|figure|pre)\b/i.test(trimmed)) {
      htmlParts.push(inlineTagsToHtml(rawLine));
      continue;
    }

    // 11. Standard Paragraph with inline tags & HTML formatting preserved
    const formatted = inlineTagsToHtml(rawLine);
    htmlParts.push(`<p class="my-1.5 leading-relaxed text-slate-800">${formatted}</p>`);
  }

  // Final restoration of any remaining table block tokens (safety net)
  let finalHtml = htmlParts.join('');
  for (let idx = 0; idx < tablePlaceholders.length; idx++) {
    finalHtml = finalHtml.replace(
      new RegExp(`___OASIS_TABLE_BLOCK_${idx}___`, 'g'),
      () => tablePlaceholders[idx]
    );
  }

  // Strictly avoid h1 in article body to preserve 100-point SEO single-H1 score
  finalHtml = finalHtml.replace(/<h1(\b[^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');

  return finalHtml;
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
 * 100% preserves HTML tables, custom formatting, styles, and tags!
 */
export function htmlToPostContent(htmlOrElement: HTMLElement | string): string {
  let doc: Document;

  if (typeof htmlOrElement === 'string') {
    const parser = new DOMParser();
    doc = parser.parseFromString(`<div>${htmlOrElement}</div>`, 'text/html');
  } else {
    doc = htmlOrElement.ownerDocument || document;
  }

  const root = typeof htmlOrElement === 'string' ? doc.body.firstElementChild || doc.body : htmlOrElement;

  const serializeNode = (node: Node): string => {
    // 1. Text node
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tagName = el.tagName.toUpperCase();

    // Check Visual Photo Card -> serialize to portable [사진N] token
    if (el.classList.contains('visual-photo-card') || el.hasAttribute('data-photo-idx')) {
      const idx = el.getAttribute('data-photo-idx');
      if (idx !== null) {
        return `\n\n[사진${Number(idx) + 1}]\n\n`;
      }
      return '';
    }

    // Check Visual Map Card -> serialize to portable [지도:...] token
    if (el.classList.contains('visual-map-card') || el.hasAttribute('data-map-title')) {
      const title = el.getAttribute('data-map-title') || el.getAttribute('data-map-query') || '';
      const address = el.getAttribute('data-map-address') || '';
      if (title) {
        return `\n\n[지도:${title}${address ? `|${address}` : ''}]\n\n`;
      }
      return '';
    }

    // 2. HTML Tables & Table Wrappers: PRESERVE EXACT HTML TABLE STRUCTURE
    if (tagName === 'TABLE' || el.classList.contains('oasis-table-wrap') || el.classList.contains('table-responsive')) {
      // Return entire table HTML cleanly
      return `\n\n${el.outerHTML}\n\n`;
    }

    // Process children
    let inner = '';
    for (let i = 0; i < el.childNodes.length; i++) {
      inner += serializeNode(el.childNodes[i]);
    }

    // Line breaks
    if (tagName === 'BR') {
      return '\n';
    }

    // Headings
    if (tagName === 'H1' || tagName === 'H2') {
      const clean = inner.trim();
      return clean ? `\n\n## ${clean}\n\n` : '';
    }
    if (tagName === 'H3' || tagName === 'H4') {
      const clean = inner.trim();
      return clean ? `\n\n### ${clean}\n\n` : '';
    }

    // Blockquote
    if (tagName === 'BLOCKQUOTE') {
      const clean = inner.trim();
      return clean ? `\n\n> ${clean}\n\n` : '';
    }

    // List item
    if (tagName === 'LI') {
      const clean = inner.trim();
      return clean ? `\n- ${clean}\n` : '';
    }

    // Divider
    if (tagName === 'HR') {
      return '\n\n---\n\n';
    }

    // Highlights (MARK or amber highlight): PRESERVE AS REAL HTML <mark>
    const bgColor = el.style.backgroundColor || '';
    if (tagName === 'MARK' || el.classList.contains('bg-amber-200') || bgColor.includes('254') || bgColor.includes('yellow') || bgColor.includes('#fef08a')) {
      return `<mark class="bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-medium border border-amber-300/60">${inner}</mark>`;
    }

    // Colors: PRESERVE AS REAL HTML SPAN WITH STYLE
    const color = (el.style.color || '').toLowerCase();
    if (color) {
      return `<span style="color: ${el.style.color}; font-weight: ${el.style.fontWeight || 'bold'};">${inner}</span>`;
    }

    // Weights
    if (tagName === 'STRONG' || tagName === 'B' || el.style.fontWeight === 'bold' || el.style.fontWeight === '700') {
      return `<strong>${inner}</strong>`;
    }

    // Underline
    if (tagName === 'U' || el.style.textDecoration?.includes('underline')) {
      return `<u class="underline decoration-[#30308A]/40 font-medium">${inner}</u>`;
    }

    // Italic / Em
    if (tagName === 'EM' || tagName === 'I') {
      return `<em>${inner}</em>`;
    }

    // Strikethrough
    if (tagName === 'S' || tagName === 'DEL') {
      return `<s>${inner}</s>`;
    }

    // Custom Styled Spans / Divs / Fonts (Font sizes, colors, text alignments, etc.)
    if (tagName === 'SPAN' || tagName === 'FONT') {
      const styleAttr = el.getAttribute('style') || '';
      const classAttr = el.getAttribute('class') || '';
      const sizeAttr = el.getAttribute('size');
      const colorAttr = el.getAttribute('color');

      let computedClass = classAttr;
      let computedStyle = styleAttr;

      if (tagName === 'FONT') {
        if (sizeAttr === '5' || sizeAttr === '6' || sizeAttr === '7') {
          computedClass = 'text-xl sm:text-2xl font-bold text-slate-900 inline-block my-1 leading-snug';
        } else if (sizeAttr === '4') {
          computedClass = 'text-base sm:text-lg font-semibold text-slate-800 inline-block my-0.5 leading-snug';
        } else if (sizeAttr === '1' || sizeAttr === '2') {
          computedClass = 'text-xs text-slate-500 inline-block';
        }
        if (colorAttr) {
          computedStyle = (computedStyle ? `${computedStyle}; ` : '') + `color: ${colorAttr}`;
        }
      }

      if (computedStyle || computedClass) {
        return `<span ${computedStyle ? `style="${computedStyle}" ` : ''}${computedClass ? `class="${computedClass}"` : ''}>${inner}</span>`;
      }
      return inner;
    }

    // Paragraph / Div blocks
    if (tagName === 'P' || tagName === 'DIV') {
      const styleAttr = el.getAttribute('style');
      if (styleAttr && styleAttr.includes('text-align')) {
        return `\n<div style="${styleAttr}">${inner}</div>\n`;
      }
      return `\n${inner}\n`;
    }

    return inner;
  };

  const raw = serializeNode(root);

  // Normalize excessive line breaks
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
