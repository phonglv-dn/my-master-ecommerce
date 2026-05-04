"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createHash } from "node:crypto";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { requireAdmin } from "../../../../../lib/auth";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import {
  ASSET_TYPE_CONFIGS,
  isAssetType,
  sniffMime,
  validateDimensions,
  type AssetType,
} from "../../../../../lib/brand/asset-types";
import { sanitizeSvg } from "../../../../../lib/brand/svgSanitize";
import { BRAND_ASSETS_CACHE_TAG } from "../../../../../lib/brand/getBrandAssets";

const BUCKET = "brand-assets";

export interface BrandActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

interface PreparedAsset {
  buffer: Buffer;
  mime: string;
  ext: string;
  width: number;
  height: number;
}

async function prepare(
  type: AssetType,
  rawBuffer: Buffer,
): Promise<PreparedAsset> {
  const cfg = ASSET_TYPE_CONFIGS[type];

  if (rawBuffer.length > cfg.maxBytes) {
    throw new Error(
      `File quá lớn — tối đa ${(cfg.maxBytes / 1024).toFixed(0)} KB.`,
    );
  }

  const sniffed = sniffMime(rawBuffer);
  if (!sniffed || !cfg.mimeTypes.includes(sniffed)) {
    throw new Error(
      `Định dạng không hợp lệ. Loại "${cfg.label.vi}" chỉ chấp nhận: ${cfg.mimeTypes.join(", ")}.`,
    );
  }

  const mime = sniffed;
  let buffer = rawBuffer;

  if (mime === "image/svg+xml") {
    const sanitized = sanitizeSvg(rawBuffer.toString("utf8"));
    buffer = Buffer.from(sanitized, "utf8");
  }

  // Read dimensions. Sharp reads SVG via librsvg, PNG/JPG natively.
  // ICO is not directly supported by sharp; treat as opaque and read header.
  let width: number | undefined;
  let height: number | undefined;
  if (mime === "image/x-icon" || mime === "image/vnd.microsoft.icon") {
    // ICO header: bytes 6 (width) and 7 (height), 0 means 256.
    if (buffer.length < 8) throw new Error("File ICO không hợp lệ.");
    width = buffer[6] === 0 ? 256 : buffer[6];
    height = buffer[7] === 0 ? 256 : buffer[7];
  } else {
    const meta = await sharp(buffer).metadata();
    width = meta.width;
    height = meta.height;
  }

  const dimErr = validateDimensions(width, height, cfg);
  if (dimErr) throw new Error(dimErr.message);

  const ext = (() => {
    switch (mime) {
      case "image/svg+xml":
        return "svg";
      case "image/png":
        return "png";
      case "image/jpeg":
        return "jpg";
      case "image/x-icon":
      case "image/vnd.microsoft.icon":
        return "ico";
      default:
        return "bin";
    }
  })();

  return { buffer, mime, ext, width: width!, height: height! };
}

async function uploadToStorage(
  type: AssetType,
  prepared: PreparedAsset,
): Promise<{ storagePath: string; publicUrl: string }> {
  const db = await createSupabaseServerClient();
  const hash = createHash("sha256")
    .update(prepared.buffer)
    .digest("hex")
    .slice(0, 16);
  const objectPath = `${type}/${hash}.${prepared.ext}`;

  const { error: uploadErr } = await db.storage
    .from(BUCKET)
    .upload(objectPath, prepared.buffer, {
      contentType: prepared.mime,
      upsert: true,
      cacheControl: "31536000, immutable",
    });
  if (uploadErr) {
    throw new Error(`Upload lên Storage thất bại: ${uploadErr.message}`);
  }

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(objectPath);
  return {
    storagePath: `${BUCKET}/${objectPath}`,
    publicUrl: urlData.publicUrl,
  };
}

async function persistRow(args: {
  type: AssetType;
  prepared: PreparedAsset;
  storagePath: string;
  publicUrl: string;
  isDerived: boolean;
  derivedFrom: AssetType | null;
  userId: string;
}): Promise<void> {
  const db = await createSupabaseServerClient();
  const { type, prepared, storagePath, publicUrl, isDerived, derivedFrom, userId } =
    args;

  // Upsert: bump version on conflict, write new file path.
  const { data: existing } = await db
    .from("brand_assets")
    .select("version")
    .eq("asset_type", type)
    .maybeSingle();

  const nextVersion = (existing?.version ?? 0) + 1;

  const { error: upsertErr } = await db.from("brand_assets").upsert(
    {
      asset_type: type,
      storage_path: storagePath,
      public_url: publicUrl,
      mime_type: prepared.mime,
      width: prepared.width,
      height: prepared.height,
      file_size_bytes: prepared.buffer.length,
      is_derived: isDerived,
      derived_from: derivedFrom,
      version: nextVersion,
      updated_by: userId,
    },
    { onConflict: "asset_type" },
  );

  if (upsertErr) {
    throw new Error(`Ghi DB thất bại: ${upsertErr.message}`);
  }
}

