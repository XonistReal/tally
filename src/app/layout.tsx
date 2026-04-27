import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { legal } from "@/lib/legal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tagline = "Money decisions, made calmer";
const description =
  "Tally helps you decide if a purchase fits your budget, track cash, split costs fairly, time travel bookings, and stay tax-ready with smart receipts.";

export const metadata: Metadata = {
  metadataBase: new URL(legal.siteUrl),
  title: {
    default: `${legal.brand} — ${tagline}`,
    template: `%s · ${legal.brand}`,
  },
  description,
  applicationName: legal.brand,
  alternates: { canonical: "/" },
  keywords: [
    "Tally",
    "personal finance app",
    "budget app",
    "cash spending tracker",
    "split expenses fairly",
    "vacation expense splitter",
    "travel booking timing",
    "receipt tracking",
    "tax receipts app",
    "personal budgeting software",
    "purchase decision tool",
  ],
  authors: [{ name: legal.companyName, url: legal.siteUrl }],
  creator: legal.companyName,
  publisher: legal.companyName,
  category: "finance",
  openGraph: {
    type: "website",
    siteName: legal.brand,
    title: `${legal.brand} — ${tagline}`,
    description,
    url: legal.siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${legal.brand} — ${tagline}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { email: false, telephone: false },
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
      </body>
    </html>
  );
}
