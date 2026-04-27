import { getRequestConfig } from "next-intl/server";
import { SHOP_CONFIG } from "../../shop.config";

export default getRequestConfig(async ({ requestLocale }) => {
  // Lấy locale từ URL segment; fallback về defaultLocale nếu không hợp lệ
  let locale = await requestLocale;

  const isValid =
    locale !== undefined &&
    SHOP_CONFIG.i18n.locales.includes(
      locale as (typeof SHOP_CONFIG.i18n.locales)[number]
    );

  if (!isValid) {
    locale = SHOP_CONFIG.i18n.defaultLocale;
  }

  // Tại đây locale chắc chắn là string
  const resolvedLocale = locale as string;

  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default,
  };
});
