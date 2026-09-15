export type MenuCategory = 'about' | 'casino' | 'philippines' | 'process' | 'community';

export interface SiteConfig {
  siteName: string;
  subTitle: string;
  pointColor: string;
  fontFamily: string;
  headerLogo?: string;
  navMenu1?: string;
  navMenu2?: string;
  navMenu3?: string;
  navMenu4?: string;
  navMenu5?: string;
  kakaoId: string;
  kakaoUrl: string;
  telegramId: string;
  telegramUrl: string;
  phoneNumber: string;
  email: string;
  operatingHours: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBadge: string;
  companyAddress: string;
  representative: string;
  licenseNumber: string;
  adminPassword?: string;

  // About Oasis Section Config
  aboutBadge?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutStoryHeading?: string;
  aboutStoryParagraph1?: string;
  aboutStoryParagraph2?: string;
  aboutStoryHighlight?: string;
  aboutImageUrl?: string;
  aboutLicenseTitle?: string;
  aboutLicenseSub?: string;
  aboutYearsExperience?: string;
  aboutStat1Num?: string;
  aboutStat1Label?: string;
  aboutStat2Num?: string;
  aboutStat2Label?: string;
  aboutStat3Num?: string;
  aboutStat3Label?: string;
  aboutStat4Num?: string;
  aboutStat4Label?: string;

  // Casino Section Config
  casinoBadge?: string;
  casinoTitle?: string;
  casinoSubtitle?: string;

  // Philippines Section Config
  philippinesBadge?: string;
  philippinesTitle?: string;
  philippinesSubtitle?: string;

  // Process Section Config
  processTitle?: string;
  processSubtitle?: string;

  // FAQ Section Config
  faqTitle?: string;
  faqSubtitle?: string;

  // Community Section Config
  communityTitle?: string;
  communitySubtitle?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bgImage: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface CasinoItem {
  id: string;
  name: string;
  englishName: string;
  region: 'manila' | 'clark';
  regionLabel: string;
  image: string;
  description: string;
  features: string[];
  tableGames: string;
  vipRooms: string;
  hotelRating: string;
  highlights: string;
  isFeatured?: boolean;
  order?: number;
}

export interface PhilippineTourSpot {
  id: string;
  category: 'hotel' | 'golf' | 'dining' | 'travel_info';
  title: string;
  subtitle: string;
  image: string;
  description: string;
  tags: string[];
  location: string;
}

export interface ServiceStep {
  stepNumber: string;
  title: string;
  engTitle: string;
  description: string;
  details: string[];
  iconName: string;
}

export interface PostItem {
  id: string;
  category: '공지사항' | '프로모션' | 'VIP매거진' | '커뮤니티' | string;
  title: string;
  author: string;
  date: string;
  viewCount: number;
  isPinned: boolean;
  summary: string;
  content: string;
  thumbnail?: string;
  images?: string[]; // 최대 2장 직접 업로드 사진
  tags?: string[];
}

export interface InquiryLead {
  id: string;
  name: string;
  contactType: 'kakao' | 'telegram' | 'phone';
  contactValue: string;
  targetRegion: string;
  expectedDate?: string;
  message: string;
  createdAt: string;
  status: '접수대기' | '상담진행중' | '상담완료';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
