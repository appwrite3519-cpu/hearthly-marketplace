"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/data";
import { getListings } from "@/lib/store";

function BrowseInner() {
  const params = useSearchParams();
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [city, setCity] = useState("all");
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => { setListings(getListings()); }, []);
  useEffect(() => {
    const fromUrl = params.get("category");
    if (fromUrl) setCategory(fromUrl);
  }, [params]);

  const filtered = useMemo(() => {
    let rows = listings.filter((item) => item.status !== "hidden");
    if (category !== "all") rows = rows.filter((i) => i.category === category);
    if (city !== "all") rows = rows.filter((i) => i.city === city);
    if (condition !== "all") rows = rows.filter((i) => i.condition === condition);
    if (q.trim()) {
      const needle = q.toLowerCase();
      rows = rows.filter((i) => i.title.toLowerCase().includes(needle) || i.description.toLowerCase().includes(needle));
    }
    return [...rows].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [listings, q, category, city, condition, sort]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#6b6458]">Marketplace</p>
      <h1 className="mt-2 text-5xl">Browse household finds</h1>
      <p className="mt-3 max-w-2xl text-[#6b6458]">Filter by room, city and condition. Every listing is posted by a seller from the Hearthly studio.</p>
      <div className="mt-8 grid gap-3 rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4 md:grid-cols-5">
        <input className="field md:col-span-2" placeholder="Search sofas, mixers, rugs…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="field" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="all">All cities</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="field" value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="all">Any condition</option>
          {CONDITIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[#6b6458]">{filtered.length} listings</p>
        <select className="field max-w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
      {filtered.length === 0 && <p className="mt-16 text-center text-[#6b6458]">No items match those filters yet.</p>}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="px-5 py-16">Loading listings…</div>}>
      <BrowseInner />
    </Suspense>
  );
}
