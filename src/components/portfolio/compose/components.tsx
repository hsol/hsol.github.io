"use client";

/**
 * 디자인시스템 컴포넌트 구현(컴포지션 엔진).
 * ------------------------------------------------------------------
 * 매니페스트(content/compose/manifest.ts)가 선언한 각 컴포넌트의 실제 렌더.
 * - content-bearing: props 로 받은 내용을 그린다(내부에서 site-data 를 읽지 않음).
 * - data-bound: site-data 슬라이스/페이지 콜백을 직접 읽어 구조적 사실을 보존한다.
 *
 * 스타일은 블루프린트 디자인 토큰(styles/legacy/main.css 변수)과 compose.css 의
 * cz- 프리픽스 클래스로 표현한다.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { useResumePdfHref } from "@/lib/i18n/use-resume-pdf-href";
import {
  Back,
  CareerList,
  CoffeeCTA,
  Pillars,
  SecHead,
  useSiteData,
} from "@/components/portfolio/Atoms";
import { useBlockCallbacks } from "@/components/portfolio/blocks/context";
import { GanttTimeline } from "@/components/portfolio/blocks/gantt";
import { ViewHead, renderTitleLines } from "@/components/portfolio/view-primitives";
import { COORDS, type PersonaKey } from "@/components/portfolio/portfolio-types";

type Cols = 2 | 3 | 4;

/** 문단 문자열의 **굵게** 구간을 <strong> 으로 렌더(나머지는 평문). */
function renderRich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
    seg.startsWith("**") && seg.endsWith("**") ? (
      <strong key={i}>{seg.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}

/* ===== 컨테이너 ============================================== */

export function Section({
  props,
  children,
}: {
  props: { title?: string; eyebrow?: string; num?: string | number; meta?: string; dataSection?: string };
  children?: ReactNode;
}) {
  const hasHead = props.title || props.eyebrow || props.num != null || props.meta;
  // SecHead 가 "§ " 를 붙이므로, 빌더가 num 에 §/공백을 직접 넣었으면 제거(이중 § 방지).
  const num = typeof props.num === "string" ? props.num.replace(/^[§\s]+/, "") : props.num;
  return (
    <div className="sec" data-ask-section={props.dataSection || undefined}>
      {hasHead && (
        <SecHead
          title={props.title ?? props.eyebrow ?? ""}
          num={num ?? undefined}
          meta={props.meta ?? undefined}
        />
      )}
      {children != null && <div className="cz-sec-body">{children}</div>}
    </div>
  );
}

export function Stack({
  props,
  children,
}: {
  props: { gap?: "sm" | "md" | "lg" };
  children?: ReactNode;
}) {
  return <div className={`cz-stack cz-gap-${props.gap ?? "md"}`}>{children}</div>;
}

export function Split({
  props,
  children,
}: {
  props: { ratio?: "1:1" | "2:1" | "1:2" };
  children?: ReactNode;
}) {
  const ratio = (props.ratio ?? "1:1").replace(":", "-");
  return <div className={`cz-split cz-split-${ratio}`}>{children}</div>;
}

export function Grid({
  props,
  children,
}: {
  props: { cols?: Cols };
  children?: ReactNode;
}) {
  return <div className={`cz-grid cz-cols-${props.cols ?? 3}`}>{children}</div>;
}

/* ===== 콘텐츠(LLM 작성) ====================================== */

export function Heading({
  props,
}: {
  props: { text: string; level?: 2 | 3; eyebrow?: string; meta?: string };
}) {
  const Tag = props.level === 3 ? "h3" : "h2";
  return (
    <div className="cz-heading">
      {props.eyebrow && <div className="cz-heading-eyebrow">{props.eyebrow}</div>}
      <Tag className="cz-heading-text">{props.text}</Tag>
      {props.meta && <div className="cz-heading-meta">{props.meta}</div>}
    </div>
  );
}

export function Prose({ props }: { props: { text: string } }) {
  const paragraphs = props.text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="cz-prose">
      {paragraphs.map((p, i) => (
        <p className="cz-prose-p" key={i}>
          {renderRich(p)}
        </p>
      ))}
    </div>
  );
}

