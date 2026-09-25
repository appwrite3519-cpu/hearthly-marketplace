-- Run after schema.sql
insert into listings (id, seller_id, title, category, condition, price, negotiable, city, neighborhood, description, image, status, created_at) values
  ('item-mixer', 'user-ada', 'Stand mixer in cream enamel', 'home', 'like-new', 95000, false, 'Lagos', 'Ikeja GRA', 'Used fewer than ten times. Comes with dough hook, whisk and mixing bowl. Meet at Shoprite Ikeja.', 'https://images.unsplash.com/photo-1570222094114-d054a817e367?auto=format&fit=crop&w=1400&q=80', 'active', '2026-09-18T14:00:00.000Z'),
  ('item-sofa-linen', 'user-ada', 'Three-seater linen sofa', 'furniture', 'excellent', 185000, true, 'Lagos', 'Lekki Phase 1', 'Soft oatmeal linen sofa. Meet at The Palms Lekki so you can sit on it first.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80', 'active', '2026-09-12T10:00:00.000Z'),
  ('item-phone', 'user-kwame', 'Used Android phone, 128GB', 'phones', 'good', 145000, true, 'Accra', 'Osu', 'Light scratch near the top. Meet at Accra Mall and inspect before you pay.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80', 'active', '2026-09-16T11:00:00.000Z'),
  ('item-sneakers', 'user-amaka', 'White sneakers, UK 42', 'fashion', 'excellent', 22000, true, 'Lagos', 'Surulere', 'Worn a handful of times. Meet at Shoprite Ikeja to try them on.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80', 'active', '2026-09-21T10:00:00.000Z')
on conflict (id) do nothing;

insert into conversations (id, listing_id, buyer_id, seller_id, meetup_place, meetup_time, status, created_at) values
  ('convo-1', 'item-mixer', 'user-amaka', 'user-ada', 'Shoprite Ikeja', 'Sunday 3pm', 'open', '2026-09-21T08:00:00.000Z')
on conflict (id) do nothing;

insert into messages (id, conversation_id, sender_id, kind, text, created_at) values
  ('msg-1', 'convo-1', 'user-amaka', 'text', 'Hi Ada, is the mixer still available? Would you take 85k?', '2026-09-21T08:01:00.000Z'),
  ('msg-2', 'convo-1', 'user-ada', 'text', 'It is available. I can do 90k if we meet this weekend.', '2026-09-21T08:12:00.000Z')
on conflict (id) do nothing;

insert into reviews (id, from_id, to_id, listing_id, rating, comment, created_at) values
  ('rev-1', 'user-tunde', 'user-ada', 'item-mixer', 5, 'Showed up on time. Item as described.', '2026-09-11T18:00:00.000Z')
on conflict (id) do nothing;
