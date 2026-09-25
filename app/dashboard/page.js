"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { firstName, formatMoney } from "@/lib/format";
import {
  conversationsForUser,
  deleteListing,
  getListings,
  getSession,
  getUser,
  logout,
  setListingStatus
} from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);
  const [chats, setChats] = useState([]);
  const [partners, setPartners] = useState({});
  const [error, setError] = useState("");

  async function refresh() {
    const s = getSession();
    if (!s) {
      router.replace("/login?next=/dashboard");
      return;
    }
    setSession(s);
    try {
      const [all, rows] = await Promise.all([
        getListings(),
        conversationsForUser(s.id)
      ]);
      const mine = (all || []).filter((item) => item.sellerId === s.id);
      setListings(mine);
      setChats(rows || []);
      const names = {};
      await Promise.all(
        (rows || []).slice(0, 6).map(async (c) => {
          const otherId = c.buyerId === s.id ? c.sellerId : c.buyerId;
          const other = await getUser(otherId).catch(() => null);
          names[otherId] = other?.name || "Buyer";
        })
      );
      setPartners(names);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load your listings.");
      setListings([]);
      setChats([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(
    () => ({
      live: listings.filter((i) => i.status === "active" || i.status === "available").length,
      sold: listings.filter((i) => i.status === "sold").length,
      chats: chats.length
    }),
    [listings, chats]
  );

  if (!session) return <div className="px-5 py-16">Opening your page…</div>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Your Hearthly</p>
          <h1 className="mt-2 text-4xl">Hello, {firstName(session.name)}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/listings/new" className="btn btn-primary">Post an item</Link>
          <Link href="/messages" className="btn btn-ghost">Open chats</Link>
          <button className="btn btn-ghost" onClick={() => { logout(); router.push("/"); }}>Sign out</button>
        </div>
      </div>
      {error && <p className="mt-6 text-[#8f4126]">{error}</p>}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[["Live listings", stats.live], ["Sold", stats.sold], ["Open chats", stats.chats]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">{label}</p>
            <p className="mt-2 text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-3xl">Your listings</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#ddd4c6] bg-[#fffdf8]">
          {listings.length === 0 && <p className="p-6 text-[#6b6458]">Nothing posted yet. List something people can come and see.</p>}
          {listings.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-4 border-b border-[#eee6d8] p-4 last:border-0">
              <img src={item.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
              <div className="min-w-48 flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[#6b6458]">{formatMoney(item.price)} · {item.status === "available" ? "active" : item.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/item/${item.id}`} className="btn btn-ghost text-sm">View</Link>
                <Link href={`/listings/${item.id}/edit`} className="btn btn-ghost text-sm">Edit</Link>
                {item.status !== "sold" && (
                  <button className="btn btn-ghost text-sm" onClick={async () => { await setListingStatus(item.id, session.id, "sold"); refresh(); }}>
                    Mark sold
                  </button>
                )}
                {item.status === "sold" && (
                  <button className="btn btn-ghost text-sm" onClick={async () => { await setListingStatus(item.id, session.id, "active"); refresh(); }}>
                    Relist
                  </button>
                )}
                <button className="btn btn-ghost text-sm text-[#8f4126]" onClick={async () => { if (confirm("Remove this listing?")) { await deleteListing(item.id, session.id); refresh(); } }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-3xl">Recent chats</h2>
        <div className="mt-4 space-y-3">
          {chats.length === 0 && <p className="text-[#6b6458]">No chats yet. They appear when someone messages a listing.</p>}
          {chats.slice(0, 6).map((c) => {
            const listing = listings.find((l) => l.id === c.listingId);
            const otherId = c.buyerId === session.id ? c.sellerId : c.buyerId;
            return (
              <Link key={c.id} href={`/messages/${c.id}`} className="block rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5 hover:border-[#b85c38]">
                <p className="font-medium">{listing?.title || "Listing"}</p>
                <p className="text-sm text-[#6b6458]">
                  With {firstName(partners[otherId])} {c.meetupPlace ? `· Meet at ${c.meetupPlace}` : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
