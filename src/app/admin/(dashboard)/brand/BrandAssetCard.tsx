"use client";

import { useActionState, useRef, useState } from "react";
import {
  uploadBrandAsset,
  deleteBrandAsset,
  type BrandActionState,
} from "./actions";
import {
  type AssetTypeConfig,
  humanFileSize,
} from "../../../../../lib/brand/asset-types";
import type { ResolvedAsset } from "../../../../../lib/brand/getBrandAssets";

const INITIAL: BrandActionState = {};

interface Props {
  config: AssetTypeConfig;
  current: ResolvedAsset;
}

export default function BrandAssetCard({ config, current }: Props) {
  const [uploadState, uploadAction, isUploading] = useActionState(
    uploadBrandAsset,
    INITIAL,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteBrandAsset,
    INITIAL,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const status = (() => {
    if (!current.isOverride)
      return { label: "Mặc định", color: "#6b7280", icon: "📦" };
    if (current.isDerived)
      return {
        label: `Tự sinh từ ${current.derivedFrom ?? "—"}`,
        color: "#6366f1",
        icon: "🤖",
      };
    return { label: "Đã ghi đè", color: "#10b981", icon: "✋" };
  })();

  const constraints: string[] = [];
  if (config.width.exact)
    constraints.push(`${config.width.exact}×${config.height.exact} px`);
  else if (config.width.min)
    constraints.push(`≥${config.width.min}×${config.height.min} px`);
  if (config.aspectRatio)
    constraints.push(`tỉ lệ ${config.aspectRatio.ratio.toFixed(2)}:1`);
  constraints.push(`tối đa ${humanFileSize(config.maxBytes)}`);
  constraints.push(`định dạng: ${config.mimeTypes.map(shortMime).join(", ")}`);

  const previewBg = current.mime === "image/svg+xml" ? "#1a1a1a" : "#0d0d14";

  return (
    <div className="admin-card" style={{ padding: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#e2e8f0",
              margin: 0,
            }}
          >
            {config.label.vi}
          </h3>
          <code style={{ fontSize: "0.7rem", color: "#64748b" }}>
            {config.type}
          </code>
        </div>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: status.color,
            background: `${status.color}1a`,
            padding: "0.2rem 0.5rem",
            borderRadius: "0.375rem",
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span>{status.icon}</span>
          {status.label}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.78rem",
          color: "#94a3b8",
          lineHeight: 1.5,
          margin: "0 0 0.75rem",
        }}
      >
        {config.description.vi}
      </p>

      <div
        style={{
          background: previewBg,
          borderRadius: "0.5rem",
          padding: "1rem",
          minHeight: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(99,102,241,0.15)",
          marginBottom: "0.75rem",
        }}
      >
        {current.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.url}
            alt={config.label.vi}
            style={{
              maxWidth: "100%",
              maxHeight: 120,
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "#475569", fontSize: "0.8rem" }}>
            (Trống)
          </span>
        )}
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 0.75rem",
          fontSize: "0.7rem",
          color: "#64748b",
          display: "flex",
          flexDirection: "column",
          gap: "0.15rem",
        }}
      >
        {constraints.map((c, i) => (
          <li key={i}>• {c}</li>
        ))}
      </ul>

      {uploadState.error && (
        <div
          className="admin-alert admin-alert--error"
          role="alert"
          style={{ marginBottom: "0.5rem", fontSize: "0.78rem" }}
        >
          <span>⚠️</span>
          <span>{uploadState.error}</span>
        </div>
      )}
      {uploadState.ok && (
        <div
          className="admin-alert"
          role="status"
          style={{
            marginBottom: "0.5rem",
            fontSize: "0.78rem",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399",
          }}
        >
          <span>✅</span>
          <span>{uploadState.message}</span>
        </div>
      )}
      {deleteState.error && (
        <div
          className="admin-alert admin-alert--error"
          role="alert"
          style={{ marginBottom: "0.5rem", fontSize: "0.78rem" }}
        >
          <span>⚠️</span>
          <span>{deleteState.error}</span>
        </div>
      )}

      <form action={uploadAction} style={{ display: "flex", gap: "0.5rem" }}>
        <input type="hidden" name="asset_type" value={config.type} />
        <input
          ref={fileRef}
          type="file"
          name="file"
          accept={config.mimeTypes.join(",")}
          required
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          style={{ display: "none" }}
        />
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          onClick={() => fileRef.current?.click()}
          disabled={isUploading || isDeleting}
          style={{ flex: 1, fontSize: "0.78rem" }}
        >
          {fileName ? `📎 ${truncate(fileName, 22)}` : "📁 Chọn file"}
        </button>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={isUploading || isDeleting || !fileName}
          style={{ fontSize: "0.78rem" }}
        >
          {isUploading ? (
            <>
              <span className="admin-spinner" /> Đang lưu
            </>
          ) : (
            "Upload"
          )}
        </button>
      </form>

      {current.isOverride && (
        <form
          action={deleteAction}
          style={{ marginTop: "0.5rem" }}
          onSubmit={(e) => {
            if (
              !confirm(
                `Xoá override cho "${config.label.vi}"? Site sẽ quay về asset mặc định.`,
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="asset_type" value={config.type} />
          <button
            type="submit"
            className="admin-btn admin-btn--ghost"
            disabled={isDeleting || isUploading}
            style={{
              width: "100%",
              fontSize: "0.72rem",
              color: "#f87171",
            }}
          >
            {isDeleting ? "Đang xoá..." : "🗑️ Xoá override"}
          </button>
        </form>
      )}
    </div>
  );
}

function shortMime(m: string): string {
  return m.replace("image/", "").replace("svg+xml", "svg").replace("vnd.microsoft.icon", "ico").replace("x-icon", "ico");
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}
