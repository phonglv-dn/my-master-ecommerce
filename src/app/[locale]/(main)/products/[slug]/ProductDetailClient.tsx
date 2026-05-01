"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
  const { currency } = useCurrency();
  const { addToCart } = useCart();

  const localizedTitle = getLocalizedText(product.title, locale);
  const localizedDesc = getLocalizedText(product.description, locale);
  const localizedCategory = product.category
    ? getLocalizedText(product.category.name, locale)
    : null;
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);
  const isOutOfStock = product.stock === 0;

  const sizes = product.sizes ?? [];
  const images = product.images ?? [];
  const swatchHex = product.swatch_hex ?? "#000000";
  const sizeRequired = sizes.length > 0;

  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (sizeRequired && !activeSize) {
      setSizeError(true);
      return;
    }
    addToCart(product, {
      size: activeSize ?? "OS",
      color: swatchHex,
      quantity: 1,
    });
  };

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-center gap-6 px-0 pb-24 md:flex-row md:gap-10 md:px-4 md:py-12 md:pb-20 lg:gap-16 lg:py-20">
        <ProductGallery
          images={images}
          alt={localizedTitle}
          outOfStockLabel={isOutOfStock ? t("outOfStock") : null}
        />

        {/* ── Info Card ── */}
        <div className="flex w-full shrink-0 flex-col gap-6 border border-gray-200 bg-transparent p-6 font-sans md:p-8 lg:w-[400px]">
          {localizedCategory && (
            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-700">
              {localizedCategory}
            </span>
          )}

          <div className="flex flex-col gap-1">
            <h1 className="mb-0 font-sans text-2xl font-semibold uppercase tracking-tight text-gray-900">
              {localizedTitle}
            </h1>
            <p className="font-sans text-2xl font-semibold tracking-tight text-gray-900">
              {priceDisplay}
            </p>
          </div>

          <p className="mt-2 text-sm normal-case leading-relaxed text-gray-800">
            {localizedDesc}
          </p>

          {/* Color — read-only metadata */}
          {product.color_code && (
            <p className="text-xs uppercase tracking-[0.18em] text-gray-700">
              {t("color")}:{" "}
              <span className="text-gray-900">
                {product.color_code}
              </span>
            </p>
          )}

          {/* Size selector — optional */}
          {sizes.length > 0 && (
            <div>
              <p
                className={`mb-3 text-xs uppercase tracking-[0.18em] transition-colors ${
                  sizeError ? "text-red-600" : "text-gray-700"
                }`}
              >
                {t("size")}
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isActive = s === activeSize;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setActiveSize(s);
                        setSizeError(false);
                      }}
                      aria-pressed={isActive}
                      className={`h-9 min-w-[44px] border px-3 text-xs font-medium uppercase tracking-wider transition ${
                        isActive
                          ? "border-black bg-black text-white"
                          : sizeError
                            ? "border-red-500 bg-transparent text-gray-800 hover:border-black"
                            : "border-gray-400/70 bg-transparent text-gray-800 hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-4 text-[10px] uppercase tracking-widest text-gray-500">
                <button type="button" className="hover:text-black">
                  {t("findYourSize")}
                </button>
                <span>|</span>
                <button type="button" className="hover:text-black">
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
            className="mt-2 hidden w-full items-center justify-center bg-black py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 md:flex"
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
