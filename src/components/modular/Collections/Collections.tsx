"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import type { Category, Locale, Product } from "../../../../types";

interface CollectionsProps {
  products: Product[];
  categories: Category[];
}

const ALL_TAB_ID = "ALL" as const;
const MAX_VISIBLE = 6;

export default function Collections({ products, categories }: CollectionsProps) {
  const locale = useLocale() as Locale;
  const [activeTabId, setActiveTabId] = useState<string>(ALL_TAB_ID);

  // Only leaf categories (those with a parent) act as filterable tabs —
  // products are tagged to leaves, so root-level tabs would always be empty.
  const leafCategories = useMemo(
    () => categories.filter((c) => c.parent_id !== null),
    [categories]
  );

  const tabs = useMemo(
    () => [
      { id: ALL_TAB_ID, label: "All" },
      ...leafCategories.map((c) => ({
        id: c.id,
        label: c.name[locale] ?? c.name.vi,
      })),
    ],
    [leafCategories, locale]
  );

  const filteredProducts = useMemo(() => {
    if (activeTabId === ALL_TAB_ID) return products;
    return products.filter((p) => p.category_id === activeTabId);
  }, [products, activeTabId]);

  const displayProducts = filteredProducts.slice(0, MAX_VISIBLE);

  return (
    <section className="py-24 px-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-black">
          CORE COLLECTION
        </h2>
      </div>

      {/* Toolbar */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-6 md:flex-row">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-8">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`text-sm uppercase tracking-widest pb-1 transition-colors ${
                  isActive
                    ? "font-bold text-black border-b border-black"
                    : "font-medium text-gray-500 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-black hover:opacity-70 transition-opacity">
            <span>Filter (4)</span>
            <SlidersHorizontal size={16} strokeWidth={2} />
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Sort by: <span className="font-semibold text-black">Latest</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              large={true}
              showSwatches={true}
              imageBgClass="bg-[#f0f0f0]"
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-sm uppercase tracking-widest text-gray-400">
          No products in this category yet.
        </div>
      )}

      {/* More Button */}
      <div className="mt-20 flex justify-center">
        <button
          className="group flex flex-col items-center gap-3 text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          aria-label="Load more collections"
        >
          <span>More</span>
          <ChevronDown
            size={24}
            strokeWidth={1}
            className="transition-transform duration-300 group-hover:translate-y-2"
          />
        </button>
      </div>
    </section>
  );
}
