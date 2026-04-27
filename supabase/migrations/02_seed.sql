-- ============================================================
-- 02_seed.sql — Sample data for MasterShop
-- Run this AFTER 01_init.sql
-- ============================================================

-- ── Categories ──────────────────────────────────────────────
insert into public.categories (id, slug, name) values
  (
    'a1000000-0000-0000-0000-000000000001',
    'dien-tu',
    '{"vi": "Điện tử", "en": "Electronics"}'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'thoi-trang',
    '{"vi": "Thời trang", "en": "Fashion"}'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'nha-cua',
    '{"vi": "Nhà cửa & Đời sống", "en": "Home & Living"}'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'sach',
    '{"vi": "Sách & Văn phòng phẩm", "en": "Books & Stationery"}'::jsonb
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'lam-dep',
    '{"vi": "Làm đẹp & Chăm sóc cá nhân", "en": "Beauty & Personal Care"}'::jsonb
  )
on conflict (slug) do nothing;

-- ── Products ────────────────────────────────────────────────

insert into public.products
  (slug, title, description, price_vnd, images, stock, category_id)
values

-- ── Điện tử ─────────────────────────────────────────────────
(
  'tai-nghe-bluetooth-pro-x1',
  '{"vi": "Tai nghe Bluetooth Pro X1", "en": "Bluetooth Headphones Pro X1"}'::jsonb,
  '{"vi": "Tai nghe không dây cao cấp với công nghệ chống ồn chủ động ANC, thời lượng pin 40 giờ và âm thanh Hi-Res. Đệm tai memory foam siêu mềm, phù hợp cho mọi lúc mọi nơi.", "en": "Premium wireless headphones with active noise cancellation ANC, 40-hour battery life and Hi-Res audio. Ultra-soft memory foam ear cushions, perfect for everyday use."}'::jsonb,
  1290000,
  ARRAY[
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600'
  ],
  85,
  'a1000000-0000-0000-0000-000000000001'
),

(
  'smartwatch-fit-pro-s3',
  '{"vi": "Đồng hồ thông minh Fit Pro S3", "en": "Smartwatch Fit Pro S3"}'::jsonb,
  '{"vi": "Đồng hồ thông minh theo dõi sức khỏe toàn diện: nhịp tim, SpO2, giấc ngủ. Màn hình AMOLED 1.4 inch, chống nước IP68, pin 7 ngày. Kết nối GPS tích hợp.", "en": "Comprehensive health-tracking smartwatch: heart rate, SpO2, sleep monitoring. 1.4-inch AMOLED display, IP68 water resistance, 7-day battery. Built-in GPS."}'::jsonb,
  2490000,
  ARRAY[
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'
  ],
  42,
  'a1000000-0000-0000-0000-000000000001'
),

(
  'loa-bluetooth-mini-bass-360',
  '{"vi": "Loa Bluetooth Mini Bass 360°", "en": "Mini Bluetooth Speaker Bass 360°"}'::jsonb,
  '{"vi": "Loa di động nhỏ gọn, âm bass mạnh mẽ với công nghệ 360° surround. Chống nước IPX7, pin 12 giờ, kết nối đồng thời 2 thiết bị. Lý tưởng cho dã ngoại và du lịch.", "en": "Compact portable speaker with powerful bass and 360° surround technology. IPX7 waterproof, 12-hour battery, dual-device pairing. Ideal for outdoor and travel."}'::jsonb,
  890000,
  ARRAY[
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600'
  ],
  120,
  'a1000000-0000-0000-0000-000000000001'
),

(
  'sac-du-phong-20000mah-pd65w',
  '{"vi": "Sạc dự phòng 20.000mAh PD 65W", "en": "Power Bank 20,000mAh PD 65W"}'::jsonb,
  '{"vi": "Pin dự phòng dung lượng lớn 20.000mAh hỗ trợ sạc nhanh PD 65W. Có thể sạc laptop, điện thoại và tablet cùng lúc. Màn hình LED hiển thị phần trăm pin, thiết kế mỏng nhẹ.", "en": "High-capacity 20,000mAh power bank with 65W PD fast charging. Simultaneously charge laptop, phone and tablet. LED display showing battery percentage, slim lightweight design."}'::jsonb,
  750000,
  ARRAY[
    'https://images.unsplash.com/photo-1609592806596-b8d7a49f52df?w=600'
  ],
  200,
  'a1000000-0000-0000-0000-000000000001'
),

