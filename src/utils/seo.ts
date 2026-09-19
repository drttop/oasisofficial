import { PostItem, SiteConfig } from '../types';

/**
 * Utility to dynamically update meta tags in the document head
 */
export function setMetaTag(nameOrProperty: string, content: string, isProperty = false) {
  if (typeof document === 'undefined') return;
  
  const attributeName = isProperty ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attributeName}="${nameOrProperty}"]`) as HTMLMetaElement | null;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, nameOrProperty);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

/**
 * Utility to dynamically update canonical URL link
 */
export function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Utility to inject or update Schema.org JSON-LD structured data
 */
export function setStructuredData(data: object) {
  if (typeof document === 'undefined') return;
  
  let script = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-json-ld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Generates the absolute direct URL for a specific post
 */
export function getPostUrl(postId: string): string {
  if (typeof window === 'undefined') return `?post=${postId}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?post=${encodeURIComponent(postId)}`;
}

/**
 * Updates full SEO attributes for a single community post or site home
 */
export function applySEO(post: PostItem | null, siteConfig: SiteConfig) {
  if (typeof window === 'undefined') return;

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const currentBaseUrl = `${origin}${pathname}`;

  const defaultTitle = siteConfig.seoTitle || `${siteConfig.siteName || '마닐라 오아시스에이전시'} | 필리핀 마닐라 카지노 공식 VIP 에이전트`;
  const defaultDesc = siteConfig.seoDescription || siteConfig.subTitle || '마닐라 오아시스에이전시 - 필리핀 마닐라 & 클락 특급 카지노 VIP 서비스, 5성급 호텔 예약, 전용 의전 픽업 및 맞춤 투어 안내';
  const defaultKeywords = siteConfig.seoKeywords || '마닐라 오아시스에이전시, 오아시스 에이전시, 필리핀 카지노, 마닐라 카지노, 클락 카지노, 오카다 마닐라, 솔레어 리조트, COD 카지노, 한 카지노, VIP 에이전트, 오아시스';
  const defaultImage = `${origin}/images/hero_bg.jpg`;

  if (post) {
    // 1. Single Post SEO
    const postTitle = `${post.title} | ${siteConfig.siteName || '마닐라 오아시스에이전시'}`;
    const postDesc = post.summary || (post.content ? post.content.slice(0, 160).replace(/\n/g, ' ') : defaultDesc);
    const postKeywords = [...(post.tags || []), post.category, siteConfig.siteName || '마닐라 오아시스에이전시'].join(', ');
    const postUrl = getPostUrl(post.id);
    const postImage = post.thumbnail || defaultImage;

    // Document Title
    document.title = postTitle;

    // Standard Meta Tags
    setMetaTag('description', postDesc);
    setMetaTag('keywords', postKeywords);
    setMetaTag('author', post.author || '마닐라 오아시스에이전시');

    // Canonical
    setCanonicalUrl(postUrl);

    // OpenGraph
    setMetaTag('og:title', postTitle, true);
    setMetaTag('og:description', postDesc, true);
    setMetaTag('og:url', postUrl, true);
    setMetaTag('og:type', 'article', true);
    setMetaTag('og:image', postImage, true);
    setMetaTag('og:site_name', siteConfig.siteName || '마닐라 오아시스에이전시', true);
    setMetaTag('article:published_time', post.date ? `${post.date}T00:00:00+09:00` : new Date().toISOString(), true);
    setMetaTag('article:author', post.author || '마닐라 오아시스에이전시', true);
    setMetaTag('article:section', post.category || '커뮤니티', true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', postTitle);
    setMetaTag('twitter:description', postDesc);
    setMetaTag('twitter:image', postImage);

    // Schema.org BlogPosting / Article JSON-LD for Google Crawler
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': postDesc,
      'image': [postImage],
      'datePublished': post.date ? `${post.date}T00:00:00+09:00` : new Date().toISOString(),
      'dateModified': post.date ? `${post.date}T00:00:00+09:00` : new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': post.author || '마닐라 오아시스에이전시',
      },
      'publisher': {
        '@type': 'Organization',
        'name': siteConfig.siteName || '마닐라 오아시스에이전시',
        'logo': {
          '@type': 'ImageObject',
          'url': `${origin}/logo.jpg`,
        },
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': postUrl,
      },
    };
    setStructuredData(jsonLd);

  } else {
    // 2. Default Home Page SEO
    document.title = defaultTitle;

    setMetaTag('description', defaultDesc);
    setMetaTag('keywords', defaultKeywords);
    setMetaTag('author', siteConfig.representative || '마닐라 오아시스에이전시');

    setCanonicalUrl(currentBaseUrl);

    setMetaTag('og:title', defaultTitle, true);
    setMetaTag('og:description', defaultDesc, true);
    setMetaTag('og:url', currentBaseUrl, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:image', defaultImage, true);
    setMetaTag('og:site_name', siteConfig.siteName || '마닐라 오아시스에이전시', true);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', defaultTitle);
    setMetaTag('twitter:description', defaultDesc);
    setMetaTag('twitter:image', defaultImage);

    // Organization & WebSite JSON-LD Schema
    const homeJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': siteConfig.siteName || '마닐라 오아시스에이전시',
      'alternateName': [
        '마닐라 오아시스 에이전시',
        '오아시스에이전시',
        '마닐라 오아시스',
        '오아시스 공식 에이전트',
        'OASIS VIP AGENCY',
        'oasis46',
      ],
      'url': currentBaseUrl,
      'description': defaultDesc,
      'publisher': {
        '@type': 'Organization',
        'name': siteConfig.siteName || '마닐라 오아시스에이전시',
        'url': currentBaseUrl,
        'logo': `${origin}/logo.jpg`,
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': siteConfig.phoneNumber || '+63-917-000-0000',
          'contactType': 'customer service',
          'areaServed': ['KR', 'PH'],
          'availableLanguage': ['Korean', 'English'],
        },
      },
    };
    setStructuredData(homeJsonLd);
  }
}
