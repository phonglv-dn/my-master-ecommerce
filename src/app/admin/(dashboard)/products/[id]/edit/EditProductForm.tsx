"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateProduct, type CreateProductState } from "../../actions";
import { SHOP_CONFIG } from "../../../../../../../shop.config";
import type { Product } from "../../../../../../../types";

const EXCHANGE_RATE = SHOP_CONFIG.currencies.exchangeRate; // 25_000

function formatVnd(value: string | number): string {
  const num = typeof value === "number" ? value : parseInt(value.replace(/\D/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("vi-VN");
}

function priceToUsd(vndRaw: string): string {
  const num = parseInt(vndRaw.replace(/\D/g, ""), 10);
  if (isNaN(num) || num <= 0) return "";
  const usd = num / EXCHANGE_RATE;
  return `$${usd.toFixed(2)}`;
}

const INITIAL_STATE: CreateProductState = {};

type LangTab = "vi" | "en";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "2X", "3X"] as const;

export default function EditProductForm({ product }: { product: Product }) {
  const updateAction = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(
    updateAction,
    INITIAL_STATE
  );

  // Language tab state
  const [activeTab, setActiveTab] = useState<LangTab>("vi");

  // Price live preview
  const initialPriceRaw = product.price_vnd.toString();
  const [rawPrice, setRawPrice] = useState(initialPriceRaw);
  const [displayPrice, setDisplayPrice] = useState(formatVnd(product.price_vnd));

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setRawPrice(digits);
    setDisplayPrice(digits ? formatVnd(digits) : "");
  };

  const [titleVi, setTitleVi] = useState(product.title.vi ?? "");
  const [slug, setSlug] = useState(product.slug ?? "");

  // Variant / filter attribute state
  const [swatchHex, setSwatchHex] = useState(product.swatch_hex ?? "");
  const [sizes, setSizes] = useState<string[]>(product.sizes ?? []);

  const toggleSize = (s: string) =>
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleTitleViChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleVi(val);
    if (!val) {
      setSlug("");
      return;
    }
    const auto = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(auto);
  };

  const usdPreview = priceToUsd(rawPrice);

  return (
    <form action={formAction} className="admin-form" id="edit-product-form">
      {/* Feedback */}
      {state.error && (
        <div className="admin-alert admin-alert--error" role="alert">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* ── Tên & Mô tả song ngữ ─────────────────────────────────────────── */}
      <div className="admin-card">
        <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
          Nội dung đa ngôn ngữ
        </p>

        {/* Language tab switcher */}
        <div className="admin-lang-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "vi"}
            id="tab-vi"
            className={`admin-lang-tab ${activeTab === "vi" ? "admin-lang-tab--active" : ""}`}
            onClick={() => setActiveTab("vi")}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "en"}
            id="tab-en"
            className={`admin-lang-tab ${activeTab === "en" ? "admin-lang-tab--active" : ""}`}
            onClick={() => setActiveTab("en")}
          >
            🇺🇸 English
          </button>
        </div>

        {/* Vietnamese panel */}
        <div
          role="tabpanel"
          aria-labelledby="tab-vi"
          style={{ display: activeTab === "vi" ? "flex" : "none", flexDirection: "column", gap: "1rem" }}
        >
          <div className="admin-field">
            <label htmlFor="title_vi">
              Tên sản phẩm (VI) <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              id="title_vi"
              name="title_vi"
              type="text"
              placeholder="Ví dụ: Áo thun basic màu trắng"
              value={titleVi}
              onChange={handleTitleViChange}
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="desc_vi">Mô tả (VI)</label>
            <textarea
              id="desc_vi"
              name="desc_vi"
              placeholder="Mô tả ngắn về sản phẩm bằng Tiếng Việt..."
              defaultValue={product.description?.vi ?? ""}
            />
          </div>
        </div>

        {/* English panel */}
        <div
          role="tabpanel"
          aria-labelledby="tab-en"
          style={{ display: activeTab === "en" ? "flex" : "none", flexDirection: "column", gap: "1rem" }}
        >
          <div className="admin-field">
            <label htmlFor="title_en">
              Product Title (EN) <span style={{ color: "#f87171" }}>*</span>
            </label>
            <input
              id="title_en"
              name="title_en"
              type="text"
              placeholder="e.g. Basic white cotton T-shirt"
              defaultValue={product.title.en ?? ""}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="desc_en">Description (EN)</label>
            <textarea
              id="desc_en"
              name="desc_en"
              placeholder="Short product description in English..."
              defaultValue={product.description?.en ?? ""}
            />
          </div>
        </div>
      </div>

      {/* ── Giá & Kho ───────────────────────────────────────────────────────── */}
      <div className="admin-card">
        <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
          Giá & Tồn kho
        </p>

        <div className="admin-form__row">
          {/* Price VND */}
          <div className="admin-field">
            <label htmlFor="price_vnd">
              Giá (VNĐ) <span style={{ color: "#f87171" }}>*</span>
            </label>
            {/* Hidden real value sent to server */}
            <input type="hidden" name="price_vnd" value={rawPrice} />
            <input
              id="price_vnd"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayPrice}
              onChange={handlePriceChange}
              autoComplete="off"
            />
            {usdPreview && (
              <div className="admin-price-preview">
                <span>≈ {usdPreview}</span>
                <span className="admin-price-preview__sep" />
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  1 USD = {EXCHANGE_RATE.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            )}
            <p className="admin-field__hint">
              Hệ thống tự quy đổi sang USD theo tỷ giá trong config.
            </p>
          </div>

          {/* Stock */}
          <div className="admin-field">
            <label htmlFor="stock">Số lượng tồn kho</label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              defaultValue={product.stock ?? 0}
            />
          </div>
        </div>
      </div>

      {/* ── Thuộc tính sản phẩm ─────────────────────────────────────────────── */}
      <div className="admin-card">
        <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
          Thuộc tính sản phẩm
        </p>

        <div className="admin-form__row">
          <div className="admin-field">
            <label htmlFor="color_code">Tên màu (hiển thị)</label>
            <input
              id="color_code"
              name="color_code"
              type="text"
              placeholder="Ví dụ: Carbon Black, Off White..."
              defaultValue={product.color_code ?? ""}
            />
            <p className="admin-field__hint">Hiển thị trên trang chi tiết.</p>
          </div>

          <div className="admin-field">
            <label htmlFor="color_family">Họ màu (filter)</label>
            <select
              id="color_family"
              name="color_family"
              defaultValue={product.color_family ?? ""}
            >
              <option value="">— Không chọn —</option>
              <option value="black">Đen (black)</option>
              <option value="white">Trắng (white)</option>
            </select>
            <p className="admin-field__hint">
              Bucket dùng cho filter trên collection.
            </p>
          </div>
        </div>

        <div className="admin-form__row">
          <div className="admin-field">
            <label>Mã hex swatch</label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="color"
                value={swatchHex || "#000000"}
                onChange={(e) => setSwatchHex(e.target.value)}
                style={{
                  width: "3rem",
                  height: "2.5rem",
                  padding: 0,
                  border: "1px solid #cbd5e0",
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={swatchHex}
                onChange={(e) => setSwatchHex(e.target.value)}
                placeholder="#000000 (để trống = không có)"
                style={{ flex: 1 }}
              />
              {swatchHex && (
                <button
                  type="button"
                  onClick={() => setSwatchHex("")}
                  className="admin-btn admin-btn--ghost"
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                >
                  Xoá
                </button>
              )}
            </div>
            <input type="hidden" name="swatch_hex" value={swatchHex} />
            <p className="admin-field__hint">
              Dự phòng cho UI swatch sau này. Có thể bỏ trống.
            </p>
          </div>

          <div className="admin-field">
            <label htmlFor="fit">Form (cut)</label>
            <select id="fit" name="fit" defaultValue={product.fit ?? ""}>
              <option value="">— Không chọn —</option>
              <option value="slim">Slim</option>
              <option value="regular">Regular</option>
              <option value="oversized">Oversized</option>
            </select>
          </div>
        </div>

        <div className="admin-field">
          <label htmlFor="material">Chất liệu</label>
          <input
            id="material"
            name="material"
            type="text"
            placeholder="Ví dụ: cotton, wool, linen, blend"
            defaultValue={product.material ?? ""}
          />
        </div>

        <div className="admin-field">
          <label>Sizes có sẵn</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.4rem",
            }}
          >
            {SIZE_OPTIONS.map((s) => {
              const on = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  aria-pressed={on}
                  style={{
                    minWidth: "2.5rem",
                    padding: "0.5rem 0.85rem",
                    border: `1px solid ${on ? "#000" : "#cbd5e0"}`,
                    background: on ? "#000" : "#fff",
                    color: on ? "#fff" : "#374151",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {sizes.map((s) => (
            <input key={s} type="hidden" name="sizes" value={s} />
          ))}
          <p className="admin-field__hint">
            Click để chọn các size sản phẩm có sẵn.
          </p>
        </div>
      </div>

      {/* ── Slug ──────────────────────────────────────────────────────────── */}
      <div className="admin-card">
        <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
          URL
        </p>
        <div className="admin-field">
          <label htmlFor="slug">Slug (tự động từ tên VI)</label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="ao-thun-basic-mau-trang"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <p className="admin-field__hint">
            Để trống để hệ thống tự tạo từ tên Tiếng Việt.
          </p>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          id="btn-submit-product"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="admin-spinner" />
              Đang lưu...
            </>
          ) : (
            "💾 Cập nhật"
          )}
        </button>
        <Link
          href="/admin/products"
          className="admin-btn admin-btn--ghost"
          id="btn-cancel"
        >
          Huỷ
        </Link>
      </div>
    </form>
  );
}
