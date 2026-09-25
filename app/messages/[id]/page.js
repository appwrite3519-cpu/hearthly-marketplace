"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SafetyBanner from "@/components/SafetyBanner";
import { MEETUP_SPOTS } from "@/lib/data";
import { firstName, formatMoney, formatTime } from "@/lib/format";
import {
  addReview,
  getConversation,
  getListing,
  getSession,
  getUser,
  messagesForConversation,
  sendMessage,
  setMeetup
} from "@/lib/store";

export default function ConversationPage() {
  const { id } = useParams();
  const router = useRouter();
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
    setPlace(convo.meetupPlace || "");
    setTime(convo.meetupTime || "");
    setLoaded(true);
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
  }, [id, router]);

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
      await load(session);
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
      setFlash("Meetup note added to the chat.");
      await load(session);
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
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div>
        <Link href="/messages" className="text-sm text-[#8f4126]">← All chats</Link>
        <h1 className="mt-3 text-3xl">{listing.title}</h1>
        <p className="text-sm text-[#6b6458]">
          With {firstName(other?.name)} · asking {formatMoney(listing.price)}
          {listing.negotiable ? " · negotiable" : ""}
        </p>
        <div className="mt-6 space-y-3 rounded-3xl border border-[#ddd4c6] bg-[#fffdf8] p-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-[#6b6458]">No messages yet. Say hello and suggest a public place.</p>
          )}
          {messages.map((m) => {
            const mine = m.senderId === session.id;
            const system = m.kind === "system" || m.senderId === "system";
            if (system) {
              return (
                <p key={m.id} className="rounded-xl bg-[#ece4d6] px-3 py-2 text-center text-xs text-[#3b362f]">
                  {m.text}
                </p>
              );
            }
            return (
              <div key={m.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${mine ? "ml-auto bg-[#3f4a3a] text-[#f4efe6]" : "bg-[#ece4d6] text-[#1c1914]"}`}>
                {m.kind === "meetup" && <p className="mb-1 text-[11px] uppercase tracking-wide opacity-80">Meetup</p>}
                <p>{m.text}</p>
                <p className={`mt-1 text-[11px] ${mine ? "text-[#d9d2c4]" : "text-[#6b6458]"}`}>{formatTime(m.createdAt)}</p>
              </div>
            );
          })}
        </div>
        <form onSubmit={onSend} className="mt-4 flex gap-2">
          <input
            className="field"
            placeholder="Ask a question or offer a price…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-[#8f4126]">{error}</p>}
        {flash && <p className="mt-2 text-sm text-[#3f4a3a]">{flash}</p>}
      </div>
      <aside className="space-y-5">
        <SafetyBanner />
        <div className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">Agree a meetup</p>
          <form onSubmit={onMeetup} className="mt-3 space-y-3">
            <select className="field" value={place} onChange={(e) => setPlace(e.target.value)}>
              <option value="">Choose a public place</option>
              {spots.map((spot) => <option key={spot}>{spot}</option>)}
              <option value="Other public place">Other public place</option>
            </select>
            <input className="field" placeholder="Day and time, e.g. Sunday 3pm" value={time} onChange={(e) => setTime(e.target.value)} />
            <button className="btn btn-dark w-full" type="submit">Drop meetup in chat</button>
          </form>
          {conversation.meetupPlace && (
            <p className="mt-3 text-sm text-[#3b362f]">
              Current plan: {conversation.meetupPlace}
              {conversation.meetupTime ? ` · ${conversation.meetupTime}` : ""}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-[#ddd4c6] bg-[#fffdf8] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b6458]">After you meet</p>
          <form onSubmit={onReview} className="mt-3 space-y-3">
            <select className="field" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 — on time, item as described</option>
              <option value="4">4 — good</option>
              <option value="3">3 — okay</option>
              <option value="2">2 — off</option>
              <option value="1">1 — avoid</option>
            </select>
            <textarea className="field min-h-24" placeholder="Short note about the meetup" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} />
            <button className="btn btn-ghost w-full" type="submit">Rate {firstName(other?.name)}</button>
          </form>
        </div>
        <Link href={`/item/${listing.id}`} className="block text-sm text-[#8f4126]">Open listing →</Link>
        <Link href={`/profile/${other?.id}`} className="block text-sm text-[#8f4126]">
          {firstName(other?.name)}’s profile →
        </Link>
      </aside>
    </div>
  );
}
