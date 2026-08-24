"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SiteData } from "@/content/schema";
import { NEWS_URL } from "@/lib/news/seo";
import {
  enableEnglishMode,
  getPreferredLang,
  isOutsideKorea,
  langHintMessage,
  setPreferredLang,
  translatorSupported,
} from "@/lib/i18n/page-translate";

type CareerItem = SiteData["career"][number];
const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({
  data,
  children,
}: {
  data: SiteData;
  children: ReactNode;
}) {
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteData {
  const value = useContext(SiteDataContext);
  if (!value) throw new Error("SiteDataProvider is missing.");
  return value;
}

export function Plate() {
  const d = useSiteData().identity;
  return (
    <header className="plate">
      <div className="plate-cell plate-id">
        <Image
          src="/signature.svg"
          alt=""
          className="plate-sig"
          width={36}
          height={36}
          priority
        />
        <div>
          <div className="plate-key">Person</div>
          <div className="plate-val">임한솔 · Hansol Lim</div>
        </div>
      </div>
      <div className="plate-cell">
        <div className="plate-key">Language</div>
        <LangToggle className="plate-lang" />
      </div>
      <a href={d.calendly} target="_blank" rel="noopener noreferrer" className="plate-cell plate-cell-link">
        <div className="plate-key">Status</div>
        <div className="plate-status">
          <span className="dot"></span>Open for coffee
        </div>
      </a>
    </header>
  );
}

type RoomSpec = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lx: number;
  ly: number;
  ax: number;
  ay: number;
  label: string;
  area: string;
  furniture: ReactNode;
};

