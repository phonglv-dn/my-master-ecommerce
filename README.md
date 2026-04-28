# MasterShop - E-commerce Platform

Dự án thương mại điện tử đa ngôn ngữ (Tiếng Việt, Tiếng Anh) và đa tiền tệ (VND, USD) được xây dựng bằng Next.js (App Router), Tailwind CSS và Supabase.

## Hướng dẫn thay đổi tỷ giá tiền tệ

Tỷ giá quy đổi mặc định được cấu hình tại file trung tâm `shop.config.ts` ở thư mục gốc của dự án.
Để thay đổi tỷ giá, bạn làm theo các bước sau:

1. Mở file `shop.config.ts`.
2. Tìm đến object `currencies`.
3. Thay đổi giá trị của `exchangeRate` (ví dụ: `25_000` nghĩa là 1 USD = 25,000 VND).

```typescript
// shop.config.ts
currencies: {
  codes: ["VND", "USD"] as const,
  default: "VND" as const,
  exchangeRate: 25_500, // <-- Cập nhật tỷ giá mới tại đây
},
```

## Hướng dẫn thêm ngôn ngữ mới

Để thêm một ngôn ngữ mới (ví dụ: Tiếng Nhật - `ja`), bạn cần thực hiện các bước sau:

**Bước 1: Cập nhật cấu hình ngôn ngữ**
Mở file `shop.config.ts` và thêm mã ngôn ngữ vào mảng `locales`:

```typescript
i18n: {
  locales: ["vi", "en", "ja"] as const, // <-- Thêm "ja" vào đây
  defaultLocale: "vi" as const,
},
```

**Bước 2: Tạo file bản dịch (Translation file)**
Tạo một file mới tên là `ja.json` trong thư mục `src/messages/`. Bạn có thể copy nội dung từ file `vi.json` hoặc `en.json` sang và tiến hành dịch các từ khóa sang tiếng Nhật.

**Bước 3: Cập nhật Middleware (nếu cần)**
Vì `middleware.ts` hiện tại đang đọc cấu hình trực tiếp từ `shop.config.ts`, nên hệ thống sẽ tự động nhận diện ngôn ngữ mới mà không cần sửa code trong `middleware.ts`.

**Bước 4: Cập nhật component chọn ngôn ngữ (LocaleSwitcher)**
Mở file component quản lý giao diện đổi ngôn ngữ (thường là `src/components/modular/LocaleSwitcher/index.tsx` hoặc tương tự) để thêm tùy chọn hiển thị ngôn ngữ Tiếng Nhật lên giao diện.

## Hướng dẫn Deploy lên Vercel

Cách tối ưu nhất để triển khai ứng dụng Next.js là sử dụng nền tảng Vercel.

1. **Chuẩn bị Database (Supabase):**
   - Đảm bảo dự án Supabase của bạn đã được thiết lập (đã chạy các file migration).
   - Nếu cần dữ liệu mẫu, hãy chạy đoạn script trong file `supabase/seed.sql` trên giao diện SQL Editor của Supabase.
   - Lấy URL và API Key của Supabase (trong `Project Settings > API`).

2. **Đẩy code lên GitHub:**
   - Commit và push toàn bộ mã nguồn lên một repository trên GitHub.

3. **Deploy trên Vercel:**
   - Truy cập [Vercel](https://vercel.com/) và đăng nhập.
   - Chọn **"Add New..." > "Project"**.
   - Import repository từ GitHub của bạn.
   - Tại phần **Environment Variables**, cấu hình các biến môi trường tương tự file `.env.local` của bạn:
     - `NEXT_PUBLIC_SUPABASE_URL`: (URL Supabase của bạn)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (API Key Supabase của bạn)
   - Nhấn **"Deploy"**.

Vercel sẽ tự động build và cung cấp đường link website trong vài phút. Bất cứ khi nào bạn đẩy code lên nhánh `main`, dự án sẽ được tự động cập nhật.
