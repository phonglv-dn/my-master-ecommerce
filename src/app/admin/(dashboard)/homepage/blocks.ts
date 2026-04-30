import type { HomepageBlockKey } from "../../../../../types";

export interface BlockFieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

export interface BlockSchema {
  key: HomepageBlockKey;
  label: string;
  description: string;
  fields: BlockFieldDef[];
  hasImages?: boolean;
  imageCount?: number;
}

export const BLOCK_SCHEMAS: BlockSchema[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Tiêu đề lớn ở đầu trang chủ + subtitle + CTA.",
    fields: [
      { key: "titleLine1", label: "Dòng tiêu đề 1" },
      { key: "titleLine2", label: "Dòng tiêu đề 2" },
      { key: "subtitle", label: "Phụ đề" },
      { key: "shopCta", label: "Nút CTA" },
    ],
  },
  {
    key: "new_this_week",
    label: "New This Week",
    description: "Tiêu đề khu vực sản phẩm mới trong tuần.",
    fields: [
      { key: "titleLine1", label: "Dòng tiêu đề 1" },
      { key: "titleLine2", label: "Dòng tiêu đề 2" },
      { key: "seeAll", label: "Liên kết Xem tất cả" },
    ],
  },
  {
    key: "collections",
    label: "Collections",
    description: "Tiêu đề khu vực bộ sưu tập.",
    fields: [{ key: "title", label: "Tiêu đề" }],
  },
  {
    key: "lookbook",
    label: "Lookbook",
    description: "Title, mô tả và 4 ảnh lookbook.",
    fields: [
      { key: "title", label: "Tiêu đề" },
      { key: "description", label: "Mô tả", multiline: true },
    ],
    hasImages: true,
    imageCount: 4,
  },
];

export function getBlockSchema(key: string): BlockSchema | undefined {
  return BLOCK_SCHEMAS.find((b) => b.key === key);
}
