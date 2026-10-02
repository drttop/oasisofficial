import { SiteConfig, BannerSlide, CasinoItem, PhilippineTourSpot, ServiceStep, PostItem, FAQItem, InquiryLead } from '../types';

export const initialSiteConfig: SiteConfig = {
  siteName: '마닐라 오아시스에이전시',
  subTitle: 'OASIS OFFICIAL VIP AGENCY',
  pointColor: '#30308A',
  fontFamily: 'Pretendard',
  kakaoId: 'oasis66',
  kakaoUrl: 'https://open.kakao.com/o/pNldnRKi',
  telegramId: '@oasis46',
  telegramUrl: 'https://t.me/oasis066',
  phoneNumber: '+63 917 123 4567 (현지) / 070-8098-7788 (인터넷전화)',
  email: 'vip@oasis-agent.com',
  operatingHours: '24시간 365일 연중무휴 VIP 컨시어지 데스크 운영',
  seoTitle: '마닐라 오아시스에이전시 | 필리핀 마닐라 카지노 공식 VIP 에이전트',
  seoDescription: '마닐라 오아시스에이전시 - 필리핀 마닐라 & 클락 메이저 복합리조트 공식 VIP 에이전트. 오카다, 솔레어, 시티오브드림즈, 클락 한 5성급 호텔 프리룸, 전용 의전 세단, 24시간 한국인 1:1 컨시어지 케어',
  seoKeywords: '마닐라 오아시스에이전시, 오아시스 에이전시, 필리핀 카지노, 마닐라 카지노, 클락 카지노, 오카다 마닐라, 솔레어 리조트, COD 카지노, 한 카지노, VIP 에이전시, 호텔 프리룸, 공항 의전, 필리핀 골프투어, 마닐라 여행 가이드',
  bannerTitle: '신뢰와 품격의 최고봉, 필리핀 No.1 공식 VIP 에이전트',
  bannerSubtitle: '마닐라 & 클락 메이저 복합리조트 VIP 혜택과 24시간 프라이빗 1:1 전담 의전 서비스를 경험하십시오.',
  bannerBadge: 'OFFICIAL CERTIFIED VIP AGENCY',
  companyAddress: 'OASIS TOWER 18F, Entertainment City, Parañaque, Metro Manila, Philippines',
  representative: '강태진 대표 디렉터',
  licenseNumber: 'PAGCOR Certified Official Agency No. 2018-0914-MNL',
  adminPassword: 'oasis1234!',

  // About Oasis Section Config
  aboutBadge: 'ABOUT OASIS',
  aboutTitle: '필리핀 공인 13년 현지 직영 공식 에이전트\n',
  aboutSubtitle: ' ',
  aboutStoryHeading: '“필리핀 공식 에이전트”',
  aboutStoryParagraph1: '오아시스 공식 에이전트는 필리핀의 각종 게임규제 정부부처의 규정을 준수하며 협력하고 있습니다. 13년간 필리핀 현지에서 직접 상주하며 단 한 건의 사고 없는 무결점 VIP 운영을 약속합니다.  필리핀 정부 게이밍 규제기관(PAGCOR), 필리핀 경기감독위원회(GAB), 필리핀 자선복권공사(PCSO)와의 공식 파트너십을 통해 \n법적 리스크 없는 100% 안전한 여정을 보장합니다.',
  aboutStoryParagraph2: '단순한 중개를 넘어 마닐라(오카다, 솔레어, 시티오브드림즈) 및 클락(한 카지노, 디하이츠, 로이스) 현지 법인 인프라를 바탕으로, 공항 VIP 패스트트랙 입국부터 최고급 의전 차량, 5성급 스위트룸 무료 바우처, 전담 한국인 매니저의 24시간 현지 밀착 케어까지 원스톱으로 책임집니다.',
  aboutStoryHighlight: ' 하단박스',
  aboutImageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
  aboutLicenseTitle: '필리핀 정부기관 공식 승인 에이전시',
  aboutLicenseSub: 'PAGCOR · GAB · PCSO Official Registered Agency',
  aboutYearsExperience: '13년 현지 직영',
  aboutStat1Num: '13+',
  aboutStat1Label: '현지 직영 VIP 운영',
  aboutStat2Num: '100%',
  aboutStat2Label: 'PAGCOR·GAB·PCSO 정부공인',
  aboutStat3Num: '20,000+',
  aboutStat3Label: '누적 VIP 고객 현지 케어',
  aboutStat4Num: '24 / 7',
  aboutStat4Label: '한국인 베테랑 현지 상주',

  // Casino Section Config
  casinoBadge: 'MAJOR CASINO & VIP RESORTS',
  casinoTitle: '필리핀 메이저 카지노 제휴 라인업',
  casinoSubtitle: '오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다.',

  // Philippines / VIP Service Section Config
  philippinesBadge: 'OASIS VIP SERVICE & CARE',
  philippinesTitle: '오아시스 VIP 서비스',
  philippinesSubtitle: '최고급 호텔 프리룸부터 전용 의전 세단, 명문 골프 및 24시간 프라이빗 케어까지,\n오아시스 VIP 회원님만을 위한 특별한 서비스를 제공합니다.',

  // Promotion Section Config
  promotionBadge: 'EXCLUSIVE PROMOTIONS & EVENTS',
  promotionTitle: '오아시스 VIP 특별 프로모션',
  promotionSubtitle: '특급 호텔 스위트룸 무료 숙박 바우처, 항공권 페이백, 롤링 1.5% 정산 등 오아시스 VIP 회원님만의 한정 혜택을 확인하세요.',

  // Community Section Config
  communityTitle: '오아시스 VIP 커뮤니티',
  communitySubtitle: '마닐라 & 클락 VIP 호텔, 골프, 파인다이닝 여행 정보 및 현지 생생한 소식을 확인하세요.',

  // Process and Nav Menu Config
  navMenu1: '오아시스',
  navMenu2: '카지노 서비스',
  navMenu3: 'VIP 서비스',
  navMenu4: '프로모션',
  navMenu5: '커뮤니티',
  navMenu6: '이용방법',
  headerLogo: '/images/oasis_header_logo.webp',
};

export const initialBannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    title: '필리핀 카지노 공식 VIP 에이전트',
    subtitle: '오카다 · 솔레어 · COD · 클락 한 카지노 공식파트너 \n차원이 다른 프리미엄 혜택과 투명한 정산 보증',
    badge: 'PAGCOR OFFICIAL CERTIFIED VIP AGENCY',
    bgImage: '/images/hero_bg.webp',
  },
  {
    id: 'slide-2',
    title: '24시간 퍼스트클래스 전담 케어',
    subtitle: '공항 VIP 패스트트랙 입국, 최고급 전용 리무진 픽업, 5성급 호텔 전액 지원',
    badge: '24/7 DEDICATED PRIVATE CONCIERGE',
    bgImage: '/images/casino_table.webp',
  },
];

