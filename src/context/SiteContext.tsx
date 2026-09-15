import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
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
  addPost: (post: Omit<PostItem, 'id' | 'viewCount' | 'date'>) => Promise<void> | void;
  updatePost: (id: string, post: Partial<PostItem>) => Promise<void> | void;
  deletePost: (id: string) => Promise<void> | void;
  incrementPostView: (id: string) => Promise<void> | void;
  
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
  if (merged.headerLogo && (merged.headerLogo.includes('oasis_gold_logo') || merged.headerLogo.includes('oasis_logo_official'))) {
    merged.headerLogo = '';
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
    return saved ? JSON.parse(saved) : initialPosts;
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

  // 1. Setup Firestore Realtime Listeners & Auto-Seeding
  useEffect(() => {
    let unsubscribeConfig = () => {};
    let unsubscribePosts = () => {};
    let unsubscribeInquiries = () => {};
    let unsubscribeCasinos = () => {};
    let unsubscribeSpots = () => {};
    let unsubscribeSlides = () => {};
    let unsubscribeSteps = () => {};
    let unsubscribeFaqs = () => {};

    try {
      // 1) Listen to Site Config
      const configDocRef = doc(db, 'site_config', 'main');
      unsubscribeConfig = onSnapshot(configDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<SiteConfig>;
          setSiteConfigState(sanitizeConfig(data));
          setIsCloudSynced(true);
        } else {
          // Seed initial config to Firestore
          setDoc(configDocRef, initialSiteConfig, { merge: true }).catch(console.error);
        }
      }, (err) => console.warn('Firestore config listener error:', err));

      // 2) Listen to Posts
      const postsColRef = collection(db, 'posts');
      unsubscribePosts = onSnapshot(postsColRef, async (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PostItem));
          // Sort pinned first, then by date descending
          items.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (b.date || '').localeCompare(a.date || '');
          });
          setPostsState(items);
          setIsCloudSynced(true);
        } else {
          // Seed initial posts
          const batch = writeBatch(db);
          initialPosts.forEach((post) => {
            const ref = doc(db, 'posts', post.id);
            batch.set(ref, post);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore posts listener error:', err));

      // 3) Listen to Inquiries
      const inquiriesColRef = collection(db, 'inquiries');
      unsubscribeInquiries = onSnapshot(inquiriesColRef, async (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as InquiryLead));
          items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setInquiryLeadsState(items);
        } else if (initialInquiryLeads.length > 0) {
          const batch = writeBatch(db);
          initialInquiryLeads.forEach((lead) => {
            const ref = doc(db, 'inquiries', lead.id);
            batch.set(ref, lead);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore inquiries listener error:', err));

      // 4) Listen to Casinos
      const casinosColRef = collection(db, 'casinos');
      unsubscribeCasinos = onSnapshot(casinosColRef, async (snap) => {
        if (!snap.empty) {
          const rawItems = snap.docs.map((d) => ({ ...d.data(), id: d.id } as CasinoItem));
          const sorted = sortCasinos(rawItems);
          setCasinosState(sorted);

          // Update any items in Firestore that lack correct order
          rawItems.forEach(async (item) => {
            const expected = DEFAULT_CASINO_ORDER[item.id];
            if (expected && item.order !== expected) {
              await setDoc(doc(db, 'casinos', item.id), { order: expected }, { merge: true }).catch(console.warn);
            }
          });
        } else {
          const batch = writeBatch(db);
          sortCasinos(initialCasinos).forEach((c) => {
            const ref = doc(db, 'casinos', c.id);
            batch.set(ref, c);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore casinos listener error:', err));

      // 5) Listen to Philippine Tour Spots
      const spotsColRef = collection(db, 'philippine_spots');
      unsubscribeSpots = onSnapshot(spotsColRef, async (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PhilippineTourSpot));
          setPhilippineSpotsState(items);
        } else {
          const batch = writeBatch(db);
          initialPhilippineSpots.forEach((s) => {
            const ref = doc(db, 'philippine_spots', s.id);
            batch.set(ref, s);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore spots listener error:', err));

      // 6) Listen to Banner Slides
      const slidesColRef = collection(db, 'banner_slides');
      unsubscribeSlides = onSnapshot(slidesColRef, async (snap) => {
        if (!snap.empty) {
          const rawItems = snap.docs.map((d) => ({ ...d.data(), id: d.id } as BannerSlide));
          const cleanedItems = sanitizeSlides(rawItems);
          setBannerSlidesState(cleanedItems);
          
          // Check if any item had an old hashed path and update Firestore with clean static path
          rawItems.forEach(async (item, idx) => {
            if (item.bgImage && (item.bgImage.includes('/assets/') || item.bgImage.includes('oasis_gold_hero'))) {
              const cleanBg = idx === 0 ? '/images/hero_bg.jpg' : '/images/casino_table.jpg';
              await setDoc(doc(db, 'banner_slides', item.id), { bgImage: cleanBg }, { merge: true }).catch(console.warn);
            }
          });
        } else {
          const batch = writeBatch(db);
          initialBannerSlides.forEach((slide) => {
            const ref = doc(db, 'banner_slides', slide.id);
            batch.set(ref, slide);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore banner slides listener error:', err));

      // 7) Listen to FAQs
      const faqsColRef = collection(db, 'faqs');
      unsubscribeFaqs = onSnapshot(faqsColRef, async (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id } as FAQItem));
          setFaqsState(items);
        } else {
          const batch = writeBatch(db);
          initialFAQs.forEach((faq) => {
            const ref = doc(db, 'faqs', faq.id);
            batch.set(ref, faq);
          });
          await batch.commit().catch(console.error);
        }
      }, (err) => console.warn('Firestore faqs listener error:', err));

      // 8) Listen to Service Steps Doc
      const stepsDocRef = doc(db, 'site_config', 'service_steps');
      unsubscribeSteps = onSnapshot(stepsDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.steps)) {
            setServiceStepsState(data.steps);
          }
        } else {
          setDoc(stepsDocRef, { steps: initialServiceSteps }).catch(console.error);
        }
      }, (err) => console.warn('Firestore service steps listener error:', err));

    } catch (err) {
      console.error('Firebase initialization error:', err);
    }

    return () => {
      unsubscribeConfig();
      unsubscribePosts();
      unsubscribeInquiries();
      unsubscribeCasinos();
      unsubscribeSpots();
      unsubscribeSlides();
      unsubscribeSteps();
      unsubscribeFaqs();
    };
  }, []);

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
      const configDocRef = doc(db, 'site_config', 'main');
      await setDoc(configDocRef, partial, { merge: true });
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
      const docRef = doc(db, 'banner_slides', id);
      await setDoc(docRef, slide, { merge: true });
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
      const batch = writeBatch(db);
      updated.forEach((c) => {
        batch.set(doc(db, 'casinos', c.id), { order: c.order }, { merge: true });
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
      const docRef = doc(db, 'casinos', newId);
      await setDoc(docRef, newCasino);
    } catch (err) {
      console.error('Failed to add casino to Firestore:', err);
    }
  };

  const updateCasino = async (id: string, partial: Partial<CasinoItem>) => {
    setCasinosState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const docRef = doc(db, 'casinos', id);
      await setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update casino in Firestore:', err);
    }
  };

  const deleteCasino = async (id: string) => {
    setCasinosState((prev) => prev.filter((item) => item.id !== id));
    try {
      const docRef = doc(db, 'casinos', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete casino from Firestore:', err);
    }
  };

  const setPosts = (newPosts: PostItem[]) => {
    setPostsState(newPosts);
  };

  const addPost = async (post: Omit<PostItem, 'id' | 'viewCount' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Generate clean incremental ID like post-7, post-8 if possible
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
    const newId = `post-${nextNum}`;

    const newPost: PostItem = {
      ...post,
      id: newId,
      viewCount: 1,
      date: dateStr,
    };
    setPostsState((prev) => [newPost, ...prev]);
    try {
      const docRef = doc(db, 'posts', newId);
      await setDoc(docRef, newPost);
    } catch (err) {
      console.error('Failed to add post to Firestore:', err);
    }
  };

  const updatePost = async (id: string, partial: Partial<PostItem>) => {
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const docRef = doc(db, 'posts', id);
      await setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update post in Firestore:', err);
    }
  };

  const deletePost = async (id: string) => {
    setPostsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete post from Firestore:', err);
    }
  };

  const incrementPostView = async (id: string) => {
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, viewCount: (item.viewCount || 0) + 1 } : item))
    );
    try {
      const docRef = doc(db, 'posts', id);
      const target = posts.find((p) => p.id === id);
      if (target) {
        await updateDoc(docRef, { viewCount: (target.viewCount || 0) + 1 });
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
      const docRef = doc(db, 'inquiries', newId);
      await setDoc(docRef, newLead);
    } catch (err) {
      console.error('Failed to submit inquiry to Firestore:', err);
    }
  };

  const updateInquiryStatus = async (id: string, status: InquiryLead['status']) => {
    setInquiryLeadsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    try {
      const docRef = doc(db, 'inquiries', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error('Failed to update inquiry in Firestore:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    setInquiryLeadsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const docRef = doc(db, 'inquiries', id);
      await deleteDoc(docRef);
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
        const stepsDocRef = doc(db, 'site_config', 'service_steps');
        await setDoc(stepsDocRef, { steps: next });
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
      const docRef = doc(db, 'philippine_spots', newId);
      await setDoc(docRef, newSpot);
    } catch (err) {
      console.error('Failed to add spot to Firestore:', err);
    }
  };

  const updatePhilippineSpot = async (id: string, partial: Partial<PhilippineTourSpot>) => {
    setPhilippineSpotsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const docRef = doc(db, 'philippine_spots', id);
      await setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update spot in Firestore:', err);
    }
  };

  const deletePhilippineSpot = async (id: string) => {
    setPhilippineSpotsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const docRef = doc(db, 'philippine_spots', id);
      await deleteDoc(docRef);
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
      const docRef = doc(db, 'faqs', newId);
      await setDoc(docRef, newFaq);
    } catch (err) {
      console.error('Failed to add faq to Firestore:', err);
    }
  };

  const updateFaq = async (id: string, partial: Partial<FAQItem>) => {
    setFaqsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
    try {
      const docRef = doc(db, 'faqs', id);
      await setDoc(docRef, partial, { merge: true });
    } catch (err) {
      console.error('Failed to update faq in Firestore:', err);
    }
  };

  const deleteFaq = async (id: string) => {
    setFaqsState((prev) => prev.filter((item) => item.id !== id));
    try {
      const docRef = doc(db, 'faqs', id);
      await deleteDoc(docRef);
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
      await setDoc(doc(db, 'site_config', 'main'), initialSiteConfig);
      await setDoc(doc(db, 'site_config', 'service_steps'), { steps: initialServiceSteps });

      // Clean & re-seed posts
      const postsSnap = await getDocs(collection(db, 'posts'));
      const batch = writeBatch(db);
      postsSnap.docs.forEach((d) => batch.delete(d.ref));
      initialPosts.forEach((p) => batch.set(doc(db, 'posts', p.id), p));
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
      if (parsed.siteConfig) {
        setSiteConfigState(parsed.siteConfig);
        await setDoc(doc(db, 'site_config', 'main'), parsed.siteConfig);
      }
      if (parsed.posts && Array.isArray(parsed.posts)) {
        setPostsState(parsed.posts);
        const batch = writeBatch(db);
        parsed.posts.forEach((p: PostItem) => batch.set(doc(db, 'posts', p.id), p));
        await batch.commit();
      }
      if (parsed.casinos && Array.isArray(parsed.casinos)) {
        setCasinosState(parsed.casinos);
        const batch = writeBatch(db);
        parsed.casinos.forEach((c: CasinoItem) => batch.set(doc(db, 'casinos', c.id), c));
        await batch.commit();
      }
      if (parsed.philippineSpots && Array.isArray(parsed.philippineSpots)) {
        setPhilippineSpotsState(parsed.philippineSpots);
        const batch = writeBatch(db);
        parsed.philippineSpots.forEach((s: PhilippineTourSpot) => batch.set(doc(db, 'philippine_spots', s.id), s));
        await batch.commit();
      }
      if (parsed.bannerSlides && Array.isArray(parsed.bannerSlides)) {
        setBannerSlidesState(parsed.bannerSlides);
        const batch = writeBatch(db);
        parsed.bannerSlides.forEach((b: BannerSlide) => batch.set(doc(db, 'banner_slides', b.id), b));
        await batch.commit();
      }
      if (parsed.faqs && Array.isArray(parsed.faqs)) {
        setFaqsState(parsed.faqs);
        const batch = writeBatch(db);
        parsed.faqs.forEach((f: FAQItem) => batch.set(doc(db, 'faqs', f.id), f));
        await batch.commit();
      }
      if (parsed.serviceSteps && Array.isArray(parsed.serviceSteps)) {
        setServiceStepsState(parsed.serviceSteps);
        await setDoc(doc(db, 'site_config', 'service_steps'), { steps: parsed.serviceSteps });
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
