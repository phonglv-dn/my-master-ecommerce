"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "../../../../contexts/CartContext";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../lib/formatPrice";
import type { Locale } from "../../../../../shop.config";

export default function CartClient() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { items, removeFromCart, updateQuantity, isHydrated, clearCart } = useCart();
  const { currency } = useCurrency();

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">{tc("loading")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-32 px-6 text-center">
        <div className="mb-6 rounded-full bg-gray-100 p-6 dark:bg-gray-800">
          <ShoppingBag size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t("empty")}
        </h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition hover:bg-primary-700"
        >
          {t("continueShopping")}
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const subtotalVnd = items.reduce(
    (sum, item) => sum + item.product.price_vnd * item.quantity,
    0
  );
  const formattedTotal = formatPrice(subtotalVnd, currency, locale);

  const handleCheckout = () => {
    alert("Tính năng thanh toán đang được phát triển!");
    clearCart();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        {tc("cart")}
      </h1>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
            {items.map(({ product, quantity }) => {
              const localizedTitle = product.title[locale] ?? product.title.vi;
              const priceDisplay = formatPrice(product.price_vnd, currency, locale);
              const itemTotal = formatPrice(product.price_vnd * quantity, currency, locale);
              const coverImage = product.images?.[0] ?? null;

              return (
                <li key={product.id} className="flex flex-col py-6 sm:flex-row sm:items-center gap-6">
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={localizedTitle}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        <Link href={`/${locale}/products/${product.slug}`} className="hover:underline">
                          {localizedTitle}
                        </Link>
                      </h3>
                      <p className="ml-4 font-semibold text-gray-900 dark:text-white">
                        {itemTotal}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {priceDisplay}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex h-9 items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex h-full w-10 items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">{t("remove")}</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sticky top-24">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{formattedTotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">Free</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-800" />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-white">{t("total")}</span>
                <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">{formattedTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3.5 font-bold text-white transition hover:bg-primary-700"
            >
              <ShoppingCart size={18} />
              {t("checkout")}
            </button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
