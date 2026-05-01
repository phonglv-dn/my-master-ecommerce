"use client";

import { useTranslations, useLocale } from "next-intl";
import { Star, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../lib/formatPrice";
import type { Product } from "../../../../types";
import type { Locale } from "../../../../shop.config";

// ── ProductCardV1 ─────────────────────────────────────────────────────────────
// Vertical card layout — tall image on top, info below.
// Used when SHOP_CONFIG.layout.cardVariant === "v1".

interface ProductCardV1Props {
  product: Product;
}

export default function ProductCardV1({ product }: ProductCardV1Props) {
  const t = useTranslations("product");
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();

  // Localized title: product.title is LocalizedString { vi, en }
  const localizedTitle = product.title[locale] ?? product.title.vi;

  // Formatted price based on the currently selected currency
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);

  const isOutOfStock = product.stock === 0;
  const coverImage = product.images?.[0] ?? null;
  const [imgError, setImgError] = useState(false);

  return (
    <article className="product-card-v1" aria-label={localizedTitle}>
      {/* ── Image ── */}
      <Link href={`/${locale}/products/${product.slug}`} className="product-card-v1__image-wrap" style={{ display: 'block' }}>
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={localizedTitle}
            fill
            sizes="(max-width: 640px) 100vw, 280px"
            className="product-card-v1__image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="product-card-v1__image-placeholder" aria-hidden="true">
            <Package size={40} className="product-card-v1__placeholder-icon" />
          </div>
        )}

        {/* Stock badge */}
        {isOutOfStock && (
          <span className="product-card-v1__badge product-card-v1__badge--out">
            {t("outOfStock")}
          </span>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="product-card-v1__body">
        <h3 className="product-card-v1__title">
          <Link href={`/${locale}/products/${product.slug}`} className="hover:underline">
            {localizedTitle}
          </Link>
        </h3>

        {/* Star rating placeholder */}
        <div className="product-card-v1__stars" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < 4
                  ? "product-card-v1__star--filled"
                  : "product-card-v1__star--empty"
              }
              fill={i < 4 ? "currentColor" : "none"}
            />
          ))}
        </div>

        {/* Price */}
        <p className="product-card-v1__price" aria-label={t("price")}>
          {priceDisplay}
        </p>

        {/* Stock status */}
        <p
          className={`product-card-v1__stock ${
            isOutOfStock
              ? "product-card-v1__stock--out"
              : "product-card-v1__stock--in"
          }`}
        >
          {isOutOfStock ? t("outOfStock") : t("inStock")}
        </p>

      </div>
    </article>
  );
}
