import type { SHOP_CONFIG } from "../shop.config";

// ── Primitives ──────────────────────────────────────────────────────────────

/** A string value that exists in every supported locale. */
export type LocalizedString = {
  vi: string;
  en: string;
};

/** Convenience alias derived from the shop config so it stays in sync. */
export type Locale = (typeof SHOP_CONFIG.i18n.locales)[number]; // "vi" | "en"

/** Supported currency codes derived from the shop config. */
export type Currency = (typeof SHOP_CONFIG.currencies.codes)[number]; // "VND" | "USD"

// ── Database row types ──────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  /** Localized category name. */
  name: LocalizedString;
  created_at: string;
}

export interface Product {
  id: string;
  /** Localized product title. */
  title: LocalizedString;
  /** Localized product description. */
  description: LocalizedString;
  /** Base price in Vietnamese Dong (VND). */
  price_vnd: number;
  /** URL-friendly identifier, unique across all products. */
  slug: string;
  /** Ordered array of image URLs or Supabase Storage paths. */
  images: string[];
  /** Available stock quantity. */
  stock: number;
  /** Foreign key to categories table. */
  category_id: string | null;
  created_at: string;
  updated_at: string;
  /** Populated when joined with categories. */
  category?: Category;
}

// ── API / UI helpers ────────────────────────────────────────────────────────

/** A product enriched with a pre-formatted price string for display. */
export interface ProductWithPrice extends Product {
  /** e.g. "1.290.000 ₫"  or  "$51.60" */
  formattedPrice: string;
}

/** Generic paginated API response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
