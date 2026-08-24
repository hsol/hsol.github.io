import { NextResponse } from "next/server";
import { getBlobPrefix, getBlobToken, resolveBlobUrl } from "@/lib/content/blob";

/**
 * /resume/pdf — CI 에서 사전 생성해 Blob 에 올린 원페이저 PDF 를 내려준다.
 * Blob store 가 private 라 브라우저 직접 접근이 안 되므로, 서버가 토큰으로 가져와 스트리밍한다
 * (site-data 읽기와 동일한 private read 패턴).
 *
 * `?lang=en` 이면 영문판을 내려준다. 언어 상태는 클라이언트 localStorage 에만 있어서 서버는
 * 요청만 보고 언어를 알 수 없다 — 링크에 실어 보내는 게 유일한 수단이다(useResumePdfHref).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOWNLOAD_FILENAME = {
  ko: "hansol-lim-onepager.pdf",
  en: "hansol-lim-onepager-en.pdf",
} as const;

async function fetchPdf(lang: "ko" | "en"): Promise<ArrayBuffer | null> {
  const token = getBlobToken();
  if (!token) return null;
  const url = await resolveBlobUrl(token, getBlobPrefix(), `resume/onepager-${lang}.pdf`);
  if (!url) return null;
  const upstream = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);
  if (!upstream || !upstream.ok) return null;
  return upstream.arrayBuffer();
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") === "en" ? "en" : "ko";

  const body = await fetchPdf(lang);
  if (body) {
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${DOWNLOAD_FILENAME[lang]}"`,
        "cache-control": "public, max-age=300",
        // 같은 URL 이 lang 에 따라 다른 파일을 주므로 캐시가 섞이지 않게 표시한다.
        vary: "Accept-Language",
      },
    });
  }

  /**
   * 영문판이 없을 때 한글판으로 조용히 폴백하지 않는다. 영문을 기대한 사람에게 한국어 PDF 를
   * 말없이 건네는 게 애초에 이 이슈에서 고치려던 문제다(/en 진입 실패 처리와 같은 원칙).
   */
  if (lang === "en") {
    return new NextResponse(
      "The English one-pager isn't available yet. The Korean version is at /resume/pdf, and the web version at /resume can be translated in place with the EN toggle.",
      { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  return new NextResponse(
    "원페이저 PDF가 아직 생성되지 않았습니다. /resume 에서 인쇄 기능으로 PDF를 저장할 수 있습니다.",
    { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
