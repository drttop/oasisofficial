# 오아시스 100점 SEO & 퍼포먼스 불변 규칙 가이드 (Oasis 100-Point SEO Standards)

본 문서는 검색엔진 최적화(SEO) 및 퍼포먼스 진단 도구(Next-T, Google Lighthouse, Naver Search Advisor)에서 **100점 만점**을 영구 유지하기 위해 모든 업데이트 시 반드시 지켜야 할 불변 규정입니다.

---

### 1. 단일 H1 태그 원칙 (Single H1 Tag Rule)
* **원칙**: 전체 HTML 문서 및 렌더링된 컴포넌트 트리를 통틀어 **`<h1>` 태그는 정확히 1개**만 존재해야 합니다.
* **위치**: `src/components/sections/HeroSection.tsx`의 메인 히어로 타이틀에만 `<h1>`을 사용합니다.
* **금지 사항**:
  - `index.html` 내의 `<noscript>` 크롤러 폴백 블록에 `<h1>` 사용 금지 (반드시 `<h2>` 사용).
  - 커뮤니티, 카지노, 명소 등 하위 섹션 제목은 반드시 `<h2>` 이하(`<h3>`, `<h4>` 등) 사용.
  - 모달 팝업 내부 제목은 `<h2>` 또는 `<h3>` 사용.

---

### 2. 차세대 이미지 (WebP 100%) 원칙
* **원칙**: 로고, 배경, 카드 썸네일, 본문 이미지 등 모든 이미지는 WebP 포맷이어야 합니다.
* **Unsplash 등 외부 이미지**:
  - 반드시 `src/utils/imageOptimizer.ts`의 `getOptimizedImageUrl()` 또는 `getResponsiveImageProps()`를 경유합니다.
  - 모든 이미지 URL에는 `auto=format&fm=webp&ext=.webp` 파라미터가 자동으로 주입되어 Imgix/Unsplash CDN이 `content-type: image/webp`를 반환하도록 고정되어 있습니다.
* **로컬 이미지**:
  - 신규 로컬 에셋 추가 시 PNG/JPG 대신 `.webp` 포맷으로 변환하여 `/public/images/`에 배치합니다.

---

### 3. 필수 보안 헤더 4종 유지
`netlify.toml` 및 `public/_headers`의 전역 경로(`/*`)에 아래 4개 보안 헤더가 항시 유지되어야 합니다:
1. `X-Frame-Options: SAMEORIGIN` (클릭재킹 방지)
2. `X-Content-Type-Options: nosniff` (MIME 스니핑 방지)
3. `Referrer-Policy: strict-origin-when-cross-origin` (개인정보 및 경로 유출 방지)
4. `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS 강제 암호화)

---

### 4. 구조화 데이터 (Schema.org JSON-LD) 일관성
* **@graph 연결성**:
  - `WebSite` 엔티티의 `publisher`는 `{ "@id": "https://oasis46.com/#organization" }`로 직접 참조합니다. (중복 카운트를 유발하는 인라인 `@type: "Organization"` 선언 금지)
  - `Organization` 엔티티는 단 1개만 정의되며, `sameAs`에 위키데이터(Wikidata) 신뢰 출처 및 공식 SNS가 포함되어야 합니다.
* **신규 포스트 동기화**:
  - `npm run sync-seo` 실행 시 Firestore 포스트 목록과 `sitemap.xml` 및 `index.html` 폴백이 자동 연동됩니다.

---

### 5. 빌드 시 자동 무결성 검증 (Automated Build Guard)
* `package.json`의 `npm run build` 스크립트에 `node scripts/verify-seo-score.js`가 등록되어 있습니다.
* 향후 어떤 수정이 이루어지더라도 위 기준(H1 개수, WebP 최적화, 보안 헤더, Schema 구문 등) 중 하나라도 위반되면 **빌드 단계에서 즉각 감지되어 배포를 차단**하고 위반 사항을 출력합니다.
