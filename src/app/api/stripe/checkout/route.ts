import { NextResponse } from "next/server";
import { SITE_URL, pricing, priceIdFor, stripe } from "@/lib/integrations";
import type { TierKey } from "@/lib/integrations";
import { getServerSupabase } from "@/lib/supabase-server";

function originFor(request: Request): string {
  return request.headers.get("origin") ?? SITE_URL;
}

type RequestKind = "form" | "json";

async function readRequest(
  request: Request,
): Promise<{ tier: TierKey; kind: RequestKind }> {
  const contentType = request.headers.get("content-type") ?? "";
  let raw: unknown = "pro";
  let kind: RequestKind = "form";

  if (contentType.includes("application/json")) {
    kind = "json";
    const parsed = (await request.json()) as { tier?: TierKey };
    raw = parsed.tier ?? "pro";
  } else {
    const formData = await request.formData();
    raw = formData.get("tier") ?? "pro";
  }

  const tier: TierKey = raw === "pro_plus" ? "pro_plus" : "pro";
  return { tier, kind };
}

export async function POST(request: Request) {
  const origin = originFor(request);

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  const { tier, kind } = await readRequest(request);
  const priceId = priceIdFor(tier);

  // Authenticated user (if any) — used to prefill email and stamp the
  // subscription with the Supabase user_id via client_reference_id.
  const supabase = await getServerSupabase();
  let userId: string | null = null;
  let email: string | null = null;
  let existingCustomerId: string | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      email = user.email ?? null;

      // Reuse an existing Stripe Customer if we already have one on file so
      // the user keeps a single billing record across upgrades.
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      existingCustomerId =
        (existing as { stripe_customer_id: string | null } | null)
          ?.stripe_customer_id ?? null;
    }
  }

  // If the visitor isn't signed in, send them to /login first and bring them
  // back to the same checkout afterwards. Magic-link sign-up + checkout in
  // one flow.
  if (!userId) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("redirect", `/pricing?upgrade=${tier}`);
    if (kind === "form") {
      return NextResponse.redirect(loginUrl.toString(), 303);
    }
    return NextResponse.json({ url: loginUrl.toString() }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                recurring: { interval: "month" },
                unit_amount: pricing[tier].monthly * 100,
                product_data: {
                  name: `Tally ${pricing[tier].name}`,
                },
              },
            },
      ],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      automatic_tax: { enabled: false },
      // Stamp the Supabase user_id onto the session so the webhook can link
      // the subscription to the right account.
      client_reference_id: userId,
      ...(existingCustomerId
        ? { customer: existingCustomerId }
        : email
          ? { customer_email: email }
          : {}),
      subscription_data: {
        metadata: { tier, supabase_user_id: userId },
      },
      metadata: { tier, supabase_user_id: userId },
      success_url: `${origin}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?upgrade=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL." },
        { status: 500 },
      );
    }

    if (kind === "form") {
      return NextResponse.redirect(session.url, 303);
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    if (kind === "form") {
      const url = new URL("/pricing", origin);
      url.searchParams.set("error", message);
      return NextResponse.redirect(url.toString(), 303);
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
