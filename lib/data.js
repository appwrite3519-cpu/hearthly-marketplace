export const CATEGORIES = [
  { id: "furniture", name: "Furniture", blurb: "Sofas, tables, beds and storage that still have years left." },
  { id: "kitchen", name: "Kitchen", blurb: "Cookware, dining sets and small appliances in working order." },
  { id: "decor", name: "Decor", blurb: "Lamps, rugs, art and the finishing pieces that make a room." },
  { id: "appliances", name: "Appliances", blurb: "Tested washers, fridges and fans — fairly used, fully functional." },
  { id: "bedroom", name: "Bedroom", blurb: "Mattresses, wardrobes, linens and nightstands." },
  { id: "outdoor", name: "Outdoor", blurb: "Patio sets, planters and garden tools ready for another season." }
];

export const CONDITIONS = [
  { id: "like-new", name: "Like new", hint: "Barely used, no visible wear." },
  { id: "excellent", name: "Excellent", hint: "Light wear, fully functional." },
  { id: "good", name: "Good", hint: "Honest use, still neat and solid." },
  { id: "fair", name: "Fair", hint: "Visible wear, priced accordingly." }
];

export const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Enugu", "Accra", "Kumasi"];

export const SEED_SELLERS = [
  { id: "seller-ada", name: "Adaeze Okonkwo", email: "ada@hearthly.demo", phone: "+234 803 441 2290", city: "Lagos", password: "demo1234" },
  { id: "seller-kwame", name: "Kwame Mensah", email: "kwame@hearthly.demo", phone: "+233 24 555 0182", city: "Accra", password: "demo1234" },
  { id: "seller-tunde", name: "Tunde Balogun", email: "tunde@hearthly.demo", phone: "+234 809 220 4411", city: "Ibadan", password: "demo1234" }
];

export const SEED_LISTINGS = [
  { id: "item-sofa-linen", sellerId: "seller-ada", title: "Three-seater linen sofa", category: "furniture", condition: "excellent", price: 185000, city: "Lagos", neighborhood: "Lekki Phase 1", description: "Soft oatmeal linen sofa with deep seats and removable covers. No stains, no sagging. Smoke-free home.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-12T10:00:00.000Z" },
  { id: "item-oak-dining", sellerId: "seller-tunde", title: "Solid oak dining table, seats 6", category: "furniture", condition: "good", price: 120000, city: "Ibadan", neighborhood: "Bodija", description: "Heavy oak table with a warm honey finish. Light surface marks from family dinners.", image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-08T09:00:00.000Z" },
  { id: "item-mixer", sellerId: "seller-ada", title: "Stand mixer in cream enamel", category: "kitchen", condition: "like-new", price: 95000, city: "Lagos", neighborhood: "Ikeja GRA", description: "Used fewer than ten times. Comes with dough hook, whisk and mixing bowl.", image: "https://images.unsplash.com/photo-1570222094114-d054a817e367?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-18T14:00:00.000Z" },
  { id: "item-ceramic-set", sellerId: "seller-kwame", title: "Stoneware dinner set for 8", category: "kitchen", condition: "excellent", price: 42000, city: "Accra", neighborhood: "East Legon", description: "Matte sage plates, bowls and side plates. Two cups have tiny rim chips.", image: "https://images.unsplash.com/photo-1603190287605-4f6598250814?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-04T11:00:00.000Z" },
  { id: "item-floor-lamp", sellerId: "seller-ada", title: "Arc floor lamp with marble base", category: "decor", condition: "excellent", price: 68000, city: "Lagos", neighborhood: "Victoria Island", description: "Brushed brass arc lamp, heavy marble base. Shade is clean.", image: "https://images.unsplash.com/photo-1507473886605-2d92ce1c0d1d?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-15T16:20:00.000Z" },
  { id: "item-wool-rug", sellerId: "seller-kwame", title: "Handwoven wool rug, 200 × 140 cm", category: "decor", condition: "good", price: 75000, city: "Accra", neighborhood: "Osu", description: "Warm terracotta and cream kilim. Professionally cleaned.", image: "https://images.unsplash.com/photo-1600166898405-6c9811286951?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-08-29T08:00:00.000Z" },
  { id: "item-fridge", sellerId: "seller-tunde", title: "Double-door fridge, 340L", category: "appliances", condition: "good", price: 210000, city: "Ibadan", neighborhood: "Ring Road", description: "Runs quietly, cools evenly. Delivery possible within Ibadan.", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-01T12:00:00.000Z" },
  { id: "item-fan", sellerId: "seller-ada", title: "Standing fan with remote", category: "appliances", condition: "like-new", price: 18000, city: "Lagos", neighborhood: "Yaba", description: "Purchased last harmattan, barely used. Oscillates, three speeds, timer works.", image: "https://images.unsplash.com/photo-1565538810643-b5b1b562cd79?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-20T09:30:00.000Z" },
  { id: "item-wardrobe", sellerId: "seller-tunde", title: "Two-door wardrobe with mirror", category: "bedroom", condition: "good", price: 88000, city: "Ibadan", neighborhood: "Akobo", description: "Engineered wood, hanging rail plus two drawers. Disassembles for transport.", image: "https://images.unsplash.com/photo-1556020685-ae41ab6c8571?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-06T15:00:00.000Z" },
  { id: "item-bedding", sellerId: "seller-kwame", title: "King duvet set, washed once", category: "bedroom", condition: "like-new", price: 28000, city: "Accra", neighborhood: "Cantonments", description: "Cotton percale in warm ivory. Includes duvet cover and pillowcases.", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-19T18:00:00.000Z" },
  { id: "item-patio", sellerId: "seller-ada", title: "Teak patio set with cushions", category: "outdoor", condition: "excellent", price: 155000, city: "Lagos", neighborhood: "Ikoyi", description: "Four chairs and a low table. Cushions freshly covered.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-09-10T13:00:00.000Z" },
  { id: "item-planters", sellerId: "seller-kwame", title: "Set of 4 terracotta planters", category: "outdoor", condition: "fair", price: 14000, city: "Accra", neighborhood: "Labone", description: "Classic clay pots, 30–45 cm. Weathered patina.", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=80", status: "available", createdAt: "2026-08-22T10:00:00.000Z" }
];

export const FEATURED_IDS = ["item-sofa-linen", "item-oak-dining", "item-floor-lamp", "item-fridge"];
