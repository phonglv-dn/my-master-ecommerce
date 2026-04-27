-- ============================================================
-- 01_init.sql — Initial schema for MasterShop
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── categories ──────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default uuid_generate_v4(),
  slug       text not null unique,
  name       jsonb not null default '{}'::jsonb,   -- {"vi": "...", "en": "..."}
  created_at timestamptz not null default now()
);

comment on column public.categories.name is
  'Localized name: {"vi": "Điện tử", "en": "Electronics"}';

-- ── products ────────────────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default uuid_generate_v4(),

  -- Localized text fields
  title       jsonb not null default '{}'::jsonb,        -- {"vi": "...", "en": "..."}
  description jsonb not null default '{}'::jsonb,        -- {"vi": "...", "en": "..."}

  -- Pricing (stored in VND; conversion handled in application layer)
  price_vnd   numeric(15, 2) not null check (price_vnd >= 0),

  -- URL-friendly identifier (unique across all products)
  slug        text not null unique,

  -- Array of image URLs / storage paths
  images      text[] not null default '{}',

  -- Inventory
  stock       integer not null default 0 check (stock >= 0),

  -- Relation
  category_id uuid references public.categories (id) on delete set null,

  -- Timestamps
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.products.title is
  'Localized title: {"vi": "Tên sản phẩm", "en": "Product name"}';
comment on column public.products.description is
  'Localized description: {"vi": "Mô tả", "en": "Description"}';
comment on column public.products.price_vnd is
  'Base price in Vietnamese Dong (VND). Convert to other currencies at runtime.';
comment on column public.products.images is
  'Ordered array of image URLs or Supabase Storage object paths.';

-- ── Indexes ─────────────────────────────────────────────────
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_slug        on public.products (slug);
create index if not exists idx_products_stock       on public.products (stock);

-- GIN indexes for JSONB full-text lookups
create index if not exists idx_products_title_gin       on public.products using gin (title);
create index if not exists idx_products_description_gin on public.products using gin (description);

-- ── Auto-update updated_at ───────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ── Row-Level Security ───────────────────────────────────────
alter table public.categories enable row level security;
alter table public.products    enable row level security;

-- Public read access
create policy "categories: public read"
  on public.categories for select using (true);

create policy "products: public read"
  on public.products for select using (true);

-- Authenticated write access (admin operations via service role bypass RLS)
create policy "categories: auth insert"
  on public.categories for insert to authenticated with check (true);

create policy "categories: auth update"
  on public.categories for update to authenticated using (true);

create policy "categories: auth delete"
  on public.categories for delete to authenticated using (true);

create policy "products: auth insert"
  on public.products for insert to authenticated with check (true);

create policy "products: auth update"
  on public.products for update to authenticated using (true);

create policy "products: auth delete"
  on public.products for delete to authenticated using (true);
