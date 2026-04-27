"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

let posthogInitialized = false;

/**
 * PostHog initialization that honors cookie consent.
 *
 * On first load PostHog is initialized in opt-out mode — no events fire and
 * no persistent identifiers are written until the user explicitly accepts
 * analytics cookies. Toggling the consent in the banner flips PostHog
 * on/off live without requiring a page reload.
 */
export function AnalyticsProvider() {
  const consent = useConsent();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    if (!posthogInitialized) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        person_profiles: "identified_only",
        // Don't capture or persist anything until the user opts in.
        opt_out_capturing_by_default: true,
        disable_persistence: true,
        disable_session_recording: true,
      });
      posthogInitialized = true;
    }

    if (consent.analytics) {
      posthog.opt_in_capturing();
      posthog.set_config({ disable_persistence: false });
    } else {
      posthog.opt_out_capturing();
      posthog.set_config({ disable_persistence: true });
    }
  }, [consent.analytics]);

  return null;
}
