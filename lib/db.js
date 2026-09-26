import { getServiceClient, isDatabaseConfigured, supabaseUrl } from "./supabaseServer";
import { completeSignup, requestSignupCode } from "./phoneAuth";

export { requestSignupCode };

const PHOTO_BUCKET = "listing-photos";
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    city: row.city
  };
}

function listingFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    category: row.category,
    condition: row.condition,
    price: Number(row.price),
    negotiable: Boolean(row.negotiable),
    hasReceipt: Boolean(row.has_receipt),
    hasCarton: Boolean(row.has_carton),
    city: row.city,
    neighborhood: row.neighborhood || "",
    description: row.description || "",
    image: row.image || "",
    status: row.status,
    createdAt: row.created_at,
    soldAt: row.sold_at,
    soldTo: row.sold_to
  };
}

function conversationFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    meetupPlace: row.meetup_place || "",
    meetupTime: row.meetup_time || "",
    status: row.status || "open",
    createdAt: row.created_at
  };
}

function messageFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    kind: row.kind,
    text: row.text,
    createdAt: row.created_at
  };
}

function reviewFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    fromId: row.from_id,
    toId: row.to_id,
    listingId: row.listing_id,
    rating: Number(row.rating),
    comment: row.comment || "",
    createdAt: row.created_at
  };
}

function fail(error) {
  throw new Error(error?.message || "Database request failed");
}

async function ensurePhotoBucket(db) {
  const { data, error } = await db.storage.listBuckets();
  if (error) fail(error);
  if ((data || []).some((bucket) => bucket.id === PHOTO_BUCKET || bucket.name === PHOTO_BUCKET)) {
    return;
  }
  const created = await db.storage.createBucket(PHOTO_BUCKET, {
    public: true,
    fileSizeLimit: MAX_PHOTO_BYTES,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]
  });
  if (created.error && !/already exists/i.test(created.error.message || "")) {
    fail(created.error);
  }
}

export async function ping() {
  return { configured: isDatabaseConfigured() };
}

