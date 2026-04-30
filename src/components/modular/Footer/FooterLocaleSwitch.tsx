"use client";

import { useTranslations } from "next-intl";
import { MinimalLocaleSwitch } from "../LocaleSwitcher";

export default function FooterLocaleSwitch() {
  const tc = useTranslations("common");

  return (
    <div className="text-xs uppercase tracking-widest text-gray-600 font-medium">
      <span>{tc("language")} </span>
      <span aria-hidden="true">(</span>
      <MinimalLocaleSwitch />
      <span aria-hidden="true">)</span>
    </div>
  );
}
