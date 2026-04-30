"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ProductCard from "../ProductCard/ProductCard";
import type {
  HomepageContent,
  Locale,
  LocalizedString,
  Product,
} from "../../../../types";

interface NewThisWeekProps {
  products: Product[];
  content?: HomepageContent | null;
}

export default function NewThisWeek({ products, content }: NewThisWeekProps) {
  const t = useTranslations("newThisWeek");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;

  const pick = (key: string, fallbackKey: string) => {
    const ld = content?.text_data?.[key] as LocalizedString | undefined;
    return ld?.[locale] || t(fallbackKey);
  };

  // Use up to 4 products for this section
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-24 px-6 max-w-[1400px] mx-auto">
      {/* Header Area */}
      <div className="mb-12 flex items-end justify-between">
        <h2 className="flex flex-col text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-black">
          <span>{pick("titleLine1", "titleLine1")}</span>
          <span className="flex items-start">
            {pick("titleLine2", "titleLine2")}
            <sup className="ml-2 mt-1 text-base md:text-xl font-bold text-black/60 tracking-normal">(50)</sup>
          </span>
        </h2>

        <Link
          href="/collections/new"
          className="group flex items-center text-sm font-semibold uppercase tracking-widest text-black hover:underline underline-offset-4"
        >
          {pick("seeAll", "seeAll")}
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="mt-16 flex justify-center">
        <div className="flex items-center border border-gray-200">
          <button
            className="flex h-12 w-12 items-center justify-center border-r border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-black"
            aria-label={tc("previous")}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            className="flex h-12 w-12 items-center justify-center text-gray-400 transition-colors hover:bg-gray-50 hover:text-black"
            aria-label={tc("next")}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
