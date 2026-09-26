-- Run this once in the Supabase SQL editor.
alter table listings add column if not exists has_receipt boolean not null default false;
alter table listings add column if not exists has_carton boolean not null default false;

alter table users add column if not exists phone_verified boolean not null default false;

create table if not exists phone_otps (
  phone text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  pending jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
