"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import { CATEGORIES } from "@/lib/data";
import { getListings, getSession } from "@/lib/store";

const CHIPS = [
  { id: "all", label: "All" },
  { id: "new", label: "Newly listed" },
  { id: "negotiable", label: "Negotiable" },
  { id: "nearby", label: "Nearby" }
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [chip, setChip] = useState("all");
  const [listings, setListings] = useState([]);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setSession(getSession());
    getListings()
      .then((rows) => setListings(rows.filter((item) => item.status !== "hidden")))
      .catch((err) => setError(err.message));
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "all") params.set("category", category);
    router.push(params.toString() ? `/browse?${params}` : "/browse");
  }

  const feed = useMemo(() => {
    let rows = listings.filter((item) => item.status !== "sold");
    if (category !== "all") rows = rows.filter((item) => item.category === category);
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      rows = rows.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.description.toLowerCase().includes(needle) ||
          (item.neighborhood || "").toLowerCase().includes(needle) ||
          item.city.toLowerCase().includes(needle)
      );
    }
    if (chip === "negotiable") rows = rows.filter((item) => item.negotiable);
    if (chip === "nearby" && session?.id) {
      const city = session.city || listings.find((item) => item.sellerId === session.id)?.city;
      if (city) rows = rows.filter((item) => item.city === city);
    }
    if (chip === "new") {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      rows = rows.filter((item) => new Date(item.createdAt).getTime() >= weekAgo);
    }
    return [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [listings, category, chip, query, session]);

  return (
    <div className="bg-[#fffdf8]">
      <div className="sticky top-[57px] z-30 border-b border-[#eee6d8] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <form onSubmit={submitSearch} className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-full border border-[#1c1914] bg-white px-4 py-2.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sofas, phones, mixers…"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#9a9388]"
                aria-label="Search listings"
              />
            </div>
            <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1c1914] text-white" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
            </button>
          </form>
        </div>
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 pb-2 text-[15px] font-medium text-[#8a8378]">
          <button type="button" onClick={() => setCategory("all")} className={`shrink-0 pb-2 ${category === "all" ? "border-b-2 border-[#1c1914] text-[#1c1914]" : ""}`}>All</button>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`shrink-0 pb-2 ${category === cat.id ? "border-b-2 border-[#1c1914] text-[#1c1914]" : ""}`}>{cat.name}</button>
          ))}
        </div>
      </div>
      <div className="bg-[#f8e6d4] text-[#5a3a28]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-x-auto px-4 py-2.5 text-[13px] font-medium">
          <p className="flex min-w-0 items-center gap-4 whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5"><span className="text-[#2f7a3a]">✓</span> Meet in a public place</span>
            <span className="text-[#d7b89a]">|</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-[#2f7a3a]">✓</span> Inspect first, pay in person</span>
          </p>
          <Link href="/safety" className="shrink-0 text-[#8f4126]">Rules ›</Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-3">
        <div className="no-scrollbar flex gap-5 overflow-x-auto text-[14px] font-medium text-[#8a8378]">
          {CHIPS.map((item) => (
            <button key={item.id} type="button" onClick={() => setChip(item.id)} className={`shrink-0 pb-2 ${chip === item.id ? "border-b-2 border-[#1c1914] text-[#1c1914]" : ""}`}>{item.label}</button>
          ))}
        </div>
      </div>
      <section className="mx-auto max-w-6xl px-3 pb-16 pt-3 sm:px-4">
        {error ? (
          <p className="px-2 py-16 text-center text-[#8f4126]">{error}</p>
        ) : feed.length === 0 ? (
          <p className="px-2 py-16 text-center text-[#6b6458]">
            No listings match that search yet.{" "}
            <Link href="/listings/new" className="font-semibold text-[#8f4126]">Post one</Link>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {feed.map((item) => <ItemCard key={item.id} item={item} compact />)}
          </div>
        )}
      </section>
    </div>
  );
}
