import { getTranslations } from "next-intl/server";
import CheckoutClient from "./CheckoutClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return {
    title: t("title"),
  };
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white">
      <CheckoutClient />
    </main>
  );
}
