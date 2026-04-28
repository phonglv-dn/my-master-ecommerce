import { notFound } from "next/navigation";
import { getProductBySlug } from "../../../../../../lib/supabase";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  const title = product.title[locale as keyof typeof product.title] ?? product.title.vi;
  const description = product.description?.[locale as keyof typeof product.description] ?? product.description?.vi ?? "";

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
    <main className="min-h-screen bg-white dark:bg-gray-950">
      <ProductDetailClient product={product} />
    </main>
  );
}
