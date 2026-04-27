import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `When and how to get a refund on your ${legal.brand} subscription.`,
  alternates: { canonical: `${legal.siteUrl}/refunds` },
  robots: { index: true, follow: true },
};

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      intro={`We want you to feel good about subscribing. If ${legal.brand} isn't a fit, here's how refunds work.`}
    >
      <h2>14-day money-back guarantee on first payment</h2>
      <p>
        If you are unhappy with your subscription for any reason, email us at{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>{" "}
        within <strong>14 days</strong> of your first payment and we will issue
        a full refund. No questionnaire, no pushback. We just ask that you
        tell us why so we can improve.
      </p>

      <h2>After the first 14 days</h2>
      <p>
        Subscriptions auto-renew monthly. After the first 14 days we generally
        do not issue refunds for partial months. You can cancel any time from
        the billing portal in your account; cancellation takes effect at the
        end of the current period and you keep access until then.
      </p>
      <p>
        We will consider exceptions on a case-by-case basis if:
      </p>
      <ul>
        <li>You were charged due to a clear billing error on our end.</li>
        <li>
          A duplicate charge was created during a checkout retry or system
          glitch.
        </li>
        <li>
          You experienced an extended service outage that materially impaired
          your ability to use the product.
        </li>
      </ul>
      <p>
        If any of the above applies, email us at{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a> and
        we&apos;ll work it out.
      </p>

      <h2>How refunds are processed</h2>
      <p>
        Approved refunds are issued to the original payment method through
        Stripe. They typically appear on your statement within 5–10 business
        days, though your card issuer or bank may take longer. We are not
        able to refund to a different card or account.
      </p>

      <h2>Free trials and the Starter plan</h2>
      <p>
        The Starter plan is free and does not require a refund. If we offer
        a free trial of a paid plan, we will tell you the trial length and
        when billing begins before you start; you can cancel at any time
        during the trial without being charged.
      </p>

      <h2>Chargebacks</h2>
      <p>
        Please email us before disputing a charge with your card issuer.
        Almost every issue can be resolved faster by talking with us first,
        and chargebacks cost both of us money. Filing a chargeback for a
        valid charge may result in suspension of your account.
      </p>

      <h2>Contact</h2>
      <p>
        Refund requests, billing questions, or anything else:{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>. We
        usually reply within one business day.
      </p>
    </LegalLayout>
  );
}
