# DPDP extraction into its own private repository — plan (to be executed after today's deploy)

Decision (13 Oct 2026): PROJEXA and compliance-tracker stay public; Veridian DPDP moves to its own PRIVATE repository; the games, Startup Coach and IT Services repositories stay private. Execution is AFTER today's 16:30 deploy. Nothing below has been done yet.

## 1. What DPDP is today (measured on `origin/main`, 5,777 files)
| Part | Files | Notes |
|---|---|---|
| `dpdp-app/` (the website app.veridian-aios.com: pages, data, tests) | 394 | Self-contained: own `package.json`, `bun.lock`, `wrangler.toml`, `vite.config.ts`. Imports only itself. Deployed to Cloudflare Pages. |
| `supabase/functions/dpdp-*` (10 functions: ai-link, audit, audit-lifecycle, inbound-mail, invoice-email, lifecycle-email, monday-email, partner-email, pay, track) | 43 | Deployed to the shared Supabase project with the Supabase API. |
| `supabase/functions/_shared/` | 22 | **Shared with non-DPDP functions** (PROJEXA, ai-work-link). Must be split: copy the files DPDP needs, leave the rest. |
| `src/lib` DPDP services and tests | 106 | Part of the older Veridian AI Next.js app. |
| `src/app` DPDP pages and API routes | 115 | Same Next.js app (Vercel is paused for it). |
| `drizzle` DPDP migrations | 69 | Run against the shared Supabase project. |
| `scripts` DPDP | 7 | Some import from `supabase/functions/dpdp-*`. |
| `.github/workflows`: `dpdp-app-ci`, `dpdp-app-deploy`, `dpdp-live-smoke`, `dpdp-site-health` (+ `deploy-prebuilt` mentions DPDP) | 4 + 1 | Move the four; edit the fifth. |
| docs / ai-os DPDP | 13 | Move the product docs; leave governance records. |

## 2. What extraction does and does not do
- It moves **code and automatic checks** into a private repository so future commits are not public.
- It does **not** remove anything already public. Every commit ever pushed to compliance-tracker is public (forks and caches may hold copies). Any key, token, password or private business text that ever appeared there must be treated as exposed and replaced.
- It does **not** split the database. DPDP keeps using the shared Supabase project (`pcrjmlpuqsbocqfwoxod`). A separate database is a different, larger project.

## 3. Decisions to take before starting (recommendation first)
1. **History:** start the private repo with a clean single first commit that records the source commit SHA. Recommended: smaller, no old noise. (Keeping history with `git filter-repo` preserves blame, but it is the same public history anyway.)
2. **The Next.js DPDP files (`src/app`, `src/lib`, 221 files):** these are the older in-app version. Recommended: first confirm which of them are still used (the live product is `dpdp-app` on Cloudflare plus the Supabase functions). Move what is used; leave the rest and mark it unused.
3. **Public leftovers:** recommended to keep a one-line README pointer in the public repo, not a code hook.
4. **Name:** `FChecklist/veridian-dpdp` (private).

## 4. Steps
**A. Before anything (can start now, read-only):** history scan for secret-shaped strings in the DPDP paths (running; result in `DPDP_HISTORY_SECRET_SCAN_2026-10-13.txt`); list every secret DPDP uses (Razorpay, Resend, Supabase service role, Cloudflare, inbound-mail secrets) and decide which to replace.
**B. After today's deploy and after PR #2144 is merged:**
1. Freeze DPDP changes (tell the PROJEXA session).
2. Create the private repo. Copy the moved paths; split `_shared`; fix import paths; keep `supabase/config` for the DPDP functions.
3. Recreate the repository secrets in the new repo (owner enters any value Claude cannot read; no secret is committed).
4. Run the four workflows in the new repo; fix paths.
5. Deploy from the NEW repo once to the same Cloudflare Pages project and the same Supabase functions; compare with the live site (page checks, payment order creation, e-mail path, inbound mail).
6. Only after the new repo's deploy is proven: switch the old repo's DPDP workflows off (disable, not delete) and remove the moved paths in one PR with a pointer README.
7. Replace every secret that the history scan or the secret list marks as exposed.
**C. Rollback:** the old repo's workflows are only disabled, so re-enabling them restores the old deploy path; the live site and functions are not touched until step B5.

## 5. Costs and limits
- Private repositories on the free plan get 2,000 Actions minutes a month. The DPDP CI and deploy workflows must fit; if they do not, run the heavy tests locally before pushing and keep CI to build and smoke checks. To be measured from the last 30 days of runs before step B3.
- Time: about a day of careful work with a second person to check the live payment path. Not suitable for today.

## 6. Risks
- Payment and e-mail functions are live code; a wrong path or missing secret stops DPDP payments or mail. Hence deploy-and-compare before switching.
- `_shared` split can break PROJEXA functions if done carelessly. Test both after.
- Migration numbering lives in the shared database; keep migration files for DPDP in one place only.
