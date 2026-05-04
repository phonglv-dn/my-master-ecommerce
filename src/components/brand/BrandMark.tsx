import { getBrandAsset } from "../../../lib/brand/getBrandAssets";
import { ASSET_TYPE_CONFIGS } from "../../../lib/brand/asset-types";
import { SHOP_CONFIG } from "../../../shop.config";
import BrandMarkImage from "./BrandMarkImage";

export type BrandTone = "light" | "dark";

export interface BrandMarkProps {
  /** "light" = white logo for dark backgrounds; "dark" = black logo for light backgrounds. */
  tone: BrandTone;
  /** Width and height in px (square). Default: 28. */
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Server component — resolves the active logo URL (admin override or static
 * default) and hands off to the client BrandMarkImage which manages onError
 * fallbacks.
 */
export default async function BrandMark({
  tone,
  size = 28,
  className,
  alt,
}: BrandMarkProps) {
  const type = tone === "light" ? "logo_primary" : "logo_inverse";
  const asset = await getBrandAsset(type);
  const staticFallback = ASSET_TYPE_CONFIGS[type].staticDefaultPath;

  return (
    <BrandMarkImage
      primarySrc={asset.url}
      fallbackSrc={staticFallback}
      size={size}
      className={className}
      alt={alt ?? SHOP_CONFIG.brand.name}
      brandName={SHOP_CONFIG.brand.name}
    />
  );
}
