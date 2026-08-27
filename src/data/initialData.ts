import { SiteConfig, BannerSlide, CasinoItem, PhilippineTourSpot, ServiceStep, PostItem, FAQItem, InquiryLead } from '../types';
import oasisHeroBg from '../assets/images/oasis_gold_hero_1787791853858.jpg';
import casinoPanoramicBg from '../assets/images/casino_table_panoramic_1787791869633.jpg';
import aboutAccreditationImg from '../assets/images/oasis_accreditation_about_1787793248317.jpg';

export const initialSiteConfig: SiteConfig = {
  siteName: '오아시스 공식 에이전트',
  subTitle: 'OASIS OFFICIAL VIP AGENCY',
  pointColor: '#30308A',
  fontFamily: 'Pretendard',
  kakaoId: 'oasis_vip77',
  kakaoUrl: 'https://open.kakao.com/o/oasis_vip',
  telegramId: '@oasis_official_agent',
  telegramUrl: 'https://t.me/oasis_official_agent',
  phoneNumber: '+63 917 123 4567 (현지) / 070-8098-7788 (인터넷전화)',
  email: 'vip@oasis-agent.com',
  operatingHours: '24시간 365일 연중무휴 VIP 컨시어지 데스크 운영',
  seoTitle: '오아시스 공식 에이전트 | 마닐라 & 클락 카지노 VIP 전문 에이전시',
  seoDescription: '필리핀 마닐라 오카다, 솔레어, 시티오브드림즈, 클락 한 카지노 VIP 정켓 공식 에이전트. 5성급 호텔 무료 숙박 지원, 공항 패스트트랙, 전용 의전 세단, 24시간 한국인 1:1 케어.',
  seoKeywords: '오아시스 에이전트, 필리핀 카지노, 마닐라 카지노, 클락 카지노, 오카다 마닐라, 솔레어 카지노, VIP 정켓, 필리핀 골프투어, 카지노 에이전시',
  bannerTitle: '신뢰와 품격의 최고봉, 필리핀 No.1 공식 VIP 에이전트',
  bannerSubtitle: '마닐라 & 클락 메이저 복합리조트 VIP 혜택과 24시간 프라이빗 1:1 전담 의전 서비스를 경험하십시오.',
  bannerBadge: 'OFFICIAL CERTIFIED VIP AGENCY',
  companyAddress: 'OASIS TOWER 18F, Entertainment City, Parañaque, Metro Manila, Philippines',
  representative: '강태진 대표 디렉터',
  licenseNumber: 'PAGCOR · GAB · PCSO Official Certified VIP Agency',

  // About Oasis Section Config
  aboutBadge: 'ABOUT OASIS AGENT',
  aboutTitle: 'PAGCOR · GAB · PCSO 필리핀 정부 공인\n13년 현지 직영 VIP 공식 에이전트',
  aboutSubtitle: '오아시스는 필리핀 정부 산하 PAGCOR, GAB, PCSO 정식 공인 에이전트로서 마닐라 및 클락 메이저 카지노 복합리조트와 직통 파트너십을 맺고 13년간 축적된 압도적인 현지 직영 케어 솔루션을 제공합니다.',
  aboutStoryHeading: '“13년의 현지 운영 노하우, 완벽한 현지 밀착 케어로 완성합니다”',
  aboutStoryParagraph1: '오아시스 공식 에이전트는 2011년 설립 이래 13년간 필리핀 현지에서 직접 상주하며 단 한 건의 사고 없는 무결점 VIP 운영을 고수해 왔습니다. 필리핀 정부 게이밍 규제기관(PAGCOR), 필리핀 경기감독위원회(GAB), 필리핀 자선복권공사(PCSO)와의 공식 파트너십을 통해 법적 리스크 없는 100% 안전한 여정을 보장합니다.',
  aboutStoryParagraph2: '단순한 중개를 넘어 마닐라(오카다, 솔레어, 시티오브드림즈) 및 클락(한 카지노, 디하이츠, 로이스) 현지 법인 인프라를 바탕으로, 공항 VIP 패스트트랙 입국부터 최고급 의전 차량, 5성급 스위트룸 무료 바우처, 전담 한국인 매니저의 24시간 현지 밀착 케어까지 원스톱으로 책임집니다.',
  aboutStoryHighlight: '■ 오아시스 핵심 보증: PAGCOR · GAB · PCSO 정부 부처 공인 정식 라이센스 보유 | 13년 무사고 신뢰 | 100% 실시간 투명 전산 정산 | 완벽한 1:1 고객 프라이버시 보호',
  aboutImageUrl: aboutAccreditationImg,
  aboutLicenseTitle: '필리핀 정부기관 공식 승인 에이전시',
  aboutLicenseSub: 'PAGCOR · GAB · PCSO Official Registered Agency',
  aboutYearsExperience: '13년 현지 직영',
  aboutStat1Num: '13+',
  aboutStat1Label: '년 현지 직영 VIP 운영',
  aboutStat2Num: '100%',
  aboutStat2Label: 'PAGCOR·GAB·PCSO 정부공인',
  aboutStat3Num: '20,000+',
  aboutStat3Label: '누적 VIP 고객 현지 케어',
  aboutStat4Num: '24 / 7',
  aboutStat4Label: '한국인 베테랑 현지 상주',

  // Casino Section Config
  casinoBadge: 'MAJOR CASINO & VIP RESORTS',
  casinoTitle: '필리핀 메이저 카지노 공식 제휴 라인업',
  casinoSubtitle: '오아시스가 엄선한 마닐라 & 클락 최고급 5성급 복합 리조트 카지노를 소개합니다.\n스위트룸 무료 숙박 및 프라이빗 VIP 살롱 혜택을 즉시 누려보세요.',

  // Philippines Section Config
  philippinesBadge: 'PHILIPPINES VIP TRAVEL & GOLF',
  philippinesTitle: '필리핀 VIP 라이프스타일 & 여행 가이드',
  philippinesSubtitle: '화려한 마닐라의 도심 라이프와 클락의 여유로운 명문 골프 코스까지,\n오아시스가 엄선한 프리미엄 필리핀 투어 정보를 안내해 드립니다.',
};

