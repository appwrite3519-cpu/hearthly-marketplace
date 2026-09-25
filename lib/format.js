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

export function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
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
    phones: "Phones & tablets",
    electronics: "Electronics",
    furniture: "Furniture",
    fashion: "Fashion",
    home: "Home & kitchen",
    other: "Other",
    kitchen: "Home & kitchen",
    decor: "Home & kitchen",
    appliances: "Home & kitchen",
    bedroom: "Furniture",
    outdoor: "Furniture"
  };
  return map[id] || id;
}

export function firstName(name) {
  return String(name || "Member").split(" ")[0];
}

export function stars(value) {
  if (value == null) return "New";
  return `${Number(value).toFixed(1)} ★`;
}
