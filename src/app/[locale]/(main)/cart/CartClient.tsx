"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartLineKey } from "../../../../contexts/CartContext";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../lib/formatPrice";
import type { Locale } from "../../../../../shop.config";

const SHIPPING_VND = 250_000;

export default function CartClient() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const { items, removeFromCart, updateQuantity, isHydrated } = useCart();
  const { currency } = useCurrency();
  const [agreed, setAgreed] = useState(false);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">
          {tc("loading")}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-32 px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-black/10">
          <ShoppingBag size={28} strokeWidth={1.25} className="text-black/60" />
        </div>
        <h1 className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-black">
          {t("empty")}
        </h1>
        <Link
          href={`/${locale}/products`}
          className="mt-4 inline-flex items-center gap-2 border border-black bg-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
        >
          {t("continueShopping")}
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const subtotalVnd = items.reduce(
    (sum, item) => sum + item.product.price_vnd * item.quantity,
    0
  );
  const totalVnd = subtotalVnd + SHIPPING_VND;
  const formattedSubtotal = formatPrice(subtotalVnd, currency, locale);
  const formattedShipping = formatPrice(SHIPPING_VND, currency, locale);
  const formattedTotal = formatPrice(totalVnd, currency, locale);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 pb-24 md:px-8 lg:px-12">
      {/* Header row: SHOPPING BAG | FAVOURITES */}
      <div className="flex items-center gap-6 border-b border-black/10 pb-5">
        <h1 className="text-xs font-semibold uppercase tracking-[0.25em] text-black">
          {t("shoppingBag")}
        </h1>
        <Link
          href={`/${locale}/wishlist`}
          className="inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-black/60 transition hover:border-black hover:text-black"
        >
          <ShoppingBag size={12} strokeWidth={1.5} />
          {t("favourites")}
        </Link>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Items column */}
        <ul className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {items.map((item) => {
            const { product, quantity, size, color } = item;
            const lineId = cartLineKey(product.id, size, color);
            const localizedTitle =
              product.title[locale] ?? product.title.vi;
            const categoryLabel = product.category
              ? product.category.name[locale] ?? product.category.name.vi
              : null;
            const lineTotal = formatPrice(
              product.price_vnd * quantity,
              currency,
              locale
            );
            const coverImage = product.images?.[0] ?? null;
            const sizeLabel = size === "OS" ? "·" : size;
            const canDecrease = quantity > 1;
            const canIncrease = quantity < product.stock;

            return (
              <li key={lineId} className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  {/* Image — fills the row, leaving room for the action column */}
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="relative block aspect-3/4 flex-1 overflow-hidden bg-[#F2F2F2]"
                  >
                    {coverImage ? (
                      <Image
                        src={coverImage}
                        alt={localizedTitle}
                        fill
                        sizes="(max-width: 768px) 90vw, 40vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-black/30">
                        <ShoppingBag size={28} strokeWidth={1.25} />
                      </div>
                    )}
                  </Link>

                  {/* Vertical action column */}
                  <div className="flex w-7 shrink-0 flex-col items-center gap-5 pt-1 text-black">
                    {/* Remove (X) at top */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id, size, color)}
                      aria-label={t("remove")}
                      className="flex h-6 w-6 items-center justify-center text-black/70 transition hover:text-black"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>

                    {/* Size */}
                    <span className="text-[11px] font-medium uppercase tracking-[0.15em]">
                      {sizeLabel}
                    </span>

                    {/* Color swatch */}
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 border border-black/20"
                      style={{ backgroundColor: color }}
                    />

                    {/* Quantity stepper */}
                    <div className="flex flex-col items-center text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            size,
                            color,
                            quantity + 1
                          )
                        }
                        disabled={!canIncrease}
                        aria-label={t("increaseQty")}
                        className="flex h-5 w-5 items-center justify-center text-black/70 transition hover:text-black disabled:opacity-30"
                      >
                        <Plus size={12} strokeWidth={1.5} />
                      </button>
                      <span className="py-0.5 leading-none">{quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            product.id,
                            size,
                            color,
                            quantity - 1
                          )
                        }
                        disabled={!canDecrease}
                        aria-label={t("decreaseQty")}
                        className="flex h-5 w-5 items-center justify-center text-black/70 transition hover:text-black disabled:opacity-30"
                      >
                        <Minus size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title + price row, sits under the image (mirroring the column above) */}
                <div className="pr-10">
                  {categoryLabel && (
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-black/50">
                      {categoryLabel}
                    </p>
                  )}
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-medium tracking-tight text-black">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="hover:underline"
                      >
                        {localizedTitle}
                      </Link>
                    </h3>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-black">
                      {lineTotal}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Order Summary */}
        <aside className="self-start lg:sticky lg:top-28">
          <div className="flex flex-col gap-6 border border-black/10 bg-white p-7">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-black">
              {t("orderSummary")}
            </h2>

            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-black/70">{t("subtotal")}</dt>
                <dd className="font-medium tabular-nums">
                  {formattedSubtotal}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-black/70">{t("shipping")}</dt>
                <dd className="font-medium tabular-nums">
                  {formattedShipping}
                </dd>
              </div>
            </dl>

            <div className="border-t border-black/10 pt-5">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black">
                  {t("totalTaxIncl")}{" "}
                  <span className="text-[10px] font-normal tracking-[0.2em] text-black/50">
                    {t("taxIncl")}
                  </span>
                </p>
                <span className="text-base font-semibold tabular-nums text-black">
                  {formattedTotal}
                </span>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-xs text-black/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-black"
              />
              <span>{t("agreeTerms")}</span>
            </label>

            <button
              type="button"
              disabled={!agreed}
              className="w-full bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/40"
            >
              {t("goToCheckout")}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
