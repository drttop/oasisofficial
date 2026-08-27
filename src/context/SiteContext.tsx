import React, { createContext, useContext, useState, useEffect } from 'react';
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
  updateSiteConfig: (partial: Partial<SiteConfig>) => void;
  
  bannerSlides: BannerSlide[];
  setBannerSlides: (slides: BannerSlide[]) => void;
  updateBannerSlide: (id: string, slide: Partial<BannerSlide>) => void;
  
  casinos: CasinoItem[];
  setCasinos: (casinos: CasinoItem[]) => void;
  addCasino: (casino: Omit<CasinoItem, 'id'>) => void;
  updateCasino: (id: string, casino: Partial<CasinoItem>) => void;
  deleteCasino: (id: string) => void;
  
  philippineSpots: PhilippineTourSpot[];
  setPhilippineSpots: (spots: PhilippineTourSpot[]) => void;
  addPhilippineSpot: (spot: Omit<PhilippineTourSpot, 'id'>) => void;
  updatePhilippineSpot: (id: string, spot: Partial<PhilippineTourSpot>) => void;
  deletePhilippineSpot: (id: string) => void;

  serviceSteps: ServiceStep[];
  setServiceSteps: (steps: ServiceStep[]) => void;
  updateServiceStep: (index: number, step: Partial<ServiceStep>) => void;
  faqs: FAQItem[];
  setFaqs: (faqs: FAQItem[]) => void;
  addFaq: (faq: Omit<FAQItem, 'id'>) => void;
  updateFaq: (id: string, faq: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;
  
  posts: PostItem[];
  setPosts: (posts: PostItem[]) => void;
  addPost: (post: Omit<PostItem, 'id' | 'viewCount' | 'date'>) => void;
  updatePost: (id: string, post: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  incrementPostView: (id: string) => void;
  
  inquiryLeads: InquiryLead[];
  addInquiryLead: (lead: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: InquiryLead['status']) => void;
  deleteInquiry: (id: string) => void;
  
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
  
  resetToDefaults: () => void;
  exportDataJSON: () => void;
  getExportJSONString: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CONFIG: 'oasis_site_config_v7',
  SLIDES: 'oasis_banner_slides_v7',
  CASINOS: 'oasis_casinos_v7',
  SPOTS: 'oasis_philippine_spots_v7',
  POSTS: 'oasis_posts_v7',
  LEADS: 'oasis_inquiry_leads_v7',
  STEPS: 'oasis_service_steps_v7',
  FAQS: 'oasis_faqs_v7',
};

const sanitizeConfig = (cfg: Partial<SiteConfig>): SiteConfig => {
  const merged = { ...initialSiteConfig, ...cfg };
  // If headerLogo is previous square jpg or broken, reset to default vector logo
  if (merged.headerLogo && (merged.headerLogo.includes('oasis_gold_logo') || merged.headerLogo.includes('oasis_logo_official'))) {
    merged.headerLogo = '';
  }
  return merged;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfig, setSiteConfigState] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!saved) {
      const v5 = localStorage.getItem('oasis_site_config_v5');
      if (v5) {
        try {
          return sanitizeConfig(JSON.parse(v5));
        } catch {
          return initialSiteConfig;
        }
      }
      return initialSiteConfig;
    }
    try {
      return sanitizeConfig(JSON.parse(saved));
    } catch {
      return initialSiteConfig;
    }
  });

  const [bannerSlides, setBannerSlidesState] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SLIDES);
    return saved ? JSON.parse(saved) : initialBannerSlides;
  });

  const [casinos, setCasinosState] = useState<CasinoItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASINOS);
    return saved ? JSON.parse(saved) : initialCasinos;
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
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedCasino, setSelectedCasino] = useState<CasinoItem | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  // Persistence effects
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

  const updateSiteConfig = (partial: Partial<SiteConfig>) => {
    setSiteConfigState((prev) => ({ ...prev, ...partial }));
  };

  const setBannerSlides = (slides: BannerSlide[]) => {
    setBannerSlidesState(slides);
  };

  const updateBannerSlide = (id: string, slide: Partial<BannerSlide>) => {
    setBannerSlidesState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...slide } : item))
    );
  };

  const setCasinos = (newCasinos: CasinoItem[]) => {
    setCasinosState(newCasinos);
  };

  const addCasino = (casino: Omit<CasinoItem, 'id'>) => {
    const newCasino: CasinoItem = {
      ...casino,
      id: `casino-${Date.now()}`,
    };
    setCasinosState((prev) => [newCasino, ...prev]);
  };

  const updateCasino = (id: string, partial: Partial<CasinoItem>) => {
    setCasinosState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const deleteCasino = (id: string) => {
    setCasinosState((prev) => prev.filter((item) => item.id !== id));
  };

  const setPosts = (newPosts: PostItem[]) => {
    setPostsState(newPosts);
  };

  const addPost = (post: Omit<PostItem, 'id' | 'viewCount' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newPost: PostItem = {
      ...post,
      id: `post-${Date.now()}`,
      viewCount: 1,
      date: dateStr,
    };
    setPostsState((prev) => [newPost, ...prev]);
  };

  const updatePost = (id: string, partial: Partial<PostItem>) => {
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const deletePost = (id: string) => {
    setPostsState((prev) => prev.filter((item) => item.id !== id));
  };

  const incrementPostView = (id: string) => {
    setPostsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, viewCount: item.viewCount + 1 } : item))
    );
  };

  const addInquiryLead = (lead: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLead: InquiryLead = {
      ...lead,
      id: `inq-${Date.now()}`,
      createdAt: dateStr,
      status: '접수대기',
    };
    setInquiryLeadsState((prev) => [newLead, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: InquiryLead['status']) => {
    setInquiryLeadsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiryLeadsState((prev) => prev.filter((item) => item.id !== id));
  };

  const setServiceSteps = (newSteps: ServiceStep[]) => {
    setServiceStepsState(newSteps);
  };

  const updateServiceStep = (index: number, partial: Partial<ServiceStep>) => {
    setServiceStepsState((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], ...partial };
      }
      return next;
    });
  };

  const setPhilippineSpots = (newSpots: PhilippineTourSpot[]) => {
    setPhilippineSpotsState(newSpots);
  };

  const addPhilippineSpot = (spot: Omit<PhilippineTourSpot, 'id'>) => {
    const newSpot: PhilippineTourSpot = {
      ...spot,
      id: `spot-${Date.now()}`,
    };
    setPhilippineSpotsState((prev) => [newSpot, ...prev]);
  };

  const updatePhilippineSpot = (id: string, partial: Partial<PhilippineTourSpot>) => {
    setPhilippineSpotsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const deletePhilippineSpot = (id: string) => {
    setPhilippineSpotsState((prev) => prev.filter((item) => item.id !== id));
  };

  const setFaqs = (newFaqs: FAQItem[]) => {
    setFaqsState(newFaqs);
  };

  const addFaq = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
    };
    setFaqsState((prev) => [...prev, newFaq]);
  };

  const updateFaq = (id: string, partial: Partial<FAQItem>) => {
    setFaqsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    );
  };

  const deleteFaq = (id: string) => {
    setFaqsState((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDefaults = () => {
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

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.siteConfig) setSiteConfigState(parsed.siteConfig);
      if (parsed.bannerSlides) setBannerSlidesState(parsed.bannerSlides);
      if (parsed.casinos) setCasinosState(parsed.casinos);
      if (parsed.philippineSpots) setPhilippineSpotsState(parsed.philippineSpots);
      if (parsed.posts) setPostsState(parsed.posts);
      if (parsed.inquiryLeads) setInquiryLeadsState(parsed.inquiryLeads);
      if (parsed.serviceSteps) setServiceStepsState(parsed.serviceSteps);
      if (parsed.faqs) setFaqsState(parsed.faqs);
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
