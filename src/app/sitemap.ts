import type { MetadataRoute } from "next";
import { legal } from "@/lib/legal";

/**
 * Auto-generates /sitemap.xml. Submit this URL in Google Search Console and
 * Bing Webmaster Tools so the legal/marketing pages get indexed quickly.
 *
 * /dashboard, /login, /auth/*, and /api/* are intentionally excluded — they
 * are user-specific or programmatic and should not be in search results.
 */
const featureSlugs = [
  "purchase-fit-check",
  "cash-tracker",
  "expense-splitter",
  "packing-list",
  "travel-timing",
  "receipt-tracker",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = legal.siteUrl;
  const lastModified = new Date(legal.effectiveDate);

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/features`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...featureSlugs.map((slug) => ({
      url: `${base}/features/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${base}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/refunds`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
