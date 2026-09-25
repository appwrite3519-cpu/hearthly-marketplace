-- Optional. The app tries to create this bucket on first upload.
-- Run this in the Supabase SQL editor if photo upload says the bucket is missing.

insert into storage.buckets (id, name, public, file_size_limit)
values ('listing-photos', 'listing-photos', true, 3145728)
on conflict (id) do update set public = true;
