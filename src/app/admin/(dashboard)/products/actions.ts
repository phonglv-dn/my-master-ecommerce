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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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
  });

  if (error) {
    // Duplicate slug
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
    })
    .eq("id", id);

  if (error) {
    // Duplicate slug
    if (error.code === "23505") {
      return {
        error: `Slug "${slug}" đã tồn tại. Hãy đặt slug khác hoặc đổi tên sản phẩm.`,
      };
    }
    return { error: `Lỗi khi cập nhật sản phẩm: ${error.message}` };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  // also should revalidate the storefront product page, but we don't know the locale
  // Next.js revalidatePath is usually path-specific, but maybe layout is enough?
  
  redirect("/admin/products");
}
