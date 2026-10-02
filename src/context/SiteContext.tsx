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
  addPost: (post: Omit<PostItem, 'id' | 'date'> & { viewCount?: number }) => Promise<PostItem>;
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
  
  activeInfoModal: 'about' | 'process' | null;
  setActiveInfoModal: (modal: 'about' | 'process' | null) => void;
  
  activeSection: string;
  setActiveSection: (section: string) => void;
  
  isCloudSynced: boolean;
  isQuotaExceeded: boolean;
  refreshCloudData: (force?: boolean) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  restoreOriginalBranding: () => Promise<void>;
  restoreAllPostsAndImages: () => Promise<void>;
  exportDataJSON: () => void;
  getExportJSONString: () => string;
  importDataJSON: (jsonString: string) => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const APP_STORAGE_PREFIX = 'oasis_79f47989';
export const STORAGE_KEYS = {
  CONFIG: `${APP_STORAGE_PREFIX}_config_v10`,
  SLIDES: `${APP_STORAGE_PREFIX}_slides_v10`,
  CASINOS: `${APP_STORAGE_PREFIX}_casinos_v10`,
  SPOTS: `${APP_STORAGE_PREFIX}_spots_v10`,
  POSTS: `${APP_STORAGE_PREFIX}_posts_v12`,
  DELETED_POSTS: `${APP_STORAGE_PREFIX}_deleted_post_ids_v12`,
  LEADS: `${APP_STORAGE_PREFIX}_leads_v10`,
  STEPS: `${APP_STORAGE_PREFIX}_steps_v10`,
  FAQS: `${APP_STORAGE_PREFIX}_faqs_v10`,
  LAST_SYNC: `${APP_STORAGE_PREFIX}_last_sync_v10`,
  QUOTA_EXCEEDED: `${APP_STORAGE_PREFIX}_quota_exceeded_v10`,
};

let isQuotaExceededFlag = false;

export const isFirestoreQuotaExceeded = (): boolean => {
  if (isQuotaExceededFlag) return true;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.QUOTA_EXCEEDED);
      if (stored) {
        const storedTime = parseInt(stored, 10);
        if (!isNaN(storedTime)) {
          // If exceeded flag was set more than 1 hour ago, auto-reset
          if (Date.now() - storedTime > 60 * 60 * 1000) {
            sessionStorage.removeItem(STORAGE_KEYS.QUOTA_EXCEEDED);
            isQuotaExceededFlag = false;
            return false;
          }
        } else if (stored === 'true') {
          // Reset legacy string flag so new sessions retest connection
          sessionStorage.removeItem(STORAGE_KEYS.QUOTA_EXCEEDED);
          isQuotaExceededFlag = false;
          return false;
        }
        isQuotaExceededFlag = true;
        return true;
      }
    } catch {}
  }
  return false;
};

export const markFirestoreQuotaExceeded = () => {
  isQuotaExceededFlag = true;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(STORAGE_KEYS.QUOTA_EXCEEDED, String(Date.now()));
    } catch {}
  }
  console.warn('[Firebase Quota] 일일 무료 할당량(Free Tier)이 초과되어 로컬 캐시 모드로 안전하게 자동 전환되었습니다.');
};

export const clearFirestoreQuotaExceeded = () => {
  isQuotaExceededFlag = false;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.QUOTA_EXCEEDED);
    } catch {}
  }
};

/**
 * Safely sanitizes an object before writing to Firestore:
 * Strips all undefined fields recursively so Firestore never throws
 * "Unsupported field value: undefined"
 */
const sanitizeForFirestore = (obj: any): any => {
  if (obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore).filter((v) => v !== undefined);
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return obj;
};

export const getDeletedPostIds = (): Set<string> => {
  // Official posts must never be blacklisted or auto-deleted by legacy storage keys
  return new Set<string>();
};

