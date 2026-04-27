import { useTranslations } from "next-intl";
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react";
import { SHOP_CONFIG } from "../../../shop.config";

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-400 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            {t("heroTitle").split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-brand bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition hover:bg-primary-50 hover:shadow-xl">
              {tc("products")}
            </button>
            <button className="rounded-brand border-2 border-white/60 px-8 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10">
              {tc("viewAll")}
            </button>
          </div>
        </div>

        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary-400/30 blur-3xl" />
      </section>

      {/* ── Feature Badges ── */}
      <section className="border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {[
            { icon: Truck,      label: "Giao hàng nhanh" },
            { icon: Shield,     label: "Bảo hành chính hãng" },
            { icon: Zap,        label: "Thanh toán tức thì" },
            { icon: ShoppingBag, label: "Đổi trả dễ dàng" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                <Icon className="h-5 w-5 text-primary-500" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Placeholder — Featured Products ── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("featuredProducts")}
        </h2>
        <p className="text-sm text-gray-400">
          Variant cấu hình:{" "}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
            cardVariant = {SHOP_CONFIG.layout.cardVariant}
          </code>
        </p>
      </section>
    </main>
  );
}
