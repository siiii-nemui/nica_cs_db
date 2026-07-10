create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  basic_info jsonb not null,
  design jsonb not null,
  parts jsonb not null,
  memory_fragments jsonb not null,
  attachments jsonb not null,
  session_records jsonb not null,
  memo text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists characters_owner_id_idx on characters(owner_id);

-- Note: the session store table used by connect-pg-simple is created
-- automatically at server startup via the `createTableIfMissing` option.
