-- ============================================================
-- 08_brand_assets.sql — Brand identity asset CMS
-- Logo, favicon, OG image, etc. uploaded via /admin/brand.
-- Empty / NULL public_url → frontend uses static fallback in
-- /public/brand/defaults/, so the site always has a brand even
-- before any admin upload.
-- Idempotent.
-- ============================================================

create table if not exists public.brand_assets (
  asset_type        text primary key,
  storage_path      text,
  public_url        text,
  mime_type         text,
  width             int,
  height            int,
  file_size_bytes   int,
  is_derived        boolean not null default false,
  derived_from      text references public.brand_assets(asset_type) on delete set null,
  version           int not null default 0,
  updated_at        timestamptz not null default now(),
  updated_by        uuid references auth.users(id) on delete set null
);

comment on table public.brand_assets is
  'Brand identity assets (logo, favicon, OG image, …). asset_type values are enum-like, validated app-side via src/lib/brand/asset-types.ts. NULL public_url means: use the static fallback in /public/brand/defaults/.';
comment on column public.brand_assets.is_derived is
  'true = auto-generated from another asset (e.g. favicon derived from logo_primary). Admin override sets this to false.';
comment on column public.brand_assets.version is
  'Bumps on every replace. storage_path already includes a content hash so cache-bust is automatic; version is for audit/UI.';

drop trigger if exists trg_brand_assets_updated_at on public.brand_assets;
create trigger trg_brand_assets_updated_at
  before update on public.brand_assets
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
-- Public read (logo URLs are baked into HTML anyway).
-- Authenticated write — server actions gate via requireAdmin();
-- mirrors the homepage_content pattern.
alter table public.brand_assets enable row level security;

drop policy if exists "brand_assets: public read"  on public.brand_assets;
drop policy if exists "brand_assets: auth insert"  on public.brand_assets;
drop policy if exists "brand_assets: auth update"  on public.brand_assets;
drop policy if exists "brand_assets: auth delete"  on public.brand_assets;

create policy "brand_assets: public read"
  on public.brand_assets for select using (true);
create policy "brand_assets: auth insert"
  on public.brand_assets for insert to authenticated with check (true);
create policy "brand_assets: auth update"
  on public.brand_assets for update to authenticated using (true);
create policy "brand_assets: auth delete"
  on public.brand_assets for delete to authenticated using (true);

-- ── Storage bucket ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', true)
on conflict (id) do nothing;

drop policy if exists "brand-assets: public read"  on storage.objects;
drop policy if exists "brand-assets: auth insert"  on storage.objects;
drop policy if exists "brand-assets: auth update"  on storage.objects;
drop policy if exists "brand-assets: auth delete"  on storage.objects;

create policy "brand-assets: public read"
  on storage.objects for select
  using (bucket_id = 'brand-assets');

create policy "brand-assets: auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets');

create policy "brand-assets: auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'brand-assets');

create policy "brand-assets: auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'brand-assets');
