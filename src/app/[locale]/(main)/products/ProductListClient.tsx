"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCurrency } from "../../../../contexts/CurrencyContext";
import { formatPrice } from "../../../../../lib/formatPrice";
import type { CategoryTree } from "../../../../../utils/categoryUtils";
import type { Product, ColorFamily } from "../../../../../types";
import type { Locale } from "../../../../../shop.config";

// ── Filter constants ────────────────────────────────────────────────────────
type FilterKey = "category" | "color" | "size";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2X"] as const;

const COLOR_TOKENS: Record<
  string,
  { swatch: string; ring: string; label: string }
> = {
  black: { swatch: "bg-black", ring: "ring-black", label: "Black" },
  white: {
    swatch: "bg-white border border-gray-300",
    ring: "ring-black",
    label: "White",
  },
  gray: { swatch: "bg-gray-500", ring: "ring-black", label: "Gray" },
};

interface CategoryOption {
  id: string;
  slug: string;
  parent_id: string | null;
  label: string;
}

type CategoryTreeOption = CategoryTree<CategoryOption>;

interface ProductListClientProps {
  products: Product[];
  /** Full hierarchy — drives the sidebar's grouped list. */
  categoryTree: CategoryTreeOption[];
  /** Flat leaves only — drives the quick-filter pill row. */
  leafCategories: CategoryOption[];
  colorOptions: string[];
}

