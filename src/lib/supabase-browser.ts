import { createBrowserClient } from "@supabase/ssr";

let cached: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Browser-side Supabase client. Returns null when env vars are missing so the
 * app still builds without Supabase wired up.
 */
export function getBrowserSupabase() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  cached = createBrowserClient(url, key);
  return cached;
}
