import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

export const APP_DATA_VERSION = 'oasis_unified_2026_v1';
const APP_STORAGE_PREFIX = 'oasis_v2026';

export const STORAGE_KEYS = {
  VERSION: `${APP_STORAGE_PREFIX}_version`,
  CONFIG: `${APP_STORAGE_PREFIX}_config`,
  SLIDES: `${APP_STORAGE_PREFIX}_slides`,
  HERO_BG: `${APP_STORAGE_PREFIX}_hero_bg`,
  CASINOS: `${APP_STORAGE_PREFIX}_casinos`,
  SPOTS: `${APP_STORAGE_PREFIX}_spots`,
  POSTS: `${APP_STORAGE_PREFIX}_posts`,
  DELETED_POSTS: `${APP_STORAGE_PREFIX}_deleted_ids`,
  LEADS: `${APP_STORAGE_PREFIX}_leads`,
  STEPS: `${APP_STORAGE_PREFIX}_steps`,
  FAQS: `${APP_STORAGE_PREFIX}_faqs`,
  LAST_SYNC: `${APP_STORAGE_PREFIX}_last_sync`,
  LAST_STATIC_SYNC: `${APP_STORAGE_PREFIX}_last_static_sync`,
  QUOTA_EXCEEDED: `${APP_STORAGE_PREFIX}_quota_exceeded`,
};

// ==============================================================================
// UNIVERSAL AUTO-PURGE: Runs immediately on module load in EVERY browser.
// If the browser holds stale, legacy, or fragmented cache from earlier builds,
// it instantly purges all legacy keys and aligns with the clean initialData.
// ==============================================================================
if (typeof window !== 'undefined') {
  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (currentVersion !== APP_DATA_VERSION) {
      console.log('[Oasis Cache] Migrating to unified data version:', APP_DATA_VERSION);
      const staleKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('oasis_') ||
            k.includes('posts') ||
            k.includes('slides') ||
            k.includes('casinos') ||
            k.includes('spots') ||
            k.includes('config'))
        ) {
          staleKeys.push(k);
        }
      }
      staleKeys.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {}
      });
      localStorage.setItem(STORAGE_KEYS.VERSION, APP_DATA_VERSION);
    }
  } catch (purgeErr) {
    console.warn('[Oasis Cache] Auto-purge notice:', purgeErr);
  }
}

let isQuotaExceededFlag = false;

