import { createClient } from "@supabase/supabase-js";
import type {
  Product,
  Category,
  ColorFamily,
  HomepageBlockKey,
  HomepageContent,
} from "../types";

// ── Environment variables ────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
}

// ── Singleton client (browser / RSC) ────────────────────────────────────────
/**
 * A single Supabase client instance that is safe to use in both
 * Client Components and React Server Components.
 *
 * For Server Actions / Route Handlers that need to respect the
 * user's session (auth cookies), use `createServerClient()` instead.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates a fresh Supabase client on every call.
 * Useful inside Server Actions or API Route Handlers where you want
 * to be explicit about isolation.
 */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

// ── Typed query helpers ──────────────────────────────────────────────────────

/**
 * Fetch a single product by its slug, optionally joining the category.
 */
export async function getProductBySlug(
  slug: string,
  { withCategory = false } = {}
): Promise<Product | null> {
  const query = supabase
    .from("products")
    .select(withCategory ? "*, category:categories(*)" : "*")
    .eq("slug", slug)
    .single();

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] getProductBySlug error:", error.message);
    return null;
  }
  return data as unknown as Product;
}

/**
 * Fetch products, optionally filtered by category slug, color family, and/or size.
 *
 * Filters:
 * - `categorySlug` joins `categories` and filters by its slug column.
 * - `colorFamily` matches the vocabulary-locked `color_family` column.
 * - `size` matches when the product's `sizes` text[] contains the value.
 */
export async function getProducts(options?: {
  categorySlug?: string;
  colorFamily?: ColorFamily;
  size?: string;
  limit?: number;
  offset?: number;
  withCategory?: boolean;
}): Promise<Product[]> {
  const {
    categorySlug,
    colorFamily,
    size,
    limit = 20,
    offset = 0,
    withCategory = false,
  } = options ?? {};

  // Pick a select string. When filtering by category slug we need an inner join;
  // otherwise the join is optional and only added when callers ask for it.
  const selectString = categorySlug
    ? withCategory
      ? "*, category:categories!inner(*)"
      : "*, category:categories!inner(slug)"
    : withCategory
      ? "*, category:categories(*)"
      : "*";

  let query = supabase
    .from("products")
    .select(selectString)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }
  if (colorFamily) {
    query = query.eq("color_family", colorFamily);
  }
  if (size) {
    // `sizes` is a text[] column — `contains` checks set membership.
    query = query.contains("sizes", [size]);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] getProducts error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

/**
 * Fetch a single homepage block by key, or null if missing.
 * Storefront uses null fallback to render i18n defaults.
 */
export async function getHomepageBlock(
  blockKey: HomepageBlockKey
): Promise<HomepageContent | null> {
  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("block_key", blockKey)
    .maybeSingle();

  if (error) {
    console.error("[supabase] getHomepageBlock error:", error.message);
    return null;
  }
  return (data as HomepageContent | null) ?? null;
}

/**
 * Fetch all categories.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("slug");

  if (error) {
    console.error("[supabase] getCategories error:", error.message);
    return [];
  }
  return (data ?? []) as Category[];
}
