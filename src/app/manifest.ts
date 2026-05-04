import type { MetadataRoute } from "next";
import { SHOP_CONFIG } from "../../shop.config";
import { getBrandAssets } from "../../lib/brand/getBrandAssets";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const assets = await getBrandAssets();
  const brandName = SHOP_CONFIG.brand.name;

  return {
    name: brandName,
    short_name: brandName,
    description: `${brandName} — Unisex streetwear, monochrome by design.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: assets.favicon.url,
        sizes: "any",
        type: assets.favicon.mime,
      },
      {
        src: assets.apple_touch_icon.url,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: assets.manifest_icon_512.url,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: assets.manifest_icon_512.url,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
