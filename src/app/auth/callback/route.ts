import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/**
 * Magic-link callback. Supabase appends ?code=... when the user taps the email
 * link; we exchange it for a session cookie, then redirect to the originally
 * requested page (default /dashboard).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Missing sign-in code.")}`,
    );
  }

  const supabase = await getServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Auth is not configured.")}`,
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
