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

export const STATES = ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"];

function sorted(list) {
  return [...new Set(list)].sort((a, b) => a.localeCompare(b));
}

export const LOCATIONS = {
  "Akwa Ibom": sorted([
    "Abak", "Eket", "Etinan", "Ewet Housing", "Ibeno", "Ikot Abasi", "Ikot Ekpene",
    "Itu", "Mkpat Enin", "Oron", "Shelter Afrique", "Uyo"
  ]),
  Bayelsa: sorted([
    "Amassoma", "Amarata", "Brass", "Ekeki", "Kpansia", "Nembe", "Ogbia", "Opolo",
    "Sagbama", "Swali", "Yenagoa"
  ]),
  "Cross River": sorted([
    "Akamkpa", "Akpabuyo", "Bekwarra", "Calabar", "Calabar South", "Ikom", "Obudu",
    "Ogoja", "Tinapa", "Ugep"
  ]),
  Delta: sorted([
    "Abraka", "Agbor", "Asaba", "Bomadi", "Burutu", "Effurun", "Ibusa", "Kwale",
    "Ogbe-Ijoh", "Ogwashi-Uku", "Okpanam", "Oleh", "Ozoro", "Patani", "Sapele",
    "Ughelli", "Uvwie", "Warri"
  ]),
  Edo: sorted([
    "1st Ugbor", "2nd Ugbor", "Abudu", "Aduwawa", "Airport Road", "Akpakpava",
    "Amagba", "Auchi", "Benin GRA", "Ehor", "Ekenwan", "Ekpoma", "Evbuotubu",
    "Ewu", "Eyaen", "Idogbo", "Igarra", "Igueben", "Iguosa", "Ikpoba Hill",
    "Irrua", "Mission Road", "New Benin", "Ogheghe", "Okada", "Ologbo", "Oluku",
    "Ring Road", "Sapele Road", "Siluko Road", "Textile Mill Road", "Ubiaja",
    "Ugbowo", "Upper Sakponba", "Uromi", "Uselu", "Useh"
  ]),
  Rivers: sorted([
    "Ahoada", "Bonny", "Bori", "Degema", "Eleme", "Eliozu", "GRA Port Harcourt",
    "Igbo-Etche", "Ikwerre", "Mile 1", "Mile 3", "Obio-Akpor", "Okrika", "Omoku",
    "Oyigbo", "Port Harcourt", "Rumuokoro", "Rumuola", "Rumukwurushi",
    "Trans Amadi", "Woji"
  ])
};

export const CITIES = STATES;

export function locationsFor(state) {
  return LOCATIONS[state] || [];
}

export const MEETUP_SPOTS = {
  "Akwa Ibom": ["Ibom Plaza Uyo", "Shoprite Ibom Plaza", "Eket Roundabout", "Ikot Ekpene Main Park"],
  Bayelsa: ["Swali Market Yenagoa", "Imgbi Road Junction", "Niger Delta University gate"],
  "Cross River": ["Tinapa", "Calabar Marina", "Ikom Market", "Obudu Ranch resort gate"],
  Delta: ["Asaba Shoprite", "Warri Effurun Roundabout", "Sapele Market", "Ughelli Main Park"],
  Edo: [
    "Ring Road / King's Square",
    "Shoprite Aduwawa",
    "UNIBEN Ugbowo gate",
    "Auchi Polytechnic gate",
    "Ekpoma market",
    "Oluku junction"
  ],
  Rivers: ["Port Harcourt Mall", "GRA Junction", "Mile 1 Park", "Trans Amadi"]
};

export const SAFETY_RULES = [
  "Meet in a busy public place, in daylight.",
  "Inspect the item before any money changes hands.",
  "Never send a deposit, transfer, or delivery fee before you have seen the item.",
  "Tell a friend where you are going and when you expect to be back.",
  "If anything feels off, walk away. There will be another listing."
];

export const SEED_USERS = [
  { id: "user-ada", name: "Adaeze Okonkwo", email: "ada@hearthly.demo", phone: "+234 803 441 2290", city: "Edo", password: "demo1234" },
  { id: "user-kwame", name: "Kwame Mensah", email: "kwame@hearthly.demo", phone: "+233 24 555 0182", city: "Rivers", password: "demo1234" },
  { id: "user-tunde", name: "Tunde Balogun", email: "tunde@hearthly.demo", phone: "+234 809 220 4411", city: "Delta", password: "demo1234" },
  { id: "user-amaka", name: "Amaka Eze", email: "amaka@hearthly.demo", phone: "+234 802 118 4402", city: "Edo", password: "demo1234" }
];

export const SEED_LISTINGS = [];
export const SEED_CONVERSATIONS = [];
export const SEED_MESSAGES = [];
export const SEED_REVIEWS = [];
export const FEATURED_IDS = [];