export const initialBannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    title: '필리핀 메이저 카지노 공식 VIP 에이전트',
    subtitle: '오카다 · 솔레어 · COD · 클락 한 카지노 공식 파트너 | 차원이 다른 프리미엄 혜택과 투명한 정산 보증',
    badge: 'PAGCOR OFFICIAL CERTIFIED VIP AGENCY',
    bgImage: oasisHeroBg,
  },
  {
    id: 'slide-2',
    title: '24시간 퍼스트클래스 전담 컨시어지 케어',
    subtitle: '공항 VIP 패스트트랙 입국, 최고급 전용 리무진 픽업, 5성급 스위트룸 전액 지원',
    badge: '24/7 DEDICATED PRIVATE CONCIERGE',
    bgImage: casinoPanoramicBg,
  },
];

export const initialCasinos: CasinoItem[] = [
  {
    id: 'okada-manila',
    name: '오카다 마닐라',
    englishName: 'Okada Manila Resort & Casino',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    description: '아시아 최대 규모의 복합 엔터테인먼트 리조트로, 환상적인 분수 쇼와 럭셔리 스위트 객실, 최고급 VIP 전용 정켓 룸을 보유하고 있습니다.',
    features: ['세계 최대 규모 멀티컬러 분수 쇼', '993개 전 객실 특급 스위트 구성', '프라이빗 VIP 하이리밋 살롱 보유', '미슐랭 스타 다이닝 및 실내 비치클럽 코브(Cove)'],
    tableGames: '바카라, 블랙잭, 룰렛, 포커 (500+ 테이블)',
    vipRooms: '최고급 프라이빗 VIP 정켓 살롱 (1:1 딜러 배정 가능)',
    hotelRating: '5성급 럭셔리 호텔 (Forbes 5-Star)',
    highlights: 'VIP 회원 전용 스위트룸 무료 업그레이드 및 롤링 보너스 제공',
    isFeatured: true,
  },
  {
    id: 'solaire-resort',
    name: '솔레어 리조트 & 카지노',
    englishName: 'Solaire Resort & Casino Manila',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    description: '마닐라 베이의 아름다운 일몰을 조망하는 필리핀 최초의 통합 럭셔리 리조트로, 최상의 보안과 격조 높은 VIP 서비스를 자랑합니다.',
    features: ['마닐라 베이 오션뷰 파노라마 전경', '포브스 8년 연속 5성급 획득', '명품 부티크 거리(루이비통, 구찌 등) 입점', '세계 최고 권위의 셰프 레스토랑'],
    tableGames: '바카라, 폰툰, 텍사스 홀덤 등 (400+ 테이블)',
    vipRooms: '솔레어 클럽 전용 하이리밋 룸 및 단독 VIP 룸',
    hotelRating: '5성급 특급 호텔 (Forbes 5-Star Travel Guide)',
    highlights: '공항 10분 거리 전용 픽업 의전 및 맞춤형 VIP 다이닝 크레딧 제공',
    isFeatured: true,
  },
  {
    id: 'city-of-dreams',
    name: '시티 오브 드림즈 마닐라 (COD)',
    englishName: 'City of Dreams Manila',
    region: 'manila',
    regionLabel: '마닐라 엔터테인먼트 시티',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    description: '노부 호텔, 하얏트, 누와 호텔 3개의 세계적 5성급 호텔이 결합된 초대형 랜드마크로 모던하고 트렌디한 VIP 카지노 환경을 제공합니다.',
    features: ['3대 럭셔리 호텔 브랜드 집약', '드림플레이 테마파크 & 고급 라운지', '최첨단 전자 게이밍 및 라이브 바카라', '황금빛 돔 구조의 상징적 건축미'],
    tableGames: 'VIP 라이브 바카라, 룰렛, 다이사이 등 (300+ 테이블)',
    vipRooms: '누와 클럽 & Signature VIP 라운지',
    hotelRating: '5성급 (Nüwa, Nobu, Hyatt Regency)',
    highlights: '오아시스 고객 전담 캐셔 패스트트랙 및 식음료 무제한 바우처',
    isFeatured: false,
  },
  {
    id: 'newport-world-resorts',
    name: '뉴포트 월드 리조트',
    englishName: 'Newport World Resorts (구 리조트 월드 마닐라)',
    region: 'manila',
    regionLabel: '마닐라 공항 제3터미널 맞은편',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    description: '마닐라 국제공항 바로 앞에 위치하여 뛰어난 접근성을 자랑하며, 메리어트, 쉐라톤, 힐튼 등 글로벌 체인 호텔과 연결된 전통의 명문 카지노입니다.',
    features: ['마닐라 공항 3터미널 도보 브릿지 연결(Runway Manila)', '글로벌 특급 호텔 5개 결합 단지', '대형 쇼핑몰 및 뮤지컬 극장 보유', '24시간 활기찬 엔터테인먼트 시설'],
    tableGames: '바카라, 룰렛, 캐리비안 스터드 포커 등',
    vipRooms: '맥심 VIP 클럽 & 겐팅 클럽',
    hotelRating: '5성급 복합 (Marriott, Sheraton, Hilton, Okura)',
    highlights: '단기 체류 고객을 위한 초고속 공항 픽업/샌딩 최적화',
    isFeatured: false,
  },
  {
    id: 'hann-casino-clark',
    name: '한 카지노 리조트 클락',
    englishName: 'Hann Casino Resort Clark',
    region: 'clark',
    regionLabel: '클락 경제자유구역 (Clark Freeport Zone)',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    description: '클락 최고의 최신식 5성급 복합 리조트로, 메리어트 호텔 & 스위소텔과 직결되어 쾌적하고 안전한 최고급 게이밍 환경을 제공합니다.',
    features: ['클락 최대 규모 최신식 5성급 시설', '스위소텔 & 클락 메리어트 호텔 직통 연결', '주변 명문 골프장 10분 이내 위치', '최고 수준의 치안 및 프라이버시 보장'],
    tableGames: '최신 전자 테이블 & VIP 전용 바카라 테이블',
    vipRooms: 'Hann VIP 전용 살롱 (한국인 전담 매니저 상주)',
    hotelRating: '5성급 럭셔리 (Swissôtel / Marriott)',
    highlights: '클락 골프투어 패키지 연계 및 스위트룸 무료 숙박 지원',
    isFeatured: true,
  },
  {
    id: 'dheights-clark',
    name: '디하이츠 리조트 & 카지노',
    englishName: "D'Heights Resort and Casino Clark",
    region: 'clark',
    regionLabel: '클락 몬테레이 힐스',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    description: '클락의 수려한 자연경관 속에 위치한 프리미엄 리조트로, 썬밸리 골프장과 인접하여 여유로운 힐링과 고품격 게이밍을 동시에 만끽할 수 있습니다.',
    features: ['자연 친화적 힐튼 호텔 직결', '36홀 클락 썬밸리 CC 바로 인접', '조용하고 프라이빗한 VIP 정켓 환경', '가족 및 비즈니스 동반 최적화 리조트'],
    tableGames: '바카라, 블랙잭, 슬롯 머신 등',
    vipRooms: '프라이빗 VIP 살롱 룸 완비',
    hotelRating: '5성급 힐튼 리조트 (Hilton Clark Sun Valley)',
    highlights: '골프 라운딩 + VIP 의전 결합 올인원 서비스',
    isFeatured: false,
  },
];

