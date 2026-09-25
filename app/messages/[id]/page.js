"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MEETUP_SPOTS } from "@/lib/data";
import { firstName, formatChatTime, formatMoney } from "@/lib/format";
import {
  addReview,
  getConversation,
  getListing,
  getSession,
  getUser,
  markConversationRead,
  messagesForConversation,
  sendMessage,
  setMeetup
} from "@/lib/store";

export default function ConversationPage() {
  const { id } = useParams();
  const router = useRouter();
  const listRef = useRef(null);
  const stickToBottom = useRef(true);
  const [session, setSession] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [listing, setListing] = useState(null);
  const [other, setOther] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [place, setPlace] = useState("");
  const [time, setTime] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewNote, setReviewNote] = useState("");
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  function scrollToLatest() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  function onListScroll() {
    const el = listRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  async function load(s) {
    const convo = await getConversation(id);
    if (!convo) {
      setConversation(null);
      setLoaded(true);
      return;
    }
    if (s.id !== convo.buyerId && s.id !== convo.sellerId) {
      router.replace("/messages");
      return;
    }
    const [item, rows] = await Promise.all([
      getListing(convo.listingId),
      messagesForConversation(convo.id)
    ]);
    const otherId = s.id === convo.buyerId ? convo.sellerId : convo.buyerId;
    const person = await getUser(otherId).catch(() => null);
    setConversation(convo);
    setListing(item);
    setOther(person);
    setMessages(rows || []);
    setPlace((prev) => prev || convo.meetupPlace || "");
    setTime((prev) => prev || convo.meetupTime || "");
    markConversationRead(s.id, convo.id);
    setLoaded(true);
    stickToBottom.current = true;
  }

  async function refreshMessages(s, forceBottom = false) {
    const rows = await messagesForConversation(id);
    setMessages(rows || []);
    markConversationRead(s.id, id);
    const convo = await getConversation(id).catch(() => null);
    if (convo) setConversation(convo);
    if (forceBottom) stickToBottom.current = true;
  }

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace(`/login?next=/messages/${id}`);
      return;
    }
    setSession(s);
    load(s).catch((err) => {
      setError(err.message || "Could not open this chat.");
      setLoaded(true);
    });
    const timer = setInterval(() => {
      const current = getSession();
      if (!current) return;
      refreshMessages(current).catch(() => {});
    }, 3000);
    return () => clearInterval(timer);
  }, [id, router]);

  useEffect(() => {
    if (stickToBottom.current) {
      requestAnimationFrame(scrollToLatest);
    }
  }, [messages]);

  const spots = useMemo(() => MEETUP_SPOTS[listing?.city] || [], [listing]);

  if (!loaded) return <div className="px-5 py-16">Opening chat…</div>;

  if (!session || !conversation || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl">Chat not found</h1>
        {error && <p className="mt-3 text-sm text-[#8f4126]">{error}</p>}
        <Link href="/messages" className="mt-6 inline-block text-[#8f4126]">Back to chats</Link>
      </div>
    );
  }

  async function onSend(e) {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setError("");
    setSending(true);
    try {
      await sendMessage({ conversationId: conversation.id, senderId: session.id, text: draft });
      setDraft("");
      await refreshMessages(session, true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function onMeetup(e) {
    e.preventDefault();
    setError("");
    try {
      await setMeetup(conversation.id, session.id, { place, time });
      setFlash("Meetup shared in chat.");
      setToolsOpen(false);
      await refreshMessages(session, true);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onReview(e) {
    e.preventDefault();
    setError("");
    try {
      await addReview({
        fromId: session.id,
        toId: other.id,
        listingId: listing.id,
        rating,
        comment: reviewNote
      });
      setFlash("Rating saved.");
      setReviewNote("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-xl flex-col bg-[#ece5dd]">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#d7ccc0] bg-[#f4efe6] px-3 py-2">
        <Link href="/messages" className="grid h-9 w-9 place-items-center text-xl text-[#1c1914]">‹</Link>
        <img src={listing.image} alt="" className="h-10 w-10 rounded-full object-cover bg-[#ddd4c6]" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{firstName(other?.name)}</p>
          <p className="truncate text-[12px] text-[#6b6458]">{listing.title} · {formatMoney(listing.price)}</p>
        </div>
        <button type="button" className="text-sm font-medium text-[#8f4126]" onClick={() => setToolsOpen((v) => !v)}>
          {toolsOpen ? "Close" : "Meetup"}
        </button>
      </div>

      {toolsOpen && (
        <div className="shrink-0 space-y-3 border-b border-[#d7ccc0] bg-[#fffdf8] px-4 py-3">
          <form onSubmit={onMeetup} className="space-y-2">
            <select className="field" value={place} onChange={(e) => setPlace(e.target.value)}>
              <option value="">Public meetup place</option>
              {spots.map((spot) => <option key={spot}>{spot}</option>)}
              <option value="Other public place">Other public place</option>
            </select>
            <input className="field" placeholder="Day and time, e.g. Sunday 3pm" value={time} onChange={(e) => setTime(e.target.value)} />
            <button className="btn btn-dark w-full" type="submit">Share meetup in chat</button>
          </form>
          <form onSubmit={onReview} className="space-y-2">
            <select className="field" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 — on time, as described</option>
              <option value="4">4 — good</option>
              <option value="3">3 — okay</option>
              <option value="2">2 — off</option>
              <option value="1">1 — avoid</option>
            </select>
            <textarea className="field min-h-20" placeholder="After you meet, leave a short rating" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} />
            <button className="btn btn-ghost w-full" type="submit">Rate {firstName(other?.name)}</button>
          </form>
        </div>
      )}

      <div ref={listRef} onScroll={onListScroll} className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {messages.map((m) => {
          const mine = m.senderId === session.id;
          const system = m.kind === "system" || m.senderId === "system";
          if (system) {
            return (
              <p key={m.id} className="mx-auto max-w-[90%] rounded-md bg-[#ffffffaa] px-3 py-1.5 text-center text-[11px] text-[#3b362f]">
                {m.text}
              </p>
            );
          }
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] rounded-lg px-2.5 pb-1.5 pt-1.5 text-[15px] leading-snug shadow-sm ${mine ? "rounded-tr-none bg-[#dcf8c6]" : "rounded-tl-none bg-white"}`}>
                {m.kind === "meetup" && <p className="mb-1 text-[11px] font-semibold text-[#1fa855]">Meetup</p>}
                <p className="whitespace-pre-wrap">{m.text}</p>
                <p className="mt-1 text-right text-[10px] text-[#667781]">{formatChatTime(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={onSend} className="shrink-0 bg-[#f0ebe3] px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-end gap-2">
          <input
            className="min-h-11 flex-1 rounded-full border-0 bg-white px-4 py-2.5 outline-none"
            placeholder="Message"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1fa855] text-white disabled:opacity-60"
            type="submit"
            disabled={sending || !draft.trim()}
            aria-label="Send"
          >
            ➤
          </button>
        </div>
        {error && <p className="px-2 pt-1 text-sm text-[#8f4126]">{error}</p>}
        {flash && <p className="px-2 pt-1 text-sm text-[#3f4a3a]">{flash}</p>}
      </form>
    </div>
  );
}
