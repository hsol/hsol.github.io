/**
 * 자기 표기 가드 자체 점검:
 *   npx tsx src/lib/self-designation.check.ts
 *
 * 실제 hsol.info 산출물에서 뽑아온 문장으로 잡을 것/놓칠 것을 고정한다.
 */
import assert from "node:assert";

import { findSelfDesignationViolations, selfDesignationHint } from "./self-designation";

const hits = (s: string) => findSelfDesignationViolations(s).map((v) => v.match);

// 잡아야 하는 표기 (2026-08-24 hsol.info 라이브에서 채집)
assert.deepStrictEqual(hits("12년 경력의 엔지니어이자 스타트업을 창업한 메이커."), [
  "12년 경력의 엔지니어",
]);
assert.deepStrictEqual(hits("씨엔티테크를 거친 12년차 소프트웨어 엔지니어이자 스타트업 대표"), [
  "12년차 소프트웨어 엔지니어",
]);
assert.deepStrictEqual(hits("12년 차 엔지니어,"), ["12년 차 엔지니어"]);
assert.deepStrictEqual(hits("온라인의 기술과 오프라인의 운영을 잇는 12년차 엔지니어입니다."), [
  "12년차 엔지니어",
]);
assert.deepStrictEqual(hits("12년차 개발자 출신 CEO로"), ["12년차 개발자"]);
assert.deepStrictEqual(hits("10+년차 개발자"), ["10+년차 개발자"]);

// 나열형 - 과거 경력과 현직을 가운뎃점으로 늘어놓아 셋 다 현직으로 읽히는 형태 (PRF-149,
// 원페이저 헤더에서 채집). "지금은"에 해당하는 전환어가 없으면 위반이다.
assert.deepStrictEqual(
  hits("오프라인 사업의 DX·AX · 개발자로 10년 · CEO @ 프루퍼 ㈜ · 플랫폼팀 팀장"),
  ["개발자로 10년 "],
);
assert.deepStrictEqual(hits("10 years as an engineer · CEO · Platform Team Lead"), [
  "10 years as an engineer ",
]);
assert.deepStrictEqual(hits("Engineer for 10 years · CEO @ Proofer Inc."), [
  "Engineer for 10 years ",
]);

// 영어 연차+직함
assert.deepStrictEqual(hits("a 12-year developer based in Seoul"), ["12-year developer"]);
assert.deepStrictEqual(hits("engineer with 12 years of hands-on delivery"), [
  "engineer with 12 years",
]);

// 놓쳐야 하는 표기 - 기간·수치 사실은 규칙이 허용한다
for (const ok of [
  "12년 동안 제품을 만든다는 것의 정의를 계속 갱신해 왔습니다.",
  "한 사람의 12년치 궤적을 펼쳐놓으면.",
  "12년+ (since 2014)",
  "12년간 개발자로 일하면서 제가 어떤 사람인지도 모른 채",
  "12년 개발자로서의 자기 정체성을 정리한 전자책",
  "30세 · 사회 12년차",
  "2012년부터 14년간 1,008편을 쌓아 온 초기 블로그",
  "개발자로 10년, 지금은 프루퍼 대표이자 PPB Studios 팀장",
  "10년+ 엔지니어 출신 메이커의 일과 생각",
  // 전환어가 들어간 정본은 나열 기호가 뒤따라도 통과해야 한다 (PRF-149)
  "개발자로 10년, 지금은 CEO @ 프루퍼 ㈜ · 플랫폼팀 팀장 @ ㈜ 피피비스튜디오스",
  "Engineer for 10 years, now CEO @ Proofer Inc. · Platform Team Lead @ PPB-Studios Inc.",
  "Ten years shipping software as an engineer, now serving as both CEO and Platform Lead",
  "12 years of experience across commerce and fintech",
]) {
  assert.deepStrictEqual(hits(ok), [], `오탐: ${ok}`);
}

// 중첩 구조에서 경로가 붙는다
assert.deepStrictEqual(
  findSelfDesignationViolations({
    portfolioCopy: { home: { heroSubLead: "12년 경력의 엔지니어이자" } },
    faq: [{ a: "괜찮은 문장" }, { a: "12년차 개발자." }],
  }),
  [
    { path: "portfolioCopy.home.heroSubLead", match: "12년 경력의 엔지니어" },
    { path: "faq[1].a", match: "12년차 개발자" },
  ],
);

// 힌트는 위반이 없으면 null
assert(selfDesignationHint({ a: "개발자로 10년, 지금은 팀장이자 대표" }) === null);
assert(selfDesignationHint({ a: "12년차 개발자" })?.includes("faq") !== true);
assert(selfDesignationHint({ a: "12년차 개발자" })?.includes('a: "12년차 개발자"') === true);

console.log("self-designation.check.ts OK");
