import type { MetadataRoute } from "next";
import { legal } from "@/lib/legal";

/**
 * Auto-generates /robots.txt. Lets crawlers index marketing/legal pages,
 * blocks user-specific and programmatic routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/dashboard", "/login", "/auth/"],
      },
    ],
    sitemap: `${legal.siteUrl}/sitemap.xml`,
    host: legal.siteUrl,
  };
}
