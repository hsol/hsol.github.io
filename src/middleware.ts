import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  LANG_INIT_COOKIE,
  LANG_INIT_COOKIE_MAX_AGE,
  langFromEntryPath,
} from "@/lib/i18n/lang-entry";
import { MANAGE_COOKIE, verifySession } from "@/lib/manage-auth";

/**
 * 뉴스 서브도메인 리버스 프록시.
 *
 *   news.hsol.info/          → (rewrite) /news
 *   news.hsol.info/<기사>    → (rewrite) /news/<기사>
 *   news.hsol.info/feed.xml  → (rewrite) /news/feed.xml   (RSS 자기참조 URL)
 *
 * 리다이렉트가 아니라 rewrite 라 브라우저 주소창은 news.hsol.info 로 유지되고,
 * 실제 렌더는 메인 앱의 /news 트리가 담당한다. (Vercel 프로젝트에 news.hsol.info
 * 도메인을 추가하고 DNS 를 붙여야 트래픽이 이 미들웨어까지 도달한다.)
 */
const NEWS_HOST = "news.hsol.info";

export async function middleware(req: NextRequest) {
  // 포트가 붙는 로컬/프리뷰 대비해 host 는 콜론 앞부분만 본다.
  const host = req.headers.get("host")?.split(":")[0] ?? "";

  // 1) 언어 진입 경로 — /en, /ko 로 들어오면 그 언어를 쿠키에 심고 루트로 보낸다.
  //    호스트 판정보다 먼저 두어 news.hsol.info/en 도 같은 규칙으로 동작하게 한다
  //    (뉴스 rewrite 를 먼저 태우면 /news/en 이 되어 404 로 떨어진다).
  const entryLang = langFromEntryPath(req.nextUrl.pathname);
  if (entryLang) {
    const home = new URL("/", req.url);
    // 308 이 아니라 307 — 브라우저가 영구 캐시하면 나중에 진입 규칙을 바꿀 수 없다.
    const redirect = NextResponse.redirect(home, 307);
    redirect.cookies.set(LANG_INIT_COOKIE, entryLang, {
      path: "/",
      maxAge: LANG_INIT_COOKIE_MAX_AGE,
      sameSite: "lax",
      // httpOnly 를 켜면 안 된다 — 클라이언트 부트스트랩이 읽어서 localStorage 로 옮긴다.
      httpOnly: false,
    });
    // 진입 전용 경로라 색인 대상이 아니다.
    redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirect;
  }

  // 2) 뉴스 서브도메인 rewrite (메인 도메인이 아니면 여기서 처리하고 끝).
  if (host === NEWS_HOST) {
    const { pathname } = req.nextUrl;
    // 이미 /news 접두면 그대로 — 이중 접두(/news/news)·무한 재작성 방지.
    if (pathname === "/news" || pathname.startsWith("/news/")) {
      return NextResponse.next();
    }
    const url = req.nextUrl.clone();
    // sitemap.xml 은 뉴스 전용 sitemap 라우트가 확장자 없는 `/news/sitemap` 이므로 그쪽으로.
    // (그냥 `/news${pathname}` 로 두면 `/news/sitemap.xml` → 404 가 되고, 미들웨어를 우회하면
    //  메인 도메인의 `/sitemap.xml` 이 응답해 뉴스 속성에 메인 URL 이 새어 나간다.)
    if (pathname === "/sitemap.xml") {
      url.pathname = "/news/sitemap";
    } else {
      url.pathname = pathname === "/" ? "/news" : `/news${pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // 3) /manage 게이트 — 유효한 세션 쿠키가 없으면 Sign in with Vercel 로 보낸다.
  //    콜백/로그인 라우트(/api/*)는 아래 matcher 에서 제외돼 스스로를 막지 않는다.
  const { pathname, search } = req.nextUrl;
  if (pathname === "/manage" || pathname.startsWith("/manage/")) {
    const secret = process.env.MANAGE_SESSION_SECRET;
    const token = req.cookies.get(MANAGE_COOKIE)?.value;
    if (!(secret && token && (await verifySession(token, secret)))) {
      const authorize = new URL("/api/auth/authorize", req.url);
      authorize.searchParams.set("from", pathname + search);
      const redirect = NextResponse.redirect(authorize);
      redirect.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return redirect;
    }
    // 로그인 상태의 관리 페이지도 색인 금지. 경로 접두로 판정하므로 앞으로 추가될
    // /manage/<기능> 라우트가 자동으로 덮인다 — 페이지마다 metadata 를 다는 방식은
    // 새 라우트에서 빠뜨리기 쉽다. (robots.txt 에는 적지 않는다 — 공개 파일이라
    // 적는 순간 관리자 페이지의 존재를 광고하게 된다.)
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  /**
   * 재작성/게이트 대상에서 제외:
   *  - `_next/`·`api/` : 빌드 산출물·API 라우트 (auth 콜백/로그인이 여기 있어 게이트되면 안 됨)
   *  - 확장자 있는 경로(`.*\.`) : favicon·이미지 등 정적 자산.
   *    news.hsol.info 로 로드되는 절대경로 자산이 /news/_next/... 로 깨지지 않게 한다.
   *
   * 단, `/feed.xml`·`/sitemap.xml` 은 예외로 포함해 미들웨어가 뉴스 라우트로 rewrite 하게 한다
   * (자기참조 RSS·sitemap URL 이 news.hsol.info/… 라 이 경로들이 실제로 응답해야 함).
   */
  matcher: ["/((?!_next/|api/|.*\\.).*)", "/feed.xml", "/sitemap.xml"],
};