export const initialCasinos: CasinoItem[] = [
  {
    id: 'okada-manila',
    name: '오카다 마닐라',
    englishName: 'Okada Manila Resort & Casino',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '아시아 최대 규모의 복합 엔터테인먼트 리조트로, 환상적인 분수 쇼와 럭셔리 스위트 객실, 최고급 VIP 전용 프라이빗 살롱을 보유하고 있습니다.',
    features: ['세계 최대 규모 멀티컬러 분수 쇼', '993개 전 객실 특급 스위트 구성', '프라이빗 VIP 전용 럭셔리 살롱 보유', '미슐랭 스타 다이닝 및 실내 비치클럽 코브(Cove)'],
    tableGames: 'VIP 전용 프리미엄 테이블 및 룰렛 (500+ 테이블)',
    vipRooms: '최고급 프라이빗 VIP 전담 살롱 (1:1 전담 배정 가능)',
    hotelRating: '5성급 럭셔리 호텔 (Forbes 5-Star)',
    highlights: 'VIP 회원 전용 스위트룸 무료 업그레이드 및 멤버십 리워드 혜택',
    isFeatured: true,
    order: 1,
  },
  {
    id: 'city-of-dreams',
    name: '시티 오브 드림즈 마닐라 (COD)',
    englishName: 'City of Dreams Manila',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '노부 호텔, 하얏트, 누와 호텔 3개의 세계적 5성급 호텔이 결합된 초대형 랜드마크로 모던하고 트렌디한 VIP 카지노 환경을 제공합니다.',
    features: ['3대 럭셔리 호텔 브랜드 집약', '드림플레이 테마파크 & 고급 라운지', '최첨단 전자 게이밍 및 프리미엄 라이브 테이블', '황금빛 돔 구조의 상징적 건축미'],
    tableGames: 'VIP 라이브 프리미엄 테이블, 룰렛 등 (300+ 테이블)',
    vipRooms: '누와 클럽 & Signature VIP 라운지',
    hotelRating: '5성급 (Nüwa, Nobu, Hyatt Regency)',
    highlights: '오아시스 고객 전담 캐셔 패스트트랙 및 식음료 무제한 바우처',
    isFeatured: false,
    order: 2,
  },
  {
    id: 'solaire-resort',
    name: '솔레어 리조트 & 카지노',
    englishName: 'Solaire Resort & Casino Manila',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '마닐라 베이의 아름다운 일몰을 조망하는 필리핀 최초의 통합 럭셔리 리조트로, 최상의 보안과 격조 높은 VIP 서비스를 자랑합니다.',
    features: ['마닐라 베이 오션뷰 파노라마 전경', '포브스 8년 연속 5성급 획득', '명품 부티크 거리(루이비통, 구찌 등) 입점', '세계 최고 권위의 셰프 레스토랑'],
    tableGames: '프리미엄 테이블 게임 라운지 (400+ 테이블)',
    vipRooms: '솔레어 클럽 전용 VIP 전용 살롱 및 단독 프라이빗 룸',
    hotelRating: '5성급 특급 호텔 (Forbes 5-Star Travel Guide)',
    highlights: '공항 10분 거리 전용 픽업 의전 및 맞춤형 VIP 다이닝 크레딧 제공',
    isFeatured: true,
    order: 3,
  },
  {
    id: 'newport-world-resorts',
    name: '뉴포트 월드 리조트',
    englishName: 'Newport World Resorts (구 리조트 월드 마닐라)',
    region: 'manila',
    regionLabel: '마닐라 공항 제3터미널 맞은편',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '마닐라 국제공항 바로 앞에 위치하여 뛰어난 접근성을 자랑하며, 메리어트, 쉐라톤, 힐튼 등 글로벌 체인 호텔과 연결된 전통의 명문 카지노입니다.',
    features: ['마닐라 공항 3터미널 도보 브릿지 연결(Runway Manila)', '글로벌 특급 호텔 5개 결합 단지', '대형 쇼핑몰 및 뮤지컬 극장 보유', '24시간 활기찬 엔터테인먼트 시설'],
    tableGames: 'VIP 전용 테이블 게임 및 룰렛 라운지',
    vipRooms: '맥심 VIP 클럽 & 겐팅 클럽',
    hotelRating: '5성급 복합 (Marriott, Sheraton, Hilton, Okura)',
    highlights: '단기 체류 고객을 위한 초고속 공항 픽업/샌딩 최적화',
    isFeatured: false,
    order: 4,
  },
  {
    id: 'hann-casino-clark',
    name: '한 카지노 리조트 클락',
    englishName: 'Hann Casino Resort Clark',
    region: 'clark',
    regionLabel: '클락 경제자유구역 (Clark Freeport Zone)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '클락 최고의 최신식 5성급 복합 리조트로, 메리어트 호텔 & 스위소텔과 직결되어 쾌적하고 안전한 최고급 게이밍 환경을 제공합니다.',
    features: ['클락 최대 규모 최신식 5성급 시설', '스위소텔 & 클락 메리어트 호텔 직통 연결', '주변 명문 골프장 10분 이내 위치', '최고 수준의 치안 및 프라이버시 보장'],
    tableGames: '최신 전자 테이블 & VIP 전용 프리미엄 테이블',
    vipRooms: 'Hann VIP 전용 살롱 (한국인 전담 매니저 상주)',
    hotelRating: '5성급 럭셔리 (Swissôtel / Marriott)',
    highlights: '클락 골프투어 패키지 연계 및 스위트룸 무료 숙박 지원',
    isFeatured: true,
    order: 5,
  },
  {
    id: 'dheights-clark',
    name: '디하이츠 리조트 & 카지노',
    englishName: "D'Heights Resort and Casino Clark",
    region: 'clark',
    regionLabel: '클락 몬테레이 힐스',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '클락의 수려한 자연경관 속에 위치한 프리미엄 리조트로, 썬밸리 골프장과 인접하여 여유로운 힐링과 고품격 게이밍을 동시에 만끽할 수 있습니다.',
    features: ['자연 친화적 힐튼 호텔 직결', '36홀 클락 썬밸리 CC 바로 인접', '조용하고 프라이빗한 VIP 전용 살롱 환경', '가족 및 비즈니스 동반 최적화 리조트'],
    tableGames: 'VIP 테이블 게임 및 전자 게임 라운지',
    vipRooms: '프라이빗 VIP 살롱 룸 완비',
    hotelRating: '5성급 힐튼 리조트 (Hilton Clark Sun Valley)',
    highlights: '골프 라운딩 + VIP 의전 결합 올인원 서비스',
    isFeatured: false,
    order: 6,
  },
];

export const initialPhilippineSpots: PhilippineTourSpot[] = [
  {
    id: 'spot-1',
    category: 'hotel',
    title: '마닐라 베이 5성급 럭셔리 스위트 호텔',
    subtitle: '오카다 / 솔레어 / 그랜드 하얏트 BGC',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '오아시스 VIP 고객님께는 최고급 오션뷰 및 스위트 객실 무료 지원 또는 특별 프로모션 요율을 적용해 드립니다.',
    tags: ['5성급 호텔', '스위트룸 무료지원', '오션뷰', '24시간 룸서비스'],
    location: 'Metro Manila',
  },
  {
    id: 'spot-2',
    category: 'golf',
    title: '마닐라 & 클락 명문 프라이빗 골프 투어',
    subtitle: '미모사 골프클럽 / 클락 썬밸리 CC / FA코리아 CC',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '필리핀 최고의 잔디 컨디션을 자랑하는 PGA급 코스에서 1:1 캐디 및 전용 카트, 패스트 부킹 혜택을 제공합니다.',
    tags: ['명문 골프장', 'PGA 36홀', 'VIP 티오프 우선예약', '클럽하우스 의전'],
    location: 'Clark / Angeles',
  },
  {
    id: 'spot-3',
    category: 'dining',
    title: 'BGC & 카지노 리조트 최고급 파인다이닝',
    subtitle: '미슐랭 스타 일식, 최고급 한우/와규 스테이크 & 와인 바',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '필리핀 최고의 부촌 BGC(보니파시오)와 호텔 리조트 내 프리미엄 레스토랑 사전 예약 및 VIP 할인 서비스를 지원합니다.',
    tags: ['파인다이닝', '미슐랭 셰프', '프라이빗 룸', 'VIP 바우처'],
    location: 'Bonifacio Global City',
  },
  {
    id: 'spot-4',
    category: 'travel_info',
    title: '필리핀 입국 규정 및 안심 VIP 의전 가이드',
    subtitle: 'e-Travel 사전 등록 대행, 여권 6개월 이상, 무비자 30일 체류',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp',
    description: '복잡한 입국 절차 없이 공항 내 VIP 패스트트랙 통과부터 최고급 의전 세단으로 호텔까지 안전하고 신속하게 모십니다.',
    tags: ['공항 패스트트랙', 'eTravel 지원', '안전보안', '전용 리무진'],
    location: 'NAIA Manila & Clark Airport',
  },
];

export const initialServiceSteps: ServiceStep[] = [
  {
    stepNumber: '01',
    title: '1:1 맞춤 사전 상담',
    engTitle: 'Private Consultation',
    description: '24시간 카카오톡 / 텔레그램을 통해 고객님의 방문 일정, 선호 호텔, 게임 성향 및 동행 인원을 파악하여 맞춤 일정을 설계합니다.',
    details: ['24시간 실시간 한국인 전담 실장 상담', '목적지 맞춤 리조트 & 카지노 추천', '예산 및 롤링 조건별 VIP 혜택 안내'],
    iconName: 'MessageSquare',
  },
  {
    stepNumber: '02',
    title: '항공 및 호텔 예약 대행',
    engTitle: 'Flight&Suite Booking',
    description: '최적의 항공 스케줄 안내와 함께 5성급 특급 호텔(오카다, 솔레어, 메리어트 등) 스위트 객실 무료 바우처를 신속하게 발권합니다.',
    details: ['특급 호텔 스위트룸/오션뷰 우선 배정', '얼리 체크인 & 레이트 체크아웃 지원', '항공권 예약 및 일정 변동 즉시 대응'],
    iconName: 'Building2',
  },
  {
    stepNumber: '03',
    title: '패스트트랙 & 의전 픽업',
    engTitle: 'Fast-Track & Pickup',
    description: '마닐라/클락 공항 도착 즉시 줄 서지 않는 VIP 패스트트랙 통과와 함께 최고급 전용 세단/밴으로 목적지까지 편안하게 모십니다.',
    details: ['공항 입국장 패스트트랙 에스코트', '최고급 알파드/스타리아 리무진 단독 배차', '무료 생수 및 음료, 와이파이 제공'],
    iconName: 'Car',
  },
  {
    stepNumber: '04',
    title: '24시간 전담 VIP 케어',
    engTitle: ' Dedicated Concierge ',
    description: '필리핀 현지 베테랑 한국인 전담 실장이 24시간 밀착 상주하여 쾌적한 룸 배정, 식음료 지원, 골프 및 통역 서비스를 완벽 지원합니다.',
    details: ['정켓 롤링 및 칩 교환 즉시 지원', '1:1 프라이빗 게임 룸 & 테이블 예약', '골프장 부킹 및 파인다이닝 예약 동행'],
    iconName: 'ShieldCheck',
  },
  {
    stepNumber: '05',
    title: '투명 정산 및 안전한 출국 ',
    engTitle: 'Settlement,Departure',
    description: '모든 일정 종료 후 단 1원의 오차 없는 실시간 투명 정산과 함께 공항 VIP 샌딩까지 안전하고 완벽하게 마무리해 드립니다.',
    details: ['원화/페소/달러 실시간 투명 정산', '철저한 개인정보 즉시 파기 및 보안 유지', '공항 출국장 VIP 의전 샌딩 서비스'],
    iconName: 'CheckCircle2',
  },
];

