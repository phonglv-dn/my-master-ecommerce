import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SHOP_CONFIG, type Locale } from "../../../shop.config";
import { CurrencyProvider } from "../../contexts/CurrencyContext";
import { CartProvider } from "../../contexts/CartContext";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SHOP_CONFIG.brand.name,
    template: `%s | ${SHOP_CONFIG.brand.name}`,
  },
  description: `${SHOP_CONFIG.brand.name} — Mua sắm thông minh, giao hàng nhanh chóng.`,
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
