import type { SiteData } from "@/content/schema";

/**
 * 사이트 전역 구조화 데이터(JSON-LD) 빌더.
 *
 * 핵심 엔티티는 임한솔(#person)이며, 사이트 목표("임한솔" 검색 상단)를 위해 site-data 의
 * 학력·경력·언어·기술을 schema.org Person 의 alumniOf·worksFor·knowsLanguage·knowsAbout 로
 * 노출해 지식그래프를 강화한다. 페이지별 노드(WebPage·BreadcrumbList)는 각 라우트가 조합한다.
 */

export const SITE_URL = "https://hsol.info";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROOFER_ID = "https://proofer.tech/#organization";

/** site-data 에 없는 큐레이트 상수(동명이인 구분·외부 프로필). */
const DISAMBIGUATING =
  "정의당 정치인·법무법인 광장 조세변호사·한밭대 교수·뮤지컬배우 임한솔과 동명이인인, 씨엔티테크→리디북스→토스를 거쳐 개발자로 10년을 일하고 지금은 프루퍼 대표이자 PPB Studios 플랫폼팀 팀장인 임한솔.";
const SAME_AS = [
  "https://blog.hsol.info",
  "https://www.linkedin.com/in/hsolim/",
  "https://github.com/hsol",
  "https://medium.com/@hsol",
  "https://gravatar.com/hsolim",
];

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

/** "현재"가 들어간 기간이면 진행 중인 소속으로 본다. */
function isCurrentPeriod(period: string): boolean {
  return /현재|present|now/i.test(period);
}

/** 임한솔(#person) — site-data 로 보강한 Person 노드. */
export function buildPersonNode(data: SiteData, description: string) {
  const id = data.identity;
  const current = data.career.filter((c) => isCurrentPeriod(c.period));

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: id.name,
    alternateName: uniq([id.nameEn, "Lim Hansol", id.handle]),
    url: SITE_URL,
    image: `${SITE_URL}/og.png`,
    jobTitle: "대표 / 메이커",
    description,
    disambiguatingDescription: DISAMBIGUATING,
    address: {
      "@type": "PostalAddress",
      addressLocality: id.location,
      addressCountry: "KR",
    },
    email: `mailto:${id.email}`,
    worksFor: [
      { "@id": PROOFER_ID },
      ...current
        .filter((c) => !/proofer|프루퍼/i.test(c.org))
        .map((c) => ({ "@type": "Organization", name: c.orgEn || c.org })),
    ],
    alumniOf: data.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    hasCredential: data.certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c,
    })),
    knowsLanguage: data.languages.map((l) => l.name),
    knowsAbout: uniq(data.career.flatMap((c) => c.tags)),
    sameAs: SAME_AS,
  };
}

/** 프루퍼 Organization 노드(임한솔이 창업). */
export function buildProoferNode() {
  return {
    "@type": "Organization",
    "@id": PROOFER_ID,
    name: "프루퍼 주식회사 (Proofer)",
    url: "https://proofer.tech",
    founder: { "@id": PERSON_ID },
  };
}

/** WebSite 노드. */
export function buildWebsiteNode(description: string) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "hsol.info",
    alternateName: "임한솔 · Hansol Lim",
    description,
    inLanguage: "ko-KR",
    publisher: { "@id": PERSON_ID },
  };
}

/** ProfilePage 노드(인물 페이지). */
export function buildProfilePageNode(opts: {
  url: string;
  name: string;
  dateModified?: string;
  breadcrumbId?: string;
}) {
  return {
    "@type": "ProfilePage",
    "@id": `${opts.url}#profilepage`,
    url: opts.url,
    name: opts.name,
    inLanguage: "ko-KR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    mainEntity: { "@id": PERSON_ID },
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.breadcrumbId ? { breadcrumb: { "@id": opts.breadcrumbId } } : {}),
  };
}

/** 일반 WebPage 노드(소개·아키텍처 등 인물 자체가 아닌 페이지). */
export function buildWebPageNode(opts: {
  url: string;
  name: string;
  description: string;
  breadcrumbId?: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: "ko-KR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    ...(opts.breadcrumbId ? { breadcrumb: { "@id": opts.breadcrumbId } } : {}),
  };
}

/** BreadcrumbList — items 순서대로 position 부여. 마지막은 현재 페이지(item 생략 가능하나 명시). */
export function buildBreadcrumbList(
  pageUrl: string,
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** 여러 노드를 하나의 @graph JSON-LD 문서로 감싼다. */
export function asGraph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
