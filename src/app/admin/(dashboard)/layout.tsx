import Link from "next/link";
import { SHOP_CONFIG } from "../../../../shop.config";
import { requireAdmin } from "../../../../lib/auth";
import { logoutAction } from "../login/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
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
            href="/admin/homepage"
            className="admin-sidebar__link"
            id="nav-homepage"
          >
            <span className="admin-sidebar__link-icon">🏠</span>
            Trang chủ
          </Link>
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
          <div className="admin-sidebar__user" title={user.email ?? ""}>
            <span className="admin-sidebar__user-icon">👤</span>
            <span className="admin-sidebar__user-email">{user.email}</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="admin-sidebar__back-link"
              id="btn-logout"
            >
              ↩ Đăng xuất
            </button>
          </form>
          <Link href="/" className="admin-sidebar__back-link">
            ← Về trang chủ
          </Link>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
