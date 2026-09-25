"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { firstName, formatChatTime } from "@/lib/format";
import {
  conversationsForUser,
  getListing,
  getSession,
  getUser,
  messagesForConversation,
  unreadCountForMessages
} from "@/lib/store";

async function loadInbox(userId) {
  const chats = await conversationsForUser(userId);
  const hydrated = await Promise.all(
    (chats || []).map(async (c) => {
      const [listing, other, messages] = await Promise.all([
        getListing(c.listingId).catch(() => null),
        getUser(c.buyerId === userId ? c.sellerId : c.buyerId).catch(() => null),
        messagesForConversation(c.id).catch(() => [])
      ]);
      const last = (messages || [])[messages.length - 1] || null;
      return {
        ...c,
        listing,
        other,
        last,
        unread: unreadCountForMessages(userId, c.id, messages)
      };
    })
  );
  hydrated.sort((a, b) => new Date(b.last?.createdAt || b.createdAt) - new Date(a.last?.createdAt || a.createdAt));
  return hydrated;
}

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
    let timer;
    async function tick() {
      try {
        setRows(await loadInbox(s.id));
        setError("");
      } catch (err) {
        setError(err.message || "Could not load chats.");
      }
    }
    tick();
    timer = setInterval(tick, 4000);
    return () => clearInterval(timer);
  }, [router]);

  if (!session) return <div className="px-5 py-16">Loading chats…</div>;

  return (
    <div className="mx-auto max-w-xl bg-[#fffdf8]">
      <div className="px-5 pb-2 pt-6">
        <h1 className="text-3xl">Chats</h1>
      </div>
      {error && <p className="px-5 text-[#8f4126]">{error}</p>}
      {rows.length === 0 && !error && <p className="px-5 py-10 text-[#6b6458]">No conversations yet.</p>}
      <div className="divide-y divide-[#eee6d8]">
        {rows.map((c) => (
          <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f7f1e8]">
            <img
              src={c.listing?.image}
              alt=""
              className="h-12 w-12 shrink-0 rounded-full object-cover bg-[#ece4d6]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className={`truncate ${c.unread ? "font-semibold" : "font-medium"}`}>
                  {firstName(c.other?.name)}
                </p>
                <p className={`shrink-0 text-[11px] ${c.unread ? "font-semibold text-[#1fa855]" : "text-[#8a8378]"}`}>
                  {formatChatTime(c.last?.createdAt || c.createdAt)}
                </p>
              </div>
              <p className="truncate text-[12px] text-[#8a8378]">{c.listing?.title}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <p className={`min-w-0 flex-1 truncate text-[13px] ${c.unread ? "font-medium text-[#1c1914]" : "text-[#6b6458]"}`}>
                  {c.last?.senderId === session.id ? "You: " : ""}{c.last?.text || "No messages yet"}
                </p>
                {c.unread > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#25d366] px-1.5 text-[11px] font-semibold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
