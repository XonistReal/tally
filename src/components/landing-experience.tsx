"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Briefcase,
  Check,
  Compass,
  Lock,
  Plane,
  Receipt,
  Shield,
  Sparkles,
  Tally5,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { evaluatePurchaseFit, splitWeighted, travelTimingFor } from "@/lib/finance";
import { SiteFooter } from "@/components/site-footer";

const features = [
  {
    icon: Wallet,
    title: "Purchase Fit Check",
    body: "Know if a purchase fits your budget before you commit, with clear Safe / Caution / Wait verdicts.",
  },
  {
    icon: Banknote,
    title: "Cash Spending Tracker",
    body: "The only app that takes cash seriously. Log it in seconds, see your real burn rate.",
  },
  {
    icon: Users,
    title: "Fair One-Time Splits",
    body: "Equal, weighted, or percentage rules for deposits and vacations — with settlement tracking.",
  },
  {
    icon: Briefcase,
    title: "Smart Packing Lists",
    body: "Templates by trip type that you can extend, save, and reuse every trip.",
  },
  {
    icon: Plane,
    title: "Travel Timing Helper",
    body: "Get the best window to book flights and hotels for your specific dates and flexibility.",
  },
  {
    icon: Receipt,
    title: "Receipts for Taxes",
    body: "Snap, categorize, and export reimbursement-ready CSVs anytime.",
  },
];

const valueProps = [
  { icon: Zap, label: "30-second setup, no card to start" },
  { icon: Shield, label: "Privacy-first — your data stays yours" },
  { icon: Lock, label: "Cancel anytime in one click" },
];

const sampleSplit = [
  { name: "You", weight: 1 },
  { name: "Alex", weight: 1 },
  { name: "Sam", weight: 2 },
];

