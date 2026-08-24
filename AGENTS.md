## 최우선 규약: Vault-First

프로젝트 관련 질문·작업이면 답변·수정 전에 `hsol-info-blob/vault/README.md` 를 먼저 읽고
관련 디렉토리를 탐색한다. 대화 중 vault 에 없는 새 사실을 알게 되면 답변 직후 능동적으로
vault 에 반영한다. 상세 트리거·절차·예외는 `hsol-info-blob/CLAUDE.md` 의 "절대 규칙" 두
섹션을 그대로 따른다. 단 `object-views/site-data.json` 과 `datasources/<출처>/` 본문은
생성기·sync 도구 전용이므로 직접 편집하지 않는다.

## Learned User Preferences

- 일반 대화 응답에서는 저장소 안의 소스 경로나 파일명을 직접 나열하지 말고, 모듈·기능·역할로만 짚길 기대한다(코드 인용 블록이 꼭 필요한 경우는 예외).
- Vercel CLI의 자동 링크(`vercel link --yes` 등)가 대시보드에서 쓰는 프로젝트와 다르면, 지정한 팀·프로젝트로 다시 맞추길 기대한다.
- 포트폴리오 상세에서 Ask Hansol(ChatDock)은 데스크톱에서는 기본으로 열리되, 모바일 뷰포트(약 `max-width: 768px`)에서는 기본으로 닫힌 상태를 기대한다.
- Ask Hansol 답변에는 "vault에서 확인", "Blob에서", "운영 매뉴얼상…"처럼 내부 출처·저장소 이름·조회 과정을 드러내는 표현을 넣지 않길 기대한다.
- 가족·배우자·결혼 여부 등은 vault에 적혀 있으면 Ask 답변에 말해도 되고, 운영 매뉴얼의 "외부 비공개" 문구만으로 vault에 있는 사실을 숨기거나 거절하는 답은 원하지 않는다.
- ChatDock이 열릴 때는 플로팅 ASK 버튼을 숨기고(투명 영역의 × FAB로 바꾸지 않음), 닫기는 헤더의 ×만 쓰길 기대한다.
- Ask Hansol(특히 드래그·선택 텍스트로 이어지는 질문)은 과친한 칭찬·환호로 시작하는 도입부 없이 담백하게 본론 위주로 답하길 기대한다. 쉬운 풀이식 설명보다는 포트폴리오 본문만으로 부족할 때 보완하는 수준의 밀도를 선호한다.
- `content:refresh:claude`로 채워지는 방문자 노출 한국어 카피는 자기소개서형 첫 문장·이름 주도 템플릿(예: 「저는 ~로」「~은」으로 문단 시작)을 피하고, 해당 스크립트에 적어 둔 전역 산문 문체 규칙을 따르길 기대한다.
- Google Analytics 등 선택적 측정·분석 스크립트는 대응하는 환경 변수가 없거나 비어 있으면 레이아웃에 포함하지 않길 기대한다.

## Learned Workspace Facts

