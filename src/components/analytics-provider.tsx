"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export function AnalyticsProvider() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: true,
      person_profiles: "identified_only",
    });
  }, []);

  return null;
}
