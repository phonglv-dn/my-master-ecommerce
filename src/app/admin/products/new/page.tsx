import type { Metadata } from "next";
import Link from "next/link";
import AddProductForm from "./AddProductForm";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default function NewProductPage() {
  return (
    <>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Thêm sản phẩm mới</h1>
          <p className="admin-page-subtitle">
            Nhập thông tin sản phẩm bằng cả hai ngôn ngữ
          </p>
        </div>
        <Link
          href="/admin/products"
          className="admin-btn admin-btn--ghost"
          id="back-to-list"
        >
          ← Danh sách sản phẩm
        </Link>
      </div>

      {/* Form */}
      <AddProductForm />
    </>
  );
}
