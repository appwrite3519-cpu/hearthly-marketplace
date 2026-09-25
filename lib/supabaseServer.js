import { createClient } from "@supabase/supabase-js";

function firstEnv(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return "";
}

export function supabaseUrl() {
  return firstEnv(
    "SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_URL_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL_SUPABASE_URL"
  );
}

export function supabaseServiceKey() {
  return firstEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_SECRET_KEY",
    "SUPABASE_URL_SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_URL_SUPABASE_SECRET_KEY"
  );
}

export function isDatabaseConfigured() {
  return Boolean(supabaseUrl() && supabaseServiceKey());
}

export function getServiceClient() {
  if (!isDatabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy."
    );
  }
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