- 이 저장소의 Vercel 배포 대상 프로젝트는 팀 `hsol`의 `hsol-info`이다(`vercel link --scope hsol --project hsol-info`로 맞출 수 있다). Web Analytics를 쓰려면 해당 프로젝트에서 기능을 활성화하고 루트 레이아웃에 `@vercel/analytics/next`의 `<Analytics />`를 둔다([시작 가이드](https://vercel.com/docs/analytics/quickstart?framework=nextjs)). Google Analytics 4(gtag)는 `NEXT_PUBLIC_GA_MEASUREMENT_ID`가 비어 있지 않을 때만 스크립트와 클라이언트 `page_path` 갱신을 넣고, 없으면 넣지 않는다.
- `vercel env pull`은 기본이 development 환경이라, Production·Preview에만 있는 변수는 `.env.local`에 포함되지 않을 수 있다.
- 이 저장소는 Vercel 서버 렌더로 배포한다. `next.config.ts` 에 `output: "export"` 가 없고 `force-dynamic` 라우트(`/resume`, `/api/*`, `/manage/*` 등)가 여럿이라, 정적보내기 전제(산출물 `out/`, `app/api/*` 미배포로 `/api/*` 404, `force-dynamic` 금지, `vercel.json` 의 `outputDirectory` 중복 주의)는 지금 이 저장소에 적용되지 않는다. 다시 정적 export 로 돌린다면 그 넷을 함께 되짚어야 한다.
- `getSiteData()`는 Blob -> `hsol-info-blob/vault/object-views/site-data.json` -> 커밋된 `src/data/site.ts`의 `HSOL_DATA` 순으로 폴백한다.
- GitHub Actions 워크플로 `build-with-vault-refresh.yml`은 체크아웃된 서브모듈 vault를 그대로 쓴다. `content:refresh:claude`로 사이트 데이터 JSON을 갱신한 뒤, **부모 저장소의 현재 커밋 SHA 등**을 `vault/object-views/` 아래 전용 JSON에 매 실행 기록해 vault 트리가 항상 한 번은 바뀌게 한다(코드만 바뀐 푸시에서도 Blob·generate 쪽이 vault 변경을 감지할 수 있게). 이어서 서브모듈 커밋을 만들어 `hsol-info-blob` 원격 `main` 등(워크플로 `SUBMODULE_BRANCH`)으로만 푸시한다. **vault ↔ Vercel Blob 중 업로드는 오직** `hsol-info-blob` 저장소의 `Sync vault to Vercel Blob` 워크플로만 한다(저장소 시크릿 `BLOB_READ_WRITE_TOKEN` 필요). **Blob → 로컬 vault 내려받기**도 같은 저장소에서 `npm run sync:blob:pull`로만 한다. `GIT_DIFF_BASE_SHA`/`GIT_DIFF_HEAD_SHA`는 refresh 스킵 판단 등에 쓴다. `content:refresh:claude` 실패 시 `generated/content-refresh-failures/`를 아티팩트로 올린다.
- `scripts/refresh-site-data-with-claude.ts`는 `ANTHROPIC_MAX_TOKENS`(기본 64000)로 출력 상한을 두며, 응답이 `stop_reason=max_tokens`로 잘리면 파싱하지 않고 실패·덤프한다. 실패 본문은 기본적으로 `generated/content-refresh-failures/`에 쓴다. `tool_use` 페이로드에서 문자열로 감긴 JSON·루트 래핑(`data`/`siteData` 등)·모델이 자주 내는 대체 키 형태는 정규화·매핑 후 스키마 검증을 다시 시도한다.
- 서브모듈 저장소의 Blob→vault 풀 스크립트는 `.DS_Store`(및 `.DS-Store` 파일명)를 내려받지 않고 로컬 정리 시에도 제외한다.
- Ask Hansol API(`src/app/api/ask-hansol/route.ts`)는 시스템 프롬프트에 `vault/README.md`(vault 탐색·읽기 절차용 지침이며 답변 사실을 채우는 발췌 문서가 아님)와 `vault/object-views/AI-클론-운영-매뉴얼.md`를 넣고, Blob 토큰은 `ASK_HANSOL_BLOB_TOKEN`, `BLOB_READ_WRITE_TOKEN`, `BLOB_READ_TOKEN` 순으로 쓴다. Claude는 `blob_lookup`으로 본문 근거 문서를 추가 조회한다.
- Ask Hansol API가 서버 함수로 실제 배포되는 환경에서는 세션 히스토리 GET이 DB를 읽으므로 `export const dynamic = "force-dynamic"`으로 두고, 클라이언트 히스토리·질문 `fetch`에는 `cache: "no-store"`를 쓴다(`force-static`이면 GET이 빌드·CDN에 고정되어 대화 목록이 비어 보일 수 있다). 순수 정적 export만 쓰는 빌드와는 타깃이 다를 수 있다.
- Ask Hansol 답변 URL 처리는 `src/lib/ask-hansol/answer-linkify.ts`에서 마크다운·괄호 등을 평문으로 정리한 뒤 클라이언트에서 분리 렌더하며, `https`/`http`뿐 아니라 `www.` 접두·스킴 없는 호스트 형태·`mailto:` 등도 링크로 인식한다.
- Preview Deployment Protection 환경에서 `ask-hansol-selection`이 `ask-hansol`로 서버-서버 재호출할 때는 원 요청의 `cookie`/`authorization`을 전달해야 내부 호출 401을 피할 수 있다.
- Actions secret `SUBMODULES_PAT`는 서브모듈 체크아웃과 `hsol-info-blob` 원격 브랜치 푸시에 쓰이며, fine-grained PAT는 대상 저장소 **Contents 읽기·쓰기**(classic은 `repo`)와 조직 SSO authorize가 필요하다. `build-with-vault-refresh` 등에서 원격이 앞설 때는 fetch·작업 브랜치 재구성 또는 rebase 후 push 재시도로 non-fast-forward를 흡수한다. 포트폴리오 등에서 쓰는 대형 Mermaid `classDef` 클래스명은 페이지 전역 CSS(예: `.view`)와 선택자 충돌하지 않도록 `mermaid-` 같은 접두를 둔다. `siteData.career[].points`는 항목당 3개 이상 5개 이하만 유효하다(Zod 및 refresh 폴백이 맞춘다).
- 페르소나 페이지(hire·collab·builder·curious)는 `composition.pages[key].nodes` 트리로 렌더되고(BlockList → composition 우선 → ComposeRenderer), 이 트리는 `scripts/refresh-site-data-with-claude.ts`의 `generateComposition`이 **한 페이지씩 독립 호출**로 생성한다. 페이지 간 통일성이 어긋나면(예: /collab만 헤더가 다르게 렌더) 산출물(site-data.json)을 직접 손대지 말고 이 생성기(프롬프트 원칙 #6 또는 `enforceCompositionSkeleton`/`ensureRequiredComposeNodes` 같은 결정적 가드레일)에서 고친다. **섹션 헤더 규약(네 페이지 동일, 프롬프트 #6에 명문화)**: `Section` props = `title`(한국어만, 제목 안 괄호 영문 금지) + `eyebrow`(영문 kicker 한 곳에만) + `num`("01" 2자리, § 직접 금지 — `SecHead`가 "§ " 자동 부착) + `dataSection`(필수 소문자 슬러그, Ask '지금 보는 섹션' 추적용). `meta`는 헤더 우측에 라벨을 또 렌더해 eyebrow와 이중 표기되므로 쓰지 않는다.
- `/sitemap.xml`은 빌드 산출물이 아니라 런타임 라우트다. `src/app/sitemap.xml/route.ts` 와 확장자 없는 하위호환 `src/app/sitemap/route.ts` 가 `src/lib/seo/sitemap.ts` 의 `buildMainSitemapXml()` 을 불러 응답하며(`revalidate = 3600`), `next-sitemap` 도 `postbuild` 도 쓰지 않는다. URL 목록의 단일 출처는 `src/content/site-structure.ts` 의 `SITE_STRUCTURE[key].inSitemap` 이고(`/architecture` 는 `inSitemap: false` 라 빠진다), 여기에 `sitemap.ts` 의 `EXTRA_ROUTES`(`/resume`) 와 `SUBDOMAIN_ENTRIES`(`blog.hsol.info`, `news.hsol.info` 루트)가 더해진다. 뉴스룸 개별 기사는 `src/app/news/sitemap` 이 따로 책임진다. `<urlset>`은 sitemaps.org 단일 네임스페이스만 사용한다(deprecated `xmlns:mobile` 등 next-sitemap 기본 네임스페이스는 GSC 진단 노이즈 원인이라 제거). 루트 URL은 `<link rel="canonical">` 매칭을 위해 trailing slash 없이 `https://hsol.info`로 둔다. `robots`는 `src/app/robots.ts` 하나뿐이고(정적 `public/robots.txt` 없음), Yandex 전용 `host` 디렉티브를 두지 않는다.
