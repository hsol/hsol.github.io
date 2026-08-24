/**
 * 원페이저 번역의 순수 부분 — 자르기·검증. 모델 호출과 파일 IO 는 scripts/translate-onepager.ts.
 * (site-data-patch.ts 와 같은 배치: 검증 로직만 떼어내 테스트 가능하게 둔다.)
 */

/** 번역에 보내지 않고 자리만 잡아둘 <style> 자리표. */
export const STYLE_SLOT = "<!--ONEPAGER_STYLE-->";

/** EN 파일 첫 줄 소스 스탬프 — 재번역 여부를 이걸로 판단한다. */
const STAMP_RE = /^<!--\s*translated-from:\s*sha256:([0-9a-f]{64})\s*-->/;

/**
 * <style> 블록을 자리표로 뺀다. CSS 가 파일의 40% 인데 번역 대상이 아니고, 무엇보다
 * 모델이 CSS 를 건드리면 A4 인쇄 레이아웃이 조용히 깨진다. 아예 안 보여주는 게 확실하다.
 */
export function splitStyle(html: string): { style: string; skeleton: string } {
  const match = html.match(/<style\b[^>]*>[\s\S]*?<\/style>/i);
  if (!match) return { style: "", skeleton: html };
  return { style: match[0], skeleton: html.replace(match[0], STYLE_SLOT) };
}

/** 태그(속성 포함) 나열. 번역은 텍스트만 바꾸므로 이 나열은 완전히 같아야 한다. */
export function tagSignature(html: string): string[] {
  return html.match(/<[^>]+>/g) ?? [];
}

/** 화면에 보이는 텍스트(태그·주석 제외, 공백 정규화). */
export function visibleText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** 화면에 보이는 텍스트의 한글 글자 수(태그 안은 제외). */
export function hangulCount(html: string): number {
  return (visibleText(html).match(/[가-힣]/g) ?? []).length;
}

/**
 * 프롬프트에 적어줄 분량 목표(하드 게이트가 아니다). 한국어는 글자당 정보량이 커서 직역하면
 * 1.8배까지 부는데, 그러면 2장짜리 원페이저가 3장이 된다. 다만 글자 수는 쪽수의 대리 지표일 뿐이라
 * (실제 쪽 나눔은 break-inside 규칙이 정한다) 합격 판정은 렌더한 PDF 쪽수로 한다.
 */
export const LENGTH_TARGET = 1.5;

/**
 * 번역 결과 검증. 문제 목록을 돌려준다(빈 배열이면 통과).
 * 구조가 한 글자라도 달라지면 실패시킨다 — 원페이저는 레이아웃이 곧 신뢰다.
 */
