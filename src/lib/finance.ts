import type {
  PurchaseOutcome,
  SplitMember,
  SplitMethod,
  SplitProject,
} from "@/lib/types";

export function evaluatePurchaseFit(
  income: number,
  recurringBills: number,
  plannedSpend: number,
  savingsFloor: number,
) {
  const safeIncome = Math.max(0, income);
  const safeBills = Math.max(0, recurringBills);
  const safeFloor = Math.max(0, savingsFloor);
  const available = safeIncome - safeBills - safeFloor;

  if (available <= 0) {
    return {
      outcome: "NotRecommended" as PurchaseOutcome,
      available: 0,
      confidence: 5,
      explanation:
        "Your bills and savings target use up your income. Add buffer income or reduce bills before this purchase.",
    };
  }

  const ratio = plannedSpend / available;
  let outcome: PurchaseOutcome = "Safe";
  let explanation = "Comfortably within your monthly headroom.";

  if (ratio > 0.6) {
    outcome = "NotRecommended";
    explanation = "This would consume more than 60% of your discretionary headroom. Consider waiting or breaking it up.";
  } else if (ratio > 0.35) {
    outcome = "Caution";
    explanation = "You can afford this, but it leaves limited room for unplanned spending this month.";
  }

  return {
    outcome,
    available,
    confidence: Math.max(5, Math.min(99, Math.round((1 - ratio) * 100))),
    explanation,
  };
}

export function computeSplitShares(project: SplitProject) {
  const { members, total, method } = project;
  if (members.length === 0) return [] as Array<{ memberId: string; share: number }>;

  if (method === "equal") {
    const each = total / members.length;
    return members.map((m) => ({ memberId: m.id, share: round2(each) }));
  }

  if (method === "percentage") {
    const totalWeight = members.reduce((sum, m) => sum + m.weight, 0) || 100;
    return members.map((m) => ({
      memberId: m.id,
      share: round2((total * m.weight) / totalWeight),
    }));
  }

  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0) || 1;
  return members.map((m) => ({
    memberId: m.id,
    share: round2((total * m.weight) / totalWeight),
  }));
}

export function splitWeighted(total: number, members: Array<Pick<SplitMember, "name" | "weight">>) {
  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0) || 1;
  return members.map((m) => ({
    name: m.name,
    share: round2((total * m.weight) / totalWeight),
  }));
}

export function settlementSummary(project: SplitProject) {
  const shares = computeSplitShares(project);
  const paidMemberIds = new Set(project.members.filter((m) => m.paid).map((m) => m.id));
  const collected = shares
    .filter((s) => paidMemberIds.has(s.memberId))
    .reduce((sum, s) => sum + s.share, 0);
  const owed = project.total - collected;
  return { collected: round2(collected), owed: round2(owed) };
}

export type TravelSignal = {
  label: "Buy Now" | "Watch Closely" | "Wait";
  score: number;
  rationale: string;
  windowStart: string;
  windowEnd: string;
};

export function travelBuyWindowSignal(daysOut: number, volatility: number): {
  label: TravelSignal["label"];
  score: number;
} {
  const score = Math.max(0, 100 - daysOut * 0.9 - volatility * 15);
  if (score >= 65) return { label: "Buy Now", score };
  if (score >= 40) return { label: "Watch Closely", score };
  return { label: "Wait", score };
}

export function travelTimingFor(
  departDate: string,
  flexibilityDays: number,
  budget: number,
  marketVolatility = 2,
): TravelSignal {
  const today = new Date();
  const depart = new Date(departDate);
  const daysOut = Math.max(0, Math.round((depart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const flexAdjustment = Math.min(flexibilityDays, 14) * 1.5;
  const budgetPressure = budget < 200 ? 10 : budget < 500 ? 5 : 0;
  const score = Math.max(
    0,
    Math.min(100, 100 - daysOut * 0.8 - marketVolatility * 12 + flexAdjustment - budgetPressure),
  );

  let label: TravelSignal["label"] = "Wait";
  let rationale = "Prices typically still soften this far out. Watch for drops.";
  if (daysOut <= 21) {
    label = "Buy Now";
    rationale = "Inside the typical price-rise window for flights and hotels. Lock in soon.";
  } else if (daysOut <= 60) {
    label = "Watch Closely";
    rationale = "You're approaching the historical sweet spot. Set an alert and act on dips.";
  }

  const windowStart = new Date(today);
  const windowEnd = new Date(today);

  if (label === "Buy Now") {
    windowEnd.setDate(today.getDate() + 7);
  } else if (label === "Watch Closely") {
    windowStart.setDate(today.getDate() + 7);
    windowEnd.setDate(today.getDate() + 21);
  } else {
    windowStart.setDate(today.getDate() + Math.max(7, daysOut - 60));
    windowEnd.setDate(today.getDate() + Math.max(14, daysOut - 30));
  }

  return {
    label,
    score: Math.round(score),
    rationale,
    windowStart: windowStart.toISOString().slice(0, 10),
    windowEnd: windowEnd.toISOString().slice(0, 10),
  };
}

export function applySplitMethod(method: SplitMethod, members: SplitMember[]): SplitMember[] {
  if (method === "equal") {
    return members.map((m) => ({ ...m, weight: 1 }));
  }
  if (method === "percentage") {
    const each = members.length > 0 ? Math.round(100 / members.length) : 0;
    return members.map((m) => ({ ...m, weight: each }));
  }
  return members;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