export const initialPhilippineSpots: PhilippineTourSpot[] = [
  {
    id: 'spot-1',
    category: 'hotel',
    title: '마닐라 베이 5성급 럭셔리 스위트 호텔',
    subtitle: '오카다 / 솔레어 / 그랜드 하얏트 BGC',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: '오아시스 VIP 고객님께는 최고급 오션뷰 및 스위트 객실 무료 지원 또는 특별 프로모션 요율을 적용해 드립니다.',
    tags: ['5성급 호텔', '스위트룸 무료지원', '오션뷰', '24시간 룸서비스'],
    location: 'Metro Manila',
  },
  {
    id: 'spot-2',
    category: 'golf',
    title: '클락 & 마닐라 명문 프라이빗 골프 투어',
    subtitle: '미모사 골프클럽 / 클락 썬밸리 CC / FA코리아 CC',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    description: '필리핀 최고의 잔디 컨디션을 자랑하는 PGA급 코스에서 1:1 캐디 및 전용 카트, 패스트 부킹 혜택을 제공합니다.',
    tags: ['명문 골프장', 'PGA 36홀', 'VIP 티오프 우선예약', '클럽하우스 의전'],
    location: 'Clark / Angeles',
  },
  {
    id: 'spot-3',
    category: 'dining',
    title: 'BGC & 카지노 리조트 최고급 파인다이닝',
    subtitle: '미슐랭 스타 일식, 최고급 한우/와규 스테이크 & 와인 바',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    description: '필리핀 최고의 부촌 BGC(보니파시오)와 호텔 리조트 내 프리미엄 레스토랑 사전 예약 및 VIP 할인 서비스를 지원합니다.',
    tags: ['파인다이닝', '미슐랭 셰프', '프라이빗 룸', 'VIP 바우처'],
    location: 'Bonifacio Global City',
  },
  {
    id: 'spot-4',
    category: 'travel_info',
    title: '필리핀 입국 규정 및 안심 VIP 의전 가이드',
    subtitle: 'e-Travel 사전 등록 대행, 여권 6개월 이상, 무비자 30일 체류',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    description: '복잡한 입국 절차 없이 공항 내 VIP 패스트트랙 통과부터 최고급 의전 세단으로 호텔까지 안전하고 신속하게 모십니다.',
    tags: ['공항 패스트트랙', 'eTravel 지원', '안전보안', '전용 리무진'],
    location: 'NAIA Manila & Clark Airport',
  },
];

