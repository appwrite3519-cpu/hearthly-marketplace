-- Hearthly: run this once in the Supabase SQL editor.
-- Photos stay as URLs for now. After a confirmed sale we will wipe chat
-- bodies and listing photos; this schema already has the columns for that.

create table if not exists users (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text,
  city text,
  password text not null,
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  seller_id text not null references users(id) on delete cascade,
  title text not null,
  category text not null,
  condition text not null,
  price numeric not null,
  negotiable boolean not null default true,
  has_receipt boolean not null default false,
  has_carton boolean not null default false,
  city text not null,
  neighborhood text,
  description text,
  image text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  sold_at timestamptz,
  sold_to text references users(id)
);

create table if not exists conversations (
  id text primary key,
  listing_id text not null references listings(id) on delete cascade,
  buyer_id text not null references users(id) on delete cascade,
  seller_id text not null references users(id) on delete cascade,
  meetup_place text not null default '',
  meetup_time text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  sender_id text not null,
  kind text not null default 'text',
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id text primary key,
  from_id text not null references users(id) on delete cascade,
  to_id text not null references users(id) on delete cascade,
  listing_id text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id text primary key,
  from_id text not null,
  listing_id text not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists listings_feed_idx on listings (city, category, status, created_at desc);
create index if not exists listings_seller_idx on listings (seller_id);
create index if not exists conversations_user_idx on conversations (buyer_id, seller_id);
create index if not exists messages_convo_idx on messages (conversation_id, created_at);
create unique index if not exists conversations_pair_idx on conversations (listing_id, buyer_id);

alter table users enable row level security;
alter table listings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table reports enable row level security;

insert into users (id, name, email, phone, city, password) values
  ('user-ada', 'Adaeze Okonkwo', 'ada@hearthly.demo', '+234 803 441 2290', 'Lagos', 'demo1234'),
  ('user-kwame', 'Kwame Mensah', 'kwame@hearthly.demo', '+233 24 555 0182', 'Accra', 'demo1234'),
  ('user-tunde', 'Tunde Balogun', 'tunde@hearthly.demo', '+234 809 220 4411', 'Ibadan', 'demo1234'),
  ('user-amaka', 'Amaka Eze', 'amaka@hearthly.demo', '+234 802 118 4402', 'Lagos', 'demo1234')
on conflict (id) do nothing;
