import { actions } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/supabaseServer";

export const maxDuration = 30;

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      {
        configured: false,
        error:
          "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/schema.sql."
      },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body?.action;
  const payload = body?.payload || {};
  if (!action || typeof actions[action] !== "function") {
    return Response.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    let result;
    switch (action) {
      case "ping":
        result = await actions.ping();
        break;
      case "uploadListingPhoto":
        result = await actions.uploadListingPhoto(payload);
        break;
      case "getUsers":
        result = await actions.getUsers();
        break;
      case "getUser":
        result = await actions.getUser(payload.id);
        break;
      case "registerUser":
        result = await actions.registerUser(payload);
        break;
      case "loginUser":
        result = await actions.loginUser(payload.email, payload.password);
        break;
      case "getListings":
        result = await actions.getListings();
        break;
      case "getListing":
        result = await actions.getListing(payload.id);
        break;
      case "saveListing":
        result = await actions.saveListing(payload.listing, payload.sellerId);
        break;
      case "setListingStatus":
        result = await actions.setListingStatus(payload.id, payload.sellerId, payload.status);
        break;
      case "deleteListing":
        result = await actions.deleteListing(payload.id, payload.sellerId);
        break;
      case "getConversations":
        result = await actions.getConversations();
        break;
      case "getConversation":
        result = await actions.getConversation(payload.id);
        break;
      case "conversationsForUser":
        result = await actions.conversationsForUser(payload.userId);
        break;
      case "getMessages":
        result = await actions.getMessages();
        break;
      case "messagesForConversation":
        result = await actions.messagesForConversation(payload.conversationId);
        break;
      case "lastMessagePreview":
        result = await actions.lastMessagePreview(payload.conversationId);
        break;
      case "openConversation":
        result = await actions.openConversation(payload);
        break;
      case "sendMessage":
        result = await actions.sendMessage(payload);
        break;
      case "setMeetup":
        result = await actions.setMeetup(payload.conversationId, payload.userId, payload.meetup);
        break;
      case "getReviews":
        result = await actions.getReviews();
        break;
      case "reviewsForUser":
        result = await actions.reviewsForUser(payload.userId);
        break;
      case "averageRating":
        result = await actions.averageRating(payload.userId);
        break;
      case "addReview":
        result = await actions.addReview(payload);
        break;
      case "addReport":
        result = await actions.addReport(payload);
        break;
      default:
        return Response.json({ error: "Unknown action" }, { status: 400 });
    }
    return Response.json({ configured: true, result });
  } catch (error) {
    return Response.json({ configured: true, error: error.message }, { status: 400 });
  }
}
