import "server-only";
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  ASSET_TYPES,
  ASSET_TYPE_CONFIGS,
  type AssetType,
} from "./asset-types";

// A cookie-free Supabase client for read-only public access.
// unstable_cache forbids dynamic data sources (cookies, headers) inside its
// scope, so we use the anon key with no auth context. RLS "brand_assets:
// public read" allows this.
const readClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const BRAND_ASSETS_CACHE_TAG = "brand-assets";

export interface ResolvedAsset {
  type: AssetType;
  /** URL the frontend should render. Always non-empty — falls back to /public/brand/defaults/. */
  url: string;
  mime: string;
  /** true = admin-uploaded, false = static default in /public/. */
  isOverride: boolean;
  isDerived: boolean;
  derivedFrom: AssetType | null;
  width: number | null;
  height: number | null;
  version: number;
  updatedAt: string | null;
}

interface BrandAssetRow {
  asset_type: string;
  storage_path: string | null;
  public_url: string | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  is_derived: boolean;
  derived_from: string | null;
  version: number;
  updated_at: string;
}

function staticFallback(type: AssetType): ResolvedAsset {
  const cfg = ASSET_TYPE_CONFIGS[type];
  return {
    type,
    url: cfg.staticDefaultPath,
    mime: cfg.staticDefaultMime,
    isOverride: false,
    isDerived: false,
    derivedFrom: null,
    width: null,
    height: null,
    version: 0,
    updatedAt: null,
  };
}

async function fetchBrandAssets(): Promise<Record<AssetType, ResolvedAsset>> {
  const result = Object.fromEntries(
    ASSET_TYPES.map((t) => [t, staticFallback(t)]),
  ) as Record<AssetType, ResolvedAsset>;

  try {
    const { data, error } = await readClient
      .from("brand_assets")
      .select(
        "asset_type, storage_path, public_url, mime_type, width, height, is_derived, derived_from, version, updated_at",
      );

    if (error) {
      console.warn(
        "[brand-assets] DB read failed, falling back to static defaults:",
        error.message,
      );
      return result;
    }

    for (const row of (data ?? []) as BrandAssetRow[]) {
      const type = row.asset_type as AssetType;
      if (!result[type]) continue; // unknown asset_type in DB — ignore
      if (!row.public_url) continue; // empty slot — keep static default

      result[type] = {
        type,
        url: row.public_url,
        mime: row.mime_type ?? "application/octet-stream",
        isOverride: true,
        isDerived: row.is_derived,
        derivedFrom: (row.derived_from as AssetType | null) ?? null,
        width: row.width,
        height: row.height,
        version: row.version,
        updatedAt: row.updated_at,
      };
    }
  } catch (e) {
    console.warn(
      "[brand-assets] unexpected error, falling back to static defaults:",
      e,
    );
  }

  return result;
}

/**
 * Cached read of all brand assets. Invalidated by `revalidateTag(BRAND_ASSETS_CACHE_TAG)`
 * in the upload server action.
 *
 * On any error (DB unreachable, schema missing, …) returns the static defaults
 * so the site never renders without a logo.
 */
export const getBrandAssets = unstable_cache(
  fetchBrandAssets,
  ["brand-assets"],
  { tags: [BRAND_ASSETS_CACHE_TAG] },
);

export async function getBrandAsset(type: AssetType): Promise<ResolvedAsset> {
  const all = await getBrandAssets();
  return all[type];
}
