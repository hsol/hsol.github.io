/**
 * 언어 안내문·접속 위치 판정 자체검증. 실행: `npx tsx src/lib/i18n/page-translate.test.ts`
 * 프레임워크 없음 — node:assert 로 깨지면 던진다.
 */
import assert from "node:assert/strict";
import { isOutsideKorea, langHintMessage } from "./page-translate";

const en = (s: string | null) => s !== null && !/[가-힣]/.test(s);
const ko = (s: string | null) => s !== null && /[가-힣]/.test(s);

// 해외 + KO 화면 → EN 유도, 영어로
assert.equal(
  langHintMessage({ intl: true, supported: true, mode: "ko", failed: false }),
  "Korean site. Tap EN for English.",
);
// 해외 + 번역 미지원 브라우저(사파리 등) → 누르라고 하지 않고 브라우저 번역으로 보낸다
{
  const m = langHintMessage({ intl: true, supported: false, mode: "ko", failed: false });
  assert.ok(en(m) && !/Tap EN/.test(m!), m ?? "null");
}
// 해외지만 이미 EN 으로 보고 있으면 띄울 말이 없다
assert.equal(langHintMessage({ intl: true, supported: true, mode: "en", failed: false }), null);
// 국내 접속은 원문이 이미 원하는 화면 — 어떤 조합이든 유도 안내 없음
for (const supported of [true, false]) {
  for (const mode of ["ko", "en"] as const) {
    assert.equal(langHintMessage({ intl: false, supported, mode, failed: false }), null);
  }
}
// 클릭 실패는 유도 안내를 덮는다(누른 사람에게 줄 말이 먼저)
assert.notEqual(
  langHintMessage({ intl: true, supported: true, mode: "ko", failed: true }),
  langHintMessage({ intl: true, supported: true, mode: "ko", failed: false }),
);
// 실패 안내 언어는 접속 위치를 따른다 — 해외는 영어, 국내는 한국어
for (const supported of [true, false]) {
  assert.ok(en(langHintMessage({ intl: true, supported, mode: "ko", failed: true })));
  assert.ok(ko(langHintMessage({ intl: false, supported, mode: "ko", failed: true })));
}

// isOutsideKorea: Asia/Seoul 만 국내
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

console.log("page-translate: all assertions passed.");
