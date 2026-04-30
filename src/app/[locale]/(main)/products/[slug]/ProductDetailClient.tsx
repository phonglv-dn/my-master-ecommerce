"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ShoppingBag, User } from "lucide-react";
import { useCurrency } from "../../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../../lib/formatPrice";
import { getLocalizedText } from "../../../../../../lib/getLocalizedText";
import type { Product } from "../../../../../../types";
import type { Locale } from "../../../../../../shop.config";
import { useCart } from "../../../../../contexts/CartContext";
import ProductGallery from "./ProductGallery";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { currency } = useCurrency();
  const { addToCart, totalItems } = useCart();

  const localizedTitle = getLocalizedText(product.title, locale);
  const localizedDesc = getLocalizedText(product.description, locale);
  const localizedCategory = product.category
    ? getLocalizedText(product.category.name, locale)
    : null;
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);
  const isOutOfStock = product.stock === 0;

  const sizes = product.sizes ?? [];
  const images = product.images ?? [];

  const [activeSize, setActiveSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <>
      {/* ── Mobile floating top nav (hidden on md+) ── */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-4 py-3 backdrop-blur-md bg-white/40 md:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t("back")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/cart`}
            aria-label={tc("cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition hover:bg-gray-100"
          >
            <ShoppingBag size={16} strokeWidth={1.75} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            href={`/${locale}/account`}
            aria-label={tc("account")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-sm transition hover:bg-gray-100"
          >
            <User size={16} strokeWidth={1.75} />
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-center gap-6 px-0 pb-24 md:flex-row md:gap-12 md:px-4 md:py-12 md:pb-20 lg:py-20">
        <ProductGallery
          images={images}
          alt={localizedTitle}
          outOfStockLabel={isOutOfStock ? t("outOfStock") : null}
        />

        {/* ── Info Card ── */}
        <div className="flex w-full shrink-0 flex-col gap-6 bg-[#f9f9f9] p-6 font-sans md:p-8 lg:w-[400px] dark:bg-gray-900">
          {localizedCategory && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-700 dark:text-gray-400">
              {localizedCategory}
            </span>
          )}

          <div>
            <h1 className="font-sans text-2xl font-semibold uppercase tracking-tight text-gray-900 dark:text-white">
              {localizedTitle}
            </h1>
            <p className="mt-2 font-sans text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {priceDisplay}
            </p>
          </div>

          <p className="text-sm normal-case leading-relaxed text-gray-800 dark:text-gray-200">
            {localizedDesc}
          </p>

          {/* Color — read-only metadata */}
          {product.color_code && (
            <p className="text-xs uppercase tracking-[0.18em] text-gray-700 dark:text-gray-400">
              {t("color")}:{" "}
              <span className="text-gray-900 dark:text-white">
                {product.color_code}
              </span>
            </p>
          )}

          {/* Size selector — optional */}
          {sizes.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-700 dark:text-gray-400">
                {t("size")}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isActive = s === activeSize;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSize(s)}
                      aria-pressed={isActive}
                      className={`h-9 min-w-[44px] border px-3 text-xs font-medium uppercase tracking-wider transition ${
                        isActive
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-gray-400/70 bg-transparent text-gray-800 hover:border-black dark:border-gray-600 dark:text-gray-200 dark:hover:border-white"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-4 text-[10px] uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                <button type="button" className="hover:text-black dark:hover:text-white">
                  {t("findYourSize")}
                </button>
                <span>|</span>
                <button type="button" className="hover:text-black dark:hover:text-white">
                  {t("measurementGuide")}
                </button>
              </div>
            </div>
          )}

          {/* Desktop / tablet ADD button — full width inside card. Hidden on mobile (replaced by sticky bottom CTA). */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-2 hidden w-full items-center justify-center bg-black py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 md:flex dark:disabled:bg-gray-700"
          >
            {isOutOfStock ? t("outOfStock") : t("add")}
          </button>
        </div>
      </div>

      {/* ── Mobile sticky bottom CTA (hidden on md+) ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-sm md:hidden">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex h-12 w-full items-center justify-center bg-black text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isOutOfStock ? t("outOfStock") : tc("addToCart")}
        </button>
      </div>
    </>
  );
}
