import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, supabaseAdmin } from "@/lib/integrations";

// Stripe needs the raw request body to verify the signature, so this route
// must run on the Node.js runtime (not the Edge runtime, which would parse it).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriptionRecord = {
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

function tierFromMetadata(metadata: Stripe.Metadata | null | undefined): string {
  const tier = metadata?.tier;
  if (tier === "pro" || tier === "pro_plus") return tier;
  return "pro";
}

function buildRecord(sub: Stripe.Subscription): SubscriptionRecord {
  // In the 2026-04-22 (Dahlia) API, current_period_end moved off the
  // Subscription object and onto each subscription item. Read from items
  // first, then fall back to the legacy top-level field for older payloads.
  const itemPeriodEnd = sub.items?.data?.[0]?.current_period_end;
  const legacyPeriodEnd = (sub as unknown as { current_period_end?: number })
    .current_period_end;
  const periodEndRaw =
    typeof itemPeriodEnd === "number" ? itemPeriodEnd : legacyPeriodEnd;
  const periodEnd =
    typeof periodEndRaw === "number"
      ? new Date(periodEndRaw * 1000).toISOString()
      : null;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  return {
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    tier: tierFromMetadata(sub.metadata),
    status: sub.status,
    current_period_end: periodEnd,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    updated_at: new Date().toISOString(),
  };
}

async function persistSubscription(sub: Stripe.Subscription) {
  if (!supabaseAdmin) return; // Supabase optional in v1

  const record = buildRecord(sub);

  await supabaseAdmin
    .from("subscriptions")
    .upsert(record, { onConflict: "stripe_subscription_id" });
}

async function markSubscriptionCancelled(sub: Stripe.Subscription) {
  if (!supabaseAdmin) return;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "canceled",
      tier: "starter",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", sub.id);
}

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 400 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await persistSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await persistSubscription(sub);
        break;
      }
      case "invoice.paid": {
        // In the 2026-04-22 (Dahlia) API the subscription reference moved to
        // invoice.parent.subscription_details.subscription.
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await persistSubscription(sub);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await markSubscriptionCancelled(sub);
        break;
      }
      default:
        // Ignore other event types — keep the listener resilient to new ones.
        break;
    }
  } catch (err) {
    // Don't 500 on internal failures; let Stripe deliver again on transient
    // errors but always return 2xx for events we successfully verified.
    console.error("Webhook handler error", err);
  }

  return NextResponse.json({ received: true, type: event.type });
}
