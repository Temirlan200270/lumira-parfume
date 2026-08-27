-- Lumira Parfume MVP schema: products, offers, orders + RLS.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  name text not null,
  description text not null default '',
  gender text not null check (gender in ('male', 'female', 'unisex')),
  notes jsonb not null default '{}'::jsonb,
  image_url text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  section text not null check (section in ('razliv', 'raspiv')),
  price_per_ml_tenge integer not null check (price_per_ml_tenge > 0),
  is_original boolean not null default false,
  is_in_stock boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, section)
);

create index if not exists offers_product_id_idx on public.offers (product_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone_e164 text not null,
  items jsonb not null,
  total_tenge integer not null check (total_tenge > 0),
  status text not null default 'new' check (status in ('new', 'confirmed', 'paid', 'completed', 'cancelled')),
  client_request_id uuid not null unique,
  telegram_sent boolean not null default false,
  created_at timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists offers_set_updated_at on public.offers;
create trigger offers_set_updated_at
before update on public.offers
for each row execute procedure public.set_updated_at();

alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;

drop policy if exists products_public_select on public.products;
create policy products_public_select
on public.products
for select
to anon, authenticated
using (is_active = true);

drop policy if exists offers_public_select on public.offers;
create policy offers_public_select
on public.offers
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.products p
    where p.id = offers.product_id
      and p.is_active = true
  )
);

revoke insert, update, delete on public.products from anon, authenticated;
revoke insert, update, delete on public.offers from anon, authenticated;
revoke all on public.orders from anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.offers to anon, authenticated;
