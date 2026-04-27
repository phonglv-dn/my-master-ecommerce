import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { SHOP_CONFIG } from "../../../shop.config";
import "../globals.css";
import "./admin.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Admin — ${SHOP_CONFIG.brand.name}`,
    template: `%s | Admin — ${SHOP_CONFIG.brand.name}`,
  },
  description: "MasterShop Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased admin-body`}>
        <div className="admin-shell">
          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="admin-sidebar">
            <div className="admin-sidebar__logo">
              <span className="admin-sidebar__logo-icon">⚡</span>
              <span className="admin-sidebar__logo-text">
                {SHOP_CONFIG.brand.name}
              </span>
            </div>

            <nav className="admin-sidebar__nav">
              <span className="admin-sidebar__section-label">Quản lý</span>
              <Link
                href="/admin/products"
                className="admin-sidebar__link"
                id="nav-products"
              >
                <span className="admin-sidebar__link-icon">📦</span>
                Sản phẩm
              </Link>
              <Link
                href="/admin/products/new"
                className="admin-sidebar__link"
                id="nav-new-product"
              >
                <span className="admin-sidebar__link-icon">➕</span>
                Thêm sản phẩm
              </Link>
            </nav>

            <div className="admin-sidebar__footer">
              <Link href="/" className="admin-sidebar__back-link">
                ← Về trang chủ
              </Link>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────── */}
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
