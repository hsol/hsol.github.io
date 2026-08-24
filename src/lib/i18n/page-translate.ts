/**
 * 페이지 영문 보기 — 브라우저 내장(온디바이스) 번역 API 활용.
 *
 * 구글 번역 웹 프록시(translate.goog)는 한국 등 일부 지역에서 차단되므로 쓰지 않는다.
 * 대신 Chrome/Edge 138+의 내장 `Translator` API로 <body>의 한글 텍스트 노드를 그 자리에서
 * 영어로 바꾼다(온디바이스라 지역 제한 없음). 미지원 브라우저에서는 `translatorSupported()`가
 * false를 반환하므로 호출부에서 안내 폴백을 보여준다.
 *
 * EN 모드는 MutationObserver로 유지한다 — SPA 라우팅, 지연 로드 뷰, /about 같은 별도 라우트
 * 어디로 이동하든 새로 들어온 한글을 자동으로 다시 번역한다. KO 복귀는 새로고침으로 처리한다
 * (원문이 기본이라 가장 안전). `[data-no-translate]` 하위(언어 토글·Ask 도크 등)는 건드리지 않는다.
 */

import { LANG_INIT_COOKIE } from "./lang-entry";

const LANG_KEY = "hsol-lang";
const HANGUL = /[가-힣]/;

export type PageLang = "ko" | "en";

type TranslatorInstance = { translate(input: string): Promise<string> };
type TranslatorStatic = {
  availability(opts: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(opts: { sourceLanguage: string; targetLanguage: string }): Promise<TranslatorInstance>;
};

export type TranslateResult = {
  ok: boolean;
  reason?: "unsupported" | "unavailable" | "no-root" | "error";
};

function getTranslatorStatic(): TranslatorStatic | null {
  if (typeof self === "undefined") return null;
  const g = self as unknown as { Translator?: TranslatorStatic };
  return g.Translator ?? null;
}

export function translatorSupported(): boolean {
  return getTranslatorStatic() !== null;
}

/**
 * 접속 위치가 한국 밖인지 — 기기 시간대로 판정한다.
 *
 * Vercel 의 IP 지오 헤더(`x-vercel-ip-country`)를 쓰려면 미들웨어가 응답에 Set-Cookie 를
 * 달아야 하고, 그러면 지금 CDN 에 올라가 있는 `/about`·`/architecture` 가 캐시에서 빠진다.
 * 시간대는 브라우저 기본 기능이라 서버·쿠키가 필요 없고, 틀려도 안내문 한 줄이 더 보일 뿐이라
 * 실패 방향이 안전하다. (한국 시간대는 `Asia/Seoul` 하나뿐이다.)
 */
export function isOutsideKorea(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return Boolean(tz) && tz !== "Asia/Seoul";
  } catch {
    // 미지원 환경 — 안내를 띄우지 않는다(원문이 기본이라 가장 안전).
    return false;
  }
}

/**
 * 언어 토글 옆 `.lang-hint` 한 칸에 무엇을 띄울지. 순수 함수라 자체검증 대상이다
 * (`npx tsx src/lib/i18n/page-translate.test.ts`).
 *
 * - `failed`(EN 클릭 실패)가 있으면 그게 우선 — 지금 막 누른 사람에게 줄 말이 먼저다.
 * - 없으면 해외 접속자에게만 EN 유도 안내를 띄운다. 국내 접속자는 원문이 이미 원하는 화면이라
 *   띄울 말이 없다(`null`).
 * - 해외 접속자용 문구는 전부 영어다 — 읽을 사람이 한국어를 모르니 한국어 안내는 안내가 아니다.
 */
export function langHintMessage(opts: {
  intl: boolean;
  supported: boolean;
  mode: PageLang;
  failed: boolean;
}): string | null {
  const { intl, supported, mode, failed } = opts;
  if (failed) {
    if (supported) {
      return intl
        ? "Couldn't load the translation model. Please try again."
        : "번역 모델을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
    }
    return intl
      ? "This browser can't translate in place. Please use your browser's own translate."
      : "이 브라우저에선 주소창·우클릭의 번역 기능을 사용해 주세요.";
  }
  if (!intl || mode !== "ko") return null;
  return supported
    ? "Korean site. Tap EN for English."
    : "Korean site. Please use your browser's own translate.";
}

