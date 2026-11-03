# veridian-dpdp

Veridian DPDP: the DPDP-compliance product (website app, payment and e-mail Edge Functions, inbound-mail worker, CI workflows). Private repository.

**This is a COPY made on 3 Nov 2026 from FChecklist/compliance-tracker commit `7ff2f835d78e097314f5539ee1d554cac1b71b7b` (code only, no history). The live deploy still comes from compliance-tracker until the owner approves the switch-over.** Nothing in this repo deploys by itself: the deploy, smoke and site-health workflows are manual-only (`workflow_dispatch`) and marked DISABLED-IN-COPY.

## Live hosts today (do not change)
- Apex `veridian-aios.com` and `app.veridian-aios.com` on Cloudflare Pages project `veridian-dpdp-app` (D1 `dpdp-telemetry`).
- Edge Functions on the shared Supabase project; inbound mail via the Cloudflare Worker `dpdp-inbound-mail`.

## Layout
- `dpdp-app/` Vite + React app (own package.json, bun.lock, wrangler.toml, tests, scripts).
- `supabase/functions/dpdp-*` 10 Edge Functions: ai-link, audit, audit-lifecycle, inbound-mail, invoice-email, lifecycle-email, monday-email, partner-email, pay, track.
- `supabase/functions/_shared/` only the 23 files those functions import (mail, audit, visit, ai-link, terms). The rest of the old `_shared` stays in compliance-tracker.
- `workers/dpdp-inbound-mail/` Cloudflare Worker.
- `scripts/` DPDP scripts (`scripts/dpdp/`, `dpdp-inbox-placement.ts`, `verify/ai-link/simulate-dpdp-external-ai.mjs`).
- `.github/workflows/` dpdp-app-ci (runs on PR/push, no secrets), deploy / live-smoke / site-health (manual only).
- `db/reference-migrations-from-compliance-tracker/` read-only copies of DPDP migrations (see its README).
- `docs/` DPDP product notes and the extraction plan.

## Run and test locally
```
cd dpdp-app
bun install
bun run typecheck
bun test
bun run build        # needs VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (placeholders are fine for a local build)
```
On a low-RAM Windows laptop set `NODE_OPTIONS=--max-old-space-size=2048` and run one heavy command at a time.

## Secret and variable NAMES (values are never in this repo)
- GitHub secrets (deploy workflow): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- GitHub variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (public values).
- Edge Function env (Supabase secrets): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `APP_ORIGIN`, `DPDP_EMAIL_FROM`, `DPDP_AUDIT_VENDOR_IP_RANGES`. The code also refers to these secret names (set in Supabase, in the database vault, or in Worker secrets): `DPDP_AUDIT_SEAL_KEY`, `DPDP_INBOUND_SECRET`, `DPDP_RESEND_WEBHOOK_SECRET`, `DPDP_VISIT_KEY`, `DPDP_VISIT_PROXY_KEY`, `PAY_SERVICE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `TIMER_SECRET`.
- Worker (`workers/dpdp-inbound-mail`): vars `DPDP_INBOUND_URL`, `FALLBACK_FORWARD_TO`, `MAX_RAW_BYTES`, `POST_TIMEOUT_MS`; secret `DPDP_INBOUND_SECRET`.
- Local scripts only: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `DPDP_ORIGIN`, `DPDP_FUNCTIONS`, `DPDP_PEERS`.

## What stays in compliance-tracker
The older Next.js DPDP side (`src/app/dpdp*`, `src/app/api/dpdp`, `src/lib/services/dpdp*`, `src/lib/dpdp*`), `drizzle/` ownership and numbering, the shared `src/lib/db/schema.ts`, `src/lib/db.ts`, tenant-scoped helpers, the `ai-os/` governance records.

## Next steps (owner / boss)
1. Set the secrets and variables above in this repo (owner enters values).
2. Run the workflows manually (`workflow_dispatch`), starting with live-smoke and site-health.
3. Deploy from this repo ONCE to the same Pages project and Supabase functions and compare with the live site (pages, payment order creation, e-mail path, inbound mail).
4. Only then disable the old repo's DPDP workflows and remove the moved paths there in one PR; enable the schedules here.
