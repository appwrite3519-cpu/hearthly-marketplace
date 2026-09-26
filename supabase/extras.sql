-- Run this once in the Supabase SQL editor so new listing checkboxes can save.
alter table listings add column if not exists has_receipt boolean not null default false;
alter table listings add column if not exists has_carton boolean not null default false;
