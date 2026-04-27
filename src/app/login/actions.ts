"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase-server";
import { SITE_URL } from "@/lib/integrations";

function safeRedirect(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "";
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return "/dashboard";
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const redirectTo = safeRedirect(formData.get("redirect"));

  if (!email || !email.includes("@")) {
    redirect(
      `/login?error=${encodeURIComponent("Enter a valid email address.")}` +
        `&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  const supabase = await getServerSupabase();
  if (!supabase) {
    redirect(
      `/login?error=${encodeURIComponent("Auth is not configured yet. Try again later.")}`,
    );
  }

  // Origin from headers when available so magic links work in preview deploys
  // and on local dev — fall back to the canonical SITE_URL.
  const headerList = await headers();
  const origin = headerList.get("origin") ?? headerList.get("x-forwarded-host")
    ? `https://${headerList.get("x-forwarded-host")}`
    : SITE_URL;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}` +
        `&redirect=${encodeURIComponent(redirectTo)}`,
    );
  }

  redirect(
    `/login?sent=${encodeURIComponent(email)}` +
      `&redirect=${encodeURIComponent(redirectTo)}`,
  );
}

export async function signOut() {
  const supabase = await getServerSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
