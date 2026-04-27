import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "cash-tracker";

export const metadata: Metadata = {
  title: "Cash spending tracker — log cash in seconds",
  description:
    "Most budget apps only see card transactions. Tally's cash tracker is built for the dollars you actually spend in cash — fast logging, real categories, no bank login required.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "A budget app that actually tracks cash",
    description:
      "Log cash spending in seconds and see your real burn rate, not just what your card says.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "cash spending tracker",
    "track cash expenses",
    "cash budget app",
    "manual expense tracker",
    "log cash purchases",
    "envelope budgeting cash",
    "expense tracker no bank login",
  ],
};

export default function CashTrackerPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Cash spending tracker"
      title="A budget app that actually sees your cash."
      intro="If you tip in cash, hit cash-only food trucks, or take a stipend in twenties, you've probably noticed: every other budget app pretends that money doesn't exist. Tally's cash tracker is built for it. Three taps to log a $7 coffee or a $200 utility bill paid in cash."
      metaDescription="Track cash spending fast with Tally's manual cash logger. No bank login, real categories, instant burn-rate updates."
      bullets={[
        "Three-tap entry: amount → merchant → category",
        "Built-in categories tuned for cash spending",
        "Notes for context (who you were with, what it was for)",
        "Shows up immediately in your daily totals",
        "Works offline — entries sync when you reconnect",
        "Export to CSV for taxes or splitting",
      ]}
      steps={[
        {
          title: "Tap the cash tab",
          body: "Open Tally, hit Cash. The form is the first thing you see. No drilling through menus.",
        },
        {
          title: "Log it in seconds",
          body: "Enter the amount, who you paid, and pick a category from a tight list designed for cash transactions (coffee, transit, tips, groceries, kids).",
        },
        {
          title: "See the truth",
          body: "Your spending charts now reflect both card and cash, not just half the picture. Set a soft cap and Tally warns you when you're close.",
        },
      ]}
      builtFor={[
        {
          persona: "Service-industry workers",
          outcome:
            "Tips and walking-around money finally show up where they belong — in your real burn rate.",
        },
        {
          persona: "Travelers and ex-pats",
          outcome:
            "Track foreign-currency cash without a bank link. Convert to USD on export.",
        },
        {
          persona: "Cash-allowance budgeters",
          outcome:
            "If you pull a weekly cash allowance, Tally watches it without re-entering every transaction in a spreadsheet.",
        },
        {
          persona: "Privacy-minded users",
          outcome:
            "No Plaid, no bank login, no transaction enrichment. The data lives in your account and nowhere else.",
        },
      ]}
      faqs={[
        {
          q: "Why don't most budget apps track cash?",
          a: "They're built around bank-API feeds. If a transaction never touches your card, the app never sees it. Tally treats manual entry as a first-class feature instead of an afterthought.",
        },
        {
          q: "How fast is it really?",
          a: "About 8 seconds per entry once you're used to it: amount, merchant, category, save. The form remembers your most-used categories and merchants.",
        },
        {
          q: "Can I split cash entries between people?",
          a: "Yes — log the cash entry, then create a Split linked to it. Tally handles the math and shows who owes whom. Perfect for cash-paid restaurant bills.",
        },
        {
          q: "Does the free plan have a limit?",
          a: "Starter includes 25 cash entries a month, which covers most casual users. Pro removes the limit if you log heavily or track daily.",
        },
        {
          q: "Can I use it for foreign currency?",
          a: "Yes. Pick the currency at entry time. Exports include both the original amount and the USD equivalent at the date you logged it.",
        },
      ]}
    />
  );
}
