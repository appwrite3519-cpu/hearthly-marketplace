"use client";

const SESSION_KEY = "hearthly2_session";

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(value));
}

export function getSession() {
  return readSession();
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

async function api(action, payload = {}) {
  const res = await fetch("/api/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Could not reach the database.");
  }
  return data.result;
}

export async function getUsers() {
  return api("getUsers");
}

export async function getUser(id) {
  if (!id) return null;
  return api("getUser", { id });
}

export async function registerUser(fields) {
  const user = await api("registerUser", fields);
  writeSession({ id: user.id, email: user.email, name: user.name, city: user.city });
  return user;
}

export async function loginUser(email, password) {
  const user = await api("loginUser", { email, password });
  writeSession({ id: user.id, email: user.email, name: user.name, city: user.city });
  return user;
}

export async function getListings() {
  return api("getListings");
}

export async function getListing(id) {
  if (!id) return null;
  return api("getListing", { id });
}

export async function saveListing(listing, sellerId) {
  return api("saveListing", { listing, sellerId });
}

export async function setListingStatus(id, sellerId, status) {
  return api("setListingStatus", { id, sellerId, status });
}

export async function deleteListing(id, sellerId) {
  return api("deleteListing", { id, sellerId });
}

export async function getConversations() {
  return api("getConversations");
}

export async function getConversation(id) {
  if (!id) return null;
  return api("getConversation", { id });
}

export async function conversationsForUser(userId) {
  if (!userId) return [];
  return api("conversationsForUser", { userId });
}

export async function getMessages() {
  return api("getMessages");
}

export async function messagesForConversation(conversationId) {
  if (!conversationId) return [];
  return api("messagesForConversation", { conversationId });
}

export async function lastMessagePreview(conversationId) {
  if (!conversationId) return null;
  return api("lastMessagePreview", { conversationId });
}

export async function openConversation(fields) {
  return api("openConversation", fields);
}

export async function sendMessage(fields) {
  return api("sendMessage", fields);
}

export async function setMeetup(conversationId, userId, meetup) {
  return api("setMeetup", { conversationId, userId, meetup });
}

export async function getReviews() {
  return api("getReviews");
}

export async function reviewsForUser(userId) {
  if (!userId) return [];
  return api("reviewsForUser", { userId });
}

export async function averageRating(userId) {
  if (!userId) return null;
  return api("averageRating", { userId });
}

export async function addReview(fields) {
  return api("addReview", fields);
}

export async function addReport(fields) {
  return api("addReport", fields);
}
