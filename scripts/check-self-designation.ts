/**
 * 빌드 게이트 — 배포 산출물에 연차+직함("12년차 개발자") 표기가 남아 있으면 빌드를 세운다.
 *
 * `npm run build` 전에 npm 이 자동으로 돌린다(package.json prebuild). vercel.json 의
 * buildCommand 도 `npm run build` 라 배포 경로에서 그대로 강제된다.
 *
 * 검사 대상은 (1) 커밋된 `src/data/site.ts` 와 (2) 원페이저 HTML(KO·EN) 이다. site.ts 는 vault
 * 서브모듈이 없는 환경에서도 돌아야 해서 site-data.json 이 아니라 이 쪽을 본다. 원페이저는
 * 서브모듈에만 있어 없을 수 있으므로 **있을 때만** 검사한다 — 이력서로 나가는 문서라 site.ts 만
 * 보다가 헤더 한 줄이 새어 나간 적이 있다(PRF-149). 생성 단계 게이트는
 * scripts/generate-site-ts-from-vault.ts, 규칙 본문은 src/lib/self-designation.ts.
 */
import { readFileSync } from "node:fs";
import { HSOL_DATA } from "../src/data/site";
import { findSelfDesignationViolations } from "../src/lib/self-designation";

const ONEPAGER_PATHS = [
  process.env.VAULT_ONEPAGER_HTML_PATH ?? "hsol-info-blob/vault/object-views/onepager-ko.html",
  process.env.VAULT_ONEPAGER_EN_HTML_PATH ?? "hsol-info-blob/vault/object-views/onepager-en.html",
];

const targets: { label: string; value: unknown }[] = [{ label: "site.ts", value: HSOL_DATA }];
for (const file of ONEPAGER_PATHS) {
  try {
    targets.push({ label: file, value: readFileSync(file, "utf8") });
  } catch {
    console.log(`self-designation gate: ${file} 없음 — 건너뜀.`);
  }
}

const violations = targets.flatMap(({ label, value }) =>
  findSelfDesignationViolations(value, label),
);
if (violations.length > 0) {
  console.error("자기 표기 정본 위반 - 연차를 현재 직함처럼 붙인 표기가 배포 산출물에 남아 있다:");
  for (const v of violations) console.error(`  ${v.path}: "${v.match}"`);
  console.error("\n고치는 곳: vault 원문 → npm run content:generate:site-ts (규칙: src/lib/self-designation.ts)");
  process.exit(1);
}
console.log(`self-designation gate OK (${targets.length} target(s) scanned)`);
