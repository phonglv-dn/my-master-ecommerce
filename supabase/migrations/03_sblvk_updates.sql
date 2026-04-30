-- ============================================================
-- 03_sblvk_updates.sql — Schema extensions + SBLVK seed
-- Idempotent: safe to re-run on existing schema
-- ============================================================

-- ── 1. Schema extensions ────────────────────────────────────
alter table public.categories
  add column if not exists parent_id uuid references public.categories (id) on delete set null;

alter table public.products
  add column if not exists color_code text;

create table if not exists public.hero_banners (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  image_1_url  text,
  image_1_link text,
  image_2_url  text,
  image_2_link text,
  cta_initial  char(1) default 'S',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.hero_banners enable row level security;

drop policy if exists "hero_banners: public read"  on public.hero_banners;
drop policy if exists "hero_banners: auth insert"  on public.hero_banners;
drop policy if exists "hero_banners: auth update"  on public.hero_banners;
drop policy if exists "hero_banners: auth delete"  on public.hero_banners;

create policy "hero_banners: public read"
  on public.hero_banners for select using (true);
create policy "hero_banners: auth insert"
  on public.hero_banners for insert to authenticated with check (true);
create policy "hero_banners: auth update"
  on public.hero_banners for update to authenticated using (true);
create policy "hero_banners: auth delete"
  on public.hero_banners for delete to authenticated using (true);

drop trigger if exists trg_hero_banners_updated_at on public.hero_banners;
create trigger trg_hero_banners_updated_at
  before update on public.hero_banners
  for each row execute function public.set_updated_at();

-- ── 2. Leaf categories (children of Áo / Quần) ──────────────
insert into public.categories (id, slug, name, parent_id) values
  (
    'a10e3d31-0f54-4468-a300-3f0d035d81ab',
    'box-tee',
    '{"vi": "Box Tee", "en": "Box Tee"}'::jsonb,
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '5cf00ad4-e56a-4bf2-a361-c0490ea55d00',
    'shorts',
    '{"vi": "Quần Shorts", "en": "Shorts"}'::jsonb,
    '22222222-2222-2222-2222-222222222222'
  )
on conflict (slug) do nothing;

-- ── 3. Products: 6 t-shirts, all under Box Tee ──────────────
insert into public.products
  (slug, title, description, price_vnd, stock, category_id, images, color_code)
values
(
  'sblvk-carbon-black-tee',
  '{"vi": "Áo Thun SBLVK Carbon Black", "en": "SBLVK Carbon Black Tee"}'::jsonb,
  '{"vi": "Thiết kế tối giản với sắc đen Carbon huyền bí. Chất liệu 100% Cotton 2 chiều dày dặn, đứng form.", "en": "Minimalist design in mysterious Carbon Black. 100% thick 2-way Cotton, structured fit."}'::jsonb,
  450000,
  100,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
  'Carbon Black'
),
(
  'sblvk-matte-black-oversized',
  '{"vi": "Áo Thun SBLVK Matte Black Oversized", "en": "SBLVK Matte Black Oversized Tee"}'::jsonb,
  '{"vi": "Form áo oversized rộng rãi, màu Matte Black nhám tinh tế. Phong cách streetwear hiện đại.", "en": "Oversized fit, elegant Matte Black color. Modern streetwear style."}'::jsonb,
  550000,
  80,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'],
  'Matte Black'
),
(
  'sblvk-jet-black-essential',
  '{"vi": "Áo Thun SBLVK Jet Black Essential", "en": "SBLVK Jet Black Essential Tee"}'::jsonb,
  '{"vi": "Sắc đen Jet Black sâu thẳm. Sản phẩm essential không thể thiếu cho các tín đồ đồ đen.", "en": "Deep Jet Black color. An essential item for black clothing enthusiasts."}'::jsonb,
  350000,
  150,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600'],
  'Jet Black'
),
(
  'sblvk-obsidian-black-heavyweight',
  '{"vi": "Áo Thun SBLVK Obsidian Heavyweight", "en": "SBLVK Obsidian Heavyweight Tee"}'::jsonb,
  '{"vi": "Áo thun định lượng cao 280gsm, màu đen Obsidian. Độ bền vượt trội, giữ form hoàn hảo.", "en": "Heavyweight 280gsm tee in Obsidian Black. Outstanding durability, perfect shape retention."}'::jsonb,
  650000,
  60,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
  'Obsidian Black'
),
(
  'sblvk-onyx-black-washed',
  '{"vi": "Áo Thun SBLVK Onyx Washed", "en": "SBLVK Onyx Washed Tee"}'::jsonb,
  '{"vi": "Màu Onyx Black với hiệu ứng wash nhẹ mang lại vẻ bụi bặm, cá tính. Chất liệu mềm mại.", "en": "Onyx Black color with a light wash effect for a vintage, edgy look. Soft material."}'::jsonb,
  590000,
  90,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
  'Onyx Black'
),
(
  'ao-thun-premium-cotton-unisex',
  '{"vi": "Áo thun Premium Cotton Unisex", "en": "Premium Cotton Unisex T-Shirt"}'::jsonb,
  '{"vi": "Áo thun 100% cotton combed cao cấp, form regular fit thoải mái. Chất liệu mềm mại, thấm hút mồ hôi tốt, không ra màu sau nhiều lần giặt. Có 8 màu sắc đa dạng.", "en": "100% premium combed cotton T-shirt, comfortable regular fit. Soft material, excellent moisture absorption, color-fast through many washes. Available in 8 colors."}'::jsonb,
  299000,
  350,
  'a10e3d31-0f54-4468-a300-3f0d035d81ab',
  ARRAY[
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600'
  ],
  null
)
on conflict (slug) do nothing;

-- ── 4. Hero banners ─────────────────────────────────────────
insert into public.hero_banners (title, image_1_url, image_1_link, image_2_url, image_2_link, cta_initial)
values
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
