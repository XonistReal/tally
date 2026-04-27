import { DashboardClient } from "@/components/dashboard-client";
import { getServerSupabase } from "@/lib/supabase-server";

// Auth state must be evaluated on every request so signed-in users see their
// account info and unauthenticated users get sent to /login by middleware.
export const dynamic = "force-dynamic";

type SubscriptionRow = {
  tier: string;
  status: string;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
};

export default async function DashboardPage() {
  const supabase = await getServerSupabase();

  // The middleware already redirects unauthenticated users to /login, but in
  // the (rare) case Supabase env vars are missing the dashboard still loads
  // gracefully without account info.
  let email: string | null = null;
  let subscription: SubscriptionRow | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;

    if (user) {
      const { data } = await supabase
        .from("subscriptions")
        .select(
          "tier, status, stripe_customer_id, current_period_end, cancel_at_period_end",
        )
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      subscription = (data as SubscriptionRow | null) ?? null;
    }
  }

  return <DashboardClient email={email} subscription={subscription} />;
}
