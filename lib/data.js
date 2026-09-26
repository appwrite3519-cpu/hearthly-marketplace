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

export const STATES = [
  "Akwa Ibom",
  "Anambra",
  "Bayelsa",
  "Cross River",
  "Delta",
  "Edo",
  "Imo",
  "Lagos",
  "Port Harcourt",
  "Rivers"
];

function sorted(list) {
  return [...new Set(list)].sort((a, b) => a.localeCompare(b));
}

export function stateLabel(state) {
  return state === "Port Harcourt" ? "Port Harcourt" : `${state} State`;
}

export const LOCATIONS = {
  "Akwa Ibom": sorted([
    "Abak", "Eket", "Etinan", "Ewet Housing", "Ibeno", "Ikot Abasi", "Ikot Ekpene",
    "Itu", "Mkpat Enin", "Oron", "Shelter Afrique", "Uyo"
  ]),
  Anambra: sorted([
    "Abagana", "Agu-Awka", "Amawbia", "Awka", "Ekwulobia", "Ihiala", "Nkpor",
    "Nnewi", "Obosi", "Ogidi", "Okpuno", "Onitsha", "Umunze"
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
    "1st Ugbor", "2nd Ugbor", "19th Street", "Abudu", "Aduwawa", "Agbor Park",
    "Airport Road", "Akpakpava", "Amagba", "Auchi", "Benin GRA",
    "BIU Lagacy Campus", "BIU Ugbor", "Countryhome road", "Egba, Auchi Road",
    "Egba, Upper Sakponba", "Egor", "Ehor", "Ekenwan", "Ekosodin", "Ekpoma",
    "Erediauwa, Upper/Sapele road", "Evbuotubu", "Evidence", "Ewu", "Eyaen",
    "Idogbo", "Igarra", "Igueben", "Iguosa", "Ikpoba Hill", "Irrua", "J Charles",
    "Mission Road", "New Benin", "Obe, Sapele Road", "Ogheghe",
    "Ogheghe, Sapele road", "Ogheghe, Siluko Road", "Okada",
    "Okhun Road, Seven up", "Ologbo", "Oluku", "Ramat Park", "Ring Road",
    "Sakponba", "Sapele Road", "Satana Market", "Siluko Road", "Textile Mill Road",
    "Ubiaja", "Ugbowo", "Uniben Maingate", "Upper Mission",
    "Upper Mission Extention", "Upper Sakponba", "Uromi", "Uselu",
    "Uselu Market", "Useh", "Winners, Sapele Road"
  ]),
  Imo: sorted([
    "Control", "Ikenegbu", "Mbaise", "Mbaitoli", "New Owerri", "Oguta", "Okigwe",
    "Orlu", "Owerri", "Wetheral", "Works Layout", "World Bank"
  ]),
  Lagos: sorted([
    "Abule Egba", "Agege", "Ajah", "Ajegunle", "Alimosho", "Apapa", "Badagry",
    "Chevron", "Egbeda", "Epe", "Festac", "Gbagada", "Iba", "Igando", "Ikeja",
    "Ikorodu", "Ikoyi", "Isolo", "Iyana Ipaja", "Jakande", "Ketu", "Lagos Island",
    "Lekki", "Magodo", "Maryland", "Mile 2", "Mushin", "Ogba", "Ojodu", "Ojo",
    "Oshodi", "Sangotedo", "Satellite Town", "Surulere", "VGC", "Victoria Island",
    "Yaba"
  ]),
  "Port Harcourt": sorted([
    "Ada George", "Eleme", "Eliozu", "GRA Port Harcourt", "Mile 1", "Mile 3",
    "New GRA", "Obio-Akpor", "Old GRA", "Rukpokwu", "Rumuigbo", "Rumuokoro",
    "Rumuola", "Rumukwurushi", "Trans Amadi", "Woji"
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
  Anambra: ["Onitsha Main Market front", "Awka Eke Awka", "Nnewi Nkwo Market", "Roban Stores Awka"],
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
  Imo: ["Owerri Control Post", "Douglas Road junction", "Orlu Main Park", "Okigwe Roundabout"],
  Lagos: ["Shoprite Ikeja", "Ikeja City Mall", "The Palms Lekki", "CMS / Tafawa Balewa Square", "Yaba Tech gate"],
  "Port Harcourt": ["Port Harcourt Mall", "GRA Junction", "Mile 1 Park", "Trans Amadi"],
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
