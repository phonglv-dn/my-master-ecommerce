-- ============================================================
-- 04_homepage_content.sql — Editable homepage blocks + lookbook storage
-- Idempotent
-- ============================================================

-- ── Table ───────────────────────────────────────────────────
create table if not exists public.homepage_content (
  block_key   text primary key,
  text_data   jsonb not null default '{}'::jsonb,
  image_data  jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

comment on table public.homepage_content is
  'Editable homepage blocks. block_key ∈ (hero, new_this_week, collections, lookbook).';
comment on column public.homepage_content.text_data is
  'Localized text fields, e.g. {"title": {"vi": "...", "en": "..."}}';
comment on column public.homepage_content.image_data is
  'Image refs (lookbook only): {"images": [{"url": "...", "alt_vi": "...", "alt_en": "..."}]}';

drop trigger if exists trg_homepage_content_updated_at on public.homepage_content;
create trigger trg_homepage_content_updated_at
  before update on public.homepage_content
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
alter table public.homepage_content enable row level security;

drop policy if exists "homepage_content: public read"  on public.homepage_content;
drop policy if exists "homepage_content: auth insert"  on public.homepage_content;
drop policy if exists "homepage_content: auth update"  on public.homepage_content;
drop policy if exists "homepage_content: auth delete"  on public.homepage_content;

create policy "homepage_content: public read"
  on public.homepage_content for select using (true);
create policy "homepage_content: auth insert"
  on public.homepage_content for insert to authenticated with check (true);
create policy "homepage_content: auth update"
  on public.homepage_content for update to authenticated using (true);
create policy "homepage_content: auth delete"
  on public.homepage_content for delete to authenticated using (true);

-- ── Seed (mirrors src/messages/{vi,en}.json at the time of writing) ─
insert into public.homepage_content (block_key, text_data, image_data) values
  (
    'hero',
    '{
      "titleLine1": {"vi": "BỘ SƯU TẬP", "en": "NEW"},
      "titleLine2": {"vi": "MỚI", "en": "COLLECTION"},
      "subtitle":   {"vi": "Hè 2024", "en": "Summer 2024"},
      "shopCta":    {"vi": "ĐẾN CỬA HÀNG", "en": "GO TO SHOP"}
    }'::jsonb,
    '{}'::jsonb
  ),
  (
    'new_this_week',
    '{
      "titleLine1": {"vi": "Đồng phục", "en": "The Daily"},
      "titleLine2": {"vi": "Hằng ngày", "en": "Uniform"},
      "seeAll":     {"vi": "Xem tất cả", "en": "See All"}
    }'::jsonb,
    '{}'::jsonb
  ),
  (
    'collections',
    '{
      "title": {"vi": "BỘ SƯU TẬP CHỦ ĐẠO", "en": "CORE COLLECTION"}
    }'::jsonb,
    '{}'::jsonb
  ),
  (
    'lookbook',
    '{
      "title":       {"vi": "SBLVK: Vượt ngoài Màu Đen", "en": "SBLVK: Beyond the Black"},
      "description": {"vi": "Chúng tôi tin rằng màu đen không phải là sự thiếu vắng màu sắc,\nmà là sự tập trung tuyệt đối vào phom dáng và bản sắc.", "en": "We believe black is not the absence of color,\nbut absolute focus on form and identity."}
    }'::jsonb,
    '{
      "images": [
        {"url": "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?w=800&q=80", "alt_vi": "Tối giản đen - kiến trúc về đêm", "alt_en": "Dark minimalist - architectural night"},
        {"url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "alt_vi": "Tối giản đen - áo box tee đen", "alt_en": "Dark minimalist - black box tee"},
        {"url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80", "alt_vi": "Tối giản đen - phố đêm",          "alt_en": "Dark minimalist - night street"},
        {"url": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", "alt_vi": "Tối giản đen - bóng kiến trúc thô mộc", "alt_en": "Dark minimalist - brutalist silhouette"}
      ]
    }'::jsonb
  )
on conflict (block_key) do nothing;

-- ── Storage bucket for lookbook images ─────────────────────
insert into storage.buckets (id, name, public)
values ('lookbook', 'lookbook', true)
on conflict (id) do nothing;

drop policy if exists "lookbook: public read"  on storage.objects;
drop policy if exists "lookbook: auth insert"  on storage.objects;
drop policy if exists "lookbook: auth update"  on storage.objects;
drop policy if exists "lookbook: auth delete"  on storage.objects;

create policy "lookbook: public read"
  on storage.objects for select
  using (bucket_id = 'lookbook');

create policy "lookbook: auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'lookbook');

create policy "lookbook: auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'lookbook');

create policy "lookbook: auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'lookbook');
