import { NextResponse } from "next/server";
import { SITE_URL, stripe } from "@/lib/integrations";

function originFor(request: Request): string {
  return request.headers.get("origin") ?? SITE_URL;
}

async function readCustomerId(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const parsed = (await request.json().catch(() => ({}))) as {
      customerId?: string;
    };
    return parsed.customerId ?? null;
  }
  const formData = await request.formData();
  const value = formData.get("customerId");
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }

  const customerId = await readCustomerId(request);
  if (!customerId) {
    return NextResponse.json(
      {
        error:
          "Missing customerId. Once auth is wired up this will be looked up server-side from the signed-in user.",
      },
      { status: 400 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${originFor(request)}/dashboard?portal=closed`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
