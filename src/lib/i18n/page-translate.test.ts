/**
 * 언어 안내문·접속 위치 판정·EN 진입 실패 통지 자체검증.
 * 실행: `npx tsx src/lib/i18n/page-translate.test.ts`
 * 프레임워크 없음 — node:assert 로 깨지면 던진다.
 */
import assert from "node:assert/strict";
import {
  isOutsideKorea,
  langHintMessage,
  notifyEnglishEntryFailure,
  onEnglishEntryFailure,
  takeEnglishEntryFailure,
} from "./page-translate";

const en = (s: string | null) => s !== null && !/[가-힣]/.test(s);
const ko = (s: string | null) => s !== null && /[가-힣]/.test(s);
const base = { intl: false, enEntry: false, supported: true, mode: "ko" as const, failed: false };

// --- 유도 안내 ---
// 해외 + KO 화면 → EN 유도, 영어로
assert.equal(
  langHintMessage({ ...base, intl: true }),
  "Korean site. Tap EN for English.",
);
// 해외 + 번역 미지원 브라우저(사파리 등) → 누르라고 하지 않고 브라우저 번역으로 보낸다
{
  const m = langHintMessage({ ...base, intl: true, supported: false });
  assert.ok(en(m) && !/Tap EN/.test(m!), m ?? "null");
}
// 해외지만 이미 EN 으로 보고 있으면 띄울 말이 없다
assert.equal(langHintMessage({ ...base, intl: true, mode: "en" }), null);
// 국내 접속은 원문이 이미 원하는 화면 — 어떤 조합이든 유도 안내 없음
for (const supported of [true, false]) {
  for (const mode of ["ko", "en"] as const) {
    assert.equal(langHintMessage({ ...base, supported, mode }), null);
  }
}

// --- 실패 안내 ---
// 클릭/진입 실패는 유도 안내를 덮는다(누른 사람에게 줄 말이 먼저)
assert.notEqual(
  langHintMessage({ ...base, intl: true, failed: true }),
  langHintMessage({ ...base, intl: true }),
);
// 실패 안내 언어는 접속 위치를 따른다 — 해외는 영어, 국내는 한국어
for (const supported of [true, false]) {
  assert.ok(en(langHintMessage({ ...base, intl: true, supported, failed: true })));
  assert.ok(ko(langHintMessage({ ...base, supported, failed: true })));
}
// 국내에서 /en 을 타고 왔어도 영어를 달라고 한 사람이다 — 실패 설명은 영어로
for (const supported of [true, false]) {
  assert.ok(en(langHintMessage({ ...base, enEntry: true, supported, failed: true })));
}
// /en 진입 실패 + 미지원 브라우저 → 원문이라는 사실과 대안을 같이 준다
{
  const m = langHintMessage({ ...base, enEntry: true, supported: false, failed: true });
  assert.ok(en(m) && /Korean original/.test(m!) && /browser/.test(m!), m ?? "null");
}

// --- isOutsideKorea: Asia/Seoul 만 국내 ---
{
  const real = Intl.DateTimeFormat;
  const stub = (tz: string | undefined) => {
    // @ts-expect-error 테스트용 최소 스텁
    Intl.DateTimeFormat = () => ({ resolvedOptions: () => ({ timeZone: tz }) });
  };
  try {
    stub("Asia/Seoul");
    assert.equal(isOutsideKorea(), false);
    stub("America/New_York");
    assert.equal(isOutsideKorea(), true);
    stub("Europe/London");
    assert.equal(isOutsideKorea(), true);
    // 시간대를 못 읽으면 안내를 띄우지 않는다(원문이 기본이라 가장 안전)
    stub(undefined);
    assert.equal(isOutsideKorea(), false);
    // @ts-expect-error 던지는 환경도 false
    Intl.DateTimeFormat = () => { throw new Error("unsupported"); };
    assert.equal(isOutsideKorea(), false);
  } finally {
    Intl.DateTimeFormat = real;
  }
}

// --- EN 진입 실패 통지 ---
// 구독자에게 즉시 전달된다
{
  const seen: string[] = [];
  const off = onEnglishEntryFailure((r) => seen.push(r));
  notifyEnglishEntryFailure("unavailable");
  assert.deepEqual(seen, ["unavailable"]);
  off();
  notifyEnglishEntryFailure("error");
  assert.deepEqual(seen, ["unavailable"], "구독 해제 후에는 안 와야 한다");
  takeEnglishEntryFailure();
}
// 구독 전에 발생한 실패도 대기 슬롯에서 1회 흡수된다 — 미지원 브라우저는
// 부트스트랩이 토글 마운트보다 먼저 동기 판정하므로 이 경로가 실제로 쓰인다
{
  notifyEnglishEntryFailure("unsupported");
  assert.equal(takeEnglishEntryFailure(), "unsupported");
  assert.equal(takeEnglishEntryFailure(), null, "흡수 후에는 비어 있어야 한다");
}

console.log("page-translate: all assertions passed.");
