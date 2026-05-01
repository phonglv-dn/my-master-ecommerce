import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../../../../lib/supabase";
import { getLocalizedText } from "../../../../../../lib/getLocalizedText";
import type { Locale } from "../../../../../../shop.config";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const title = getLocalizedText(product.title, locale as Locale);
  const description = getLocalizedText(product.description, locale as Locale);

  return {
    title,
    description,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, { withCategory: true });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <ProductDetailClient product={product} />
    </main>
  );
}
