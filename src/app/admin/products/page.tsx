import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "../../../../lib/supabase";
import { formatPrice } from "../../../../lib/formatPrice";
import { SHOP_CONFIG } from "../../../../shop.config";
import { deleteProduct } from "./actions";
import type { Product } from "../../../../types";

export const metadata: Metadata = { title: "Danh sách sản phẩm" };

// ── Delete button ─────────────────────────────────────────────────────────────
async function DeleteBtn({ id }: { id: string }) {
  const action = deleteProduct.bind(null, id);
  return (
    <form action={action}>
      <button
        type="submit"
        className="admin-btn admin-btn--danger"
        id={`delete-${id}`}
        onClick={undefined}
      >
        Xoá
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminProductsPage() {
  const products: Product[] = await getProducts({ limit: 100 });
  const defaultLocale = SHOP_CONFIG.i18n.defaultLocale; // "vi"

  return (
    <>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sản phẩm</h1>
          <p className="admin-page-subtitle">
            {products.length} sản phẩm trong kho
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="admin-btn admin-btn--primary"
          id="btn-add-product"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="admin-table-wrap">
          <div className="admin-empty">
            <span className="admin-empty__icon">📦</span>
            <p className="admin-empty__text">Chưa có sản phẩm nào.</p>
            <Link
              href="/admin/products/new"
              className="admin-btn admin-btn--primary"
            >
              Thêm sản phẩm đầu tiên
            </Link>
          </div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table" id="products-table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Slug</th>
                <th>Giá (VNĐ)</th>
                <th>Giá (USD)</th>
                <th>Kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const title =
                  p.title[defaultLocale as keyof typeof p.title] ??
                  p.title.vi ??
                  "(Chưa đặt tên)";
                const priceVnd = formatPrice(p.price_vnd, "VND");
                const priceUsd = formatPrice(p.price_vnd, "USD");

                return (
                  <tr key={p.id}>
                    <td>
                      <span className="admin-table__name">{title}</span>
                    </td>
                    <td>
                      <span className="admin-table__slug">{p.slug}</span>
                    </td>
                    <td>
                      <span className="admin-table__price">{priceVnd}</span>
                    </td>
                    <td>
                      <span className="admin-table__price">{priceUsd}</span>
                    </td>
                    <td>
                      <span
                        className={`admin-table__stock-badge ${
                          p.stock > 0
                            ? "admin-table__stock-badge--in"
                            : "admin-table__stock-badge--out"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} còn` : "Hết hàng"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <DeleteBtn id={p.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
