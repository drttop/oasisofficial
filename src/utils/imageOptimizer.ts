/**
 * Image Optimization Utilities for PageSpeed & Core Web Vitals
 * Automatically serves optimized and responsive sizes for external assets (e.g. Unsplash)
 * while preserving local WebP/optimized formats.
 */

export function getOptimizedImageUrl(
  url?: string | null,
  width: number = 600,
  quality: number = 75
): string {
  if (!url) return '';
  
  // Optimize Unsplash images dynamically to modern WebP format
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fm=webp&fit=crop&w=${width}&q=${quality}&ext=.webp`;
  }

  return url;
}

export function getResponsiveImageProps(
  url?: string | null,
  defaultWidth: number = 600,
  sizes: string = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px'
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) {
    return { src: '' };
  }

  if (url.includes('images.unsplash.com')) {
    const src = getOptimizedImageUrl(url, defaultWidth, 75);
    const srcSet = [
      `${getOptimizedImageUrl(url, 380, 70)} 380w`,
      `${getOptimizedImageUrl(url, 600, 75)} 600w`,
      `${getOptimizedImageUrl(url, 900, 75)} 900w`,
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