export function PlanDiagram({
  onPick,
  hovered,
  onHover,
}: {
  onPick?: (key: string) => void;
  hovered?: string | null;
  onHover?: (key: string | null) => void;
}) {
  const rooms: RoomSpec[] = [
    {
      key: "hire",
      x: 20,
      y: 20,
      w: 180,
      h: 160,
      lx: 50,
      ly: 55,
      ax: 50,
      ay: 68,
      label: "01 / HIRE",
      area: "— 26.4 m²",
      furniture: (
        <g>
          <rect x="50" y="100" width="120" height="22" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <circle cx="110" cy="142" r="9" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <line x1="50" y1="111" x2="170" y2="111" stroke="#f4c977" strokeWidth="0.4" strokeDasharray="2 2" />
        </g>
      ),
    },
    {
      key: "collab",
      x: 200,
      y: 20,
      w: 140,
      h: 260,
      lx: 225,
      ly: 55,
      ax: 225,
      ay: 68,
      label: "02 / COLLAB",
      area: "— 38.0 m²",
      furniture: (
        <g>
          <rect x="240" y="120" width="60" height="100" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <circle cx="225" cy="140" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
          <circle cx="225" cy="170" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
          <circle cx="225" cy="200" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
          <circle cx="315" cy="140" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
          <circle cx="315" cy="170" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
          <circle cx="315" cy="200" r="6" fill="none" stroke="#f4c977" strokeWidth="0.6" />
        </g>
      ),
    },
    {
      key: "builder",
      x: 200,
      y: 280,
      w: 140,
      h: 160,
      lx: 225,
      ly: 305,
      ax: 225,
      ay: 318,
      label: "03 / BUILDER",
      area: "— 22.4 m²",
      furniture: (
        <g>
          <rect x="220" y="350" width="46" height="22" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <rect x="276" y="350" width="46" height="22" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <line x1="243" y1="372" x2="243" y2="384" stroke="#f4c977" strokeWidth="0.6" />
          <line x1="299" y1="372" x2="299" y2="384" stroke="#f4c977" strokeWidth="0.6" />
        </g>
      ),
    },
    {
      key: "curious",
      x: 120,
      y: 280,
      w: 80,
      h: 160,
      lx: 130,
      ly: 305,
      ax: 130,
      ay: 318,
      label: "04 / CURIOUS",
      area: "— 14.4 m²",
      furniture: (
        <g>
          <circle cx="145" cy="370" r="10" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <circle cx="180" cy="400" r="10" fill="none" stroke="#f4c977" strokeWidth="0.8" />
          <line x1="135" y1="350" x2="195" y2="350" stroke="#f4c977" strokeWidth="0.4" strokeDasharray="2 2" />
        </g>
      ),
    },
  ];

  return (
    <div className="plan">
      <div className="plan-label">FLOOR PLAN · 1:50</div>
      <div className="plan-label-r">N ↑</div>
      <svg
        className="plan-svg"
        viewBox="0 0 360 460"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="페르소나를 방으로 표현한 평면도 — 같은 이동 경로를 아래 목록 버튼으로도 제공합니다."
      >
        <rect x="20" y="20" width="320" height="420" fill="none" stroke="#5e93b1" strokeWidth="2" />
        <line x1="20" y1="180" x2="200" y2="180" stroke="#5e93b1" strokeWidth="1.2" />
        <line x1="200" y1="20" x2="200" y2="280" stroke="#5e93b1" strokeWidth="1.2" />
        <line x1="200" y1="280" x2="340" y2="280" stroke="#5e93b1" strokeWidth="1.2" />
        <line x1="120" y1="280" x2="120" y2="440" stroke="#5e93b1" strokeWidth="1.2" />
        <line x1="120" y1="280" x2="200" y2="280" stroke="#5e93b1" strokeWidth="1.2" />

        {rooms.map((r) => {
          const active = hovered === r.key;
          return (
            <g
              key={r.key}
              className={"plan-room" + (active ? " is-active" : "") + (onPick ? " plan-room--pickable" : "")}
              onClick={() => onPick?.(r.key)}
              onMouseEnter={() => onHover?.(r.key)}
              onMouseLeave={() => onHover?.(null)}
            >
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={active ? "rgba(244,201,119,0.18)" : "rgba(94,147,177,0.04)"}
                stroke={active ? "#f4c977" : "transparent"}
                strokeWidth={active ? 1.5 : 0}
                style={{ transition: "fill 200ms ease, stroke 200ms ease" }}
              />
              <text
                x={r.lx}
                y={r.ly}
                fill={active ? "#f4c977" : "#7fb4d0"}
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="1"
                style={{ transition: "fill 200ms ease", pointerEvents: "none" }}
              >
                {r.label}
              </text>
              <text
                x={r.ax}
                y={r.ay}
                fill={active ? "#f4c977" : "#8fb1c4"}
                fontFamily="JetBrains Mono, monospace"
                fontSize="7"
                style={{ transition: "fill 200ms ease", pointerEvents: "none" }}
              >
                {r.area}
              </text>
              <g className="plan-room__furniture">{r.furniture}</g>
            </g>
          );
        })}

        <line x1="100" y1="180" x2="130" y2="180" stroke="#0e2a3d" strokeWidth="3" pointerEvents="none" />
        <line x1="200" y1="100" x2="200" y2="130" stroke="#0e2a3d" strokeWidth="3" pointerEvents="none" />
        <line x1="200" y1="220" x2="200" y2="250" stroke="#0e2a3d" strokeWidth="3" pointerEvents="none" />
        <line x1="160" y1="280" x2="190" y2="280" stroke="#0e2a3d" strokeWidth="3" pointerEvents="none" />
        <g pointerEvents="none">
          <path d="M 100 180 A 30 30 0 0 1 130 150" fill="none" stroke="#3d7a9c" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M 200 100 A 30 30 0 0 1 230 130" fill="none" stroke="#3d7a9c" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M 200 220 A 30 30 0 0 1 230 250" fill="none" stroke="#3d7a9c" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M 160 280 A 30 30 0 0 0 190 310" fill="none" stroke="#3d7a9c" strokeWidth="0.7" strokeDasharray="2 2" />
        </g>

        <g pointerEvents="none">
          <circle cx="155" cy="225" r="3" fill="#f4c977" />
          <circle cx="155" cy="225" r="9" fill="none" stroke="#f4c977" strokeWidth="0.6" opacity="0.7" />
          <text x="170" y="228" fill="#f4c977" fontFamily="JetBrains Mono, monospace" fontSize="8" letterSpacing="1">
            ENTRY
          </text>
          <line x1="20" y1="450" x2="340" y2="450" stroke="#3d7a9c" strokeWidth="0.5" />
          <line x1="20" y1="445" x2="20" y2="455" stroke="#3d7a9c" strokeWidth="0.5" />
          <line x1="340" y1="445" x2="340" y2="455" stroke="#3d7a9c" strokeWidth="0.5" />
          <text x="180" y="448" fill="#7aa3b8" fontFamily="JetBrains Mono, monospace" fontSize="7" textAnchor="middle">
            10 yr · since 2014
          </text>
        </g>
      </svg>
    </div>
  );
}

/**
 * 언어 전환 토글(KO / EN).
 * EN을 누르면 브라우저 내장(온디바이스) 번역 API로 본문을 그 자리에서 영어로 바꾼다
 * (한국에서도 동작). KO는 새로고침으로 원문 복귀. 내장 API가 없는 브라우저(사파리·
 * 파이어폭스 등)에서는 짧은 안내를 띄워 브라우저 자체 번역 기능을 쓰도록 한다.
 *
 * 접속 위치가 한국 밖이면 서버 렌더가 한국어인 걸 모르고 떠날 수 있으므로, 누르기 전에
 * 먼저 영어 안내를 띄워 EN 으로 유도한다. 안내문은 읽을 사람이 영어권이라 영어로 쓰고,
 * 이 토글 전체가 `[data-no-translate]` 안이라 번역에 다시 갈리지 않는다.
 */
