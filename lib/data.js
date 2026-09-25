export const CATEGORIES = [
  { id: "phones", name: "Phones & tablets", blurb: "Handsets, tablets and accessories you can inspect before you pay." },
  { id: "electronics", name: "Electronics", blurb: "TVs, laptops, consoles and gadgets — test them at the meetup." },
  { id: "furniture", name: "Furniture", blurb: "Sofas, tables, beds and storage ready for another home." },
  { id: "fashion", name: "Fashion", blurb: "Clothes, shoes and bags. Try on when you meet." },
  { id: "home", name: "Home & kitchen", blurb: "Appliances, cookware and household pieces." },
  { id: "other", name: "Other", blurb: "Anything honest, local, and worth a public meetup." }
];

export const CONDITIONS = [
  { id: "like-new", name: "Like new", hint: "Barely used, no visible wear." },
  { id: "excellent", name: "Excellent", hint: "Light wear, fully functional." },
  { id: "good", name: "Good", hint: "Honest use, still solid." },
  { id: "fair", name: "Fair", hint: "Visible wear, priced accordingly." }
];

export const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City", "Enugu", "Accra", "Kumasi"];

export const MEETUP_SPOTS = {
  Lagos: ["Shoprite Ikeja", "Ikeja City Mall", "The Palms Lekki", "CMS / Tafawa Balewa Square", "Yaba Tech gate"],
  Abuja: ["Jabi Lake Mall", "Next Time Ceddi Plaza", "Wuse Market frontage", "Unity Fountain"],
  "Port Harcourt": ["Port Harcourt Mall", "GRA Junction", "Milestone"],
  Ibadan: ["Shoprite Challenge", "Bodija Market entrance", "UI main gate"],
  "Benin City": ["Ring Road / King's Square", "Shoprite Aduwawa"],
  Enugu: ["Shoprite Enugu", "Okpara Square"],
  Accra: ["Accra Mall", "Osu Oxford Street", "Kaneshie Market front"],
  Kumasi: ["Kumasi City Mall", "Kejetia entrance"]
};

export const SAFETY_RULES = [
  "Meet in a busy public place, in daylight.",
  "Inspect the item before any money changes hands.",
  "Never send a deposit, transfer, or delivery fee before you have seen the item.",
  "Tell a friend where you are going and when you expect to be back.",
  "If anything feels off, walk away. There will be another listing."
];

export const SEED_USERS = [
  { id: "user-ada", name: "Adaeze Okonkwo", email: "ada@hearthly.demo", phone: "+234 803 441 2290", city: "Lagos", password: "demo1234" },
  { id: "user-kwame", name: "Kwame Mensah", email: "kwame@hearthly.demo", phone: "+233 24 555 0182", city: "Accra", password: "demo1234" },
  { id: "user-tunde", name: "Tunde Balogun", email: "tunde@hearthly.demo", phone: "+234 809 220 4411", city: "Ibadan", password: "demo1234" },
  { id: "user-amaka", name: "Amaka Eze", email: "amaka@hearthly.demo", phone: "+234 802 118 4402", city: "Lagos", password: "demo1234" }
];

