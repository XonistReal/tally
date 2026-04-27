import { LandingExperience } from "@/components/landing-experience";
import { legal } from "@/lib/legal";
import { pricing } from "@/lib/integrations";

/**
 * JSON-LD structured data tells search engines exactly what this site is and
 * how to display it. The Organization + SoftwareApplication objects help
 * Google understand the brand and pricing for rich results.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${legal.siteUrl}/#organization`,
      name: legal.companyName,
      url: legal.siteUrl,
      logo: `${legal.siteUrl}/icon.svg`,
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        email: legal.supportEmail,
        contactType: "customer support",
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${legal.siteUrl}/#website`,
      url: legal.siteUrl,
      name: legal.brand,
      publisher: { "@id": `${legal.siteUrl}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${legal.siteUrl}/#app`,
      name: legal.brand,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: legal.siteUrl,
      description:
        "Tally helps you decide if a purchase fits your budget, track cash, split costs fairly, time travel bookings, and stay tax-ready with smart receipts.",
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "0",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: String(pricing.pro.monthly),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(pricing.pro.monthly),
            priceCurrency: "USD",
            unitText: "MONTH",
          },
        },
        {
          "@type": "Offer",
          name: "Pro+",
          price: String(pricing.pro_plus.monthly),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(pricing.pro_plus.monthly),
            priceCurrency: "USD",
            unitText: "MONTH",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingExperience />
    </>
  );
}
