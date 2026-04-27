import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature-layout";
import { legal } from "@/lib/legal";

const slug = "travel-timing";

export const metadata: Metadata = {
  title: "When should I book this flight? Travel timing helper",
  description:
    "Tally's travel timing helper tells you whether to book or wait based on your specific dates and how flexible you are. Cut through the noise of generic 'book 6 weeks out' advice.",
  alternates: { canonical: `${legal.siteUrl}/features/${slug}` },
  openGraph: {
    title: "When should I book my flight? Tally tells you.",
    description:
      "A buy-now or wait signal tuned to your dates and flexibility — not a one-size-fits-all rule of thumb.",
    url: `${legal.siteUrl}/features/${slug}`,
  },
  keywords: [
    "when to book flights",
    "best time to book flights",
    "flight booking timing",
    "should i book my flight now",
    "hotel booking window",
    "cheapest day to book travel",
    "travel deal timing",
  ],
};

export default function TravelTimingPage() {
  return (
    <FeatureLayout
      slug={slug}
      eyebrow="Travel booking timing"
      title="Book now, or wait? A clear signal for your specific dates."
      intro="Generic travel advice — book six weeks out, fly Tuesdays, never on holidays — falls apart when you have actual dates and a budget. Tally's travel timing helper takes your departure date, flexibility, and price target and tells you whether to book today, watch a few more days, or hold off."
      metaDescription="Tally's travel timing helper tells you whether to book your flight or hotel now or wait, based on your specific dates and flexibility."
      bullets={[
        "Buy-now / watch / wait verdict for any trip",
        "Tuned to your departure date, not generic advice",
        "Factors in your flexibility (±1 day, ±3 days, exact)",
        "Tracks the price targets you set",
        "Real-time alerts on Pro when targets are hit",
        "Works for flights, hotels, and rental cars",
      ]}
      steps={[
        {
          title: "Tell Tally the trip",
          body: "Origin, destination, dates, and how flexible you are (exact, ±1 day, ±3 days, ±1 week).",
        },
        {
          title: "Set a price target",
          body: "Anchor a price you'd be happy paying. Tally compares the current quote against the seasonal pattern for your route.",
        },
        {
          title: "Get the signal",
          body: "Buy now, watch, or wait — with the reasoning. On Pro, Tally pings you if the target hits while you're still in the watch window.",
        },
      ]}
      builtFor={[
        {
          persona: "Date-locked travelers",
          outcome:
            "When you can't move dates (work trip, wedding, holidays), generic advice doesn't help. Tally tunes to your reality.",
        },
        {
          persona: "Flexible vacationers",
          outcome:
            "Plug in ±3 days and Tally tells you which dates within that range are cheapest to target.",
        },
        {
          persona: "Family planners",
          outcome:
            "Coordinating four travelers means you can't just pull the trigger on a flash sale. Tally tracks the right level of urgency.",
        },
        {
          persona: "Budget-conscious nomads",
          outcome:
            "Set a target and forget. Tally's alerts catch the deal you'd miss while working.",
        },
      ]}
      faqs={[
        {
          q: "Where do prices come from?",
          a: "Tally aggregates patterns from public flight and hotel data and your own observations. We don't try to be your booking engine — we tell you when to use the booking engine you already trust.",
        },
        {
          q: "Why a verdict instead of just a chart?",
          a: "Charts are interesting; decisions are useful. Most people don't want to interpret price-history graphs at 11 p.m. — they want a confident 'book it' or 'wait'. We default to the verdict and show the chart underneath if you want it.",
        },
        {
          q: "How accurate is it?",
          a: "Travel pricing is noisy and shaped by airline strategy, not just demand. Tally's signal is calibrated against historical patterns and improves with every trip. We'll never claim a guarantee, but we'll tell you why we said what we said.",
        },
        {
          q: "Do I get alerts?",
          a: "Pro adds real-time alerts: a one-line email or push notification the moment your target hits within the watch window. Starter shows you the verdict on demand without alerts.",
        },
        {
          q: "Does it cover hotels and rental cars?",
          a: "Yes for hotels — same logic, tuned for booking-window patterns. Rental cars are in the works and free for Pro+ once they ship.",
        },
      ]}
    />
  );
}
