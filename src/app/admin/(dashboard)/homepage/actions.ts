"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { requireAdmin } from "../../../../../lib/auth";
import { getBlockSchema } from "./blocks";
import type {
  HomepageBlockKey,
  LocalizedString,
  LookbookImage,
} from "../../../../../types";

export type UpdateBlockState = { error?: string; success?: boolean };

export async function updateHomepageBlock(
  blockKey: HomepageBlockKey,
  _prev: UpdateBlockState,
  formData: FormData
): Promise<UpdateBlockState> {
  await requireAdmin();

  const schema = getBlockSchema(blockKey);
  if (!schema) return { error: "Block không tồn tại." };

  const text_data: Record<string, LocalizedString> = {};
  for (const field of schema.fields) {
    const vi = (formData.get(`${field.key}_vi`) as string | null)?.trim() ?? "";
    const en = (formData.get(`${field.key}_en`) as string | null)?.trim() ?? "";
    text_data[field.key] = { vi, en };
  }

  const db = await createSupabaseServerClient();

  const updates: { text_data: typeof text_data; image_data?: { images: LookbookImage[] } } = {
    text_data,
  };

  if (schema.hasImages && schema.imageCount) {
    const images: LookbookImage[] = [];
    for (let i = 0; i < schema.imageCount; i++) {
      const url = (formData.get(`image_${i}_url`) as string | null)?.trim() ?? "";
      const altVi =
        (formData.get(`image_${i}_alt_vi`) as string | null)?.trim() ?? "";
      const altEn =
        (formData.get(`image_${i}_alt_en`) as string | null)?.trim() ?? "";
      images.push({ url, alt_vi: altVi, alt_en: altEn });
    }
    updates.image_data = { images };
  }

  const { error } = await db
    .from("homepage_content")
    .update(updates)
    .eq("block_key", blockKey);

  if (error) {
    return { error: `Lỗi khi lưu: ${error.message}` };
  }

  revalidatePath("/admin/homepage");
  revalidatePath(`/admin/homepage/${blockKey}`);
  revalidatePath("/", "layout");

  return { success: true };
}
