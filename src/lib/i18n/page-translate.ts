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
/**
 * `/en` 진입이 조용히 실패했을 때 언어 토글에 알리는 전역 통지.
 * `ask-selection/selection-bridge` 와 같은 방식이다 — 실패 시점이 토글 마운트보다
 * 이를 수 있어(미지원 브라우저는 동기 판정) 대기 슬롯을 하나 둔다.
 *
 * 이게 없으면 진입 실패가 아무 표시도 남기지 않는다. 저장된 선호는 이미 en 이라
 * 토글은 EN 을 켜 놓은 채 본문은 한국어로 남아, 방문자는 이게 영문판이라고 읽는다.
 */
type EntryFailure = NonNullable<TranslateResult["reason"]>;

let pendingEntryFailure: EntryFailure | null = null;
const entryFailureListeners = new Set<(reason: EntryFailure) => void>();

export function notifyEnglishEntryFailure(reason: EntryFailure): void {
  pendingEntryFailure = reason;
  entryFailureListeners.forEach((listener) => listener(reason));
}

export function onEnglishEntryFailure(
  listener: (reason: EntryFailure) => void,
): () => void {
  entryFailureListeners.add(listener);
  return () => {
    entryFailureListeners.delete(listener);
  };
}

/** 구독 전에 발생한 실패를 1회 흡수한다(흡수 후 비운다). */
export function takeEnglishEntryFailure(): EntryFailure | null {
  const reason = pendingEntryFailure;
  pendingEntryFailure = null;
  return reason;
}

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
  enEntry: boolean;
  supported: boolean;
  mode: PageLang;
  failed: boolean;
}): string | null {
  const { intl, enEntry, supported, mode, failed } = opts;
  // 어느 언어로 쓸지 — 접속 위치가 한국 밖이거나, `/en` 으로 영어를 명시 요청했으면 영어.
  // 국내에서 `/en` 을 타고 온 사람도 영어를 달라고 한 것이므로 한국어로 답하지 않는다.
  const english = intl || enEntry;
  if (failed) {
    if (supported) {
      return english
        ? "Couldn't load the translation model. Please try again."
        : "번역 모델을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
    }
    return english
      ? "This is the Korean original. Please use your browser's own translate for English."
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

/**
 * 번역 모델 준비 대기 상한(ms).
 *
 * `Translator.availability()`·`create()` 는 모델이 없는 환경에서 거부하지 않고 그냥
 * **응답하지 않는** 경우가 있다(헤드리스 크로미움에서 재현됨. `Translator` 전역은 있고
 * `availability()` 가 영원히 pending). 상한이 없으면 두 경로가 같이 죽는다.
 *  - `/en` 진입: 본문은 한국어인데 토글은 EN 을 켜 놓은 채 영원히 그대로. 설명도 없다.
 *  - EN 클릭: 버튼이 "…" 로 잠긴 채 영원히 그대로.
 * 아무 설명 없이 멈추는 게 최악이라, 상한을 넘기면 실패로 확정해 안내를 띄운다.
 */
const TRANSLATOR_READY_TIMEOUT_MS = 6000;

/** 노드 하나당 번역 상한 — 한 노드가 멈춰 전체 풀을 잡아 두지 않게 한다. */
const TRANSLATE_NODE_TIMEOUT_MS = 3000;

/** 시간 안에 값이 오면 그 값, 넘기거나 거부되면 null. 절대 던지지 않는다. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    const settle = (value: T | null) => {
      clearTimeout(timer);
      resolve(value);
    };
    promise.then(settle, () => settle(null));
  });
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
        const availability = await withTimeout(
          Static.availability({ sourceLanguage: "ko", targetLanguage: "en" }),
          TRANSLATOR_READY_TIMEOUT_MS,
        );
        // null = 상한 초과(응답 없음). 미가용과 같이 실패로 본다.
        if (availability === null || availability === "unavailable" || availability === "no") {
          return null;
        }
        // 'downloadable'/'downloading'이면 create()가 모델을 내려받는다(클릭 제스처 필요).
        // `/en` 진입은 제스처가 없어 여기서 걸리는 게 정상 경로다 — 그래서 상한이 필요하다.
        const instance = await withTimeout(
          Static.create({ sourceLanguage: "ko", targetLanguage: "en" }),
          TRANSLATOR_READY_TIMEOUT_MS,
        );
        if (!instance) return null;
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
    // 한 노드가 응답하지 않아도 풀 전체가 멈추지 않게 상한을 둔다(초과 시 null → 건너뜀).
    const translated = await withTimeout(
      translator.translate(trimmed),
      TRANSLATE_NODE_TIMEOUT_MS,
    );
    // 번역 도중 노드가 바뀌지 않았을 때만 치환(앞뒤 공백 보존).
    if (translated && node.nodeValue === original) {
      node.nodeValue = original.replace(trimmed, translated);
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
