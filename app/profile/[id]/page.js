"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { firstName, formatDate, stars } from "@/lib/format";
import { averageRating, getListings, getUser, reviewsForUser } from "@/lib/store";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [authors, setAuthors] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [found, all, rows, avg] = await Promise.all([
          getUser(id),
          getListings(),
          reviewsForUser(id),
          averageRating(id)
        ]);
        setUser(found);
        setListings((all || []).filter((item) => item.sellerId === id && item.status !== "hidden"));
        setReviews(rows || []);
        setRating(avg);
        const names = {};
        await Promise.all(
          (rows || []).map(async (row) => {
            const from = await getUser(row.fromId).catch(() => null);
            names[row.fromId] = from?.name || "Member";
          })
        );
        setAuthors(names);
      } catch {
        setUser(null);
      } finally {
        setLoaded(true);
      }
    })();
  }, [id]);

  if (!loaded) return <div className="px-5 py-16">Loading profile…</div>;

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl">Profile not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Member</p>
      <h1 className="mt-2 text-5xl">{firstName(user.name)}</h1>
      <p className="mt-3 text-[#6b6458]">{user.city} · {stars(rating)} · {reviews.length} rating{reviews.length === 1 ? "" : "s"}</p>
      <section className="mt-10">
        <h2 className="text-3xl">Listings</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
        {listings.length === 0 && <p className="mt-4 text-[#6b6458]">No public listings right now.</p>}
      </section>
      <section className="mt-12">
        <h2 className="text-3xl">Ratings after meetups</h2>
        <div className="mt-4 space-y-3">
          {reviews.length === 0 && <p className="text-[#6b6458]">No ratings yet.</p>}
          {reviews.map((row) => (
            <article key={row.id} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5">
              <p className="text-sm text-[#6b6458]">{stars(row.rating)} · {firstName(authors[row.fromId])} · {formatDate(row.createdAt)}</p>
              <p className="mt-2">{row.comment}</p>
            </article>
          ))}
        </div>
      </section>
      <Link href="/browse" className="mt-10 inline-block text-sm text-[#8f4126]">Back to listings →</Link>
    </div>
  );
}
