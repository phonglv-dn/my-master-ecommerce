"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import ProductCard from "../ProductCard/ProductCard";
import type { Product } from "../../../../types";

interface CollectionsProps {
  products: Product[];
}

export default function Collections({ products }: CollectionsProps) {
  // Use up to 3 products for this section
  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-24 px-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <h2 className="flex flex-col text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-black">
          <span>XIV COLLECTIONS</span>
          <span>23-24</span>
        </h2>
      </div>

      {/* Toolbar */}
      <div className="mb-12 flex flex-col items-center justify-between gap-6 border-b border-gray-100 pb-6 md:flex-row">
        {/* Tabs */}
        <div className="flex items-center gap-8">
          <button className="text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-1">
            All
          </button>
          <button className="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-black transition-colors pb-1">
            Men
          </button>
          <button className="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-black transition-colors pb-1">
            Women
          </button>
          <button className="text-sm font-medium uppercase tracking-widest text-gray-400 hover:text-black transition-colors pb-1">
            Kid
          </button>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            large={true} 
            showSwatches={true}
          />
        ))}
      </div>

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
