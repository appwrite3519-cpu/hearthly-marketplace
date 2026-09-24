"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { CATEGORIES, FEATURED_IDS } from "@/lib/data";
import { getListings } from "@/lib/store";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    const all = getListings().filter((i) => i.status !== "hidden");
    setFeatured(all.filter((i) => FEATURED_IDS.includes(i.id)).slice(0, 4));
    setLatest(all.slice(0, 8));
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b85c38]">
            Neat. Fairly used. Ready for another home.
          </p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">
            Household pieces that still have a long life in them.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-7 text-[#6b6458]">
            Hearthly is a marketplace for well-kept furniture, kitchenware,
            appliances and decor. Buyers browse the floor. Sellers run the studio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/browse" className="btn btn-primary">Browse listings</Link>
            <Link href="/seller/register" className="btn btn-dark">Open a seller account</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80" alt="Linen sofa" className="h-64 w-full rounded-3xl object-cover md:h-80" />
          <img src="https://images.unsplash.com/photo-1507473886605-2d92ce1c0d1d?auto=format&fit=crop&w=900&q=80" alt="Floor lamp" className="mt-8 h-64 w-full rounded-3xl object-cover md:h-80" />
        </div>
      </section>

      <section className="border-y border-[#ddd4c6] bg-[#ece4d6]/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-3">
          {[
            ["01", "Sellers join in the studio", "Create an account, then post photos, price, condition and city."],
            ["02", "Listings go live on the floor", "Buyers search by room, city and how gently an item has been used."],
            ["03", "Talk, collect, rehome", "Inquiries land in the seller dashboard. Arrange pickup or delivery yourselves."]
          ].map(([n, t, d]) => (
            <div key={n}>
              <p className="text-xs tracking-[0.2em] text-[#b85c38]">{n}</p>
              <h3 className="mt-2 text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b6458]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6b6458]">Rooms</p>
        <h2 className="mt-1 text-4xl">Shop by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/browse?category=${cat.id}`} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5 hover:border-[#b85c38]">
              <h3 className="text-2xl">{cat.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b6458]">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-4xl">On the floor</h2>
          <Link href="/browse" className="text-sm font-semibold text-[#8f4126]">See all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(featured.length ? featured : latest.slice(0, 4)).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
