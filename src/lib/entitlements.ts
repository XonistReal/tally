import type { Tier } from "@/lib/types";

export const tierCapabilities: Record<Tier, string[]> = {
  starter: [
    "25 monthly cash entries",
    "20 monthly receipts",
    "1 split project",
    "Delayed travel alerts",
  ],
  pro: [
    "Unlimited tracking",
    "Advanced split methods",
    "Real-time travel alerts",
    "Premium exports",
  ],
  pro_plus: [
    "Everything in Pro",
    "Family/team collaboration",
    "Accountant exports",
    "Priority support",
  ],
};

export function canAccessFeature(tier: Tier, feature: string) {
  if (tier === "pro_plus") return true;
  if (tier === "pro" && feature !== "teamCollaboration") return true;
  return feature === "basicTracking";
}