-- ── Thời trang ───────────────────────────────────────────────
(
  'ao-thun-premium-cotton-unisex',
  '{"vi": "Áo thun Premium Cotton Unisex", "en": "Premium Cotton Unisex T-Shirt"}'::jsonb,
  '{"vi": "Áo thun 100% cotton combed cao cấp, form regular fit thoải mái. Chất liệu mềm mại, thấm hút mồ hôi tốt, không ra màu sau nhiều lần giặt. Có 8 màu sắc đa dạng.", "en": "100% premium combed cotton T-shirt, comfortable regular fit. Soft material, excellent moisture absorption, color-fast through many washes. Available in 8 colors."}'::jsonb,
  299000,
  ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600'
  ],
  350,
  'a1000000-0000-0000-0000-000000000002'
),

(
  'giay-sneaker-urban-walk-v2',
  '{"vi": "Giày Sneaker Urban Walk V2", "en": "Urban Walk V2 Sneakers"}'::jsonb,
  '{"vi": "Giày thể thao đường phố phong cách với đế EVA siêu nhẹ và êm ái. Upper lưới thoáng khí, lót giày kháng khuẩn, đế ngoài chống trơn trượt. Phù hợp cả đi học và dạo phố.", "en": "Stylish street sneakers with ultra-light and cushioned EVA sole. Breathable mesh upper, antibacterial insole, non-slip outsole. Suitable for school and casual wear."}'::jsonb,
  690000,
  ARRAY[
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600'
  ],
  95,
  'a1000000-0000-0000-0000-000000000002'
),

(
  'tui-xach-canvas-everyday',
  '{"vi": "Túi xách Canvas Everyday", "en": "Canvas Everyday Tote Bag"}'::jsonb,
  '{"vi": "Túi canvas dày dặn, bền bỉ với nhiều ngăn tiện dụng. Dây đeo vai có thể điều chỉnh, quai xách chắc chắn. Thiết kế tối giản, phù hợp đi làm, đi học và du lịch.", "en": "Durable thick canvas tote with multiple practical compartments. Adjustable shoulder strap and sturdy carry handles. Minimalist design, perfect for work, school and travel."}'::jsonb,
  450000,
  ARRAY[
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
  ],
  180,
  'a1000000-0000-0000-0000-000000000002'
),

-- ── Nhà cửa & Đời sống ──────────────────────────────────────
(
  'den-ngu-led-am-dieu-chinh',
  '{"vi": "Đèn ngủ LED 3 màu điều chỉnh", "en": "3-Color Adjustable LED Night Light"}'::jsonb,
  '{"vi": "Đèn ngủ LED với 3 chế độ màu: trắng ấm, trắng trung và ánh sáng ban ngày. Độ sáng điều chỉnh 5 cấp, cảm ứng chạm, USB-C sạc tích hợp. Thiết kế Bắc Âu tối giản.", "en": "LED night light with 3 color modes: warm white, neutral white and daylight. 5-level touch-control brightness, built-in USB-C charging. Minimalist Nordic design."}'::jsonb,
  320000,
  ARRAY[
    'https://images.unsplash.com/photo-1513506003901-1e6a35949f27?w=600',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600'
  ],
  240,
  'a1000000-0000-0000-0000-000000000003'
),

