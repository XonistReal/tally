import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "packing-list";

export const metadata: Metadata = {
  title: "Smart packing lists by trip type",
  description:
    "Tally's packing lists start with a smart template for your trip type — beach, business, ski, festival, and more — then learn what you actually pack so the next list gets sharper.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "Packing lists that learn from you",
    description:
      "Trip-type templates, custom edits that stick, reusable across every trip.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "packing list app",
    "packing list by trip type",
    "smart packing checklist",
    "vacation packing list",
    "business trip packing list",
    "ski trip packing list",
    "reusable packing list",
  ],
};

export default function PackingListPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Smart packing lists"
      title="Packing lists that learn what you actually bring."
      intro="Generic packing checklists are wrong twice: they include things you don't need and miss things you always forget. Tally starts you with a smart template tuned to your trip type, then remembers your tweaks so the next list is closer to perfect."
      metaDescription="Smart packing lists by trip type that learn from your edits. Reuse and refine across every trip you take."
      bullets={[
        "Templates for beach, business, ski, festival, hiking, and more",
        "Edits stick — your changes carry to next trip",
        "Per-traveler lists for family trips",
        "Check items off as you pack",
        "Available offline so you can use it from the airport",
        "Free for the first list, Pro for unlimited",
      ]}
      steps={[
        {
          title: "Pick a trip type",
          body: "Beach, business, ski, festival, hiking, road trip, urban — each loaded with a smart starter list.",
        },
        {
          title: "Edit once, learn forever",
          body: "Add 'AirPods' or remove 'rain jacket' once and Tally remembers. Future trips of the same type start from your version.",
        },
        {
          title: "Pack it off",
          body: "Check items as you pack. Tally tracks your progress so you know whether you're ready an hour or three days out.",
        },
      ]}
      builtFor={[
        {
          persona: "Frequent business travelers",
          outcome:
            "Stop rebuilding the same list every Sunday night. One refined list does every Monday-to-Thursday trip.",
        },
        {
          persona: "Families",
          outcome:
            "Per-traveler sub-lists so each kid's stuff is tracked separately without merging into chaos.",
        },
        {
          persona: "Outdoor enthusiasts",
          outcome:
            "Specialized templates for ski, hike, surf, and bike trips with the gear most apps forget.",
        },
        {
          persona: "Forget-something-every-time travelers",
          outcome:
            "If you always forget the charger or the Allegra, Tally adds it once and never lets you forget again.",
        },
      ]}
      faqs={[
        {
          q: "How is this smarter than a generic checklist?",
          a: "Tally stores your edits per trip type. The first time you remove 'umbrella' from your beach list, it's gone forever from beach lists. The first time you add 'noise-canceling headphones' to a business list, it's there on every business trip after.",
        },
        {
          q: "Can I share a list with family or a partner?",
          a: "Pro+ adds shared lists. You can assign items to a specific person so nobody packs duplicates and no toiletries get left at home.",
        },
        {
          q: "Does it work offline?",
          a: "Yes. Lists are cached locally so you can check items off in airport mode or anywhere with no signal. Edits sync the next time you reconnect.",
        },
        {
          q: "Do trip types come pre-populated?",
          a: "Yes — every type ships with a thoughtful starter list curated from common forgotten items (chargers, adapters, contact case, prescriptions). You always edit on top.",
        },
        {
          q: "Is it free?",
          a: "Starter includes one saved list. Pro adds unlimited lists, per-traveler sub-lists, and template imports.",
        },
      ]}
    />
  );
}
