import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { chatText } from "../src/lib/llm";
import { pdfPageCount, renderOnePagerPdf } from "./lib/onepager-pdf";
import {
  applyPrintScale,
  buildPrompt,
  EN_PRINT_SCALES,
  isUpToDate,
  splitStyle,
  stripCodeFence,
  STYLE_SLOT,
  validateTranslation,
} from "./lib/onepager-translate";

/**
 * onepager-ko.html -> onepager-en.html (영문 원페이저 조각).
 *
 * vault 에서 영어로 따로 생성하지 않고 **KO 결과물을 번역**한다. KO 가 단일 진실 원천으로 남아야
 * 두 언어가 어긋나지 않고, vault 사실을 고칠 때 한 번만 고치면 두 PDF 가 같이 따라온다.
 *
 * refresh(KO 생성) 다음, PDF 생성 이전 CI 스텝에서 실행한다.
 * KO 가 안 바뀌었으면 모델을 부르지 않는다(EN 파일 첫 줄의 소스 해시로 판단).
 */
const KO_PATH =
  process.env.VAULT_ONEPAGER_HTML_PATH ?? "hsol-info-blob/vault/object-views/onepager-ko.html";
const EN_PATH =
  process.env.VAULT_ONEPAGER_EN_HTML_PATH ?? "hsol-info-blob/vault/object-views/onepager-en.html";
const MAX_OUTPUT_TOKENS = Number(process.env.ONEPAGER_TRANSLATE_MAX_TOKENS ?? 16000);

async function main() {
  const ko = await readFile(KO_PATH, "utf8").catch(() => "");
  if (!ko.trim()) {
    console.log(`[onepager-en] No Korean one-pager at ${KO_PATH}; skip.`);
    return;
  }

  const koHash = createHash("sha256").update(ko, "utf8").digest("hex");
  const existing = await readFile(EN_PATH, "utf8").catch(() => "");
  if (!process.env.ONEPAGER_TRANSLATE_FORCE && isUpToDate(existing, koHash)) {
    console.log("[onepager-en] Korean source unchanged; keep existing translation (no model call).");
    return;
  }

  const { style, skeleton } = splitStyle(ko);

  /**
   * 합격선은 한국어판 쪽수다. 글자 수로는 판정할 수 없다 — 실제 쪽 나눔은 break-inside 규칙이
   * 정하고, 영어는 직역하면 1.8배까지 불어 2장이 3장이 된다. 한 장 넘긴 이력서는 원페이저가 아니다.
   */
  const koPages = pdfPageCount(await renderOnePagerPdf(ko, "ko"));
  console.log(
    `[onepager-en] Translating ${skeleton.length} chars (CSS ${style.length} chars held out); target ${koPages} page(s).`,
  );

  let hint = "";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const text = await chatText({
      messages: [{ role: "user", content: buildPrompt(skeleton, hint) }],
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });
    if (!text) {
      console.log(`[onepager-en] Model returned nothing (attempt ${attempt}).`);
      continue;
    }

    const output = stripCodeFence(text);
    const problems = validateTranslation(skeleton, output);
    if (problems.length) {
      console.log(`[onepager-en] Rejected (attempt ${attempt}): ${problems.join(" | ")}`);
      hint = `\n[이전 시도 문제 — 반드시 고쳐라]\n${problems.map((p) => `- ${p}`).join("\n")}\n`;
      continue;
    }

    // CSS 를 되돌려 넣는다. 모델이 뭘 했든 KO 의 <style> 이 그대로 들어가므로 레이아웃은 동일하다.
    const fragment = output.replace(STYLE_SLOT, style);

    // 쪽수가 맞을 때까지 조판을 조인다. 글을 깎는 것보다 활자를 줄이는 쪽이 이력서에 덜 손해다.
    let fitted = "";
    let pages = 0;
    for (const scale of EN_PRINT_SCALES) {
      const candidate = applyPrintScale(fragment, scale);
      pages = pdfPageCount(await renderOnePagerPdf(candidate, "en"));
      console.log(`[onepager-en]   scale ${scale} -> ${pages} page(s).`);
      if (koPages === 0 || pages <= koPages) {
        fitted = candidate;
        break;
      }
    }
    if (!fitted) {
      console.log(`[onepager-en] Rejected (attempt ${attempt}): 어떤 배율로도 ${koPages}쪽에 못 넣었다.`);
      hint = `\n[이전 시도 문제 — 반드시 고쳐라]\n- 조판을 최대로 줄여도 A4 ${pages}쪽이다. ${koPages}쪽 안에 들어오게 문장을 더 조여라(내용은 빼지 마라).\n`;
      continue;
    }

    const en = `<!-- translated-from: sha256:${koHash} -->\n${fitted}\n`;
    await writeFile(EN_PATH, en, "utf8");
    console.log(`[onepager-en] Wrote ${EN_PATH} (${en.length} bytes, attempt ${attempt}).`);
    return;
  }

  // 실패해도 빌드는 세우지 않는다 — 기존 EN 이 있으면 그게 계속 쓰이고, 없으면 라우트가 설명한다.
  console.log("[onepager-en] Translation failed after 3 attempts; leaving existing file untouched.");
}

main().catch((error) => {
  console.error("Failed to translate one-pager.");
  console.error(error);
  process.exit(1);
});
