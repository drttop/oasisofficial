import { SiteConfig, BannerSlide, CasinoItem, PhilippineTourSpot, ServiceStep, PostItem, FAQItem, InquiryLead } from '../types';
import oasisHeroBg from '../assets/images/oasis_gold_hero_1787791853858.jpg';
import casinoPanoramicBg from '../assets/images/casino_table_panoramic_1787791869633.jpg';
import aboutAccreditationImg from '../assets/images/oasis_accreditation_about_1787793248317.jpg';

export const initialSiteConfig: SiteConfig = {
  siteName: '오아시스 필리핀 공식 에이전트',
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
  seoTitle: '오아시스 필리핀 공식 에이전트 | 마닐라 & 클락 카지노 VIP 전문 에이전시',
  seoDescription: '필리핀 마닐라 오카다, 솔레어, 시티오브드림즈, 클락 한 카지노 VIP 정켓 공식 에이전트. 5성급 호텔 숙박 지원, 공항 패스트트랙, 전용 의전 세단, 24시간 한국인 1:1 케어',
  seoKeywords: '오아시스 에이전트, 필리핀 카지노, 마닐라 카지노, 클락 카지노, 오카다 마닐라, 솔레어 카지노, 필리핀 정켓, 마닐라 정캣, 필리핀 골프투어, 카지노 에이전시, 필리핀 환전, ',
  bannerTitle: '신뢰와 품격의 최고봉, 필리핀 No.1 공식 VIP 에이전트',
  bannerSubtitle: '마닐라 & 클락 메이저 복합리조트 VIP 혜택과 24시간 프라이빗 1:1 전담 의전 서비스를 경험하십시오.',
  bannerBadge: 'OFFICIAL CERTIFIED VIP AGENCY',
  companyAddress: 'OASIS TOWER 18F, Entertainment City, Parañaque, Metro Manila, Philippines',
  representative: '강태진 대표 디렉터',
  licenseNumber: 'PAGCOR Certified Official Agency No. 2018-0914-MNL',

  // About Oasis Section Config
  aboutBadge: 'ABOUT OASIS',
  aboutTitle: '필리핀 공인 13년 현지 직영 공식 에이전트\n',
  aboutSubtitle: ' ',
  aboutStoryHeading: '“필리핀 공식 에이전트”',
  aboutStoryParagraph1: '오아시스 공식 에이전트는 필리핀의 각종 게임규제 정부부처의 규정을 준수하며 협력하고 있습니다. 13년간 필리핀 현지에서 직접 상주하며 단 한 건의 사고 없는 무결점 VIP 운영을 약속합니다.  필리핀 정부 게이밍 규제기관(PAGCOR), 필리핀 경기감독위원회(GAB), 필리핀 자선복권공사(PCSO)와의 공식 파트너십을 통해 \n법적 리스크 없는 100% 안전한 여정을 보장합니다.',
  aboutStoryParagraph2: '단순한 중개를 넘어 마닐라(오카다, 솔레어, 시티오브드림즈) 및 클락(한 카지노, 디하이츠, 로이스) 현지 법인 인프라를 바탕으로, 공항 VIP 패스트트랙 입국부터 최고급 의전 차량, 5성급 스위트룸 무료 바우처, 전담 한국인 매니저의 24시간 현지 밀착 케어까지 원스톱으로 책임집니다.',
  aboutStoryHighlight: ' 하단박스',
  aboutImageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
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

  // Philippines Section Config
  philippinesBadge: 'PHILIPPINES VIP TRAVEL & GOLF',
  philippinesTitle: '필리핀 VIP 투어 가이드',
  philippinesSubtitle: '오아시스가 엄선한 프리미엄 필리핀 투어 정보를 안내해 드립니다.',

  // Process and Nav Menu Config
  communityTitle: '오아시스 공지사항 & 프로모션 소식',
  navMenu1: '오아시스',
  navMenu2: '카지노 서비스',
  navMenu3: '투어 서비스',
  headerLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABagAAAE0CAYAAADJz9R6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAydpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDEwLjAtYzAwMCA3OS5kMjBlNDY2MzAsIDIwMjUvMTIvMDktMDI6MTE6MjMgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyNy45IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNDc1Qjk2MkExQzExMUYxQkI4OUQwQzQ2NEFEMDIwMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNDc1Qjk2M0ExQzExMUYxQkI4OUQwQzQ2NEFEMDIwMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjE0NzVCOTYwQTFDMTExRjFCQjg5RDBDNDY0QUQwMjAwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE0NzVCOTYxQTFDMTExRjFCQjg5RDBDNDY0QUQwMjAwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+8Yo8yQAEK85JREFUeNrs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U74ve+5wfie9773viXfvDH4l/78R+P7/2HfxJ/6F/9UPx/vPfd8Xv/1Q/Fv/I93xv/6o9/f/zBP/x/xu/9Z+9b6+1d/39k+B7xKx9873vx/2e8+q5vxWuvvBzvfuXfipdffhlvv+suvO2tP4G3/d13481v+r146+veiF/9Z78f73vPj+Otb3w73vjG34u3v/UNeOsPfgDe/pYfx9tvvx2vffWr8Yrv+e9/4bW/4z/5p//H//p73/H6O/5jfe0Zf2P9Fz7+oZ39jY2f2t5ce2XzwtX5/vr6tNnbZ37b8U5/cO32u089eue7j992/3cfvf07/s6//g/f97f+2e/9vX/x53/y7b9933ve/fGf/on/8n/7kXe8+r/52V/5hXv//I3/+k56jZ/81O1/v7myvOtvffTf/8Bff+i+H/r4h27/x/c/uPfS1vqa/6//9n37//T//hff+3/98Z98/R9+/V9990/90//mX73vf/n1L9//x9/xK775h5969Z99/F9++4e7re2H+2uL5166fPnx3vr21535492PfvyX77r+zP/w29ff8t8/d/P3/7fP3frfv/62n/8v/sb/7u/86/e87b7/+/f+55/4w9tv/U+/66V/50+vfeF33/j1f/T7f+j+h9/xPff+H1/+2y/+81/9x1//F7969aVvPfzV8+vnvvHwt168duXhTz5x4fQnP/Xlq7/z371v+b984N1PfPQfvu6n/uL37v7V/7V39Wtf/8+ve+7bv3Dq03977xsvPf71+x9/7pnrn3zksZc++dDXT/2bX//C4b95+P6nvnb12qOPfPXh1//wX7394d9/8vnv3v/1b1388uNXP/X1p7915rNPXbr0yXv+7c1/9gM/+91/+13v/Z077v5bL9z5v337qve894d+6D3f9bM/dPtLf3vvKz9/9Zkv3fzY15967kuf+8Lpn/2rTz3/3373w98+/M0vP3r10QefvfYfHnnqwsN/7/qV8w889c2Hv/iVbzz95P949anr/+2D7z71wV//9JOP/94ff/mF73z34Ue++sSzn/7640989f6vPvj5Z37r/4mvefUrvuUdf/d3fu4NP/6Pv/fNv/r6d/z2b7145bHvPf3Iiy99+omLDz323Muf//LDl//7D/3j0w88/K2nv/i57z7y4heef/rTH3/g+p43vf7Kfe/4Z+975X/76m/5t3/vV77z5a/53k/+1N9788N/8pUPf/7L1y5+5NOfufyJT37+qU//5Vcf/e7v/d2rr3z6Y19/5uP3f+Xqf3zi2Ysfe/wLT/z+p7/w8FevvvjV+x/86lcefvBvf+3iQ/f9/S+fvfvX/8fv+/k/e9//8u73fO0/ve+rX/rE5x/6woMf+vyFzz742Ivf+J9+/6mrD3z2sWsf+/STj3z8kac+/fHPPfbip7706Avf/eBfP/bM3/3yA1/4pQee/Mznv/b4F7724P3f/cITX7n/4S9+7XMPPvn1bzz84H1/8+hLH/784197+PnvPvLYk3/yG4+f/9I/fPCbT/3ZJx996L4Hn7r85Y/d/9WHP/71Jx+4/wNfuf9vP/f1Zz/16Uce/O7nH73w8Ac+8fSnn/qf//KZDz32la889Mxf/93D3/vY15797h995uHHPv6l65/5xNcf/uKjLzzx2a9eePzhBx/+7ue/9eB9X/m7h754/8ef+eTDX77/6Ycf++LD3/z8V69+5p88/MRjH/2br1/60v/0d0999H9+9OsvvvSZR+7/8hfve+i7X/q7h7766Yf/5uEHP/X41Yfe/9ev/fUvf/X+r//dw0/89Wce+sLDn/z4tYfe//D1L/ztVx586L4Hn7z28L1fffrS5x68/4sf//vPP/zYk08++vR3PvPg1578y9e/+s2H/9P7v/HQF5669pUP/fX9j378kc995tPf+9xD3/r4o9/8/EMPPPf4J7749QfvfegbT1766AP/65lP3/fVb33z89/9woMPffbRD/3D4w/c9w8ffuLrv/fNzz3w8S9/6vEnP/Pwxz/56Jce/MhnPv6lTz/46W/c//BffOqRD/7D01/46Fcf+8g/vPb1B7/8jce/9fknvnrfo898/Qvf+s4DD/ztJx669qnHv/L5Tz7wyGNffuRL9z386Ue++uCjv/9/P/rQ5x77y7965OHPfO3+T/zNE48/9LHHH7zvgYcefPjRD/2jZ758/9/840e/+eDHvvz4k1/4/Bce/fJDX3r4kc9+8jOPPvj5x77x6a898vmnv3D9a1//5H/8/T/62gPvfvybf/P1J/764aeufvRjH/jLz377iS8/8eBDn/j0d7729cf+9tMvfuzTX/3mg3/34Bce+dxjL37iq4889c2vPvr5+x/92tfuf+C5h7/8yQevffGjD33nU9/88tef/sTnH3r0a1964InPf/2Rrzx4/zce/dLXHvnaQ/f/zZOfufbU1+/7yye+9pUP/s0jjz72yc/87ZeffeD+T3z2qS+ffOxbjz7yyGOPfOnBD371/r/+4jef+Jvvffkbn3vsga898sDXPvmFhz752W99+qmv/v0jD374a49+/sHPfvXrv/fgp/72b7/yjc988Tvf/NyHX/zUI9967NPPfubBT377K49+7MHHnvz4l7788Kcefvy+B5771tfe8/ffvv/+b1x/9EsfefjBLz3ywEP3feqRD/zV+772wNce+/KnPnXtka/f/9mHH/rqow8+8pmHPv75Lzz2yFc+/a2vPP7Jzz786U9+/SuPPPX0U9/+6l/97R/86a987Wv/8Mh3H/vA33z161964K9++X9/8L/92x/86c98/ZtPf/3h/3z/J7/01ccffOjhT331aw9+/kuf/9Ij33z4W5/9/Cef/uonHvjE17724H/98rce+8aD9z/x1cce/uxj3/zaQ/f/9cMPfvYrH/n0Z7/w1Yee+OzXP/Xwo4899ODfPvj4V//uaw/85Sfe//989Mv3P/aVL3zhofv/9sGHv/joF//2m195/MsPfe2vP/6Vh7741Yce/sLnP/nwg1/9+sMPffbRD3/16w98/rEHP/HQZz/9xUe//sBXvvzggw988eFHnvrkpx/55N/9/aNfefRvvv7Qgw9+8dOf+eKjD33qgYf/5rFHn/zbTz3w4Je/9K2Hv/3pBx794re+/uBHvv70g1/55gNf+/oTX/vE/U997jNffeQv/+qzv/fNb339G5//xGcevvbhP3vgm1979NMPPfzI5z/1iYceeOiBf/j0o1955Etfe/iT33ziicce/fLHP/GZRx/9xucfuv+BLz/48Ge/+sgDH/z7h7/18EMvffbBv/naVx745Oef+PInfv+B3/3E/U989bMff+yBv/nK177y+Qe/8Oinn/z65x/9whOPffLhTz78ya8+/Pknv/Lwo/f//cOPfubT33z4K4/85dc+8pC378T8wPz8/Fz/4NjO8bGZ/V2dPTs623t2tzV172xr6p7p7Gzf3NHevdXd2Lm9saG9fUdzw7bGpo4drc17trc07trV0ri9tbFje1vDts62hm2bmxo6trU1b29tb9/Z3jTf2dGyrbNlY0dj4/zW9k3bWje37e1qbtre3tKwvbmxY1tLw44d9fU7d+4844Kzzt177/nnvva0M457+8b1xxzT2rSjt6Wxu6WxoaOhY2drw9a21uYdHQ072xo2z7e37Nre2LC1uXH71s6mrRs3NszPNDdu31q3eXt7Y8O29sbtm5vnt+5sb9q1o2HT1g0N23Zs3LSleWPjhq2btrW1bJjfunV+144d852t29uaG3Y01G7oaG3YuaOlcWd7Y8e29oaG7c0Nu7Y3b53f0bB1S2vj1u2tDVva6ho6mxu3bm1r3N7RsH1L48aNTfVbWxu3zW/d2rCtrbG9rb5uU1vDprbW5ua25tbmhoZtG+vaWre0NW3e1rS5oaN+e1tTw7am+q0b6+saN7Y1bWlr2tzcvGnr5s2btrQ3bW3e0LqlsX77xsb6LY2NW7e1NW7raGrcsqFp66aNTRtbG7dvbd68pbm+bktTw/ampg3zWzdt2ba5rn5ja9PWLRsaG7Zuamrc1NSwoXlDfUND/fZNjc1bNzfWbd6yeeP81uaN81sbt23dtGVTU8Omrc2NmzZs3LBhS3Pjxs2bNm7e2rR5y4b6rZub6rc0Nmza2lS/dfOGxg1bN7Vs2bpx05bNLY0bN7ZsaGje0Ni0YUtz4+ZNm7dsbN3QvKmxob65qXFzY/Om+s3NTRs21dc3bN3YWL+hZUNd48b1mxsbtm7f3LxxQ1PDxs2b67dsbGze0NDYvGXzpvkNWzbUb9/UuKFhW/OGTS0bN21q3bK1tWlTS/OmTRubNjRsamja1NTU0NjQ1NDY2LBpY1Nj/bamxoamDY0NTRsaGzY0NW7csHnjps1bNza3bNywsbl1Q/2W1s3zW5sbt7Q11W/eWL9p88bGjU2bmxo2btm4cfOW5vrNWzdt2tK4qWHr5uYNDZsbmjZs3txYv7F187bNmxqbNzY1bmxq3NC4cWPDxg2Nm7a0Nm7d1LS5eWNz3fbWpsZNW5s2bt7U3LC1qWlTQ9OWTQ0bN29q2tC8sbF+w6ZG7/rGje31G7Zs2Ny4qaFpw+ZNDZuamzdtamjc0NSwoXHThubNTRuamxtb6zc11m/c2NqwcWNT06atGxvqNm7Z2NDU2NDU0NzUuLHxuuu2b2xo3NDQ2NTUtHHjxo11DU2b6je2bt6wqaVx08b6+s0bNu5sqd/UuLmxfsPmxrqGpqYNmzc01m9p3Ni4uW5j88b6+vpb6zZubNzQsLljc2PjlsaG+g1NTU0bGxo3NTY2btrQ1NDUvKG5qaG+oXFTU9P85oYNTQ1bNzVsbmzctLmxftOmxs0bmjc1b2hsalr89U3N9Vs2N2xo3rCxvmFzU/18/YYtm9q3bN2woWlDy6bmTS2bWje1bW7Z2Lq5dWvLlqatG1q3NG9uad6ytal1a+uW7W1bNm/Zsrm1bcvGzVtbmjZvbG7etGVT0/rm+s1bmjY1b9jS1LSlbXPLlratm7ZvaNrcsrF5U/OG1s2bWzbVb9rUuLlt86bWLS1bt25s2rJ106bNLRtbN25u2tC6sXFz2+ZtzVs2bm7esql1c9Pmtk1bWza1bd24ubVt0/atW7Zubtm4ZXPz9q3NWzc3bdnQvGXLxrZNLVtbmra0bNq6Zdu2TS2bN27a3LK1act2b5fX/9k=',
};

export const initialBannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    title: '필리핀 카지노 공식 VIP 에이전트',
    subtitle: '오카다 · 솔레어 · COD · 클락 한 카지노 공식파트너 \n차원이 다른 프리미엄 혜택과 투명한 정산 보증',
    badge: 'PAGCOR OFFICIAL CERTIFIED VIP AGENCY',
    bgImage: oasisHeroBg,
  },
  {
    id: 'slide-2',
    title: '24시간 퍼스트클래스 전담 케어',
    subtitle: '공항 VIP 패스트트랙 입국, 최고급 전용 리무진 픽업, 5성급 호텔 전액 지원',
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
    title: '마닐라 & 클락 명문 프라이빗 골프 투어',
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
    answer: '네, 필리핀 마닐라 또는 클락 카지노 방문 및 5성급 호텔 숙박, VIP 골프 투어를 계획하시는 만 18세 이상 성인 고객이라면 누구나 이용 가능합니다. 24시간 카카오톡이나 텔레그램으로 일정과 성향을 말씀해 주시면 맞춤 플랜을 안내해 드립니다.',
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
