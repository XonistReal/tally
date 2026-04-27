import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "purchase-fit-check";

export const metadata: Metadata = {
  title: "Purchase fit check — should I buy this?",
  description:
    "Tally's Purchase Fit Check tells you Safe / Caution / Wait on any purchase using your real income and bills. The simple yes-or-no answer most budget apps don't give you.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "Should I buy this? Tally tells you in seconds",
    description:
      "Get a clear Safe, Caution, or Wait verdict on any purchase based on your real numbers.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "should i buy this",
    "purchase decision tool",
    "can i afford this",
    "purchase fit calculator",
    "is this purchase smart",
    "budget fit checker",
    "buy or wait calculator",
  ],
};

export default function PurchaseFitPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Purchase decisions"
      title="Should I buy this? Get a clear yes-or-no in seconds."
      intro="Most budget apps tell you what you spent last week. Tally tells you what you can spend right now. Plug in your income and recurring bills once, then sanity-check any purchase before you commit."
      metaDescription="Decide whether a purchase fits your budget with a Safe, Caution, or Wait verdict from Tally."
      bullets={[
        "Safe / Caution / Wait verdict in one tap",
        "Honors your existing bills and savings buffer",
        "Adjustable spending guardrails",
        "No bank login required",
        "Works in the browser on any device",
        "Free to start",
      ]}
      steps={[
        {
          title: "Tell Tally your numbers",
          body: "Enter monthly take-home pay and recurring bills. Optional: a buffer you want to keep untouched.",
        },
        {
          title: "Type in the purchase",
          body: "Anything from a $40 dinner to a $1,400 laptop. Tally calculates how much wiggle room you have right now.",
        },
        {
          title: "Get a verdict",
          body: "Safe means you're well within your means. Caution means it's tight. Wait means the math doesn't work this month — and it tells you why.",
        },
      ]}
      builtFor={[
        {
          persona: "First-time budgeters",
          outcome:
            "Skip the spreadsheet. Get the answer most budget apps make you calculate yourself.",
        },
        {
          persona: "Impulse-shoppers in recovery",
          outcome:
            "A 10-second sanity check before clicking buy. Tally shows you the trade-off, not a guilt trip.",
        },
        {
          persona: "Big-purchase planners",
          outcome:
            "Run laptops, appliances, and travel through the calculator before you commit.",
        },
        {
          persona: "Couples sharing money",
          outcome:
            "A shared definition of 'we can afford it' that doesn't depend on whose week it is to feel responsible.",
        },
      ]}
      faqs={[
        {
          q: "How is this different from a regular budget app?",
          a: "Most budget apps are backwards-looking — they categorize what you already spent. Purchase Fit Check is forward-looking. It answers the actual question you have at checkout: can I afford this, right now, without breaking other commitments?",
        },
        {
          q: "Does Tally connect to my bank?",
          a: "No. Purchase Fit Check works entirely from numbers you enter yourself. That keeps it private, fast, and works even if your bank doesn't support open banking.",
        },
        {
          q: "What does Caution actually mean?",
          a: "Caution means the purchase fits, but it would push you below the buffer you set for yourself. Tally shows the exact dollar gap so you can decide whether to delay, downsize, or use a different account.",
        },
        {
          q: "Can I save scenarios for big purchases?",
          a: "Yes — on the free plan you can run unlimited what-if checks. Pro adds the ability to save scenarios and compare them side-by-side.",
        },
        {
          q: "Is it free?",
          a: "The Purchase Fit Check is in the free Starter plan. Pro adds advanced rules (e.g. excluding savings transfers from 'available') and more historical context.",
        },
      ]}
    />
  );
}
