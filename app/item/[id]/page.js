"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { categoryLabel, conditionLabel, formatMoney } from "@/lib/format";
import { addInquiry, getListing, getSeller } from "@/lib/store";

export default function ItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const found = getListing(id);
    setItem(found);
    if (found) setSeller(getSeller(found.sellerId));
  }, [id]);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl">Listing not found</h1>
        <Link href="/browse" className="mt-6 inline-block text-[#8f4126]">Back to browse</Link>
      </div>
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Name, email and a short message are required.");
      return;
    }
    addInquiry({
      listingId: item.id,
      listingTitle: item.title,
      sellerId: item.sellerId,
      buyerName: form.name,
      buyerEmail: form.email,
      buyerPhone: form.phone,
      message: form.message
    });
    setSent(true);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-2">
      <img src={item.image} alt={item.title} className="w-full rounded-3xl object-cover" />
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">{categoryLabel(item.category)} · {conditionLabel(item.condition)}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{item.title}</h1>
        <p className="mt-4 text-3xl font-semibold text-[#8f4126]">{formatMoney(item.price)}</p>
        <p className="mt-2 text-sm text-[#6b6458]">{item.neighborhood ? `${item.neighborhood}, ` : ""}{item.city}{item.status === "sold" ? " · Sold" : " · Available"}</p>
        <p className="mt-6 leading-7 text-[#3b362f]">{item.description}</p>
        {seller && (
          <div className="mt-8 rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">Seller</p>
            <p className="mt-1 text-lg">{seller.name}</p>
            <p className="text-sm text-[#6b6458]">{seller.city}</p>
          </div>
        )}
        {item.status === "sold" ? (
          <p className="mt-8 rounded-2xl bg-[#ece4d6] px-4 py-3">This piece has already found a home.</p>
        ) : sent ? (
          <p className="mt-8 rounded-2xl bg-[#3f4a3a] px-4 py-4 text-[#f4efe6]">Message sent. The seller will see it in their studio.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <h2 className="text-2xl">Ask about this item</h2>
            <input className="field" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="field" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea className="field min-h-28" placeholder="When can you collect? Any questions?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {error && <p className="text-sm text-[#8f4126]">{error}</p>}
            <button className="btn btn-primary" type="submit">Send message</button>
          </form>
        )}
      </div>
    </div>
  );
}
