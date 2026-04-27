import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, Tally5 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { legal } from "@/lib/legal";

export type FaqEntry = { q: string; a: string };

export type FeatureLayoutProps = {
  /** URL slug, e.g. "cash-tracker". Used in canonical/breadcrumb. */
  slug: string;
  /** Big H1 visible on the page. */
  title: string;
  /** One-sentence eyebrow above the H1, e.g. "Cash spending tracker". */
  eyebrow: string;
  /** Hero subtitle / value prop paragraph. */
  intro: string;
  /** Bullet checklist shown next to the hero. */
  bullets: string[];
  /** Three "How it works" steps. */
  steps: Array<{ title: string; body: string }>;
  /** "Built for…" rows: who this is for. */
  builtFor: Array<{ persona: string; outcome: string }>;
  /** FAQ — also serialized as FAQPage JSON-LD for rich results. */
  faqs: FaqEntry[];
  /** Optional right-rail demo / preview node. */
  preview?: React.ReactNode;
  /** Hand-tuned plain-text description used as <meta name="description">. */
  metaDescription: string;
};

/**
 * Reusable layout for /features/* pages. Each page wraps this and supplies
 * keyword-tuned copy. Includes:
 *   - SEO-friendly H1 + eyebrow
 *   - Breadcrumb back to /features
 *   - "How it works" 3-step walkthrough
 *   - "Built for…" personas (great for long-tail intent matching)
 *   - FAQ accordion + FAQPage JSON-LD for Google rich results
 *   - CTA into /pricing
 */
export function FeatureLayout(props: FeatureLayoutProps) {
  const {
    slug,
    title,
    eyebrow,
    intro,
    bullets,
    steps,
    builtFor,
    faqs,
    preview,
  } = props;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: legal.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Features",
        item: `${legal.siteUrl}/features`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: eyebrow,
        item: `${legal.siteUrl}/features/${slug}`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-indigo-500/40">
              <Tally5 className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="text-lg">{legal.brand}</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Link href="/features" className="hidden hover:text-slate-900 sm:inline">
              All features
            </Link>
            <Link href="/pricing" className="hidden hover:text-slate-900 sm:inline">
              Pricing
            </Link>
            <Link
              href="/login?redirect=%2Fdashboard"
              className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
            >
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-12 md:pt-16">
          <Link
            href="/features"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All features
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                {eyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-700">{intro}</p>

              <ul className="mt-6 grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b} className="inline-flex items-start gap-2">
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md bg-emerald-50 text-emerald-700">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/login?redirect=%2Fdashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  See pricing
                </Link>
              </div>
            </div>

            <div className="relative">{preview}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            From open to answer in under a minute
          </h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <article
              key={s.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold text-indigo-600">
                Step {i + 1}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-slate-700">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Built for
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Made for the way you actually live
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {builtFor.map((row) => (
              <div
                key={row.persona}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {row.persona}
                </p>
                <p className="mt-1 text-slate-700">{row.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Frequently asked
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Answers, before you ask
          </h2>
        </div>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-10 text-center shadow-sm">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Try it free in 30 seconds
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-700">
            No credit card to start. Upgrade only when {legal.brand} is saving
            you real time and money.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login?redirect=%2Fdashboard"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
