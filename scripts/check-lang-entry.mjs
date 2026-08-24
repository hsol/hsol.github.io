/**
 * 언어 진입 경로 브라우저 검증. 유닛 테스트로는 잡을 수 없는 것만 본다 —
 * 브라우저 내장 번역 API 가 "전역은 있는데 응답하지 않는" 상태일 때
 * `/en` 진입이 조용히 거짓말하지 않는지.
 *
 * 실행:
 *   npm run build && npm start &     # 9999 포트
 *   node scripts/check-lang-entry.mjs [baseUrl]
 *
 * 플레이라이트 크로미움에는 `Translator` 전역이 있지만 `availability()` 가 영원히
 * pending 이다 — 실제 크롬에서 모델이 없을 때와 같은 실패 모양이라 그대로 쓴다.
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:9999";
const SETTLE_MS = 9000; // 번역 준비 상한(6s)보다 넉넉히
const failures = [];
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : ` — ${detail}`}`);
  if (!ok) failures.push(`${name}: ${detail}`);
};

const browser = await chromium.launch();

async function read(path, timezoneId) {
  const page = await browser.newPage({ timezoneId, locale: "en-US" });
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  // 상태가 다 가라앉은 뒤 한 번에 읽는다. 나눠 읽으면 측정이 흔들린다.
  await page.waitForTimeout(SETTLE_MS);
  const toggle = page.locator(".lang-toggle").first();
  const out = {
    url: page.url(),
    koActive: (await toggle.locator(".lang-opt").first().getAttribute("aria-pressed")) === "true",
    enActive: (await toggle.locator(".lang-opt").last().getAttribute("aria-pressed")) === "true",
    hint: await toggle.locator(".lang-hint").innerText().catch(() => null),
    stored: await page.evaluate(() => localStorage.getItem("hsol-lang")),
    dataTr: await page.evaluate(() => document.documentElement.getAttribute("data-tr")),
  };
  await page.close();
  return out;
}

console.log(`\n[1] /en 진입, 번역 불가 브라우저 · 해외 시간대`);
{
  const r = await read("/en", "America/New_York");
  check("주소는 / 로 정리된다", r.url === BASE + "/", r.url);
  check("본문이 한국어면 토글도 KO 를 켠다", r.koActive && !r.enActive, `ko=${r.koActive} en=${r.enActive}`);
  check("저장된 선호가 en 으로 남지 않는다", r.stored !== "en", `stored=${r.stored}`);
  check("사정을 설명한다", Boolean(r.hint), "안내 없음 — 방문자는 영문판으로 읽는다");
  check("설명이 영어다", Boolean(r.hint) && !/[가-힣]/.test(r.hint), JSON.stringify(r.hint));
}

console.log(`\n[2] / 직접 진입 · 해외 시간대 → EN 유도`);
{
  const r = await read("/", "America/New_York");
  check("KO 가 켜져 있다", r.koActive, `ko=${r.koActive}`);
  check("EN 을 누르라고 영어로 안내한다", /Tap EN/.test(r.hint ?? ""), JSON.stringify(r.hint));
}

console.log(`\n[3] / 직접 진입 · 국내 시간대 → 안내 없음`);
{
  const r = await read("/", "Asia/Seoul");
  check("KO 가 켜져 있다", r.koActive, `ko=${r.koActive}`);
  check("안내를 띄우지 않는다", !r.hint, JSON.stringify(r.hint));
}

console.log(`\n[4] /ko 진입 · 해외 시간대 → 원문 그대로`);
{
  const r = await read("/ko", "America/New_York");
  check("주소는 / 로 정리된다", r.url === BASE + "/", r.url);
  check("KO 가 켜져 있다", r.koActive, `ko=${r.koActive}`);
  check("번역이 걸리지 않았다", r.dataTr === null, `data-tr=${r.dataTr}`);
}

await browser.close();
console.log(failures.length ? `\n${failures.length}건 실패\n- ${failures.join("\n- ")}` : "\n전부 통과.");
process.exit(failures.length ? 1 : 0);
