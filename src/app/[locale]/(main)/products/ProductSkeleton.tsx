// Skeleton placeholders that mirror MinimalProductCard's geometry: a 4:5 image
// block, the title row, and the price/swatch row.

export function ProductSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-4/5 w-full animate-pulse bg-gray-200" />
      <div className="mt-3 h-3 w-3/4 animate-pulse bg-gray-200" />
      <div className="mt-2 h-2.5 w-1/3 animate-pulse bg-gray-200" />
    </div>
  );
}

export function ProductSkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-x-4 md:gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
