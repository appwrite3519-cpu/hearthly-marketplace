"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/data";
import { getListing, getSession, saveListing } from "@/lib/store";

const EMPTY = {
  title: "",
  category: "home",
  condition: "excellent",
  price: "",
  negotiable: true,
  city: "Lagos",
  neighborhood: "",
  image: "",
  description: ""
};

export default function ListingForm({ listingId }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    if (listingId) {
      const existing = getListing(listingId);
      if (!existing || existing.sellerId !== s.id) {
        router.replace("/dashboard");
        return;
      }
      setForm({
        title: existing.title,
        category: existing.category,
        condition: existing.condition,
        price: existing.price,
        negotiable: Boolean(existing.negotiable),
        city: existing.city,
        neighborhood: existing.neighborhood || "",
        image: existing.image,
        description: existing.description
      });
    }
  }, [listingId, router]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.description) {
      setError("Title, asking price and description are required.");
      return;
    }
    const image =
      form.image.trim() ||
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80";
    const id = saveListing(
      {
        id: listingId,
        ...form,
        price: Number(form.price),
        image,
        status: listingId ? getListing(listingId)?.status || "active" : "active"
      },
      session.id
    );
    router.push(`/item/${id}`);
  }

  if (!session) return <div className="px-5 py-16">Loading form…</div>;

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4 px-5 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Post locally</p>
      <h1 className="text-4xl">{listingId ? "Edit listing" : "Post an item"}</h1>
      <p className="text-sm text-[#6b6458]">
        Buyers will chat with you, then you pick a public place to meet. No checkout on Hearthly.
      </p>
      <input className="field" placeholder="Title" value={form.title} onChange={(e) => set("title", e.target.value)} />
      <div className="grid gap-3 md:grid-cols-2">
        <select className="field" value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="field" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
          {CONDITIONS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input className="field" type="number" min="0" placeholder="Asking price (NGN)" value={form.price} onChange={(e) => set("price", e.target.value)} />
        <select className="field" value={form.city} onChange={(e) => set("city", e.target.value)}>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-[#3b362f]">
        <input type="checkbox" checked={form.negotiable} onChange={(e) => set("negotiable", e.target.checked)} />
        Price is negotiable in chat
      </label>
      <input className="field" placeholder="Area / neighbourhood" value={form.neighborhood} onChange={(e) => set("neighborhood", e.target.value)} />
      <input className="field" placeholder="Photo URL" value={form.image} onChange={(e) => set("image", e.target.value)} />
      <textarea
        className="field min-h-36"
        placeholder="Honest description: wear, what is included, and a public place you are happy to meet."
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      {error && <p className="text-sm text-[#8f4126]">{error}</p>}
      <button className="btn btn-primary" type="submit">{listingId ? "Save changes" : "Publish listing"}</button>
    </form>
  );
}
