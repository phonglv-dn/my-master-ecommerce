import createMiddleware from "next-intl/middleware";
import { SHOP_CONFIG } from "../shop.config";

export default createMiddleware({
  locales: SHOP_CONFIG.i18n.locales,
  defaultLocale: SHOP_CONFIG.i18n.defaultLocale,
  // Luôn hiển thị locale trong URL, kể cả locale mặc định
  localePrefix: "always",
});

export const config = {
  // Áp dụng middleware cho tất cả route TRỪ: _next, api, và static files
  matcher: [
    "/((?!_next|api|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|otf|css|js)).*)",
  ],
};
