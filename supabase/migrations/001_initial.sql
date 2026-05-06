-- Run in Supabase SQL Editor or via CLI. Service role from Next.js bypasses RLS.

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  shop_manual_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, shop_manual_enabled)
values (1, true)
on conflict (id) do nothing;

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null check (category in ('print', 'original', 'digital', 'service')),
  price numeric(12, 2) not null,
  images jsonb not null default '[]'::jsonb,
  variants jsonb,
  is_digital boolean not null default false,
  digital_file_path text,
  digital_file_url text,
  inventory integer,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  customer_name text,
  amount_total integer not null,
  currency text not null default 'usd',
  items_snapshot jsonb not null default '[]'::jsonb,
  line_items_snapshot jsonb,
  shipping_address jsonb,
  status text not null default 'processing'
    check (status in ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.site_settings enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- No anon policies: all access via service role from Next.js API routes.

comment on table public.products is 'Shop catalog; accessed via Next.js with service role';
comment on table public.orders is 'Orders persisted from Stripe webhook';
comment on table public.site_settings is 'Single row id=1; shop_manual_enabled merged with weekly schedule in API';