export const SEED_LISTINGS = [
  { id: "item-sofa-linen", sellerId: "user-ada", title: "Three-seater linen sofa", category: "furniture", condition: "excellent", price: 185000, negotiable: true, city: "Lagos", neighborhood: "Lekki Phase 1", description: "Soft oatmeal linen sofa with deep seats and removable covers. No stains, no sagging. Smoke-free home. Happy to meet at The Palms Lekki so you can sit on it before you decide.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-12T10:00:00.000Z" },
  { id: "item-oak-dining", sellerId: "user-tunde", title: "Solid oak dining table, seats 6", category: "furniture", condition: "good", price: 120000, negotiable: true, city: "Ibadan", neighborhood: "Bodija", description: "Heavy oak table with a warm honey finish. Light surface marks from family dinners. Come see it at Shoprite Challenge — bring a tape if you need exact measurements.", image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-08T09:00:00.000Z" },
  { id: "item-mixer", sellerId: "user-ada", title: "Stand mixer in cream enamel", category: "home", condition: "like-new", price: 95000, negotiable: false, city: "Lagos", neighborhood: "Ikeja GRA", description: "Used fewer than ten times. Comes with dough hook, whisk and mixing bowl. We can meet at Shoprite Ikeja. Test it there if you like.", image: "https://images.unsplash.com/photo-1570222094114-d054a817e367?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-18T14:00:00.000Z" },
  { id: "item-phone", sellerId: "user-kwame", title: "Used Android phone, 128GB", category: "phones", condition: "good", price: 145000, negotiable: true, city: "Accra", neighborhood: "Osu", description: "Battery health is fine, screen has a light scratch near the top. IMEI clean. Meet at Accra Mall — check it yourself before you pay.", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-16T11:00:00.000Z" },
  { id: "item-floor-lamp", sellerId: "user-ada", title: "Arc floor lamp with marble base", category: "home", condition: "excellent", price: 68000, negotiable: true, city: "Lagos", neighborhood: "Victoria Island", description: "Brushed brass arc lamp, heavy marble base. Shade is clean. Daytime meetup preferred.", image: "https://images.unsplash.com/photo-1507473886605-2d92ce1c0d1d?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-15T16:20:00.000Z" },
  { id: "item-wool-rug", sellerId: "user-kwame", title: "Handwoven wool rug, 200 × 140 cm", category: "home", condition: "good", price: 75000, negotiable: true, city: "Accra", neighborhood: "Osu", description: "Warm terracotta and cream kilim. Professionally cleaned. Roll it out when we meet.", image: "https://images.unsplash.com/photo-1600166898405-6c9811286951?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-08-29T08:00:00.000Z" },
  { id: "item-laptop", sellerId: "user-tunde", title: "14-inch laptop, 16GB RAM", category: "electronics", condition: "good", price: 310000, negotiable: true, city: "Ibadan", neighborhood: "Ring Road", description: "Office laptop, no charger dongle missing. Come with a USB stick if you want to test ports. Meetup at Shoprite Challenge.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-01T12:00:00.000Z" },
  { id: "item-fan", sellerId: "user-ada", title: "Standing fan with remote", category: "home", condition: "like-new", price: 18000, negotiable: true, city: "Lagos", neighborhood: "Yaba", description: "Purchased last harmattan, barely used. Oscillates, three speeds, timer works. Easy to carry to Yaba Tech gate.", image: "https://images.unsplash.com/photo-1565538810643-b5b1b562cd79?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-20T09:30:00.000Z" },
  { id: "item-wardrobe", sellerId: "user-tunde", title: "Two-door wardrobe with mirror", category: "furniture", condition: "good", price: 88000, negotiable: true, city: "Ibadan", neighborhood: "Akobo", description: "Engineered wood, hanging rail plus two drawers. Disassembles for transport. Inspect first, pay after.", image: "https://images.unsplash.com/photo-1556020685-ae41ab6c8571?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-06T15:00:00.000Z" },
  { id: "item-sneakers", sellerId: "user-amaka", title: "White sneakers, UK 42", category: "fashion", condition: "excellent", price: 22000, negotiable: true, city: "Lagos", neighborhood: "Surulere", description: "Worn a handful of times. Meet at Shoprite Ikeja so you can try them on.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-21T10:00:00.000Z" },
  { id: "item-patio", sellerId: "user-ada", title: "Teak patio set with cushions", category: "furniture", condition: "excellent", price: 155000, negotiable: false, city: "Lagos", neighborhood: "Ikoyi", description: "Four chairs and a low table. Cushions freshly covered. Large item — agree a public spot first, then collect.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-10T13:00:00.000Z" },
  { id: "item-console", sellerId: "user-kwame", title: "Games console + two pads", category: "electronics", condition: "good", price: 195000, negotiable: true, city: "Accra", neighborhood: "East Legon", description: "HDMI and power included. We can plug it in at Accra Mall food court if staff allow, or check serials there.", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=80", status: "active", createdAt: "2026-09-14T17:00:00.000Z" }
];

export const SEED_CONVERSATIONS = [
  {
    id: "convo-1",
    listingId: "item-mixer",
    buyerId: "user-amaka",
    sellerId: "user-ada",
    meetupPlace: "Shoprite Ikeja",
    meetupTime: "Sunday 3pm",
    createdAt: "2026-09-21T08:00:00.000Z"
  }
];

export const SEED_MESSAGES = [
  { id: "msg-1", conversationId: "convo-1", senderId: "user-amaka", kind: "text", text: "Hi Ada, is the mixer still available? Would you take 85k?", createdAt: "2026-09-21T08:01:00.000Z" },
  { id: "msg-2", conversationId: "convo-1", senderId: "user-ada", kind: "text", text: "It's available. I can do 90k if we meet this weekend.", createdAt: "2026-09-21T08:12:00.000Z" },
  { id: "msg-3", conversationId: "convo-1", senderId: "user-amaka", kind: "meetup", text: "Shoprite Ikeja, Sunday 3pm?", createdAt: "2026-09-21T08:20:00.000Z" },
  { id: "msg-4", conversationId: "convo-1", senderId: "user-ada", kind: "text", text: "Perfect. I'll be at the main entrance with the mixer in the box. Inspect it, then we settle.", createdAt: "2026-09-21T08:24:00.000Z" }
];

export const SEED_REVIEWS = [
  { id: "rev-1", fromId: "user-tunde", toId: "user-ada", listingId: "item-fan", rating: 5, comment: "Showed up on time at Yaba. Fan worked. Fair person.", createdAt: "2026-09-11T18:00:00.000Z" }
];

export const FEATURED_IDS = ["item-sofa-linen", "item-phone", "item-mixer", "item-sneakers"];
