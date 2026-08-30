/**
 * 자기 표기 가드 — "지금도 개발자인 것처럼 읽히는" 연차+직함 표기를 막는다.
 *
 * 정본은 vault `objects/people/임한솔.md` (2026-08-15 본인 확정):
 *   "12년차 개발자"로 소개하지 않는다. 총 경력 12년(2014.08~)은 사실이지만 그 표기는
 *   지금도 개발자인 것처럼 읽힌다. 정확한 표기: "개발자로 10년, 지금은 팀장이자 대표".
 *
 * 사이트 카피는 매 회차 LLM이 vault를 읽고 새로 쓴다. 그래서 히어로 문장을 하나 정해
 * 박아두는 건 다음 refresh 에서 지워진다. 규칙 자체를 (1) 생성 프롬프트와 (2) 산출물
 * 검출기 양쪽에 같은 소스로 공급해, 표기가 매번 재생성되더라도 이 선만은 넘지 않게 한다.
 */

/** 프롬프트에 그대로 끼워 넣는 규칙 본문. 검출기와 같은 파일에 둬서 둘이 어긋나지 않게 한다. */
export const SELF_DESIGNATION_RULE = `[자기 표기 정본 - 위반 시 산출물 거부]
임한솔을 연차+직함("N년차 개발자", "N년 차 엔지니어", "N년 경력의 엔지니어", "10+년차 개발자", "12년차 개발자 출신")으로 소개하지 않는다. 총 경력 12년(2014.08~)은 사실이지만 그 표기는 지금도 개발자인 것처럼 읽힌다. 현직은 프루퍼 주식회사 대표이자 PPB Studios 플랫폼팀 팀장이다.
- 이렇게 쓴다: "개발자로 10년, 지금은 팀장이자 대표", "엔지니어로 시작해 지금은 프루퍼 대표이자 PPB Studios 플랫폼팀 팀장", "엔지니어 출신 메이커".
- 총 경력을 기간·수치로 적는 것은 허용한다: "12년+ (since 2014)" 같은 라벨, "12년 동안", "12년치 궤적", "12년간 개발자로 일하면서" 같은 과거 서술.
- 금지되는 것은 연차를 현재 직함처럼 붙이는 표기 하나다. 기간 사실 자체를 지우지는 마라.
- 가운뎃점 나열도 같은 위반이다: "개발자로 10년 · CEO · 팀장" 처럼 과거 경력과 현직을 같은 층위로 늘어놓으면 셋 다 현직으로 읽힌다. "지금은"에 해당하는 전환어를 반드시 넣는다 - "개발자로 10년, 지금은 CEO @ 프루퍼 · 플랫폼팀 팀장 @ 피피비스튜디오스".
- 영어도 같은 규칙이다. 쓰지 않는다: "12-year developer", "engineer with 12 years", "10 years as an engineer · CEO · Platform Team Lead". 이렇게 쓴다: "Engineer for 10 years, now CEO @ Proofer Inc. · Platform Team Lead @ PPB-Studios Inc.", "Ten years as an engineer, now CEO & Platform Team Lead".`;

/**
 * 연차 + 개발자/엔지니어 직함. "12년차 개발자" / "12년 차 엔지니어" / "12년 경력의 엔지니어"
 * / "10+년차 개발자" 를 잡고, "12년 동안"·"12년치"·"12년+ (since 2014)"·"12년간 개발자로
 * 일하면서" 는 잡지 않는다(연차 조사 `차`·`경력의` 가 있어야 매치).
 * 앞자리 lookbehind 는 "2012년차" 같은 연도 오탐을 막는다.
 */
const DESIGNATION =
  /(?<![0-9])[0-9]{1,2}\s*\+?\s*년\s*(?:차|경력의)\s*(?:소프트웨어\s*)?(?:개발자|엔지니어|디벨로퍼)/g;

/**
 * 영어판의 같은 표기. "12-year developer" / "12 year engineer" / "engineer with 12 years" /
 * "developer of 12 years". 연차를 직함에 붙여 현직처럼 만드는 형태만 잡고, "12 years of
 * experience"·"since 2014" 같은 기간 서술은 잡지 않는다.
 */
const DESIGNATION_EN =
  /\b(?:[0-9]{1,2}\s*\+?[-\s]?year[s]?[-\s]?(?:old\s+)?(?:software\s+)?(?:developer|engineer)|(?:software\s+)?(?:developer|engineer)\s+(?:with|of)\s+[0-9]{1,2}\s*\+?\s*years?)\b/gi;

/**
 * 나열형 - 과거 개발자 경력과 현직을 가운뎃점으로 같은 층위에 늘어놓는 형태.
 * "개발자로 10년 · CEO @ ..." / "10 years as an engineer · CEO · ..." 처럼 연차 표기 바로 뒤에
 * 구분자가 오면 잡는다. 전환어를 넣은 정본("개발자로 10년, 지금은 CEO ...", "Engineer for 10
 * years, now CEO ...")은 구분자 앞에 쉼표+전환어가 들어가므로 매치되지 않는다.
 */
const DESIGNATION_LIST =
  /(?:(?:개발자|엔지니어|디벨로퍼)(?:로|으로)\s*[0-9]{1,2}\s*년|[0-9]{1,2}\s*\+?\s*years?\s+as\s+an?\s+(?:software\s+)?(?:developer|engineer)|(?:developer|engineer)\s+for\s+[0-9]{1,2}\s*\+?\s*years?)\s*(?=[·|])/gi;

/** 위 셋을 한 번에 훑는다. 새 패턴은 여기에만 더하면 프롬프트·검출기 양쪽에 같이 반영된다. */
const DESIGNATION_PATTERNS = [DESIGNATION, DESIGNATION_EN, DESIGNATION_LIST];

export type SelfDesignationViolation = {
  /** site-data 기준 경로. 예: portfolioCopy.home.heroSubLead */
  path: string;
  /** 걸린 표기. 예: "12년 경력의 엔지니어" */
  match: string;
};

/** 문자열/배열/객체를 재귀로 훑어 위반 표기를 모은다. 구조는 건드리지 않는다. */
export function findSelfDesignationViolations(
  value: unknown,
  path = "",
): SelfDesignationViolation[] {
  if (typeof value === "string") {
    return DESIGNATION_PATTERNS.flatMap((pattern) =>
      [...value.matchAll(pattern)].map((m) => ({
        path: path || "<root>",
        match: m[0],
      })),
    );
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findSelfDesignationViolations(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      findSelfDesignationViolations(v, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

/** 재생성 프롬프트에 붙일 검증 힌트. 위반이 없으면 null. */
export function selfDesignationHint(value: unknown): string | null {
  const violations = findSelfDesignationViolations(value);
  if (violations.length === 0) return null;
  const listed = violations
    .slice(0, 12)
    .map((v) => `${v.path}: "${v.match}"`)
    .join("\n");
  return `자기 표기 정본 위반 - 연차를 현재 직함처럼 붙인 표기를 지워라(기간 사실은 남겨도 된다):\n${listed}`;
}
