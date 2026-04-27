import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${legal.brand}, including subscription billing, acceptable use, and dispute resolution.`,
  alternates: { canonical: `${legal.siteUrl}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      intro={`These terms are a contract between you and ${legal.companyName} ("we," "us," "${legal.brand}"). By creating an account or paying for a subscription you agree to them. Please read them carefully.`}
    >
      <h2>1. The service</h2>
      <p>
        {legal.brand} is a personal finance web application that helps you
        evaluate purchases against your budget, log cash spending, split shared
        costs, plan packing and travel timing, and store receipts. We may add,
        change, or remove features at our discretion. We will give reasonable
        notice before removing features that are part of a paid plan.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <p>
        You must be at least 18 years old (or the age of majority in your
        jurisdiction) to use {legal.brand}. You are responsible for keeping
        your sign-in email secure and for all activity under your account. Tell
        us at{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a> if
        you suspect unauthorized access.
      </p>

      <h2>3. Subscriptions and billing</h2>
      <p>
        We offer a free Starter plan and paid Pro and Pro+ plans. Paid plans
        are billed monthly through Stripe. By subscribing you authorize
        {" "}{legal.brand} and Stripe to charge your payment method on a
        recurring basis until you cancel.
      </p>
      <ul>
        <li>
          <strong>Renewal.</strong> Subscriptions auto-renew at the end of each
          billing period at the then-current price.
        </li>
        <li>
          <strong>Price changes.</strong> We will give at least 14 days&apos;
          notice by email before any price increase. Continued use after the
          change takes effect constitutes acceptance.
        </li>
        <li>
          <strong>Cancellation.</strong> You may cancel any time from the
          billing portal in your account. Cancellation takes effect at the end
          of the current period; you keep access until then.
        </li>
        <li>
          <strong>Failed payments.</strong> If a charge fails, we may downgrade
          your account to Starter until payment is restored.
        </li>
        <li>
          <strong>Refunds.</strong> See our{" "}
          <a href="/refunds">Refund Policy</a>.
        </li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use {legal.brand} for any unlawful, harmful, or fraudulent purpose.</li>
        <li>
          Attempt to gain unauthorized access to other accounts, our systems,
          or our service providers.
        </li>
        <li>
          Reverse engineer, decompile, or scrape the service except to the
          extent required by law.
        </li>
        <li>
          Resell, sublicense, or expose the service as a product to third
          parties without our written permission.
        </li>
        <li>
          Upload content you do not have the rights to, including receipts
          containing other people&apos;s personal information without their
          consent.
        </li>
      </ul>

      <h2>5. Your content</h2>
      <p>
        You retain ownership of the financial data, receipts, and notes you
        upload (&quot;Your Content&quot;). You grant us a limited, non-exclusive
        license to host, transmit, and display Your Content solely to operate
        the service for you. We do not sell or share Your Content for
        advertising.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The {legal.brand} name, logo, software, and website are owned by
        {" "}{legal.companyName}. Nothing in these terms transfers ownership of
        our intellectual property to you. Feedback you send us may be used
        without obligation.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        {legal.brand} relies on third parties to operate, including Stripe
        (payments), Supabase (database and auth), and Vercel (hosting). Your
        use of those services through {legal.brand} is also subject to their
        terms and privacy policies. We are not responsible for outages or
        actions of third-party services beyond our reasonable control.
      </p>

      <h2>8. Disclaimer — not financial advice</h2>
      <p>
        {legal.brand} provides budgeting, tracking, and decision-support
        features for informational purposes only. We are not a bank, broker,
        tax preparer, or registered financial advisor. Nothing in the service
        constitutes financial, investment, tax, or legal advice. You are
        solely responsible for the financial decisions you make. Consult a
        qualified professional for advice specific to your situation.
      </p>

      <h2>9. &quot;As is&quot; and limitation of liability</h2>
      <p>
        The service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind, whether express or implied, including
        warranties of merchantability, fitness for a particular purpose, and
        non-infringement, to the maximum extent permitted by law.
      </p>
      <p>
        To the maximum extent permitted by law, {legal.companyName}&apos;s
        total liability arising out of or relating to these terms or the
        service will not exceed the greater of (a) the amount you paid us in
        the twelve months before the claim arose, or (b) USD $50. Neither
        party will be liable for indirect, incidental, special, consequential,
        or punitive damages.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify and hold {legal.companyName} harmless from any
        claims, losses, or expenses (including reasonable attorneys&apos; fees)
        arising from your misuse of the service or your violation of these
        terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the service and close your account at any time. We
        may suspend or terminate your account if you violate these terms or
        misuse the service. On termination, your access ends and we will
        delete your data on the schedule described in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>12. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Material changes will be
        announced by email or in-app notice at least 14 days before they take
        effect. Continued use of the service after the effective date means
        you accept the updated terms.
      </p>

      <h2>13. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of the State of{" "}
        {legal.governingState}, United States, without regard to its
        conflict-of-laws rules. Any dispute will be resolved in the state or
        federal courts located in {legal.governingState}, and you and we
        consent to personal jurisdiction there. If a provision of these terms
        is found unenforceable, the rest will remain in effect.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these terms? Email us at{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>.
      </p>
    </LegalLayout>
  );
}
