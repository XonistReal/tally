"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Compass,
  Download,
  Pencil,
  Plane,
  Plus,
  Receipt,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { makeId, useLocalStorage } from "@/lib/use-local-storage";
import { cashCategories, packingTemplates, taxTags } from "@/lib/mock-data";
import {
  applySplitMethod,
  computeSplitShares,
  evaluatePurchaseFit,
  settlementSummary,
  travelTimingFor,
} from "@/lib/finance";
import type {
  BudgetContext,
  CashEntry,
  PackingItem,
  PackingList,
  ReceiptRecord,
  SplitMethod,
  SplitProject,
  TravelWatch,
  TripType,
} from "@/lib/types";

const todayISO = () => new Date().toISOString().slice(0, 10);

export function BudgetTab() {
  const { value: budget, setValue: setBudget, hydrated } = useLocalStorage<BudgetContext>(
    "fc:budget",
    { monthlyIncome: 0, monthlyBills: 0, savingsFloor: 0 },
  );
  const [planned, setPlanned] = useState(0);

  const fit = useMemo(
    () => evaluatePurchaseFit(budget.monthlyIncome, budget.monthlyBills, planned, budget.savingsFloor),
    [budget, planned],
  );

  const fitColor =
    fit.outcome === "Safe"
      ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
      : fit.outcome === "Caution"
      ? "text-amber-700 bg-amber-50 ring-amber-200"
      : "text-rose-700 bg-rose-50 ring-rose-200";

  if (!hydrated) return <Skeleton />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Your monthly money" icon={Settings2}>
        <p className="mt-2 text-sm text-slate-700">
          Update your numbers anytime. Saved locally on this device.
        </p>
        <div className="mt-4 space-y-3">
          <Field
            label="Monthly take-home income"
            type="number"
            value={budget.monthlyIncome}
            onChange={(v) => setBudget({ ...budget, monthlyIncome: Number(v) })}
            prefix="$"
          />
          <Field
            label="Monthly recurring bills"
            type="number"
            value={budget.monthlyBills}
            onChange={(v) => setBudget({ ...budget, monthlyBills: Number(v) })}
            prefix="$"
          />
          <Field
            label="Savings floor"
            type="number"
            value={budget.savingsFloor}
            onChange={(v) => setBudget({ ...budget, savingsFloor: Number(v) })}
            prefix="$"
            help="Minimum you want to keep untouched each month."
          />
        </div>
      </Card>

      <Card title="Purchase fit check" icon={Wallet}>
        <p className="mt-2 text-sm text-slate-700">
          Test a planned purchase against your real numbers.
        </p>
        <Field
          label="Planned purchase amount"
          type="number"
          value={planned}
          onChange={(v) => setPlanned(Number(v))}
          prefix="$"
          className="mt-4"
        />
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${fitColor}`}>
              {fit.outcome}
            </span>
            <span className="text-xs font-semibold text-slate-700">{fit.confidence}% confidence</span>
          </div>
          <p className="mt-3 text-sm text-slate-800">{fit.explanation}</p>
          <p className="mt-2 text-xs text-slate-700">
            Available headroom this month: <strong>${fit.available.toFixed(0)}</strong>
          </p>
        </div>
      </Card>
    </div>
  );
}

export function CashTab() {
  const { value: entries, setValue: setEntries, hydrated } = useLocalStorage<CashEntry[]>("fc:cash", []);
  const [draft, setDraft] = useState<Omit<CashEntry, "id">>({
    amount: 0,
    merchant: "",
    category: cashCategories[0],
    date: todayISO(),
    note: "",
  });

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  if (!hydrated) return <Skeleton />;

  const addEntry = () => {
    if (!draft.merchant || draft.amount <= 0) return;
    setEntries([{ id: makeId(), ...draft }, ...entries]);
    setDraft({ amount: 0, merchant: "", category: cashCategories[0], date: todayISO(), note: "" });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      <Card title="Log cash spending" icon={Plus}>
        <div className="mt-4 space-y-3">
          <Field
            label="Amount"
            type="number"
            value={draft.amount}
            onChange={(v) => setDraft({ ...draft, amount: Number(v) })}
            prefix="$"
          />
          <Field
            label="Merchant"
            value={draft.merchant}
            onChange={(v) => setDraft({ ...draft, merchant: String(v) })}
            placeholder="Coffee shop, taxi, market…"
          />
          <Select
            label="Category"
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
            options={cashCategories}
          />
          <Field
            label="Date"
            type="date"
            value={draft.date}
            onChange={(v) => setDraft({ ...draft, date: String(v) })}
          />
          <Field
            label="Note (optional)"
            value={draft.note ?? ""}
            onChange={(v) => setDraft({ ...draft, note: String(v) })}
          />
          <button onClick={addEntry} className="primaryBtn">
            Add cash entry
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card title={`Total cash spending: $${total.toFixed(2)}`} icon={Wallet}>
          {byCategory.length === 0 ? (
            <Empty text="No cash spending yet. Add your first entry." />
          ) : (
            <div className="mt-4 space-y-2">
              {byCategory.map(([cat, amount]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-800">{cat}</span>
                  <strong className="text-slate-900">${amount.toFixed(2)}</strong>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent entries" icon={Calendar}>
          {entries.length === 0 ? (
            <Empty text="Entries you add will show here." />
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {entries.slice(0, 8).map((e) => (
                <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{e.merchant}</p>
                    <p className="text-xs text-slate-700">
                      {e.category} · {e.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <strong className="text-slate-900">${e.amount.toFixed(2)}</strong>
                    <button
                      onClick={() => setEntries(entries.filter((x) => x.id !== e.id))}
                      className="text-slate-400 hover:text-rose-600"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export function SplitsTab() {
  const { value: projects, setValue: setProjects, hydrated } = useLocalStorage<SplitProject[]>(
    "fc:splits",
    [],
  );
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTotal, setDraftTotal] = useState(0);

  if (!hydrated) return <Skeleton />;

  const createProject = () => {
    if (!draftTitle || draftTotal <= 0) return;
    const proj: SplitProject = {
      id: makeId(),
      title: draftTitle,
      total: draftTotal,
      method: "equal",
      members: [],
      createdAt: todayISO(),
    };
    setProjects([proj, ...projects]);
    setDraftTitle("");
    setDraftTotal(0);
  };

  return (
    <div className="space-y-6">
      <Card title="New split project" icon={Plus}>
        <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
          <Field
            label="Title"
            value={draftTitle}
            onChange={(v) => setDraftTitle(String(v))}
            placeholder="Beach house deposit"
          />
          <Field
            label="Total cost"
            type="number"
            value={draftTotal}
            onChange={(v) => setDraftTotal(Number(v))}
            prefix="$"
          />
          <button onClick={createProject} className="primaryBtn md:self-end">
            Create
          </button>
        </div>
      </Card>

      {projects.length === 0 ? (
        <Empty text="No split projects yet. Create one to get started." />
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <SplitProjectCard
              key={p.id}
              project={p}
              onUpdate={(next) =>
                setProjects(projects.map((x) => (x.id === next.id ? next : x)))
              }
              onDelete={() => setProjects(projects.filter((x) => x.id !== p.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SplitProjectCard({
  project,
  onUpdate,
  onDelete,
}: {
  project: SplitProject;
  onUpdate: (p: SplitProject) => void;
  onDelete: () => void;
}) {
  const [memberName, setMemberName] = useState("");
  const [memberWeight, setMemberWeight] = useState(1);
  const shares = computeSplitShares(project);
  const settlement = settlementSummary(project);

  const setMethod = (method: SplitMethod) => {
    const updated = applySplitMethod(method, project.members);
    onUpdate({ ...project, method, members: updated });
  };

  const addMember = () => {
    if (!memberName) return;
    const m = {
      id: makeId(),
      name: memberName,
      weight: memberWeight || 1,
      paid: false,
    };
    onUpdate({ ...project, members: [...project.members, m] });
    setMemberName("");
    setMemberWeight(1);
  };

  return (
    <Card
      title={project.title}
      icon={Users}
      action={
        <button onClick={onDelete} className="text-slate-400 hover:text-rose-600" aria-label="Delete project">
          <Trash2 className="h-4 w-4" />
        </button>
      }
    >
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
        <span>
          Total: <strong className="text-slate-900">${project.total}</strong>
        </span>
        <span>
          Collected: <strong className="text-emerald-700">${settlement.collected}</strong> / Owed{" "}
          <strong className="text-rose-700">${settlement.owed}</strong>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["equal", "weighted", "percentage"] as SplitMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              project.method === m
                ? "bg-slate-900 text-white"
                : "border border-slate-300 bg-white text-slate-800"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
        <Field label="Add person" value={memberName} onChange={(v) => setMemberName(String(v))} />
        <Field
          label={project.method === "percentage" ? "%" : "Weight"}
          type="number"
          value={memberWeight}
          onChange={(v) => setMemberWeight(Number(v))}
        />
        <button onClick={addMember} className="primaryBtn md:self-end">
          Add
        </button>
      </div>

      {project.members.length === 0 ? (
        <p className="mt-4 text-sm text-slate-700">Add at least one person to compute fair shares.</p>
      ) : (
        <ul className="mt-4 space-y-2 text-sm">
          {project.members.map((m) => {
            const share = shares.find((s) => s.memberId === m.id)?.share ?? 0;
            return (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={m.paid}
                    onChange={(e) =>
                      onUpdate({
                        ...project,
                        members: project.members.map((x) =>
                          x.id === m.id ? { ...x, paid: e.target.checked } : x,
                        ),
                      })
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  <span className={`font-medium ${m.paid ? "text-slate-500 line-through" : "text-slate-900"}`}>
                    {m.name}
                  </span>
                  <span className="text-xs text-slate-700">
                    {project.method === "percentage" ? `${m.weight}%` : `weight ${m.weight}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <strong className="text-slate-900">${share.toFixed(2)}</strong>
                  <button
                    onClick={() =>
                      onUpdate({ ...project, members: project.members.filter((x) => x.id !== m.id) })
                    }
                    className="text-slate-400 hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export function PackingTab() {
  const { value: lists, setValue: setLists, hydrated } = useLocalStorage<PackingList[]>(
    "fc:packing",
    [],
  );
  const [name, setName] = useState("");
  const [tripType, setTripType] = useState<TripType>("business");

  if (!hydrated) return <Skeleton />;

  const createList = () => {
    if (!name) return;
    const items: PackingItem[] = (packingTemplates[tripType] ?? []).map((t) => ({
      id: makeId(),
      name: t,
      packed: false,
    }));
    setLists([
      { id: makeId(), name, tripType, items, createdAt: todayISO() },
      ...lists,
    ]);
    setName("");
  };

  return (
    <div className="space-y-6">
      <Card title="New packing list" icon={Plus}>
        <div className="mt-4 grid gap-3 md:grid-cols-[2fr_1fr_auto]">
          <Field
            label="Trip name"
            value={name}
            onChange={(v) => setName(String(v))}
            placeholder="Tokyo, March"
          />
          <Select
            label="Trip type"
            value={tripType}
            onChange={(v) => setTripType(v as TripType)}
            options={Object.keys(packingTemplates)}
          />
          <button onClick={createList} className="primaryBtn md:self-end">
            Create list
          </button>
        </div>
      </Card>

      {lists.length === 0 ? (
        <Empty text="No packing lists yet. Templates adapt by trip type once created." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lists.map((list) => (
            <PackingListCard
              key={list.id}
              list={list}
              onUpdate={(next) => setLists(lists.map((x) => (x.id === next.id ? next : x)))}
              onDelete={() => setLists(lists.filter((x) => x.id !== list.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PackingListCard({
  list,
  onUpdate,
  onDelete,
}: {
  list: PackingList;
  onUpdate: (l: PackingList) => void;
  onDelete: () => void;
}) {
  const [item, setItem] = useState("");
  const packedCount = list.items.filter((i) => i.packed).length;

  const addItem = () => {
    if (!item) return;
    onUpdate({
      ...list,
      items: [...list.items, { id: makeId(), name: item, packed: false }],
    });
    setItem("");
  };

  return (
    <Card
      title={`${list.name} · ${list.tripType}`}
      icon={Plane}
      action={
        <button onClick={onDelete} className="text-slate-400 hover:text-rose-600" aria-label="Delete list">
          <Trash2 className="h-4 w-4" />
        </button>
      }
    >
      <p className="mt-2 text-xs font-semibold text-slate-700">
        {packedCount}/{list.items.length} packed
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="Add item"
          className="textInput flex-1"
        />
        <button onClick={addItem} className="primaryBtn">
          Add
        </button>
      </div>
      {list.items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-700">Empty list — add anything you need.</p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-2">
          {list.items.map((i) => (
            <li
              key={i.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={i.packed}
                  onChange={(e) =>
                    onUpdate({
                      ...list,
                      items: list.items.map((x) =>
                        x.id === i.id ? { ...x, packed: e.target.checked } : x,
                      ),
                    })
                  }
                  className="h-4 w-4 accent-indigo-600"
                />
                <span
                  className={`font-medium ${
                    i.packed ? "text-slate-500 line-through" : "text-slate-900"
                  }`}
                >
                  {i.name}
                </span>
              </label>
              <button
                onClick={() =>
                  onUpdate({ ...list, items: list.items.filter((x) => x.id !== i.id) })
                }
                className="text-slate-400 hover:text-rose-600"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function TravelTab() {
  const { value: watches, setValue: setWatches, hydrated } = useLocalStorage<TravelWatch[]>(
    "fc:travel",
    [],
  );
  const [draft, setDraft] = useState<Omit<TravelWatch, "id" | "createdAt">>({
    origin: "",
    destination: "",
    departDate: todayISO(),
    returnDate: "",
    flexibilityDays: 3,
    maxBudget: 500,
  });

  if (!hydrated) return <Skeleton />;

  const addWatch = () => {
    if (!draft.origin || !draft.destination || !draft.departDate) return;
    setWatches([
      { id: makeId(), createdAt: todayISO(), ...draft },
      ...watches,
    ]);
  };

  return (
    <div className="space-y-6">
      <Card title="Plan a trip" icon={Plane}>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field
            label="Origin"
            value={draft.origin}
            onChange={(v) => setDraft({ ...draft, origin: String(v) })}
            placeholder="NYC"
          />
          <Field
            label="Destination"
            value={draft.destination}
            onChange={(v) => setDraft({ ...draft, destination: String(v) })}
            placeholder="London"
          />
          <Field
            label="Departure date"
            type="date"
            value={draft.departDate}
            onChange={(v) => setDraft({ ...draft, departDate: String(v) })}
          />
          <Field
            label="Return date (optional)"
            type="date"
            value={draft.returnDate ?? ""}
            onChange={(v) => setDraft({ ...draft, returnDate: String(v) })}
          />
          <Field
            label="Flexibility (± days)"
            type="number"
            value={draft.flexibilityDays}
            onChange={(v) => setDraft({ ...draft, flexibilityDays: Number(v) })}
          />
          <Field
            label="Max budget per ticket"
            type="number"
            value={draft.maxBudget}
            onChange={(v) => setDraft({ ...draft, maxBudget: Number(v) })}
            prefix="$"
          />
        </div>
        <button onClick={addWatch} className="primaryBtn mt-4">
          Save trip + get timing
        </button>
      </Card>

      {watches.length === 0 ? (
        <Empty text="No trips yet. Add a trip to see when to book." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {watches.map((w) => {
            const signal = travelTimingFor(w.departDate, w.flexibilityDays, w.maxBudget);
            const color =
              signal.label === "Buy Now"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : signal.label === "Watch Closely"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-slate-100 text-slate-700 ring-slate-200";
            return (
              <Card
                key={w.id}
                title={`${w.origin} → ${w.destination}`}
                icon={Compass}
                action={
                  <button
                    onClick={() => setWatches(watches.filter((x) => x.id !== w.id))}
                    className="text-slate-400 hover:text-rose-600"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                }
              >
                <p className="mt-2 text-sm text-slate-700">
                  Depart <strong>{w.departDate}</strong>
                  {w.returnDate ? (
                    <>
                      {" "}
                      · Return <strong>{w.returnDate}</strong>
                    </>
                  ) : null}{" "}
                  · ±{w.flexibilityDays} days · max ${w.maxBudget}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${color}`}>
                    {signal.label}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{signal.score}% confidence</span>
                </div>
                <p className="mt-3 text-sm text-slate-800">{signal.rationale}</p>
                <p className="mt-1 text-xs text-slate-700">
                  Suggested booking window:{" "}
                  <strong>
                    {signal.windowStart} → {signal.windowEnd}
                  </strong>
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ReceiptsTab() {
  const { value: receipts, setValue: setReceipts, hydrated } = useLocalStorage<ReceiptRecord[]>(
    "fc:receipts",
    [],
  );
  const [draft, setDraft] = useState<Omit<ReceiptRecord, "id">>({
    merchant: "",
    amount: 0,
    category: cashCategories[0],
    date: todayISO(),
    taxTag: taxTags[0],
    note: "",
    imageDataUrl: undefined,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!hydrated) return <Skeleton />;

  const totalDeductible = receipts
    .filter((r) => r.taxTag === "Tax Deductible" || r.taxTag === "Business Expense")
    .reduce((s, r) => s + r.amount, 0);

  const addReceipt = () => {
    if (!draft.merchant || draft.amount <= 0) return;
    if (editingId) {
      setReceipts(receipts.map((r) => (r.id === editingId ? { id: editingId, ...draft } : r)));
      setEditingId(null);
    } else {
      setReceipts([{ id: makeId(), ...draft }, ...receipts]);
    }
    setDraft({
      merchant: "",
      amount: 0,
      category: cashCategories[0],
      date: todayISO(),
      taxTag: taxTags[0],
      note: "",
      imageDataUrl: undefined,
    });
  };

  const onImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, imageDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const exportCsv = async () => {
    const res = await fetch("/api/receipts/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receipts: receipts.map((r) => ({
          id: r.id,
          merchant: r.merchant,
          amount: r.amount,
          category: r.category,
          date: r.date,
          taxTag: r.taxTag,
        })),
      }),
    });
    const csv = await res.text();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt-export.csv";
    a.click();
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      <Card title={editingId ? "Edit receipt" : "Add receipt"} icon={Receipt}>
        <div className="mt-4 space-y-3">
          <Field label="Merchant" value={draft.merchant} onChange={(v) => setDraft({ ...draft, merchant: String(v) })} />
          <Field
            label="Amount"
            type="number"
            value={draft.amount}
            onChange={(v) => setDraft({ ...draft, amount: Number(v) })}
            prefix="$"
          />
          <Select
            label="Category"
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
            options={cashCategories}
          />
          <Field
            label="Date"
            type="date"
            value={draft.date}
            onChange={(v) => setDraft({ ...draft, date: String(v) })}
          />
          <Select
            label="Tax / reimbursement tag"
            value={draft.taxTag}
            onChange={(v) => setDraft({ ...draft, taxTag: v })}
            options={taxTags}
          />
          <Field
            label="Note"
            value={draft.note ?? ""}
            onChange={(v) => setDraft({ ...draft, note: String(v) })}
          />
          <label className="block text-xs font-semibold text-slate-700">
            Receipt photo (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && onImage(e.target.files[0])}
              className="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-900 hover:file:bg-slate-50"
            />
          </label>
          {draft.imageDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.imageDataUrl}
              alt="Receipt preview"
              className="mt-2 max-h-40 rounded-lg border border-slate-200"
            />
          )}
          <div className="flex gap-2">
            <button onClick={addReceipt} className="primaryBtn">
              {editingId ? (
                <>
                  <Save className="h-4 w-4" /> Save changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add receipt
                </>
              )}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setDraft({
                    merchant: "",
                    amount: 0,
                    category: cashCategories[0],
                    date: todayISO(),
                    taxTag: taxTags[0],
                    note: "",
                  });
                }}
                className="secondaryBtn"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card title={`Saved receipts (${receipts.length})`} icon={Receipt}>
          <div className="mt-2 flex items-center justify-between text-sm">
            <p className="text-slate-700">
              Deductible/Business: <strong>${totalDeductible.toFixed(2)}</strong>
            </p>
            <button onClick={exportCsv} className="secondaryBtn">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
          {receipts.length === 0 ? (
            <Empty text="No receipts yet. Add your first one for tax season." />
          ) : (
            <ul className="mt-3 space-y-3">
              {receipts.map((r) => (
                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {r.merchant} · ${r.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-700">
                        {r.category} · {r.taxTag} · {r.date}
                      </p>
                      {r.note && <p className="mt-1 text-sm text-slate-800">{r.note}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(r.id);
                          setDraft({
                            merchant: r.merchant,
                            amount: r.amount,
                            category: r.category,
                            date: r.date,
                            taxTag: r.taxTag,
                            note: r.note,
                            imageDataUrl: r.imageDataUrl,
                          });
                        }}
                        className="text-slate-500 hover:text-slate-900"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setReceipts(receipts.filter((x) => x.id !== r.id))}
                        className="text-slate-400 hover:text-rose-600"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {r.imageDataUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.imageDataUrl}
                      alt="Receipt"
                      className="mt-3 max-h-40 rounded-lg border border-slate-200"
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export function OverviewTab({ goTab }: { goTab: (id: TabId) => void }) {
  const { value: budget } = useLocalStorage<BudgetContext>("fc:budget", {
    monthlyIncome: 0,
    monthlyBills: 0,
    savingsFloor: 0,
  });
  const { value: cash } = useLocalStorage<CashEntry[]>("fc:cash", []);
  const { value: receipts } = useLocalStorage<ReceiptRecord[]>("fc:receipts", []);
  const { value: splits } = useLocalStorage<SplitProject[]>("fc:splits", []);
  const { value: trips } = useLocalStorage<TravelWatch[]>("fc:travel", []);

  const cashTotal = cash.reduce((s, e) => s + e.amount, 0);
  const headroom = Math.max(0, budget.monthlyIncome - budget.monthlyBills - budget.savingsFloor);

  const tiles = [
    {
      label: "Cash logged",
      value: `$${cashTotal.toFixed(2)}`,
      sub: `${cash.length} entries`,
      go: "cash" as TabId,
    },
    {
      label: "Headroom",
      value: `$${headroom.toFixed(0)}`,
      sub: budget.monthlyIncome ? "Available for purchases" : "Set up your budget",
      go: "budget" as TabId,
    },
    {
      label: "Active splits",
      value: String(splits.length),
      sub: splits.length ? "Tap to settle up" : "Create your first split",
      go: "splits" as TabId,
    },
    {
      label: "Trips watching",
      value: String(trips.length),
      sub: trips.length ? "Real-time signals on Pro" : "Add a trip to test timing",
      go: "travel" as TabId,
    },
    {
      label: "Receipts saved",
      value: String(receipts.length),
      sub: receipts.length ? "Export anytime" : "Snap your first receipt",
      go: "receipts" as TabId,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <button
            key={t.label}
            onClick={() => goTab(t.go)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">{t.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{t.value}</p>
            <p className="mt-1 text-sm text-slate-700">{t.sub}</p>
            <p className="mt-3 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">Open →</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
          <Sparkles className="h-4 w-4" /> Tip
        </div>
        <p className="mt-2 text-slate-800">
          Set your monthly income and bills first — most features get sharper once your budget context is real.
        </p>
        <button onClick={() => goTab("budget")} className="primaryBtn mt-4">
          Set up budget
        </button>
      </div>
    </div>
  );
}

export type TabId = "overview" | "budget" | "cash" | "splits" | "packing" | "travel" | "receipts";

function Card({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="font-semibold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  prefix,
  help,
  className,
}: {
  label: string;
  value: string | number;
  onChange: (v: string | number) => void;
  type?: string;
  placeholder?: string;
  prefix?: string;
  help?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
        {prefix && <span className="mr-1 text-sm font-semibold text-slate-700">{prefix}</span>}
        <input
          type={type}
          value={value as string}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      {help && <span className="mt-1 block text-xs text-slate-700">{help}</span>}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="textInput"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-4 grid place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
      <Check className="h-5 w-5 text-slate-400" />
      <p className="mt-2 text-sm text-slate-700">{text}</p>
    </div>
  );
}

function Skeleton() {
  return <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />;
}
