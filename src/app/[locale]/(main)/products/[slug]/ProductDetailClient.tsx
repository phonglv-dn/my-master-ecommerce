"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingCart, Package, Plus, Minus } from "lucide-react";
import { useCurrency } from "../../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../../lib/formatPrice";
import type { Product } from "../../../../../../types";
import type { Locale } from "../../../../../../shop.config";
import { useCart } from "../../../../../contexts/CartContext";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const { addToCart } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const localizedTitle = product.title[locale] ?? product.title.vi;
  const localizedDesc = product.description?.[locale] ?? product.description?.vi ?? "";
  const priceDisplay = formatPrice(product.price_vnd, currency, locale);
  const isOutOfStock = product.stock === 0;
  const activeImage = product.images?.[activeImageIndex] ?? null;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`Đã thêm ${quantity} x ${localizedTitle} vào giỏ hàng!`);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* ── Left: Image Gallery ── */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {activeImage && !imgError ? (
              <Image
                src={activeImage}
                alt={localizedTitle}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <Package size={80} />
              </div>
            )}
            {isOutOfStock && (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white shadow-md">
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setImgError(false); // Reset error state khi đổi ảnh
                  }}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-primary-500 opacity-100 ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-950"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${localizedTitle} - thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ── */}
        <div className="flex flex-col">
          {product.category?.name?.[locale] && (
            <span className="mb-3 inline-block rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 w-max">
              {product.category.name[locale]}
            </span>
          )}

          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {localizedTitle}
          </h1>

          <div className="mb-6 flex items-end gap-4">
            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
              {priceDisplay}
            </span>
            <span
              className={`mb-1 text-sm font-medium ${
                isOutOfStock ? "text-red-500" : "text-green-500"
              }`}
            >
              {isOutOfStock ? t("outOfStock") : `${product.stock} ${t("inStock")}`}
            </span>
          </div>

          <p className="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {localizedDesc}
          </p>

          <hr className="my-8 border-gray-200 dark:border-gray-800" />

          {/* Add to Cart Section */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Quantity Selector */}
            <div className="flex items-center">
              <span className="mr-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("quantity")}:
              </span>
              <div className="flex h-12 items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="flex h-full w-12 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="flex h-full w-12 items-center justify-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="flex h-full w-12 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-8 font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-700"
            >
              <ShoppingCart size={20} />
              {tc("addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
