import crypto from "crypto";
import { getServiceClient } from "./supabaseServer";

const OTP_MINUTES = 10;

function fail(error) {
  throw new Error(error?.message || "Database request failed");
}

export function normalizePhone(input) {
  const raw = String(input || "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("234") && digits.length === 13) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+234${digits.slice(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  if (raw.startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return "";
}

export function localPhone(e164) {
  if (!e164) return "";
  if (e164.startsWith("+234") && e164.length === 14) return `0${e164.slice(4)}`;
  return e164;
}

export function maskPhone(e164) {
  const local = localPhone(e164);
  if (local.length < 8) return local;
  return `${local.slice(0, 4)}***${local.slice(-4)}`;
}

function hashCode(phone, code) {
  return crypto.createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

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

async function deliverOtp(phone, code) {
  const text = `Hearthly code: ${code}. It expires in ${OTP_MINUTES} minutes. Do not share it.`;
  const termiiKey = process.env.TERMII_API_KEY;
  const termiiFrom = process.env.TERMII_SENDER_ID || "Hearthly";
  if (termiiKey) {
    const res = await fetch("https://api.ng.termii.com/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: phone.replace(/^\+/, ""),
        from: termiiFrom,
        sms: text,
        type: "plain",
        channel: "generic",
        api_key: termiiKey
      })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || data.error || "Could not send the SMS code.");
    return "sms";
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (sid && token && from) {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ To: phone, From: from, Body: text })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Could not send the SMS code.");
    return "sms";
  }

  return "preview";
}

export async function requestSignupCode({ name, email, phone, city, password }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPhone = normalizePhone(phone);
  const cleanPassword = String(password || "");
  if (!cleanName || !cleanEmail || !cleanPhone || !cleanPassword) {
    throw new Error("Name, email, phone and password are required.");
  }
  if (cleanPassword.length < 6) throw new Error("Use at least 6 characters for the password.");

  const db = getServiceClient();
  const { data: emailTaken, error: emailError } = await db.from("users").select("id").eq("email", cleanEmail).maybeSingle();
  if (emailError) fail(emailError);
  if (emailTaken) throw new Error("An account with that email already exists.");

  const variants = [cleanPhone, localPhone(cleanPhone)];
  const { data: phoneRows, error: phoneError } = await db.from("users").select("id, phone").in("phone", variants);
  if (phoneError) fail(phoneError);
  if ((phoneRows || []).length) throw new Error("An account with that phone number already exists.");

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const row = {
    phone: cleanPhone,
    code_hash: hashCode(cleanPhone, code),
    expires_at: new Date(Date.now() + OTP_MINUTES * 60 * 1000).toISOString(),
    attempts: 0,
    pending: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      city,
      password: cleanPassword
    },
    created_at: new Date().toISOString()
  };

  const { error } = await db.from("phone_otps").upsert(row, { onConflict: "phone" });
  if (error) {
    if (/phone_otps/i.test(error.message || "")) {
      throw new Error("Phone verification table is missing. Run the SQL in supabase/extras.sql first.");
    }
    fail(error);
  }

  const delivery = await deliverOtp(cleanPhone, code);
  return {
    phone: cleanPhone,
    phoneLabel: maskPhone(cleanPhone),
    expiresIn: OTP_MINUTES * 60,
    previewCode: delivery === "preview" ? code : undefined
  };
}

export async function completeSignup({ phone, code }) {
  const cleanPhone = normalizePhone(phone);
  const cleanCode = String(code || "").replace(/\D/g, "");
  if (!cleanPhone || cleanCode.length !== 6) throw new Error("Enter the 6-digit code sent to your phone.");

  const db = getServiceClient();
  const { data: otp, error: otpError } = await db.from("phone_otps").select("*").eq("phone", cleanPhone).maybeSingle();
  if (otpError) {
    if (/phone_otps/i.test(otpError.message || "")) {
      throw new Error("Phone verification table is missing. Run the SQL in supabase/extras.sql first.");
    }
    fail(otpError);
  }
  if (!otp) throw new Error("Request a new code first.");
  if (new Date(otp.expires_at).getTime() < Date.now()) {
    await db.from("phone_otps").delete().eq("phone", cleanPhone);
    throw new Error("That code has expired. Request a new one.");
  }
  if (Number(otp.attempts || 0) >= 5) {
    await db.from("phone_otps").delete().eq("phone", cleanPhone);
    throw new Error("Too many tries. Request a new code.");
  }
  if (otp.code_hash !== hashCode(cleanPhone, cleanCode)) {
    await db.from("phone_otps").update({ attempts: Number(otp.attempts || 0) + 1 }).eq("phone", cleanPhone);
    throw new Error("That code is not correct.");
  }

  const pending = otp.pending || {};
  const { data: emailTaken } = await db.from("users").select("id").eq("email", pending.email).maybeSingle();
  if (emailTaken) throw new Error("An account with that email already exists.");

  const user = {
    id: `user-${Date.now()}`,
    name: pending.name,
    email: pending.email,
    phone: pending.phone || cleanPhone,
    city: pending.city,
    password: pending.password
  };
  const withFlag = { ...user, phone_verified: true };
  let { error } = await db.from("users").insert(withFlag);
  if (error && /phone_verified/i.test(error.message || "")) {
    const retry = await db.from("users").insert(user);
    error = retry.error;
  }
  if (error) fail(error);
  await db.from("phone_otps").delete().eq("phone", cleanPhone);
  return publicUser(user);
}