/**
 * Render the master logo onto a dark canvas and return a PNG buffer of the
 * given size — used to derive favicon/apple/manifest/og from logo_primary.
 */
async function compositeOnDark(
  masterBuffer: Buffer,
  size: number,
  logoRatio = 0.7,
): Promise<Buffer> {
  const logoPx = Math.round(size * logoRatio);
  const logo = await sharp(masterBuffer, { density: 300 })
    .resize(logoPx, logoPx, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#0a0a0a",
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toBuffer();
}

async function deriveAndPersist(
  master: PreparedAsset,
  derivedType: AssetType,
  userId: string,
): Promise<void> {
  const db = await createSupabaseServerClient();

  // Don't overwrite a manually-uploaded override.
  const { data: existing } = await db
    .from("brand_assets")
    .select("is_derived")
    .eq("asset_type", derivedType)
    .maybeSingle();
  if (existing && existing.is_derived === false) {
    return; // admin override exists — leave it alone
  }

  let buf: Buffer;
  let mime: string;
  let ext: string;
  let width: number;
  let height: number;

  switch (derivedType) {
    case "logo_inverse": {
      // Render master → PNG, invert RGB channels (alpha untouched).
      const rendered = await sharp(master.buffer, { density: 300 })
        .resize(1024, 1024, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .negate({ alpha: false })
        .png()
        .toBuffer();
      buf = rendered;
      mime = "image/png";
      ext = "png";
      width = 1024;
      height = 1024;
      break;
    }
    case "favicon": {
      const sizes = [16, 32, 48];
      const buffers = await Promise.all(
        sizes.map((s) => compositeOnDark(master.buffer, s, 0.78)),
      );
      buf = await pngToIco(buffers);
      mime = "image/x-icon";
      ext = "ico";
      width = 32;
      height = 32;
      break;
    }
    case "apple_touch_icon": {
      buf = await compositeOnDark(master.buffer, 180, 0.7);
      mime = "image/png";
      ext = "png";
      width = 180;
      height = 180;
      break;
    }
    case "manifest_icon_512": {
      buf = await compositeOnDark(master.buffer, 512, 0.65);
      mime = "image/png";
      ext = "png";
      width = 512;
      height = 512;
      break;
    }
    default:
      return; // og_image and others — not derivable
  }

  const prepared: PreparedAsset = { buffer: buf, mime, ext, width, height };
  const { storagePath, publicUrl } = await uploadToStorage(derivedType, prepared);
  await persistRow({
    type: derivedType,
    prepared,
    storagePath,
    publicUrl,
    isDerived: true,
    derivedFrom: "logo_primary",
    userId,
  });
}

export async function uploadBrandAsset(
  _prev: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  try {
    const user = await requireAdmin();

    const rawType = formData.get("asset_type");
    if (typeof rawType !== "string" || !isAssetType(rawType)) {
      return { error: "Loại asset không hợp lệ." };
    }
    const type = rawType;

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Vui lòng chọn file." };
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const prepared = await prepare(type, rawBuffer);
    const { storagePath, publicUrl } = await uploadToStorage(type, prepared);

    await persistRow({
      type,
      prepared,
      storagePath,
      publicUrl,
      isDerived: false,
      derivedFrom: null,
      userId: user.id,
    });

    // If this is the master logo, regenerate any derived asset that hasn't
    // been manually overridden.
    if (type === "logo_primary") {
      await Promise.all([
        deriveAndPersist(prepared, "logo_inverse", user.id),
        deriveAndPersist(prepared, "favicon", user.id),
        deriveAndPersist(prepared, "apple_touch_icon", user.id),
        deriveAndPersist(prepared, "manifest_icon_512", user.id),
      ]);
    }

    updateTag(BRAND_ASSETS_CACHE_TAG);
    revalidatePath("/", "layout");
    revalidatePath("/admin/brand");

    return {
      ok: true,
      message:
        type === "logo_primary"
          ? "Đã cập nhật logo chính + tự sinh các asset phụ."
          : "Đã cập nhật.",
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lỗi không xác định." };
  }
}

export async function deleteBrandAsset(
  _prev: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  try {
    await requireAdmin();
    const rawType = formData.get("asset_type");
    if (typeof rawType !== "string" || !isAssetType(rawType)) {
      return { error: "Loại asset không hợp lệ." };
    }

    const db = await createSupabaseServerClient();
    const { error } = await db
      .from("brand_assets")
      .delete()
      .eq("asset_type", rawType);
    if (error) {
      return { error: `Xoá DB thất bại: ${error.message}` };
    }

    updateTag(BRAND_ASSETS_CACHE_TAG);
    revalidatePath("/", "layout");
    revalidatePath("/admin/brand");

    return { ok: true, message: "Đã xoá. Site sẽ dùng asset mặc định." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lỗi không xác định." };
  }
}