export function LangToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"ko" | "en">("ko");
  const [supported, setSupported] = useState(true);
  const [pending, setPending] = useState(false);
  const [hint, setHint] = useState(false);
  const [intl, setIntl] = useState(false);

  useEffect(() => {
    setMode(getPreferredLang());
    setSupported(translatorSupported());
    setIntl(isOutsideKorea());
  }, []);

  const toKo = useCallback(() => {
    if (mode === "ko" || pending) return;
    setPreferredLang("ko");
    window.location.reload();
  }, [mode, pending]);

  const toEn = useCallback(async () => {
    if (mode === "en" || pending) return;
    if (!translatorSupported()) {
      setSupported(false);
      setHint(true);
      window.setTimeout(() => setHint(false), 7000);
      return;
    }
    setPending(true);
    setPreferredLang("en");
    const result = await enableEnglishMode();
    setPending(false);
    if (result.ok) {
      setMode("en");
    } else {
      // 모델 미가용 등 — 원문 유지하고 안내
      setPreferredLang("ko");
      setSupported(result.reason !== "unsupported");
      setHint(true);
      window.setTimeout(() => setHint(false), 7000);
    }
  }, [mode, pending]);

  // 클릭 실패 안내가 있으면 그게 우선, 없으면 해외 접속 유도 안내.
  // 두 경우 다 기존 `.lang-hint` 한 칸을 쓴다 — 자리·폭이 이미 잡혀 있다.
  const message = langHintMessage({ intl, supported, mode, failed: hint });

  return (
    <div
      className={"lang-toggle" + (className ? ` ${className}` : "")}
      role="group"
      aria-label="언어 / Language"
      data-no-translate
    >
      <button
        type="button"
        className={"lang-opt" + (mode === "ko" ? " is-active" : "")}
        onClick={toKo}
        aria-pressed={mode === "ko" ? "true" : "false"}
        lang="ko"
      >
        KO
      </button>
      <span className="lang-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={"lang-opt" + (mode === "en" ? " is-active" : "")}
        onClick={toEn}
        aria-pressed={mode === "en" ? "true" : "false"}
        disabled={pending}
        lang="en"
      >
        {pending ? "…" : "EN"}
      </button>
      {message && (
        <span className="lang-hint" role="status" lang={intl ? "en" : "ko"}>
          {message}
        </span>
      )}
    </div>
  );
}

