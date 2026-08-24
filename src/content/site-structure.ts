/**
 * 사이트 구조 SSOT (Single Source of Truth)
 * ------------------------------------------------------------------
 * "흔들리면 안 되는 큰 구성"을 한곳에 잠가 두는 파일.
 *
 * 데이터-주도 레이아웃(블록 조합)은 **이 안에서만** 자유롭다.
 * 사이트 빌더(CICD의 Claude 등)나 사람이 layout 을 아무리 바꿔도
 * 아래 PAGE / PERSONA / ROUTE 골격은 넘을 수 없다 — 이게 가드레일이다.
 *
 * 흩어져 있던 규칙의 출처:
 *  - 관점 키        : portfolio-types.ts `PERSONA_PATH_KEYS`
 *  - 라우트 검증     : app/[[...persona]]/page.tsx (notFound)
 *  - sitemap        : src/lib/seo/sitemap.ts (이 파일의 inSitemap + EXTRA_ROUTES + SUBDOMAIN_ENTRIES)
 *  - career tier 검증 : content/schema.ts superRefine
 * 이들이 모두 이 SSOT 를 참조하도록 점진 이관한다.
 */

import { PERSONA_PATH_KEYS, type PersonaKey } from "@/components/portfolio/portfolio-types";

export type { PersonaKey };
export { PERSONA_PATH_KEYS };

/**
 * 사이트를 구성하는 **잠긴** 페이지 집합.
 * 빌더는 이 키들의 레이아웃(블록 배열)만 다시 짤 수 있고,
 * 키 자체를 추가/삭제할 수 없다.
 */
export const PAGE_KEYS = [
  "home",
  "hire",
  "collab",
  "builder",
  "curious",
  "about",
  "architecture",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

/** 페이지별 고정 메타 — URL, 바깥 셸 종류, 사람이 읽는 역할. */
export interface PageSpec {
  /** 실제 URL 경로 */
  route: string;
  /** persona 페이지면 해당 키(없으면 null) */
  persona: PersonaKey | null;
  /**
   * 바깥 셸 종류.
   *  - "app"      : PortfolioApp 셸 안에서 렌더(홈·4관점). 자체 Foot/Dock 미포함.
   *  - "standalone": 자체 app-layout/shell/Foot/Dock 포함(/about, /architecture).
   */
  shell: "app" | "standalone";
  /** `.view` 래퍼에 들어가는 className(레이아웃이 아니라 페이지 셸 속성 — 잠금) */
  wrapperClass: string;
  /** sitemap 노출 여부 */
  inSitemap: boolean;
  /** 한 줄 역할 설명(빌더·사람용) */
  role: string;
}

export const SITE_STRUCTURE: Record<PageKey, PageSpec> = {
  home: {
    route: "/",
    persona: null,
    shell: "app",
    wrapperClass: "view",
    inSitemap: true,
    role: "첫 진입점. 평면도로 4관점을 고르게 하고, 사이트 제작 방식·커피챗을 소개.",
  },
  hire: {
    route: "/hire",
    persona: "hire",
    shell: "app",
    wrapperClass: "view",
    inSitemap: true,
    role: "채용·영입 관점. 강점·경력 타임라인·기본 팩트로 재배치한 자기소개.",
  },
  collab: {
    route: "/collab",
    persona: "collab",
    shell: "app",
    wrapperClass: "view",
    inSitemap: true,
    role: "창업·협업·자문 관점. 일하는 방식(methods)과 빌딩/자문 타임라인.",
  },
  builder: {
    route: "/builder",
    persona: "builder",
    shell: "app",
    wrapperClass: "view",
    inSitemap: true,
    role: "비슷한 일을 하는 빌더 관점. 스택·도메인, 빌더 타임라인, 글쓰기.",
  },
  curious: {
    route: "/curious",
    persona: "curious",
    shell: "app",
    wrapperClass: "view",
    inSitemap: true,
    role: "그냥 궁금한 사람 관점. 간트 타임라인과 개인적인 노트.",
  },
  about: {
    route: "/about",
    persona: null,
    shell: "app",
    wrapperClass: "view about-view",
    inSitemap: true,
    role: "이력서에 안 적는 '임한솔이라는 사람' 줄글 + 외부 프로필/관점 링크.",
  },
  architecture: {
    route: "/architecture",
    persona: null,
    shell: "standalone",
    wrapperClass: "view",
    inSitemap: false,
    role: "vault·SiteData·Blob·CI·Ask 연결 구조를 Mermaid 한 장으로.",
  },
};

/** 빌더가 layout 을 비워도 / 깨뜨려도 살아남아야 하는 최소 페이지 집합(폴백 보장 대상). */
export const REQUIRED_PAGE_KEYS = PAGE_KEYS;

export function isPageKey(value: string): value is PageKey {
  return (PAGE_KEYS as readonly string[]).includes(value);
}
