import type { Metadata } from "next";
import { ASSET_TYPES, ASSET_TYPE_CONFIGS } from "../../../../../lib/brand/asset-types";
import { getBrandAssets } from "../../../../../lib/brand/getBrandAssets";
import BrandAssetCard from "./BrandAssetCard";

export const metadata: Metadata = { title: "Thương hiệu" };

export default async function AdminBrandPage() {
  const assets = await getBrandAssets();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý thương hiệu</h1>
          <p className="admin-page-subtitle">
            Logo, favicon, ảnh share mạng xã hội. Khi chưa upload, site dùng
            asset mặc định trong <code>/public/brand/defaults/</code>.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {ASSET_TYPES.map((type) => (
          <BrandAssetCard
            key={type}
            config={ASSET_TYPE_CONFIGS[type]}
            current={assets[type]}
          />
        ))}
      </div>
    </>
  );
}
