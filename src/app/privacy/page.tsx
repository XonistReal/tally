import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";
import { legal } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${legal.brand} collects, uses, stores, and protects your personal information.`,
  alternates: { canonical: `${legal.siteUrl}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro={`This policy explains what data ${legal.brand} collects, why we collect it, how we use it, and the choices you have. We aim to keep this short and plain-English. If anything is unclear, email us at ${legal.supportEmail}.`}
    >
      <h2>1. What we collect</h2>

      <h3>Account data</h3>
      <ul>
        <li>
          <strong>Email address.</strong> Used to create your account, send you
          magic-link sign-in emails, and contact you about your subscription.
        </li>
        <li>
          <strong>Authentication data.</strong> A hashed session identifier so
          we can keep you signed in. We do not store passwords because we use
          passwordless magic-link sign-in.
        </li>
      </ul>

      <h3>Billing data</h3>
      <ul>
        <li>
          <strong>Subscription metadata.</strong> Plan tier, status, renewal
          date, and Stripe customer/subscription IDs.
        </li>
        <li>
          <strong>Payment details.</strong> We never see or store your full
          card number. Stripe handles all payment data and is PCI-DSS Level 1
          certified.
        </li>
      </ul>

      <h3>Application data</h3>
      <ul>
        <li>
          Financial inputs you enter (income, bills, purchase amounts, cash
          entries, splits, packing lists, travel plans).
        </li>
        <li>
          Receipt images and metadata you upload, stored in a private
          Supabase storage bucket scoped to your user ID.
        </li>
        <li>
          Some data is stored locally in your browser (localStorage) for
          immediate use without an account; that data never leaves your
          device unless you sign in and opt to sync.
        </li>
      </ul>

      <h3>Usage data</h3>
      <ul>
        <li>
          Anonymous product analytics (which pages you visit, which features
          you use) via PostHog. Used to improve {legal.brand}; not sold or
          shared for advertising.
        </li>
        <li>
          Standard server logs (IP address, user agent, timestamp) retained
          for up to 30 days for security and abuse prevention.
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To provide, operate, and improve the service.</li>
        <li>To process payments and manage your subscription.</li>
        <li>
          To respond to support requests and send service-related emails such
          as receipts, password-less sign-in links, and important account
          notices. We do not send marketing emails without your opt-in.
        </li>
        <li>To detect, prevent, and address fraud and security issues.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Service providers we share data with</h2>
      <p>
        We use a small set of trusted third parties (&quot;sub-processors&quot;)
        to run {legal.brand}. They are bound by contracts that limit how they
        may use your data and require appropriate security measures.
      </p>
      <ul>
        {legal.subprocessors.map((sub) => (
          <li key={sub.name}>
            <strong>{sub.name}.</strong> {sub.purpose}.{" "}
            <a href={sub.url} target="_blank" rel="noreferrer noopener">
              Their privacy policy
            </a>
            .
          </li>
        ))}
      </ul>
      <p>
        We do not sell your personal information, and we do not share it with
        advertisers or data brokers.
      </p>

      <h2>4. Where your data is stored</h2>
      <p>
        Your data is stored on infrastructure operated by Supabase (Postgres,
        in the region you selected when the project was created) and Vercel
        (edge cache and serverless functions). Stripe stores billing data on
        its own infrastructure. Data may be transferred to and processed in
        the United States and other countries where our service providers
        operate.
      </p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>
          <strong>Active accounts.</strong> We retain account and application
          data for as long as your account is open.
        </li>
        <li>
          <strong>Closed accounts.</strong> When you close your account, we
          delete personal data within 30 days, except for billing records we
          are required to retain for tax and accounting purposes (typically 7
          years).
        </li>
        <li>
          <strong>Backups.</strong> Backup copies are overwritten on a rolling
          schedule and may take up to 60 days to fully expire after deletion.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access,
        correct, export, or delete your personal data, and to object to or
        restrict certain processing. To exercise any of these rights, email
        us at{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a> from
        the address associated with your account. We will respond within 30
        days.
      </p>
      <p>
        California residents have additional rights under the CCPA/CPRA,
        including the right to know what data we hold about you and the right
        to opt out of the sale or sharing of personal data. We do not sell or
        share personal data within the meaning of those laws.
      </p>
      <p>
        If you are in the EEA, UK, or Switzerland, our lawful bases for
        processing are: (a) performance of a contract (to provide the
        service); (b) legitimate interests (to keep the service safe and to
        improve it); and (c) consent (where required, e.g. analytics
        cookies).
      </p>

      <h2>7. Security</h2>
      <p>
        We use HTTPS in transit, encryption at rest (handled by Supabase and
        Stripe), short-lived session tokens, and least-privilege access for
        our team. No system is perfectly secure; if we ever experience a
        breach affecting your data we will notify you and the relevant
        authorities as required by law.
      </p>

      <h2>8. Children</h2>
      <p>
        {legal.brand} is not directed to children under 16, and we do not
        knowingly collect personal information from them. If you believe a
        child has provided us with information, contact us and we will delete
        it.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &quot;Last
        updated&quot; date at the top reflects the most recent change.
        Material changes will be announced by email or in-app notice.
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions or requests:{" "}
        <a href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</a>.
      </p>
    </LegalLayout>
  );
}
