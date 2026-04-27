import type { Metadata } from "next";
import Link from "next/link";
import { Tally5 } from "lucide-react";
import { signInWithMagicLink } from "./actions";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${legal.brand} with a magic link sent to your email. No password required.`,
  alternates: { canonical: `${legal.siteUrl}/login` },
  // Login page should not be indexed — it's user-specific and stateful.
  robots: { index: false, follow: true },
};

type SearchParams = Promise<{
  error?: string;
  sent?: string;
  redirect?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const error = params.error;
  const sentTo = params.sent;
  const redirectTo = params.redirect ?? "/dashboard";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6 py-16">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
            <Tally5 className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span>Tally</span>
        </Link>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to Tally
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            We&apos;ll email you a one-tap login link. No password required.
          </p>

          {sentTo ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm ring-1 ring-emerald-200">
              <div className="font-semibold text-emerald-900">
                Check your inbox
              </div>
              <p className="mt-1 text-emerald-800">
                We sent a sign-in link to{" "}
                <span className="font-semibold">{sentTo}</span>. Open it on this
                device to continue.
              </p>
              <p className="mt-3 text-xs text-emerald-700">
                Didn&apos;t get it? Check spam, or{" "}
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="underline underline-offset-2"
                >
                  send another
                </Link>
                .
              </p>
            </div>
          ) : (
            <form action={signInWithMagicLink} className="mt-6 space-y-4">
              <input type="hidden" name="redirect" value={redirectTo} />
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </label>

              {error ? (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                Email me a sign-in link
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-slate-500">
            By continuing you agree to Tally&apos;s Terms and Privacy Policy. We
            never share your email.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to Tally?{" "}
          <Link
            href="/pricing"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            See pricing
          </Link>
        </p>
      </div>
    </div>
  );
}
