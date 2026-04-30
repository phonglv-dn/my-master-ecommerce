import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { SHOP_CONFIG } from "../shop.config";
import { updateSupabaseSession } from "../lib/supabase/proxy";

const intlMiddleware = createIntlMiddleware({
  locales: SHOP_CONFIG.i18n.locales,
  defaultLocale: SHOP_CONFIG.i18n.defaultLocale,
  localePrefix: "always",
});

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return true;
  return allowed.includes(email.toLowerCase());
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const { response, user } = await updateSupabaseSession(request);
    const isLogin = path === "/admin/login";

    if (!user && !isLogin) {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
    if (user && !isAdminEmail(user.email)) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("error", "forbidden");
      return NextResponse.redirect(url);
    }
    if (user && isLogin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next|api|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|otf|css|js)).*)",
  ],
};
