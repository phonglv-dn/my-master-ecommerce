/**
 * Generate the static default brand asset set from public/brand/defaults/logo-primary.svg.
 * Run: npx tsx scripts/generate-brand-defaults.ts
 *
 * Outputs into public/brand/defaults/:
 *   favicon.ico              (16/32/48 multi-size, dark bg + white S)
 *   apple-icon.png           (180x180, dark bg + white S)
 *   manifest-icon-512.png    (512x512, dark bg + white S)
 *   og-image.png             (1200x630, dark bg + centered white S)
 *
 * These files are committed to git as Layer-1 fallbacks. Admin uploads via
 * /admin/brand override them at runtime via Supabase Storage.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const DEFAULTS_DIR = join(process.cwd(), "public", "brand", "defaults");
const SOURCE_SVG = join(DEFAULTS_DIR, "logo-primary.svg");

const BRAND_INK = "#0a0a0a";

async function trimmedLogoBuffer(targetPx: number): Promise<Buffer> {
  // Render at 4x target so trim has enough resolution, then trim transparent
  // edges so the S fills the frame, then resize to target.
  const renderPx = targetPx * 4;
  const rendered = await sharp(SOURCE_SVG, { density: 300 })
    .resize(renderPx, renderPx, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const trimmed = await sharp(rendered).trim().toBuffer();
  return await sharp(trimmed)
    .resize(targetPx, targetPx, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function compositeOnDark(size: number, logoRatio = 0.7): Promise<Buffer> {
  const logoSize = Math.round(size * logoRatio);
  const logo = await trimmedLogoBuffer(logoSize);

  return await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_INK,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

async function generateFavicon(): Promise<void> {
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(sizes.map((s) => compositeOnDark(s, 0.78)));
  const ico = await pngToIco(buffers);
  writeFileSync(join(DEFAULTS_DIR, "favicon.ico"), ico);
  console.log(`✓ favicon.ico (${sizes.join("/")})`);
}

async function generateAppleIcon(): Promise<void> {
  const buf = await compositeOnDark(180, 0.7);
  writeFileSync(join(DEFAULTS_DIR, "apple-icon.png"), buf);
  console.log("✓ apple-icon.png (180x180)");
}

async function generateManifestIcon(): Promise<void> {
  const buf = await compositeOnDark(512, 0.65);
  writeFileSync(join(DEFAULTS_DIR, "manifest-icon-512.png"), buf);
  console.log("✓ manifest-icon-512.png (512x512)");
}

async function generateOgImage(): Promise<void> {
  const W = 1200;
  const H = 630;
  const logoPx = 360;
  const logo = await trimmedLogoBuffer(logoPx);

  const buf = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: BRAND_INK,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();

  writeFileSync(join(DEFAULTS_DIR, "og-image.png"), buf);
  console.log("✓ og-image.png (1200x630)");
}

async function main(): Promise<void> {
  // Sanity check: source must exist
  readFileSync(SOURCE_SVG);

  await generateFavicon();
  await generateAppleIcon();
  await generateManifestIcon();
  await generateOgImage();

  console.log("\nDone. Defaults in public/brand/defaults/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
