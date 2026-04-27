import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tally.app";
const tagline = "Money decisions, made calmer";
const description =
  "Tally helps you decide if a purchase fits your budget, track cash, split costs fairly, time travel bookings, and stay tax-ready with smart receipts.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Tally — ${tagline}`,
    template: "%s · Tally",
  },
  description,
  applicationName: "Tally",
  keywords: [
    "Tally",
    "personal finance",
    "budget app",
    "cash tracking",
    "split costs",
    "travel deals",
    "receipt OCR",
    "tax receipts",
  ],
  authors: [{ name: "Tally" }],
  openGraph: {
    type: "website",
    siteName: "Tally",
    title: `Tally — ${tagline}`,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `Tally — ${tagline}`,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
