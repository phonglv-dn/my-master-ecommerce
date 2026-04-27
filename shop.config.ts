export const SHOP_CONFIG = {
  brand: {
    name: "MasterShop",
    logoUrl: "/images/logo.svg",
  },

  theme: {
    primaryColor: "#6366f1",   // indigo-500
    secondaryColor: "#f59e0b", // amber-400
    borderRadius: "0.75rem",   // 12px
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  },

  i18n: {
    locales: ["vi", "en"] as const,
    defaultLocale: "vi" as const,
  },

  currencies: {
    codes: ["VND", "USD"] as const,
    default: "VND" as const,
    /** 1 USD = 25 000 VND */
    exchangeRate: 25_000,
  },

  layout: {
    /** 'v1' = classic header  |  'v2' = sticky transparent header */
    headerVariant: "v1" as "v1" | "v2",
    /** 'v1' = fullscreen hero  |  'v2' = split-image hero */
    heroVariant: "v1" as "v1" | "v2",
    /** 'v1' = vertical card   |  'v2' = horizontal card */
    cardVariant: "v1" as "v1" | "v2",
  },
} as const;

export type ShopConfig = typeof SHOP_CONFIG;
export type Locale = (typeof SHOP_CONFIG.i18n.locales)[number];
export type Currency = (typeof SHOP_CONFIG.currencies.codes)[number];
export type HeaderVariant = typeof SHOP_CONFIG.layout.headerVariant;
export type HeroVariant = typeof SHOP_CONFIG.layout.heroVariant;
export type CardVariant = typeof SHOP_CONFIG.layout.cardVariant;
