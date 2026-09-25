"use client";

import {
  SEED_CONVERSATIONS,
  SEED_LISTINGS,
  SEED_MESSAGES,
  SEED_REVIEWS,
  SEED_USERS
} from "./data";

const KEYS = {
  users: "hearthly2_users",
  session: "hearthly2_session",
  listings: "hearthly2_listings",
  conversations: "hearthly2_conversations",
  messages: "hearthly2_messages",
  reviews: "hearthly2_reviews",
  reports: "hearthly2_reports"
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function bootstrapStore() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(KEYS.users)) write(KEYS.users, SEED_USERS);
  if (!window.localStorage.getItem(KEYS.listings)) write(KEYS.listings, SEED_LISTINGS);
  if (!window.localStorage.getItem(KEYS.conversations)) write(KEYS.conversations, SEED_CONVERSATIONS);
  if (!window.localStorage.getItem(KEYS.messages)) write(KEYS.messages, SEED_MESSAGES);
  if (!window.localStorage.getItem(KEYS.reviews)) write(KEYS.reviews, SEED_REVIEWS);
  if (!window.localStorage.getItem(KEYS.reports)) write(KEYS.reports, []);
}

export function getUsers() {
  bootstrapStore();
  return read(KEYS.users, SEED_USERS);
}

export function getSession() {
  return read(KEYS.session, null);
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.session);
}

export function registerUser({ name, email, phone, city, password }) {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error("An account with that email already exists.");
  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    city,
    password
  };
  write(KEYS.users, [...users, user]);
  write(KEYS.session, { id: user.id, email: user.email, name: user.name });
  return user;
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Incorrect email or password.");
  write(KEYS.session, { id: user.id, email: user.email, name: user.name });
  return user;
}

export function getUser(id) {
  return getUsers().find((u) => u.id === id) || null;
}

export function getListings() {
  bootstrapStore();
  return read(KEYS.listings, SEED_LISTINGS);
}

export function getListing(id) {
  return getListings().find((item) => item.id === id) || null;
}

export function saveListing(listing, sellerId) {
  const listings = getListings();
  const now = new Date().toISOString();
  if (listing.id) {
    const next = listings.map((item) =>
      item.id === listing.id && item.sellerId === sellerId
        ? { ...item, ...listing, sellerId, updatedAt: now }
        : item
    );
    write(KEYS.listings, next);
    return listing.id;
  }
  const created = {
    ...listing,
    id: `item-${Date.now()}`,
    sellerId,
    status: "active",
    createdAt: now
  };
  write(KEYS.listings, [created, ...listings]);
  return created.id;
}

export function setListingStatus(id, sellerId, status) {
  write(
    KEYS.listings,
    getListings().map((item) =>
      item.id === id && item.sellerId === sellerId ? { ...item, status } : item
    )
  );
}

export function deleteListing(id, sellerId) {
  write(
    KEYS.listings,
    getListings().filter((item) => !(item.id === id && item.sellerId === sellerId))
  );
}

export function getConversations() {
  bootstrapStore();
  return read(KEYS.conversations, SEED_CONVERSATIONS);
}

export function getMessages() {
  bootstrapStore();
  return read(KEYS.messages, SEED_MESSAGES);
}

export function getConversation(id) {
  return getConversations().find((c) => c.id === id) || null;
}

export function conversationsForUser(userId) {
  return getConversations()
    .filter((c) => c.buyerId === userId || c.sellerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function messagesForConversation(conversationId) {
  return getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function openConversation({ listingId, buyerId }) {
  const listing = getListing(listingId);
  if (!listing) throw new Error("Listing not found.");
  if (listing.sellerId === buyerId) throw new Error("You cannot chat on your own listing.");
  if (listing.status === "sold") throw new Error("This item is already sold.");

  const existing = getConversations().find(
    (c) => c.listingId === listingId && c.buyerId === buyerId && c.sellerId === listing.sellerId
  );
  if (existing) return existing.id;

  const conversation = {
    id: `convo-${Date.now()}`,
    listingId,
    buyerId,
    sellerId: listing.sellerId,
    meetupPlace: "",
    meetupTime: "",
    createdAt: new Date().toISOString()
  };
  write(KEYS.conversations, [conversation, ...getConversations()]);

  const opener = {
    id: `msg-${Date.now()}`,
    conversationId: conversation.id,
    senderId: "system",
    kind: "system",
    text: "Chat opened. Negotiate here, then agree a public place and time. Inspect first. Pay only when you are happy.",
    createdAt: new Date().toISOString()
  };
  write(KEYS.messages, [...getMessages(), opener]);
  return conversation.id;
}

export function sendMessage({ conversationId, senderId, text, kind = "text" }) {
  const conversation = getConversation(conversationId);
  if (!conversation) throw new Error("Conversation not found.");
  if (senderId !== conversation.buyerId && senderId !== conversation.sellerId) {
    throw new Error("You are not in this chat.");
  }
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Write a message first.");
  const message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    kind,
    text: trimmed,
    createdAt: new Date().toISOString()
  };
  write(KEYS.messages, [...getMessages(), message]);
  return message;
}

export function setMeetup(conversationId, userId, { place, time }) {
  const conversation = getConversation(conversationId);
  if (!conversation) throw new Error("Conversation not found.");
  if (userId !== conversation.buyerId && userId !== conversation.sellerId) {
    throw new Error("You are not in this chat.");
  }
  write(
    KEYS.conversations,
    getConversations().map((c) =>
      c.id === conversationId ? { ...c, meetupPlace: place, meetupTime: time } : c
    )
  );
  sendMessage({
    conversationId,
    senderId: userId,
    kind: "meetup",
    text: `Meetup suggested: ${place}${time ? `, ${time}` : ""}. Public place, inspect first, pay after.`
  });
}

export function getReviews() {
  bootstrapStore();
  return read(KEYS.reviews, SEED_REVIEWS);
}

export function reviewsForUser(userId) {
  return getReviews().filter((r) => r.toId === userId);
}

export function averageRating(userId) {
  const rows = reviewsForUser(userId);
  if (!rows.length) return null;
  return rows.reduce((sum, r) => sum + Number(r.rating), 0) / rows.length;
}

export function addReview({ fromId, toId, listingId, rating, comment }) {
  if (fromId === toId) throw new Error("You cannot rate yourself.");
  const existing = getReviews().find(
    (r) => r.fromId === fromId && r.toId === toId && r.listingId === listingId
  );
  if (existing) throw new Error("You already left a rating for this person on this listing.");
  const row = {
    id: `rev-${Date.now()}`,
    fromId,
    toId,
    listingId,
    rating: Number(rating),
    comment: String(comment || "").trim(),
    createdAt: new Date().toISOString()
  };
  write(KEYS.reviews, [row, ...getReviews()]);
  return row;
}

export function addReport({ fromId, listingId, reason }) {
  const row = {
    id: `rep-${Date.now()}`,
    fromId,
    listingId,
    reason: String(reason || "").trim(),
    createdAt: new Date().toISOString()
  };
  write(KEYS.reports, [row, ...read(KEYS.reports, [])]);
  return row;
}

export function lastMessagePreview(conversationId) {
  const rows = messagesForConversation(conversationId);
  return rows[rows.length - 1] || null;
}
