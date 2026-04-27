# Tally

> Money decisions, made calmer.

Live: **https://tallyfinance.online**

A subscription web app that helps people:

- See if a purchase fits their budget before they buy
- Track cash spending (the only thing most apps miss)
- Split one-time costs (deposits, vacations) fairly
- Use packing lists that adapt by trip type
- Find good windows to book flights and hotels
- Log and categorize receipts for taxes and reimbursements

## Stack

- Next.js 16 + TypeScript + Tailwind CSS
- Stripe Subscriptions (Checkout + Customer Portal + Webhooks), API version `2026-04-22.dahlia`
- Supabase Auth + Postgres + Storage (RLS-secured) for cross-device sync
- PostHog (optional analytics)
- Persistent local-first UX via `localStorage` (works with zero config)

The app runs and is fully usable with **no environment variables** — perfect for showing it to people. Adding the Stripe + Supabase keys turns on billing, real subscriber stats, and cross-device sync.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values you have
npm run dev
```

Open `http://localhost:3000`.

## Routes

| Route                       | Purpose                                                |
| --------------------------- | ------------------------------------------------------ |
| `/`                         | Landing page with live demos                           |
| `/dashboard`                | CRUD dashboard (budget, cash, splits, travel, packing, receipts) |
| `/pricing`                  | Starter / Pro / Pro+                                   |
| `/api/stats`                | Live subscriber count (Stripe-backed, cached 5 min)    |
| `/api/stripe/checkout`      | Create Stripe Checkout session                         |
| `/api/stripe/portal`        | Create Customer Portal session (manage / cancel)       |
| `/api/stripe/webhook`       | Stripe webhook receiver (signature-verified)           |
| `/api/receipts/export`      | CSV export                                             |
| `/icon.svg`, `/opengraph-image` | Auto-generated brand assets                       |

---

## Production launch playbook — `tallyfinance.online`

You already own the domain. Total recurring cost: **just the domain**.

### 1. Push the code to GitHub

```bash
cd finance-app
git init
git add .
git commit -m "Initial commit"
gh repo create tally --public --source=. --remote=origin --push
```

### 2. Deploy on Vercel (free Hobby plan)

1. https://vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: **Next.js**. Root directory: `finance-app`.
3. Click **Deploy**. You'll get `tally.vercel.app` (or similar) immediately.

### 3. Connect `tallyfinance.online` to Vercel

1. Vercel → Project → **Settings → Domains** → add `tallyfinance.online` and `www.tallyfinance.online`.
2. Vercel shows DNS records (typically an `A` record at `@` and a `CNAME` for `www`).
3. Add those records at your domain registrar (or in Cloudflare if you proxy).
4. Vercel auto-provisions SSL via Let's Encrypt — no extra cost.
5. In Vercel → **Settings → Environment Variables**, add:

   ```
   NEXT_PUBLIC_SITE_URL = https://tallyfinance.online
   ```

   (Already the default in `src/lib/integrations.ts`, but explicit is good — it controls Stripe redirect URLs and OG/Twitter card URLs.)

### 4. Wire up Stripe

You already have a verified Stripe account.

#### 4a. Create the Pro and Pro+ products

In **Dashboard → Product catalog → Add product**:

- **Tally Pro** — recurring, $12 USD / month → copy the **Price ID** (`price_…`).
- **Tally Pro+** — recurring, $24 USD / month → copy the **Price ID**.

#### 4b. Create a restricted API key (recommended over the secret key)

