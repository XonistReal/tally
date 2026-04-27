import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tallyfinance.online";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null;

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

// Pinned per the upgrade-stripe skill. The SDK's `apiVersion` field is typed
// against the SDK's bundled `LatestApiVersion`, so this literal is a compile-
// time guarantee that we're targeting the version we tested against.
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
      appInfo: {
        name: "Tally",
        url: SITE_URL,
      },
      typescript: true,
    })
  : null;

export type TierKey = "starter" | "pro" | "pro_plus";

export const pricing: Record<
  TierKey,
  { name: string; monthly: number; priceIdEnv: string }
> = {
  starter: { name: "Starter", monthly: 0, priceIdEnv: "" },
  pro: { name: "Pro", monthly: 12, priceIdEnv: "STRIPE_PRICE_PRO" },
  pro_plus: { name: "Pro+", monthly: 24, priceIdEnv: "STRIPE_PRICE_PRO_PLUS" },
};

export function priceIdFor(tier: TierKey): string | undefined {
  const envName = pricing[tier].priceIdEnv;
  if (!envName) return undefined;
  const id = process.env[envName];
  return id && id.trim().length > 0 ? id : undefined;
}
