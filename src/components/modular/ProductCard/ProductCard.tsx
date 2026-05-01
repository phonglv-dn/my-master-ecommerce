"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../lib/formatPrice";
import type { Product } from "../../../../types";
import type { Locale } from "../../../../shop.config";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showSwatches?: boolean;
  large?: boolean;
  imageBgClass?: string;
}

const DUMMY_SWATCHES = ["bg-zinc-800", "bg-stone-300", "bg-emerald-800"];

export default function ProductCard({
  product,
  showSwatches = false,
  large = false,
  imageBgClass = "bg-[#E5E5E5]",
}: ProductCardProps) {
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const [imgError, setImgError] = useState(false);

  const localizedTitle = product.title[locale] ?? product.title.vi;
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);
  
  // Use a model image or fallback to product cover image if available.
  // For the 'large' variant we prefer a model image, let's assume the second image is a model image if it exists.
  const coverImage = (large && product.images?.length > 1) ? product.images[1] : (product.images?.[0] ?? null);

  return (
    <div className="group flex flex-col gap-3">
      {/* Image Container — gray base lets all-black products read as 3D */}
      <div
        className={`relative w-full overflow-hidden ${imageBgClass} ${
          large ? "aspect-3/4" : "aspect-4/5"
        }`}
      >
        <Link href={`/${locale}/products/${product.slug}`} className="absolute inset-0">
          {coverImage && !imgError ? (
            <Image
              src={coverImage}
              alt={localizedTitle}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes={large ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 25vw"}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
              No Image
            </div>
          )}
        </Link>

        {showSwatches && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            {DUMMY_SWATCHES.map((color, i) => (
              <div key={i} className={`h-2 w-2 rounded-full ${color} border border-black/20`} />
            ))}
          </div>
        )}
      </div>

      {/* Info Row — title left (bold), price right */}
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="truncate text-sm font-bold tracking-tight text-black">
          <Link href={`/${locale}/products/${product.slug}`} className="hover:underline underline-offset-4">
            {localizedTitle}
          </Link>
        </h3>
        <span className="shrink-0 text-sm font-bold text-black tabular-nums">
          {priceDisplay}
        </span>
      </div>
    </div>
  );
}
