"use client";

import { SEED_LISTINGS, SEED_SELLERS } from "./data";

const KEYS = {
  users: "hearthly_users",
  session: "hearthly_session",
  listings: "hearthly_listings",
  inquiries: "hearthly_inquiries"
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
  if (!window.localStorage.getItem(KEYS.users)) write(KEYS.users, SEED_SELLERS);
  if (!window.localStorage.getItem(KEYS.listings)) write(KEYS.listings, SEED_LISTINGS);
  if (!window.localStorage.getItem(KEYS.inquiries)) write(KEYS.inquiries, []);
}

export function getUsers() {
  bootstrapStore();
  return read(KEYS.users, SEED_SELLERS);
}

export function getSession() {
  return read(KEYS.session, null);
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.session);
}

export function registerSeller({ name, email, phone, city, password }) {
  const users = getUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error("An account with that email already exists.");
  const user = {
    id: `seller-${Date.now()}`,
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

export function loginSeller(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Incorrect email or password.");
  write(KEYS.session, { id: user.id, email: user.email, name: user.name });
  return user;
}

export function getListings() {
  bootstrapStore();
  return read(KEYS.listings, SEED_LISTINGS);
}

export function getListing(id) {
  return getListings().find((item) => item.id === id) || null;
}

export function getSeller(id) {
  return getUsers().find((u) => u.id === id) || null;
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
    status: "available",
    createdAt: now
  };
  write(KEYS.listings, [created, ...listings]);
  return created.id;
}

export function setListingStatus(id, sellerId, status) {
  const listings = getListings().map((item) =>
    item.id === id && item.sellerId === sellerId ? { ...item, status } : item
  );
  write(KEYS.listings, listings);
}

export function deleteListing(id, sellerId) {
  write(
    KEYS.listings,
    getListings().filter((item) => !(item.id === id && item.sellerId === sellerId))
  );
}

export function getInquiries() {
  bootstrapStore();
  return read(KEYS.inquiries, []);
}

export function addInquiry(payload) {
  const inquiries = getInquiries();
  const row = {
    id: `inq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "new",
    ...payload
  };
  write(KEYS.inquiries, [row, ...inquiries]);
  return row;
}

export function markInquiryRead(id, sellerId) {
  write(
    KEYS.inquiries,
    getInquiries().map((row) =>
      row.id === id && row.sellerId === sellerId ? { ...row, status: "read" } : row
    )
  );
}
