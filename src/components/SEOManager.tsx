import React, { useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { applySEO, getPostUrl } from '../utils/seo';

export const SEOManager: React.FC = () => {
  const {
    selectedPost,
    setSelectedPost,
    posts,
    incrementPostView,
    siteConfig,
    isPostEditorOpen,
    editingPost,
    openPostEditor,
    closePostEditor,
  } = useSite();

  const handledPostIdRef = useRef<string | null>(null);
  const userClosedRef = useRef(false);
  const initialCheckedRef = useRef(false);

  // 1. Initial page load only: Check URL query parameters for post detail
  useEffect(() => {
    if (typeof window === 'undefined' || initialCheckedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const targetPostId =
      params.get('post') ||
      params.get('postId') ||
      params.get('p') ||
      (window.location.hash.startsWith('#post-')
        ? window.location.hash.replace('#post-', '')
        : null);

    // Check if initial URL is for viewing a specific post
    if (targetPostId && posts.length > 0 && targetPostId !== handledPostIdRef.current) {
      const found = posts.find((p) => String(p.id) === String(targetPostId));
      if (found) {
        initialCheckedRef.current = true;
        handledPostIdRef.current = found.id;
        setSelectedPost(found);
        incrementPostView(found.id);
      }
    }
  }, [posts, setSelectedPost, incrementPostView]);

  // 2. Synchronize Browser History & URL with selectedPost & isPostEditorOpen
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentParams = new URLSearchParams(window.location.search);
    const currentPostParam = currentParams.get('post');
    const currentActionParam = currentParams.get('action');
    const currentEditParam = currentParams.get('edit');

    if (isPostEditorOpen) {
      userClosedRef.current = false;
      const brand = siteConfig.siteName || '마닐라 오아시스에이전시';
      document.title = editingPost
        ? `게시글 수정: ${editingPost.title} | ${brand}`
        : `새 게시글 작성 | 커뮤니티 | ${brand}`;

      if (editingPost) {
        if (currentEditParam !== editingPost.id) {
          currentParams.delete('action');
          currentParams.delete('post');
          currentParams.set('edit', editingPost.id);
          window.history.pushState(
            { edit: editingPost.id },
            '',
            `${window.location.pathname}?${currentParams.toString()}`
          );
        }
      } else {
        if (currentActionParam !== 'write') {
          currentParams.delete('edit');
          currentParams.delete('post');
          currentParams.set('action', 'write');
          window.history.pushState(
            { action: 'write' },
            '',
            `${window.location.pathname}?${currentParams.toString()}`
          );
        }
      }
      return;
    }

    if (selectedPost) {
      userClosedRef.current = false;
      handledPostIdRef.current = selectedPost.id;

      // Clean edit / action params if present
      if (currentActionParam || currentEditParam) {
        currentParams.delete('action');
        currentParams.delete('edit');
      }

      // If URL doesn't have this post query, update URL without reload
      if (currentPostParam !== selectedPost.id) {
        const newUrl = getPostUrl(selectedPost.id);
        window.history.pushState({ postId: selectedPost.id }, '', newUrl);
      }

      // Apply Dynamic SEO & Meta Tags & Schema.org JSON-LD
      applySEO(selectedPost, siteConfig);
      return;
    }

    // Neither editor nor post is active: return cleanly to home URL
    if (currentPostParam || currentActionParam || currentEditParam) {
      userClosedRef.current = true;
      currentParams.delete('post');
      currentParams.delete('postId');
      currentParams.delete('p');
      currentParams.delete('action');
      currentParams.delete('edit');
      const remainingQuery = currentParams.toString();
      const newUrl = remainingQuery
        ? `${window.location.pathname}?${remainingQuery}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }

    // Reapply default Site Home SEO
    applySEO(null, siteConfig);
  }, [selectedPost, isPostEditorOpen, editingPost, siteConfig]);

  // 3. Handle Browser Back & Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      userClosedRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post') || params.get('postId') || params.get('p');

      // If browser popped out of editor
      if (isPostEditorOpen) {
        closePostEditor();
      }

      if (postId) {
        const target = posts.find((p) => String(p.id) === String(postId));
        if (target) {
          handledPostIdRef.current = target.id;
          setSelectedPost(target);
          return;
        }
      }

      handledPostIdRef.current = null;
      setSelectedPost(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts, setSelectedPost, isPostEditorOpen, closePostEditor]);

  return null;
};
