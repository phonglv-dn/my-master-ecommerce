import type { Metadata } from "next";
import { Inter } from "next/font/google";
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

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased admin-body`}>
        {children}
      </body>
    </html>
  );
}
