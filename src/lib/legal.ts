/**
 * Single source of truth for legal documents and customer-support copy.
 *
 * When you finalize the business entity, replace `companyName` and (if needed)
 * `governingState` here. Every legal page reads from this file so updates are
 * one-edit-and-done.
 */

export const legal = {
  /** Customer-facing brand name used throughout the site. */
  brand: "Tally",

  /** Legal entity name. Update once an LLC/corporation is formed. */
  companyName: "Tally Finance",

  /** Where customers reach support and where Stripe sends disputes. */
  supportEmail: "support@tallyfinance.online",

  /** Public website URL (no trailing slash). */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.tallyfinance.online",

  /**
   * IMPORTANT — UPDATE BEFORE PUBLIC LAUNCH.
   * State/jurisdiction whose laws govern the Terms of Service. If you form a
   * Delaware LLC via Stripe Atlas, change this to "Delaware". Otherwise use
   * the state where the business is registered. Leaving this blank will make
   * the Terms display a visible "[YOUR STATE]" placeholder.
   */
  governingState: "[YOUR STATE]",

  /**
   * Last time the legal documents were materially updated. Bump this whenever
   * you change Terms / Privacy / Refunds so the "Last updated" line stays
   * honest. Keep ISO format YYYY-MM-DD.
   */
  effectiveDate: "2026-04-27",

  /**
   * Service providers we share data with. Listed individually in the Privacy
   * Policy so users (and regulators) can audit the chain.
   */
  subprocessors: [
    {
      name: "Stripe",
      purpose: "Payment processing and subscription billing",
      url: "https://stripe.com/privacy",
    },
    {
      name: "Supabase",
      purpose: "Database, authentication, and file storage",
      url: "https://supabase.com/privacy",
    },
    {
      name: "Vercel",
      purpose: "Web hosting and edge delivery",
      url: "https://vercel.com/legal/privacy-policy",
    },
    {
      name: "PostHog",
      purpose: "Product analytics (anonymous usage)",
      url: "https://posthog.com/privacy",
    },
  ],
} as const;

/** Format the effective date for display (e.g. "April 27, 2026"). */
export function effectiveDateLabel(): string {
  const date = new Date(legal.effectiveDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
