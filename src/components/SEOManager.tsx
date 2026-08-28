import React, { useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { applySEO, getPostUrl } from '../utils/seo';

export const SEOManager: React.FC = () => {
  const { selectedPost, setSelectedPost, posts, incrementPostView, siteConfig } = useSite();
  const initialUrlCheckedRef = useRef(false);

  // 1. Initial page load: Check URL query parameters for dynamic post URL (e.g. ?post=post-1)
  useEffect(() => {
    if (posts.length === 0) return;

    if (!initialUrlCheckedRef.current) {
      initialUrlCheckedRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const targetPostId = params.get('post') || params.get('postId') || params.get('p') || (window.location.hash.startsWith('#post-') ? window.location.hash.replace('#post-', '') : null);

      if (targetPostId) {
        const found = posts.find((p) => String(p.id) === String(targetPostId));
        if (found) {
          setSelectedPost(found);
          incrementPostView(found.id);
        }
      }
    }
  }, [posts, setSelectedPost, incrementPostView]);

  // 2. Synchronize Browser History & URL with selectedPost
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentParams = new URLSearchParams(window.location.search);
    const currentPostParam = currentParams.get('post');

    if (selectedPost) {
      // If modal is opened and URL doesn't have this post query, update URL without reload
      if (currentPostParam !== selectedPost.id) {
        const newUrl = getPostUrl(selectedPost.id);
        window.history.pushState({ postId: selectedPost.id }, '', newUrl);
      }
    } else {
      // If modal is closed and URL has ?post=, remove it cleanly
      if (currentPostParam) {
        currentParams.delete('post');
        currentParams.delete('postId');
        currentParams.delete('p');
        const remainingQuery = currentParams.toString();
        const newUrl = remainingQuery ? `${window.location.pathname}?${remainingQuery}` : window.location.pathname;
        window.history.pushState({}, '', newUrl);
      }
    }

    // Apply Dynamic SEO & Meta Tags & Schema.org JSON-LD
    applySEO(selectedPost, siteConfig);
  }, [selectedPost, siteConfig]);

  // 3. Handle Browser Back & Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post') || params.get('postId') || params.get('p');

      if (postId) {
        const target = posts.find((p) => String(p.id) === String(postId));
        if (target) {
          setSelectedPost(target);
          return;
        }
      }
      setSelectedPost(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts, setSelectedPost]);

  return null;
};
