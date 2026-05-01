import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-black/40">
        404
      </p>
      <h1 className="mt-6 text-3xl font-semibold uppercase tracking-tight text-black md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-black/60">
        {t("description")}
      </p>
      <Link
        href={`/${locale}/products`}
        className="mt-10 inline-flex items-center gap-2 border border-black bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
      >
        {t("backToShop")}
        <ArrowRight size={14} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
