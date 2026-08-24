"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { animate, stagger, useReducedMotion } from "framer-motion";
import { Foot, useSiteData } from "@/components/portfolio/Atoms";
import { DeferredChatDock } from "@/components/DeferredChatDock";
import type { AskHansolPageContext } from "@/lib/ask-hansol/client";
import { trackEvent } from "@/lib/analytics";
import { useResumePdfHref } from "@/lib/i18n/use-resume-pdf-href";

// 이력서 독자는 채용·협업 평가 맥락이라 Ask Hansol 을 hire 관점으로 띄운다.
const ASK_CONTEXT: AskHansolPageContext = {
  view: "hire",
  section: "resume",
  hash: "/resume",
  detail: "onepager",
};

/**
 * /resume — vault 온톨로지로 생성된 이력서/포트폴리오 원페이저(자기완결형 HTML 조각)를 렌더.
 * 진입 시 원페이저의 각 블록이 차분히 떠오르며(fade + 미세 상승 + blur→선명) 스태거로 드러나는
 * 절제된 entrance(framer-motion). 좌측 홈·PDF 플로팅. 인쇄 시 크롬·애니메이션 제외.
 */
const STYLE = `
.onepager-screen { padding: 40px 0 64px; }

/* 좌측 플로팅 내비 */
.onepager-floatnav {
  position: fixed; left: 18px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 10px; z-index: 60;
}
.op-fab {
  display: inline-flex; align-items: center; gap: 7px;
  border: 1px solid var(--bp-line-2); color: var(--ink);
  background: rgba(14, 42, 61, 0.72); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
  padding: 10px 15px; border-radius: 999px; font-size: 0.86rem; font-family: var(--mono);
  text-decoration: none; white-space: nowrap; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}
.op-fab:hover { background: rgba(40, 112, 153, 0.55); border-color: var(--bp-glow); transform: translateX(3px); }
.op-fab.primary { border-color: var(--accent); color: var(--accent); }
.op-fab.primary:hover { background: rgba(244, 201, 119, 0.16); }

.onepager-sheet {
  background: #ffffff; color: #16242c;
  max-width: 210mm; margin: 0 auto;
  box-shadow: 0 6px 40px rgba(0, 0, 0, 0.4);
  border-radius: 4px; overflow: hidden;
}
/* entrance 전: 첫 페인트부터 블록을 숨겨 FOUC(보였다 사라졌다)를 막는다.
   JS가 framer-motion 으로 드러내고, no-JS 는 아래 <noscript> 가 즉시 노출. */
.onepager-sheet.preanim .onepager > *:not(style) { opacity: 0; }

.onepager-empty {
  max-width: 210mm; margin: 0 auto; padding: 48px 24px;
  text-align: center; color: var(--ink-mute);
}
/* SEO·접근성용 시각 비표시 제목(원페이저 본문은 LLM HTML 이라 h1 보장이 어려움) */
.onepager-srtitle {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

@media (max-width: 920px) {
  /* 좁은 화면에선 시트와 겹치므로 하단 가로 배치로 */
  .onepager-floatnav { top: auto; bottom: 18px; left: 18px; transform: none; flex-direction: row; }
}

/* 모바일: 조각 CSS 가 A4 고정폭(.onepager{width:210mm})을 쓰는데 시트는 overflow:hidden 이라
   좁은 화면에서 오른쪽이 잘린다. 유동 폭·단일 컬럼으로 리플로우한다. 시트 내부 인라인 <style>
   (.onepager …)을 덮으려면 .onepager-sheet 접두로 특이도를 올린다(!important 없이). PDF 경로는
   이 STYLE 을 쓰지 않으므로 A4 레이아웃이 그대로 보존된다. */
@media (max-width: 820px) {
  /* 상하 배경 여백 제거: .shell 세로 패딩과 .foot margin-top 을 이 페이지 한정으로 0 으로.
     (좌우는 아래 시트 풀블리드가 담당) */
  .onepager-layout .shell { padding-top: 0; padding-bottom: 0; }
  .onepager-layout .foot { margin-top: 0; }
  .onepager-screen { padding: 0; }
  /* 시트를 뷰포트 폭까지 풀블리드로 빼 .shell 좌우 패딩만큼의 배경 여백을 없앤다
     (부모가 뷰포트 중앙 정렬이라 이 계산식으로 좌우 끝까지 닿는다). */
  .onepager-sheet {
    width: 100vw;
    max-width: none;
    margin-left: calc(50% - 50vw);
    border-radius: 0;
    box-shadow: none;
  }
  .onepager-sheet .onepager {
    width: auto;
    padding: 22px 16px 28px;
  }
  /* 헤더: 이름·직함 위, 연락처 아래로 세로 적층(좌측 정렬) */
  .onepager-sheet .onepager .op-header {
    flex-direction: column;
    gap: 8px;
  }
  .onepager-sheet .onepager .op-contacts {
    text-align: left;
    line-height: 1.9;
  }
  /* 다단 그리드 → 단일 컬럼 */
  .onepager-sheet .onepager .op-achievements,
  .onepager-sheet .onepager .op-two-col,
  .onepager-sheet .onepager .op-edu-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  /* 경력·프로젝트 헤더: 기간/메타가 겹치지 않게 줄바꿈 허용 */
  .onepager-sheet .onepager .op-exp-header,
  .onepager-sheet .onepager .op-proj-header {
    flex-wrap: wrap;
    gap: 2px 8px;
  }
  .onepager-sheet .onepager .op-exp-period,
  .onepager-sheet .onepager .op-proj-meta {
    margin-left: 0;
  }
}
@media print {
  html, body { background: #ffffff !important; }
  body::before, body::after { display: none !important; }
  .onepager-floatnav, .foot, footer.foot, .resume-ask { display: none !important; }
  .onepager-screen { padding: 0; }
  .onepager-sheet { box-shadow: none; max-width: none; margin: 0; border-radius: 0; }
}
`;

