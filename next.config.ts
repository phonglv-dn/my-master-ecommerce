import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // Đường dẫn tới i18n request config (tạo ở bước sau)
  "./src/i18n/request.ts"
);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Thêm các config khác tại đây nếu cần */
};

export default withNextIntl(nextConfig);
