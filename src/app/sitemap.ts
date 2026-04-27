import type { MetadataRoute } from "next";
import { legal } from "@/lib/legal";

/**
 * Auto-generates /sitemap.xml. Submit this URL in Google Search Console and
 * Bing Webmaster Tools so the legal/marketing pages get indexed quickly.
 *
 * /dashboard, /login, /auth/*, and /api/* are intentionally excluded — they
 * are user-specific or programmatic and should not be in search results.
 */
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
