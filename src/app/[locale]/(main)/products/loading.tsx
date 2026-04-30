import { getTranslations } from "next-intl/server";
import { ProductSkeletonGrid } from "./ProductSkeleton";

// Next.js auto-renders this while the /products server component awaits
// its Supabase fetches, so the user sees the page chrome + skeletons
// instead of a blank white screen.
export default async function ProductsLoading() {
  const t = await getTranslations("productList");
  const tc = await getTranslations("common");

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-2 text-xs text-gray-500">
          <span className="text-gray-700">{tc("home")}</span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-700">{tc("products")}</span>
        </nav>

        <h1 className="mb-8 font-sans text-2xl font-bold uppercase tracking-tight text-black md:text-3xl">
          {t("pageTitle")}
        </h1>

        {/* Search + filters chrome — keep static so the layout doesn't jump */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <div className="h-11 w-full animate-pulse bg-gray-200 lg:max-w-md" />
          <div className="hidden flex-1 gap-2 md:flex">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-24 animate-pulse bg-gray-200"
              />
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
          {/* Sidebar skeleton — desktop only */}
          <aside className="hidden flex-col gap-8 lg:flex" aria-hidden="true">
            <div className="h-5 w-24 animate-pulse bg-gray-200" />
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse bg-gray-200" />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-2/3 animate-pulse bg-gray-200"
                />
              ))}
            </div>
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-6 animate-pulse rounded-full bg-gray-200"
                />
              ))}
            </div>
          </aside>

          <ProductSkeletonGrid count={9} />
        </div>
      </div>
    </main>
  );
}
