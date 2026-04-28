import { getTranslations } from "next-intl/server";
import CartClient from "./CartClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return {
    title: t("cart"),
  };
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <CartClient />
    </main>
  );
}
