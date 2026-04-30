-- ============================================================
-- 05_product_variants.sql — Color swatches, size variants,
--                          and richer image galleries.
-- Idempotent: safe to re-run on existing schema/data.
-- ============================================================

-- ── 1. Schema extensions ────────────────────────────────────
-- `colors` is a jsonb array of `{ name: { vi, en }, hex }` swatches.
-- Required: every product must have at least one color (enforced by check constraint below).
-- `sizes` is a text[] of size labels in display order (e.g. {"XS","S",...}); optional.
alter table public.products
  add column if not exists colors jsonb not null default '[]'::jsonb;

alter table public.products
  add column if not exists sizes text[] not null default '{}'::text[];

-- ── 2. Backfill: SBLVK black palette + standard tee sizes ────
with sblvk_palette as (
  select '[
    {"name": {"vi": "Đen Carbon",   "en": "Carbon Black"},   "hex": "#0B0B0B"},
    {"name": {"vi": "Đen Mờ",       "en": "Matte Black"},    "hex": "#1C1C1C"},
    {"name": {"vi": "Đen Tuyền",    "en": "Jet Black"},      "hex": "#000000"},
    {"name": {"vi": "Đen Obsidian", "en": "Obsidian Black"}, "hex": "#15151A"},
    {"name": {"vi": "Đen Onyx",     "en": "Onyx Black"},     "hex": "#2A2A2A"}
  ]'::jsonb as palette
)
update public.products p
   set colors = sblvk_palette.palette,
       sizes  = ARRAY['XS', 'S', 'M', 'L', 'XL', '2X']
  from sblvk_palette
 where p.slug in (
        'sblvk-carbon-black-tee',
        'sblvk-matte-black-oversized',
        'sblvk-jet-black-essential',
        'sblvk-obsidian-black-heavyweight',
        'sblvk-onyx-black-washed'
      )
   and (jsonb_array_length(p.colors) = 0 or array_length(p.sizes, 1) is null);

-- The "Premium Cotton Unisex" tee advertises 8 colors → wider palette.
update public.products
   set colors = '[
        {"name": {"vi": "Đen",      "en": "Black"},  "hex": "#0B0B0B"},
        {"name": {"vi": "Trắng",    "en": "White"},  "hex": "#F5F5F5"},
        {"name": {"vi": "Xám",      "en": "Grey"},   "hex": "#9CA3AF"},
        {"name": {"vi": "Be",       "en": "Beige"},  "hex": "#D6C7A1"},
        {"name": {"vi": "Xanh Navy","en": "Navy"},   "hex": "#1E2A44"},
        {"name": {"vi": "Xanh Lá",  "en": "Olive"},  "hex": "#5B6B3A"},
        {"name": {"vi": "Đỏ Rượu",  "en": "Wine"},   "hex": "#5C1A1B"},
        {"name": {"vi": "Mint",     "en": "Mint"},   "hex": "#A7D7C5"}
      ]'::jsonb,
       sizes = ARRAY['XS', 'S', 'M', 'L', 'XL', '2X']
 where slug = 'ao-thun-premium-cotton-unisex'
   and (jsonb_array_length(colors) = 0 or array_length(sizes, 1) is null);

-- ── 3. Richer image galleries (4–5 angles per product) ──────
-- Only overwrite when the product currently has fewer than 4 images,
-- so manually curated galleries are preserved.
update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1200'
      ]
 where slug = 'sblvk-carbon-black-tee'
   and coalesce(array_length(images, 1), 0) < 4;

update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200',
        'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1200',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200'
      ]
 where slug = 'sblvk-matte-black-oversized'
   and coalesce(array_length(images, 1), 0) < 4;

update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200',
        'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=1200'
      ]
 where slug = 'sblvk-jet-black-essential'
   and coalesce(array_length(images, 1), 0) < 4;

update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200'
      ]
 where slug = 'sblvk-obsidian-black-heavyweight'
   and coalesce(array_length(images, 1), 0) < 4;

update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200',
        'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1200',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200',
        'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=1200'
      ]
 where slug = 'sblvk-onyx-black-washed'
   and coalesce(array_length(images, 1), 0) < 4;

update public.products
   set images = ARRAY[
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200',
        'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=1200',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200'
      ]
 where slug = 'ao-thun-premium-cotton-unisex'
   and coalesce(array_length(images, 1), 0) < 4;

-- ── 4. Enforce: every product must have at least one color ──
-- 4a. Defensive backfill — any row still missing colors gets a neutral default
--     so the CHECK constraint can be applied without rejecting existing data.
update public.products
   set colors = '[{"name":{"vi":"Mặc định","en":"Default"},"hex":"#111111"}]'::jsonb
 where jsonb_array_length(colors) = 0;

-- 4b. Drop the empty default so future inserts MUST specify colors.
alter table public.products
  alter column colors drop default;

-- 4c. CHECK constraint: jsonb_array_length(colors) > 0.
alter table public.products
  drop constraint if exists products_colors_not_empty;
alter table public.products
  add constraint products_colors_not_empty
  check (jsonb_array_length(colors) > 0);