export function validateTranslation(skeleton: string, output: string): string[] {
  const problems: string[] = [];
  const trimmed = output.trim();

  if (!/^<article\s+class\s*=\s*["']onepager["']/i.test(trimmed)) {
    problems.push('루트가 <article class="onepager"> 로 시작하지 않는다.');
  }

  const slots = trimmed.split(STYLE_SLOT).length - 1;
  if (slots !== 1) problems.push(`${STYLE_SLOT} 자리표가 정확히 1개여야 하는데 ${slots}개다.`);

  const before = tagSignature(skeleton);
  const after = tagSignature(trimmed);
  if (before.length !== after.length) {
    problems.push(
      `태그 수가 다르다(원본 ${before.length} → 결과 ${after.length}). 태그는 그대로 둬야 한다.`,
    );
  } else {
    const diff = before.findIndex((tag, i) => tag !== after[i]);
    if (diff !== -1) {
      problems.push(
        `${diff + 1}번째 태그가 다르다: 원본 \`${before[diff]}\` → 결과 \`${after[diff]}\`. 태그·속성·클래스는 그대로 둬야 한다.`,
      );
    }
  }

  // 고유명사 등 약간은 남을 수 있으나, 본문이 한국어로 남으면 번역 실패다.
  const source = hangulCount(skeleton);
  const left = hangulCount(trimmed);
  if (left > Math.max(3, Math.floor(source * 0.02))) {
    problems.push(`한글이 ${left}자 남았다(원본 ${source}자). 보이는 텍스트는 모두 영어여야 한다.`);
  }

  return problems;
}

/**
 * 영문판 인쇄 배율 후보(넓은 것부터). 같은 내용이 영어로는 1.6배 가까이 불어 A4 한 장이 더 붙는데,
 * 내용을 깎는 건 이력서로서 손해다. 그래서 줄이는 건 글이 아니라 조판이다.
 *
 * 조각 CSS 는 폰트 21곳이 pt, 간격 36곳이 px 로 박혀 있어 규칙별로 덮으면 손이 많이 간다.
 * `zoom` 은 그 전부를 한 번에 비례로 줄인다(여백 20mm/18mm 도 같이 줄어든다).
 * width 를 배율로 나눠주는 건 축소 후에도 시트가 A4 폭을 그대로 채우게 하려는 보정이다.
 */
export const EN_PRINT_SCALES = [1, 0.94, 0.88, 0.82, 0.76];

/**
 * 조각 안(</article> 직전)에 배율 <style> 을 덧댄다. 조각 자체 <style> 보다 뒤라 같은 특이도에서 이긴다.
 * 밖이 아니라 안에 넣는 이유는 이 파일이 "최상위 루트 하나짜리 자기완결형 조각" 규약을 지켜야 해서다
 * — 어디에 놓이든 이 배율이 같이 따라간다.
 */
export function applyPrintScale(fragment: string, scale: number): string {
  if (scale === 1) return fragment;
  const style = `<style>
  /* EN 인쇄 보정 — 내용은 그대로, 조판만 ${scale} 배로 줄여 한국어판과 같은 쪽수에 맞춘다. */
  .onepager { zoom: ${scale}; width: calc(210mm / ${scale}); }
</style>`;
  const close = fragment.lastIndexOf("</article>");
  if (close === -1) return `${fragment}\n${style}`;
  return `${fragment.slice(0, close)}${style}\n${fragment.slice(close)}`;
}

/** 모델이 ```html 펜스로 감싸 보내는 경우가 있어 벗겨낸다. */
export function stripCodeFence(text: string): string {
  const fenced = text.trim().match(/^```(?:html)?\s*\n([\s\S]*?)\n```$/i);
  return (fenced ? fenced[1] : text).trim();
}

/** 기존 EN 파일이 이 KO 해시로 만들어진 것인지. */
export function isUpToDate(existingEn: string, koHash: string): boolean {
  const match = existingEn.match(STAMP_RE);
  return Boolean(match && match[1] === koHash);
}

/** 번역 프롬프트. hint 는 이전 시도의 검증 실패 사유(첫 시도엔 빈 문자열). */
export function buildPrompt(skeleton: string, hint: string): string {
  const source = visibleText(skeleton).length;
  const budget = Math.floor(source * LENGTH_TARGET);
  return `아래는 임한솔(Hansol Lim)의 이력서 원페이저 HTML 조각이다. 한국어 본문을 영어로 옮겨라.

[규칙 — 어기면 실패]
- 태그·속성·클래스·순서·중첩을 **한 글자도** 바꾸지 마라. 바꾸는 건 태그 사이의 텍스트뿐이다.
- 태그를 추가하거나 지우지 마라. 줄바꿈·들여쓰기도 원본 그대로 둔다.
- \`${STYLE_SLOT}\` 주석은 그 자리에 그대로 남겨라(CSS 자리표다).
- 이메일·URL·회사명·제품명·기술명 등 이미 영문이거나 고유명사인 것은 그대로 둔다.
- 사람 이름은 \`Hansol Lim\` 으로 통일한다(\`임한솔 / Hansol Lim\` 같은 병기는 영문만 남긴다).
- 숫자·날짜·기간·비율은 **절대 바꾸지 마라**. 사실이 틀리면 이력서로서 실패다.
- 내용을 요약·보강·재배열하지 마라. 있는 것을 그대로 옮기기만 한다.

[문체·분량]
영미권 채용 담당자가 읽는 이력서 영어. 직역투 대신 그 바닥에서 쓰는 표현으로 옮기되,
없는 성과를 만들어내지 않는다. 불릿은 관사·주어를 덜어낸 동사 시작 문장으로.
**보이는 텍스트 총량 ${budget}자를 목표로 하라**(원본 ${source}자). 길어지면 A4 한 장이 더 붙어
원페이저가 아니게 된다. 내용을 빼서 줄이지 말고 표현을 조여서 맞춰라.
${hint}
설명 없이 번역된 HTML 조각만 반환하라. 코드 펜스도 붙이지 마라.

${skeleton}`;
}
