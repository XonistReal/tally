import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client bound to the current request's cookies. Returns
 * null when env vars are missing so the app still builds without Supabase.
 *
 * Use inside Server Components, Route Handlers, and Server Actions.
 */
export async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot set cookies — middleware handles refresh.
          // Swallowing here is the documented pattern.
        }
      },
    },
  });
}

/** Convenience: returns the current session's user, or null. */
export async function getCurrentUser() {
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
