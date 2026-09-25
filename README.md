# Hearthly

Local classifieds: buyers and sellers chat, agree a public meetup, inspect the item, then pay each other directly.

Hearthly does **not** process payments, hold money, or arrange delivery.

## What is in this demo

- Browse listings by city and category
- One account type — anyone can list or buy
- Chat to negotiate price
- Suggest a public meetup spot
- Mark sold and leave a rating after you meet
- Safety page with daylight / public-place rules

Listings, users, chats, ratings and reports live in **Supabase Postgres**. Session is still a cookie-less `localStorage` row so we can add Supabase Auth next without blocking the database.

After a confirmed sale we will close that listing’s chats, wipe message bodies, and delete item photos. The schema already has `conversations.status`, `listings.sold_at` and `listings.sold_to` for that.

## Wire the free database

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and paste `supabase/schema.sql` (creates tables + demo seed).
3. Copy **Project URL** and **service_role** key from Settings → API.
4. Put them in `.env.local`:

```bash
cp .env.example .env.local
```

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The service role stays on the server (`app/api/store`). The browser never talks to Postgres directly.

Demo logins (seeded by the SQL file):

- `amaka@hearthly.demo` / `demo1234` — buyer with an open chat
- `ada@hearthly.demo` / `demo1234` — seller with several listings

```bash
npm install
npm run dev
```
