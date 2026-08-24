import type { Metadata } from "next";
import PortfolioApp from "@/components/portfolio/PortfolioApp";
import { getSiteData } from "@/lib/content/site-data";
import {
  asGraph,
  buildBreadcrumbList,
  buildProfilePageNode,
} from "@/lib/seo/person-graph";

const SITE_URL = "https://hsol.info";

const PAGE_TITLE = "임한솔 (Hansol Lim) — 엔지니어·메이커 | hsol.info";
const PAGE_DESCRIPTION =
  "선린인터넷고에서 시작해 토스를 거쳐 프루퍼를 창업한 메이커 임한솔. 같은 이름의 정치인·변호사·교수·뮤지컬 배우와는 다른, 만들면서 답을 찾는 사람의 결·성격·굴곡을 1인칭으로 기록한 소개.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/about",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["/og.png"],
  },
};

/**
 * 이 URL을 "임한솔"(#person)을 다루는 ProfilePage 로 명시 + 빵부스러기.
 * #person·#website 는 루트 레이아웃의 전역 그래프에서 정의되므로 @id 로만 참조한다.
 */
const ABOUT_URL = `${SITE_URL}/about`;
const PROFILE_JSON_LD = asGraph([
  buildProfilePageNode({
    url: ABOUT_URL,
    name: PAGE_TITLE,
    dateModified: new Date().toISOString(),
    breadcrumbId: `${ABOUT_URL}#breadcrumb`,
  }),
  buildBreadcrumbList(ABOUT_URL, [
    { name: "홈", url: `${SITE_URL}/` },
    { name: "소개", url: ABOUT_URL },
  ]),
]);

export default async function AboutRoutePage() {
  const siteData = await getSiteData();
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify 결과는 안전하게 직렬화된 JSON 문자열
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFILE_JSON_LD) }}
      />
      <PortfolioApp siteData={siteData} />
    </>
  );
}