export function getPreferredLang(): PageLang {
  if (typeof window === "undefined") return "ko";
  try {
    return window.localStorage.getItem(LANG_KEY) === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}

export function setPreferredLang(lang: PageLang): void {
  if (typeof window === "undefined") return;
  try {
    if (lang === "en") window.localStorage.setItem(LANG_KEY, "en");
    else window.localStorage.removeItem(LANG_KEY);
  } catch {
    /* localStorage 사용 불가(프라이빗 모드 등) — 무시 */
  }
}

/**
 * 미들웨어가 언어 진입 경로(/en, /ko)에서 심은 일회용 쿠키를 읽고 즉시 지운다.
 * 진입 경로가 아니었다면 null 을 돌려준다. 지우는 이유는 다음 방문까지 남아
 * 사용자가 토글로 바꾼 언어를 되돌려 버리는 사고를 막기 위해서다.
 */
export function consumeLangInitCookie(): PageLang | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LANG_INIT_COOKIE}=([^;]*)`),
  );
  if (!match) return null;
  // 읽는 즉시 만료시킨다(미들웨어와 같은 path 여야 실제로 지워진다).
  document.cookie = `${LANG_INIT_COOKIE}=; path=/; max-age=0`;
  return match[1] === "en" ? "en" : "ko";
}

let cachedTranslator: TranslatorInstance | null = null;
let pendingTranslator: Promise<TranslatorInstance | null> | null = null;

async function getTranslator(): Promise<TranslatorInstance | null> {
  if (cachedTranslator) return cachedTranslator;
  const Static = getTranslatorStatic();
  if (!Static) return null;
  if (!pendingTranslator) {
    pendingTranslator = (async () => {
      try {
        const availability = await Static.availability({
          sourceLanguage: "ko",
          targetLanguage: "en",
        });
        if (availability === "unavailable" || availability === "no") return null;
        // 'downloadable'/'downloading'이면 create()가 모델을 내려받는다(클릭 제스처 필요).
        const instance = await Static.create({ sourceLanguage: "ko", targetLanguage: "en" });
        cachedTranslator = instance;
        return instance;
      } catch {
        return null;
      } finally {
        pendingTranslator = null;
      }
    })();
  }
  return pendingTranslator;
}

function collectHangulTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue ?? "";
      // 이미 번역된(영어) 노드는 한글이 없어 자동으로 제외된다 — 멱등성의 핵심.
      if (!HANGUL.test(text)) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

async function runPool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const i = index;
      index += 1;
      await fn(items[i]);
    }
  });
  await Promise.all(workers);
}

async function translateOnce(): Promise<TranslateResult> {
  if (typeof document === "undefined") return { ok: false, reason: "error" };
  const translator = await getTranslator();
  if (!translator) {
    return { ok: false, reason: translatorSupported() ? "unavailable" : "unsupported" };
  }
  const root = document.body;
  if (!root) return { ok: false, reason: "no-root" };

  const nodes = collectHangulTextNodes(root);
  if (nodes.length === 0) {
    document.documentElement.setAttribute("data-tr", "en");
    return { ok: true };
  }

  await runPool(nodes, 6, async (node) => {
    const original = node.nodeValue ?? "";
    const trimmed = original.trim();
    if (!trimmed || !HANGUL.test(trimmed)) return;
    try {
      const translated = await translator.translate(trimmed);
      // 번역 도중 노드가 바뀌지 않았을 때만 치환(앞뒤 공백 보존).
      if (translated && node.nodeValue === original) {
        node.nodeValue = original.replace(trimmed, translated);
      }
    } catch {
      /* 개별 노드 실패는 건너뛴다 */
    }
  });

  document.documentElement.setAttribute("data-tr", "en");
  return { ok: true };
}

let busy = false;
let rerunRequested = false;

/**
 * <body>의 한글을 영어로 번역(제자리). 동시 호출은 합쳐서(coalesce) 처리하므로
 * 클릭·옵저버에서 자유롭게 여러 번 불러도 안전하다. 이미 번역된(영어) 노드는 한글이 없어 건너뛴다.
 */
export async function applyEnglishTranslation(): Promise<TranslateResult> {
  if (busy) {
    rerunRequested = true;
    return { ok: true };
  }
  busy = true;
  try {
    let result = await translateOnce();
    while (rerunRequested) {
      rerunRequested = false;
      result = await translateOnce();
    }
    return result;
  } finally {
    busy = false;
  }
}

let observer: MutationObserver | null = null;
let observerDebounce = 0;

function isInsideNoTranslate(node: Node | null): boolean {
  const el =
    node && node.nodeType === Node.ELEMENT_NODE
      ? (node as Element)
      : (node as CharacterData | null)?.parentElement ?? null;
  return Boolean(el?.closest?.("[data-no-translate]"));
}

function startObserver(): void {
  if (observer || typeof document === "undefined" || typeof MutationObserver === "undefined") return;
  observer = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (isInsideNoTranslate(m.target)) continue;
      if (m.type === "childList" && m.addedNodes.length > 0) {
        relevant = true;
        break;
      }
      // 우리가 만든 번역(영어) 변경은 한글이 없어 무시되고, 새로 들어온/되돌려진 한글만 트리거.
      if (m.type === "characterData" && HANGUL.test((m.target as CharacterData).data ?? "")) {
        relevant = true;
        break;
      }
    }
    if (!relevant) return;
    window.clearTimeout(observerDebounce);
    observerDebounce = window.setTimeout(() => void applyEnglishTranslation(), 200);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

/**
 * EN 모드 진입: 즉시 1회 번역하고, 이후 라우팅·지연 로드로 들어오는 한글을 옵저버로 계속 번역.
 * 번역 모델이 없는(미지원/미가용) 경우 첫 결과의 ok=false를 그대로 돌려준다.
 */
export async function enableEnglishMode(): Promise<TranslateResult> {
  if (typeof document === "undefined") return { ok: false, reason: "error" };
  const result = await applyEnglishTranslation();
  if (result.ok) startObserver();
  return result;
}
