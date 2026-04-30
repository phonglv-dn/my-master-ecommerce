-- ============================================================
-- 03_sblvk_updates.sql — Schema updates & seed data for SBLVK
-- ============================================================

-- ── 1. Update categories ────────────────────────────────────
-- Add parent_id for hierarchical categories (e.g., Quần -> Shorts/Quần dài)
ALTER TABLE public.categories 
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories (id) ON DELETE SET NULL;

-- ── 2. Update products ──────────────────────────────────────
-- Add color_code since the brand specializes in black shades
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS color_code text;

-- Note: description is already a JSONB column as defined in 01_init.sql 
-- to support multi-language (Vi/En). No alteration needed for description.

-- ── 3. Create hero_banners ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text not null,
  image_1_url text,
  image_1_link text,
  image_2_url text,
  image_2_link text,
  cta_initial char(1) default 'S',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS & triggers for hero_banners
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero_banners: public read" ON public.hero_banners FOR SELECT USING (true);
CREATE POLICY "hero_banners: auth insert" ON public.hero_banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "hero_banners: auth update" ON public.hero_banners FOR UPDATE TO authenticated USING (true);
CREATE POLICY "hero_banners: auth delete" ON public.hero_banners FOR DELETE TO authenticated USING (true);

CREATE TRIGGER trg_hero_banners_updated_at
  BEFORE UPDATE ON public.hero_banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. Seed Data for SBLVK ──────────────────────────────────

-- Seed hero_banners (2 records)
INSERT INTO public.hero_banners (title, image_1_url, image_1_link, image_2_url, image_2_link, cta_initial)
VALUES
  (
    'SBLVK FALL/WINTER COLLECTION', 
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 
    '/collections/fw', 
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800', 
    '/products/new-arrivals', 
    'S'
  ),
  (
    'ESSENTIAL MATTE BLACK', 
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', 
    '/collections/essentials', 
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', 
    '/collections/matte-black', 
    'S'
  );

-- Seed products (5 black t-shirts)
-- Assuming 'a1000000-0000-0000-0000-000000000002' is the 'Thời trang' category from 02_seed.sql
INSERT INTO public.products (slug, title, description, price_vnd, stock, category_id, images, color_code)
VALUES
(
  'sblvk-carbon-black-tee',
  '{"vi": "Áo Thun SBLVK Carbon Black", "en": "SBLVK Carbon Black Tee"}'::jsonb,
  '{"vi": "Thiết kế tối giản với sắc đen Carbon huyền bí. Chất liệu 100% Cotton 2 chiều dày dặn, đứng form.", "en": "Minimalist design in mysterious Carbon Black. 100% thick 2-way Cotton, structured fit."}'::jsonb,
  450000,
  100,
  'a1000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
  'Carbon Black'
),
(
  'sblvk-matte-black-oversized',
  '{"vi": "Áo Thun SBLVK Matte Black Oversized", "en": "SBLVK Matte Black Oversized Tee"}'::jsonb,
  '{"vi": "Form áo oversized rộng rãi, màu Matte Black nhám tinh tế. Phong cách streetwear hiện đại.", "en": "Oversized fit, elegant Matte Black color. Modern streetwear style."}'::jsonb,
  550000,
  80,
  'a1000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'],
  'Matte Black'
),
(
  'sblvk-jet-black-essential',
  '{"vi": "Áo Thun SBLVK Jet Black Essential", "en": "SBLVK Jet Black Essential Tee"}'::jsonb,
  '{"vi": "Sắc đen Jet Black sâu thẳm. Sản phẩm essential không thể thiếu cho các tín đồ đồ đen.", "en": "Deep Jet Black color. An essential item for black clothing enthusiasts."}'::jsonb,
  350000,
  150,
  'a1000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600'],
  'Jet Black'
),
(
  'sblvk-obsidian-black-heavyweight',
  '{"vi": "Áo Thun SBLVK Obsidian Heavyweight", "en": "SBLVK Obsidian Heavyweight Tee"}'::jsonb,
  '{"vi": "Áo thun định lượng cao 280gsm, màu đen Obsidian. Độ bền vượt trội, giữ form hoàn hảo.", "en": "Heavyweight 280gsm tee in Obsidian Black. Outstanding durability, perfect shape retention."}'::jsonb,
  650000,
  60,
  'a1000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
  'Obsidian Black'
),
(
  'sblvk-onyx-black-washed',
  '{"vi": "Áo Thun SBLVK Onyx Washed", "en": "SBLVK Onyx Washed Tee"}'::jsonb,
  '{"vi": "Màu Onyx Black với hiệu ứng wash nhẹ mang lại vẻ bụi bặm, cá tính. Chất liệu mềm mại.", "en": "Onyx Black color with a light wash effect for a vintage, edgy look. Soft material."}'::jsonb,
  590000,
  90,
  'a1000000-0000-0000-0000-000000000002',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
  'Onyx Black'
);
