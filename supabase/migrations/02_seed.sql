-- ============================================================
-- 02_seed.sql — Seed root categories for SBLVK
-- Run this AFTER 01_init.sql
-- ============================================================

-- Root categories (no parent_id; column added in 03)
insert into public.categories (id, slug, name) values
  (
    '11111111-1111-1111-1111-111111111111',
    'tops',
    '{"vi": "Áo", "en": "Tops"}'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'bottoms',
    '{"vi": "Quần", "en": "Bottoms"}'::jsonb
  )
on conflict (slug) do nothing;