export default function ProductListClient({
  products,
  categoryTree,
  leafCategories,
  colorOptions,
}: ProductListClientProps) {
  const t = useTranslations("productList");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeCategory = searchParams.get("category");
  const activeColor = searchParams.get("color");
  const activeSize = searchParams.get("size");

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // Close drawer on Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const title = (p.title?.[locale] ?? p.title?.vi ?? "").toLowerCase();
      return title.includes(q);
    });
  }, [products, search, locale]);

  function pushFilter(key: FilterKey, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);

    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const filterContent = (
    <FilterContent
      activeCategory={activeCategory}
      activeColor={activeColor}
      activeSize={activeSize}
      categoryTree={categoryTree}
      colorOptions={colorOptions}
      onPickFilter={pushFilter}
      labels={{
        size: t("size"),
        category: t("category"),
        colors: t("colors"),
        all: t("all"),
      }}
    />
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 md:px-6 md:pt-8">
      {/* ── Breadcrumb + Heading ─────────────────────────────────────────── */}
      <nav aria-label="breadcrumb" className="mb-2 text-xs text-gray-500">
        <Link href={`/${locale}`} className="hover:text-black">
          {tc("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{tc("products")}</span>
      </nav>

      <h1 className="mb-6 font-sans text-2xl font-bold uppercase tracking-tight text-black md:mb-8 md:text-3xl">
        {t("pageTitle")}
      </h1>

      {/* ── Search + Mobile FILTER trigger ───────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2 md:mb-6">
        <div className="relative flex-1 lg:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="h-11 w-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none"
            aria-label={t("search")}
          />
        </div>

        {/* Mobile-only FILTER trigger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 shrink-0 items-center gap-2 border border-gray-300 bg-white px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-black hover:border-black lg:hidden"
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          {t("filters")}
        </button>
      </div>

      {/* ── Quick filters — horizontally scrollable on mobile ────────────── */}
      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [scrollbar-width:none] md:flex-wrap md:overflow-visible md:pb-0"
        role="group"
        aria-label={t("filters")}
      >
        <QuickFilterPill
          active={!activeCategory}
          onClick={() => pushFilter("category", null)}
        >
          {t("all")}
        </QuickFilterPill>
        {/* Only leaves — parents (e.g. "Tops") would be ambiguous as a filter. */}
        {leafCategories.map((c) => (
          <QuickFilterPill
            key={c.id}
            active={activeCategory === c.slug}
            onClick={() => pushFilter("category", c.slug)}
          >
            {c.label}
          </QuickFilterPill>
        ))}
      </div>

      {/* ── Sidebar (desktop) + Grid ─────────────────────────────────────── */}
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
        <aside
          aria-label={t("filters")}
          className="hidden flex-col gap-8 lg:flex"
        >
          <h2 className="border-b border-gray-300 pb-3 text-base font-bold uppercase tracking-tight text-black">
            {t("filters")}
          </h2>
          {filterContent}
        </aside>

        <section>
          {visibleProducts.length === 0 ? (
            <p className="py-20 text-center text-sm text-gray-500">
              {t("empty")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-x-4 md:gap-y-10">
              {visibleProducts.map((p) => (
                <MinimalProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          aria-label={tc("close")}
          tabIndex={drawerOpen ? 0 : -1}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("filters")}
          className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-white pb-[calc(env(safe-area-inset-bottom)+1rem)] transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-tight text-black">
              {t("filters")}
            </h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={tc("close")}
              className="text-gray-700 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-8 px-5 pb-6 pt-6">
            {filterContent}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter content (shared by desktop sidebar + mobile drawer) ──────────────

function FilterContent({
  activeCategory,
  activeColor,
  activeSize,
  categoryTree,
  colorOptions,
  onPickFilter,
  labels,
}: {
  activeCategory: string | null;
  activeColor: string | null;
  activeSize: string | null;
  categoryTree: CategoryTreeOption[];
  colorOptions: string[];
  onPickFilter: (key: FilterKey, value: string | null) => void;
  labels: { size: string; category: string; colors: string; all: string };
}) {
  return (
    <>
      <FilterGroup label={labels.size}>
        <div className="grid grid-cols-6 gap-1.5">
          {SIZE_OPTIONS.map((s) => {
            const isActive = activeSize?.toUpperCase() === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onPickFilter("size", isActive ? null : s)}
                aria-pressed={isActive}
                className={`flex h-9 items-center justify-center border text-[11px] font-medium tracking-wider transition ${
                  isActive
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-transparent text-gray-800 hover:border-black"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label={labels.category}>
        <ul className="flex flex-col gap-3">
          <li>
            <CategoryRow
              active={!activeCategory}
              onClick={() => onPickFilter("category", null)}
            >
              {labels.all}
            </CategoryRow>
          </li>
          {categoryTree.map((node) =>
            node.children.length > 0 ? (
              // Parent group: non-clickable section header + indented children.
              <li key={node.id} className="flex flex-col gap-1.5">
                <h4 className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                  {node.label}
                </h4>
                <ul className="flex flex-col gap-1.5 pl-3">
                  {node.children.map((child) => (
                    <li key={child.id}>
                      <CategoryRow
                        active={activeCategory === child.slug}
                        onClick={() =>
                          onPickFilter("category", child.slug)
                        }
                      >
                        {child.label}
                      </CategoryRow>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              // Standalone top-level category with no children — clickable.
              <li key={node.id}>
                <CategoryRow
                  active={activeCategory === node.slug}
                  onClick={() => onPickFilter("category", node.slug)}
                >
                  {node.label}
                </CategoryRow>
              </li>
            )
          )}
        </ul>
      </FilterGroup>

      <FilterGroup label={labels.colors}>
        <div className="flex items-center gap-3">
          {colorOptions.map((color) => {
            const token = COLOR_TOKENS[color];
            if (!token) return null;
            const isActive = activeColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() =>
                  onPickFilter("color", isActive ? null : color)
                }
                aria-pressed={isActive}
                aria-label={token.label}
                title={token.label}
                className={`h-6 w-6 rounded-full transition ${token.swatch} ${
                  isActive ? `ring-1 ring-offset-2 ${token.ring}` : ""
                }`}
              />
            );
          })}
        </div>
      </FilterGroup>
    </>
  );
}

// ── Minimalist product card ─────────────────────────────────────────────────

function MinimalProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const { currency } = useCurrency();
  const title =
    product.title?.[locale] ?? product.title?.vi ?? product.title?.en ?? "";
  const price = formatPrice(product.price_vnd, currency, locale);
  const cover = product.images?.[0] ?? null;
  const swatchHex = colorHex(product.color_family, product.swatch_hex);

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group flex flex-col"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-gray-200">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>

      <div className="mt-2 flex items-start justify-between gap-2 md:mt-3 md:gap-3">
        <h3 className="truncate text-left text-xs font-bold text-black md:text-sm">
          {title}
        </h3>
        <p className="shrink-0 text-xs text-black tabular-nums md:text-sm">
          {price}
        </p>
      </div>

      {swatchHex && (
        <div className="mt-1 flex items-center gap-1 md:mt-1.5">
          <span
            className="h-3 w-3 rounded-full border border-gray-300"
            style={{ backgroundColor: swatchHex }}
            aria-hidden="true"
          />
        </div>
      )}
    </Link>
  );
}

// ── Local presentational helpers ─────────────────────────────────────────────

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-black">{label}</h3>
      {children}
    </div>
  );
}

function QuickFilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 shrink-0 border bg-white px-4 text-[11px] uppercase tracking-[0.12em] transition ${
        active
          ? "border-black font-bold text-black"
          : "border-gray-300 font-normal text-gray-600 hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function CategoryRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`block w-full text-left text-sm transition ${
        active ? "font-semibold text-black" : "text-gray-600 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function colorHex(
  family: ColorFamily | null | undefined,
  swatchHex?: string | null
): string | null {
  if (swatchHex) return swatchHex;
  switch (family) {
    case "black":
      return "#000000";
    case "white":
      return "#ffffff";
    case "gray":
      return "#6b7280";
    default:
      return null;
  }
}
