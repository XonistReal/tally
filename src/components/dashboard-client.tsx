"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Briefcase,
  LayoutDashboard,
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

const TABS: Array<{ id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "budget", label: "Budget & fit", icon: Wallet },
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "splits", label: "Splits", icon: Users },
  { id: "travel", label: "Travel timing", icon: Plane },
  { id: "packing", label: "Packing", icon: Briefcase },
  { id: "receipts", label: "Receipts", icon: Receipt },
];

export function DashboardClient() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">Tally</span>
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Upgrade to Pro · ${pricing.pro.monthly}/mo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
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
