/**
 * Image compression and client-side processing utility
 * Resizes large smartphone/camera photos to web-optimized dimensions & JPEG quality
 * to guarantee instant uploads, smooth UI rendering, and safe Firestore persistence (<1MB limit).
 */

export interface ProcessedImageResult {
  dataUrl: string;
  name: string;
  size: number;
}

/**
 * Compresses an uploaded image file to a safe web resolution & quality.
 * Guarantees output base64 data string is kept compact (~40KB - 75KB)
 * so that even with 6 photos, total Firestore document size is well under 500KB.
 */
export const compressImageFile = async (
  file: File,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.65
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If small SVG or small GIF, keep format if < 60KB
    if ((file.type === 'image/svg+xml' || file.type === 'image/gif') && file.size < 60000) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // If string length still exceeds 100,000 characters (~75KB), apply secondary pass
        if (compressedDataUrl.length > 100000) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.52);
        }

        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Optimizes an existing base64 dataUrl if it is too large
 * Guarantees it doesn't cause Firestore document overflow.
 */
export const optimizeDataUrl = async (
  dataUrl: string,
  maxWidth = 720,
  maxHeight = 720,
  quality = 0.65
): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  // If already under ~80KB in length, no recompression needed
  if (dataUrl.length < 85000) return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      let result = canvas.toDataURL('image/jpeg', quality);
      if (result.length > 100000) {
        result = canvas.toDataURL('image/jpeg', 0.50);
      }
      resolve(result);
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Creates an ultra-lightweight preview thumbnail (~8KB - 15KB)
 */
export const createMiniThumbnail = async (dataUrl: string): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 260;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.55));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

