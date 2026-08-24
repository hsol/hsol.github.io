/**
 * /resume 의 PDF 다운로드 링크가 화면 언어를 따라가는지 브라우저로 검증한다.
 * 유닛 테스트로는 볼 수 없는 것만 본다 — hydration 이후 href 가 실제로 바뀌는지, 그리고
 * 번역이 실패해 KO 로 되돌아갔을 때 링크도 같이 되돌아오는지.
 *
 * 실행: 서버를 띄운 뒤 `node scripts/check-pdf-lang.mjs [baseUrl]`
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:9999";
const PDF_LINK = "a.op-fab.primary";

const browser = await chromium.launch();
let failed = 0;

function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : ` — got ${actual}, want ${expected}`}`);
}

async function open(storedLang) {
  const page = await browser.newPage();
  await page.addInitScript((lang) => {
    if (lang === "en") window.localStorage.setItem("hsol-lang", "en");
    else window.localStorage.removeItem("hsol-lang");
  }, storedLang);
  await page.goto(`${BASE}/resume`, { waitUntil: "networkidle" });
  return page;
}

const href = (page) => page.locator(PDF_LINK).first().getAttribute("href");

// 서버 렌더는 항상 한국어다 — 첫 렌더 href 도 한국어여야 hydration 이 어긋나지 않는다.
const ko = await open("ko");
check("KO 선호 → 한글 PDF", await href(ko), "/resume/pdf");
await ko.close();

// EN 선호로 들어오면 마운트 직후 보정된다. 이게 원래 신고된 버그(EN 화면인데 한글 PDF).
const en = await open("en");
await en
  .waitForFunction(
    (sel) => document.querySelector(sel)?.getAttribute("href") === "/resume/pdf?lang=en",
    PDF_LINK,
    { timeout: 8000 },
  )
  .catch(() => {});
check("EN 선호 → 영문 PDF", await href(en), "/resume/pdf?lang=en");

/**
 * 번역이 실패하면 부트스트랩이 선호를 KO 로 되돌린다(PageTranslateBootstrap). 그때 링크가
 * ?lang=en 에 머물면 한국어 화면에서 영문 PDF 를 약속하게 된다 — 링크도 같이 돌아와야 한다.
 * 헤드리스 크로미움은 Translator API 는 있고 모델이 없어 이 경로를 그대로 탄다.
 */
await en
  .waitForFunction(() => window.localStorage.getItem("hsol-lang") === null, null, { timeout: 15000 })
  .catch(() => {});
check("번역 실패로 KO 복귀 → 링크도 한글 PDF", await href(en), "/resume/pdf");
await en.close();

await browser.close();
console.log(failed ? `${failed} check(s) failed.` : "check-pdf-lang: all checks passed.");
process.exit(failed ? 1 : 0);
