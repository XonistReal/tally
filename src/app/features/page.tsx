import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Briefcase,
  Plane,
  Receipt,
  Tally5,
  Users,
  Wallet,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "All features",
  description:
    "Tally combines purchase decisions, cash tracking, fair expense splits, packing lists, travel timing, and tax-ready receipts into one calm app. See every feature.",
  alternates: { canonical: `${legal.siteUrl}/features` },
  openGraph: {
    title: "Every Tally feature, one calm app",
    description:
      "Purchase fit, cash tracking, fair splits, packing lists, travel timing, and tax receipts.",
    url: `${legal.siteUrl}/features`,
  },
};

const features = [
  {
    slug: "purchase-fit-check",
    icon: Wallet,
    eyebrow: "Purchase decisions",
    title: "Should I buy this?",
    blurb:
      "Get a Safe / Caution / Wait verdict on any purchase before you commit, based on your real income and bills.",
  },
  {
    slug: "cash-tracker",
    icon: Banknote,
    eyebrow: "Cash spending tracker",
    title: "Finally, an app that tracks cash",
    blurb:
      "Most apps only see card transactions. Tally lets you log cash in seconds so your real burn rate is honest.",
  },
  {
    slug: "expense-splitter",
    icon: Users,
    eyebrow: "Fair expense splitter",
    title: "Split deposits and trips fairly",
    blurb:
      "Equal, weighted, or percentage splits for rent deposits, vacations, and group costs — with settle-up tracking.",
  },
  {
    slug: "packing-list",
    icon: Briefcase,
    eyebrow: "Smart packing lists",
    title: "Packing lists by trip type",
    blurb:
      "Templates for beach, business, ski, and more. Save your tweaks and reuse them next time you travel.",
  },
  {
    slug: "travel-timing",
    icon: Plane,
    eyebrow: "Travel booking timing",
    title: "When should I book this flight?",
    blurb:
      "See the best window to book flights and hotels for your specific dates, with a clear buy-now or wait signal.",
  },
  {
    slug: "receipt-tracker",
    icon: Receipt,
    eyebrow: "Tax-ready receipts",
    title: "Receipts that file themselves",
    blurb:
      "Snap, categorize, and tag receipts for taxes or reimbursements. Export a clean CSV anytime.",
  },
] as const;

export default function FeaturesIndex() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">{legal.brand}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Everything {legal.brand} does
        </p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold tracking-tight">
          Six purpose-built tools for the money decisions you actually face.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-700">
          Each Tally feature solves one specific problem most personal-finance
          apps ignore. Pick what matters to you — they all live in the same
          dashboard.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ slug, icon: Icon, eyebrow, title, blurb }) => (
            <Link
              key={slug}
              href={`/features/${slug}`}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {eyebrow}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-700">{blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                Learn more <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
