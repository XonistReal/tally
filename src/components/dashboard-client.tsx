"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Plane,
  Receipt,
  Tally5,
  Users,
  Wallet,
} from "lucide-react";
import {
  BudgetTab,
  CashTab,
  OverviewTab,
  PackingTab,
  ReceiptsTab,
  SplitsTab,
  type TabId,
  TravelTab,
} from "@/components/dashboard-tabs";
import { pricing } from "@/lib/integrations";
import { signOut } from "@/app/login/actions";

const TABS: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "budget", label: "Budget & fit", icon: Wallet },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "splits", label: "Splits", icon: Users },
  { id: "travel", label: "Travel timing", icon: Plane },
  { id: "packing", label: "Packing", icon: Briefcase },
  { id: "receipts", label: "Receipts", icon: Receipt },
];

type Subscription = {
  tier: string;
  status: string;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
} | null;

export function DashboardClient({
  email,
  subscription,
}: {
  email: string | null;
  subscription: Subscription;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const tier = isActive ? subscription?.tier ?? "starter" : "starter";

  // Upsell to the next tier above the user's current one. Pro+ is the top
  // tier, so once you're there we don't show an upsell at all.
  const upsellTier: "pro" | "pro_plus" | null =
    tier === "starter" ? "pro" : tier === "pro" ? "pro_plus" : null;
  const upsellLabel =
    upsellTier === "pro_plus" ? "Upgrade to Pro+" : "Upgrade to Pro";
  const upsellPrice = upsellTier ? pricing[upsellTier].monthly : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">Tally</span>
          </Link>

          <div className="flex items-center gap-2">
            {isActive ? (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {pricing[tier as keyof typeof pricing]?.name ?? tier} · active
              </span>
            ) : null}
            {upsellTier ? (
              <Link
                href="/pricing"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {upsellLabel} · ${upsellPrice}/mo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}

            {email ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {email.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[160px] truncate sm:inline">
                    {email}
                  </span>
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2 text-xs text-slate-500">
                      Signed in as
                      <div className="truncate font-semibold text-slate-900">
                        {email}
                      </div>
                    </div>
                    <div className="my-1 h-px bg-slate-100" />
                    {subscription?.stripe_customer_id ? (
                      <form action="/api/stripe/portal" method="POST">
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <CreditCard className="h-4 w-4" />
                          Manage billing
                        </button>
                      </form>
                    ) : (
                      <Link
                        href="/pricing"
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <CreditCard className="h-4 w-4" />
                        See plans
                      </Link>
                    )}
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href="/login?redirect=/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="overflow-x-auto">
          <div className="inline-flex gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  tab === id
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {tab === "overview" && <OverviewTab goTab={setTab} />}
          {tab === "budget" && <BudgetTab />}
          {tab === "cash" && <CashTab />}
          {tab === "splits" && <SplitsTab />}
          {tab === "packing" && <PackingTab />}
          {tab === "travel" && <TravelTab />}
          {tab === "receipts" && <ReceiptsTab />}
        </div>
      </div>
    </div>
  );
}
