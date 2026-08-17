"use client";

import { useEffect } from "react";
import {
  consumeLangInitCookie,
  enableEnglishMode,
  getPreferredLang,
  setPreferredLang,
  translatorSupported,
} from "@/lib/i18n/page-translate";

/**
 * 루트 레이아웃에 두어 모든 라우트(/, 페르소나, /about 등)에서 동작.
 * EN 선택 상태로 진입/새로고침하면 본문을 영어로 번역하고, 이후 라우팅·지연 로드되는
 * 콘텐츠도 옵저버로 계속 번역되게 한다.
 *
 * 언어 진입 경로(/en, /ko)로 들어온 경우 미들웨어가 심은 일회용 쿠키가 저장된 선호보다
 * 우선한다 — 링크를 준 사람의 의도가 이전 방문 기록보다 최신이기 때문이다.
 */
export function PageTranslateBootstrap() {
  useEffect(() => {
    const entryLang = consumeLangInitCookie();
    if (entryLang) setPreferredLang(entryLang);
    // 서버 렌더는 항상 한국어라, KO 진입은 아무것도 안 해도 이미 원하는 화면이다.
    const lang = entryLang ?? getPreferredLang();
    if (lang === "en" && translatorSupported()) {
      void enableEnglishMode();
    }
  }, []);
  return null;
}
