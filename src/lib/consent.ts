"use client";

import { useEffect, useState } from "react";

/**
 * Cookie / tracking consent management.
 *
 * Two categories:
 *   - "essential": always on. Auth session, session cookies, etc.
 *   - "analytics": PostHog usage tracking. Default OFF until user opts in.
 *
 * Persists user choice in localStorage so we don't re-prompt on every visit.
 *
 * Designed to be GDPR/CCPA-friendly:
 *   - No tracking before explicit consent.
 *   - User can withdraw consent any time via the footer's "Cookie preferences"
 *     link, which reopens the banner.
 */

const STORAGE_KEY = "tally.consent.v1";

export type ConsentChoice = {
  essential: true;
  analytics: boolean;
  /** Unix ms when the user made the choice. */
  decidedAt: number;
};

const DEFAULT: ConsentChoice = {
  essential: true,
  analytics: false,
  decidedAt: 0,
};

const CONSENT_EVENT = "tally:consent-changed";

export function readConsent(): ConsentChoice {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    return {
      essential: true,
      analytics: parsed.analytics === true,
      decidedAt: typeof parsed.decidedAt === "number" ? parsed.decidedAt : 0,
    };
  } catch {
    return DEFAULT;
  }
}

export function writeConsent(choice: Omit<ConsentChoice, "essential" | "decidedAt">) {
  if (typeof window === "undefined") return;
  const next: ConsentChoice = {
    essential: true,
    analytics: choice.analytics,
    decidedAt: Date.now(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: DEFAULT }),
  );
}

/** True once the user has made any choice (accept or reject). */
export function hasDecided(consent: ConsentChoice): boolean {
  return consent.decidedAt > 0;
}

/**
 * React hook that exposes the current consent choice and re-renders when it
 * changes (across tabs and within the same tab).
 */
export function useConsent(): ConsentChoice {
  const [consent, setConsent] = useState<ConsentChoice>(DEFAULT);

  useEffect(() => {
    setConsent(readConsent());

    const handleChange = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return consent;
}

/** Imperative trigger to reopen the banner from anywhere on the site. */
export function openConsentBanner() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tally:consent-open"));
}
