import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { siteDataSchema } from "../src/content/schema";
import { findSelfDesignationViolations } from "../src/lib/self-designation";

const SOURCE_PATH =
  process.env.VAULT_SITE_DATA_PATH ??
  "hsol-info-blob/vault/object-views/site-data.json";
const OUTPUT_PATH = process.env.SITE_TS_OUTPUT_PATH ?? "src/data/site.ts";

async function main() {
  const sourceText = await readFile(SOURCE_PATH, "utf8");
  const sourceJson = JSON.parse(sourceText);
  const parsed = siteDataSchema.parse(sourceJson);

  // 표기 정본 가드(빌드 게이트) — 연차+직함("12년차 개발자")이 site-data 에 남아 있으면
  // 여기서 멈춘다. 히어로 문장 하나를 정해두는 대신 이 선을 두는 이유는, 카피가 매 회차
  // 새로 생성돼도 규칙만은 통과 조건으로 남기 위해서다. 규칙 본문은 src/lib/self-designation.ts.
  const violations = findSelfDesignationViolations(parsed);
  if (violations.length > 0) {
    throw new Error(
      "자기 표기 정본 위반 - 연차를 현재 직함처럼 붙인 표기가 site-data 에 남아 있다:\n" +
        violations.map((v) => `  ${v.path}: "${v.match}"`).join("\n"),
    );
  }

  const outputDir = path.dirname(OUTPUT_PATH);
  await mkdir(outputDir, { recursive: true });
  const output = `import { siteDataSchema } from "@/content/schema";

/** Generated from vault/object-views/site-data.json */
export const HSOL_DATA = siteDataSchema.parse(${JSON.stringify(parsed, null, 2)} as const);

export type SiteData = typeof HSOL_DATA;
`;

  await writeFile(OUTPUT_PATH, output, "utf8");
  console.log(`Generated ${OUTPUT_PATH} from ${SOURCE_PATH}`);
}

main().catch((error) => {
  console.error("Failed to generate site.ts from vault.");
  console.error(error);
  process.exit(1);
});