export const initialServiceSteps: ServiceStep[] = [
  {
    stepNumber: '01',
    title: '1:1 비공개 맞춤 사전 상담',
    engTitle: 'Private Consultation',
    description: '24시간 카카오톡 / 텔레그램을 통해 고객님의 방문 일정, 선호 호텔, 게임 성향 및 동행 인원을 파악하여 맞춤 일정을 설계합니다.',
    details: ['24시간 실시간 한국인 전담 실장 상담', '목적지 맞춤 리조트 & 카지노 추천', '예산 및 롤링 조건별 VIP 혜택 안내'],
    iconName: 'MessageSquare',
  },
  {
    stepNumber: '02',
    title: '항공 및 5성급 호텔 VIP 예약 대행',
    engTitle: 'VIP Flight & Suite Booking',
    description: '최적의 항공 스케줄 안내와 함께 5성급 특급 호텔(오카다, 솔레어, 메리어트 등) 스위트 객실 무료 바우처를 신속하게 발권합니다.',
    details: ['특급 호텔 스위트룸/오션뷰 우선 배정', '얼리 체크인 & 레이트 체크아웃 지원', '항공권 예약 및 일정 변동 즉시 대응'],
    iconName: 'Building2',
  },
  {
    stepNumber: '03',
    title: '공항 VIP 패스트트랙 & 전용 의전 픽업',
    engTitle: 'Fast-Track & Luxury Pickup',
    description: '마닐라/클락 공항 도착 즉시 줄 서지 않는 VIP 패스트트랙 통과와 함께 최고급 전용 세단/밴으로 목적지까지 편안하게 모십니다.',
    details: ['공항 입국장 패스트트랙 에스코트', '최고급 알파드/스타리아 리무진 단독 배차', '무료 생수 및 음료, 와이파이 제공'],
    iconName: 'Car',
  },
  {
    stepNumber: '04',
    title: '24시간 전담 가이드 & VIP 정켓 케어',
    engTitle: '24/7 Dedicated Concierge & Junket',
    description: '필리핀 현지 베테랑 한국인 전담 실장이 24시간 밀착 상주하여 쾌적한 룸 배정, 식음료 지원, 골프 및 통역 서비스를 완벽 지원합니다.',
    details: ['정켓 롤링 및 칩 교환 즉시 지원', '1:1 프라이빗 게임 룸 & 테이블 예약', '골프장 부킹 및 파인다이닝 예약 동행'],
    iconName: 'ShieldCheck',
  },
  {
    stepNumber: '05',
    title: '실시간 투명 정산 및 안전한 출국 환송',
    engTitle: 'Transparent Settlement & Departure',
    description: '모든 일정 종료 후 단 1원의 오차 없는 실시간 투명 정산과 함께 공항 VIP 샌딩까지 안전하고 완벽하게 마무리해 드립니다.',
    details: ['원화/페소/달러 실시간 투명 정산', '철저한 개인정보 즉시 파기 및 보안 유지', '공항 출국장 VIP 의전 샌딩 서비스'],
    iconName: 'CheckCircle2',
  },
];

