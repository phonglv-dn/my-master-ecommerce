"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { requireAdmin } from "../../../../../lib/auth";
import type { LocalizedString } from "../../../../../types";

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function emptyToNull(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? null : s;
}

const COLOR_FAMILIES = ["black", "white"] as const;
const FITS = ["slim", "regular", "oversized"] as const;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

type ProductAttrs = {
  color_code: string | null;
  color_family: string | null;
  swatch_hex: string | null;
  fit: string | null;
  material: string | null;
  sizes: string[];
};

/**
 * Parse + validate the variant/filter attributes shared between create + update.
 * Returns either { attrs } on success or { error } on validation failure.
 */
function parseAttrs(formData: FormData):
  | { attrs: ProductAttrs }
  | { error: string } {
  const color_code = emptyToNull(formData.get("color_code"));
  const color_family = emptyToNull(formData.get("color_family"));
  const swatch_hex = emptyToNull(formData.get("swatch_hex"));
  const fit = emptyToNull(formData.get("fit"));
  const material = emptyToNull(formData.get("material"));
  const sizes = formData
    .getAll("sizes")
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (color_family && !COLOR_FAMILIES.includes(color_family as (typeof COLOR_FAMILIES)[number])) {
    return { error: `Họ màu không hợp lệ. Chọn một trong: ${COLOR_FAMILIES.join(", ")}.` };
  }
  if (fit && !FITS.includes(fit as (typeof FITS)[number])) {
    return { error: `Form không hợp lệ. Chọn một trong: ${FITS.join(", ")}.` };
  }
  if (swatch_hex && !HEX_RE.test(swatch_hex)) {
    return { error: `Mã hex swatch phải có dạng #RRGGBB (ví dụ #0B0B0B).` };
  }

  return {
    attrs: { color_code, color_family, swatch_hex, fit, material, sizes },
  };
}

// ── createProduct ─────────────────────────────────────────────────────────────

export type CreateProductState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  await requireAdmin();
  const titleVi = (formData.get("title_vi") as string | null)?.trim() ?? "";
  const titleEn = (formData.get("title_en") as string | null)?.trim() ?? "";
  const descVi = (formData.get("desc_vi") as string | null)?.trim() ?? "";
  const descEn = (formData.get("desc_en") as string | null)?.trim() ?? "";
  const priceRaw = (formData.get("price_vnd") as string | null) ?? "";
  const stockRaw = (formData.get("stock") as string | null) ?? "0";
  const customSlug = (formData.get("slug") as string | null)?.trim() ?? "";

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!titleVi) return { error: "Vui lòng nhập Tên sản phẩm (Tiếng Việt)." };
  if (!titleEn) return { error: "Vui lòng nhập Tên sản phẩm (English)." };

  const price = parseFloat(priceRaw.replace(/[^\d.]/g, ""));
  if (isNaN(price) || price < 0)
    return { error: "Giá sản phẩm không hợp lệ (phải là số không âm)." };

  const stock = parseInt(stockRaw, 10);
  if (isNaN(stock) || stock < 0)
    return { error: "Số lượng tồn kho không hợp lệ." };

  const slug = customSlug || slugify(titleVi);
  if (!slug) return { error: "Không thể tạo slug từ tên sản phẩm." };

  const attrsResult = parseAttrs(formData);
  if ("error" in attrsResult) return { error: attrsResult.error };

  const title: LocalizedString = { vi: titleVi, en: titleEn };
  const description: LocalizedString = { vi: descVi, en: descEn };

  // ── Insert ──────────────────────────────────────────────────────────────────
  const db = await createSupabaseServerClient();
  const { error } = await db.from("products").insert({
    title,
    description,
    price_vnd: price,
    slug,
    stock,
    images: [],
    ...attrsResult.attrs,
  });

  if (error) {
    if (error.code === "23505") {
      return {
        error: `Slug "${slug}" đã tồn tại. Hãy đặt slug khác hoặc đổi tên sản phẩm.`,
      };
    }
    return { error: `Lỗi khi lưu sản phẩm: ${error.message}` };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ── deleteProduct ─────────────────────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const db = await createSupabaseServerClient();
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) {
    console.error("[admin] deleteProduct error:", error.message);
  }
  revalidatePath("/admin/products");
}

// ── updateProduct ─────────────────────────────────────────────────────────────

export async function updateProduct(
  id: string,
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  await requireAdmin();
  const titleVi = (formData.get("title_vi") as string | null)?.trim() ?? "";
  const titleEn = (formData.get("title_en") as string | null)?.trim() ?? "";
  const descVi = (formData.get("desc_vi") as string | null)?.trim() ?? "";
  const descEn = (formData.get("desc_en") as string | null)?.trim() ?? "";
  const priceRaw = (formData.get("price_vnd") as string | null) ?? "";
  const stockRaw = (formData.get("stock") as string | null) ?? "0";
  const customSlug = (formData.get("slug") as string | null)?.trim() ?? "";

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!titleVi) return { error: "Vui lòng nhập Tên sản phẩm (Tiếng Việt)." };
  if (!titleEn) return { error: "Vui lòng nhập Tên sản phẩm (English)." };

  const price = parseFloat(priceRaw.replace(/[^\d.]/g, ""));
  if (isNaN(price) || price < 0)
    return { error: "Giá sản phẩm không hợp lệ (phải là số không âm)." };

  const stock = parseInt(stockRaw, 10);
  if (isNaN(stock) || stock < 0)
    return { error: "Số lượng tồn kho không hợp lệ." };

  const slug = customSlug || slugify(titleVi);
  if (!slug) return { error: "Không thể tạo slug từ tên sản phẩm." };

  const attrsResult = parseAttrs(formData);
  if ("error" in attrsResult) return { error: attrsResult.error };

  const title: LocalizedString = { vi: titleVi, en: titleEn };
  const description: LocalizedString = { vi: descVi, en: descEn };

  // ── Update ──────────────────────────────────────────────────────────────────
  const db = await createSupabaseServerClient();
  const { error } = await db
    .from("products")
    .update({
      title,
      description,
      price_vnd: price,
      slug,
      stock,
      ...attrsResult.attrs,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: `Slug "${slug}" đã tồn tại. Hãy đặt slug khác hoặc đổi tên sản phẩm.`,
      };
    }
    return { error: `Lỗi khi cập nhật sản phẩm: ${error.message}` };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  redirect("/admin/products");
}
