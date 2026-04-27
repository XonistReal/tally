import { NextResponse } from "next/server";
import { SITE_URL, pricing, priceIdFor, stripe } from "@/lib/integrations";
import type { TierKey } from "@/lib/integrations";

function originFor(request: Request): string {
  return request.headers.get("origin") ?? SITE_URL;
}

async function readTier(request: Request): Promise<TierKey> {
  const contentType = request.headers.get("content-type") ?? "";
  let raw: unknown = "pro";

  if (contentType.includes("application/json")) {
    const parsed = (await request.json()) as { tier?: TierKey };
    raw = parsed.tier ?? "pro";
  } else {
    const formData = await request.formData();
    raw = formData.get("tier") ?? "pro";
  }

  return raw === "pro_plus" ? "pro_plus" : "pro";
}

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  const tier = await readTier(request);
  const origin = originFor(request);

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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
