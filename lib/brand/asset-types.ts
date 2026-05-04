/**
 * Brand asset type registry — single source of truth for what kinds of brand
 * images the admin can upload, what's valid for each, and what static file
 * the frontend falls back to when nothing has been uploaded yet.
 */

export const ASSET_TYPES = [
  "logo_primary",
  "logo_inverse",
  "favicon",
  "apple_touch_icon",
  "og_image",
  "manifest_icon_512",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export interface AssetTypeConfig {
  type: AssetType;
  label: { vi: string; en: string };
  description: { vi: string; en: string };
  /** Allowed mime types — verified by magic bytes, not the Content-Type header. */
  mimeTypes: readonly string[];
  maxBytes: number;
  width: { min?: number; max?: number; exact?: number };
  height: { min?: number; max?: number; exact?: number };
  /** width / height. tolerance is fractional, e.g. 0.05 = ±5%. */
  aspectRatio?: { ratio: number; tolerance: number };
  /** If set, the upload server action can auto-generate this from another asset. */
  derivedFrom?: AssetType;
  /** Path under /public served by Next.js. Used when DB row is missing or has NULL public_url. */
  staticDefaultPath: string;
  staticDefaultMime: string;
}

export const ASSET_TYPE_CONFIGS: Record<AssetType, AssetTypeConfig> = {
  logo_primary: {
    type: "logo_primary",
    label: { vi: "Logo chính", en: "Primary logo" },
    description: {
      vi: "Logo phiên bản sáng — dùng trên nền tối (header overlay menu, footer). Khuyến nghị SVG để phóng vô tận không vỡ nét.",
      en: "Light variant — for dark backgrounds. SVG recommended.",
    },
    mimeTypes: ["image/svg+xml", "image/png"],
    maxBytes: 500 * 1024,
    width: { min: 256 },
    height: { min: 256 },
    aspectRatio: { ratio: 1, tolerance: 0.25 },
    staticDefaultPath: "/brand/defaults/logo-primary.svg",
    staticDefaultMime: "image/svg+xml",
  },
  logo_inverse: {
    type: "logo_inverse",
    label: { vi: "Logo nghịch đảo", en: "Inverse logo" },
    description: {
      vi: "Logo phiên bản tối — dùng trên nền sáng (header mặc định). Tự động sinh từ logo chính nếu không upload riêng.",
      en: "Dark variant — for light backgrounds. Auto-derived from primary logo if not uploaded.",
    },
    mimeTypes: ["image/svg+xml", "image/png"],
    maxBytes: 500 * 1024,
    width: { min: 256 },
    height: { min: 256 },
    aspectRatio: { ratio: 1, tolerance: 0.25 },
    derivedFrom: "logo_primary",
    staticDefaultPath: "/brand/defaults/logo-inverse.svg",
    staticDefaultMime: "image/svg+xml",
  },
  favicon: {
    type: "favicon",
    label: { vi: "Favicon", en: "Favicon" },
    description: {
      vi: "Icon hiển thị trên tab trình duyệt. Tự sinh từ logo chính (32×32) nếu không upload riêng.",
      en: "Browser tab icon. Auto-derived from primary logo (32×32) if not uploaded.",
    },
    mimeTypes: ["image/png", "image/x-icon", "image/vnd.microsoft.icon"],
    maxBytes: 200 * 1024,
    width: { min: 32, max: 1024 },
    height: { min: 32, max: 1024 },
    aspectRatio: { ratio: 1, tolerance: 0.05 },
    derivedFrom: "logo_primary",
    staticDefaultPath: "/brand/defaults/favicon.ico",
    staticDefaultMime: "image/x-icon",
  },
  apple_touch_icon: {
    type: "apple_touch_icon",
    label: { vi: "Apple touch icon", en: "Apple touch icon" },
    description: {
      vi: "Icon hiển thị khi user thêm trang vào màn hình chính iOS (180×180). Tự sinh từ logo chính nếu không upload.",
      en: "Icon for iOS home screen (180×180). Auto-derived from primary logo if not uploaded.",
    },
    mimeTypes: ["image/png"],
    maxBytes: 200 * 1024,
    width: { exact: 180 },
    height: { exact: 180 },
    aspectRatio: { ratio: 1, tolerance: 0 },
    derivedFrom: "logo_primary",
    staticDefaultPath: "/brand/defaults/apple-icon.png",
    staticDefaultMime: "image/png",
  },
  og_image: {
    type: "og_image",
    label: { vi: "Ảnh share mạng xã hội", en: "Social share image" },
    description: {
      vi: "Ảnh preview khi share lên Facebook, Twitter, Zalo… Bắt buộc 1200×630 (aspect 1.91:1). Không tự sinh được.",
      en: "Preview image for social sharing. Must be 1200×630 (1.91:1). Cannot be auto-derived.",
    },
    mimeTypes: ["image/png", "image/jpeg"],
    maxBytes: 1024 * 1024,
    width: { exact: 1200 },
    height: { exact: 630 },
    aspectRatio: { ratio: 1200 / 630, tolerance: 0.01 },
    staticDefaultPath: "/brand/defaults/og-image.png",
    staticDefaultMime: "image/png",
  },
  manifest_icon_512: {
    type: "manifest_icon_512",
    label: { vi: "Icon PWA 512×512", en: "PWA icon 512×512" },
    description: {
      vi: "Icon dùng khi user cài site như app (PWA). 512×512. Tự sinh từ logo chính nếu không upload.",
      en: "PWA install icon (512×512). Auto-derived from primary logo if not uploaded.",
    },
    mimeTypes: ["image/png"],
    maxBytes: 300 * 1024,
    width: { exact: 512 },
    height: { exact: 512 },
    aspectRatio: { ratio: 1, tolerance: 0 },
    derivedFrom: "logo_primary",
    staticDefaultPath: "/brand/defaults/manifest-icon-512.png",
    staticDefaultMime: "image/png",
  },
};

export function isAssetType(value: string): value is AssetType {
  return (ASSET_TYPES as readonly string[]).includes(value);
}

/** Magic-byte sniff. Don't trust the client-supplied Content-Type. */
export function sniffMime(buf: Buffer): string | null {
  if (buf.length < 4) return null;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  // ICO: 00 00 01 00
  if (
    buf[0] === 0x00 &&
    buf[1] === 0x00 &&
    buf[2] === 0x01 &&
    buf[3] === 0x00
  ) {
    return "image/x-icon";
  }
  // SVG: starts with '<' (XML or root <svg). Sniff a chunk of UTF-8.
  const head = buf.slice(0, Math.min(buf.length, 512)).toString("utf8").trim();
  if (
    head.startsWith("<?xml") ||
    head.startsWith("<svg") ||
    head.startsWith("<!DOCTYPE svg") ||
    head.startsWith("<!--")
  ) {
    if (head.includes("<svg")) return "image/svg+xml";
  }
  return null;
}

export interface ValidationError {
  code:
    | "wrong_mime"
    | "too_large"
    | "wrong_width"
    | "wrong_height"
    | "wrong_aspect"
    | "unreadable";
  message: string;
}

export function validateDimensions(
  width: number | undefined,
  height: number | undefined,
  cfg: AssetTypeConfig,
): ValidationError | null {
  if (!width || !height) {
    return {
      code: "unreadable",
      message: "Không đọc được kích thước ảnh.",
    };
  }
  if (cfg.width.exact !== undefined && width !== cfg.width.exact) {
    return {
      code: "wrong_width",
      message: `Chiều rộng phải đúng ${cfg.width.exact}px (đang ${width}px).`,
    };
  }
  if (cfg.width.min !== undefined && width < cfg.width.min) {
    return {
      code: "wrong_width",
      message: `Chiều rộng tối thiểu ${cfg.width.min}px (đang ${width}px).`,
    };
  }
  if (cfg.width.max !== undefined && width > cfg.width.max) {
    return {
      code: "wrong_width",
      message: `Chiều rộng tối đa ${cfg.width.max}px (đang ${width}px).`,
    };
  }
  if (cfg.height.exact !== undefined && height !== cfg.height.exact) {
    return {
      code: "wrong_height",
      message: `Chiều cao phải đúng ${cfg.height.exact}px (đang ${height}px).`,
    };
  }
  if (cfg.height.min !== undefined && height < cfg.height.min) {
    return {
      code: "wrong_height",
      message: `Chiều cao tối thiểu ${cfg.height.min}px (đang ${height}px).`,
    };
  }
  if (cfg.height.max !== undefined && height > cfg.height.max) {
    return {
      code: "wrong_height",
      message: `Chiều cao tối đa ${cfg.height.max}px (đang ${height}px).`,
    };
  }
  if (cfg.aspectRatio) {
    const actual = width / height;
    const { ratio, tolerance } = cfg.aspectRatio;
    if (Math.abs(actual - ratio) / ratio > tolerance) {
      return {
        code: "wrong_aspect",
        message: `Tỉ lệ phải là ${ratio.toFixed(2)} (đang ${actual.toFixed(2)}).`,
      };
    }
  }
  return null;
}

export function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
