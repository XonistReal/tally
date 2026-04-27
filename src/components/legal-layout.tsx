import Link from "next/link";
import { ArrowLeft, Tally5 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { effectiveDateLabel, legal } from "@/lib/legal";

export function LegalLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">{legal.brand}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          {legal.companyName}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: {effectiveDateLabel()}
        </p>
        {intro ? (
          <p className="mt-6 text-lg text-slate-700">{intro}</p>
        ) : null}

        <div className="legal-prose mt-10 space-y-6 text-base leading-7 text-slate-700">
          {children}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
