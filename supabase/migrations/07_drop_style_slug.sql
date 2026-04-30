-- ============================================================
-- 07_drop_style_slug.sql
--   Color is now read-only metadata per product.
--   The sibling-grouping concept (and its swatch UI) is removed,
--   so style_slug + its index are dead weight.
-- Idempotent.
-- ============================================================

drop index if exists public.products_style_slug_idx;

alter table public.products drop column if exists style_slug;
