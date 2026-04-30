"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { updateHomepageBlock, type UpdateBlockState } from "../actions";
import { createSupabaseBrowserClient } from "../../../../../../lib/supabase/browser";
import type { BlockSchema } from "../blocks";
import type {
  HomepageContent,
  LocalizedString,
  LookbookImage,
} from "../../../../../../types";

const INITIAL: UpdateBlockState = {};
const LOOKBOOK_BUCKET = "lookbook";
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024;

type LangTab = "vi" | "en";

function emptyImage(): LookbookImage {
  return { url: "", alt_vi: "", alt_en: "" };
}

interface EditBlockFormProps {
  schema: BlockSchema;
  content: HomepageContent | null;
}

export default function EditBlockForm({ schema, content }: EditBlockFormProps) {
  const action = updateHomepageBlock.bind(null, schema.key);
  const [state, formAction, isPending] = useActionState(action, INITIAL);
  const [tab, setTab] = useState<LangTab>("vi");

  const initialImages: LookbookImage[] = (() => {
    const fromDb = content?.image_data?.images ?? [];
    return Array.from({ length: schema.imageCount ?? 0 }, (_, i) =>
      fromDb[i] ?? emptyImage()
    );
  })();
  const [images, setImages] = useState<LookbookImage[]>(initialImages);

  const initialText = (key: string, locale: LangTab): string => {
    const ld = content?.text_data?.[key] as LocalizedString | undefined;
    return ld?.[locale] ?? "";
  };

  return (
    <form action={formAction} className="admin-form">
      {state.error && (
        <div className="admin-alert admin-alert--error" role="alert">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}
      {state.success && (
        <div
          className="admin-alert"
          role="status"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399",
          }}
        >
          <span>✅</span>
          <span>Đã lưu thành công.</span>
        </div>
      )}

      <div className="admin-card">
        <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
          Nội dung văn bản
        </p>

        <div className="admin-lang-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "vi"}
            className={`admin-lang-tab ${tab === "vi" ? "admin-lang-tab--active" : ""}`}
            onClick={() => setTab("vi")}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "en"}
            className={`admin-lang-tab ${tab === "en" ? "admin-lang-tab--active" : ""}`}
            onClick={() => setTab("en")}
          >
            🇺🇸 English
          </button>
        </div>

        {(["vi", "en"] as const).map((lang) => (
          <div
            key={lang}
            role="tabpanel"
            style={{
              display: tab === lang ? "flex" : "none",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {schema.fields.map((field) => (
              <div key={field.key} className="admin-field">
                <label htmlFor={`${field.key}_${lang}`}>
                  {field.label} ({lang.toUpperCase()})
                </label>
                {field.multiline ? (
                  <textarea
                    id={`${field.key}_${lang}`}
                    name={`${field.key}_${lang}`}
                    rows={4}
                    defaultValue={initialText(field.key, lang)}
                  />
                ) : (
                  <input
                    id={`${field.key}_${lang}`}
                    name={`${field.key}_${lang}`}
                    type="text"
                    defaultValue={initialText(field.key, lang)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {schema.hasImages && (
        <div className="admin-card">
          <p className="admin-section__title" style={{ marginBottom: "1rem" }}>
            Ảnh ({schema.imageCount} slot)
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {images.map((img, i) => (
              <ImageSlot
                key={i}
                index={i}
                image={img}
                onChange={(updated) => {
                  setImages((prev) => {
                    const next = [...prev];
                    next[i] = updated;
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="admin-spinner" /> Đang lưu...
            </>
          ) : (
            "💾 Lưu thay đổi"
          )}
        </button>
        <Link href="/admin/homepage" className="admin-btn admin-btn--ghost">
          Huỷ
        </Link>
      </div>
    </form>
  );
}

interface ImageSlotProps {
  index: number;
  image: LookbookImage;
  onChange: (next: LookbookImage) => void;
}

function ImageSlot({ index, image, onChange }: ImageSlotProps) {
  const [isUploading, startUpload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (!ALLOWED_MIME.includes(file.type)) {
      setError("Phải là JPG / PNG / WEBP / AVIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ảnh tối đa 5 MB.");
      return;
    }

    startUpload(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `slot-${index}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(LOOKBOOK_BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) {
          setError(uploadError.message);
          return;
        }
        const { data: pub } = supabase.storage
          .from(LOOKBOOK_BUCKET)
          .getPublicUrl(path);
        onChange({ ...image, url: pub.publicUrl });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload thất bại");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.75rem",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "0.5rem",
        background: "rgba(99,102,241,0.04)",
      }}
    >
      <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>
        Slot #{index + 1}
      </div>

      <input type="hidden" name={`image_${index}_url`} value={image.url} />

      <div
        style={{
          position: "relative",
          aspectRatio: "3 / 4",
          background: "#0d0d14",
          borderRadius: "0.375rem",
          overflow: "hidden",
        }}
      >
        {image.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#475569",
              fontSize: "0.75rem",
            }}
          >
            Chưa có ảnh
          </div>
        )}
        {isUploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13,13,20,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e2e8f0",
              fontSize: "0.75rem",
            }}
          >
            <span className="admin-spinner" /> &nbsp;Đang upload...
          </div>
        )}
      </div>

      <label
        className="admin-btn admin-btn--ghost"
        style={{ fontSize: "0.75rem", padding: "0.375rem 0.5rem", textAlign: "center", cursor: "pointer" }}
      >
        {image.url ? "Thay ảnh" : "Chọn ảnh"}
        <input
          type="file"
          accept={ALLOWED_MIME.join(",")}
          onChange={handleFile}
          style={{ display: "none" }}
          disabled={isUploading}
        />
      </label>

      {error && (
        <div style={{ fontSize: "0.7rem", color: "#f87171" }}>{error}</div>
      )}

      <div className="admin-field" style={{ marginBottom: 0 }}>
        <label
          htmlFor={`image_${index}_alt_vi`}
          style={{ fontSize: "0.7rem" }}
        >
          Alt VI
        </label>
        <input
          id={`image_${index}_alt_vi`}
          name={`image_${index}_alt_vi`}
          type="text"
          value={image.alt_vi}
          onChange={(e) =>
            onChange({ ...image, alt_vi: e.target.value })
          }
          style={{ fontSize: "0.8rem" }}
        />
      </div>
      <div className="admin-field" style={{ marginBottom: 0 }}>
        <label
          htmlFor={`image_${index}_alt_en`}
          style={{ fontSize: "0.7rem" }}
        >
          Alt EN
        </label>
        <input
          id={`image_${index}_alt_en`}
          name={`image_${index}_alt_en`}
          type="text"
          value={image.alt_en}
          onChange={(e) =>
            onChange({ ...image, alt_en: e.target.value })
          }
          style={{ fontSize: "0.8rem" }}
        />
      </div>
    </div>
  );
}
