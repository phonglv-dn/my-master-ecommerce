import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "../../../../../../../lib/supabase";
import EditProductForm from "./EditProductForm";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  
  // We use getProducts which returns an array. If we pass limit:1 or just filter it.
  // Wait, getProducts does not currently support filtering by ID, let's fetch all or fetch specifically.
  // We can just fetch the specific product from Supabase directly to avoid over-fetching.
  // Actually, let's use the existing getProducts and find by ID for simplicity if it's small,
  // but it's better to fetch by ID. Let's see if there's a getProductById.
  
  // Actually, getProducts from lib/supabase.ts was used before.
  const products = await getProducts({ limit: 1000 });
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sửa sản phẩm</h1>
          <p className="admin-page-subtitle">
            Cập nhật thông tin cho: {product.title.vi || product.title.en}
          </p>
        </div>
        <Link href="/admin/products" className="admin-btn admin-btn--ghost">
          Quay lại
        </Link>
      </div>

      <div className="admin-page-content" style={{ maxWidth: 800 }}>
        <EditProductForm product={product} />
      </div>
    </>
  );
}
