"use client";

import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart, cartLineKey } from "../../../../contexts/CartContext";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../lib/formatPrice";
import type { Locale } from "../../../../../shop.config";

type Translator = ReturnType<typeof useTranslations<"checkout">>;

function buildSchema(t: Translator) {
  const required = t("errors.required");
  return z.object({
    email: z.string().min(1, required).email(t("errors.email")),
    phone: z
      .string()
      .min(1, required)
      .regex(/^[+\d][\d\s().-]{6,}$/, t("errors.phone")),
    firstName: z.string().min(1, required),
    lastName: z.string().min(1, required),
    country: z.string().min(1, required),
    stateRegion: z.string().min(1, required),
    address: z.string().min(1, required),
    city: z.string().min(1, required),
    postalCode: z.string().min(1, required),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export default function CheckoutClient() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const { items, isHydrated } = useCart();
  const { currency } = useCurrency();

  const schema = buildSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      country: "",
      stateRegion: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xs uppercase tracking-[0.25em] text-black/50">
          {tc("loading")}
        </p>
      </div>
    );
  }

  const subtotalVnd = items.reduce(
    (sum, item) => sum + item.product.price_vnd * item.quantity,
    0
  );
  const totalVnd = subtotalVnd;
  const formattedSubtotal = formatPrice(subtotalVnd, currency, locale);
  const formattedTotal = formatPrice(totalVnd, currency, locale);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const onSubmit = async (_values: FormValues) => {
    // TODO: persist shipping info, advance to /checkout/shipping when wired up.
    await new Promise((resolve) => setTimeout(resolve, 250));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
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
          {t("browse")}
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-5 pt-10 pb-24 md:px-8 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:px-12">
      {/* ───────────────────────── LEFT: Form ───────────────────────── */}
      <section className="order-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label={t("back")}
          className="mb-10 inline-flex h-9 w-9 items-center justify-center text-black transition hover:opacity-60"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>

        <h1 className="text-5xl font-black uppercase tracking-tight text-black md:text-6xl">
          {t("title")}
        </h1>

        <nav
          aria-label="Checkout steps"
          className="mt-8 flex items-center gap-10 border-b border-black/10 pb-5 text-xs font-semibold uppercase tracking-[0.25em]"
        >
          <span className="text-black">{t("stepInformation")}</span>
          <span className="text-black/30">{t("stepShipping")}</span>
          <span className="text-black/30">{t("stepPayment")}</span>
        </nav>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10">
          {/* Contact */}
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-black">
            {t("contactInfo")}
          </h2>
          <div className="flex flex-col gap-4">
            <Field
              label={t("email")}
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Field
              label={t("phone")}
              type="tel"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          {/* Shipping */}
          <h2 className="mt-10 mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-black">
            {t("shippingAddress")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t("firstName")}
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <Field
              label={t("lastName")}
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <div className="mt-4">
            <Field
              label={t("country")}
              autoComplete="country-name"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>
          <div className="mt-4">
            <Field
              label={t("stateRegion")}
              autoComplete="address-level1"
              error={errors.stateRegion?.message}
              {...register("stateRegion")}
            />
          </div>
          <div className="mt-4">
            <Field
              label={t("address")}
              autoComplete="street-address"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label={t("city")}
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register("city")}
            />
            <Field
              label={t("postalCode")}
              autoComplete="postal-code"
              error={errors.postalCode?.message}
              {...register("postalCode")}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex w-full items-center justify-between gap-6 bg-black px-7 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:bg-black/40 sm:w-auto sm:min-w-[280px]"
            >
              <span>{t("submit")}</span>
              <span aria-hidden="true" className="flex items-center gap-1">
                <span className="h-px w-10 bg-white transition-all group-hover:w-14" />
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
            </button>
          </div>
        </form>
      </section>

      {/* ───────────────────────── RIGHT: Order Summary ───────────────────────── */}
      <aside className="order-2 self-start bg-[#f9f9f9] p-6 md:p-8 lg:sticky lg:top-24">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-black">
            {t("yourOrder")}
          </h2>
          <span className="text-xs font-medium tabular-nums text-black/50">
            ({totalQty})
          </span>
        </header>

        <ul className="flex flex-col divide-y divide-black/10">
          {items.map((item) => {
            const { product, quantity, size, color } = item;
            const lineId = cartLineKey(product.id, size, color);
            const localizedTitle =
              product.title[locale] ?? product.title.vi;
            const lineTotal = formatPrice(
              product.price_vnd * quantity,
              currency,
              locale
            );
            const coverImage = product.images?.[0] ?? null;
            const sizeLabel = size === "OS" ? "" : size;

            return (
              <li
                key={lineId}
                className="flex items-start gap-4 py-4 first:pt-0"
              >
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="relative block aspect-3/4 w-20 shrink-0 overflow-hidden bg-white"
                >
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={localizedTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-black/30">
                      <ShoppingBag size={20} strokeWidth={1.25} />
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="truncate text-sm font-medium text-black">
                      {localizedTitle}
                    </h3>
                    <Link
                      href={`/${locale}/cart`}
                      className="shrink-0 text-[11px] font-medium uppercase tracking-[0.15em] text-black/70 underline-offset-4 hover:text-black hover:underline"
                    >
                      {t("change")}
                    </Link>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-black/60">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2.5 w-2.5 border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                    {sizeLabel && <span>{sizeLabel}</span>}
                  </p>
                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="text-black/50 tabular-nums">
                      ({quantity})
                    </span>
                    <span className="text-sm font-medium tabular-nums text-black">
                      {lineTotal}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <dl className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-6 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-black/70">{t("subtotal")}</dt>
            <dd className="font-medium tabular-nums text-black">
              {formattedSubtotal}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-black/70">{t("shipping")}</dt>
            <dd className="text-xs italic text-black/50">
              {t("shippingNote")}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-baseline justify-between border-t border-black/10 pt-5">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-black">
            {t("total")}
          </span>
          <span className="text-base font-semibold tabular-nums text-black">
            {formattedTotal}
          </span>
        </div>
      </aside>
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, id, ...rest },
  ref
) {
  const inputId = id ?? `f-${rest.name ?? label.toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        id={inputId}
        placeholder={label}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-err` : undefined}
        className={`w-full border bg-transparent p-4 text-sm text-black placeholder:text-black/50 focus:outline-none focus:border-black ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-err`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});
