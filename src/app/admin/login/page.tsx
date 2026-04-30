import type { Metadata } from "next";
import { SHOP_CONFIG } from "../../../../shop.config";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const initialError =
    error === "forbidden"
      ? "Tài khoản này không có quyền truy cập admin."
      : undefined;

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
            }}
          >
            ⚡ {SHOP_CONFIG.brand.name} Admin
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Đăng nhập để quản lý cửa hàng
          </p>
        </div>
        <LoginForm initialError={initialError} />
      </div>
    </div>
  );
}