export const initialPosts: PostItem[] = [
  {
    category: "공지사항",
    title: "[필독] 오아시스 공식 에이전트 2026년 VIP 멤버십 혜택 & 안전 이용 수칙 안내",
    date: "2026-08-25",
    isPinned: true,
    viewCount: 1428,
    author: "오아시스 총괄운영팀",
    id: "post-1",
    summary: "오아시스 공식 에이전트를 이용해 주시는 VIP 고객님들을 위한 2026년 특급 호텔 무료 숙박 및 전용 의전 지원 기준 안내입니다.",
    thumbnail: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80"
    ],
    content: `안녕하세요, 오아시스 공식 에이전트(OASIS VIP AGENCY) 총괄운영팀입니다.

저희 오아시스는 필리핀 정부 공인 PAGCOR 정식 라이센스 협력 에이전시로서, 10년 무사고 원칙과 신뢰를 바탕으로 최상의 VIP 서비스를 제공해 드리고 있습니다.

■ 2026년 오아시스 VIP 주요 혜택
1. 마닐라 & 클락 5성급 복합리조트(오카다, 솔레어, COD, 한 카지노등 ) 무료 숙박 지원
2. 마닐라(NAIA) 및 클락(CRK) 국제공항 도착 시 전용 VIP 패스트트랙 입국 에스코트
3. 최고급 토요타 알파드(Alphard) / 현대 스타리아 리무진 단독 왕복 픽업 및 전용 기사 배차
4. 전 일정 24시간 한국인 베테랑 VIP 전담 실장 밀착 케어 (언어 소통, 테이블 에스코트, 식음료 무제한 지원)
5. 클락 썬밸리, 미모사 등 명문 골프장 VIP 패스트 티오프 부킹 및 의전 차량 지원

■ 안전 이용 및 개인정보 보안 수칙
- 모든 고객님의 방문 내역 및 상담 기록은 철저히 암호화 관리되며, 귀국 즉시 영구 파기 처리됩니다.
- 24시간 공식 카카오톡(oasis66) 및 공식 텔레그램 채널(oasis46)을 통해서만 공식 계좌 및 픽업 예약이 진행됩니다. 유사 사칭 채널에 각별히 유의해 주시기 바랍니다.

고객님의 품격 있는 필리핀 여정을 오아시스가 가장 완벽하게 완성해 드리겠습니다. 감사합니다.`,
    tags: [
      "공지사항",
      "VIP혜택",
      "오아시스공식",
      "마닐라",
      "클락"
    ]
  },
  {
    id: "2",
    category: "VIP매거진",
    title: "필리핀 마닐라 카지노 에이전시 왜 필요해? 실제 비용혜택 정리",
    date: "2026-09-26",
    isPinned: false,
    viewCount: 1250,
    author: "오아시스 VIP컨시어지",
    summary: "핵심 요약: 여행하는 동안 손만 까닥 하셔도 됩니다. 시간과 비용을 40% 이상 절감합니다.",
    thumbnail: "/images/posts/post-2-thumb.webp",
    images: [
      "/images/posts/post-2-img-1.webp"
    ],
    content: `[크기:대][굵게]필리핀 마닐라 카지노 에이전시 왜 필요해? 실제 비용혜택 정리[/굵게][/크기]

핵심 요약: 여행하는 동안 손만 까닥 하셔도 됩니다. 시간과 비용을 40% 이상 절감합니다.

[크기:중][굵게]■ Executive Summary[/굵게][/크기]
필리핀 마닐라는 한국에서 항공편으로 약 4시간이면 도달할 수 있는 지리적 이점이 뛰어난 여행지이지만, 현지의 악명 높은 교통 체증과 복잡한 인프라로 인해 일반 자유여행 시 예상치 못한 심각한 일정 지연과 불필요한 지출이 발생하기 쉽습니다.

오아시스 공식 VIP 에이전시를 이용하시면 다음과 같은 실질적인 비용 절감과 특급 의전 혜택을 누리실 수 있습니다.

[크기:중][굵게]■ 오아시스 공식 에이전시 핵심 5대 혜택[/굵게][/크기]
1. **5성급 호텔 스위트룸 무료 바우처 제공** (오카다 마닐라, 솔레어, COD, 한 등 1박당 30~80만원 상당 전액 무료 지원)
2. **공항 VIP 패스트트랙 입출국 에스코트** (입국 대기 시간 1~2시간 -> 10분 이내 초고속 통과)
3. **최고급 전용 리무진 단독 픽업/샌딩** (토요타 알파드 / 스타리아 리무진 전 일정 무료 배차)
4. **24시간 1:1 한국인 전담 컨시어지 상주 케어** (언어 장벽 없는 밀착 안내, 맛집/골프/관광 가이드)
5. **투명한 실시간 정산 및 우대 환율 환전 지원** (단 1원의 오차 없는 실시간 투명 정산)

혼자 준비하는 여행 대비 전체 일정의 시간과 비용을 40% 이상 절감할 수 있는 오아시스 VIP 케어를 지금 바로 경험해 보세요.`,
    tags: ["마닐라에이전시", "VIP혜택", "카지노에이전시", "호텔프리룸", "비용절감"]
  },
  {
    id: "3",
    category: "VIP매거진",
    title: "[단독 지원] 오카다 마닐라 '선미(SUNMI)' 10월 3일 VIP 전용 콘서트 단독 배정",
    date: "2026-09-23",
    isPinned: false,
    viewCount: 1120,
    author: "오아시스 현지운영팀",
    summary: "오카다 코브 마닐라 선미 콘서트, 오아시스 고객 한정 VIP 티켓 지원.",
    thumbnail: "/images/casino_table.webp",
    images: [
      "/images/casino_table.webp"
    ],
    content: `[크기:대][굵게][단독 지원] 오카다 마닐라 '선미(SUNMI)' 10월 3일 VIP 전용 콘서트 단독 배정[/굵게][/크기]

오카다 코브 마닐라 선미 콘서트, 오아시스 고객 한정 VIP 티켓 지원!

오는 2026년 10월 3일, 오카다 마닐라의 '코브 마닐라(Cove Manila)'에서 K-POP 스타 선미(SUNMI)의 특별 콘서트 '골든 문 멜로디스'가 개최됩니다.
본 공연은 일반 티켓 예매 창구가 없는 초청 전용(By Invitation Only) 프라이빗 콘서트로, 오아시스 VIP 고객님들을 위한 단독 VIP 좌석을 확보하였습니다.

[크기:중][굵게]■ 콘서트 개요 및 오아시스 특전[/굵게][/크기]
- **일시**: 2026년 10월 3일 (토)
- **장소**: 오카다 마닐라 코브 마닐라 (Cove Manila)
- **혜택 1**: 오카다 코브 마닐라 VIP 프라이빗 구역 좌석 배정
- **혜택 2**: 공연 당일 오카다 마닐라 스위트룸 무료 숙박 바우처
- **혜택 3**: 공항-리조트 간 알파드 리무진 단독 의전 왕복 픽업

한정 수량으로 조기 마감될 수 있으니 참가를 희망하시는 회원님은 24시간 실시간 고객센터로 문의해 주시기 바랍니다.`,
    tags: ["오카다마닐라", "선미콘서트", "VIP이벤트", "코브마닐라", "KPOP"]
  },
  {
    id: "4",
    category: "공지사항",
    title: "필리핀 여행주의! 금연법 강력처벌! 대처 가이드",
    date: "2026-09-21",
    isPinned: false,
    viewCount: 1390,
    author: "오아시스 VIP컨시어지",
    summary: "필리핀 금연법 여행자도 강력처벌! 공공장소 흡연 규정 및 안전 대처 가이드.",
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
    ],
    content: `[크기:대][굵게]필리핀 여행주의! 금연법 강력처벌! 대처 가이드[/굵게][/크기]

필리핀 금연법 여행자도 강력처벌! 금연법 완벽 가이드!

[크기:중][굵게]■ Executive Summary[/굵게][/크기]
필리핀은 동남아시아에서 가장 강력한 국가 단위의 금연 정책(행정명령 제26호, EO 26)을 시행하고 있는 국가입니다. 특히 외국인 관광객에 대한 예외가 전혀 없으며, 공공장소 흡연 적발 시 현장 벌금 부과는 물론 불응 시 구금까지 이어질 수 있어 각별한 주의가 필요합니다.

[크기:중][굵게]■ 반드시 숙지해야 할 핵심 흡연 수칙[/굵게][/크기]
1. **공공장소 전면 금연**: 거리, 도로, 보도, 대중교통, 공항 청사, 일반 식당 내부는 전면 금연입니다.
2. **전자담배 규제**: 액상 및 궐련형 전자담배도 연초와 동일하게 강력 처벌 대상입니다.
3. **지정 흡연 구역(DSA) 이용**: 정부 공인 DSA(Designated Smoking Area) 표지판이 부착된 공식 구역에서만 흡연 가능합니다.
4. **리조트 내 흡연 구역**: 오카다, 솔레어 등 복합리조트 내부의 지정 VIP 전용 흡연실을 이용하시면 가장 안전합니다.

오아시스는 공항 픽업부터 전 일정 고객님의 동선을 전담 케어하여 어떠한 법적 리스크도 없도록 완벽하게 가이드해 드립니다.`,
    tags: ["필리핀여행", "금연법", "여행자주의", "마닐라안내", "안전수칙"]
  },
  {
    id: "0",
    category: "프로모션",
    title: "9월 신규회원대상 이벤트!! 마닐라 5성급호텔 프리룸 3박",
    date: "2026-09-18",
    isPinned: false,
    viewCount: 1470,
    author: "오아시스 마케팅팀",
    summary: "오아시스 9월프로모션 마닐라 5성급호텔 프리룸3박 혜택 - 신규고객 풀패키지 쏜다!",
    thumbnail: "/images/hero_bg.webp",
    images: [
      "/images/hero_bg.webp"
    ],
    content: `[크기:대][굵게]9월 신규회원대상 이벤트!! 마닐라 5성급호텔 프리룸 3박[/굵게][/크기]

오아시스 9월 프로모션: 마닐라 5성급 호텔 프리룸 3박 혜택!
✈️ 오아시스 9월 마지막 이벤트! 신규 고객 풀패키지 쏜다!

추석 연휴 및 가을 여행, 아직 고민 중이신가요?
오아시스에 처음 오시는 분들을 위해 몸만 오셔도 되는 완벽한 혜택을 준비했습니다.

[크기:중][굵게]■ 9월 신규 회원 한정 혜택[/굵게][/크기]
- **기간**: 2026년 9월 한정
- **대상**: 오아시스 공식 에이전트 신규 등록 VIP 회원
- **혜택 1**: 오카다 / 솔레어 / COD 5성급 스위트룸 최대 3박 전액 무료 지원
- **혜택 2**: 마닐라 공항 VIP 패스트트랙 및 최고급 알파드 리무진 단독 픽업/샌딩
- **혜택 3**: 호텔 내 최고급 파인다이닝 식음료 크레딧 바우처 증정
- **혜택 4**: 24시간 한국인 베테랑 실장 1:1 전담 의전

지금 24시간 실시간 메신저(카카오톡 / 텔레그램)로 문의하시면 바로 예약 가능합니다.`,
    tags: ["9월이벤트", "신규회원", "호텔프리룸", "마닐라스위트룸", "프로모션"]
  },
  {
    id: "5",
    category: "VIP매거진",
    title: "유류할증료 두달연속 인상! 필리핀 마닐라 무료항공권 혜택 노려야 하는 이유",
    date: "2026-09-17",
    isPinned: false,
    viewCount: 998,
    author: "오아시스 마케팅팀",
    summary: "국제유가상승으로 인한 유류할증료 인상. 무료항공권이 절실한 때!",
    thumbnail: "/images/posts/post-2-thumb.webp",
    images: [
      "/images/posts/post-2-img-1.webp"
    ],
    content: `[크기:대][굵게]유류할증료 두달연속 인상! 필리핀 마닐라 무료항공권 혜택 노려야 하는 이유[/굵게][/크기]

국제유가상승으로 인한 유류할증료 인상. 무료항공권이 절실한 때!

올가을, 겨울 해외여행을 계획하고 계신다면 항공권 예매를 서두르셔야겠습니다. 국제유가 고공행진의 여파로 국제선 항공권 유류할증료가 두 달 연속 인상되고 있습니다.

[크기:중][굵게]■ 항공료 부담을 제로로 만드는 오아시스 솔루션[/굵게][/크기]
오아시스 공식 VIP 에이전시에서는 회원님들의 출입국 부담을 덜어드리기 위해 **왕복 비즈니스/이코노미 항공권 100% 실비 페이백 프로모션**을 진행합니다.

1. **항공권 실비 전액 지원**: 오아시스 제휴 기준 충족 시 항공권 결제 금액 전액 페이백
2. **유류할증료 & 공항세 포함**: 추가 비용 일체 없이 순수 무료 혜택 제공
3. **최적 비행 스케줄 예약 대행**: 마닐라 및 클락 직항 노선 우선 배정

항공료 상승 걱정 없이, 오아시스의 럭셔리 VIP 의전과 함께 가장 편안하고 경제적인 여정을 계획하십시오.`,
    tags: ["유류할증료", "무료항공권", "항공권페이백", "마닐라여행", "VIP혜택"]
  },
  {
    id: "post-6",
    category: "VIP매거진",
    title: "마닐라 카지노 4대호텔 오카다,COD,솔레어 완벽 비교 가이드",
    date: "2026-09-16",
    isPinned: false,
    viewCount: 1530,
    author: "오아시스 VIP컨시어지",
    summary: "마닐라 4대 카지노 리조트(솔레어, 오카다, 시오디, 뉴포트) 비교 가이드.",
    thumbnail: "/images/posts/post-6-thumb.webp",
    images: [
      "/images/posts/post-6-img-1.webp",
      "/images/posts/post-6-img-2.webp",
      "/images/posts/post-6-img-3.webp",
      "/images/posts/post-6-img-4.webp"
    ],
    content: `[크기:대][굵게]마닐라 카지노 4대호텔 오카다,COD,솔레어 완벽 비교 가이드[/굵게][/크기]

마닐라 4대 카지노 리조트(솔레어, 오카다, 시오디, 뉴포트) 비교 분석!

[크기:중][굵게]■ Executive Summary[/굵게][/크기]
아시아 프리미엄 게이밍 시장의 중심축이 필리핀 마닐라로 이동하고 있습니다. 마닐라의 복합 리조트(Integrated Resorts)들은 단순히 규모를 키우는 것을 넘어, 각기 다른 타깃층과 명확한 서비스 철학을 바탕으로 고유의 브랜딩을 구축하고 있습니다.

[크기:중][굵게]1. 오카다 마닐라 (Okada Manila)[/굵게][/크기]
- **특징**: 압도적인 황금빛 외관과 아시아 최대 규모의 복합 리조트
- **장점**: 세계 최대 분수쇼, 실내 비치 클럽 '코브 마닐라', 최신식 시설과 다양한 레스토랑
- **추천**: 화려함과 다채로운 엔터테인먼트를 선호하는 고객

[크기:중][굵게]2. 솔레어 리조트 (Solaire Resort)[/굵게][/크기]
- **특징**: 마닐라 베이의 하이엔드 럭셔리 정통 강자
- **장점**: 엄격한 VIP 보안, 최상급 프라이빗 살롱, 마닐라 최고 수준의 파인다이닝
- **추천**: 품격 있는 정통 카지노 환경과 보안을 중시하는 하이롤러

[크기:중][굵게]3. 시티오브드림즈 (City of Dreams Manila)[/굵게][/크기]
- **특징**: 글로벌 3대 럭셔리 호텔(누와, 노부, 하얏트) 결합 단지
- **장점**: 미슐랭 스타 셰프 레스토랑, 감각적인 라이프스타일 인프라
- **추천**: 세련된 호스피탈리티와 미식을 함께 즐기려는 고객

[크기:중][굵게]4. 뉴포트 월드 리조트 (Newport World Resorts)[/굵게][/크기]
- **특징**: 공항 3터미널 도보 육교 연결 최상의 접근성
- **장점**: 메리어트, 힐튼, 쉐라톤, 오쿠라 등 풍부한 호텔 인프라
- **추천**: 단기 체류 및 빠른 출입국 동선을 선호하는 고객

오아시스 공식 에이전트는 고객님의 성향과 목적에 가장 부합하는 최적의 리조트를 매칭해 드립니다.`,
    tags: ["마닐라카지노", "오카다", "솔레어", "COD", "카지노비교"]
  },
  {
    id: "7",
    category: "VIP매거진",
    title: "페소환율 7년만의 최저기록 지금이 여행 최적기!",
    date: "2026-09-14",
    isPinned: false,
    viewCount: 1180,
    author: "오아시스 경제분석팀",
    summary: "7년만의 페소 환율 최저기록 - 구매력 극대화와 필리핀 여행 최적기 분석.",
    thumbnail: "/images/posts/post-3-thumb.webp",
    images: [
      "/images/posts/post-3-img-1.webp"
    ],
    content: `[크기:대][굵게]페소환율 7년만의 최저기록 지금이 여행 최적기![/굵게][/크기]

7년만의 페소 환율 최저기록 - 필리핀 여행 최적기 분석!

[크기:중][굵게]■ Executive Summary[/굵게][/크기]
최근 원·페소 환율이 7년 만에 최저점을 돌파하며 필리핀 여행 시장에 전례 없는 경제적 기회가 열렸습니다. 글로벌 인플레이션으로 인해 전 세계적인 여행 경비가 상승하는 추세 속에서, 필리핀 페소화의 약세는 한국 여행객들에게 '구매력 극대화(Purchasing Power Maximization)'라는 독보적인 장점을 선사합니다.

[크기:중][굵게]■ 페소 약세 시기 VIP 고객 체감 혜택[/굵게][/크기]
1. **바이인 시드머니 극대화**: 동일한 원화 예산 대비 훨씬 많은 페소 칩스 환전 가능
2. **현지 지출 경비 대폭 절감**: 쇼핑, 파인다이닝, 골프 라운딩 등 부대 비용 30% 이상 체감 하락
3. **오아시스 우대 환율 적용**: 시중 공항 환전소 대비 가장 유리한 환전 및 송금 지원

지금이 가장 적은 비용으로 가장 큰 만족을 얻을 수 있는 필리핀 방문의 골든타임입니다.`,
    tags: ["페소환율", "환율최저", "마닐라여행", "환전우대", "경제분석"]
  },
  {
    "category": "프로모션",
    "images": [
      "/images/posts/post-2-img-1.webp"
    ],
    "tags": [
      "프로모션",
      "오카다마닐라",
      "솔레어",
      "COD",
      "스위트룸무료"
    ],
    "author": "오아시스 마케팅팀",
    "thumbnail": "/images/posts/post-2-thumb.webp",
    "viewCount": 1004,
    "date": "2026-08-20",
    "isPinned": false,
    "title": "2026 9월 기존 회원 대상, 스위트룸 3박 무료 특별 프로모션",
    "summary": "사전 예약 고객 대상 마닐라 대표 5성급 리조트 오카다 마닐라 오션뷰 스위트룸 2박 무료 지원 및 웰컴 다이닝 크레딧 이벤트.",
    "id": "post-2",
    "content": "오아시스 공식 에이전트에서 2026년 가을 시즌을 맞이하여 마닐라 메이저 카지노 방문 고객님들을 위한 한정 특별 프로모션을 진행합니다.&nbsp;<div>&nbsp;[프로모션 세부 내용]&nbsp;</div><div>- 대상: 오아시스 신규 및 기존 VIP 회원</div><div>- 혜택 1: 오카다 마닐라 마닐라베이 뷰 주니어 스위트 3박 무료 제공&nbsp;</div><div>- 혜택 2: 솔레어 리조트 &amp; 카지노 파인다이닝 식음료 크레딧 바우처 증정&nbsp;</div><div>- 혜택 3: 마닐라 공항 - 호텔 간 전용 최고급 알파드 리무진 단독 픽업/샌딩&nbsp;</div><div>- 혜택 4: 24시간 1:1 전담 VIP 매니저 상주 및 특별&nbsp;환율 환전 지원&nbsp;</div><div>&nbsp;[오카다 마닐라 찾아오시는 길]\n<p>[지도:오카다 마닐라|New Seaside Dr, Entertainment City, Parañaque, Metro Manila]</p>\n\n[신청 및 예약 방법]\n하단 실시간 카카오톡 또는 텔레그램으로 '가을 프로모션 예약' 메시지를 보내주시면 즉시 배정해 드립니다.</div>",
    "mapLocation": {
      "address": "New Seaside Dr, Entertainment City, Parañaque, Metro Manila",
      "title": "오카다 마닐라 (Okada Manila)",
      "query": "Okada Manila, New Seaside Dr, Parañaque, Metro Manila"
    }
  },
  {
    "thumbnail": "/images/posts/post-3-thumb.webp",
    "tags": [
      "클락카지노",
      "한카지노",
      "VIP살롱",
      "클락투어",
      "필리핀에이전시",
      "마닐라에이전시",
      "클락에이전시",
      "카지노에이전시"
    ],
    "isPinned": false,
    "id": "post-3",
    "images": [
      "/images/posts/post-3-img-1.webp",
      "/images/posts/post-3-img-2.webp",
      "/images/posts/post-3-img-3.webp"
    ],
    "author": "오아시스 현지운영팀",
    "mapLocation": null,
    "category": "VIP매거진",
    "content": "<div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; background-color: rgb(247, 250, 252); border-left: 4px solid rgb(49, 130, 206); padding: 20px; border-radius: 4px; margin-bottom: 32px;\"><strong style=\"color: rgb(43, 108, 176); font-size: 16px; display: block; margin-bottom: 8px;\">Executive Summary</strong><p style=\"margin: 0px; font-size: 15px; color: rgb(74, 85, 104);\">필리핀 클락(Clark) 경제특구가 마닐라 엔터테인먼트 시티에 버금가는 하이엔드 게이밍 및 호스피탈리티의 중심지로 급부상하고 있습니다. 그 중심에 있는 <strong>한 카지노 리조트(Hann Casino Resort)</strong>가 최근 최상위 VIP 및 하이롤러(High-roller)를 타깃으로 한 <strong>신규 VIP 프라이빗 살롱(Private Salon)</strong>을 전격 확장 오픈했습니다. 본 리포트에서는 새롭게 선보이는 VIP 공간의 하드웨어 스펙, 그리고 에이전시 비즈니스 차원에서 활용할 수 있는 차별화된 호스피탈리티 서비스를 심층 분석합니다.</p></div><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 36px;\">전통적으로 필리핀 클락 지역은 세계적인 수준의 골프 코스를 기반으로 한 레저 투어의 성격이 강했습니다. 그러나 한 카지노 리조트(구 위더스)가 스위소텔(Swissôtel), 메리어트(Marriott) 등 글로벌 5성급 호텔 체인을 통합한 복합 리조트(IR)로 재탄생하면서 게이밍 산업의 패러다임이 완전히 바뀌었습니다. 이번 신규 VIP 살롱의 확장은 클락 게이밍 시장이 대중적인 매스(Mass) 마켓을 넘어, 극강의 프라이버시와 거액의 롤링이 수반되는 프리미엄 마켓으로 진입했음을 알리는 강력한 시그널입니다.</p><p><br></p><hr style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; border-style: solid none none; border-color: rgb(226, 232, 240) currentcolor currentcolor; margin: 36px 0px;\"><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">1. 신규 VIP 프라이빗 살롱: 완벽한 통제와 럭셔리의 구현</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\"><p>[사진1]</p><p>이번에 확장 오픈한 한 카지노의 VIP 프라이빗 살롱은 마닐라 최고급 카지노들의 VVIP 룸에 필적하는 스펙을 자랑합니다. 가장 중점을 둔 부분은 <strong>'절대적인 보안(Absolute Security)'과 '동선의 독립성'</strong>입니다. 일반 객장(Mass Floor)을 거치지 않고 VIP 전용 드롭오프 존에서 전용 엘리베이터를 통해 살롱으로 직행할 수 있도록 설계되어, 신분 노출을 꺼리는 주요 인사 및 하이롤러들에게 완벽한 프라이버시를 보장합니다.</p></p><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">내부 인테리어는 필리핀의 자연 유산에서 영감을 받은 모던 트로피컬 디자인에 유럽식 하이엔드 마감재를 적용했습니다. 높은 층고와 더불어 최고급 샹들리에, 맞춤형 이탈리아산 가죽 의자가 비치된 바카라 전용 테이블들은 게임의 몰입도를 극대화합니다. 또한, 각 프라이빗 룸 내부에 전용 휴식 라운지, 다이닝 공간, 프라이빗 화장실이 완비되어 있어 룸 밖으로 나갈 필요 없이 모든 일정을 소화할 수 있는 '올인원(All-in-one)' 스페이스를 제공합니다.</p><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-top: 40px; margin-bottom: 16px;\">2. 인프라 스펙 및 하이엔드 서비스 분석</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">외형적인 화려함뿐만 아니라, 게임 진행의 유연성과 자금 관리의 편의성 역시 대폭 업그레이드되었습니다. 살롱 내에는 에이전트와 정킷 운영자들을 위한 전용 케이지(Cage)가 분리되어 있어, 빠르고 안전한 칩스 교환과 환전 및 송금 업무가 24시간 끊김 없이 지원됩니다.</p><div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; overflow-x: auto; margin-bottom: 28px;\"><table style=\"width: 860px; font-size: 14px; border-color: rgb(226, 232, 240);\"><thead><tr style=\"background-color: rgb(237, 242, 247); border-bottom: 2px solid rgb(203, 213, 224);\"><th style=\"padding: 12px 14px;\">구분</th><th style=\"padding: 12px 14px;\">신규 VIP 프라이빗 살롱 핵심 스펙</th></tr></thead><tbody><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">접근성 및 보안</td><td style=\"padding: 12px 14px;\">전용 VIP 드롭오프 존, 생체 인식 기반 출입 통제, 전용 엘리베이터</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">공간 구성</td><td style=\"padding: 12px 14px;\">다수의 독립형 PDR(Private Dining &amp; Rolling) 룸, 에이전트 전용 휴게실</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">F&amp;B 특화 서비스</td><td style=\"padding: 12px 14px;\">스미스(Smoki Moto) 및 마크스(Mark's) 스테이크하우스 메뉴 룸서비스 딜리버리, 시그니처 주류 카트</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">케이지 및 자금 운용</td><td style=\"padding: 12px 14px;\">VIP 전용 프라이빗 케이지, 에이전시 특화 신속 송금 및 환전 라인 구축</td></tr><tr><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">컨시어지 인력</td><td style=\"padding: 12px 14px;\">다국어(한국어 포함) 지원 전담 인터내셔널 호스트 및 전속 버틀러 배정</td></tr></tbody></table></div><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-top: 40px; margin-bottom: 16px;\">3. 에이전시 비즈니스 및 VIP 투어를 위한 전략적 가치</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\"><p>[사진2]</p><p>이번 확장은 단순히 럭셔리 공간의 추가를 넘어, <strong>VIP 에이전시 비즈니스의 효율성</strong>을 극적으로 끌어올리는 계기가 됩니다. 마닐라의 극심한 교통 체증과 복잡한 환경에 지친 하이롤러들에게 클락 국제공항(CRK)에서 리조트까지 10분 내에 도달할 수 있는 동선의 쾌적함은 엄청난 메리트입니다. 여기에 한 리조트와 연계된 명문 골프장(썬밸리, 미모사 등) 부킹 우선권이 VIP 살롱 이용객에게 제공되면서, '오전 골프 라운딩 - 오후 프라이빗 게이밍 - 저녁 파인다이닝'으로 이어지는 무결점 의전 사이클을 완성할 수 있게 되었습니다.</p></p><div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; background-color: rgb(255, 250, 240); border-left: 4px solid rgb(221, 107, 32); padding: 20px; border-radius: 4px; margin-bottom: 32px;\"><strong style=\"color: rgb(192, 86, 33); font-size: 16px; display: block; margin-bottom: 8px;\">Expert Insight: 현지 에이전시 운영 관점의 시너지 창출</strong><p style=\"margin: 0px; font-size: 15px; color: rgb(116, 66, 16);\">마닐라 현지에서 에이전시 및 VIP 의전 비즈니스를 운영하는 사업자라면, 이번 클락 한 카지노의 확장을 <strong>포트폴리오 다변화의 핵심 기회</strong>로 삼아야 합니다. 마닐라 엔터테인먼트 시티(오카다, 솔레어 등)의 묵직한 카지노 인프라를 베이스로 유지하되, 골프와 휴식을 병행하고자 하는 클라이언트에게는 클락 한 카지노의 신규 VIP 살롱을 대안으로 제시하는 '투트랙(Two-track) 전략'이 유효합니다. 특히 새롭게 도입된 전용 케이지는 현지 환전 및 자금 융통의 리스크를 줄이고 속도를 높여주므로, 에이전트의 업무 스트레스를 대폭 경감시키는 결정적 인프라가 될 것입니다.</p></div><br><br><hr style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; border-style: solid none none; border-color: rgb(226, 232, 240) currentcolor currentcolor; margin: 36px 0px;\"><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">4. 결론 및 넥스트 스텝 (Action Plan)</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\"><p>[사진3]</p><p>클락 한 카지노 리조트의 신규 VIP 프라이빗 살롱 오픈은 클락이 단순한 골프 데스티네이션을 넘어 아시아 최고 수준의 프리미엄 게이밍 허브로 진화했음을 증명하는 이정표입니다. 글로벌 스탠다드에 부합하는 보안, 공간의 품격, 그리고 에이전트 친화적인 자금 운영 시스템은 필리핀 VIP 투어 시장의 새로운 기준점을 제시하고 있습니다.</p></p><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 24px;\"><strong>Action Plan:</strong> 하이엔드 고객을 모객하는 투어 에이전시 및 VIP 담당자는 지체 없이 한 카지노 리조트의 인터내셔널 마케팅 팀과 컨택하여 신규 살롱에 대한 정킷 롤링 조건 및 콤프(Comp) 정책을 업데이트해야 합니다. 클라이언트에게 마닐라와는 또 다른 결의 쾌적하고 럭셔리한 클락의 새로운 모습을 가장 먼저 제안하여, 의전의 퀄리티와 비즈니스의 성공률을 동시에 높여 보시길 권장합니다.</p><p><br></p><p style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; color: rgb(113, 128, 150); font-size: 14px; margin-bottom: 8px;\"><span style=\"color: rgb(74, 85, 104);\">#클락카지노 #한카지노리조트 #HannCasino #필리핀VIP투어 #클락VIP살롱 #카지노에이전시 #필리핀하이롤러 #클락골프투어</span></p>",
    "viewCount": 817,
    "summary": "클락 최고의 5성급 한 카지노에 최신식 프라이빗 VIP 전용 테이블과 한국인 전용 VIP 라운지가 확장 오픈하였습니다.",
    "date": "2026-08-15",
    "title": "클락 한 카지노 리조트 신규 VIP 프라이빗 살롱 확장 오픈"
  },
  {
    "isPinned": false,
    "thumbnail": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    "images": [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
    ],
    "tags": [
      "입국가이드",
      "eTravel",
      "필리핀여행",
      "마닐라공항"
    ],
    "summary": "필리핀 방문 전 반드시 확인해야 할 전자입국신고서(e-Travel) 작성법, 세관 규정, 무비자 30일 입국 요건 완벽 정리.",
    "category": "공지사항",
    "content": "필리핀 여행 및 출장 전 꼭 확인하셔야 할 최신 출입국 규정을 정리해 드립니다.\n\n1. 여권 유효기간\n- 필리핀 입국일 기준 최소 6개월 이상 유효기간이 남아있는 복수여권이어야 합니다.\n\n2. 전자입국신고서 (e-Travel)\n- 필리핀 도착 72시간 전부터 공식 사이트(etravel.gov.ph)에서 무료로 작성 가능합니다.\n- 오아시스 고객님께는 전담 실장이 e-Travel 대리 등록을 지원해 드리므로 번거로운 입력 없이 QR코드를 받아보실 수 있습니다.\n\n3. 왕복 항공권\n- 필리핀 입국 후 30일 이내에 출국하는 리턴 항공권(또는 제3국행 항공권)이 필수입니다.\n\n4. 외화 반입 규정\n- 미화 10,000 USD 이상 소지 시 입국 시 세관 신고가 필요하며, 현지 페소화는 최대 50,000 PHP까지 소지 가능합니다.\n\n궁금하신 점은 24시간 언제든 오아시스 고객센터로 문의해 주시기 바랍니다.",
    "title": "2026년 최신 필리핀 입국 가이드: e-Travel 사전 등록 및 여권 유효기간 체크리스트",
    "id": "post-4",
    "author": "오아시스 VIP컨시어지",
    "date": "2026-08-10",
    "viewCount": 1658
  },
  {
    "date": "2026-08-05",
    "content": "<div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; background-color: rgb(247, 250, 252); border-left: 4px solid rgb(49, 130, 206); padding: 20px; border-radius: 4px; margin-bottom: 32px;\"><strong style=\"color: rgb(43, 108, 176); font-size: 16px; display: block; margin-bottom: 8px;\">Executive Summary</strong><p style=\"margin: 0px; font-size: 15px; color: rgb(74, 85, 104);\">필리핀의 금융 및 비즈니스 중심지인 보니파시오 글로벌 시티(BGC)는 글로벌 스탠다드에 부합하는 최고급 호스피탈리티와 미식 문화가 집약된 구역입니다. 특히 현지 에이전시 비즈니스, VIP 의전, 하이엔드 네트워킹을 목적으로 마닐라를 방문하는 프리미엄 여행객 및 비즈니스맨에게 BGC의 파인다이닝과 루프탑 라운지는 단순한 식사 공간을 넘어 비즈니스의 성공을 견인하는 핵심 인프라입니다. 본 아티클에서는 BGC 내에서 가장 권위 있고 차별화된 경험을 제공하는 5대 프리미엄 베뉴의 콘셉트, 시그니처 메뉴, 공간 스펙을 심층 분석합니다.</p></div><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 24px;\">마닐라 내에서도 독보적인 치안 수준과 현대적인 도시 계획을 자랑하는 BGC(Bonifacio Global City)는 다국적 기업의 헤드쿼터와 글로벌 호텔 체인이 밀집해 있습니다. 이러한 지리적, 경제적 특성은 자연스럽게 하이엔드 미식 문화의 발달로 이어졌습니다. 성공적인 비즈니스 미팅이나 프라이빗한 VIP 접대를 기획하고 있다면, 각 베뉴가 지닌 고유의 분위기와 서비스 디테일을 정확히 파악하여 목적에 맞는 최적의 공간을 선정하는 전략적 접근이 필요합니다.</p><hr style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; border-style: solid none none; border-color: rgb(226, 232, 240) currentcolor currentcolor; margin: 36px 0px;\"><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">1. BGC를 대표하는 하이엔드 파인다이닝 3선</h2><p>[사진1]</p><p>BGC의 파인다이닝 씬(Scene)은 필리핀 현지 식재료를 혁신적으로 재해석한 컨템포러리 퀴진부터, 극강의 퀄리티를 자랑하는 프리미엄 스테이크하우스까지 폭넓은 스펙트럼을 자랑합니다.</p><h3 style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 19px; color: rgb(74, 85, 104); margin-top: 24px; margin-bottom: 12px;\">갤러리 바이 첼레 (Gallery by Chele) : 아시아 베스트 레스토랑의 품격</h3><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">필리핀 파인다이닝의 수준을 한 단계 끌어올렸다고 평가받는 '갤러리 바이 첼레'는 스페인 출신 셰프 첼레 곤잘레스(Chele Gonzalez)가 이끄는 컨템포러리 레스토랑입니다. 아시아 베스트 레스토랑 50에 꾸준히 이름을 올리는 이곳은, 필리핀 전역에서 공수한 토착 식재료에 현대적인 조리 기법을 접목한 혁신적인 테이스팅 메뉴를 선보입니다. 식문화에 조예가 깊은 클라이언트나 창의적인 영감이 필요한 비즈니스 미팅에 최적화된 공간으로, 우드 톤의 따뜻하고 세련된 인테리어가 돋보입니다.</p><p>[사진2]</p><p><br></p><br><h3 style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 19px; color: rgb(74, 85, 104); margin-top: 24px; margin-bottom: 12px;\">와규 스튜디오 (Wagyu Studio) : VVIP를 위한 극강의 육류 미식 경험</h3><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">최상급 일본산 와규를 전문으로 다루는 '와규 스튜디오'는 BGC 내에서도 가장 예약이 어렵고 프라이빗한 하이엔드 베뉴 중 하나입니다. 고베, 마츠사카 등 일본 최고의 산지에서 직수입한 A5 등급 와규만을 엄선하여, 야키니쿠와 혁신적인 타파스 형태로 제공합니다. 셰프의 정교한 퍼포먼스를 눈앞에서 감상할 수 있는 라이브 키친 카운터와 완벽하게 독립된 프라이빗 다이닝 룸(PDR)을 갖추고 있어, 보안과 프라이버시가 절대적으로 요구되는 최고위급 인사 접대 및 밀도 높은 네트워킹에 완벽히 부합합니다.</p><h3 style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 19px; color: rgb(74, 85, 104); margin-top: 24px; margin-bottom: 12px;\">레이징 불 찹하우스 &amp; 바 (Raging Bull Chophouse &amp; Bar) : 클래식과 마초적 우아함</h3><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">샹그릴라 더 포트(Shangri-La The Fort) 내에 위치한 '레이징 불'은 클래식한 미국식 스테이크하우스의 정수를 보여줍니다. 1960년대 뉴욕 맨해튼의 레트로한 럭셔리를 연상시키는 딥 우드와 레더 소재의 인테리어가 압도적인 무게감을 줍니다. 세계 각국에서 공수한 프리미엄 드라이 에이징 소고기를 맞춤형 그릴에서 구워내며, 방대한 빈티지 와인 리스트와 시그니처 칵테일 페어링을 지원합니다. 격식 있는 만찬이나 성공적인 계약 체결을 축하하는 자리에 가장 어울리는 정통 다이닝 베뉴입니다.</p><p>[사진3]</p><br><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">2. 화려한 야경과 네트워킹의 중심, 최고급 루프탑 라운지 2선</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">마닐라의 열대 기후와 BGC의 스카이라인이 빚어내는 환상적인 야경은 루프탑 라운지에서 그 진가를 발휘합니다. 식사 후 분위기를 전환하거나 가벼운 주류와 함께 심도 있는 비즈니스 대화를 이어가기에 최적의 인프라입니다.</p><h3 style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 19px; color: rgb(74, 85, 104); margin-top: 24px; margin-bottom: 12px;\">더 피크 (The Peak) : 그랜드 하얏트 마닐라 최상층의 압도적 뷰</h3><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">필리핀 최고층 빌딩인 그랜드 하얏트 마닐라의 60층부터 62층까지 자리 잡고 있는 '더 피크'는 그릴 레스토랑, 스피크이지 바, 위스키 라운지가 결합된 다층적 복합 엔터테인먼트 공간입니다. 마닐라 베이와 메트로 마닐라 전역을 360도로 조망할 수 있는 스카이라인 뷰는 타의 추종을 불허합니다. 고급스러운 재즈 라이브 공연과 함께 희귀 위스키 셀렉션을 즐길 수 있어, 마닐라 VIP 에이전시들이 중요 클라이언트에게 반드시 선보이는 필수 코스로 자리매김했습니다.</p><h3 style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 19px; color: rgb(74, 85, 104); margin-top: 24px; margin-bottom: 12px;\">스트레이트 업 (Straight Up) : 세다 BGC의 세련된 도심 속 오아시스</h3><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">세다(Seda) BGC 호텔 최상층에 위치한 '스트레이트 업'은 너무 무겁지 않으면서도 세련된 칠아웃(Chill-out) 분위기를 연출하는 루프탑 바입니다. 하이파이(Hi-Fi) 사운드 시스템을 통해 흐르는 감각적인 하우스 음악과 시그니처 타파스, 그리고 하이 스트리트(High Street)가 내려다보이는 탁 트인 전망이 조화를 이룹니다. 캐주얼한 네트워킹 믹서(Mixer) 행사나, 현지 비즈니스 파트너와의 가벼운 친목 도모를 위한 애프터 파티 장소로 훌륭한 대안을 제시합니다.</p><p><br></p><hr style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; border-style: solid none none; border-color: rgb(226, 232, 240) currentcolor currentcolor; margin: 36px 0px;\"><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">3. 5대 프리미엄 베뉴 핵심 스펙 브리핑 테이블</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">효율적인 동선 기획과 목적에 맞는 베뉴 선정을 위해 각 공간의 핵심 가치와 스펙을 한눈에 비교할 수 있는 데이터입니다.</p><div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; overflow-x: auto; margin-bottom: 28px;\"><div class=\"oasis-table-wrap overflow-x-auto my-3 max-w-full\"><table style=\"width: 860px; font-size: 14px; border-color: rgb(226, 232, 240);\" class=\"oasis-table min-w-full border-collapse border border-slate-300 rounded-xl overflow-hidden text-sm\"><thead><tr style=\"background-color: rgb(237, 242, 247); border-bottom: 2px solid rgb(203, 213, 224);\"><th style=\"padding: 12px 14px;\">베뉴명 (Venue)</th><th style=\"padding: 12px 14px;\">구분</th><th style=\"padding: 12px 14px;\">시그니처 경험</th><th style=\"padding: 12px 14px;\">최적 활용 목적</th><th style=\"padding: 12px 14px;\">프라이빗 룸(PDR)</th></tr></thead><tbody><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">갤러리 바이 첼레</td><td style=\"padding: 12px 14px;\">파인다이닝</td><td style=\"padding: 12px 14px;\">혁신적인 필리핀 로컬 식재료 테이스팅</td><td style=\"padding: 12px 14px;\">크리에이티브 미팅, 글로벌 비즈니스 만찬</td><td style=\"padding: 12px 14px;\">보유 (사전 예약 필수)</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">와규 스튜디오</td><td style=\"padding: 12px 14px;\">프리미엄 야키니쿠</td><td style=\"padding: 12px 14px;\">최상급 일본산 A5 와규 라이브 퍼포먼스</td><td style=\"padding: 12px 14px;\">VVIP 한정 접대, 극강의 프라이빗 네트워킹</td><td style=\"padding: 12px 14px;\">보유 (매우 제한적 운영)</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">레이징 불</td><td style=\"padding: 12px 14px;\">스테이크하우스</td><td style=\"padding: 12px 14px;\">드라이 에이징 스테이크와 빈티지 와인</td><td style=\"padding: 12px 14px;\">격식 있는 비즈니스 만찬, 계약 축하 연회</td><td style=\"padding: 12px 14px;\">보유</td></tr><tr style=\"border-bottom: 1px solid rgb(226, 232, 240);\"><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">더 피크</td><td style=\"padding: 12px 14px;\">루프탑 라운지/바</td><td style=\"padding: 12px 14px;\">초고층 360도 스카이라인 뷰, 프리미엄 위스키</td><td style=\"padding: 12px 14px;\">야간 VIP 의전 코스, 분위기 전환형 2차 미팅</td><td style=\"padding: 12px 14px;\">VIP 살롱 보유</td></tr><tr><td style=\"padding: 12px 14px; font-weight: 600; background-color: rgb(247, 250, 252);\">스트레이트 업</td><td style=\"padding: 12px 14px;\">루프탑 바</td><td style=\"padding: 12px 14px;\">트렌디한 하우스 뮤직과 개방감 있는 테라스</td><td style=\"padding: 12px 14px;\">캐주얼 네트워킹, 파트너십 친목 도모</td><td style=\"padding: 12px 14px;\">단독 대관 구역 지원</td></tr></tbody></table></div></div><div style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; background-color: rgb(255, 250, 240); border-left: 4px solid rgb(221, 107, 32); padding: 20px; border-radius: 4px; margin-bottom: 32px;\"><strong style=\"color: rgb(192, 86, 33); font-size: 16px; display: block; margin-bottom: 8px;\">Expert Insight: VIP 의전 및 비즈니스 네트워킹 성공 전략</strong><p style=\"margin: 0px; font-size: 15px; color: rgb(116, 66, 16);\">마닐라의 하이엔드 다이닝은 엄격한 드레스 코드(스마트 캐주얼 이상, 슬리퍼 및 반바지 입장 불가)를 요구하는 경우가 많으므로 의전 시 클라이언트에게 사전 안내가 필수적입니다. 또한, '와규 스튜디오'나 '갤러리 바이 첼레'와 같은 인기 파인다이닝은 최소 2~3주 전 예약이 마감되므로, 로컬 에이전시 업무나 중요한 비즈니스 미팅 일정이 확정되는 즉시 프라이빗 룸(PDR)을 선점하는 것이 리스크를 최소화하는 핵심 전략입니다. 식사 후 이동 동선을 고려해 도보 이동이 가능한 BGC 내 루프탑 라운지를 연계하여 기획한다면 최상의 만족도를 이끌어낼 수 있습니다.</p></div><hr style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: medium; border-style: solid none none; border-color: rgb(226, 232, 240) currentcolor currentcolor; margin: 36px 0px;\"><h2 style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; font-size: 24px; margin-bottom: 16px;\">4. 결론 및 넥스트 스텝 (Action Plan)</h2><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 20px;\">마닐라 BGC의 파인다이닝과 루프탑 라운지는 아시아 최고의 호스피탈리티 기준을 충족하며, 단순한 미식을 넘어 강력한 비즈니스 무기로 작용합니다. 고급스러운 식재료, 완벽하게 통제된 프라이버시, 그리고 마닐라의 환상적인 스카이라인은 그 어떤 회의실보다 훌륭한 협상의 장을 제공합니다.</p><p style=\"color: rgb(45, 55, 72); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; margin-bottom: 24px;\">성공적인 투어 및 비즈니스를 준비하고 계신다면, 동반자의 성향(격식 vs 트렌디)과 모임의 목적(계약 체결 vs 친목 도모)을 세밀하게 분석하여 위에서 제시한 5대 베뉴 중 가장 적합한 조합을 선택하십시오. 완벽하게 기획된 다이닝 경험은 마닐라에서의 비즈니스 성공 확률을 비약적으로 높여줄 것입니다.</p><p>[사진4]</p><br><p><br></p><p style=\"font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif; color: rgb(113, 128, 150); font-size: 14px; margin-bottom: 8px;\"><span style=\"color: rgb(74, 85, 104);\">#마닐라BGC #마닐라파인다이닝 #마닐라루프탑라운지 #비즈니스네트워킹 #VIP의전 #마닐라럭셔리투어 #갤러리바이첼레 #더피크</span></p>",
    "viewCount": 678,
    "summary": "필리핀의 맨해튼이라 불리는 BGC 보니파시오의 최상급 스테이크하우스, 미슐랭 파인다이닝, 야경 루프탑 바 가이드.",
    "mapLocation": null,
    "category": "VIP매거진",
    "images": [
      "/images/posts/post-5-img-1.webp",
      "/images/posts/post-5-img-2.webp",
      "/images/posts/post-5-img-3.webp",
      "/images/posts/post-5-img-4.webp"
    ],
    "id": "post-5",
    "author": "오아시스 라이프스타일",
    "title": "마닐라 BGC 하이엔드 다이닝 & 루프탑 라운지 BEST 5",
    "isPinned": false,
    "thumbnail": "/images/posts/post-5-thumb.webp",
    "tags": [
      "BGC",
      "파인다이닝",
      "미식투어",
      "마닐라야경"
    ]
  },
  {
    "id": "post-7",
    "category": "프로모션",
    "title": "2026 뉴포트 월드 & 마닐라 COD 카지노 롤링 1.5% 및 항공권 바우처 특별 프로모션",
    "author": "오아시스 마케팅팀",
    "date": "2026-07-15",
    "viewCount": 920,
    "isPinned": false,
    "summary": "뉴포트 월드 리조트(구 리조트월드 마닐라) 및 시티오브드림(COD) 하이리밋 살롱 회원 전용 롤링 혜택 및 왕복 비즈니스 항공권 페이백 안내.",
    "content": "[크기:대][굵게]2026 하반기 뉴포트 월드 & COD 프리미엄 프로모션[/굵게][/크기]\n\n오아시스 VIP 에이전시에서 마닐라 공항 인근 최상의 인프라를 자랑하는 **뉴포트 월드 리조트(Newport World Resorts)** 및 **시티 오브 드림(City of Dreams Manila)** 특별 프로모션을 진행합니다.\n\n[크기:중][굵게]■ 프로모션 주요 혜택[/굵게][/크기]\n- 롤링 커미션 최대 1.5% 즉시 지급 (게임 종료 즉시 정산)\n- 왕복 비즈니스 항공권 바우처 100% 실비 지원\n- 뉴포트 메리어트 / 힐튼 / 오쿠라 / 쉐라톤 최상급 호텔 무료 숙박 바우처\n- 공항 NAIA 터미널3 육교 연결 초근접 이동 의전 지원\n\n> \"출입국이 가장 편리한 뉴포트 월드에서 오아시스만의 프라이빗한 케어를 경험해 보세요.\"\n\n[지도:뉴포트 월드 리조트 마닐라]\n\n자세한 참가 기준 및 롤링 조건은 24시간 오아시스 공식 메신저로 문의해 주시기 바랍니다.",
    "thumbnail": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp",
    "images": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fm=webp&fit=crop&w=800&q=80"
    ],
    "tags": [
      "뉴포트월드",
      "COD",
      "프로모션",
      "롤링혜택",
      "마닐라호텔"
    ]
  },
  {
    "id": "post-8",
    "category": "VIP매거진",
    "title": "[VIP 투어] 클락 한 카지노 리조트(Hann) & 스위소텔 최상급 럭셔리 스테이 가이드",
    "author": "오아시스 클락지사",
    "date": "2026-07-02",
    "viewCount": 840,
    "isPinned": false,
    "summary": "클락 경제자유구역 최고의 럭셔리 복합리조트 한(Hann) 카지노와 메리어트/스위소텔 5성급 스위트룸, 최고급 부대시설 완벽 가이드.",
    "content": "[크기:대][굵게]클락의 새로운 랜드마크, 한 카지노 리조트(Hann Resort)[/굵게][/크기]\n\n필리핀 클락(Clark)의 중심부에 위치한 **한 카지노 리조트(Hann Casino Resort)**는 세계적인 호텔 체인 메리어트(Marriott)와 스위소텔(Swissôtel)이 입점한 초대형 하이엔드 복합리조트입니다.\n\n[크기:중][굵게]1. 최고급 VIP 게이밍 살롱[/굵게][/크기]\n- 쾌적하고 넓은 실내 공간과 최신식 바카라, 블랙잭, 룰렛 테이블\n- 프라이빗 하이리밋 전용 VIP 정켓 룸 완비\n- 한국인 전담 매니저의 신속한 바이인 및 정산 시스템\n\n[크기:중][굵게]2. 5성급 럭셔리 숙박 인프라[/굵게][/크기]\n- 스위소텔 클락(Swissôtel Clark) 프리미엄 스위트룸 전경\n- 알프스 스타일의 최고급 스파(Pürovel Spa & Sport) 및 인피니티 풀\n- 15개 이상의 글로벌 고메 레스토랑 & 와인 바\n\n[지도:한 카지노 리조트 클락]\n\n오아시스 고객님께는 전 일정 무료 숙박 및 클락 공항 단독 리무진 픽업이 제공됩니다.",
    "thumbnail": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp",
    "images": [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fm=webp&fit=crop&w=800&q=80"
    ],
    "tags": [
      "클락한카지노",
      "스위소텔",
      "클락VIP",
      "럭셔리호텔"
    ]
  },
  {
    "id": "post-9",
    "category": "공지사항",
    "title": "오아시스 공식 24시간 프라이빗 텔레그램 채널 보안 인증 절차 안내",
    "author": "오아시스 보안관제팀",
    "date": "2026-06-20",
    "viewCount": 1680,
    "isPinned": false,
    "summary": "VIP 고객님의 안전한 소통과 사칭 방지를 위한 24시간 공식 텔레그램 1:1 상담 채널 정식 인증 확인 안내입니다.",
    "content": "[크기:대][굵게]오아시스 공식 메신저 보안 인증 안내[/굵게][/크기]\n\n항상 오아시스 공식 에이전트를 이용해 주시는 VIP 회원님들께 깊은 감사를 드립니다.\n최근 오아시스 에이전시를 사칭하는 불법 피싱 채널이 발생하고 있어, 회원님들의 소중한 자산과 개인정보 보호를 위한 공식 확인 절차를 안내해 드립니다.\n\n[크기:중][굵게]■ 오아시스 정식 인증 메신저 안내[/굵게][/크기]\n- **공식 텔레그램 채널**: @oasis_official_agent (아이디 철자 확인 필수)\n- **공식 웹사이트**: 본 공식 플랫폼 우측 상단 및 하단 버튼을 통해서만 연결\n- **공식 계좌 확인**: 유선 통화 또는 전담 실장의 정식 인증 후에만 진행\n\n[형광펜]※ 오아시스는 어떠한 경우에도 비공식 개인 메신저로 선입금을 유도하지 않습니다.[/형광펜]\n\n모든 고객님의 안전과 비밀 보장을 위해 24시간 보안 모니터링을 상시 가동하고 있습니다. 의심스러운 메시지를 받으셨을 경우 즉시 공식 채널로 제보해 주시기 바랍니다.",
    "thumbnail": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fm=webp&fit=crop&w=600&q=75&ext=.webp",
    "images": [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fm=webp&fit=crop&w=800&q=80"
    ],
    "tags": [
      "보안공지",
      "공식텔레그램",
      "사칭주의",
      "고객보호"
    ]
  }
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: '이용 및 예약',
    question: '오아시스 공식 에이전트 서비스는 누구나 이용할 수 있나요?',
    answer: '네, 필리핀 마닐라 또는 클락 카지노 방문 및 5성급 호텔 숙박, VIP 골프 투어를 계획하시는 만 18세 이상 성인 고객이라면 누구나 이용 가능합니다. 24시간 카카오톡이나 텔레그램으로 일정과 성향을 말씀해 주시면 맞춤 플랜을 안내해 드립니다.',
  },
  {
    id: 'faq-2',
    category: '호텔 및 항공',
    question: '5성급 호텔(오카다, 솔레어, 한 등) 무료 숙박 혜택은 어떤 조건인가요?',
    answer: '고객님의 예상 이용 규모 및 멤버십 실적 기준에 따라 최상급 스위트룸 및 일반 5성급 객실이 전액 무료 지원(Complimentary) 또는 특별 회원 요율로 제공됩니다. 사전 상담을 통해 투명하게 기준을 사전 안내해 드립니다.',
  },
  {
    id: 'faq-3',
    category: '공항 및 의전',
    question: '공항 도착 시 픽업 및 패스트트랙은 어떻게 진행되나요?',
    answer: '마닐라(NAIA) 또는 클락(CRK) 공항 도착 전담 의전팀이 비행기 게이트 앞 또는 입국 심사대 앞에서 네임보드를 들고 대기합니다. 신속한 VIP 라인을 통해 입국 수속을 마친 후 대기 중인 최고급 단독 리무진(알파드/스타리아)으로 호텔까지 다이렉트 이동합니다.',
  },
  {
    id: 'faq-4',
    category: '보안 및 정산',
    question: '정산 과정과 개인정보 보안은 어떻게 유지되나요?',
    answer: '오아시스는 10년 무사고 원칙으로 운영되며, 게임 종료 즉시 고객님께서 원하시는 통화(원화, 페소, 달러 등)로 1원 단위까지 투명하게 실시간 정산해 드립니다. 고객님의 모든 개인정보와 방문 내역은 출국 즉시 영구 파기되어 100% 안심하실 수 있습니다.',
  },
  {
    id: 'faq-5',
    category: 'VIP 컨시어지',
    question: '현지 체류 시 VIP 전담 컨시어지 케어는 어떻게 진행되나요?',
    answer: '현지 전담 한국인 실장이 24시간 상주하여 계신 VIP 살롱 및 전용 라운지에서 모든 맞춤 편의 서비스를 대행해 드립니다. 불필요하게 대기하실 필요 없이 편안하게 품격 있는 휴식과 VIP 서비스에만 집중하실 수 있습니다.',
  },
];

