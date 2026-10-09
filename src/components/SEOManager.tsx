import React, { useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { applySEO, getPostUrl, findPostByIdOrAlias } from '../utils/seo';
import { navigateToSection, KNOWN_SECTIONS } from '../utils/navigation';

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
    setIsAdminOpen,
    activeInfoModal,
    setActiveInfoModal,
  } = useSite();

  const handledPostIdRef = useRef<string | null>(null);
  const lastActivePostRef = useRef<any>(null);
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

    const editParam = params.get('edit');
    const actionParam = params.get('action');

    // Check if initial URL is for editing a post or writing a new post (Admin only)
    if ((editParam || actionParam === 'edit') && posts.length > 0) {
      const editTargetId = editParam || targetPostId;
      if (editTargetId) {
        const found = findPostByIdOrAlias(posts, editTargetId);
        if (found) {
          initialCheckedRef.current = true;
          handledPostIdRef.current = found.id;
          const isAdminAuth = sessionStorage.getItem('oasis_admin_auth') === 'true';
          if (isAdminAuth) {
            openPostEditor(found);
          } else {
            setSelectedPost(found);
            setIsAdminOpen(true);
          }
          return;
        }
      }
    } else if (actionParam === 'write') {
      initialCheckedRef.current = true;
      const isAdminAuth = sessionStorage.getItem('oasis_admin_auth') === 'true';
      if (isAdminAuth) {
        openPostEditor(null);
      } else {
        setIsAdminOpen(true);
      }
      return;
    }

    // Check if initial URL is for viewing a specific post
    if (targetPostId && posts.length > 0 && targetPostId !== handledPostIdRef.current) {
      const found = findPostByIdOrAlias(posts, targetPostId);
      if (found) {
        initialCheckedRef.current = true;
        handledPostIdRef.current = found.id;
        setSelectedPost(found);
        incrementPostView(found.id);
      }
    }

    // Check if initial URL is for About, Process, or other sections (Refresh preservation)
    const hash = window.location.hash;
    if (hash === '#about') {
      setActiveInfoModal('about');
    } else if (hash === '#process') {
      setActiveInfoModal('process');
    } else if (hash.startsWith('#') && hash.length > 1) {
      const targetId = hash.replace(/^#/, '');
      if (KNOWN_SECTIONS.includes(targetId)) {
        navigateToSection(targetId, { updateHistory: false });
      }
    } else {
      const savedSection = typeof window !== 'undefined' ? sessionStorage.getItem('oasis_active_section') : null;
      if (savedSection && KNOWN_SECTIONS.includes(savedSection) && savedSection !== 'about' && savedSection !== 'process') {
        navigateToSection(savedSection, { updateHistory: false });
      }
    }
  }, [posts, setSelectedPost, incrementPostView, setActiveInfoModal]);

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
      lastActivePostRef.current = selectedPost;
      const isPromotion = selectedPost.category === '프로모션';
      try {
        sessionStorage.setItem('oasis_last_post_category', selectedPost.category);
        sessionStorage.setItem('oasis_current_board', isPromotion ? 'promotion' : 'community');
      } catch {}

      // Clean edit / action params if present
      if (currentActionParam || currentEditParam) {
        currentParams.delete('action');
        currentParams.delete('edit');
      }

      // If URL doesn't have this post query, update URL without reload
      if (currentPostParam !== selectedPost.id) {
        const newUrl = getPostUrl(selectedPost.id);
        window.history.pushState(
          {
            postId: selectedPost.id,
            originSection: isPromotion ? 'promotion' : 'community',
            section: isPromotion ? 'promotion' : 'community',
          },
          '',
          newUrl
        );
      }

      // Apply Dynamic SEO & Meta Tags & Schema.org JSON-LD
      applySEO(selectedPost, siteConfig);
      return;
    }

    // Neither editor nor post is active: return cleanly to home URL or previous section hash
    if (currentPostParam || currentActionParam || currentEditParam) {
      userClosedRef.current = true;
      currentParams.delete('post');
      currentParams.delete('postId');
      currentParams.delete('p');
      currentParams.delete('action');
      currentParams.delete('edit');
      const remainingQuery = currentParams.toString();
      const previousPost = lastActivePostRef.current;
      const savedCategory = typeof window !== 'undefined' ? sessionStorage.getItem('oasis_last_post_category') : null;
      const savedBoard = typeof window !== 'undefined' ? sessionStorage.getItem('oasis_current_board') : null;

      let isPromotion = false;
      if (previousPost) {
        isPromotion = previousPost.category === '프로모션';
      } else if (savedCategory) {
        isPromotion = savedCategory === '프로모션';
      } else if (savedBoard) {
        isPromotion = savedBoard === 'promotion';
      } else {
        isPromotion = window.location.hash === '#promotion';
      }

      const targetHash = isPromotion ? '#promotion' : '#community';
      const targetId = isPromotion ? 'promotion' : 'community';
      const newUrl = remainingQuery
        ? `${window.location.pathname}?${remainingQuery}${targetHash}`
        : `${window.location.pathname}${targetHash}`;
      window.history.replaceState({ section: targetId, originSection: targetId }, '', newUrl);
    }

    // Reapply default Site Home SEO
    applySEO(null, siteConfig);
  }, [selectedPost, isPostEditorOpen, editingPost, siteConfig]);

  // 3. Handle Browser Back & Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      userClosedRef.current = true;
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post') || params.get('postId') || params.get('p');

      // If browser popped out of editor
      if (isPostEditorOpen) {
        closePostEditor();
      }

      if (postId) {
        const target = findPostByIdOrAlias(posts, postId);
        if (target) {
          handledPostIdRef.current = target.id;
          lastActivePostRef.current = target;
          const isTargetPromotion = target.category === '프로모션';
          try {
            sessionStorage.setItem('oasis_last_post_category', target.category);
            sessionStorage.setItem('oasis_current_board', isTargetPromotion ? 'promotion' : 'community');
          } catch {}
          setSelectedPost(target);
          return;
        }
      }

      // Check if popped into About or Process modal views
      const hash = window.location.hash;
      if (hash === '#about') {
        setActiveInfoModal('about');
        handledPostIdRef.current = null;
        lastActivePostRef.current = null;
        setSelectedPost(null);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }
      if (hash === '#process') {
        setActiveInfoModal('process');
        handledPostIdRef.current = null;
        lastActivePostRef.current = null;
        setSelectedPost(null);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }
      if (hash === '#community') {
        setActiveInfoModal('community');
        handledPostIdRef.current = null;
        lastActivePostRef.current = null;
        setSelectedPost(null);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }

      // Close info modal if returning to main page
      setActiveInfoModal(null);

      // When popping back from post detail view to list (Browser Back button pressed):
      const previousPost = lastActivePostRef.current;
      handledPostIdRef.current = null;
      lastActivePostRef.current = null;
      setSelectedPost(null);

      const savedCategory = typeof window !== 'undefined' ? sessionStorage.getItem('oasis_last_post_category') : null;
      const savedBoard = typeof window !== 'undefined' ? sessionStorage.getItem('oasis_current_board') : null;

      let isPromotion = false;
      if (previousPost) {
        isPromotion = previousPost.category === '프로모션';
      } else if (savedCategory && (hash === '#promotion' || hash === '#community')) {
        isPromotion = savedCategory === '프로모션';
      } else if (savedBoard && (hash === '#promotion' || hash === '#community')) {
        isPromotion = savedBoard === 'promotion';
      } else {
        isPromotion =
          event.state?.section === 'promotion' ||
          event.state?.originSection === 'promotion' ||
          window.location.hash === '#promotion';
      }

      let targetId = isPromotion ? 'promotion' : 'community';
      let targetHash = isPromotion ? '#promotion' : '#community';

      if (!previousPost && hash && hash !== '#community' && hash !== '#promotion') {
        targetId = hash.replace(/^#/, '');
        targetHash = hash;
      } else if (!previousPost && (!hash || hash === '#home')) {
        targetId = 'home';
        targetHash = '';
      }

      if (targetId === 'home') {
        navigateToSection('home', { updateHistory: false });
        return;
      }

      navigateToSection(targetId, { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [posts, setSelectedPost, isPostEditorOpen, closePostEditor, setActiveInfoModal]);

  // 4. Zero-Reflow IntersectionObserver scroll spy: track current visible section
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = ['philippines', 'casino', 'promotion', 'community'];
    const observer = new IntersectionObserver(
      (entries) => {
        if (selectedPost || isPostEditorOpen || activeInfoModal) return;
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio)) {
            bestEntry = entry;
          }
        }
        if (bestEntry && bestEntry.target.id) {
          const activeSec = bestEntry.target.id;
          try {
            sessionStorage.setItem('oasis_active_section', activeSec);
            if (window.location.hash !== `#${activeSec}`) {
              window.history.replaceState(
                { section: activeSec, originSection: activeSec },
                '',
                `${window.location.pathname}#${activeSec}`
              );
            }
          } catch {}
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: [0.15, 0.4],
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [selectedPost, isPostEditorOpen, activeInfoModal]);

  return null;
};
