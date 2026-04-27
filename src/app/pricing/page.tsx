import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { tierCapabilities } from "@/lib/entitlements";
import { pricing, type TierKey } from "@/lib/integrations";
import { getServerSupabase } from "@/lib/supabase-server";
import { SiteFooter } from "@/components/site-footer";
import { legal } from "@/lib/legal";

// Reflects the signed-in user's plan in the CTAs on every visit.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro, and Pro+ plans",
  description: `Start free with Tally Starter. Upgrade to Pro for $${pricing.pro.monthly}/mo for unlimited tracking, real-time travel timing, and accountant-ready exports. Cancel anytime.`,
  alternates: { canonical: `${legal.siteUrl}/pricing` },
  openGraph: {
    title: "Tally pricing — simple, fair plans",
    description: `Free Starter plan. Pro at $${pricing.pro.monthly}/mo, Pro+ at $${pricing.pro_plus.monthly}/mo.`,
    url: `${legal.siteUrl}/pricing`,
  },
  robots: { index: true, follow: true },
};

const order: TierKey[] = ["starter", "pro", "pro_plus"];

const taglines: Record<TierKey, string> = {
  starter: "Start free with the basics.",
  pro: "Unlock the full Tally.",
  pro_plus: "For teams, families, and accountants.",
};

const tierRank: Record<TierKey, number> = {
  starter: 0,
  pro: 1,
  pro_plus: 2,
};

async function getCurrentTier(): Promise<TierKey> {
  const supabase = await getServerSupabase();
  if (!supabase) return "starter";
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return "starter";
  const { data } = await supabase
    .from("subscriptions")
    .select("tier, status")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = data as { tier?: string; status?: string } | null;
  if (!row) return "starter";
  const isActive = row.status === "active" || row.status === "trialing";
  if (!isActive) return "starter";
  return row.tier === "pro_plus" ? "pro_plus" : row.tier === "pro" ? "pro" : "starter";
}

export default async function PricingPage() {
  const currentTier = await getCurrentTier();
  const currentRank = tierRank[currentTier];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Open dashboard
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Simple, fair pricing
        </p>
        <h1 className="mt-5 text-5xl font-extrabold tracking-tight">Plans that pay for themselves.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
          Start on the free Starter plan. Upgrade when you want unlimited tracking, real-time travel
          timing, and accountant-ready exports.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
        {order.map((key) => {
          const plan = pricing[key];
          const featured = key === "pro";
          const rank = tierRank[key];
          const isCurrent = rank === currentRank;
          const isDowngrade = rank < currentRank;
          const isUpgrade = rank > currentRank;

          return (
            <article
              key={key}
              className={`relative rounded-3xl border p-7 shadow-sm ${
                isCurrent
                  ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-white shadow-emerald-100"
                  : featured
                    ? "border-indigo-200 bg-gradient-to-b from-indigo-50 to-white shadow-indigo-100"
                    : "border-slate-200 bg-white"
              }`}
            >
              {isCurrent ? (
                <span className="absolute -top-3 left-7 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  Your current plan
                </span>
              ) : featured ? (
                <span className="absolute -top-3 left-7 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  Most popular
                </span>
              ) : null}

              <h2 className="text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-700">{taglines[key]}</p>
              <p className="mt-5 text-5xl font-extrabold tracking-tight">
                ${plan.monthly}
                <span className="text-base font-semibold text-slate-700">/mo</span>
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {tierCapabilities[key].map((cap) => (
                  <li key={cap} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span className="text-slate-800">{cap}</span>
                  </li>
                ))}
              </ul>

              {/* CTA logic */}
              {isCurrent ? (
                key === "starter" ? (
                  <Link
                    href="/dashboard"
                    className="mt-7 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Open dashboard
                  </Link>
                ) : (
                  <form action="/api/stripe/portal" method="post" className="mt-7">
                    <button
                      type="submit"
                      className="w-full rounded-full border border-emerald-300 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      Manage billing
                    </button>
                  </form>
                )
              ) : isDowngrade ? (
                <form action="/api/stripe/portal" method="post" className="mt-7">
                  <button
                    type="submit"
                    className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Switch in billing portal
                  </button>
                </form>
              ) : key === "starter" ? (
                <Link
                  href="/dashboard"
                  className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Start free
                </Link>
              ) : (
                <form action="/api/stripe/checkout" method="post" className="mt-7">
                  <input type="hidden" name="tier" value={key} />
                  <button
                    type="submit"
                    className={`w-full rounded-full px-4 py-3 text-sm font-semibold ${
                      featured
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isUpgrade && currentRank > 0
                      ? `Upgrade to ${plan.name}`
                      : `Get ${plan.name}`}
                  </button>
                </form>
              )}
            </article>
          );
        })}
      </section>

      <SiteFooter />
    </main>
  );
}
