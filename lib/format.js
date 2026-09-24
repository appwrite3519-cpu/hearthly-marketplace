export function formatMoney(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function conditionLabel(id) {
  const map = {
    "like-new": "Like new",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair"
  };
  return map[id] || id;
}

export function categoryLabel(id) {
  const map = {
    furniture: "Furniture",
    kitchen: "Kitchen",
    decor: "Decor",
    appliances: "Appliances",
    bedroom: "Bedroom",
    outdoor: "Outdoor"
  };
  return map[id] || id;
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|$)/g, "");
}
