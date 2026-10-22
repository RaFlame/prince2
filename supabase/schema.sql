-- Run in Supabase SQL Editor (Dashboard → SQL)
-- Then set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
-- and the same values in Vercel → Project → Settings → Environment Variables.

create table if not exists public.card_content (
  card_key text primary key,
  content_is text not null default '',
  content_en text not null default '',
  font text not null default 'sans',
  size text not null default 'md',
  color text not null default 'slate',
  bold boolean not null default false,
  italic boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.card_content enable row level security;

-- Remove open anon policy if it still exists
drop policy if exists "Allow anon read write cards" on public.card_content;
drop policy if exists "Authenticated read cards" on public.card_content;
drop policy if exists "Authenticated write cards" on public.card_content;

-- Only signed-in users can read/write cards
create policy "Authenticated read cards"
  on public.card_content
  for select
  to authenticated
  using (true);

create policy "Authenticated write cards"
  on public.card_content
  for all
  to authenticated
  using (true)
  with check (true);

-- Shared project workspace (stage status, schedules, SCRUM, custom projects)
create table if not exists public.project_state (
  project_id text not null,
  kind text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (project_id, kind)
);

alter table public.project_state enable row level security;

drop policy if exists "Authenticated read project_state" on public.project_state;
drop policy if exists "Authenticated write project_state" on public.project_state;

create policy "Authenticated read project_state"
  on public.project_state
  for select
  to authenticated
  using (true);

create policy "Authenticated write project_state"
  on public.project_state
  for all
  to authenticated
  using (true)
  with check (true);