export function MetricGrid({
  props,
}: {
  props: { items: { value: string; label: string; note?: string }[]; cols?: Cols };
}) {
  return (
    <div className={`cz-metrics cz-cols-${props.cols ?? Math.min(props.items.length, 4)}`}>
      {props.items.map((m, i) => (
        <div className="cz-metric" key={i}>
          <div className="cz-metric-value">{m.value}</div>
          <div className="cz-metric-label">{m.label}</div>
          {m.note && <div className="cz-metric-note">{m.note}</div>}
        </div>
      ))}
    </div>
  );
}

export function Callout({
  props,
}: {
  props: { eyebrow?: string; body: string; tone?: "info" | "accent" };
}) {
  return (
    <div className={`cz-callout cz-callout-${props.tone ?? "info"}`}>
      {props.eyebrow && <div className="cz-callout-eyebrow">{props.eyebrow}</div>}
      <p className="cz-callout-body">{renderRich(props.body)}</p>
    </div>
  );
}

export function Quote({ props }: { props: { text: string; cite?: string } }) {
  return (
    <blockquote className="cz-quote">
      <p className="cz-quote-text">{props.text}</p>
      {props.cite && <cite className="cz-quote-cite">— {props.cite}</cite>}
    </blockquote>
  );
}

export function ChipList({
  props,
}: {
  props: { label?: string; items: string[] };
}) {
  return (
    <div className="cz-chips">
      {props.label && <div className="cz-chips-label">{props.label}</div>}
      <div className="cz-chips-row">
        {props.items.map((c, i) => (
          <span className="cz-chip" key={i}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export function KeyValueList({
  props,
}: {
  props: { items: { k: string; v: string }[] };
}) {
  return (
    <dl className="cz-kv">
      {props.items.map((it, i) => (
        <div className="cz-kv-row" key={i}>
          <dt className="cz-kv-k">{it.k}</dt>
          <dd className="cz-kv-v">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CardGrid({
  props,
}: {
  props: { items: { title: string; body: string; href?: string }[]; cols?: Cols };
}) {
  return (
    <div className={`cz-cards cz-cols-${props.cols ?? Math.min(props.items.length, 3)}`}>
      {props.items.map((c, i) => {
        const inner = (
          <>
            <div className="cz-card-title">{c.title}</div>
            <p className="cz-card-body">{renderRich(c.body)}</p>
          </>
        );
        return c.href ? (
          <a className="cz-card cz-card-link" key={i} href={c.href} target="_blank" rel="noopener noreferrer">
            {inner}
            <span className="cz-card-arrow" aria-hidden="true">→</span>
          </a>
        ) : (
          <div className="cz-card" key={i}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

export function LinkList({
  props,
}: {
  props: { items: { label: string; href: string }[] };
}) {
  return (
    <ul className="cz-links">
      {props.items.map((l, i) => (
        <li key={i}>
          <a className="cz-link" href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
            <span className="cz-link-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Divider(_: { props: Record<string, never> }) {
  return <hr className="cz-divider" />;
}

/* ===== 데이터 바인딩(LLM 은 배치만) ========================== */

const PERSONA_ROOM: Record<PersonaKey, string> = {
  hire: "01 · HIRE",
  collab: "02 · COLLAB",
  builder: "03 · BUILDER",
  curious: "04 · CURIOUS",
};

export function ViewHeadBound({
  props,
}: {
  props: { persona?: PersonaKey };
}) {
  const D = useSiteData();
  const persona = props.persona;
  if (!persona || !(persona in D.viewHeaders)) return null;
  const vh = D.viewHeaders[persona];
  return (
    <ViewHead
      room={PERSONA_ROOM[persona]}
      coord={COORDS[persona] ?? ""}
      title={renderTitleLines(vh.titleLines)}
      lede={vh.lede}
    />
  );
}

export function CareerTimeline({
  props,
}: {
  props: { persona?: PersonaKey };
}) {
  const D = useSiteData();
  const persona = props.persona;
  const itemTiers = persona ? D.career.map((c) => c.tier[persona] ?? 1) : undefined;
  return <CareerList items={D.career} itemTiers={itemTiers} highlightTier1={Boolean(persona)} />;
}

export function Gantt(_: { props: Record<string, never> }) {
  const D = useSiteData();
  const cb = useBlockCallbacks();
  return <GanttTimeline items={D.portfolioCopy.curious.timeline} accent={cb.accent} />;
}

export function PillarsBound(_: { props: Record<string, never> }) {
  return <Pillars />;
}

export function CoffeeCTABound({
  props,
}: {
  props: { title?: string; sub?: string };
}) {
  return <CoffeeCTA title={props.title} sub={props.sub} />;
}

export function BackBound(_: { props: Record<string, never> }) {
  const cb = useBlockCallbacks();
  return <Back onBack={cb.onBack ?? (() => {})} />;
}

/** 이력서·포트폴리오 원페이저(/resume) 진입 CTA + PDF 다운로드. 어느 페이지에서나 공용. */
export function ResumeCTABound({
  props,
}: {
  props: { title?: string; sub?: string };
}) {
  const pdfHref = useResumePdfHref();
  return (
    <div className="cz-resume">
      <div className="cz-resume-text">
        <div className="cz-resume-eyebrow">RESUME · ONE-PAGER</div>
        <div className="cz-resume-title">{props.title ?? "이력서·포트폴리오, 한 장으로 보기"}</div>
        {props.sub && <p className="cz-resume-sub">{props.sub}</p>}
      </div>
      <div className="cz-resume-actions">
        <Link className="cz-resume-btn" href="/resume">
          한 장으로 보기 →
        </Link>
        <a className="cz-resume-btn cz-resume-btn-ghost" href={pdfHref} download>
          PDF 다운로드 ↓
        </a>
      </div>
    </div>
  );
}

/**
 * collab 자문 진입 CTA — Ask Hansol 의 '저라면 어떻게 볼지'(의사결정 자문) 도크를 연다.
 * hire 의 ResumeCTA 와 대칭인 본문 진입점. onAskAdvice 콜백이 있을 때만 렌더한다.
 * 시각은 JD 콜아웃(.hire-jd-callout)과 공유해 'AI 액션' 인상을 일관되게 준다.
 */
export function AdviceCTABound({
  props,
}: {
  props: { title?: string; sub?: string };
}) {
  const cb = useBlockCallbacks();
  if (!cb.onAskAdvice) return null;
  return (
    <div className="hire-jd-callout" data-ask-section="collab/advice">
      <div className="hire-jd-callout-eyebrow">
        {props.title ?? "AI 자문 · 한솔님은 어떻게 보시나요?"}
      </div>
      <p className="hire-jd-callout-body">
        {props.sub ??
          "결정 앞에서 막힌 고민을 적어 주시면, 제 의사결정 방식(문제 재정의 · 작은 검증 · 구체화)을 그 상황에 대입해 1인칭으로 짚어 드려요. 정답이 아니라, 제 사고 틀을 빌린 관점이에요."}
      </p>
      <button type="button" className="hire-jd-callout-btn" onClick={cb.onAskAdvice}>
        고민 적고 자문받기 →
      </button>
    </div>
  );
}

/**
 * hire JD 적합도 분석 진입 CTA — Ask Hansol 의 '채용 공고 적합도 분석' 모달/도크를 연다.
 * AdviceCTA(collab)·ResumeCTA 와 대칭인 본문 진입점. onAnalyzeJd 콜백이 있을 때만 렌더한다.
 */
export function JdAnalysisCTABound({
  props,
}: {
  props: { title?: string; sub?: string };
}) {
  const cb = useBlockCallbacks();
  if (!cb.onAnalyzeJd) return null;
  return (
    <div className="hire-jd-callout" data-ask-section="hire/jd">
      <div className="hire-jd-callout-eyebrow">
        {props.title ?? "AI 분석 · 채용 공고 적합도"}
      </div>
      <p className="hire-jd-callout-body">
        {props.sub ??
          "채용 공고(JD)를 붙여넣어 주시면, 제 경력·역량을 그 포지션 요건에 대입해 어디가 맞고 어디가 갭인지 솔직하게 짚어 드려요."}
      </p>
      <button type="button" className="hire-jd-callout-btn" onClick={cb.onAnalyzeJd}>
        채용 공고 넣고 적합도 보기 →
      </button>
    </div>
  );
}

/** 기본 팩트(연차·거점·학력·언어) + 이력서 링크. 어느 페이지에서나 공용. */
export function FactsBound(_: { props: Record<string, never> }) {
  const D = useSiteData();
  const hire = D.portfolioCopy.hire;
  return (
    <div className="facts">
      <div className="fact">
        <div className="fact-label">{hire.factsYearsLabel}</div>
        <div className="fact-value">{hire.factsYearsValue}</div>
      </div>
      <div className="fact">
        <div className="fact-label">{hire.factsBaseLabel}</div>
        <div className="fact-value">{D.identity.location}</div>
      </div>
      <div className="fact">
        <div className="fact-label">{hire.factsEducationLabel}</div>
        <div className="fact-value">
          {D.education[0].school} · {D.education[0].degree}
        </div>
      </div>
      <div className="fact">
        <div className="fact-label">{hire.factsLanguagesLabel}</div>
        <div className="fact-value">
          {D.languages.map((l) => `${l.name}(${l.level.split(" ")[0]})`).join(" · ")}
        </div>
      </div>
    </div>
  );
}

/** 스택·도메인 팩트 + 자격증. 어느 페이지에서나 공용. */
export function SkillsBound(_: { props: Record<string, never> }) {
  const D = useSiteData();
  const b = D.portfolioCopy.builder;
  return (
    <div className="facts">
      {b.facts.map((fact) => (
        <div className="fact" key={fact.label}>
          <div className="fact-label">{fact.label}</div>
          <div className="fact-value">{fact.value}</div>
        </div>
      ))}
      <div className="fact">
        <div className="fact-label">{b.certificationLabel}</div>
        <div className="fact-value">{D.certifications.join(" · ")}</div>
      </div>
    </div>
  );
}

/** 글쓰기 카드 한 장(compose 카드 스타일). href 있으면 새 탭 링크. */
function WritingCard({ no, name, en, blurb, href }: { no: string; name: string; en: string; blurb: string; href?: string }) {
  const inner = (
    <>
      <div className="cz-card-eyebrow">{no}</div>
      <div className="cz-card-title">{href ? `${name} ↗` : name}</div>
      <div className="cz-card-en">{en}</div>
      <p className="cz-card-body">{blurb}</p>
    </>
  );
  return href ? (
    <a className="cz-card cz-card-link" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="cz-card">{inner}</div>
  );
}

/**
 * 글쓰기 카드(블로그 + 출판물 + 글). 항목 수가 가변이라 고정 3열 .pillars 대신
 * 자동 채움(cz-cols-auto) 카드 그리드로 — 어떤 개수에서도 깨지지 않게. 어느 페이지에서나 공용.
 */
export function WritingBound(_: { props: Record<string, never> }) {
  const D = useSiteData();
  const { blog, extraWritings } = D.portfolioCopy.builder;
  const raw = [
    blog,
    ...D.publications.map((p) => ({ name: p.title, en: "Publication", blurb: p.desc, href: p.href })),
    ...extraWritings,
  ];
  // 같은 글이 publications·extraWritings 등 여러 출처에 겹쳐도 한 번만 — 뒤(더 구체적 분류)를 우선해 중복 제거.
  const seen = new Set<string>();
  const cards: typeof raw = [];
  for (let i = raw.length - 1; i >= 0; i -= 1) {
    const key = raw[i].name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    cards.unshift(raw[i]);
  }
  return (
    <div className="cz-cards cz-cols-auto">
      {cards.map((c, i) => (
        <WritingCard key={i} no={`PIECE · 0${i + 1}`} name={c.name} en={c.en} blurb={c.blurb} href={c.href} />
      ))}
    </div>
  );
}

/** 소스 카드 그리드(방법론·개인 노트 등). source 로 어느 묶음을 그릴지 고른다. 공용. */
export function PillarGridBound({
  props,
}: {
  props: { source: "collab.methods" | "curious.notes" };
}) {
  const D = useSiteData();
  const [group, field] = props.source.split(".") as [keyof typeof D.portfolioCopy, string];
  const copy = (D.portfolioCopy[group] ?? {}) as Record<string, unknown>;
  const items = (copy[field] as { no: string; name: string; en: string; blurb: string }[]) ?? [];
  return (
    <div className="pillars">
      {items.map((m) => (
        <div className="pillar" key={m.no}>
          <div className="pillar-no">{m.no}</div>
          <div className="pillar-name">{m.name}</div>
          <div className="pillar-en">{m.en}</div>
          <div className="pillar-blurb">{m.blurb}</div>
        </div>
      ))}
    </div>
  );
}
