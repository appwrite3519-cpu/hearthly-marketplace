"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SafetyBanner from "@/components/SafetyBanner";
import { MEETUP_SPOTS } from "@/lib/data";
import { categoryLabel, conditionLabel, firstName, formatMoney, stars } from "@/lib/format";
import { addReport, averageRating, getListing, getSession, getUser, openConversation } from "@/lib/store";

export default function ItemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [rating, setRating] = useState(null);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [reported, setReported] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSession(getSession());
    getListing(id)
      .then(async (found) => {
        setItem(found);
        if (found) {
          setSeller(await getUser(found.sellerId));
          setRating(await averageRating(found.sellerId));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
  }, [id]);

  if (!loaded) return <div className="px-5 py-16">Loading listing…</div>;
  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl">Listing not found</h1>
        {error && <p className="mt-3 text-sm text-[#8f4126]">{error}</p>}
        <Link href="/browse" className="mt-6 inline-block text-[#8f4126]">Back to browse</Link>
      </div>
    );
  }

  const spots = MEETUP_SPOTS[item.city] || [];
  const mine = session && session.id === item.sellerId;

  async function startChat() {
    setError("");
    if (!session) {
      router.push(`/login?next=/item/${item.id}`);
      return;
    }
    try {
      const conversationId = await openConversation({ listingId: item.id, buyerId: session.id });
      router.push(`/messages/${conversationId}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function report() {
    if (!session) {
      router.push("/login");
      return;
    }
    await addReport({ fromId: session.id, listingId: item.id, reason: "Reported from listing page" });
    setReported(true);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2">
      <div>
        <img src={item.image} alt={item.title} className="w-full rounded-3xl object-cover" />
        <div className="mt-4"><SafetyBanner /></div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">{categoryLabel(item.category)} · {conditionLabel(item.condition)}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{item.title}</h1>
        <p className="mt-4 text-3xl font-semibold text-[#8f4126]">
          {formatMoney(item.price)}
          {item.negotiable ? <span className="ml-3 text-base font-medium text-[#6b6458]">Negotiable in chat</span> : null}
        </p>
        <p className="mt-2 text-sm text-[#6b6458]">{item.neighborhood ? `${item.neighborhood}, ` : ""}{item.city}{item.status === "sold" ? " · Sold" : " · Available to view"}</p>
        <p className="mt-6 leading-7 text-[#3b362f]">{item.description}</p>
        {seller && (
          <Link href={`/profile/${seller.id}`} className="mt-8 block rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4 hover:border-[#b85c38]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">Seller</p>
            <p className="mt-1 text-lg">{firstName(seller.name)}</p>
            <p className="text-sm text-[#6b6458]">{seller.city} · {stars(rating)}</p>
          </Link>
        )}
        {spots.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Public places people use in {item.city}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {spots.map((spot) => <span key={spot} className="rounded-full bg-[#ece4d6] px-3 py-1 text-xs">{spot}</span>)}
            </div>
          </div>
        )}
        {item.status === "sold" ? (
          <p className="mt-8 rounded-2xl bg-[#ece4d6] px-4 py-3">This item has already been collected.</p>
        ) : mine ? (
          <div className="mt-8 flex gap-2">
            <Link href={`/listings/${item.id}/edit`} className="btn btn-dark">Edit listing</Link>
            <Link href="/dashboard" className="btn btn-ghost">Your listings</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            <button className="btn btn-primary" type="button" onClick={startChat}>Chat to negotiate & meet</button>
            <p className="text-sm text-[#6b6458]">No payment on this site. Agree a price, pick a public place, inspect, then pay the seller yourself.</p>
            {error && <p className="text-sm text-[#8f4126]">{error}</p>}
            <button className="text-xs text-[#6b6458] underline" type="button" onClick={report} disabled={reported}>{reported ? "Report received" : "Report this listing"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
