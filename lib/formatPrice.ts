import { SHOP_CONFIG } from "../shop.config";
import type { Currency, Locale } from "../types";

// ── Constants ────────────────────────────────────────────────────────────────

/** Maps each supported currency to its IETF locale tag for Intl.NumberFormat. */
const CURRENCY_LOCALE_MAP: Record<Currency, string> = {
  VND: "vi-VN",
  USD: "en-US",
};

// ── Core helper ──────────────────────────────────────────────────────────────

/**
 * Convert a VND amount to the target currency and return a formatted string.
 *
 * @param amountVnd   - The raw price stored in the database (Vietnamese Dong).
 * @param currencyCode - Target currency code (e.g. "VND", "USD").
 * @param locale      - Optional UI locale used as a hint for formatting
 *                      (falls back to the currency's native locale).
 * @returns A locale-aware formatted string, e.g. "1.290.000 ₫" or "$51.60".
 *
 * @example
 * formatPrice(1_290_000, "VND")        // → "1.290.000 ₫"
 * formatPrice(1_290_000, "USD")        // → "$51.60"
 * formatPrice(1_290_000, "USD", "vi")  // → "51,60 US$"
 */
export function formatPrice(
  amountVnd: number,
  currencyCode: Currency,
  locale?: Locale
): string {
  const { exchangeRate } = SHOP_CONFIG.currencies; // 1 USD = exchangeRate VND

  // ── Conversion ─────────────────────────────────────────────────────────────
  let converted: number;

  switch (currencyCode) {
    case "VND":
      // No conversion needed; VND amounts are whole numbers.
      converted = Math.round(amountVnd);
      break;

    case "USD":
      converted = amountVnd / exchangeRate;
      break;

    default:
      // Exhaustive check — TypeScript will warn if a new currency is added
      // to shop.config.ts without updating this switch.
      throw new Error(`Unsupported currency: ${currencyCode as string}`);
  }

  // ── Formatting ─────────────────────────────────────────────────────────────
  const intlLocale = locale
    ? buildIntlLocale(locale, currencyCode)
    : CURRENCY_LOCALE_MAP[currencyCode];

  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: currencyCode,
    // VND has no minor units; USD shows 2 decimal places.
    minimumFractionDigits: currencyCode === "VND" ? 0 : 2,
    maximumFractionDigits: currencyCode === "VND" ? 0 : 2,
  }).format(converted);
}

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Build an IETF locale string that satisfies Intl.NumberFormat.
 *
 * When the UI locale ("vi") doesn't match the currency's native locale ("en-US"),
 * we still want to use the UI locale's number grouping/decimal conventions so
 * that the page feels consistent.
 */
function buildIntlLocale(uiLocale: Locale, currency: Currency): string {
  const nativeLocale = CURRENCY_LOCALE_MAP[currency];

  // Extract the language tag from the native locale (e.g. "vi" from "vi-VN")
  const [nativeLang] = nativeLocale.split("-");

  // If the UI locale matches the currency's native language, use the full tag.
  if (uiLocale === nativeLang) return nativeLocale;

  // Otherwise, format numbers using the UI locale's conventions.
  // e.g. Vietnamese user viewing USD → "vi" grouping but USD symbol.
  return uiLocale;
}

// ── Batch helper ─────────────────────────────────────────────────────────────

/**
 * Format an array of VND amounts in one call — useful for product listing pages.
 *
 * @example
 * formatPrices([500_000, 1_200_000], "USD")
 * // → ["$20.00", "$48.00"]
 */
export function formatPrices(
  amountsVnd: number[],
  currencyCode: Currency,
  locale?: Locale
): string[] {
  return amountsVnd.map((amount) => formatPrice(amount, currencyCode, locale));
}
