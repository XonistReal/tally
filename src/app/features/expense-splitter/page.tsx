import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "expense-splitter";

export const metadata: Metadata = {
  title: "Fair expense splitter — split deposits, trips, and group costs",
  description:
    "Tally splits one-time costs fairly: rent deposits, vacations, group dinners. Equal, weighted, or percentage rules with built-in settle-up tracking.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "Split rent deposits and vacations the fair way",
    description:
      "Equal, weighted, or percentage splits with settle-up tracking — no spreadsheet required.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "expense splitter",
    "split bills app",
    "split rent deposit fairly",
    "vacation expense calculator",
    "group expense tracker",
    "split costs proportionally",
    "weighted expense split",
    "settle up expenses",
  ],
};

export default function ExpenseSplitterPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Fair expense splitter"
      title="Split rent deposits, trips, and dinners — fairly, in 30 seconds."
      intro="Equal splits work for pizza. They don't work when one roommate has the master bedroom or one friend joined the trip late. Tally lets you split any one-time cost three ways: equal, weighted (by room size, days attended, etc.), or by exact percentages — and then tracks who has paid whom."
      metaDescription="Split deposits, vacations, and group costs fairly with equal, weighted, or percentage rules. Built-in settle-up tracking."
      bullets={[
        "Three split methods: equal, weighted, percentage",
        "Settle-up tracking — see who owes whom at a glance",
        "Notes per project (purpose, dates, links to receipts)",
        "Export a clean breakdown to share with the group",
        "Free plan handles your first split project",
        "Pro unlocks unlimited projects and templates",
      ]}
      steps={[
        {
          title: "Create the project",
          body: "Name it (Cabo trip, Apartment 4B deposit, Sam's birthday dinner). Add the people involved.",
        },
        {
          title: "Pick the split method",
          body: "Equal for true 50/50. Weighted when stays differ in length or rooms differ in size. Percentage when you've already agreed on numbers.",
        },
        {
          title: "Mark payments as they happen",
          body: "Tally shows running balances and the smallest set of payments needed to settle up. No 'who paid the Airbnb' debates.",
        },
      ]}
      builtFor={[
        {
          persona: "Roommates moving in",
          outcome:
            "Split the deposit by room size or move-in date. Save the project and reuse the rules for utilities.",
        },
        {
          persona: "Trip planners",
          outcome:
            "Split the rental, the rental car, and the group dinners separately. Settle up once at the end.",
        },
        {
          persona: "Friend groups",
          outcome:
            "When one person is the credit-card host, Tally tracks reimbursements clearly without nagging texts.",
        },
        {
          persona: "Couples + extended family",
          outcome:
            "Holiday gift pools, joint gifts, shared travel — track everyone's contribution without an awkward spreadsheet.",
        },
      ]}
      faqs={[
        {
          q: "How is this different from Splitwise?",
          a: "Tally focuses on one-time, intentional projects (a deposit, a trip, a group event) rather than ongoing roommate ledgers. The split methods are richer — weighted and percentage rules are first-class — and exports are cleaner if you want to forward to a group chat or accountant.",
        },
        {
          q: "Can it handle a deposit returned at the end of a lease?",
          a: "Yes. Mark the project as Settled when paid in, then reopen and reverse it on return. Tally adjusts each person's balance using the same method you originally used.",
        },
        {
          q: "Does it track who actually paid?",
          a: "Yes. Each project has a line for 'paid by' so the host gets correctly reimbursed. Tally calculates the optimal set of payments to zero everyone out.",
        },
        {
          q: "Can I export the breakdown?",
          a: "Yes. CSV export with each line item, who owes whom, and a final settle-up summary. Perfect for sending to the group chat.",
        },
        {
          q: "Is it free?",
          a: "Starter includes one active split project. Pro and Pro+ allow unlimited projects, templates, and saved member groups.",
        },
      ]}
    />
  );
}