export const initialPosts: PostItem[] = [
  {
    id: 'post-1',
    category: '공지사항',
    title: '[필독] 오아시스 공식 에이전트 2026년 VIP 멤버십 혜택 & 안전 이용 수칙 안내',
    author: '오아시스 총괄운영팀',
    date: '2026-08-25',
    viewCount: 1420,
    isPinned: true,
    summary: '오아시스 공식 에이전트를 이용해 주시는 VIP 고객님들을 위한 2026년 특급 호텔 무료 숙박 및 전용 의전 지원 기준 안내입니다.',
    content: `안녕하세요, 오아시스 공식 에이전트(OASIS VIP AGENCY) 총괄운영팀입니다.

저희 오아시스는 필리핀 정부 공인 PAGCOR 정식 라이센스 협력 에이전시로서, 10년 무사고 원칙과 신뢰를 바탕으로 최상의 VIP 서비스를 제공해 드리고 있습니다.

■ 2026년 오아시스 VIP 주요 혜택
1. 마닐라 & 클락 5성급 복합리조트(오카다, 솔레어, COD, 한 카지노) 스위트룸 무료 숙박 지원
2. 마닐라(NAIA) 및 클락(CRK) 국제공항 도착 시 전용 VIP 패스트트랙 입국 에스코트
3. 최고급 토요타 알파드(Alphard) / 현대 스타리아 리무진 단독 왕복 픽업 및 전용 기사 배차
4. 전 일정 24시간 한국인 베테랑 VIP 전담 실장 밀착 케어 (언어 소통, 테이블 에스코트, 식음료 무제한 지원)
5. 클락 썬밸리, 미모사 명문 골프장 VIP 패스트 티오프 부킹 및 의전 차량 지원

■ 안전 이용 및 개인정보 보안 수칙
- 모든 고객님의 방문 내역 및 상담 기록은 철저히 암호화 관리되며, 귀국 즉시 영구 파기 처리됩니다.
- 24시간 공식 텔레그램(@oasis_official_agent) 및 공식 카카오톡 채널을 통해서만 공식 계좌 및 픽업 예약이 진행됩니다. 유사 사칭 채널에 각별히 유의해 주시기 바랍니다.

고객님의 품격 있는 필리핀 여정을 오아시스가 가장 완벽하게 완성해 드리겠습니다. 감사합니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=800&q=80',
    tags: ['공지사항', 'VIP혜택', '오아시스공식', '마닐라', '클락'],
  },
  {
    id: 'post-2',
    category: '프로모션',
    title: '2026 가을시즌 마닐라 오카다 & 솔레어 스위트룸 3박 무료 바우처 특별 프로모션',
    author: '오아시스 마케팅팀',
    date: '2026-08-20',
    viewCount: 980,
    isPinned: true,
    summary: '사전 예약 고객 대상 마닐라 대표 5성급 리조트 오카다 마닐라 오션뷰 스위트룸 3박 무료 지원 및 웰컴 다이닝 크레딧 이벤트.',
    content: `오아시스 공식 에이전트에서 2026년 가을 시즌을 맞이하여 마닐라 메이저 카지노 방문 고객님들을 위한 한정 특별 프로모션을 진행합니다.

[프로모션 세부 내용]
- 대상: 오아시스 신규 및 기존 VIP 회원
- 혜택 1: 오카다 마닐라 마닐라베이 뷰 주니어 스위트 3박 무료 제공
- 혜택 2: 솔레어 리조트 & 카지노 파인다이닝 식음료 20,000 PHP 크레딧 바우처 증정
- 혜택 3: 마닐라 공항 - 호텔 간 전용 최고급 알파드 리무진 단독 픽업/샌딩
- 혜택 4: 24시간 1:1 전담 VIP 매니저 상주 및 빠른 롤링 환전 지원

[신청 및 예약 방법]
하단 실시간 카카오톡 또는 텔레그램으로 '가을 프로모션 예약' 메시지를 보내주시면 즉시 배정해 드립니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    tags: ['프로모션', '오카다마닐라', '솔레어', '스위트룸무료'],
  },
  {
    id: 'post-3',
    category: 'VIP매거진',
    title: '클락 한 카지노 리조트(Hann Casino) 신규 VIP 프라이빗 살롱 확장 오픈 안내',
    author: '오아시스 현지운영팀',
    date: '2026-08-15',
    viewCount: 812,
    isPinned: false,
    summary: '클락 최고의 5성급 한 카지노에 최신식 프라이빗 하이리밋 바카라 테이블과 한국인 전용 VIP 라운지가 확장 오픈하였습니다.',
    content: `클락 프리포트존에 위치한 한 카지노 리조트(Hann Casino Resort)가 프리미엄 VIP 고객을 위한 단독 살롱 룸을 대규모로 확장 개장하였습니다.

- 위치: Hann Casino 3층 VIP High-Limit Salon
- 특징: 완벽히 독립된 프라이빗 테이블, 1:1 전담 딜러 및 전용 라운지 바
- 연계 호텔: 스위소텔(Swissôtel) 및 클락 메리어트 직통 전용 엘리베이터 연결
- 오아시스 혜택: 대기 없는 즉시 입장, 현장 전담 실장 에스코트, 전용 칩셋 및 롤링 혜택 즉시 반영

클락의 깨끗한 자연과 골프, 최신 시설의 게이밍을 원하시는 고객님께 강력 추천합니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tags: ['클락카지노', '한카지노', 'VIP살롱', '클락투어'],
  },
  {
    id: 'post-4',
    category: '공지사항',
    title: '2026년 최신 필리핀 입국 가이드: e-Travel 사전 등록 및 여권 유효기간 체크리스트',
    author: '오아시스 VIP컨시어지',
    date: '2026-08-10',
    viewCount: 1650,
    isPinned: false,
    summary: '필리핀 방문 전 반드시 확인해야 할 전자입국신고서(e-Travel) 작성법, 세관 규정, 무비자 30일 입국 요건 완벽 정리.',
    content: `필리핀 여행 및 출장 전 꼭 확인하셔야 할 최신 출입국 규정을 정리해 드립니다.

1. 여권 유효기간
- 필리핀 입국일 기준 최소 6개월 이상 유효기간이 남아있는 복수여권이어야 합니다.

2. 전자입국신고서 (e-Travel)
- 필리핀 도착 72시간 전부터 공식 사이트(etravel.gov.ph)에서 무료로 작성 가능합니다.
- 오아시스 고객님께는 전담 실장이 e-Travel 대리 등록을 지원해 드리므로 번거로운 입력 없이 QR코드를 받아보실 수 있습니다.

3. 왕복 항공권
- 필리핀 입국 후 30일 이내에 출국하는 리턴 항공권(또는 제3국행 항공권)이 필수입니다.

4. 외화 반입 규정
- 미화 10,000 USD 이상 소지 시 입국 시 세관 신고가 필요하며, 현지 페소화는 최대 50,000 PHP까지 소지 가능합니다.

궁금하신 점은 24시간 언제든 오아시스 고객센터로 문의해 주시기 바랍니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
    tags: ['입국가이드', 'eTravel', '필리핀여행', '마닐라공항'],
  },
  {
    id: 'post-5',
    category: 'VIP매거진',
    title: '마닐라 BGC(보니파시오) 최고급 파인다이닝 & 루프탑 라운지 BEST 5',
    author: '오아시스 라이프스타일',
    date: '2026-08-05',
    viewCount: 670,
    isPinned: false,
    summary: '필리핀의 맨해튼이라 불리는 BGC 보니파시오의 최상급 스테이크하우스, 미슐랭 파인다이닝, 야경 루프탑 바 가이드.',
    content: `게이밍과 함께 품격 있는 미식과 휴식을 즐기실 수 있도록, 마닐라 최고 부촌 BGC(Bonifacio Global City)의 핫플레이스를 엄선하여 소개해 드립니다.

1. Wolfgang's Steakhouse BGC - 정통 28일 드라이에이징 프라임 포터하우스 스테이크
2. Mecha Uma - 일본 유학파 셰프의 현대적 오마카세 파인다이닝
3. The Peak at Grand Hyatt Manila - 60층 파노라마 마닐라 스카이라인 야경과 프리미엄 칵테일
4. Savage by Josh Boutwood - 원초적인 숯불과 장작으로 구워내는 독창적인 유러피언 퀴진
5. Ruth's Chris Steak House - 뜨거운 500도 버터 플레이트에 서빙되는 최상급 필레미뇽

오아시스 전담 실장이 프라이빗 룸 사전 예약 및 차량 의전을 함께 도와드립니다.`,
    thumbnail: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    tags: ['BGC', '파인다이닝', '미식투어', '마닐라야경'],
  },
];

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: '이용 및 예약',
    question: '오아시스 공식 에이전트 서비스는 누구나 이용할 수 있나요?',
    answer: '네, 필리핀 마닐라 또는 클락 카지노 방문 및 5성급 호텔 숙박, VIP 골프 투어를 계획하시는 만 21세 이상 성인 고객이라면 누구나 이용 가능합니다. 24시간 카카오톡이나 텔레그램으로 일정과 성향을 말씀해 주시면 맞춤 플랜을 안내해 드립니다.',
  },
  {
    id: 'faq-2',
    category: '호텔 및 항공',
    question: '5성급 호텔(오카다, 솔레어, 한 등) 무료 숙박 혜택은 어떤 조건인가요?',
    answer: '고객님의 예상 플레이 규모 및 롤링 조건에 따라 최상급 스위트룸 및 일반 5성급 객실이 전액 무료 지원(Complimentary) 또는 특별 회원 요율로 제공됩니다. 사전 상담을 통해 투명하게 기준을 사전 안내해 드립니다.',
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
    category: '환전 및 칩셋',
    question: '현지 통화 환전이나 롤링 칩 교환은 번거롭지 않나요?',
    answer: '현지 전담 한국인 실장이 24시간 상주하여 계신 테이블 또는 VIP 살롱 룸에서 즉시 환전 및 칩셋 교환을 대행해 드립니다. 불필요하게 캐셔 창구에 줄을 서실 필요 없이 편안하게 게임에만 집중하실 수 있습니다.',
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