export function LandingExperience() {
  const [purchase, setPurchase] = useState(240);
  const [income, setIncome] = useState(4200);
  const [bills, setBills] = useState(2500);
  const [deposit, setDeposit] = useState(1800);
  const [persona, setPersona] = useState("I track cash");
  const [daysOut, setDaysOut] = useState(42);
  const [stats, setStats] = useState<{ configured: boolean; members: number; activeSubscriptions: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats(null));
  }, []);

  const fit = useMemo(
    () => evaluatePurchaseFit(income, bills, purchase, 500),
    [income, bills, purchase],
  );
  const split = useMemo(() => splitWeighted(deposit, sampleSplit), [deposit]);
  const departISO = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + daysOut);
    return d.toISOString().slice(0, 10);
  }, [daysOut]);
  const travel = useMemo(() => travelTimingFor(departISO, 3, 500), [departISO]);

  const fitColor =
    fit.outcome === "Safe"
      ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
      : fit.outcome === "Caution"
      ? "text-amber-700 bg-amber-50 ring-amber-200"
      : "text-rose-700 bg-rose-50 ring-rose-200";

  const showStats = stats?.configured && stats.activeSubscriptions > 0;

  return (
    <div className="bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">Tally</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-700 md:flex">
            <Link href="/features" className="hover:text-slate-900">Features</Link>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#demo" className="hover:text-slate-900">Live demo</a>
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 md:inline"
            >
              Sign in
            </Link>
            <Link
              href="/login?redirect=%2Fdashboard"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-14 md:grid-cols-2 md:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> New • Cash tracking + travel timing
            </div>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Your money,
              <br />
              <span className="gradient-text">one decision smarter.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-700">
              Know what you can afford before you buy. Track cash. Split fairly. Book travel at the right
              time. Keep receipts ready for tax season — all in one calm app.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/login?redirect=%2Fdashboard"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Try it live
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {["I track cash", "I travel", "I split costs", "I manage taxes"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPersona(item)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    persona === item
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <ul className="mt-7 grid gap-2 text-sm text-slate-800 sm:grid-cols-3">
              {valueProps.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md pb-10 pt-8 md:pb-14 md:pt-12">
            <div className="float-soft rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-indigo-100">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Purchase fit</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${fitColor}`}>
                  {fit.outcome}
                </span>
              </div>
              <p className="text-3xl font-extrabold">${purchase}</p>
              <p className="text-sm text-slate-700">
                Confidence {fit.confidence}% · ${fit.available.toFixed(0)} available after guardrails
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <Slider label={`Income $${income}`} min={1200} max={9000} value={income} onChange={setIncome} />
                <Slider label={`Bills $${bills}`} min={500} max={7000} value={bills} onChange={setBills} />
                <Slider label={`Purchase $${purchase}`} min={10} max={3000} value={purchase} onChange={setPurchase} />
              </div>
            </div>

            <div className="absolute -left-4 -top-2 z-10 hidden -rotate-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:-left-12 md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Travel timing</p>
              <p className="mt-1 text-lg font-bold">{travel.label}</p>
              <p className="text-xs text-slate-700">{travel.score}% confidence</p>
            </div>

            <div className="absolute -bottom-2 -right-4 z-10 hidden rotate-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:-right-10 md:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Split fairly</p>
              <p className="mt-1 text-lg font-bold">${(deposit / sampleSplit.length).toFixed(0)}/person</p>
              <p className="text-xs text-slate-700">Across {sampleSplit.length} people</p>
            </div>
          </div>
        </div>
      </section>

      {showStats && (
        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 md:grid-cols-3">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats!.activeSubscriptions.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">Active subscribers</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">
                {stats!.members.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-700">Total members</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">Live</p>
              <p className="mt-1 text-sm font-medium text-slate-700">Updated every 5 minutes</p>
            </div>
          </div>
        </section>
      )}

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Everything in one place</p>
          <h2 className="mt-2 text-4xl font-extrabold">Six tools, one calm dashboard</h2>
          <p className="mt-3 text-slate-700">
            Stop stitching budgeting, splitter, packing, travel and receipt apps together. Tally handles
            the boring stuff so you can decide quickly and confidently.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">How it works</p>
            <h2 className="mt-2 text-4xl font-extrabold">Three steps to financial calm</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Tell us your context", b: "Income, bills, savings goals, upcoming trips. Two minutes max." },
              { n: "02", t: "Make better decisions", b: "Get instant answers: can I buy this? when to book? what's my fair share?" },
              { n: "03", t: "Stay organized for tax day", b: "Auto-categorized receipts, exports, and reimbursement-ready packs." },
            ].map((step) => (
              <article key={step.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-indigo-600">{step.n}</p>
                <h3 className="mt-2 text-xl font-semibold">{step.t}</h3>
                <p className="mt-2 text-slate-700">{step.b}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Try it now</p>
          <h2 className="mt-2 text-4xl font-extrabold">Two interactive demos. No signup required.</h2>
          <p className="mt-3 text-slate-700">
            Move the sliders to feel how Tally thinks before you buy or split.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Purchase fit simulator</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${fitColor}`}>
                {fit.outcome}
              </span>
            </div>
            <p className="text-sm text-slate-700">See affordability before you buy.</p>
            <div className="mt-4 space-y-3 text-sm">
              <Slider label={`Income $${income}`} min={1200} max={9000} value={income} onChange={setIncome} />
              <Slider label={`Bills $${bills}`} min={500} max={7000} value={bills} onChange={setBills} />
              <Slider label={`Purchase $${purchase}`} min={10} max={3000} value={purchase} onChange={setPurchase} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Decision</p>
                <p className="text-2xl font-extrabold">{fit.outcome}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">Available</p>
                <p className="text-2xl font-extrabold">${fit.available.toFixed(0)}</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Fair split + travel timing</h3>
            <p className="text-sm text-slate-700">
              Split deposits and vacations, and see when to book based on your departure date.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <Slider label={`Total $${deposit}`} min={100} max={6000} value={deposit} onChange={setDeposit} />
              <Slider label={`Days until trip ${daysOut}`} min={5} max={130} value={daysOut} onChange={setDaysOut} />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {split.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="font-medium text-slate-800">{s.name}</span>
                  <strong className="text-slate-900">${s.share}</strong>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
              <Compass className="h-4 w-4" /> Travel timing: <strong>{travel.label}</strong>
              <span className="ml-auto text-xs">window {travel.windowStart} → {travel.windowEnd}</span>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 text-white shadow-2xl">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold md:text-4xl">Make your next money decision smarter.</h2>
              <p className="mt-3 max-w-xl text-indigo-100">
                Start on the free Starter plan. Upgrade to Pro for unlimited tracking, advanced splits,
                and real-time travel alerts.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                See plans
              </Link>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-indigo-100">
            {["No card to start", "Cancel anytime", "Privacy-first AI", "Bank-grade security"].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Check className="h-4 w-4" /> {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-800">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-600"
      />
    </label>
  );
}
