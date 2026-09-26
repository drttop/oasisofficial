import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFirebase } from '../lib/firebase';
import {
  SiteConfig,
  BannerSlide,
  CasinoItem,
  PhilippineTourSpot,
  ServiceStep,
  PostItem,
  InquiryLead,
  FAQItem,
} from '../types';
import {
  initialSiteConfig,
  initialBannerSlides,
  initialCasinos,
  initialPhilippineSpots,
  initialServiceSteps,
  initialPosts,
  initialFAQs,
  initialInquiryLeads,
} from '../data/initialData';

interface SiteContextType {
  siteConfig: SiteConfig;
  setSiteConfig: (config: SiteConfig) => void;
  updateSiteConfig: (partial: Partial<SiteConfig>) => Promise<void> | void;
  
  bannerSlides: BannerSlide[];
  setBannerSlides: (slides: BannerSlide[]) => void;
  updateBannerSlide: (id: string, slide: Partial<BannerSlide>) => Promise<void> | void;
  
  casinos: CasinoItem[];
  setCasinos: (casinos: CasinoItem[]) => void;
  reorderCasinos: (casinos: CasinoItem[]) => Promise<void> | void;
  addCasino: (casino: Omit<CasinoItem, 'id'>) => Promise<void> | void;
  updateCasino: (id: string, casino: Partial<CasinoItem>) => Promise<void> | void;
  deleteCasino: (id: string) => Promise<void> | void;
  
  philippineSpots: PhilippineTourSpot[];
  setPhilippineSpots: (spots: PhilippineTourSpot[]) => void;
  addPhilippineSpot: (spot: Omit<PhilippineTourSpot, 'id'>) => Promise<void> | void;
  updatePhilippineSpot: (id: string, spot: Partial<PhilippineTourSpot>) => Promise<void> | void;
  deletePhilippineSpot: (id: string) => Promise<void> | void;

  serviceSteps: ServiceStep[];
  setServiceSteps: (steps: ServiceStep[]) => void;
  updateServiceStep: (index: number, step: Partial<ServiceStep>) => Promise<void> | void;
  faqs: FAQItem[];
  setFaqs: (faqs: FAQItem[]) => void;
  addFaq: (faq: Omit<FAQItem, 'id'>) => Promise<void> | void;
  updateFaq: (id: string, faq: Partial<FAQItem>) => Promise<void> | void;
  deleteFaq: (id: string) => Promise<void> | void;
  
  posts: PostItem[];
  setPosts: (posts: PostItem[]) => void;
  addPost: (post: Omit<PostItem, 'id' | 'date'> & { viewCount?: number }) => Promise<void> | void;
  updatePost: (id: string, post: Partial<PostItem>) => Promise<void> | void;
  deletePost: (id: string) => Promise<void> | void;
  incrementPostView: (id: string) => Promise<void> | void;
  
  isPostEditorOpen: boolean;
  editingPost: PostItem | null;
  openPostEditor: (post?: PostItem | null) => void;
  closePostEditor: () => void;
  
