import { getCategories } from "../../../../lib/supabase"
import { SHOP_CONFIG } from "../../../../shop.config"
import HeaderV1 from "../../../components/modular/HeaderV1/HeaderV1"
import HeaderV2 from "../../../components/modular/HeaderV2/HeaderV2"
import { HeaderV3 } from "../../../components/modular/HeaderV3"
import { Footer } from "../../../components/modular/Footer"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()
  const activeHeader = SHOP_CONFIG.layout.headerVariant

  return (
    <>
      {activeHeader === "v1" && <HeaderV1 />}
      {activeHeader === "v2" && <HeaderV2 />}
      {activeHeader === "v3" && <HeaderV3 categories={categories} />}
      
      {children}
      
      <Footer />
    </>
  )
}
