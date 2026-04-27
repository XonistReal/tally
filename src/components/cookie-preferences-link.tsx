"use client";

import { openConsentBanner } from "@/lib/consent";

export function CookiePreferencesLink({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openConsentBanner()}
      className={className ?? "hover:text-slate-900"}
    >
      Cookie preferences
    </button>
  );
}
