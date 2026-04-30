import { getTranslations } from "next-intl/server";
import { getCategories, getProducts } from "../../../../../lib/supabase";
import { getLocalizedText } from "../../../../../lib/getLocalizedText";
import {
  buildCategoryTree,
  getLeafCategories,
} from "../../../../../utils/categoryUtils";
import type { ColorFamily } from "../../../../../types";
import type { Locale } from "../../../../../shop.config";
import ProductListClient from "./ProductListClient";

// ── Filter parsing ──────────────────────────────────────────────────────────
// Whitelist values flowing in from URL params so a malicious/typo'd `?color=`
// can never reach the database query.
const COLOR_FAMILIES = ["black", "white", "gray"] as const;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseColor(raw: string | undefined): ColorFamily | undefined {
  if (!raw) return undefined;
  return (COLOR_FAMILIES as readonly string[]).includes(raw)
    ? (raw as ColorFamily)
    : undefined;
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productList" });
  return { title: t("pageTitle") };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const [{ locale }, sp] = await Promise.all([params, searchParams]);

  const categorySlug = pickFirst(sp.category);
  const colorFamily = parseColor(pickFirst(sp.color));
  const size = pickFirst(sp.size)?.toUpperCase(); // sizes stored as "S","M",…

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug,
      colorFamily,
      size,
      limit: 60,
      withCategory: true,
    }),
  ]);

  // Localize category labels server-side so the client only deals with strings.
  // We keep `parent_id` so the tree builder can link parents to children.
  const localizedCategories = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    parent_id: c.parent_id,
    label: getLocalizedText(c.name, locale as Locale),
  }));

  // Sidebar consumes the full tree (parent groups → children). Quick filters
  // get the leaf list — only categories that have a parent and no children.
  const categoryTree = buildCategoryTree(localizedCategories);
  const leafCategories = getLeafCategories(localizedCategories);

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <ProductListClient
        products={products}
        categoryTree={categoryTree}
        leafCategories={leafCategories}
        colorOptions={[...COLOR_FAMILIES]}
      />
    </main>
  );
}
