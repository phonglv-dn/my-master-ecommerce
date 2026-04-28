"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useCurrency } from "../../../contexts/CurrencyContext";
import { useCart } from "../../../contexts/CartContext";
import { formatPrice } from "../../../../lib/formatPrice";
import type { Product } from "../../../../types";
import type { Locale } from "../../../../shop.config";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showSwatches?: boolean;
  large?: boolean;
}

const DUMMY_SWATCHES = ["bg-zinc-800", "bg-stone-300", "bg-emerald-800"];

export default function ProductCard({
  product,
  showSwatches = false,
  large = false,
}: ProductCardProps) {
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const { items, addToCart, removeFromCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const isInCart = items.some((item) => item.product?.id === product.id);

  const localizedTitle = product.title[locale] ?? product.title.vi;
  const localizedCategory = product.category?.name[locale] ?? product.category?.name.vi ?? "Category";
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);
  
  // Use a model image or fallback to product cover image if available.
  // For the 'large' variant we prefer a model image, let's assume the second image is a model image if it exists.
  const coverImage = (large && product.images?.length > 1) ? product.images[1] : (product.images?.[0] ?? null);

  return (
    <div className="group flex flex-col gap-3">
      {/* Image Container */}
      <div 
        className={`relative w-full overflow-hidden bg-gray-100 ${
          large ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <Link href={`/${locale}/products/${product.slug}`} className="absolute inset-0">
          {coverImage && !imgError ? (
            <Image
              src={coverImage}
              alt={localizedTitle}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={large ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 25vw"}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
              No Image
            </div>
          )}
        </Link>

        {/* Hover Button */}
        {isInCart ? (
          <button 
            className="absolute bottom-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center bg-black text-white shadow-sm transition-all duration-300 hover:bg-gray-800 translate-y-0 opacity-100"
            aria-label="Remove from cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeFromCart(product.id);
            }}
          >
            <Check size={16} strokeWidth={2} />
          </button>
        ) : (
          <button 
            className="absolute bottom-4 left-1/2 flex h-8 w-8 -translate-x-1/2 translate-y-4 items-center justify-center bg-white text-black opacity-0 shadow-sm transition-all duration-300 hover:bg-black hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Add to cart"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1);
            }}
          >
            <Plus size={16} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              {localizedCategory}
            </span>
            {showSwatches && (
              <div className="flex items-center gap-1">
                {DUMMY_SWATCHES.map((color, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${color} border border-black/10`} />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-baseline justify-between">
          <h3 className="truncate text-sm font-bold text-black">
            <Link href={`/${locale}/products/${product.slug}`} className="hover:underline">
              {localizedTitle}
            </Link>
          </h3>
          <span className="ml-4 flex-shrink-0 text-sm font-semibold text-black">
            {priceDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}
