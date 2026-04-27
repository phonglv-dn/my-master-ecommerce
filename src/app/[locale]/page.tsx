"use client";

import { useTranslations } from "next-intl";
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react";
import { SHOP_CONFIG } from "../../../shop.config";
import HeaderV1 from "../../components/modular/HeaderV1/HeaderV1";
import HeaderV2 from "../../components/modular/HeaderV2/HeaderV2";
import ProductCardV1 from "../../components/modular/ProductCardV1/ProductCardV1";
import ProductCardV2 from "../../components/modular/ProductCardV2/ProductCardV2";
import type { Product } from "../../../types";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: { vi: "Áo Thun Premium Unisex", en: "Premium Unisex T-Shirt" },
    description: {
      vi: "Chất liệu cotton cao cấp, thoáng mát, bền màu.",
      en: "Premium cotton material, breathable and colorfast.",
    },
    price_vnd: 290_000,
    slug: "ao-thun-premium",
    images: [],
    stock: 12,
    category_id: null,
    created_at: "",
    updated_at: "",
    category: { id: "c1", slug: "apparel", name: { vi: "Thời trang", en: "Apparel" }, created_at: "" },
  },
  {
    id: "2",
    title: { vi: "Giày Sneaker Classic", en: "Classic Sneaker" },
    description: {
      vi: "Đế cao su chống trơn trượt, phù hợp mọi địa hình.",
      en: "Non-slip rubber sole, suitable for all terrains.",
    },
    price_vnd: 1_290_000,
    slug: "giay-sneaker-classic",
    images: [],
    stock: 0,
    category_id: null,
    created_at: "",
    updated_at: "",
    category: { id: "c2", slug: "shoes", name: { vi: "Giày dép", en: "Shoes" }, created_at: "" },
  },
  {
    id: "3",
    title: { vi: "Balo Du Lịch Thông Minh", en: "Smart Travel Backpack" },
    description: {
      vi: "Ngăn sạc USB tích hợp, chống nước cấp độ cao.",
      en: "Built-in USB charging port, high-level water resistance.",
    },
    price_vnd: 850_000,
    slug: "balo-du-lich-thong-minh",
    images: [],
    stock: 5,
    category_id: null,
    created_at: "",
    updated_at: "",
    category: { id: "c3", slug: "bags", name: { vi: "Túi xách", en: "Bags" }, created_at: "" },
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  const activeHeader = SHOP_CONFIG.layout.headerVariant;
  const activeCard = SHOP_CONFIG.layout.cardVariant;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">

      {/* ── Header variants demo ─────────────────────────────────────────── */}
      {activeHeader === "v1" ? <HeaderV1 /> : <HeaderV2 />}

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
            {MOCK_PRODUCTS.map((p) => (
              <ProductCardV1
                key={p.id}
                product={p}
                onAddToCart={(prod) => console.log("Add to cart:", prod.id)}
              />
            ))}
          </div>
        ) : (
          /* V2: horizontal list */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {MOCK_PRODUCTS.map((p) => (
              <ProductCardV2
                key={p.id}
                product={p}
                onAddToCart={(prod) => console.log("Add to cart:", prod.id)}
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
            <ProductCardV1 product={MOCK_PRODUCTS[0]} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">CardV2 — Horizontal</p>
            <ProductCardV2 product={MOCK_PRODUCTS[1]} />
          </div>
        </div>
      </section>
    </main>
  );
}
