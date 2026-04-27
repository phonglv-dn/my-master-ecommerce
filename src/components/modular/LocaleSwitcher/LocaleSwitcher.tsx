"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { SHOP_CONFIG } from "../../../../shop.config";
import type { Locale } from "../../../../shop.config";

// ── LocaleSwitcher ────────────────────────────────────────────────────────────
// Switches between Vi / En by replacing the [locale] segment in the URL path.

interface LocaleSwitcherProps {
  /** Optional extra className for the host element. */
  className?: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

const LOCALE_FLAGS: Record<Locale, string> = {
  vi: "🇻🇳",
  en: "🇺🇸",
};

export default function LocaleSwitcher({ className = "" }: LocaleSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(targetLocale: Locale) {
    if (targetLocale === currentLocale) return;

    // Replace the current locale segment: /vi/products → /en/products
    const segments = pathname.split("/");
    // segments[0] is "" (leading slash), segments[1] is the locale
    segments[1] = targetLocale;
    const newPath = segments.join("/");

    startTransition(() => {
      router.push(newPath);
    });
  }

  return (
    <div
      className={`locale-switcher ${className}`}
      aria-label="Language switcher"
      role="group"
    >
      {SHOP_CONFIG.i18n.locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            id={`locale-btn-${locale}`}
            onClick={() => handleSwitch(locale)}
            disabled={isPending || isActive}
            aria-pressed={isActive}
            className={`locale-btn ${isActive ? "locale-btn--active" : "locale-btn--inactive"}`}
          >
            <span className="locale-btn__flag" aria-hidden="true">
              {LOCALE_FLAGS[locale]}
            </span>
            <span className="locale-btn__label">{LOCALE_LABELS[locale]}</span>
          </button>
        );
      })}
    </div>
  );
}
