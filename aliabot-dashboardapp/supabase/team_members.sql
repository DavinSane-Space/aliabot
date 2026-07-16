-- Run in the Supabase SQL editor for your project.
-- Adds business team members (invites), used by the Equipo page (Fase 9).
-- Not part of the original Fase 1 schema — the businesses table only tracks
-- a single owner (user_id), so this is a new table for additional members.

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  email text not null,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'active')),
  invited_at timestamptz not null default now(),
  joined_at timestamptz
);

create unique index if not exists business_members_business_email_key
  on public.business_members (business_id, email);

create index if not exists business_members_business_id_idx on public.business_members (business_id);

alter table public.business_members enable row level security;

create policy "Users can read members of their own business"
  on public.business_members for select
  using (exists (
    select 1 from public.businesses b
    where b.id = business_members.business_id and b.user_id = auth.uid()
  ));

create policy "Users can invite members to their own business"
  on public.business_members for insert
  with check (exists (
    select 1 from public.businesses b
    where b.id = business_members.business_id and b.user_id = auth.uid()
  ));

create policy "Users can remove members from their own business"
  on public.business_members for delete
  using (exists (
    select 1 from public.businesses b
    where b.id = business_members.business_id and b.user_id = auth.uid()
  ));
