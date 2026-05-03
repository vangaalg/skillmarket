-- ============================================================
-- Skill Marketplace — Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- Tables for Phase 1 are active; later phases are scaffolded
-- so the same migration grows without painful rewrites.
-- ============================================================

-- ---------- PHASE 1 ----------

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null default 'user' check (role in ('user','creator','admin')),
  -- PHASE 2: subscription tier from Stripe webhook.
  subscription_status text not null default 'free'
    check (subscription_status in ('free','basic','pro','enterprise')),
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete set null,
  name text not null,
  description text not null check (length(description) > 0),
  -- definition is the SKILL.md / JSON authored by the creator.
  definition jsonb not null,
  -- PHASE 2: monetisation.
  price_cents integer not null default 0,
  -- PHASE 4: simple incrementing version (creator updates).
  version integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists skills_owner_idx on public.skills(owner_id);
create index if not exists skills_published_idx on public.skills(is_published);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  -- chat_history is an array of {role, content, ts} objects.
  chat_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sessions_skill_idx on public.sessions(skill_id);
create index if not exists sessions_user_idx on public.sessions(user_id);

-- ---------- PHASE 3: community ----------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (skill_id, user_id)
);

create table if not exists public.analytics (
  skill_id uuid primary key references public.skills(id) on delete cascade,
  usage_count bigint not null default 0,
  avg_session_length numeric not null default 0,
  updated_at timestamptz not null default now()
);

-- ---------- PHASE 5: enterprise ----------

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin','member')),
  primary key (team_id, user_id)
);

-- ---------- Row-level security ----------
-- Public read of published skills; writes scoped to owner.
-- Adjust auth.uid() bindings once Supabase Auth is wired up.

alter table public.skills enable row level security;
alter table public.sessions enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "skills_read_published" on public.skills;
create policy "skills_read_published" on public.skills
  for select using (is_published);

drop policy if exists "sessions_owner_rw" on public.sessions;
create policy "sessions_owner_rw" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
