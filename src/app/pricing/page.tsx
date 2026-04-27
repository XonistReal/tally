import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { tierCapabilities } from "@/lib/entitlements";
import { pricing } from "@/lib/integrations";

const order: Array<keyof typeof pricing> = ["starter", "pro", "pro_plus"];

const taglines: Record<keyof typeof pricing, string> = {
  starter: "Start free with the basics.",
  pro: "Unlock the full Tally.",
  pro_plus: "For teams, families, and accountants.",
};

export default function PricingPage() {
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
          return (
            <article
              key={key}
              className={`relative rounded-3xl border p-7 shadow-sm ${
                featured
                  ? "border-indigo-200 bg-gradient-to-b from-indigo-50 to-white shadow-indigo-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  Most popular
                </span>
              )}
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

              {key === "starter" ? (
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
                    Upgrade to {plan.name}
                  </button>
                </form>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