export const initialInquiryLeads: InquiryLead[] = [
  {
    id: 'inq-1',
    name: '김*호 VIP',
    contactType: 'telegram',
    contactValue: '@kim_vip_77',
    targetRegion: '마닐라 (오카다/솔레어)',
    expectedDate: '2026-09-05 ~ 2026-09-08 (3박 4일)',
    message: '오카다 스위트룸 3박 예약 및 공항 알파드 픽업 신청합니다. 3인 동행 예정입니다.',
    createdAt: '2026-08-26 14:20',
    status: '상담완료',
  },
  {
    id: 'inq-2',
    name: '이*준 VIP',
    contactType: 'kakao',
    contactValue: 'kakao_lee789',
    targetRegion: '클락 (한 카지노 + 골프 36홀)',
    expectedDate: '2026-09-12 ~ 2026-09-15 (3박 4일)',
    message: '클락 메리어트 또는 스위소텔 숙박과 미모사/썬밸리 골프 2회 라운딩 패키지 견적 문의드립니다.',
    createdAt: '2026-08-26 11:05',
    status: '상담진행중',
  },
  {
    id: 'inq-3',
    name: '박*훈 VIP',
    contactType: 'phone',
    contactValue: '010-4821-****',
    targetRegion: '마닐라 (솔레어 VIP 정켓)',
    expectedDate: '2026-09-01 ~ 2026-09-04',
    message: '솔레어 하이리밋 살롱 프라이빗 룸 이용 롤링 조건 및 항공권 바우처 지원 상담 원합니다.',
    createdAt: '2026-08-26 09:30',
    status: '접수대기',
  },
];
