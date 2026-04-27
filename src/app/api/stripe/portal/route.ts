import { NextResponse } from "next/server";
import { SITE_URL, stripe, supabaseAdmin } from "@/lib/integrations";
import { getServerSupabase } from "@/lib/supabase-server";

function originFor(request: Request): string {
  return request.headers.get("origin") ?? SITE_URL;
}

async function readExplicitCustomerId(
  request: Request,
): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const parsed = (await request.json().catch(() => ({}))) as {
      customerId?: string;
    };
    return parsed.customerId ?? null;
  }
  // formData() throws on empty bodies; tolerate that.
  const formData = await request.formData().catch(() => null);
  if (!formData) return null;
  const value = formData.get("customerId");
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function POST(request: Request) {
  const origin = originFor(request);

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  // Resolve customer ID in this priority order:
  //   1. Explicit customerId in the request (legacy / programmatic callers).
  //   2. The signed-in user's most recent subscription row.
  let customerId = await readExplicitCustomerId(request);

  if (!customerId) {
    const supabase = await getServerSupabase();
    if (supabase && supabaseAdmin) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabaseAdmin
          .from("subscriptions")
          .select("stripe_customer_id")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        customerId =
          (data as { stripe_customer_id: string | null } | null)
            ?.stripe_customer_id ?? null;
      }
    }
  }

  if (!customerId) {
    // Form submissions get a friendly redirect to /pricing rather than a JSON
    // error wall.
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const url = new URL("/pricing", origin);
      url.searchParams.set("error", "No active subscription found.");
      return NextResponse.redirect(url.toString(), 303);
    }
    return NextResponse.json(
      {
        error:
          "No customer found. Sign in with the account that purchased the subscription.",
      },
      { status: 400 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard?portal=closed`,
    });

    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(portal.url, 303);
    }
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
