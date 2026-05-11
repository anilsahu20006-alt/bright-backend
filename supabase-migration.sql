-- ============================================================================
-- Digital Service — Supabase schema migration
-- Run this in Supabase Studio → SQL Editor (project imeundhhnmoiwukwtqtm)
-- ============================================================================

-- 1) Profiles ----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  state text,
  address text,
  avatar_url text,
  wallet_balance numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles: select own" on public.profiles;
create policy "Profiles: select own" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "Profiles: insert own" on public.profiles;
create policy "Profiles: insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "Profiles: update own" on public.profiles;
create policy "Profiles: update own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Roles -------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin','user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

drop policy if exists "Roles: read own" on public.user_roles;
create policy "Roles: read own" on public.user_roles
  for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

-- 3) Services (admin-managed catalog) ----------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cat text not null,
  org text not null,
  date text,
  apps text,
  fee text,
  image_url text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "Services: public read" on public.services;
create policy "Services: public read" on public.services
  for select using (true);

drop policy if exists "Services: admin write" on public.services;
create policy "Services: admin write" on public.services
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- 4) Applications ------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  app_id text not null,
  service text not null,
  full_name text not null,
  phone text not null,
  email text not null,
  status text not null default 'Submitted',
  submitted_at text,
  docs jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications(user_id);
create index if not exists applications_created_at_idx on public.applications(created_at desc);

alter table public.applications enable row level security;

drop policy if exists "Applications: insert own or anon" on public.applications;
create policy "Applications: insert own or anon" on public.applications
  for insert to anon, authenticated
  with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Applications: read own" on public.applications;
create policy "Applications: read own" on public.applications
  for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));

drop policy if exists "Applications: update admin" on public.applications;
create policy "Applications: update admin" on public.applications
  for update to authenticated
  using (public.has_role(auth.uid(),'admin') or auth.uid() = user_id);

drop policy if exists "Applications: delete admin" on public.applications;
create policy "Applications: delete admin" on public.applications
  for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- 5) Storage buckets ---------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('application-docs','application-docs', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('service-images','service-images', true)
  on conflict (id) do nothing;

drop policy if exists "Docs: public read" on storage.objects;
create policy "Docs: public read" on storage.objects
  for select using (bucket_id in ('application-docs','service-images'));

drop policy if exists "Docs: anyone upload" on storage.objects;
create policy "Docs: anyone upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'application-docs');

drop policy if exists "Services img: admin write" on storage.objects;
create policy "Services img: admin write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'service-images' and public.has_role(auth.uid(),'admin'));

-- ============================================================================
-- To grant yourself admin access AFTER signing up:
--   insert into public.user_roles (user_id, role)
--   select id, 'admin' from auth.users where email = 'YOU@example.com';
-- ============================================================================
