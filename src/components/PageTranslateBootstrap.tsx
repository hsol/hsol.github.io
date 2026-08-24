"use client";

import { useEffect } from "react";
import {
  consumeLangInitCookie,
  enableEnglishMode,
  getPreferredLang,
  notifyEnglishEntryFailure,
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
 *
 * **번역이 실제로 걸리지 않으면 EN 을 약속하지 않는다.** 저장된 선호만 en 으로 올려 두고
 * 실패를 삼키면 토글은 EN 을 켜 놓은 채 본문은 한국어로 남는다. `/en` 링크를 받은 사람은
 * 그 화면을 영문판으로 읽고 떠나므로, 실패하면 선호를 KO 로 되돌리고 토글에 알려
 * 영어로 사정을 설명하게 한다.
 */
export function PageTranslateBootstrap() {
  useEffect(() => {
    const entryLang = consumeLangInitCookie();
    if (entryLang) setPreferredLang(entryLang);
    // 서버 렌더는 항상 한국어라, KO 진입은 아무것도 안 해도 이미 원하는 화면이다.
    const lang = entryLang ?? getPreferredLang();
    if (lang !== "en") return;

    // 사파리·파이어폭스·구형 크롬 — 내장 번역 API 자체가 없다(동기 판정).
    if (!translatorSupported()) {
      setPreferredLang("ko");
      notifyEnglishEntryFailure("unsupported");
      return;
    }

    // 지원 브라우저라도 모델이 없으면 실패한다. `/en` 진입은 클릭 제스처가 없어
    // 모델 다운로드가 필요한 첫 방문에서 특히 자주 걸린다.
    void enableEnglishMode().then((result) => {
      if (result.ok) return;
      setPreferredLang("ko");
      notifyEnglishEntryFailure(result.reason ?? "error");
    });
  }, []);
  return null;
}
