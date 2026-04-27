import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "receipt-tracker";

export const metadata: Metadata = {
  title: "Receipt tracker for taxes and reimbursements",
  description:
    "Tally turns paper receipts into a tax-ready, reimbursement-ready archive. Snap, categorize, tag, and export a clean CSV anytime — no shoebox required.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "Receipts for taxes — done.",
    description:
      "Snap, categorize, tag, and export. Tally keeps your receipts ready for taxes, reimbursements, and audits.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "receipt tracker",
    "receipt scanner app",
    "tax receipt organizer",
    "reimbursement tracker",
    "expense receipts app",
    "small business receipts",
    "1099 receipt app",
    "self employed expense tracker",
  ],
};

export default function ReceiptTrackerPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Tax-ready receipts"
      title="Snap a receipt now, save hours at tax time."
      intro="The hardest part of taxes is the part nobody writes about: finding all the receipts. Tally lets you capture them in five seconds, tag them with the right deduction category, and export a clean CSV your accountant or reimbursement form will love."
      metaDescription="Track receipts for taxes and reimbursements. Snap, categorize, tag, and export a clean CSV anytime."
      bullets={[
        "Five-second capture: photo + amount + category",
        "Built-in tax tags (Schedule C, business meal, mileage, etc.)",
        "Search by merchant, date, amount, or tag",
        "Notes per receipt for context",
        "Export a clean CSV any time",
        "Receipts stored in a private encrypted bucket",
      ]}
      steps={[
        {
          title: "Snap or upload",
          body: "Take a photo of the paper receipt or drop in an emailed PDF. Tally stores it in your private receipts vault.",
        },
        {
          title: "Tag it once",
          body: "Pick a category and a tax tag (we ship with a tax-tag set tuned for US Schedule C and common reimbursement codes).",
        },
        {
          title: "Export when needed",
          body: "At tax time or reimbursement deadlines, export a CSV filtered to exactly what you need. Send it to your accountant or upload it to your expense system.",
        },
      ]}
      builtFor={[
        {
          persona: "Freelancers and 1099 workers",
          outcome:
            "Schedule C deductions live in one place. No April scramble through Gmail and a shoebox.",
        },
        {
          persona: "Side-hustlers",
          outcome:
            "Mix business and personal? Tag only the business ones. Tally never blends them.",
        },
        {
          persona: "Employees with reimbursable expenses",
          outcome:
            "Hit a reimbursement deadline without missing a receipt. Export a single CSV that maps to your company's expense form.",
        },
        {
          persona: "Small-business owners",
          outcome:
            "When your accountant asks for last September's office-supply receipts, you have them in 30 seconds.",
        },
      ]}
      faqs={[
        {
          q: "Is OCR included?",
          a: "Yes for Pro. Pro reads merchant, amount, and date from the photo so you only confirm the category. Starter is manual entry.",
        },
        {
          q: "Where are my receipts stored?",
          a: "In a private Supabase storage bucket scoped to your user ID. Encrypted at rest. Only you can access them.",
        },
        {
          q: "What categories and tags ship by default?",
          a: "Categories cover meals, supplies, travel, software, mileage, education, and more. Tax tags include Schedule C lines, common business-meal designations, and reimbursement codes. You can add your own.",
        },
        {
          q: "Can I export to my accountant's format?",
          a: "We export to a clean CSV with merchant, date, amount, category, tag, and notes. Most accountants and expense platforms accept that directly. We can also tune exports for QuickBooks if you ask.",
        },
        {
          q: "Is it free?",
          a: "Starter includes 20 receipts a month — fine for occasional reimbursements. Pro removes the cap and adds OCR. Pro+ adds shared receipt vaults and accountant-ready packets.",
        },
      ]}
    />
  );
}
