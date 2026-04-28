import { getTranslations } from "next-intl/server";
import { SHOP_CONFIG } from "../../../../shop.config";
import HeaderV1 from "../../../components/modular/HeaderV1/HeaderV1";
import HeaderV2 from "../../../components/modular/HeaderV2/HeaderV2";
import CartClient from "./CartClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common");
  return {
    title: t("cart"),
  };
}

export default function CartPage() {
  const activeHeader = SHOP_CONFIG.layout.headerVariant;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {activeHeader === "v1" ? <HeaderV1 /> : <HeaderV2 />}
      <CartClient />
    </main>
  );
}
