import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { stripe, supabaseAdmin } from "@/lib/integrations";

export const dynamic = "force-dynamic";

/**
 * Backfill any existing Stripe subscriptions for this user that were created
 * before they had an account (or before auth was wired up). Matches the
 * Stripe Customer by email, then stamps the Supabase user_id onto every
 * subscriptions row referencing that customer.
 */
async function linkOrphanSubscriptions(userId: string, email: string) {
  if (!stripe || !supabaseAdmin) return;

  try {
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (customers.data.length === 0) return;

    const customerIds = customers.data.map((c) => c.id);

    await supabaseAdmin
      .from("subscriptions")
      .update({ user_id: userId, updated_at: new Date().toISOString() })
      .in("stripe_customer_id", customerIds)
      .is("user_id", null);
  } catch (err) {
    // Don't block sign-in on linking failures — the dashboard will still work.
    console.error("Subscription link error", err);
  }
}

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

  // Best-effort link of any pre-existing subscriptions purchased with this
  // email. Fire-and-await so the row is updated before the dashboard renders.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email) {
    await linkOrphanSubscriptions(user.id, user.email);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