  inquiryLeads: InquiryLead[];
  addInquiryLead: (lead: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => Promise<void> | void;
  updateInquiryStatus: (id: string, status: InquiryLead['status']) => Promise<void> | void;
  deleteInquiry: (id: string) => Promise<void> | void;
  
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  
  isInquiryModalOpen: boolean;
  setIsInquiryModalOpen: (open: boolean) => void;
  
  selectedPost: PostItem | null;
  setSelectedPost: (post: PostItem | null) => void;
  
  selectedCasino: CasinoItem | null;
  setSelectedCasino: (casino: CasinoItem | null) => void;
  
  activeSection: string;
  setActiveSection: (section: string) => void;
  
  isCloudSynced: boolean;
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => void;
  getExportJSONString: () => string;
  importDataJSON: (jsonString: string) => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'oasis_site_config_v8',
  SLIDES: 'oasis_banner_slides_v8',
  CASINOS: 'oasis_casinos_v8',
  SPOTS: 'oasis_philippine_spots_v8',
  POSTS: 'oasis_posts_v8',
  LEADS: 'oasis_inquiry_leads_v8',
  STEPS: 'oasis_service_steps_v8',
  FAQS: 'oasis_faqs_v8',
};

const sanitizeConfig = (cfg: Partial<SiteConfig>): SiteConfig => {
  const merged = { ...initialSiteConfig, ...cfg };
  if (!merged.headerLogo || merged.headerLogo.includes('oasis_gold_logo') || merged.headerLogo.includes('oasis_logo_official')) {
    merged.headerLogo = '/images/oasis_header_logo.webp';
  }
  return merged;
};

const sanitizeSlides = (slides: BannerSlide[]): BannerSlide[] => {
  return slides.map((slide, idx) => {
    let bg = slide.bgImage;
    if (!bg || bg.includes('/assets/') || bg.includes('oasis_gold_hero') || bg.includes('casino_table_panoramic')) {
      bg = idx === 0 ? '/images/hero_bg.jpg' : '/images/casino_table.jpg';
    }
    return { ...slide, bgImage: bg };
  });
};

export const DEFAULT_CASINO_ORDER: Record<string, number> = {
  'okada-manila': 1,
  'city-of-dreams': 2,
  'solaire-resort': 3,
  'newport-world-resorts': 4,
  'hann-casino-clark': 5,
  'dheights-clark': 6,
};

export const sortCasinos = (items: CasinoItem[]): CasinoItem[] => {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? DEFAULT_CASINO_ORDER[a.id] ?? 99;
    const orderB = b.order ?? DEFAULT_CASINO_ORDER[b.id] ?? 99;
    return orderA - orderB;
  });
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfigState] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!saved) return initialSiteConfig;
    try {
      return sanitizeConfig(JSON.parse(saved));
    } catch {
      return initialSiteConfig;
    }
  });

  const [bannerSlides, setBannerSlidesState] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLIDES);
    return saved ? sanitizeSlides(JSON.parse(saved)) : initialBannerSlides;
  });

  const [casinos, setCasinosState] = useState<CasinoItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASINOS);
    if (!saved) return sortCasinos(initialCasinos);
    try {
      return sortCasinos(JSON.parse(saved));
    } catch {
      return sortCasinos(initialCasinos);
    }
  });

  const [philippineSpots, setPhilippineSpotsState] = useState<PhilippineTourSpot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPOTS);
    return saved ? JSON.parse(saved) : initialPhilippineSpots;
  });

  const [posts, setPostsState] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!saved) return initialPosts;
    try {
      const parsed: PostItem[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((p) => p.id));
      const missingInitial = initialPosts.filter((ip) => !existingIds.has(ip.id));
      const combined = [...parsed, ...missingInitial];
      // Ensure initial sample posts inherit map data if user had old localStorage
      return combined.map((p) => {
        const matchingInitial = initialPosts.find((ip) => ip.id === p.id);
        if (matchingInitial?.mapLocation && !p.mapLocation) {
          return {
            ...p,
            mapLocation: matchingInitial.mapLocation,
            content:
              matchingInitial.content.includes('[지도') && !p.content.includes('[지도')
                ? matchingInitial.content
                : p.content,
          };
        }
        return p;
      });
    } catch {
      return initialPosts;
    }
  });

  const [inquiryLeads, setInquiryLeadsState] = useState<InquiryLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : initialInquiryLeads;
  });

  const [serviceSteps, setServiceStepsState] = useState<ServiceStep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEPS);
    return saved ? JSON.parse(saved) : initialServiceSteps;
  });

  const [faqs, setFaqsState] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
    return saved ? JSON.parse(saved) : initialFAQs;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const targetPostId = params.get('post') || params.get('postId') || params.get('p') || (window.location.hash.startsWith('#post-') ? window.location.hash.replace('#post-', '') : null);
      if (targetPostId) {
        const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
        const postsList: PostItem[] = saved ? JSON.parse(saved) : initialPosts;
        return postsList.find((p) => String(p.id) === String(targetPostId)) || null;
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [selectedCasino, setSelectedCasino] = useState<CasinoItem | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);

  const openPostEditor = (post: PostItem | null = null) => {
    setEditingPost(post);
    setIsPostEditorOpen(true);
  };

  const closePostEditor = () => {
    setIsPostEditorOpen(false);
    setEditingPost(null);
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('action') || url.searchParams.has('edit')) {
          url.searchParams.delete('action');
          url.searchParams.delete('edit');
          const cleanSearch = url.searchParams.toString();
          const cleanUrl = url.pathname + (cleanSearch ? `?${cleanSearch}` : '') + (url.hash || '');
          window.history.pushState({}, '', cleanUrl);
        }
      } catch {
        // fallback
      }
    }
  };

  // 1. Setup Firestore Realtime Listeners (Deferred until idle to maximize PageSpeed & minimize TBT)
  useEffect(() => {
    let unsubscribeConfig = () => {};
    let unsubscribePosts = () => {};
    let unsubscribeCasinos = () => {};
    let unsubscribeSpots = () => {};
    let unsubscribeSlides = () => {};
    let unsubscribeSteps = () => {};
    let unsubscribeFaqs = () => {};
    let isCancelled = false;

    // Start listeners during browser idle time or after initial render
    const startListeners = async () => {
      if (isCancelled) return;
      try {
        const { db, fs } = await loadFirebase();
        if (isCancelled) return;
        const { doc, collection, onSnapshot } = fs;

        // 1) Listen to Site Config
        const configDocRef = doc(db, 'site_config', 'main');
        unsubscribeConfig = onSnapshot(configDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as Partial<SiteConfig>;
            setSiteConfigState(sanitizeConfig(data));
            setIsCloudSynced(true);
          }
        }, (err) => console.warn('Firestore config listener error:', err));

        // 2) Listen to Posts
        const postsColRef = collection(db, 'posts');
        unsubscribePosts = onSnapshot(postsColRef, (snap) => {
          if (!snap.empty) {
            const remoteItems = snap.docs.map((d) => {
              const data = d.data();
              return {
                ...data,
                id: d.id,
                viewCount: typeof data.viewCount === 'number' && !isNaN(data.viewCount) ? data.viewCount : 392,
              } as PostItem;
            });

            setPostsState((prev) => {
              const remoteMap = new Map(remoteItems.map((p) => [p.id, p]));
              const merged = [...remoteItems];
              prev.forEach((localPost) => {
                if (!remoteMap.has(localPost.id)) {
                  merged.push(localPost);
                }
              });
              merged.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                const dateComp = (b.date || '').localeCompare(a.date || '');
                if (dateComp !== 0) return dateComp;
                return (b.createdAt || 0) - (a.createdAt || 0);
              });
              return merged;
            });
            setIsCloudSynced(true);
          }
        }, (err) => console.warn('Firestore posts listener error:', err));

        // 3) Listen to Casinos
        const casinosColRef = collection(db, 'casinos');
        unsubscribeCasinos = onSnapshot(casinosColRef, (snap) => {
          if (!snap.empty) {
            const rawItems = snap.docs.map((d) => ({ ...d.data(), id: d.id } as CasinoItem));
            const sorted = sortCasinos(rawItems);
            setCasinosState(sorted);
          }
        }, (err) => console.warn('Firestore casinos listener error:', err));

        // 4) Listen to Philippine Tour Spots
        const spotsColRef = collection(db, 'philippine_spots');
        unsubscribeSpots = onSnapshot(spotsColRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PhilippineTourSpot));
            setPhilippineSpotsState(items);
          }
        }, (err) => console.warn('Firestore spots listener error:', err));

        // 5) Listen to Banner Slides
        const slidesColRef = collection(db, 'banner_slides');
        unsubscribeSlides = onSnapshot(slidesColRef, (snap) => {
          if (!snap.empty) {
            const rawItems = snap.docs.map((d) => ({ ...d.data(), id: d.id } as BannerSlide));
            const cleanedItems = sanitizeSlides(rawItems);
            setBannerSlidesState(cleanedItems);
          }
        }, (err) => console.warn('Firestore banner slides listener error:', err));

        // 6) Listen to FAQs
        const faqsColRef = collection(db, 'faqs');
        unsubscribeFaqs = onSnapshot(faqsColRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as FAQItem));
            setFaqsState(items);
          }
        }, (err) => console.warn('Firestore faqs listener error:', err));

        // 7) Listen to Service Steps Doc
        const stepsDocRef = doc(db, 'site_config', 'service_steps');
        unsubscribeSteps = onSnapshot(stepsDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data.steps)) {
              setServiceStepsState(data.steps);
            }
          }
        }, (err) => console.warn('Firestore service steps listener error:', err));

      } catch (err) {
        console.error('Firebase initialization error:', err);
      }
    };

    // Defer listener initialization to free main thread for initial paint & interaction
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(startListeners, { timeout: 3500 });
      } else {
        startListeners();
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      unsubscribeConfig();
      unsubscribePosts();
      unsubscribeCasinos();
      unsubscribeSpots();
      unsubscribeSlides();
      unsubscribeSteps();
      unsubscribeFaqs();
    };
  }, []);

  // 1-B. Inquiries listener: ONLY active when Admin panel is opened
  useEffect(() => {
    if (!isAdminOpen) return;
    let unsubscribe = () => {};
    let isCancelled = false;
    (async () => {
      try {
        const { db, fs } = await loadFirebase();
        if (isCancelled) return;
        const inquiriesColRef = fs.collection(db, 'inquiries');
        unsubscribe = fs.onSnapshot(inquiriesColRef, (snap) => {
          if (!snap.empty) {
            const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as InquiryLead));
            items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
            setInquiryLeadsState(items);
          }
        }, (err) => console.warn('Firestore inquiries listener error:', err));
      } catch (err) {
        console.warn('Inquiries listener error:', err);
      }
    })();
    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [isAdminOpen]);

  // Local Storage Mirroring for immediate responsive UX
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(bannerSlides));
  }, [bannerSlides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CASINOS, JSON.stringify(casinos));
  }, [casinos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(philippineSpots));
  }, [philippineSpots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(inquiryLeads));
  }, [inquiryLeads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEPS, JSON.stringify(serviceSteps));
  }, [serviceSteps]);

  // Point color sync to CSS custom property
  useEffect(() => {
    document.documentElement.style.setProperty('--point-color', siteConfig.pointColor || '#30308A');
  }, [siteConfig.pointColor]);

  // ===================== CRUD ACTIONS WITH FIRESTORE SYNC =====================

  const updateSiteConfig = async (partial: Partial<SiteConfig>) => {
    setSiteConfigState((prev) => ({ ...prev, ...partial }));
    try {
      const { db, fs } = await loadFirebase();
      const configDocRef = fs.doc(db, 'site_config', 'main');
      await fs.setDoc(configDocRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to sync siteConfig to Firestore:', err);
    }
  };

  const setBannerSlides = (slides: BannerSlide[]) => {
    setBannerSlidesState(slides);
  };

  const updateBannerSlide = async (id: string, slide: Partial<BannerSlide>) => {
    setBannerSlidesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...slide } : item))
    );
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'banner_slides', id);
      await fs.setDoc(docRef, slide, { merge: true });
    } catch (err) {
      console.error('Failed to update banner slide in Firestore:', err);
    }
  };

  const setCasinos = (newCasinos: CasinoItem[]) => {
    setCasinosState(sortCasinos(newCasinos));
  };

  const reorderCasinos = async (orderedList: CasinoItem[]) => {
    const updated = orderedList.map((c, idx) => ({ ...c, order: idx + 1 }));
    setCasinosState(updated);
    try {
      const { db, fs } = await loadFirebase();
      const batch = fs.writeBatch(db);
      updated.forEach((c) => {
        batch.set(fs.doc(db, 'casinos', c.id), { order: c.order }, { merge: true });
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to update casino order in Firestore:', err);
    }
  };

  const addCasino = async (casino: Omit<CasinoItem, 'id'>) => {
    const newId = `casino-${Date.now()}`;
    const newCasino: CasinoItem = { ...casino, id: newId };
    setCasinosState((prev) => [newCasino, ...prev]);
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'casinos', newId);
      await fs.setDoc(docRef, newCasino);
    } catch (err) {
      console.error('Failed to add casino to Firestore:', err);
    }
  };

  const updateCasino = async (id: string, partial: Partial<CasinoItem>) => {
    setCasinosState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'casinos', id);
      await fs.setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update casino in Firestore:', err);
    }
  };

  const deleteCasino = async (id: string) => {
    setCasinosState((prev) => prev.filter((item) => item.id !== id));
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'casinos', id);
      await fs.deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete casino from Firestore:', err);
    }
  };

  const setPosts = (newPosts: PostItem[]) => {
    setPostsState(newPosts);
  };

  const addPost = async (post: Omit<PostItem, 'id' | 'date'> & { viewCount?: number }) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timestamp = Date.now();
    
    // Find next safe unique ID
    let nextNum = 1;
    posts.forEach((p) => {
      const match = p.id.match(/^post-(\d+)$/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= nextNum && n < 100000) {
          nextNum = n + 1;
        }
      }
    });
    // Ensure ID doesn't clash with any existing document
    const candidateId = `post-${nextNum}`;
    const newId = posts.some((p) => p.id === candidateId) ? `post-${timestamp}` : candidateId;

    const initialViews = typeof post.viewCount === 'number' && !isNaN(post.viewCount) && post.viewCount >= 0
      ? post.viewCount
      : 392;

    const newPost: PostItem = {
      ...post,
      id: newId,
      viewCount: initialViews,
      date: dateStr,
      createdAt: timestamp,
    };

    // Immediate local update with proper sorting (pinned first, then date / createdAt desc)
    setPostsState((prev) => {
      const updated = [newPost, ...prev.filter((p) => p.id !== newId)];
      updated.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const dateComp = (b.date || '').localeCompare(a.date || '');
        if (dateComp !== 0) return dateComp;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
      return updated;
    });

    try {
      const cleanDoc: Record<string, any> = {};
      Object.entries(newPost).forEach(([k, v]) => {
        if (v !== undefined) {
          cleanDoc[k] = v;
        }
      });
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', newId);
      await Promise.race([
        fs.setDoc(docRef, cleanDoc),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
      console.log('Post successfully saved to Firestore:', newId);
    } catch (err) {
      console.error('Failed to add post to Firestore:', err);
    }
  };

  const updatePost = async (id: string, partial: Partial<PostItem>) => {
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const cleanPartial: Record<string, any> = {};
      Object.entries(partial).forEach(([k, v]) => {
        if (v !== undefined) {
          cleanPartial[k] = v;
        }
      });
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      await Promise.race([
        fs.setDoc(docRef, cleanPartial, { merge: true }),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
      console.log('Post successfully updated in Firestore:', id);
    } catch (err) {
      console.error('Failed to update post in Firestore:', err);
    }
  };

  const deletePost = async (id: string) => {
    setPostsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      await fs.deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete post from Firestore:', err);
    }
  };

  const incrementPostView = async (id: string) => {
    // 1. Optimistic UI update
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item))
    );

    // 2. Prevent spamming Firestore writes: only write once per session per post
    if (typeof window !== 'undefined') {
      try {
        const sessionKey = `viewed_post_${id}`;
        if (sessionStorage.getItem(sessionKey)) {
          return; // Already counted in this session, save Firestore write quota
        }
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // ignore storage errors
      }
    }

    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      const target = posts.find((p) => p.id === id);
      if (target) {
        await fs.updateDoc(docRef, { viewCount: (target.viewCount || 0) + 1 });
      }
    } catch (err) {
      console.warn('Failed to increment view count in Firestore:', err);
    }
  };

  const addInquiryLead = async (lead: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = `inq-${Date.now()}`;
    const newLead: InquiryLead = {
      ...lead,
      id: newId,
      createdAt: dateStr,
      status: '접수대기',
    };
    setInquiryLeadsState((prev) => [newLead, ...prev]);
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'inquiries', newId);
      await fs.setDoc(docRef, newLead);
    } catch (err) {
      console.error('Failed to submit inquiry to Firestore:', err);
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryLead['status']) => {
    setInquiryLeadsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'inquiries', id);
      await fs.updateDoc(docRef, { status });
    } catch (err) {
      console.error('Failed to update inquiry in Firestore:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiryLeadsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'inquiries', id);
      await fs.deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete inquiry from Firestore:', err);
    }
  };

  const setServiceSteps = (newSteps: ServiceStep[]) => {
    setServiceStepsState(newSteps);
  };

  const updateServiceStep = async (index: number, partial: Partial<ServiceStep>) => {
    const next = [...serviceSteps];
    if (next[index]) {
      next[index] = { ...next[index], ...partial };
      setServiceStepsState(next);
      try {
        const { db, fs } = await loadFirebase();
        const stepsDocRef = fs.doc(db, 'site_config', 'service_steps');
        await fs.setDoc(stepsDocRef, { steps: next });
      } catch (err) {
        console.error('Failed to update service steps in Firestore:', err);
      }
    }
  };

  const setPhilippineSpots = (newSpots: PhilippineTourSpot[]) => {
    setPhilippineSpotsState(newSpots);
  };

  const addPhilippineSpot = async (spot: Omit<PhilippineTourSpot, 'id'>) => {
    const newId = `spot-${Date.now()}`;
    const newSpot: PhilippineTourSpot = { ...spot, id: newId };
    setPhilippineSpotsState((prev) => [newSpot, ...prev]);
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'philippine_spots', newId);
      await fs.setDoc(docRef, newSpot);
    } catch (err) {
      console.error('Failed to add spot to Firestore:', err);
    }
  };

  const updatePhilippineSpot = async (id: string, partial: Partial<PhilippineTourSpot>) => {
    setPhilippineSpotsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'philippine_spots', id);
      await fs.setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update spot in Firestore:', err);
    }
  };

  const deletePhilippineSpot = async (id: string) => {
    setPhilippineSpotsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'philippine_spots', id);
      await fs.deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete spot from Firestore:', err);
    }
  };

  const setFaqs = (newFaqs: FAQItem[]) => {
    setFaqsState(newFaqs);
  };

  const addFaq = async (faq: Omit<FAQItem, 'id'>) => {
    const newId = `faq-${Date.now()}`;
    const newFaq: FAQItem = { ...faq, id: newId };
    setFaqsState((prev) => [...prev, newFaq]);
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'faqs', newId);
      await fs.setDoc(docRef, newFaq);
    } catch (err) {
      console.error('Failed to add faq to Firestore:', err);
    }
  };

  const updateFaq = async (id: string, partial: Partial<FAQItem>) => {
    setFaqsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'faqs', id);
      await fs.setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update faq in Firestore:', err);
    }
  };

  const deleteFaq = async (id: string) => {
    setFaqsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'faqs', id);
      await fs.deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete faq from Firestore:', err);
    }
  };

  const resetToDefaults = async () => {
    setSiteConfigState(initialSiteConfig);
    setBannerSlidesState(initialBannerSlides);
    setCasinosState(initialCasinos);
    setPhilippineSpotsState(initialPhilippineSpots);
    setPostsState(initialPosts);
    setInquiryLeadsState(initialInquiryLeads);
    setServiceStepsState(initialServiceSteps);
    setFaqsState(initialFAQs);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.SLIDES);
    localStorage.removeItem(STORAGE_KEYS.CASINOS);
    localStorage.removeItem(STORAGE_KEYS.SPOTS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.STEPS);
    localStorage.removeItem(STORAGE_KEYS.FAQS);

    // Sync reset to Firestore
    try {
      const { db, fs } = await loadFirebase();
      await fs.setDoc(fs.doc(db, 'site_config', 'main'), initialSiteConfig);
      await fs.setDoc(fs.doc(db, 'site_config', 'service_steps'), { steps: initialServiceSteps });

      // Clean & re-seed posts
      const postsSnap = await fs.getDocs(fs.collection(db, 'posts'));
      const batch = fs.writeBatch(db);
      postsSnap.docs.forEach((d) => batch.delete(d.ref));
      initialPosts.forEach((p) => batch.set(fs.doc(db, 'posts', p.id), p));
      await batch.commit();
    } catch (err) {
      console.error('Failed to reset Firestore to defaults:', err);
    }
  };

  const getExportJSONString = (): string => {
    const exportObject = {
      siteConfig,
      bannerSlides,
      casinos,
      philippineSpots,
      posts,
      inquiryLeads,
      serviceSteps,
      faqs,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportObject, null, 2);
  };

  const exportDataJSON = () => {
    const jsonStr = getExportJSONString();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oasis_agent_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      const { db, fs } = await loadFirebase();
      if (parsed.siteConfig) {
        setSiteConfigState(parsed.siteConfig);
        await fs.setDoc(fs.doc(db, 'site_config', 'main'), parsed.siteConfig);
      }
      if (parsed.posts && Array.isArray(parsed.posts)) {
        setPostsState(parsed.posts);
        const batch = fs.writeBatch(db);
        parsed.posts.forEach((p: PostItem) => batch.set(fs.doc(db, 'posts', p.id), p));
        await batch.commit();
      }
      if (parsed.casinos && Array.isArray(parsed.casinos)) {
        setCasinosState(parsed.casinos);
        const batch = fs.writeBatch(db);
        parsed.casinos.forEach((c: CasinoItem) => batch.set(fs.doc(db, 'casinos', c.id), c));
        await batch.commit();
      }
      if (parsed.philippineSpots && Array.isArray(parsed.philippineSpots)) {
        setPhilippineSpotsState(parsed.philippineSpots);
        const batch = fs.writeBatch(db);
        parsed.philippineSpots.forEach((s: PhilippineTourSpot) => batch.set(fs.doc(db, 'philippine_spots', s.id), s));
        await batch.commit();
      }
      if (parsed.bannerSlides && Array.isArray(parsed.bannerSlides)) {
        setBannerSlidesState(parsed.bannerSlides);
        const batch = fs.writeBatch(db);
        parsed.bannerSlides.forEach((b: BannerSlide) => batch.set(fs.doc(db, 'banner_slides', b.id), b));
        await batch.commit();
      }
      if (parsed.faqs && Array.isArray(parsed.faqs)) {
        setFaqsState(parsed.faqs);
        const batch = fs.writeBatch(db);
        parsed.faqs.forEach((f: FAQItem) => batch.set(fs.doc(db, 'faqs', f.id), f));
        await batch.commit();
      }
      if (parsed.serviceSteps && Array.isArray(parsed.serviceSteps)) {
        setServiceStepsState(parsed.serviceSteps);
        await fs.setDoc(fs.doc(db, 'site_config', 'service_steps'), { steps: parsed.serviceSteps });
      }
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SiteContext.Provider
      value={{
        siteConfig,
        setSiteConfig: setSiteConfigState,
        updateSiteConfig,
        bannerSlides,
        setBannerSlides,
        updateBannerSlide,
        casinos,
        setCasinos,
        reorderCasinos,
        addCasino,
        updateCasino,
        deleteCasino,
        philippineSpots,
        setPhilippineSpots,
        addPhilippineSpot,
        updatePhilippineSpot,
        deletePhilippineSpot,
        serviceSteps,
        setServiceSteps,
        updateServiceStep,
        faqs,
        setFaqs,
        addFaq,
        updateFaq,
        deleteFaq,
        posts,
        setPosts,
        addPost,
        updatePost,
        deletePost,
        incrementPostView,
        isPostEditorOpen,
        editingPost,
        openPostEditor,
        closePostEditor,
        inquiryLeads,
        addInquiryLead,
        updateInquiryStatus,
        deleteInquiry,
        isAdminOpen,
        setIsAdminOpen,
        isInquiryModalOpen,
        setIsInquiryModalOpen,
        selectedPost,
        setSelectedPost,
        selectedCasino,
        setSelectedCasino,
        activeSection,
        setActiveSection,
        isCloudSynced,
        resetToDefaults,
        exportDataJSON,
        getExportJSONString,
        importDataJSON,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
