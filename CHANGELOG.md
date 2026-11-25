# Changelog

Veridian DPDP. Newest first. Dates are in IST (Indian Standard Time).

Every deployed change needs a new version here, in `dpdp-app/public/version.json` and in the Version section of `KNOWLEDGE-MAP.md`, all in the same pull request.

## 0.1.1 - 25 Nov 2026

- Added the small mark "१३९" at the very top centre of every page (owner order, approved 25 Nov 2026): 6px, bold, dark blue `#0B2A6B`, a 0.5px dark red `#7A1010` line under it. It sits at the top without moving content, cannot be clicked, and is hidden from screen readers and copy.
- Done in every static page, in the two page generators (`scripts/generate-public-facts.mjs`, `scripts/draft-content/render.mjs`, sharing `scripts/mark139.mjs`) and in the two AI-link Edge Function pages (`render.ts`, `manual.ts`). Pages were regenerated; generator `--check` passes.
- New guard test `dpdp-app/src/lib/mark139.test.ts`: every page must have exactly one mark with the approved markup and CSS.
- `scripts/check-two-doors.mjs` (hidden-text check) and `src/lib/brand-line.test.ts` now allow this one element.
- No payment, wording or layout change. The picture `dpdp-app/public/og-image.png` is a raster and was not touched.

## 0.1.0 - 3 Nov 2026 (baseline)

- Starting point of this repository's version history. Nothing new was built for this version; it describes the code as it stands.
- 3 Nov 2026, 11:01 IST: the repository was created as a code-only copy (no history) of compliance-tracker commit `7ff2f835d78e`. It holds the website app (`dpdp-app/`), the ten `dpdp-*` Edge Functions, the inbound-mail worker, scripts, workflows and reference docs.
- 14 Nov 2026, 18:08 IST: a knowledge map was added (documentation only, no change to behaviour).
- The deploy, smoke and site-health workflows are manual only. The live site still deploys from compliance-tracker until the owner approves the switch-over.
- The earlier history of this code is in compliance-tracker, not here.
- Version tracking files (this changelog and `dpdp-app/public/version.json`) were added to this baseline. Documentation and metadata only; no code or payment change.
- Note: `dpdp-app/package.json` still says `0.0.1` (the untouched starter value) and was left alone. This changelog and `version.json` are the product version; the inbound-mail worker's own `package.json` says `0.1.0`.
