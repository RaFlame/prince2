-- Run in Supabase SQL Editor (Dashboard → SQL)
-- Then set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

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

drop policy if exists "Allow anon read write cards" on public.card_content;
create policy "Allow anon read write cards"
  on public.card_content
  for all
  using (true)
  with check (true);

-- Optional: tighten later with auth.uid() policies for production.
