

import { getTranslations } from "next-intl/server";
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react";
import { SHOP_CONFIG } from "../../../shop.config";
import HeaderV1 from "../../components/modular/HeaderV1/HeaderV1";
import HeaderV2 from "../../components/modular/HeaderV2/HeaderV2";
import { HeaderV3 } from "../../components/modular/HeaderV3";
import ProductCardV1 from "../../components/modular/ProductCardV1/ProductCardV1";
import ProductCardV2 from "../../components/modular/ProductCardV2/ProductCardV2";
import { getProducts } from "../../../lib/supabase";

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const products = await getProducts({ limit: 12 });

  const activeHeader = SHOP_CONFIG.layout.headerVariant;
  const activeCard = SHOP_CONFIG.layout.cardVariant;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── Header variants demo ─────────────────────────────────────────── */}
      {activeHeader === "v1" && <HeaderV1 />}
      {activeHeader === "v2" && <HeaderV2 />}
      {activeHeader === "v3" && <HeaderV3 />}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-400 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("heroTitle").split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-brand bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition hover:bg-primary-50 hover:shadow-xl">
              {tc("products")}
            </button>
            <button className="rounded-brand border-2 border-white/60 px-8 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10">
              {tc("viewAll")}
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary-400/30 blur-3xl" />
      </section>

      {/* ── Feature Badges ────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {[
            { icon: Truck,       label: "Giao hàng nhanh" },
            { icon: Shield,      label: "Bảo hành chính hãng" },
            { icon: Zap,         label: "Thanh toán tức thì" },
            { icon: ShoppingBag, label: "Đổi trả dễ dàng" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                <Icon className="h-5 w-5 text-primary-500" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── ProductCard showcase ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("featuredProducts")}
        </h2>
        <p className="mb-8 text-sm text-gray-400">
          Card variant:{" "}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
            {activeCard}
          </code>{" "}
          — header variant:{" "}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
            {activeHeader}
          </code>
        </p>

        {activeCard === "v1" ? (
          /* V1: vertical grid */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {products.map((p) => (
              <ProductCardV1
                key={p.id}
                product={p}
              />
            ))}
          </div>
        ) : (
          /* V2: horizontal list */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {products.map((p) => (
              <ProductCardV2
                key={p.id}
                product={p}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Both header variants preview (dev only) ───────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
          🔁 Header Variants Preview
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          HeaderV2 (frosted) is shown below as a static demo — scroll this page to see its blur effect on the active header above.
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <HeaderV2 />
        </div>
      </section>

      {/* ── Both card variants preview ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
          🔁 Card Variants Preview
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">CardV1 — Vertical</p>
            {products[0] && <ProductCardV1 product={products[0]} />}
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">CardV2 — Horizontal</p>
            {products[1] && <ProductCardV2 product={products[1]} />}
          </div>
        </div>
      </section>
    </main>
  );
}