const sanitizeConfig = (cfg: Partial<SiteConfig>): SiteConfig => {
  const merged = { ...initialSiteConfig, ...cfg };
  // Guard official header logo: If missing, contains old names, or is a heavy raw base64 data-url from a copied app, enforce official Oasis logo
  if (
    !merged.headerLogo ||
    merged.headerLogo.includes('oasis_gold_logo') ||
    merged.headerLogo.includes('oasis_logo_official') ||
    merged.headerLogo.startsWith('data:image')
  ) {
    merged.headerLogo = '/images/oasis_header_logo.webp';
  }
  if (!merged.navMenu3 || merged.navMenu3 === '투어 서비스' || merged.navMenu3 === '투어서비스' || merged.navMenu3 === '필리핀 소개') {
    merged.navMenu3 = 'VIP 서비스';
  }
  // If about title or heading was contaminated by the copied site
  if (merged.aboutTitle && (merged.aboutTitle.includes('9년') || merged.aboutTitle.includes('공인 9년'))) {
    merged.aboutTitle = initialSiteConfig.aboutTitle;
  }
  if (merged.aboutStoryHeading && (merged.aboutStoryHeading.includes('마닐라 공식 VIP') || merged.aboutStoryHeading === '“필리핀 마닐라 공식 VIP 에이전트”')) {
    merged.aboutStoryHeading = initialSiteConfig.aboutStoryHeading;
  }
  return merged;
};