(
  'binh-giu-nhiet-500ml-titan',
  '{"vi": "Bình giữ nhiệt 500ml Titan", "en": "500ml Titan Thermal Bottle"}'::jsonb,
  '{"vi": "Bình giữ nhiệt inox 304 cao cấp dung tích 500ml. Giữ nóng 12 giờ, giữ lạnh 24 giờ. Nắp khóa chống tràn, thân bình không BPA. Có 6 màu sắc thời thượng.", "en": "Premium 304 stainless steel 500ml thermal bottle. Hot 12 hours, cold 24 hours. Leak-proof lock lid, BPA-free body. Available in 6 trendy colors."}'::jsonb,
  285000,
  ARRAY[
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600'
  ],
  310,
  'a1000000-0000-0000-0000-000000000003'
),

-- ── Sách ────────────────────────────────────────────────────
(
  'sach-atomic-habits-ban-viet',
  '{"vi": "Atomic Habits - Thói quen nguyên tử (Bìa cứng)", "en": "Atomic Habits - Hardcover (Vietnamese Edition)"}'::jsonb,
  '{"vi": "Cuốn sách bán chạy nhất thế giới về xây dựng thói quen tốt và phá vỡ thói quen xấu. James Clear chia sẻ phương pháp cải thiện 1% mỗi ngày để đạt kết quả phi thường. Bìa cứng cao cấp, in màu.", "en": "The world-bestselling book on building good habits and breaking bad ones. James Clear shares the 1% daily improvement method to achieve extraordinary results. Premium hardcover, color printed."}'::jsonb,
  179000,
  ARRAY[
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
  ],
  500,
  'a1000000-0000-0000-0000-000000000004'
),

(
  'so-tay-dotgrid-a5-180-trang',
  '{"vi": "Sổ tay Dot Grid A5 180 trang", "en": "A5 Dot Grid Notebook 180 Pages"}'::jsonb,
  '{"vi": "Sổ tay dotgrid A5 cao cấp, giấy 100gsm không lem mực, lý tưởng cho bullet journal và sketch. Bìa cứng PU da tổng hợp, có dây đánh dấu trang và túi đựng phía sau.", "en": "Premium A5 dot grid notebook, 100gsm no-bleed paper, ideal for bullet journaling and sketching. Hard PU leather cover, ribbon bookmark and back pocket included."}'::jsonb,
  145000,
  ARRAY[
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600'
  ],
  420,
  'a1000000-0000-0000-0000-000000000004'
),

-- ── Làm đẹp ─────────────────────────────────────────────────
(
  'kem-chong-nang-spf50-pa-nhk',
  '{"vi": "Kem chống nắng SPF50+ PA++++ NHK", "en": "Sunscreen SPF50+ PA++++ NHK"}'::jsonb,
  '{"vi": "Kem chống nắng vật lý-hóa học kết hợp SPF50+ PA++++, phổ rộng UVA/UVB. Kết cấu nhẹ như nước, không nhờn, không bít lỗ chân lông. Có dưỡng ẩm và phục hồi da. 50ml.", "en": "Hybrid physical-chemical sunscreen SPF50+ PA++++ broad-spectrum UVA/UVB. Lightweight water-like texture, non-greasy, non-comedogenic. Contains moisturizing and skin repair ingredients. 50ml."}'::jsonb,
  210000,
  ARRAY[
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'
  ],
  280,
  'a1000000-0000-0000-0000-000000000005'
),

(
  'son-duong-moi-collagen-lip-gold',
  '{"vi": "Son dưỡng môi Collagen Lip Gold", "en": "Collagen Lip Gold Lip Balm"}'::jsonb,
  '{"vi": "Son dưỡng môi cao cấp chứa Collagen, Vitamin E và dầu hoa hồng. Dưỡng ẩm sâu, chống nứt nẻ môi, giúp môi hồng hào tự nhiên. Hương thơm nhẹ nhàng, lâu tan.", "en": "Premium lip balm containing Collagen, Vitamin E and rose oil. Deep moisturizing, prevents chapping, promotes natural rosy lips. Light fragrance, long-lasting."}'::jsonb,
  95000,
  ARRAY[
    'https://images.unsplash.com/photo-1586495777744-4e6232bf2919?w=600'
  ],
  600,
  'a1000000-0000-0000-0000-000000000005'
)

on conflict (slug) do nothing;
