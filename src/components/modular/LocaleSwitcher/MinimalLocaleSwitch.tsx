"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { SHOP_CONFIG } from "../../../../shop.config";
import type { Locale } from "../../../../shop.config";

const LOCALE_LABELS: Record<Locale, string> = {
  vi: "VN",
  en: "ENG",
};

interface MinimalLocaleSwitchProps {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  separator?: string;
}

export default function MinimalLocaleSwitch({
  className = "",
  activeClassName = "text-black font-bold",
  inactiveClassName = "text-gray-600 hover:text-black cursor-pointer",
  separator = "/",
}: MinimalLocaleSwitchProps) {
  const currentLocale = useLocale() as Locale;
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSwitch(target: Locale) {
    if (target === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = target;
    startTransition(() => {
      router.push(segments.join("/"));
    });
  }

  return (
    <span role="group" aria-label={tc("languageAria")} className={className}>
      {SHOP_CONFIG.i18n.locales.map((locale, i) => {
        const isActive = locale === currentLocale;
        return (
          <span key={locale}>
            <button
              type="button"
              onClick={() => handleSwitch(locale as Locale)}
              disabled={isPending || isActive}
              aria-pressed={isActive}
              className={`transition-colors ${
                isActive ? activeClassName : inactiveClassName
              }`}
            >
              {LOCALE_LABELS[locale as Locale]}
            </button>
            {i < SHOP_CONFIG.i18n.locales.length - 1 && (
              <span aria-hidden="true">{separator}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
