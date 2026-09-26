/**
 * Image Optimization Utilities for PageSpeed & Core Web Vitals
 * Automatically serves optimized and responsive sizes for external assets (e.g. Unsplash)
 * while preserving local WebP/optimized formats.
 */

export function getOptimizedImageUrl(
  url?: string | null,
  width: number = 1600,
  quality: number = 90
): string {
  if (!url) return '';
  
  // Optimize Unsplash images dynamically to modern WebP format with natural aspect ratio (fit=max)
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fm=webp&fit=max&w=${width}&q=${quality}&ext=.webp`;
  }

  return url;
}

export function getResponsiveImageProps(
  url?: string | null,
  defaultWidth: number = 1200,
  sizes: string = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px'
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) {
    return { src: '' };
  }

  if (url.includes('images.unsplash.com')) {
    const src = getOptimizedImageUrl(url, defaultWidth, 90);
    const srcSet = [
      `${getOptimizedImageUrl(url, 640, 85)} 640w`,
      `${getOptimizedImageUrl(url, 1024, 88)} 1024w`,
      `${getOptimizedImageUrl(url, 1600, 90)} 1600w`,
    ].join(', ');

    return {
      src,
      srcSet,
      sizes,
    };
  }

  return {
    src: url,
  };
}
