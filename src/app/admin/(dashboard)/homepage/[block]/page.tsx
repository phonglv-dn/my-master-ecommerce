import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlockSchema } from "../blocks";
import { getHomepageBlock } from "../../../../../../lib/supabase";
import EditBlockForm from "./EditBlockForm";

interface EditBlockPageProps {
  params: Promise<{ block: string }>;
}

export async function generateMetadata({
  params,
}: EditBlockPageProps): Promise<Metadata> {
  const { block } = await params;
  const schema = getBlockSchema(block);
  return { title: schema ? `Sửa: ${schema.label}` : "Block không tồn tại" };
}

export default async function EditHomepageBlockPage({
  params,
}: EditBlockPageProps) {
  const { block } = await params;
  const schema = getBlockSchema(block);
  if (!schema) notFound();

  const content = await getHomepageBlock(schema.key);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Sửa block: {schema.label}</h1>
          <p className="admin-page-subtitle">{schema.description}</p>
        </div>
        <Link href="/admin/homepage" className="admin-btn admin-btn--ghost">
          ← Tất cả block
        </Link>
      </div>

      <div style={{ maxWidth: 900 }}>
        <EditBlockForm schema={schema} content={content} />
      </div>
    </>
  );
}
