"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

// Single browser-side Supabase client. Used for direct uploads to
// storage (thumbnails) using the anon key. RLS / bucket policies
// enforce what's allowed.
export function supabaseBrowser(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY missing");
  }
  cached = createClient(url, anon, { auth: { persistSession: false } });
  return cached;
}
