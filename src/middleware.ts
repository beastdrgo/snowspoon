import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session on every request and guards the
 * admin area: unauthenticated users hitting /admin/* (except the login
 * page) are redirected to the login screen.
 *
 * This must never throw — a middleware exception 500s every route on the
 * site. If Supabase is misconfigured or the auth check fails, we fail
 * gracefully: public pages load, and admin routes fall back to the login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const redirectToLogin = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  };

  // Supabase not configured (e.g. missing env vars on the host): don't crash.
  if (!supabaseUrl || !supabaseKey) {
    if (isAdminArea && !isLogin) return redirectToLogin();
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isAdminArea && !isLogin && !user) return redirectToLogin();

    if (isLogin && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    // Auth check failed — protect admin routes, let everything else through.
    if (isAdminArea && !isLogin) return redirectToLogin();
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
