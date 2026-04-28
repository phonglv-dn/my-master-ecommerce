"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Package, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { useCart } from "../../../contexts/CartContext";
import { formatPrice } from "../../../../lib/formatPrice";
import type { Product } from "../../../../types";
import type { Locale } from "../../../../shop.config";

// ── ProductCardV2 ─────────────────────────────────────────────────────────────
// Horizontal card layout — image left, details right.
// Used when SHOP_CONFIG.layout.cardVariant === "v2".

interface ProductCardV2Props {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCardV2({
  product,
  onAddToCart,
}: ProductCardV2Props) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const { addToCart } = useCart();

  // Localized title: product.title is LocalizedString { vi, en }
  const localizedTitle = product.title[locale] ?? product.title.vi;

  // Localized description
  const localizedDesc =
    product.description?.[locale] ?? product.description?.vi ?? "";

  // Formatted price based on the currently selected currency
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);

  const isOutOfStock = product.stock === 0;
  const coverImage = product.images?.[0] ?? null;
  const [imgError, setImgError] = useState(false);

  return (
    <article className="product-card-v2" aria-label={localizedTitle}>
      {/* ── Left: Image ── */}
      <Link href={`/${locale}/products/${product.slug}`} className="product-card-v2__image-wrap" style={{ display: 'block' }}>
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={localizedTitle}
            fill
            sizes="(max-width: 640px) 120px, 180px"
            className="product-card-v2__image"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="product-card-v2__image-placeholder"
            aria-hidden="true"
          >
            <Package size={32} className="product-card-v2__placeholder-icon" />
          </div>
        )}

        {isOutOfStock && (
          <span className="product-card-v2__badge product-card-v2__badge--out">
            {t("outOfStock")}
          </span>
        )}
      </Link>

      {/* ── Right: Info ── */}
      <div className="product-card-v2__body">
        <div className="product-card-v2__top">
          {product.category?.name?.[locale] && (
            <span className="product-card-v2__category">
              {product.category.name[locale]}
            </span>
          )}

          <h3 className="product-card-v2__title">
            <Link href={`/${locale}/products/${product.slug}`} className="hover:underline">
              {localizedTitle}
            </Link>
          </h3>

          {localizedDesc && (
            <p className="product-card-v2__desc">{localizedDesc}</p>
          )}
        </div>

        <div className="product-card-v2__bottom">
          <div className="product-card-v2__meta">
            <span className="product-card-v2__price" aria-label={t("price")}>
              {priceDisplay}
            </span>
            <span
              className={`product-card-v2__stock ${
                isOutOfStock
                  ? "product-card-v2__stock--out"
                  : "product-card-v2__stock--in"
              }`}
            >
              {isOutOfStock ? t("outOfStock") : t("inStock")}
            </span>
          </div>

          <div className="product-card-v2__actions">
            <button
              id={`add-to-cart-v2-${product.id}`}
              className="product-card-v2__cta"
              disabled={isOutOfStock}
              onClick={() => {
                addToCart(product, 1);
                onAddToCart?.(product);
              }}
              aria-label={`${tc("addToCart")} – ${localizedTitle}`}
            >
              <ShoppingCart size={15} aria-hidden="true" />
              {tc("addToCart")}
            </button>

            <Link
              href={`/${locale}/products/${product.slug}`}
              className="product-card-v2__detail-link"
              aria-label={`${tc("viewAll")} – ${localizedTitle}`}
            >
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
