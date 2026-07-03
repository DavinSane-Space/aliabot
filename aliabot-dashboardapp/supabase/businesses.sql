-- Run in the Supabase SQL editor for your project.

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists businesses_user_id_key on public.businesses (user_id);

alter table public.businesses enable row level security;

create policy "Users can read their own business"
  on public.businesses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own business"
  on public.businesses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own business"
  on public.businesses for update
  using (auth.uid() = user_id);
