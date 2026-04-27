import Link from "next/link";
import { Tally5 } from "lucide-react";
import { legal } from "@/lib/legal";
import { CookiePreferencesLink } from "@/components/cookie-preferences-link";

/**
 * Public site footer. Used on the landing page, pricing page, and all legal
 * pages. Not used inside the dashboard (which has its own focused header) or
 * the auth screens.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold tracking-tight text-slate-900"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
                <Tally5 className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="text-lg">{legal.brand}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-600">
              Money decisions, made calmer. Know what you can afford, track
              cash, split fairly, and stay tax-ready.
            </p>
            <a
              href={`mailto:${legal.supportEmail}`}
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              {legal.supportEmail}
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                <Link href="/" className="hover:text-slate-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-slate-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-slate-900">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                <Link href="/terms" className="hover:text-slate-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-slate-900">
                  Refund Policy
                </Link>
              </li>
              <li>
                <CookiePreferencesLink />
              </li>
              <li>
                <a
                  href={`mailto:${legal.supportEmail}`}
                  className="hover:text-slate-900"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {legal.companyName}. All rights reserved.
          </p>
          <p>
            Built with care · Payments by Stripe · Hosted on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
