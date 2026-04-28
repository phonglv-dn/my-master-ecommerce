import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // Đường dẫn tới i18n request config (tạo ở bước sau)
  "./src/i18n/request.ts"
);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
