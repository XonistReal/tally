import { NextResponse } from "next/server";
import { stripe } from "@/lib/integrations";

export const revalidate = 300;

export async function GET() {
  if (!stripe) {
    return NextResponse.json({ configured: false, members: 0, activeSubscriptions: 0 });
  }

  try {
    const subs = await stripe.subscriptions.list({ status: "active", limit: 100 });
    const customers = await stripe.customers.list({ limit: 100 });
    return NextResponse.json({
      configured: true,
      members: customers.data.length,
      activeSubscriptions: subs.data.length,
      hasMoreMembers: customers.has_more,
      hasMoreSubs: subs.has_more,
    });
  } catch {
    return NextResponse.json({ configured: true, members: 0, activeSubscriptions: 0 });
  }
}
