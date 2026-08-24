import { chromium } from "playwright";
import { wrapOnePagerHtml } from "../../src/lib/content/onepager-html";

/**
 * 원페이저 조각 -> A4 PDF. 번역 검증(쪽수 확인)과 실제 PDF 생성이 같은 렌더러를 쓴다 —
 * 검증에서 2쪽이었는데 배포본이 3쪽이면 검증한 의미가 없다.
 */
export async function renderOnePagerPdf(
  fragment: string,
  lang: "ko" | "en",
): Promise<Buffer> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(wrapOnePagerHtml(fragment, lang), { waitUntil: "networkidle" });
    return await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
}

/** PDF 쪽수. 카탈로그의 /Type /Pages ... /Count N 을 읽는다. 못 읽으면 0. */
export function pdfPageCount(pdf: Buffer): number {
  const match = pdf.toString("latin1").match(/\/Type\s*\/Pages[\s\S]{0,400}?\/Count\s+(\d+)/);
  return match ? Number(match[1]) : 0;
}
