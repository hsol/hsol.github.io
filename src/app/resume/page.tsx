import type { Metadata } from "next";
import { SiteDataProvider } from "@/components/portfolio/Atoms";
import { OnePagerPage } from "@/components/portfolio/OnePagerPage";
import { getSiteData } from "@/lib/content/site-data";
import { getOnePagerHtml } from "@/lib/content/onepager";

const SITE_URL = "https://hsol.info";

// 정적 프리렌더 대신 요청 시 렌더 — Blob의 최신 원페이저를 리빌드 없이 반영한다.
export const dynamic = "force-dynamic";

const PAGE_TITLE = "임한솔 이력서·포트폴리오 (Hansol Lim Resume)";
const PAGE_DESCRIPTION =
  "임한솔(Hansol Lim) 이력서·포트폴리오 원페이저. 개발자로 10년, 프루퍼 CEO·PPB 플랫폼팀 팀장까지 — 마진 개선·운영 효율화 등 사업 가치 중심 성과와 경력을 한 장에 정리하고 PDF로 내려받을 수 있습니다.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "임한솔",
    "Hansol Lim",
    "임한솔 이력서",
    "임한솔 포트폴리오",
    "이력서",
    "포트폴리오",
    "원페이저",
    "resume",
    "CV",
    "프루퍼",
    "Proofer",
    "CEO",
    "소프트웨어 엔지니어",
  ],
  alternates: { canonical: "/resume" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/resume",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/og.png"],
  },
};

export default async function ResumeRoutePage() {
  const [siteData, html] = await Promise.all([getSiteData(), getOnePagerHtml()]);

  /**
   * /resume 를 임한솔(#person)을 다루는 ProfilePage 로 명시 + 이력서 PDF 를 관련 문서로,
   * 그리고 Breadcrumb 로 사이트 구조 신호를 준다. #person·#website 는 루트 그래프에서 정의.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/resume#profilepage`,
        url: `${SITE_URL}/resume`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "ko-KR",
        dateModified: siteData.build?.refreshedAt ?? new Date().toISOString(),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#person` },
        mainEntity: { "@id": `${SITE_URL}/#person` },
        significantLink: `${SITE_URL}/resume/pdf`,
        associatedMedia: {
          "@type": "DigitalDocument",
          name: "임한솔 이력서·포트폴리오 PDF",
          url: `${SITE_URL}/resume/pdf`,
          encodingFormat: "application/pdf",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/resume#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "이력서·포트폴리오", item: `${SITE_URL}/resume` },
        ],
      },
    ],
  };

  return (
    <SiteDataProvider data={siteData}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OnePagerPage html={html} />
    </SiteDataProvider>
  );
}
