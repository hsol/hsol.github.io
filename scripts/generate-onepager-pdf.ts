import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { pdfPageCount, renderOnePagerPdf } from "./lib/onepager-pdf";

/**
 * 원페이저 HTML(onepager-<lang>.html) -> A4 PDF 변환 후 Vercel Blob 업로드.
 * refresh(ko html 생성) → translate(en html 생성) 다음 CI 스텝에서 실행.
 * Playwright 인쇄 엔진이라 텍스트 선택 가능·벡터 출력.
 * BLOB 토큰이 없으면 로컬 파일만 남기고 업로드는 건너뛴다(빌드 실패시키지 않음).
 * EN HTML 이 아직 없으면 EN 만 건너뛴다 — KO 는 그대로 나간다.
 */
const BLOB_PREFIX = (process.env.BLOB_PREFIX || "info").replace(/^\/+|\/+$/g, "");

type Target = { lang: "ko" | "en"; htmlPath: string; localPdfPath: string };

const TARGETS: Target[] = [
  {
    lang: "ko",
    htmlPath:
      process.env.VAULT_ONEPAGER_HTML_PATH ?? "hsol-info-blob/vault/object-views/onepager-ko.html",
    localPdfPath: process.env.ONEPAGER_PDF_OUT ?? "generated/onepager-ko.pdf",
  },
  {
    lang: "en",
    htmlPath:
      process.env.VAULT_ONEPAGER_EN_HTML_PATH ??
      "hsol-info-blob/vault/object-views/onepager-en.html",
    localPdfPath: process.env.ONEPAGER_EN_PDF_OUT ?? "generated/onepager-en.pdf",
  },
];

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? process.env.ASK_HANSOL_BLOB_TOKEN;
  let rendered = 0;

  for (const target of TARGETS) {
    const fragment = await readFile(target.htmlPath, "utf8").catch(() => "");
    if (!fragment.trim()) {
      console.log(`[onepager-pdf] No HTML at ${target.htmlPath}; skip ${target.lang}.`);
      continue;
    }

    console.log(`[onepager-pdf] Rendering A4 PDF (${target.lang}) with Playwright...`);
    const pdf = await renderOnePagerPdf(fragment, target.lang);
    rendered += 1;

    await mkdir(path.dirname(target.localPdfPath), { recursive: true });
    await writeFile(target.localPdfPath, pdf);
    console.log(
      `[onepager-pdf] Wrote local PDF: ${target.localPdfPath} (${pdf.length} bytes, ${pdfPageCount(pdf)} pages).`,
    );

    if (!token) {
      console.log("[onepager-pdf] No BLOB_READ_WRITE_TOKEN; skipped Blob upload (local only).");
      continue;
    }

    const pdfResult = await put(`${BLOB_PREFIX}/resume/onepager-${target.lang}.pdf`, pdf, {
      access: "private",
      token,
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/pdf",
    });
    console.log(`[onepager-pdf] Uploaded ${target.lang} PDF to Blob: ${pdfResult.url}`);

    // HTML 도 Blob 에 올려 런타임(getOnePagerHtml)이 submodule 없이도 읽게 한다.
    const htmlResult = await put(
      `${BLOB_PREFIX}/vault/object-views/onepager-${target.lang}.html`,
      fragment,
      {
        access: "private",
        token,
        allowOverwrite: true,
        addRandomSuffix: false,
        contentType: "text/html; charset=utf-8",
      },
    );
    console.log(`[onepager-pdf] Uploaded ${target.lang} HTML to Blob: ${htmlResult.url}`);
  }

  if (rendered === 0) console.log("[onepager-pdf] Nothing to render.");
}

main().catch((error) => {
  console.error("Failed to generate one-pager PDF.");
  console.error(error);
  process.exit(1);
});
