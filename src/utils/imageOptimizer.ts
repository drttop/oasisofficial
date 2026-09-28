/**
 * Image Optimization Utilities for PageSpeed & Core Web Vitals
 * Automatically serves optimized and responsive sizes for external assets (e.g. Unsplash)
 * while preserving local WebP/optimized formats.
 */

export function getOptimizedImageUrl(
  url?: string | null,
  width: number = 480,
  quality: number = 75
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
  defaultWidth: number = 480,
  sizes: string = '(max-width: 640px) 45vw, (max-width: 1024px) 50vw, 400px'
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) {
    return { src: '' };
  }

  if (url.includes('images.unsplash.com')) {
    const src = getOptimizedImageUrl(url, defaultWidth, 75);
    const srcSet = [
      `${getOptimizedImageUrl(url, 240, 70)} 240w`,
      `${getOptimizedImageUrl(url, 360, 72)} 360w`,
      `${getOptimizedImageUrl(url, 480, 75)} 480w`,
      `${getOptimizedImageUrl(url, 640, 78)} 640w`,
      `${getOptimizedImageUrl(url, 960, 80)} 960w`,
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
