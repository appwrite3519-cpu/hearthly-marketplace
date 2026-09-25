"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryLabel, conditionLabel, firstName, formatMoney } from "@/lib/format";
import { averageRating, getUser } from "@/lib/store";

export default function ItemCard({ item, compact = false }) {
  const sold = item.status === "sold";
  const [seller, setSeller] = useState(null);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    setSeller(getUser(item.sellerId));
    setRating(averageRating(item.sellerId));
  }, [item.sellerId]);

  if (compact) {
    return (
      <article className="overflow-hidden rounded-xl bg-white shadow-[0_1px_8px_rgba(28,25,20,0.06)]">
        <Link href={`/item/${item.id}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#ece4d6]">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            {sold && (
              <span className="absolute right-2 top-2 rounded-full bg-[#1c1914] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Sold
              </span>
            )}
          </div>
        </Link>
        <div className="p-2.5 pb-3">
          <Link href={`/item/${item.id}`} className="block">
            <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-5 text-[#1c1914]">
              {item.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-[11px] text-[#6b6458]">
              {conditionLabel(item.condition)} · {item.city}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#6b6458]">
              <span className="tracking-tight text-[#f0a000]">★★★★★</span>
              <span>{rating ? rating.toFixed(1) : "New"}</span>
              <span className="text-[#c9c2b6]">·</span>
              <span className="truncate">{firstName(seller?.name) || "Seller"}</span>
            </div>
          </Link>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-[15px] font-semibold leading-none text-[#e05a00]">
                {formatMoney(item.price)}
              </p>
              {item.negotiable ? (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-[#8a8378]">
                  Negotiable
                </p>
              ) : null}
            </div>
            <Link
              href={`/item/${item.id}`}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#ddd4c6] text-[#1c1914]"
              aria-label={`Open ${item.title}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <Link
      href={`/item/${item.id}`}
      className="group overflow-hidden rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] shadow-[0_8px_30px_rgba(28,25,20,0.04)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#ece4d6]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffdf8]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
          {conditionLabel(item.condition)}
        </span>
        {sold && (
          <span className="absolute right-3 top-3 rounded-full bg-[#1c1914] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Sold
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b6458]">
          {categoryLabel(item.category)} · {item.city}
        </p>
        <h3 className="mt-1 text-lg leading-snug">{item.title}</h3>
        <p className="mt-2 font-semibold text-[#8f4126]">
          {formatMoney(item.price)}
          {item.negotiable ? <span className="ml-2 text-xs font-medium text-[#6b6458]">Negotiable</span> : null}
        </p>
      </div>
    </Link>
  );
}
