-- ============================================================
-- 06_product_filter_attrs.sql
--   - Replace embedded `colors` jsonb with relational sibling-product model.
--   - Add color_family / swatch_hex / fit / material as filterable attrs.
-- Idempotent: safe to re-run.
-- ============================================================

-- ── 1. New attribute columns ─────────────────────────────────
-- All nullable: existing rows backfill below; new admin-created rows
-- can set incrementally without blocking inserts.
alter table public.products
  add column if not exists style_slug   text,
  add column if not exists color_family text,
  add column if not exists swatch_hex   text,
  add column if not exists fit          text,
  add column if not exists material     text;

-- CHECK constraints (vocabulary lock for enum-like columns; nullable allowed).
alter table public.products drop constraint if exists products_color_family_chk;
alter table public.products
  add constraint products_color_family_chk
  check (color_family is null or color_family in ('black', 'white'));

alter table public.products drop constraint if exists products_fit_chk;
alter table public.products
  add constraint products_fit_chk
  check (fit is null or fit in ('slim', 'regular', 'oversized'));

-- Indexes for filter performance.
create index if not exists products_color_family_idx on public.products (color_family);
create index if not exists products_style_slug_idx   on public.products (style_slug);
create index if not exists products_fit_idx          on public.products (fit);
create index if not exists products_sizes_gin_idx    on public.products using gin (sizes);

-- ── 2. Backfill existing 5 SBLVK tees ───────────────────────
-- Demo simplification: all 5 grouped under one style so the swatch UI
-- has multiple siblings to render. In production these'd be split by
-- actual cut (oversized / heavyweight / washed are distinct styles).
update public.products
   set style_slug   = 'sblvk-essential-tee',
       color_family = 'black',
       fit          = 'regular',
       material     = 'cotton'
 where slug in (
     'sblvk-carbon-black-tee',
     'sblvk-matte-black-oversized',
     'sblvk-jet-black-essential',
     'sblvk-obsidian-black-heavyweight',
     'sblvk-onyx-black-washed'
   );

-- Per-product swatch hex (matches color_code shade).
update public.products set swatch_hex = '#0B0B0B' where slug = 'sblvk-carbon-black-tee';
update public.products set swatch_hex = '#1C1C1C' where slug = 'sblvk-matte-black-oversized';
update public.products set swatch_hex = '#000000' where slug = 'sblvk-jet-black-essential';
update public.products set swatch_hex = '#15151A' where slug = 'sblvk-obsidian-black-heavyweight';
update public.products set swatch_hex = '#2A2A2A' where slug = 'sblvk-onyx-black-washed';

-- Override the one product that's actually oversized.
update public.products set fit = 'oversized' where slug = 'sblvk-matte-black-oversized';

-- ── 3. Drop the old embedded `colors` jsonb model ───────────
alter table public.products drop constraint if exists products_colors_not_empty;
alter table public.products drop column if exists colors;
