/**
 * Utilities for parsing and rendering post body content with inline photo and Google Maps placeholders.
 * Supports:
 * - Photos: [사진1], [사진 1], [이미지1], [image1]
 * - Google Maps: [지도:오카다 마닐라], [지도:오카다 마닐라|주소], [구글지도:장소명], [map:Query], [지도]
 */

import { PostMapLocation } from '../types';

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
