"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firstName } from "@/lib/format";
import {
  conversationsForUser,
  getListing,
  getSession,
  getUser,
  lastMessagePreview
} from "@/lib/store";

export default function MessagesPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login?next=/messages");
      return;
    }
    setSession(s);
    (async () => {
      try {
        const chats = await conversationsForUser(s.id);
        const hydrated = await Promise.all(
          (chats || []).map(async (c) => {
            const [listing, other, last] = await Promise.all([
              getListing(c.listingId).catch(() => null),
              getUser(c.buyerId === s.id ? c.sellerId : c.buyerId).catch(() => null),
              lastMessagePreview(c.id).catch(() => null)
            ]);
            return { ...c, listing, other, last };
          })
        );
        setRows(hydrated);
        setError("");
      } catch (err) {
        setError(err.message || "Could not load chats.");
        setRows([]);
      }
    })();
  }, [router]);

  if (!session) return <div className="px-5 py-16">Loading chats…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.18em] text-[#b85c38]">Inbox</p>
      <h1 className="mt-2 text-4xl">Chats</h1>
      <p className="mt-3 text-[#6b6458]">Negotiate here. Suggest a public meetup. Do not send money before you have seen the item.</p>
      {error && <p className="mt-4 text-[#8f4126]">{error}</p>}
      <div className="mt-8 space-y-3">
        {rows.length === 0 && !error && <p className="text-[#6b6458]">No conversations yet.</p>}
        {rows.map((c) => (
          <Link key={c.id} href={`/messages/${c.id}`} className="flex gap-4 rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4 hover:border-[#b85c38]">
            <img src={c.listing?.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.listing?.title || "Listing"}</p>
              <p className="text-sm text-[#6b6458]">{firstName(c.other?.name)} · {c.meetupPlace || "No meetup set"}</p>
              <p className="truncate text-sm text-[#3b362f]">{c.last?.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