const sanitizeSlides = (slides: BannerSlide[]): BannerSlide[] => {
  return slides.map((slide, idx) => {
    let bg = slide.bgImage;
    if (
      !bg ||
      bg.includes('/assets/') ||
      bg.includes('oasis_gold_hero') ||
      bg.includes('casino_table_panoramic')
    ) {
      bg = idx === 0 ? '/images/hero_bg.webp' : '/images/casino_table.webp';
    }
    const title = slide.title || (initialBannerSlides[idx]?.title ?? initialBannerSlides[0].title);
    return { ...slide, bgImage: bg, title };
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
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG) || localStorage.getItem('oasis_site_config_v9');
    if (!saved) return initialSiteConfig;
    try {
      return sanitizeConfig(JSON.parse(saved));
    } catch {
      return initialSiteConfig;
    }
  });

  const [bannerSlides, setBannerSlidesState] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLIDES) || localStorage.getItem('oasis_banner_slides_v9');
    return saved ? sanitizeSlides(JSON.parse(saved)) : initialBannerSlides;
  });

  const [casinos, setCasinosState] = useState<CasinoItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASINOS) || localStorage.getItem('oasis_casinos_v9') || localStorage.getItem('oasis_casinos_v8');
    if (!saved) return sortCasinos(initialCasinos);
    try {
      return sortCasinos(JSON.parse(saved));
    } catch {
      return sortCasinos(initialCasinos);
    }
  });

  const [philippineSpots, setPhilippineSpotsState] = useState<PhilippineTourSpot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SPOTS) || localStorage.getItem('oasis_philippine_spots_v9') || localStorage.getItem('oasis_philippine_spots_v8');
    return saved ? JSON.parse(saved) : initialPhilippineSpots;
  });

  const [posts, setPostsState] = useState<PostItem[]>(() => {
    // Clean up all legacy contaminated keys from old builds
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('oasis_posts_v11');
        localStorage.removeItem('oasis_posts_v10');
        localStorage.removeItem('oasis_posts_v9');
        localStorage.removeItem('oasis_posts_v8');
        localStorage.removeItem('oasis_deleted_post_ids_v8');
        localStorage.removeItem('oasis_deleted_post_ids_v11');
        localStorage.removeItem('oasis_deleted_post_ids_v12');
      } catch {}
    }

    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.POSTS) : null;

    const baseList: PostItem[] = saved
      ? (() => {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const parsedTitles = new Set(parsed.map((p) => (p.title || '').trim().toLowerCase()));
              const missingFromInitial = initialPosts.filter(
                (ip) => !parsedTitles.has((ip.title || '').trim().toLowerCase())
              );
              return [...parsed, ...missingFromInitial];
            }
            return initialPosts;
          } catch {
            return initialPosts;
          }
        })()
      : initialPosts;

    // Deduplicate strictly by title (case-insensitive, trimmed) so duplicate posts never exist
    const seenTitles = new Set<string>();
    const deduplicated = baseList.filter((item) => {
      if ((item as any).isDeleted) return false;
      const norm = (item.title || '').trim().toLowerCase();
      if (!norm) return true;
      if (seenTitles.has(norm)) return false;
      seenTitles.add(norm);
      return true;
    });

    deduplicated.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateComp = (b.date || '').localeCompare(a.date || '');
      if (dateComp !== 0) return dateComp;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    // Ensure posts inherit complete images, thumbnails, map data, and rich content
    return deduplicated.map((p) => {
      const matchingInitial = initialPosts.find((ip) => ip.id === p.id);
      const mapFix = p.mapLocation || matchingInitial?.mapLocation;
      const thumbFix =
        p.thumbnail && !p.thumbnail.includes('placeholder') && p.thumbnail !== '/images/hero_bg.webp'
          ? p.thumbnail
          : matchingInitial?.thumbnail;
      const imgsFix =
        Array.isArray(p.images) && p.images.length > 0 && p.images[0] !== '/images/hero_bg.webp'
          ? p.images
          : (matchingInitial?.images && matchingInitial.images.length > 0
              ? matchingInitial.images
              : (thumbFix ? [thumbFix] : undefined));
      const contentFix =
        p.content && p.content.length > 50 ? p.content : (matchingInitial?.content || p.content);

      return {
        ...p,
        thumbnail: thumbFix,
        images: imgsFix,
        mapLocation: mapFix,
        content: contentFix,
        viewCount:
          typeof p.viewCount === 'number' && !isNaN(p.viewCount)
            ? p.viewCount
            : (matchingInitial?.viewCount || 392),
      };
    });
  });

  const [inquiryLeads, setInquiryLeadsState] = useState<InquiryLead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS) || localStorage.getItem('oasis_inquiry_leads_v9') || localStorage.getItem('oasis_inquiry_leads_v8');
    return saved ? JSON.parse(saved) : initialInquiryLeads;
  });

  const [serviceSteps, setServiceStepsState] = useState<ServiceStep[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEPS) || localStorage.getItem('oasis_service_steps_v9') || localStorage.getItem('oasis_service_steps_v8');
    return saved ? JSON.parse(saved) : initialServiceSteps;
  });

  const [faqs, setFaqsState] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAQS) || localStorage.getItem('oasis_faqs_v9') || localStorage.getItem('oasis_faqs_v8');
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
        const normTarget = String(targetPostId).toLowerCase();
        return (
          postsList.find((p) => {
            const pId = String(p.id).toLowerCase();
            if (pId === normTarget) return true;
            if (pId === `post-${normTarget}`) return true;
            if (normTarget === `post-${pId}`) return true;
            if (normTarget === '8' && pId === 'post-2') return true;
            if (normTarget === '9' && pId === 'post-3') return true;
            if (normTarget === '10' && pId === 'post-4') return true;
            if (normTarget === '6' && pId === 'post-6') return true;
            if (normTarget === '1' && pId === 'post-1') return true;
            return false;
          }) || null
        );
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [selectedCasino, setSelectedCasino] = useState<CasinoItem | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<'about' | 'process' | null>(() => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (hash === '#about') return 'about';
    if (hash === '#process') return 'process';
    return null;
  });
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
          window.history.replaceState({}, '', cleanUrl);
        }
      } catch {
        // fallback
      }
    }
  };

  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(() => isFirestoreQuotaExceeded());

  // 1. Smart Firestore Synchronization with Cache TTL & Quota Circuit Breaker
  const refreshCloudData = async (force: boolean = false) => {
    if (!force && isQuotaExceededFlag) return;

    try {
      const { db, fs } = await loadFirebase();
      const { doc, collection, getDoc, getDocs } = fs;

      const results = await Promise.allSettled([
        getDoc(doc(db, 'site_config', 'main')),
        getDocs(collection(db, 'posts')),
        getDocs(collection(db, 'casinos')),
        getDocs(collection(db, 'philippine_spots')),
        getDocs(collection(db, 'banner_slides')),
        getDocs(collection(db, 'faqs')),
        getDoc(doc(db, 'site_config', 'service_steps')),
      ]);

      // Check for quota exceeded error in any request
      for (const res of results) {
        if (res.status === 'rejected') {
          const err = res.reason;
          if (err?.code === 'resource-exhausted' || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
            markFirestoreQuotaExceeded();
            setIsQuotaExceeded(true);
            return;
          }
        }
      }

      // 0) Config
      if (results[0].status === 'fulfilled' && results[0].value.exists()) {
        const cfgData = results[0].value.data() as Partial<SiteConfig>;
        setSiteConfigState(sanitizeConfig(cfgData));
      }

      // 1) Posts
      if (results[1].status === 'fulfilled' && !results[1].value.empty) {
        clearFirestoreQuotaExceeded();
        setIsQuotaExceeded(false);
        const snap = results[1].value;
        const remoteItems = snap.docs
          .map((d) => {
            const data = d.data();
            const matchingInitial = initialPosts.find((ip) => ip.id === d.id);
            const thumb =
              data.thumbnail && !data.thumbnail.includes('placeholder') && data.thumbnail !== '/images/hero_bg.webp'
                ? data.thumbnail
                : matchingInitial?.thumbnail;
            const imgs =
              Array.isArray(data.images) && data.images.length > 0 && data.images[0] !== '/images/hero_bg.webp'
                ? data.images
                : (matchingInitial?.images && matchingInitial.images.length > 0
                    ? matchingInitial.images
                    : (thumb ? [thumb] : undefined));
            const content =
              data.content && data.content.length > 50 ? data.content : (matchingInitial?.content || data.content);
            return {
              ...data,
              id: d.id,
              thumbnail: thumb,
              images: imgs,
              content: content,
              viewCount: typeof data.viewCount === 'number' && !isNaN(data.viewCount) ? data.viewCount : 392,
            } as PostItem;
          })
          .filter((p) => !(p as any).isDeleted);

        // Single Source of Truth: Firestore remote items
        // Strictly deduplicate by title (case-insensitive, trimmed) so duplicate posts never exist
        const seenTitles = new Set<string>();
        const deduplicated = remoteItems.filter((item) => {
          const normTitle = (item.title || '').trim().toLowerCase();
          if (!normTitle) return true;
          if (seenTitles.has(normTitle)) {
            return false;
          }
          seenTitles.add(normTitle);
          return true;
        });

        deduplicated.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const dateComp = (b.date || '').localeCompare(a.date || '');
          if (dateComp !== 0) return dateComp;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });

        setPostsState(deduplicated);
        safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(deduplicated));
      }

      // 2) Casinos
      if (results[2].status === 'fulfilled' && !results[2].value.empty) {
        const rawItems = results[2].value.docs.map((d) => ({ ...d.data(), id: d.id } as CasinoItem));
        setCasinosState(sortCasinos(rawItems));
      }

      // 3) Spots
      if (results[3].status === 'fulfilled' && !results[3].value.empty) {
        const items = results[3].value.docs.map((d) => ({ ...d.data(), id: d.id } as PhilippineTourSpot));
        setPhilippineSpotsState(items);
      }

      // 4) Slides
      if (results[4].status === 'fulfilled' && !results[4].value.empty) {
        const rawItems = results[4].value.docs.map((d) => ({ ...d.data(), id: d.id } as BannerSlide));
        setBannerSlidesState(sanitizeSlides(rawItems));
      }

      // 5) FAQs
      if (results[5].status === 'fulfilled' && !results[5].value.empty) {
        const items = results[5].value.docs.map((d) => ({ ...d.data(), id: d.id } as FAQItem));
        setFaqsState(items);
      }

      // 6) Steps
      if (results[6].status === 'fulfilled' && results[6].value.exists()) {
        const data = results[6].value.data();
        if (Array.isArray(data.steps)) {
          setServiceStepsState(data.steps);
        }
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now()));
        } catch {}
      }
      setIsCloudSynced(true);
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
        markFirestoreQuotaExceeded();
        setIsQuotaExceeded(true);
      } else {
        console.warn('[Firebase] Background sync skipped or unavailable:', err);
      }
    }
  };

  useEffect(() => {
    let isCancelled = false;

    // Fast initial sync from Firestore on page load (always fetch fresh data)
    const timer = setTimeout(() => {
      if (isCancelled) return;
      refreshCloudData(true);
    }, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // 1-B. Inquiries fetch: ONLY active when Admin panel is opened (one-time fetch)
  useEffect(() => {
    if (!isAdminOpen || isFirestoreQuotaExceeded()) return;
    let isCancelled = false;
    (async () => {
      try {
        const { db, fs } = await loadFirebase();
        if (isCancelled) return;
        const inquiriesColRef = fs.collection(db, 'inquiries');
        const snap = await fs.getDocs(inquiriesColRef);
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as InquiryLead));
          items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setInquiryLeadsState(items);
        }
      } catch (err: any) {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
          markFirestoreQuotaExceeded();
          setIsQuotaExceeded(true);
        } else {
          console.warn('[Firebase] Inquiries fetch warning:', err);
        }
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [isAdminOpen]);

  // Safe storage helper to guarantee no QuotaExceededError crashes the React app
  const safeStorageSet = (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`[Storage] Failed to write key ${key} to localStorage:`, err);
      if (key === STORAGE_KEYS.POSTS) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            // If localStorage 5MB quota is exceeded, strip heavy secondary images while preserving real thumbnails
            const lightweight = parsed.map((p) => ({
              ...p,
              images: p.images && p.images.length > 0 ? [p.images[0]] : undefined,
            }));
            localStorage.setItem(key, JSON.stringify(lightweight));
          }
        } catch {
          // Ignore fallback failure
        }
      }
    }
  };

  // Local Storage Mirroring for immediate responsive UX
  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.CONFIG, JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.SLIDES, JSON.stringify(bannerSlides));
  }, [bannerSlides]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.CASINOS, JSON.stringify(casinos));
  }, [casinos]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.SPOTS, JSON.stringify(philippineSpots));
  }, [philippineSpots]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.LEADS, JSON.stringify(inquiryLeads));
  }, [inquiryLeads]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.STEPS, JSON.stringify(serviceSteps));
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
    
    // Generate a unique ID using timestamp to completely eliminate collisions with deleted demo IDs
    const newId = `post-${timestamp}-${Math.random().toString(36).substring(2, 6)}`;

    // Ensure new ID is definitely NOT in deleted IDs
    const currentDeleted = getDeletedPostIds();
    if (currentDeleted.has(newId)) {
      currentDeleted.delete(newId);
      safeStorageSet(STORAGE_KEYS.DELETED_POSTS, JSON.stringify(Array.from(currentDeleted)));
    }

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
      const cleanDoc = sanitizeForFirestore(newPost);
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', newId);
      await fs.setDoc(docRef, cleanDoc);
      console.log('Post successfully saved to Firestore:', newId);
    } catch (err) {
      console.error('Failed to add post to Firestore:', err);
    }

    return newPost;
  };

  const updatePost = async (id: string, partial: Partial<PostItem>) => {
    let updatedItem: PostItem | null = null;
    setPostsState((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, ...partial };
          return updatedItem;
        }
        return item;
      })
    );

    // Keep selectedPost in sync if the currently viewed post was updated
    if (updatedItem) {
      setSelectedPost((curr) => (curr?.id === id ? updatedItem : curr));
    }

    try {
      const cleanPartial = sanitizeForFirestore(partial);
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      await fs.setDoc(docRef, cleanPartial, { merge: true });
      console.log('Post successfully updated in Firestore:', id);
    } catch (err) {
      console.error('Failed to update post in Firestore:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    // 1. Only record in deleted IDs if it's one of the initial hardcoded demo posts ('post-1' ~ 'post-6')
    // to prevent code reactivation upon refresh
    if (/^post-[1-6]$/.test(id)) {
      const currentDeleted = getDeletedPostIds();
      currentDeleted.add(id);
      safeStorageSet(STORAGE_KEYS.DELETED_POSTS, JSON.stringify(Array.from(currentDeleted)));
    } else {
      // For custom posts, ensure it's removed from DELETED_POSTS if it was ever placed there by old code
      const currentDeleted = getDeletedPostIds();
      if (currentDeleted.has(id)) {
        currentDeleted.delete(id);
        safeStorageSet(STORAGE_KEYS.DELETED_POSTS, JSON.stringify(Array.from(currentDeleted)));
      }
    }

    // 2. Optimistic local state update and storage sync
    setPostsState((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
      return filtered;
    });

    // 3. Clear selectedPost if it was the deleted post
    setSelectedPost((curr) => (curr?.id === id ? null : curr));

    // 4. Close editor if editing this deleted post
    if (editingPost?.id === id) {
      closePostEditor();
    }

    // 5. Delete in Firestore
    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      await fs.deleteDoc(docRef);
      console.log('Post deleted successfully from Firestore:', id);
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

    if (isFirestoreQuotaExceeded()) {
      return; // Save write quota, don't spam Firestore
    }

    try {
      const { db, fs } = await loadFirebase();
      const docRef = fs.doc(db, 'posts', id);
      const target = posts.find((p) => p.id === id);
      if (target) {
        await fs.updateDoc(docRef, { viewCount: (target.viewCount || 0) + 1 });
      }
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        markFirestoreQuotaExceeded();
        setIsQuotaExceeded(true);
      } else {
        console.warn('Failed to increment view count in Firestore:', err);
      }
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

  const restoreOriginalBranding = async () => {
    const brandingConfig: Partial<SiteConfig> = {
      headerLogo: initialSiteConfig.headerLogo,
      siteName: initialSiteConfig.siteName,
      subTitle: initialSiteConfig.subTitle,
      bannerTitle: initialSiteConfig.bannerTitle,
      bannerSubtitle: initialSiteConfig.bannerSubtitle,
      bannerBadge: initialSiteConfig.bannerBadge,
      aboutTitle: initialSiteConfig.aboutTitle,
      aboutStoryHeading: initialSiteConfig.aboutStoryHeading,
      aboutBadge: initialSiteConfig.aboutBadge,
    };
    setSiteConfigState((prev) => ({ ...prev, ...brandingConfig }));
    setBannerSlidesState(initialBannerSlides);
    safeStorageSet(STORAGE_KEYS.CONFIG, JSON.stringify({ ...siteConfig, ...brandingConfig }));
    safeStorageSet(STORAGE_KEYS.SLIDES, JSON.stringify(initialBannerSlides));

    try {
      const { db, fs } = await loadFirebase();
      await fs.setDoc(fs.doc(db, 'site_config', 'main'), brandingConfig, { merge: true });
      for (const slide of initialBannerSlides) {
        await fs.setDoc(fs.doc(db, 'banner_slides', slide.id), slide, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore branding restore:', err);
    }
  };

  const restoreAllPostsAndImages = async () => {
    // 0. Reset quota circuit breaker flag
    clearFirestoreQuotaExceeded();
    setIsQuotaExceeded(false);

    // 1. Clear any corrupted legacy deleted post IDs & local caches
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEYS.DELETED_POSTS);
        localStorage.removeItem('oasis_deleted_post_ids_v8');
        localStorage.removeItem('oasis_deleted_post_ids_v9');
        localStorage.removeItem('oasis_deleted_post_ids_v10');
        localStorage.removeItem('oasis_deleted_post_ids_v11');
      } catch {}
    }

    // 2. Set posts state directly to pristine initialPosts
    setPostsState(initialPosts);
    safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
    safeStorageSet('oasis_posts_v8', JSON.stringify(initialPosts));

    // 3. Gracefully sync with Firestore
    try {
      const { db, fs } = await loadFirebase();
      for (const post of initialPosts) {
        await fs.setDoc(fs.doc(db, 'posts', post.id), sanitizeForFirestore(post), { merge: true });
      }
      console.log('[Restore] All community posts and images successfully synced to Firestore!');
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        markFirestoreQuotaExceeded();
        setIsQuotaExceeded(true);
      }
      console.warn('[Restore] Firestore sync completed in local cache mode:', err);
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
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    // Sync reset to Firestore gracefully
    try {
      const { db, fs } = await loadFirebase();
      await fs.setDoc(fs.doc(db, 'site_config', 'main'), initialSiteConfig);
      await fs.setDoc(fs.doc(db, 'site_config', 'service_steps'), { steps: initialServiceSteps });

      // Clean & re-seed banner slides
      for (const slide of initialBannerSlides) {
        await fs.setDoc(fs.doc(db, 'banner_slides', slide.id), slide);
      }

      // Re-seed posts individually to avoid batch size failure
      for (const post of initialPosts) {
        await fs.setDoc(fs.doc(db, 'posts', post.id), sanitizeForFirestore(post), { merge: true });
      }
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota')) {
        markFirestoreQuotaExceeded();
        setIsQuotaExceeded(true);
      }
      console.warn('Failed to reset Firestore to defaults (cached mode active):', err);
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
        activeInfoModal,
        setActiveInfoModal,
        activeSection,
        setActiveSection,
        isCloudSynced,
        isQuotaExceeded,
        refreshCloudData,
        resetToDefaults,
        restoreOriginalBranding,
        restoreAllPostsAndImages,
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
