-- Tally — Supabase schema (paste into the Supabase SQL editor and run)
--
-- This schema assumes Supabase Auth is enabled (it is by default). All user-owned
-- rows reference auth.users via user_id. Row-Level Security is enabled on every
-- table so users can only see / mutate their own rows.

-- =========================================================================
-- Extensions
-- =========================================================================
create extension if not exists "uuid-ossp";

-- =========================================================================
-- Profiles
-- =========================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  stripe_customer_id text unique,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- =========================================================================
-- Subscriptions (Stripe-backed entitlements)
-- =========================================================================
-- The Stripe webhook (route /api/stripe/webhook) writes to this table using
-- the SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. End users only read.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  tier text not null default 'starter',
  status text not null default 'active',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- =========================================================================
-- Cash entries
-- =========================================================================
create table if not exists public.cash_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  merchant text not null,
  category text not null,
  spent_at date not null,
  note text,
  created_at timestamptz default now()
);

create index if not exists cash_entries_user_idx on public.cash_entries (user_id, spent_at desc);

alter table public.cash_entries enable row level security;

drop policy if exists "Users manage their own cash entries" on public.cash_entries;
create policy "Users manage their own cash entries"
  on public.cash_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================================
-- Receipts
-- =========================================================================
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  merchant text not null,
  amount numeric not null,
  category text not null,
  tax_tag text not null,
  receipt_date date not null,
  image_url text,
  notes text,
  created_at timestamptz default now()
);

create index if not exists receipts_user_idx on public.receipts (user_id, receipt_date desc);

alter table public.receipts enable row level security;

drop policy if exists "Users manage their own receipts" on public.receipts;
create policy "Users manage their own receipts"
  on public.receipts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================================
-- Storage bucket for receipt images (run in Supabase Storage UI or via SQL):
--   insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);
-- Then add a policy so users can read/write only files inside their own folder
-- (path prefix = auth.uid()).
-- =========================================================================
