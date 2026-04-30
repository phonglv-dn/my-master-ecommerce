import type { Metadata } from "next";
import Link from "next/link";
import { BLOCK_SCHEMAS } from "./blocks";
import { getHomepageBlock } from "../../../../../lib/supabase";

export const metadata: Metadata = { title: "Trang chủ" };

export default async function AdminHomepagePage() {
  const blocks = await Promise.all(
    BLOCK_SCHEMAS.map(async (schema) => ({
      schema,
      content: await getHomepageBlock(schema.key),
    }))
  );

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý trang chủ</h1>
          <p className="admin-page-subtitle">
            Sửa tiêu đề, mô tả và ảnh hiển thị trên homepage
          </p>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table" id="homepage-blocks-table">
          <thead>
            <tr>
              <th>Block</th>
              <th>Mô tả</th>
              <th>Cập nhật</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(({ schema, content }) => (
              <tr key={schema.key}>
                <td>
                  <span className="admin-table__name">{schema.label}</span>
                </td>
                <td style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  {schema.description}
                </td>
                <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  {content?.updated_at
                    ? new Date(content.updated_at).toLocaleString("vi-VN")
                    : "—"}
                </td>
                <td>
                  <Link
                    href={`/admin/homepage/${schema.key}`}
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "0.375rem 0.75rem", fontSize: "0.875rem" }}
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