Per [Stripe's security guidance](https://docs.stripe.com/keys/restricted-api-keys), don't deploy `sk_live_...`. Use a **restricted API key** (`rk_live_...`) with only the permissions Tally needs:

| Resource             | Permission |
| -------------------- | ---------- |
| Checkout Sessions    | Write      |
| Billing Portal       | Write      |
| Customers            | Write      |
| Subscriptions        | Read       |
| Webhook Endpoints    | Read       |
| Everything else      | None       |

Dashboard → **Developers → API keys → Create restricted key**.

For extra defense in depth, attach an [IP allowlist](https://docs.stripe.com/keys.md#limit-api-secret-keys-ip-address) once you know your Vercel egress IPs (or skip — Vercel egress isn't fixed).

#### 4c. Add the webhook endpoint

Dashboard → **Developers → Webhooks → Add endpoint**:

- URL: `https://tallyfinance.online/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
- Copy the **signing secret** (`whsec_...`).

#### 4d. Set the env vars in Vercel

```
STRIPE_SECRET_KEY        = rk_live_...        # restricted key from 4b
STRIPE_WEBHOOK_SECRET    = whsec_...          # from 4c
STRIPE_PRICE_PRO         = price_...          # from 4a
STRIPE_PRICE_PRO_PLUS    = price_...          # from 4a
```

Redeploy. After this, Checkout uses real Price IDs, the Customer Portal works, the homepage shows real subscriber counts, and the webhook will sync entitlements.

### 5. Set up Supabase

You said you're already creating an account.

1. https://supabase.com → **New project**. Pick a region near your users.
2. Once provisioned, open **SQL Editor** and paste / run the contents of [`supabase/schema.sql`](./supabase/schema.sql). It creates `profiles`, `subscriptions`, `cash_entries`, and `receipts` with RLS enabled.
3. **Storage → Create bucket** → name it `receipts`, set to **private**.
4. **Project settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **server only — never expose**
5. Add those three values to Vercel → Settings → Environment Variables.
6. Redeploy.

The Stripe webhook will now upsert into `public.subscriptions` whenever a customer subscribes, upgrades, downgrades, or cancels.

### 6. (Optional) PostHog analytics

```
NEXT_PUBLIC_POSTHOG_KEY   = phc_...
NEXT_PUBLIC_POSTHOG_HOST  = https://app.posthog.com
```

### 7. Smoke test in live mode

1. From an incognito window, visit `https://tallyfinance.online/pricing` and click **Upgrade to Pro**.
2. Use a real card (or a [Stripe test card in test mode first](https://docs.stripe.com/testing) — switch the dashboard to test mode and use test keys to validate the full loop without spending money).
3. Confirm the redirect to `/dashboard?upgrade=success`.
4. Stripe Dashboard → Webhooks → check the delivery log for `checkout.session.completed` and `customer.subscription.created` returning `200`.
5. Supabase → table `subscriptions` → confirm a row with `status = 'active'` and `tier = 'pro'`.

---

## Security notes

- **Never** commit `.env*` files. `.gitignore` already excludes them.
- Use the **restricted key** (`rk_live_...`) in production. Reserve the secret key (`sk_live_...`) for one-off admin scripts.
- Webhook signatures are verified in `src/app/api/stripe/webhook/route.ts`. Don't disable that check.
- The `SUPABASE_SERVICE_ROLE_KEY` is only ever read server-side (in API routes). It is **never** sent to the browser.
- If a key ever leaks, rotate it immediately at Stripe Dashboard → API keys, then redeploy.

## What is real vs simulated

- **Real:** Dashboard CRUD (budget, cash, splits, travel timing, packing, receipts), CSV export, Stripe Checkout, Customer Portal, signature-verified Stripe webhook, live subscriber count via `/api/stats`, RLS-secured Supabase schema.
- **Simulated UI element:** The interactive landing page demos use the same engine as the dashboard but don't persist (intentional — they're for visitors who haven't signed up).
- **Not yet wired:** Supabase Auth UI on the dashboard (data still lives in `localStorage` per browser); automatic OCR (manual entry + photo upload only).

## Roadmap to v2

- Wire Supabase Auth (email + Google) and migrate `localStorage` → RLS-secured tables
- Real OCR via Vision API or Tesseract.js fallback
- Real-time travel pricing using a fare API for Pro users
- Travel-window push/email alerts
- Family / team sharing for Pro+
