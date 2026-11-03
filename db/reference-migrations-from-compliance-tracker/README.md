# Reference copies of DPDP migrations (read-only)

These files are COPIES of the DPDP migrations from FChecklist/compliance-tracker `drizzle/` (66 forward files plus 13 in `down/`), taken on 3 Nov 2026. Do NOT run them from this repo.

The live migration ledger and numbering still belong to compliance-tracker's `drizzle/` folder. It is ONE global sequence (0000-0756) that feeds ONE live Supabase database (project pcrjmlpuqsbocqfwoxod). If this repo added its own "0757", it would collide with the next number compliance-tracker hands out. Changing who owns migrations is a later, separate owner decision.

Files that only mention DPDP in a comment (0154, 0541, 0614, 0615, 0624, 0627) are not DPDP migrations and were not copied.