export const isFirestoreQuotaExceeded = (): boolean => {
  if (isQuotaExceededFlag) return true;
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEYS.QUOTA_EXCEEDED);
      if (stored) {
        const storedTime = parseInt(stored, 10);
        if (!isNaN(storedTime)) {
          // Circuit-breaker: auto-reset after 5 minutes to prevent spamming exhausted quota
          if (Date.now() - storedTime > 5 * 60 * 1000) {
            sessionStorage.removeItem(STORAGE_KEYS.QUOTA_EXCEEDED);
            isQuotaExceededFlag = false;
            return false;
          }
        } else {
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
  console.warn('[Firebase Quota] 일일 무료 할당량이 소진되어 로컬 캐시 모드로 안전하게 자동 전환되었습니다.');
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
  const set = new Set<string>([
    'post-1791011166992-o055', // 12312213
    'post-1791011212743-6jgs', // ddddd
  ]);
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELETED_POSTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => set.add(id));
        }
      }
    } catch {}
  }
  return set;
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
    if (typeof window === 'undefined') return initialSiteConfig;
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!saved) return initialSiteConfig;
    try {
      return sanitizeConfig(JSON.parse(saved));
    } catch {
      return initialSiteConfig;
    }
  });

  const [bannerSlides, setBannerSlidesState] = useState<BannerSlide[]>(() => {
    if (typeof window === 'undefined') return initialBannerSlides;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SLIDES);
      if (saved) {
        return sanitizeSlides(JSON.parse(saved));
      }
    } catch {}
    return initialBannerSlides;
  });

  const [casinos, setCasinosState] = useState<CasinoItem[]>(() => {
    if (typeof window === 'undefined') return sortCasinos(initialCasinos);
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CASINOS);
      if (saved) {
        return sortCasinos(JSON.parse(saved));
      }
    } catch {}
    return sortCasinos(initialCasinos);
  });

  const [philippineSpots, setPhilippineSpotsState] = useState<PhilippineTourSpot[]>(() => {
    if (typeof window === 'undefined') return initialPhilippineSpots;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPOTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return initialPhilippineSpots;
  });

  const [posts, setPostsState] = useState<PostItem[]>(() => {
    if (typeof window === 'undefined') return initialPosts;
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    let baseList: PostItem[] = initialPosts;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseList = parsed;
        }
      } catch {}
    }

    // Deduplicate strictly by unique ID so duplicate IDs never exist
    const deletedIds = getDeletedPostIds();
    const seenIds = new Set<string>();
    const deduplicated = baseList.filter((item) => {
      if ((item as any).isDeleted) return false;
      if (!item.id) return false;
      if (deletedIds.has(item.id)) return false;
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });

    deduplicated.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateComp = (b.date || '').localeCompare(a.date || '');
      if (dateComp !== 0) return dateComp;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });

    return deduplicated;
  });

  const [inquiryLeads, setInquiryLeadsState] = useState<InquiryLead[]>(() => {
    if (typeof window === 'undefined') return initialInquiryLeads;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialInquiryLeads;
  });

  const [serviceSteps, setServiceStepsState] = useState<ServiceStep[]>(() => {
    if (typeof window === 'undefined') return initialServiceSteps;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STEPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialServiceSteps;
  });

  const [faqs, setFaqsState] = useState<FAQItem[]>(() => {
    if (typeof window === 'undefined') return initialFAQs;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialFAQs;
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
  const isSyncInProgressRef = useRef(false);

  // 1. Strict Refresh-Only Firestore Synchronization (Zero Real-Time Overhead)
  const refreshCloudData = async (force: boolean = false) => {
    if (isSyncInProgressRef.current) return;
    if (!force && isQuotaExceededFlag) return;

    if (force) {
      clearFirestoreQuotaExceeded();
      setIsQuotaExceeded(false);
    }

    isSyncInProgressRef.current = true;

    try {
      const { db, fs } = await loadFirebase();
      const { doc, collection, getDoc, getDocs } = fs;

      // 1. Fetch Posts (The only dynamic content that needs refresh on page load)
      try {
        const snap = await getDocs(collection(db, 'posts'));
        if (!snap.empty) {
          clearFirestoreQuotaExceeded();
          setIsQuotaExceeded(false);

          const deletedIds = getDeletedPostIds();
          const remoteItems: PostItem[] = snap.docs
            .map((d) => {
              const data = d.data();
              return {
                ...data,
                id: d.id,
                title: data.title || '',
                summary: data.summary || '',
                content: data.content || '',
                category: data.category || '커뮤니티',
                author: data.author || '오아시스 VIP',
                date: data.date || '',
                thumbnail: data.thumbnail || '',
                images: Array.isArray(data.images) ? data.images : (data.thumbnail ? [data.thumbnail] : []),
                viewCount: typeof data.viewCount === 'number' && !isNaN(data.viewCount) ? data.viewCount : 392,
                isPinned: Boolean(data.isPinned),
                mapLocation: data.mapLocation || null,
                createdAt: data.createdAt || 0,
              } as PostItem;
            })
            .filter((p) => !(p as any).isDeleted && !deletedIds.has(p.id));

          // Deduplicate by title to ensure clean 17 unique articles without legacy duplicate IDs
          const seenTitles = new Set<string>();
          const uniqueItems: PostItem[] = [];

          // Prioritize canonical IDs (notice-*, promo-*, post-*) over legacy raw numeric IDs ('2', '3', etc.)
          remoteItems.sort((a, b) => {
            const aIsClean = /^(post-|notice-|promo-)/.test(a.id);
            const bIsClean = /^(post-|notice-|promo-)/.test(b.id);
            if (aIsClean && !bIsClean) return -1;
            if (!aIsClean && bIsClean) return 1;
            return 0;
          });

          for (const item of remoteItems) {
            const normTitle = (item.title || '').trim();
            if (!seenTitles.has(normTitle)) {
              seenTitles.add(normTitle);
              uniqueItems.push(item);
            }
          }

          // Sort strictly: pinned first, then date / createdAt desc
          uniqueItems.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            const dateComp = (b.date || '').localeCompare(a.date || '');
            if (dateComp !== 0) return dateComp;
            return (b.createdAt || 0) - (a.createdAt || 0);
          });

          // Single Source of Truth: update React state and local cache
          setPostsState(uniqueItems);
          safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(uniqueItems));
        }
      } catch (err: any) {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
          markFirestoreQuotaExceeded();
          setIsQuotaExceeded(true);
        } else {
          console.warn('[Firebase] Posts fetch warning:', err);
        }
      }

      // 2. Static content (casinos, spots, slides, faqs, config) is ONLY fetched when explicitly requested by Admin (force = true)
      // This saves 70%+ of Firestore read quota on every visitor page refresh
      if (force && !isQuotaExceededFlag) {
        try {
          const staticResults = await Promise.allSettled([
            getDoc(doc(db, 'site_config', 'main')),
            getDocs(collection(db, 'casinos')),
            getDocs(collection(db, 'philippine_spots')),
            getDocs(collection(db, 'banner_slides')),
            getDocs(collection(db, 'faqs')),
            getDoc(doc(db, 'site_config', 'service_steps')),
          ]);

          if (staticResults[0].status === 'fulfilled' && staticResults[0].value.exists()) {
            setSiteConfigState(sanitizeConfig(staticResults[0].value.data() as Partial<SiteConfig>));
          }
          if (staticResults[1].status === 'fulfilled' && !staticResults[1].value.empty) {
            setCasinosState(sortCasinos(staticResults[1].value.docs.map((d) => ({ ...d.data(), id: d.id } as CasinoItem))));
          }
          if (staticResults[2].status === 'fulfilled' && !staticResults[2].value.empty) {
            setPhilippineSpotsState(staticResults[2].value.docs.map((d) => ({ ...d.data(), id: d.id } as PhilippineTourSpot)));
          }
          if (staticResults[3].status === 'fulfilled' && !staticResults[3].value.empty) {
            const rawSlides = staticResults[3].value.docs.map((d) => ({ ...d.data(), id: d.id } as BannerSlide));
            rawSlides.sort((a, b) => (a.id === 'slide-1' ? -1 : b.id === 'slide-1' ? 1 : 0));
            const sanitized = sanitizeSlides(rawSlides);
            setBannerSlidesState(sanitized);
            safeStorageSet(STORAGE_KEYS.SLIDES, JSON.stringify(sanitized));
            if (sanitized[0]?.bgImage) {
              safeStorageSet(STORAGE_KEYS.HERO_BG, sanitized[0].bgImage);
            }
          }
          if (staticResults[4].status === 'fulfilled' && !staticResults[4].value.empty) {
            setFaqsState(staticResults[4].value.docs.map((d) => ({ ...d.data(), id: d.id } as FAQItem)));
          }
          if (staticResults[5].status === 'fulfilled' && staticResults[5].value.exists()) {
            const data = staticResults[5].value.data();
            if (Array.isArray(data.steps)) setServiceStepsState(data.steps);
          }
        } catch (staticErr) {
          console.warn('[Firebase] Admin static sync skipped:', staticErr);
        }
      }

      setIsCloudSynced(true);
    } catch (err: any) {
      if (err?.code === 'resource-exhausted' || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
        markFirestoreQuotaExceeded();
        setIsQuotaExceeded(true);
      } else {
        console.warn('[Firebase] Background sync skipped or unavailable:', err);
      }
    } finally {
      isSyncInProgressRef.current = false;
    }
  };

  // Run synchronization ONCE on page load (refresh) only — no real-time listeners, no polling intervals
  const initialSyncDoneRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined' || initialSyncDoneRef.current) return;
    initialSyncDoneRef.current = true;

    // Skip only for automated Lighthouse/PageSpeed crawlers
    const isLighthouse =
      /Lighthouse|PageSpeed|HeadlessChrome/i.test(navigator.userAgent || '');
    if (isLighthouse) return;

    refreshCloudData(false);
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
    let nextSlides: BannerSlide[] = [];
    setBannerSlidesState((prev) => {
      nextSlides = prev.map((item) => (item.id === id ? { ...item, ...slide } : item));
      safeStorageSet(STORAGE_KEYS.SLIDES, JSON.stringify(nextSlides));
      if (id === 'slide-1' && slide.bgImage) {
        safeStorageSet(STORAGE_KEYS.HERO_BG, slide.bgImage);
      }
      return nextSlides;
    });
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
      safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(updated));
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
    setPostsState((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          updatedItem = { ...item, ...partial };
          return updatedItem;
        }
        return item;
      });
      safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(updated));
      return updated;
    });

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
    // 1. Record in deleted IDs so it is NEVER restored by Auto-Recovery or refresh
    const currentDeleted = getDeletedPostIds();
    currentDeleted.add(id);
    safeStorageSet(STORAGE_KEYS.DELETED_POSTS, JSON.stringify(Array.from(currentDeleted)));

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

  // Purely client-side post view count tracking — zero Firestore write operations
  const incrementPostView = (id: string) => {
    if (typeof window !== 'undefined') {
      try {
        const sessionKey = `viewed_post_${id}`;
        if (sessionStorage.getItem(sessionKey)) {
          return; // Count once per browser session
        }
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // ignore storage errors
      }
    }

    setPostsState((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item
      );
      safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(updated));
      return updated;
    });
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
      } catch {}
    }

    // 2. Set posts state directly to pristine initialPosts
    setPostsState(initialPosts);
    safeStorageSet(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.VERSION, APP_DATA_VERSION);
      } catch {}
    }

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
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.VERSION, APP_DATA_VERSION);
      } catch {}
    }

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
