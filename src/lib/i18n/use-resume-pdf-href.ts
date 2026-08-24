"use client";

import { useEffect, useState } from "react";
import { getPreferredLang, onLangChange, type PageLang } from "@/lib/i18n/page-translate";

/**
 * /resume/pdf 다운로드 링크 — EN 이면 `?lang=en` 을 붙인다.
 *
 * 언어 상태는 클라이언트(localStorage)에만 있어서 서버는 PDF 요청만 보고 언어를 알 수 없다.
 * 링크에 실어 보내는 게 서버에 언어를 알릴 유일한 수단이다.
 *
 * 첫 렌더는 항상 KO 다(서버 렌더가 한국어라 hydration 이 어긋나지 않는다). 마운트 직후 실제 선호로
 * 보정하고, 이후 토글은 onLangChange 로 따라간다 — KO→EN 전환에는 리로드가 없어서
 * 마운트 때 한 번 읽는 것만으로는 "EN 화면인데 한글 PDF" 가 그대로 재발한다.
 */
export function useResumePdfHref(): string {
  const [lang, setLang] = useState<PageLang>("ko");

  useEffect(() => {
    setLang(getPreferredLang());
    return onLangChange(setLang);
  }, []);

  return lang === "en" ? "/resume/pdf?lang=en" : "/resume/pdf";
}
