"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import {
  hasDecided,
  readConsent,
  useConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * GDPR/CCPA-friendly consent banner. Shown on first visit and re-openable
 * from the footer's "Cookie preferences" link.
 *
 * Renders only after mount so SSR markup matches client markup (no hydration
 * mismatch from localStorage reads).
 */
export function CookieConsentBanner() {
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(false);

  useEffect(() => {
    setMounted(true);
    // First visit (no decision yet) → show automatically.
    if (!hasDecided(readConsent())) {
      setOpen(true);
    }

    const reopen = () => {
      setAnalyticsChoice(readConsent().analytics);
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener("tally:consent-open", reopen);
    return () => window.removeEventListener("tally:consent-open", reopen);
  }, []);

  if (!mounted || !open) return null;

  const acceptAll = () => {
    writeConsent({ analytics: true });
    setOpen(false);
    setShowDetails(false);
  };

  const rejectNonEssential = () => {
    writeConsent({ analytics: false });
    setOpen(false);
    setShowDetails(false);
  };

  const saveCustom = () => {
    writeConsent({ analytics: analyticsChoice });
    setOpen(false);
    setShowDetails(false);
  };

  // Initialize the toggle to current value when the user opens "Customize".
  const toggleDetails = () => {
    if (!showDetails) setAnalyticsChoice(consent.analytics);
    setShowDetails(!showDetails);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="hidden h-10 w-10 flex-none place-items-center rounded-xl bg-indigo-50 text-indigo-700 sm:grid">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-slate-900">
              We use cookies to keep Tally working
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              Essential cookies keep you signed in and the app running.
              Optional analytics cookies help us understand which features
              matter to you. You&apos;re in control —{" "}
              <Link
                href="/privacy"
                className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
              >
                privacy policy
              </Link>
              .
            </p>

            {showDetails ? (
              <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Essential
                    </p>
                    <p className="text-xs text-slate-600">
                      Authentication, security, and core app functionality.
                      Cannot be turned off.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Always on
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-slate-200 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Analytics
                    </p>
                    <p className="text-xs text-slate-600">
                      Anonymous usage tracking via PostHog so we can improve
                      the product. Never sold or shared for advertising.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAnalyticsChoice((v) => !v)}
                    role="switch"
                    aria-checked={analyticsChoice}
                    className={`relative h-6 w-11 flex-none rounded-full transition ${
                      analyticsChoice ? "bg-indigo-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        analyticsChoice ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reject non-essential
              </button>
              {showDetails ? (
                <button
                  type="button"
                  onClick={saveCustom}
                  className="rounded-full border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  Save preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleDetails}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <Settings2 className="h-4 w-4" /> Customize
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={rejectNonEssential}
            aria-label="Close and reject non-essential"
            className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