export async function uploadListingPhoto({ sellerId, fileName, contentType, base64 }) {
  if (!sellerId) throw new Error("Sign in to upload a photo.");
  const raw = String(base64 || "").replace(/^data:[^;]+;base64,/, "");
  if (!raw) throw new Error("Choose a photo first.");
  const buffer = Buffer.from(raw, "base64");
  if (!buffer.length) throw new Error("That photo could not be read.");
  if (buffer.length > MAX_PHOTO_BYTES) throw new Error("Photo must be under 3MB.");

  const type = String(contentType || "image/jpeg").toLowerCase();
  if (!type.startsWith("image/")) throw new Error("Only image files can be uploaded.");

  const extFromName = String(fileName || "").split(".").pop()?.toLowerCase();
  const extFromType = type.split("/")[1]?.replace("jpeg", "jpg");
  const ext = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"].includes(extFromName)
    ? extFromName.replace("jpeg", "jpg")
    : extFromType || "jpg";

  const db = getServiceClient();
  await ensurePhotoBucket(db);

  const path = `${sellerId}/${Date.now()}.${ext}`;
  const { error } = await db.storage.from(PHOTO_BUCKET).upload(path, buffer, {
    contentType: type,
    upsert: false
  });
  if (error) fail(error);

  const publicUrl = `${supabaseUrl().replace(/\/$/, "")}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
  return publicUrl;
}

export async function getUsers() {
  const db = getServiceClient();
  const { data, error } = await db.from("users").select("id, name, email, phone, city");
  if (error) fail(error);
  return (data || []).map(publicUser);
}

export async function getUser(id) {
  const db = getServiceClient();
  const { data, error } = await db
    .from("users")
    .select("id, name, email, phone, city")
    .eq("id", id)
    .maybeSingle();
  if (error) fail(error);
  return publicUser(data);
}

export async function registerUser(payload) {
  return completeSignup(payload);
}

export async function loginUser(email, password) {
  const db = getServiceClient();
  const { data, error } = await db
    .from("users")
    .select("id, name, email, phone, city, password")
    .eq("email", String(email || "").trim().toLowerCase())
    .maybeSingle();
  if (error) fail(error);
  if (!data || data.password !== password) throw new Error("Incorrect email or password.");
  return publicUser(data);
}

export async function getListings() {
  const db = getServiceClient();
  const { data, error } = await db.from("listings").select("*").order("created_at", { ascending: false });
  if (error) fail(error);
  return (data || []).map(listingFromRow);
}

export async function getListing(id) {
  const db = getServiceClient();
  const { data, error } = await db.from("listings").select("*").eq("id", id).maybeSingle();
  if (error) fail(error);
  return listingFromRow(data);
}

export async function saveListing(listing, sellerId) {
  const db = getServiceClient();
  const now = new Date().toISOString();
  if (listing.id) {
    const { data: current, error: readError } = await db
      .from("listings")
      .select("*")
      .eq("id", listing.id)
      .eq("seller_id", sellerId)
      .maybeSingle();
    if (readError) fail(readError);
    if (!current) throw new Error("Listing not found.");
    const { error } = await db
      .from("listings")
      .update({
        title: listing.title,
        category: listing.category,
        condition: listing.condition,
        price: listing.price,
        negotiable: Boolean(listing.negotiable),
        has_receipt: Boolean(listing.hasReceipt),
        has_carton: Boolean(listing.hasCarton),
        city: listing.city,
        neighborhood: listing.neighborhood || "",
        description: listing.description,
        image: listing.image,
        status: listing.status || current.status,
        updated_at: now
      })
      .eq("id", listing.id)
      .eq("seller_id", sellerId);
    if (error) fail(error);
    return listing.id;
  }
  const created = {
    id: `item-${Date.now()}`,
    seller_id: sellerId,
    title: listing.title,
    category: listing.category,
    condition: listing.condition,
    price: listing.price,
    negotiable: Boolean(listing.negotiable),
    has_receipt: Boolean(listing.hasReceipt),
    has_carton: Boolean(listing.hasCarton),
    city: listing.city,
    neighborhood: listing.neighborhood || "",
    description: listing.description,
    image: listing.image,
    status: "active",
    created_at: now
  };
  const { error } = await db.from("listings").insert(created);
  if (error) fail(error);
  return created.id;
}

export async function setListingStatus(id, sellerId, status) {
  const db = getServiceClient();
  const patch = { status, updated_at: new Date().toISOString() };
  if (status === "sold") patch.sold_at = new Date().toISOString();
  if (status === "active") {
    patch.sold_at = null;
    patch.sold_to = null;
  }
  const { error } = await db.from("listings").update(patch).eq("id", id).eq("seller_id", sellerId);
  if (error) fail(error);
  return true;
}

export async function deleteListing(id, sellerId) {
  const db = getServiceClient();
  const { error } = await db.from("listings").delete().eq("id", id).eq("seller_id", sellerId);
  if (error) fail(error);
  return true;
}

export async function getConversations() {
  const db = getServiceClient();
  const { data, error } = await db.from("conversations").select("*").order("created_at", { ascending: false });
  if (error) fail(error);
  return (data || []).map(conversationFromRow);
}

export async function getConversation(id) {
  const db = getServiceClient();
  const { data, error } = await db.from("conversations").select("*").eq("id", id).maybeSingle();
  if (error) fail(error);
  return conversationFromRow(data);
}

export async function conversationsForUser(userId) {
  const db = getServiceClient();
  const { data, error } = await db
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });
  if (error) fail(error);
  return (data || []).map(conversationFromRow);
}

export async function getMessages() {
  const db = getServiceClient();
  const { data, error } = await db.from("messages").select("*").order("created_at", { ascending: true });
  if (error) fail(error);
  return (data || []).map(messageFromRow);
}

export async function messagesForConversation(conversationId) {
  const db = getServiceClient();
  const { data, error } = await db
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) fail(error);
  return (data || []).map(messageFromRow);
}

export async function lastMessagePreview(conversationId) {
  const rows = await messagesForConversation(conversationId);
  return rows[rows.length - 1] || null;
}

export async function openConversation({ listingId, buyerId }) {
  const listing = await getListing(listingId);
  if (!listing) throw new Error("Listing not found.");
  if (listing.sellerId === buyerId) throw new Error("You cannot chat on your own listing.");
  if (listing.status === "sold") throw new Error("This item is already sold.");

  const db = getServiceClient();
  const { data: existing, error: existingError } = await db
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", listing.sellerId)
    .maybeSingle();
  if (existingError) fail(existingError);
  if (existing) return existing.id;

  const conversation = {
    id: `convo-${Date.now()}`,
    listing_id: listingId,
    buyer_id: buyerId,
    seller_id: listing.sellerId,
    meetup_place: "",
    meetup_time: "",
    status: "open",
    created_at: new Date().toISOString()
  };
  const { error } = await db.from("conversations").insert(conversation);
  if (error) fail(error);

  const { error: messageError } = await db.from("messages").insert({
    id: `msg-${Date.now()}`,
    conversation_id: conversation.id,
    sender_id: "system",
    kind: "system",
    text: "Chat opened. Negotiate here, then agree a public place and time. Inspect first. Pay only when you are happy.",
    created_at: new Date().toISOString()
  });
  if (messageError) fail(messageError);
  return conversation.id;
}

export async function sendMessage({ conversationId, senderId, text, kind = "text" }) {
  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error("Conversation not found.");
  if (conversation.status === "closed") throw new Error("This chat is closed.");
  if (senderId !== conversation.buyerId && senderId !== conversation.sellerId && senderId !== "system") {
    throw new Error("You are not in this chat.");
  }
  const trimmed = String(text || "").trim();
  if (!trimmed) throw new Error("Write a message first.");
  const message = {
    id: `msg-${Date.now()}`,
    conversation_id: conversationId,
    sender_id: senderId,
    kind,
    text: trimmed,
    created_at: new Date().toISOString()
  };
  const db = getServiceClient();
  const { error } = await db.from("messages").insert(message);
  if (error) fail(error);
  return messageFromRow(message);
}

export async function setMeetup(conversationId, userId, { place, time }) {
  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error("Conversation not found.");
  if (conversation.status === "closed") throw new Error("This chat is closed.");
  if (userId !== conversation.buyerId && userId !== conversation.sellerId) {
    throw new Error("You are not in this chat.");
  }
  const db = getServiceClient();
  const { error } = await db
    .from("conversations")
    .update({ meetup_place: place, meetup_time: time })
    .eq("id", conversationId);
  if (error) fail(error);
  await sendMessage({
    conversationId,
    senderId: userId,
    kind: "meetup",
    text: `Meetup suggested: ${place}${time ? `, ${time}` : ""}. Public place, inspect first, pay after.`
  });
  return true;
}

export async function getReviews() {
  const db = getServiceClient();
  const { data, error } = await db.from("reviews").select("*").order("created_at", { ascending: false });
  if (error) fail(error);
  return (data || []).map(reviewFromRow);
}

export async function reviewsForUser(userId) {
  const db = getServiceClient();
  const { data, error } = await db
    .from("reviews")
    .select("*")
    .eq("to_id", userId)
    .order("created_at", { ascending: false });
  if (error) fail(error);
  return (data || []).map(reviewFromRow);
}

export async function averageRating(userId) {
  const rows = await reviewsForUser(userId);
  if (!rows.length) return null;
  return rows.reduce((sum, r) => sum + Number(r.rating), 0) / rows.length;
}

export async function addReview({ fromId, toId, listingId, rating, comment }) {
  if (fromId === toId) throw new Error("You cannot rate yourself.");
  const db = getServiceClient();
  const { data: existing } = await db
    .from("reviews")
    .select("id")
    .eq("from_id", fromId)
    .eq("to_id", toId)
    .eq("listing_id", listingId)
    .maybeSingle();
  if (existing) throw new Error("You already left a rating for this person on this listing.");
  const row = {
    id: `rev-${Date.now()}`,
    from_id: fromId,
    to_id: toId,
    listing_id: listingId,
    rating: Number(rating),
    comment: String(comment || "").trim(),
    created_at: new Date().toISOString()
  };
  const { error } = await db.from("reviews").insert(row);
  if (error) fail(error);
  return reviewFromRow(row);
}

export async function addReport({ fromId, listingId, reason }) {
  const db = getServiceClient();
  const row = {
    id: `rep-${Date.now()}`,
    from_id: fromId,
    listing_id: listingId,
    reason: String(reason || "").trim(),
    created_at: new Date().toISOString()
  };
  const { error } = await db.from("reports").insert(row);
  if (error) fail(error);
  return row;
}

export const actions = {
  ping,
  uploadListingPhoto,
  getUsers,
  getUser,
  requestSignupCode,
  registerUser,
  loginUser,
  getListings,
  getListing,
  saveListing,
  setListingStatus,
  deleteListing,
  getConversations,
  getConversation,
  conversationsForUser,
  getMessages,
  messagesForConversation,
  lastMessagePreview,
  openConversation,
  sendMessage,
  setMeetup,
  getReviews,
  reviewsForUser,
  averageRating,
  addReview,
  addReport
};
