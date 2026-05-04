import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SHOP_CONFIG, type Locale } from "../../../shop.config";
import { CurrencyProvider } from "../../contexts/CurrencyContext";
import { CartProvider } from "../../contexts/CartContext";
import { getBrandAssets } from "../../../lib/brand/getBrandAssets";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isValidLocale = SHOP_CONFIG.i18n.locales.includes(locale as Locale);
  const t = await getTranslations({
    locale: isValidLocale ? locale : SHOP_CONFIG.i18n.defaultLocale,
    namespace: "brand",
  });

  const assets = await getBrandAssets();
  const brandName = SHOP_CONFIG.brand.name;
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: brandName,
      template: `%s | ${brandName}`,
    },
    description,
    applicationName: brandName,
    keywords: ["streetwear", "unisex", "monochrome", "black", brandName],
    icons: {
      // favicon — DB override if present, else /brand/defaults/favicon.ico
      icon: [
        { url: assets.favicon.url, type: assets.favicon.mime },
        // Static fallback as a second <link> — browser uses whichever loads.
        { url: "/brand/defaults/favicon.ico", type: "image/x-icon" },
      ],
      apple: [
        {
          url: assets.apple_touch_icon.url,
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      type: "website",
      siteName: brandName,
      title: brandName,
      description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      images: [
        {
          url: assets.og_image.url,
          width: 1200,
          height: 630,
          alt: brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description,
      images: [assets.og_image.url],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: "#0a0a0a",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  const isValidLocale = SHOP_CONFIG.i18n.locales.includes(locale as Locale);
  if (!isValidLocale) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>
            <CartProvider>{children}</CartProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return SHOP_CONFIG.i18n.locales.map((locale) => ({ locale }));
}