export function OnePagerPage({ html }: { html: string | null }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const { name, nameEn } = useSiteData().identity;
  const pdfHref = useResumePdfHref();

  useEffect(() => {
    if (!html) return;
    const root = sheetRef.current?.querySelector(".onepager");
    if (!root) return;
    // 원페이저 최상위 블록(헤더·섹션 등)만 대상. inline <style> 는 제외.
    const blocks = (Array.from(root.children) as HTMLElement[]).filter(
      (el) => el.tagName !== "STYLE",
    );
    if (blocks.length === 0) return;

    // 모션 최소화 설정: 애니메이션 없이 즉시 노출(.preanim 의 opacity:0 을 덮어씀).
    if (reduceMotion) {
      for (const el of blocks) el.style.opacity = "1";
      return;
    }

    // .preanim 이 이미 opacity:0 으로 첫 페인트부터 숨김. 시작 상태 보강 후 스태거로 차오르게.
    for (const el of blocks) {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.filter = "blur(5px)";
    }
    const controls = animate(
      blocks,
      { opacity: [0, 1], transform: ["translateY(18px)", "translateY(0px)"], filter: ["blur(5px)", "blur(0px)"] },
      { delay: stagger(0.07, { startDelay: 0.1 }), duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    );
    return () => {
      controls.stop();
    };
  }, [html, reduceMotion]);

  return (
    <div className="app-layout onepager-layout">
      <style>{STYLE}</style>
      <noscript>
        <style>{`.onepager-sheet.preanim .onepager > *:not(style){opacity:1!important}`}</style>
      </noscript>

      <div className="shell">
        <main id="main-content">
          <div className="view onepager-screen">
            <h1 className="onepager-srtitle">
              {name} 이력서·포트폴리오 — {nameEn} Resume & Portfolio
            </h1>
            {html ? (
              <div
                ref={sheetRef}
                className="onepager-sheet preanim"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <div className="onepager-empty">
                원페이저가 아직 준비되지 않았습니다. 다음 갱신에서 생성됩니다.
              </div>
            )}
          </div>
        </main>
        <Foot />
      </div>

      <nav className="onepager-floatnav" aria-label="원페이저 작업">
        <button type="button" className="op-fab" onClick={() => router.push("/")}>
          ← 홈
        </button>
        <a className="op-fab primary" href={pdfHref} download onClick={() => trackEvent("resume_pdf_download")}>
          ↓ PDF 다운로드
        </a>
      </nav>

      <div className="resume-ask">
        <DeferredChatDock pageContext={ASK_CONTEXT} />
      </div>
    </div>
  );
}
