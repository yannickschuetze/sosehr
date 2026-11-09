create type public.message_status as enum ('pending', 'published', 'rejected');

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) between 1 and 700),
  dedication text check (dedication is null or char_length(dedication) <= 80),
  status public.message_status not null default 'pending',
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.messages enable row level security;

-- All access happens through the protected Nuxt server endpoints for now.
-- No public database policies are intentionally created.

create index messages_published_at_index
  on public.messages (published_at desc)
  where status = 'published';
