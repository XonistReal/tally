import { NextResponse } from "next/server";
import { SITE_URL, pricing, priceIdFor, stripe } from "@/lib/integrations";
import type { TierKey } from "@/lib/integrations";

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // Prefer real Price IDs (managed in the Stripe Dashboard).
      // Fall back to inline price_data so the app still works the moment
      // STRIPE_SECRET_KEY is set, before any Products/Prices exist.
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
      client_reference_id: undefined, // wire to authed user.id once Supabase auth is enabled
      subscription_data: {
        metadata: { tier },
      },
      metadata: { tier },
      success_url: `${origin}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?upgrade=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout URL." },
        { status: 500 },
      );
    }

    // Form posts (the pricing page) need an actual HTTP redirect so the
    // browser navigates to Stripe Checkout. Programmatic JSON callers get
    // the URL back so they can do whatever they want with it.
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
