import { SHOP_CONFIG, type Locale } from "../shop.config";
import type { LocalizedString } from "../types";

/**
 * Resolve a `LocalizedString` for the given locale, falling back to the shop's
 * default locale (then to any other available locale) when the requested key
 * is missing or empty.
 */
export function getLocalizedText(
  data: LocalizedString | null | undefined,
  locale: Locale
): string {
  if (!data) return "";

  const requested = data[locale];
  if (requested) return requested;

  const fallback = data[SHOP_CONFIG.i18n.defaultLocale];
  if (fallback) return fallback;

  for (const value of Object.values(data)) {
    if (value) return value;
  }
  return "";
}
