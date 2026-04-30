"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { SHOP_CONFIG } from "../../../../shop.config";
import type { Locale } from "../../../../shop.config";

const LOCALE_LABELS: Record<Locale, string> = {
  vi: "VN",
  en: "ENG",
};

export default function FooterLocaleSwitch() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(targetLocale: Locale) {
    if (targetLocale === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    startTransition(() => {
      router.push(segments.join("/"));
    });
  }

  return (
    <div className="text-xs uppercase tracking-widest text-gray-600 font-medium">
      <span>Language </span>
      <span aria-hidden="true">(</span>
      <span role="group" aria-label="Language switcher">
        {SHOP_CONFIG.i18n.locales.map((locale, i) => {
          const isActive = locale === currentLocale;
          return (
            <span key={locale}>
              <button
                onClick={() => handleSwitch(locale as Locale)}
                disabled={isPending || isActive}
                aria-pressed={isActive}
                className={`transition-colors ${
                  isActive
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black cursor-pointer"
                }`}
              >
                {LOCALE_LABELS[locale as Locale]}
              </button>
              {i < SHOP_CONFIG.i18n.locales.length - 1 && (
                <span aria-hidden="true">/</span>
              )}
            </span>
          );
        })}
      </span>
      <span aria-hidden="true">)</span>
    </div>
  );
}
