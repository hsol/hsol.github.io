/**
 * 원페이저 번역 검증 로직 자체검증. 실행: `npx tsx scripts/lib/onepager-translate.test.ts`
 * 모델을 부르지 않는다 — 순수 함수만 본다.
 */
import assert from "node:assert/strict";
import {
  applyPrintScale,
  hangulCount,
  isUpToDate,
  splitStyle,
  stripCodeFence,
  tagSignature,
  validateTranslation,
} from "./onepager-translate";

const KO = `<article class="onepager">
<style>.onepager { width: 210mm; }</style>
<h1 class="op-name">임한솔 / Hansol Lim</h1>
<p class="op-sub">플랫폼팀 팀장</p>
</article>`;

const { style, skeleton } = splitStyle(KO);
assert.equal(style, "<style>.onepager { width: 210mm; }</style>");
assert.ok(skeleton.includes("<!--ONEPAGER_STYLE-->"), "자리표가 들어가야 한다");
assert.ok(!skeleton.includes("210mm"), "CSS 는 모델에 안 보여준다");
assert.equal(splitStyle('<article class="onepager"><p>x</p></article>').style, "", "style 없으면 빈 문자열");

assert.deepEqual(tagSignature('<p class="a">x</p>'), ['<p class="a">', "</p>"]);
assert.equal(hangulCount('<p class="한글아님">임한솔</p>'), 3, "태그 안 한글은 세지 않는다");

const GOOD = skeleton
  .replace("임한솔 / Hansol Lim", "Hansol Lim")
  .replace("플랫폼팀 팀장", "Platform Team Lead");
assert.deepEqual(validateTranslation(skeleton, GOOD), [], "정상 번역은 통과해야 한다");

// 구조가 바뀌면 잡는다 — 여기서 못 잡으면 A4 레이아웃이 조용히 깨진 PDF 가 나간다.
assert.match(
  validateTranslation(skeleton, GOOD.replace('<p class="op-sub">', '<p class="op-subtitle">'))[0] ?? "",
  /태그가 다르다/,
);
assert.match(
  validateTranslation(skeleton, GOOD.replace('<p class="op-sub">Platform Team Lead</p>', ""))[0] ?? "",
  /태그 수가 다르다/,
);

// 번역이 안 된 원문을 그대로 돌려주는 경우 — 이게 바로 고치려는 버그다.
assert.ok(
  validateTranslation(skeleton, skeleton).some((p) => /한글이 \d+자 남았다/.test(p)),
  "한국어가 남으면 거부해야 한다",
);

assert.ok(
  validateTranslation(skeleton, GOOD.replace("<!--ONEPAGER_STYLE-->", "")).some((p) =>
    p.includes("자리표"),
  ),
  "자리표를 잃으면 CSS 를 되돌릴 수 없다 — 거부해야 한다",
);

assert.ok(
  validateTranslation(skeleton, `<div>${GOOD}</div>`).some((p) => p.includes("루트")),
  "루트 교체는 /resume 주입과 PDF 래핑을 둘 다 깬다",
);

assert.equal(
  stripCodeFence('```html\n<article class="onepager"></article>\n```'),
  '<article class="onepager"></article>',
);
assert.equal(stripCodeFence("  <article></article>  "), "<article></article>", "펜스 없으면 그대로");

const HASH = "a".repeat(64);
assert.equal(isUpToDate(`<!-- translated-from: sha256:${HASH} -->\n<article>`, HASH), true);
assert.equal(isUpToDate(`<!-- translated-from: sha256:${HASH} -->\n<article>`, "b".repeat(64)), false);
assert.equal(isUpToDate("<article>", HASH), false, "스탬프 없으면 재번역");

// 분량은 여기서 보지 않는다 — 실제 쪽 나눔은 break-inside 규칙이 정하므로
// 합격 판정은 translate-onepager.ts 가 렌더한 PDF 쪽수로 한다(pdfPageCount).
assert.deepEqual(
  validateTranslation(skeleton, GOOD.replace("Platform Team Lead", "Head of the Platform Team")),
  [],
  "구조가 같으면 길이가 좀 늘어도 구조 검증은 통과한다",
);

// 인쇄 배율 — 조각 안, 자기 <style> 보다 뒤에 들어가야 이긴다.
assert.equal(applyPrintScale(KO, 1), KO, "1배는 손대지 않는다");
const SCALED = applyPrintScale(KO, 0.88);
assert.ok(SCALED.indexOf("zoom: 0.88") > SCALED.indexOf("width: 210mm"), "조각 CSS 보다 뒤에 와야 한다");
assert.ok(SCALED.trimEnd().endsWith("</article>"), "루트는 여전히 article 하나다");
assert.ok(SCALED.includes("calc(210mm / 0.88)"), "축소 후에도 A4 폭을 채운다");

console.log("onepager-translate: all assertions passed.");
