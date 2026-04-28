"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { updateProduct, type CreateProductState } from "../../actions";
import { SHOP_CONFIG } from "../../../../../../shop.config";
import type { Product } from "../../../../../../types";

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
