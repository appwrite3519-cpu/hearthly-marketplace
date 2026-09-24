"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";
import { deleteListing, getInquiries, getListings, getSession, logout, setListingStatus } from "@/lib/store";

export default function SellerDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  function refresh() {
    const s = getSession();
    if (!s) { router.replace("/seller/login"); return; }
    setSession(s);
    setListings(getListings().filter((i) => i.sellerId === s.id));
    setInquiries(getInquiries().filter((i) => i.sellerId === s.id));
  }

  useEffect(() => { refresh(); }, []);

  const stats = useMemo(() => ({
    live: listings.filter((i) => i.status === "available").length,
    sold: listings.filter((i) => i.status === "sold").length,
    messages: inquiries.length
  }), [listings, inquiries]);

  if (!session) return <div className="px-5 py-16">Opening studio…</div>;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Seller studio</p>
          <h1 className="mt-2 text-4xl">Hello, {session.name.split(" ")[0]}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/listings/new" className="btn btn-primary">Post an item</Link>
          <button className="btn btn-ghost" onClick={() => { logout(); router.push("/"); }}>Sign out</button>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[["Live listings", stats.live], ["Sold", stats.sold], ["Buyer messages", stats.messages]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">{label}</p>
            <p className="mt-2 text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-3xl">Your listings</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#ddd4c6] bg-[#fffdf8]">
          {listings.length === 0 && <p className="p-6 text-[#6b6458]">No listings yet. Post your first household item.</p>}
          {listings.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-4 border-b border-[#eee6d8] p-4 last:border-0">
              <img src={item.image} alt="" className="h-16 w-20 rounded-lg object-cover" />
              <div className="min-w-48 flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[#6b6458]">{formatMoney(item.price)} · {item.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/item/${item.id}`} className="btn btn-ghost text-sm">View</Link>
                <Link href={`/seller/listings/${item.id}/edit`} className="btn btn-ghost text-sm">Edit</Link>
                {item.status !== "sold" && <button className="btn btn-ghost text-sm" onClick={() => { setListingStatus(item.id, session.id, "sold"); refresh(); }}>Mark sold</button>}
                {item.status === "sold" && <button className="btn btn-ghost text-sm" onClick={() => { setListingStatus(item.id, session.id, "available"); refresh(); }}>Relist</button>}
                <button className="btn btn-ghost text-sm text-[#8f4126]" onClick={() => { if (confirm("Remove this listing?")) { deleteListing(item.id, session.id); refresh(); } }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="text-3xl">Buyer messages</h2>
        <div className="mt-4 space-y-3">
          {inquiries.length === 0 && <p className="text-[#6b6458]">No messages yet.</p>}
          {inquiries.map((row) => (
            <article key={row.id} className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-5">
              <p className="text-sm text-[#6b6458]">{row.buyerName} · {row.buyerEmail} · about {row.listingTitle}</p>
              <p className="mt-2">{row.message}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
