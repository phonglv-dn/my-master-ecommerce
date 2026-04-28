import { getTranslations } from "next-intl/server"
import { ShoppingBag, Zap, Shield, Truck } from "lucide-react"
import { SHOP_CONFIG } from "../../../shop.config"
import HeaderV1 from "../../components/modular/HeaderV1/HeaderV1"
import HeaderV2 from "../../components/modular/HeaderV2/HeaderV2"
import { HeaderV3 } from "../../components/modular/HeaderV3"
import { HeroV3 } from "../../components/modular/HeroV3"
import ProductCardV1 from "../../components/modular/ProductCardV1/ProductCardV1"
import ProductCardV2 from "../../components/modular/ProductCardV2/ProductCardV2"
import NewThisWeek from "../../components/modular/NewThisWeek/NewThisWeek"
import Collections from "../../components/modular/Collections/Collections"
import { LookbookApproach } from "../../components/modular/LookbookApproach"
import { Footer } from "../../components/modular/Footer"
import { getProducts, getCategories } from "../../../lib/supabase"

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const t = await getTranslations("home")
  const tc = await getTranslations("common")

  const products = await getProducts({ limit: 12 })
  const categories = await getCategories()

  const activeHeader = SHOP_CONFIG.layout.headerVariant
  const activeHero = SHOP_CONFIG.layout.heroVariant
  const activeCard = SHOP_CONFIG.layout.cardVariant

  return (
    <main className='min-h-screen bg-white dark:bg-gray-950'>
      {/* ── Header variants demo ─────────────────────────────────────────── */}
      {activeHeader === "v1" && <HeaderV1 />}
      {activeHeader === "v2" && <HeaderV2 />}
      {activeHeader === "v3" && <HeaderV3 categories={categories} />}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {activeHero === "v3" ? (
        <HeroV3 />
      ) : (
        <section className='relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-400 px-6 py-24 text-white'>
          <div className='mx-auto max-w-4xl text-center'>
            <h1 className='mb-4 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl'>
              {t("heroTitle")
                .split("\n")
                .map((line, i) => (
                  <span key={i} className='block'>
                    {line}
                  </span>
                ))}
            </h1>
            <p className='mx-auto mb-8 max-w-xl text-lg text-white/80'>
              {t("heroSubtitle")}
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <button className='rounded-brand bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition hover:bg-primary-50 hover:shadow-xl'>
                {tc("products")}
              </button>
              <button className='rounded-brand border-2 border-white/60 px-8 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10'>
                {tc("viewAll")}
              </button>
            </div>
          </div>
          <div className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary-400/30 blur-3xl' />
        </section>
      )}

      {/* ── New This Week ─────────────────────────────────────────────────── */}
      <NewThisWeek products={products} />

      {/* ── Collections ────────────────────────────────────────────────────── */}
      <Collections products={products} />

      {/* ── Lookbook Approach ──────────────────────────────────────────────── */}
      <LookbookApproach />

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </main>
  )
}
