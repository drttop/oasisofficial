/**
 * Utilities for parsing and rendering post body content with inline photo placeholders.
 * Supports tags like [사진1], [사진 1], [사진2], [이미지1], [image1], etc.
 */

export interface ContentSegment {
  type: 'text' | 'image';
  text?: string;
  imageIndex?: number;
  imageUrl?: string;
  imageLabel?: string;
}

export function parsePostContent(content: string, images: string[] = []): ContentSegment[] {
  if (!content) return [];

  // Regex to match [사진1], [사진 1], [사진2], [이미지1], [image1], [IMAGE_1], etc.
  const regex = /\[(사진|이미지|image|IMAGE)[_\s]*([1-9][0-9]*)\]/gi;
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
      // If photo doesn't exist for this index, leave the text as is
      segments.push({
        type: 'text',
        text: match[0],
      });
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
 * Returns the standard tag for a photo number, e.g. [사진1]
 */
export function getPhotoTag(photoNumber: number): string {
  return `[사진${photoNumber}]`;
}
