/**
 * 원페이저 HTML 래퍼(순수 함수, 외부 의존성 없음).
 * LLM 이 만든 조각(<article class="onepager">...)을 완전한 HTML 문서로 감싼다.
 * /resume 화면은 조각을 그대로 주입하고, CI PDF 스크립트는 이 래퍼로 감싸 Playwright 에 넘긴다.
 */
export function wrapOnePagerHtml(fragment: string, lang: "ko" | "en" = "ko"): string {
  const title =
    lang === "en" ? "Hansol Lim — Resume / Portfolio One-Pager" : "임한솔 — 이력서·포트폴리오 원페이저";
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  html, body { margin: 0; padding: 0; background: #ffffff; }
  body {
    font-family: -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", "Noto Sans CJK KR", sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
</style>
</head>
<body>
${fragment}
</body>
</html>`;
}
