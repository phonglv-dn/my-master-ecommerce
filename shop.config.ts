export const SHOP_CONFIG = {
  brand: {
    name: "SBLVK",
    logoUrl: "/images/logo.svg",
  },

  theme: {
    primaryColor: "#000000",   // black — SBLVK signature
    secondaryColor: "#f8f8f8", // off-white background
    backgroundColor: "#f8f8f8",// page background — soft warm gray
    borderRadius: "0rem",      // sharp edges for minimalist style
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
    /** 'v1' = classic header  |  'v2' = sticky transparent header | 'v3' = minimal high-fashion */
    headerVariant: "v3" as "v1" | "v2" | "v3",
    /** 'v1' = fullscreen hero  |  'v2' = split-image hero | 'v3' = minimal high-fashion */
    heroVariant: "v3" as "v1" | "v2" | "v3",
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
