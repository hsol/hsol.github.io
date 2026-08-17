import type { PageLang } from "./page-translate";

/**
 * 언어 진입 경로 — hsol.info/en, hsol.info/ko 로 들어오면 그 언어로 세팅된 화면을 보여준다.
 *
 * 구조상 언어 상태는 클라이언트 localStorage(`hsol-lang`)에만 있고 서버 렌더는 항상 한국어다.
 * 미들웨어는 localStorage 에 쓸 수 없으므로, 진입 경로를 만나면 아래 쿠키에 목표 언어를 심고
 * `/` 로 리다이렉트한다. 클라이언트 부트스트랩이 그 쿠키를 소비해 localStorage 에 옮기고
 * 즉시 지운다. 즉 쿠키는 "미들웨어 → 첫 렌더" 한 번만 사는 일회용 전달 채널이다.
 *
 * rewrite 가 아니라 redirect 인 이유: 주소창을 `/` 로 정리해 중복 콘텐츠를 만들지 않기 위해서다.
 * 진입 이후의 이동은 localStorage 가 언어를 유지하므로 경로에 언어를 달고 다닐 필요가 없다.
 */
export const LANG_INIT_COOKIE = "hsol-lang-init";

/** 쿠키 수명(초). 리다이렉트 직후 첫 렌더에서만 쓰이므로 짧게 둔다. */
export const LANG_INIT_COOKIE_MAX_AGE = 60;

/**
 * 진입 경로 → 목표 언어. 루트 한 단계만 받는다(`/en/resume` 같은 하위 경로는 미지원).
 * 대소문자 구분 없이 매칭하려고 키는 소문자로 둔다.
 */
const LANG_ENTRY_PATHS: Record<string, PageLang> = {
  "/en": "en",
  "/ko": "ko",
};

/** 주어진 pathname 이 언어 진입 경로면 목표 언어를, 아니면 null 을 돌려준다. */
export function langFromEntryPath(pathname: string): PageLang | null {
  // 트레일링 슬래시(`/en/`)도 같은 진입으로 본다.
  const normalized = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return LANG_ENTRY_PATHS[normalized] ?? null;
}