export function Foot() {
  const data = useSiteData();
  const d = data.identity;
  return (
    <footer className="foot">
      <div>
        © {new Date().getFullYear()} · {d.location}
        {data.build && (
          <>
            {" · "}
            <Link className="foot-build" href="/build-log" aria-label="빌드 로그 보기">
              build {data.build.version}
            </Link>
          </>
        )}
      </div>
      <div className="foot-mid">— hsol.info — a living portfolio —</div>
      <div className="foot-links">
        <Link href="/resume">Resume</Link>
        <a href={d.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${d.email}`}>Email</a>
        <a href={d.calendly} target="_blank" rel="noopener noreferrer">
          Calendly
        </a>
        {/* 뉴스룸 정규 주소는 서브도메인 — 다른 호스트라 절대 URL + 일반 <a>. */}
        <a href={NEWS_URL}>Newsroom</a>
      </div>
    </footer>
  );
}

export function SecHead({
  title,
  num,
  meta,
}: {
  title: string;
  num?: string | number | null;
  meta?: string | null;
}) {
  return (
    <div className="sec-head">
      <div className="sec-title">
        {num != null && <span className="num">§ {num}</span>}
        {title}
      </div>
      {meta && <div className="sec-meta">{meta}</div>}
    </div>
  );
}

export function CoffeeCTA({ title, sub }: { title?: string; sub?: string }) {
  const d = useSiteData().identity;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const loadCalendly = () => {
    if (!document.querySelector("link[data-calendly]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      link.dataset.calendly = "1";
      document.head.appendChild(link);
    }
    const ensureWidget = () => {
      if (!window.Calendly || !ref.current) return false;
      ref.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url:
          d.calendly +
          "?hide_gdpr_banner=1&background_color=0e2a3d&text_color=f2f7fa&primary_color=7fb4d0",
        parentElement: ref.current,
      });
      return true;
    };
    if (!ensureWidget()) {
      let s = document.querySelector(
        "script[data-calendly]",
      ) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement("script");
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.async = true;
        s.dataset.calendly = "1";
        document.body.appendChild(s);
      }
      s.addEventListener("load", ensureWidget, { once: true });
    }
    };

    if (typeof IntersectionObserver === "undefined") {
      loadCalendly();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadCalendly();
          io.disconnect();
        }
      },
      { rootMargin: "160px 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [d.calendly]);

  return (
    <div className="cta cta-calendly">
      <div className="cta-head">
        <div className="cta-eyebrow">Coffee chat — 30 min</div>
        <div className="cta-title">{title || "직접 이야기를 나눠봐도 좋습니다."}</div>
        <p className="cta-sub">
          {sub ||
            "채용·창업·협업·그냥 궁금함 — 어떤 주제든 환영합니다. 아래 캘린더에서 시간을 잡아주세요."}
        </p>
      </div>
      <div className="cta-cal" ref={ref} aria-label="Calendly scheduling widget" />
      <a href={d.calendly} target="_blank" rel="noopener noreferrer" className="cta-fallback">
        새 창으로 calendly 열기 →
      </a>
    </div>
  );
}

export function Back({ onBack }: { onBack: () => void }) {
  return (
    <div className="back-row">
      <button type="button" className="back" onClick={onBack}>
        <span className="back-arrow">←</span> 처음으로 돌아가기
      </button>
      <LangToggle className="back-lang" />
    </div>
  );
}

export function CareerList({
  items,
  itemTiers,
  highlightTier1 = false,
}: {
  items: readonly CareerItem[] | CareerItem[];
  /** `items`와 동일한 길이. tier 1이면 기본 펼침, 그보다 크면 접힌 채로 시작(페르소나별 큐레이션). */
  itemTiers?: readonly number[];
  highlightTier1?: boolean;
}) {
  /** 부모가 매 렌더 `map`으로 새 배열을 넘기면 객체 참조만 바뀌어 동일 데이터인데도 useMemo가 매번 갱신된다 → 시그니처로 안정화 */
  const itemsSignature = items.map((c) => `${c.period}|${c.org}|${c.role}`).join("\0");
  const itemTiersKey = itemTiers?.join("\0") ?? "";

  const initialCollapsed = useMemo(() => {
    if (!highlightTier1) return {};
    return Object.fromEntries(
      items.map((c, i) => {
        const tier = itemTiers?.[i] ?? 1;
        return [`${c.period}-${c.org}-${c.role}-${i}`, tier !== 1];
      }),
    ) as Record<string, boolean>;
    // items / itemTiers 내용은 itemsSignature·itemTiersKey에 반영됨(참조만 바뀌는 재렌더에서 접힘 상태가 덮어씌워지지 않게)
  }, [highlightTier1, itemsSignature, itemTiersKey]);

  const [collapsedByKey, setCollapsedByKey] = useState<Record<string, boolean>>(initialCollapsed);

  useEffect(() => {
    setCollapsedByKey(initialCollapsed);
  }, [initialCollapsed]);

  return (
    <div className="career">
      {items.map((c, i) => {
        const itemKey = `${c.period}-${c.org}-${c.role}-${i}`;
        const tier = itemTiers?.[i] ?? 1;
        const isCollapsible = highlightTier1 && tier !== 1;
        const isCollapsed = isCollapsible ? (collapsedByKey[itemKey] ?? true) : false;
        return (
        <div className={"career-item" + (isCollapsible ? " is-collapsible" : "") + (isCollapsed ? " is-collapsed" : "")} key={i}>
          <div className="career-period-wrap">
            {isCollapsible && (
              <button
                type="button"
                className="career-toggle"
                aria-label={isCollapsed ? "경력 펼치기" : "경력 접기"}
                onClick={() =>
                  setCollapsedByKey((prev) => ({ ...prev, [itemKey]: !isCollapsed }))
                }
              >
                {isCollapsed ? "+" : "−"}
              </button>
            )}
            <div className="career-period">{c.period}</div>
          </div>
          <div className="career-main">
            {isCollapsed ? (
              <div className="career-collapsed-line">{c.org} · {c.role}</div>
            ) : (
              <>
                <div className="career-org">{c.org}</div>
                <div className="career-role">{c.role}</div>
              <ul className="career-points">
                {c.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
              </>
            )}
          </div>
          {!isCollapsed && (
            <div className="career-tags">
              {(c.tags ?? []).map((t, j) => (
                <span className="career-tag" key={j}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )})}
    </div>
  );
}

export function Pillars() {
  const data = useSiteData();
  return (
    <div className="pillars">
      {data.pillars.map((p, i) => (
        <div className="pillar" key={p.key}>
          <div className="pillar-no">PILLAR · 0{i + 1}</div>
          <div className="pillar-name">{p.labelKo}</div>
          <div className="pillar-en">{p.label}</div>
          <div className="pillar-blurb">{p.blurb}</div>
        </div>
      ))}
    </div>
  );
}
