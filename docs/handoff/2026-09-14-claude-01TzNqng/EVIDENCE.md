# EVIDENCE

Raw findings, kept so a successor can check the reasoning rather than trust it.
No agent transcripts are reproduced in full — this is the distilled, citable layer.

## Eval 1 — science-validator vs. planted defects

**Fixture:** `evals/fixtures/exofinder.md`. **Threshold:** 8/10. **Result: 10/10.**

| # | Planted defect | Caught | Agent's severity |
|---|---|---|---|
| 1 | `koi_pdisposition` / `koi_score` / `koi_fpflag_*` encode the label | yes | FATAL |
| 2 | Raw accuracy on an imbalanced multi-class problem | yes | HIGH |
| 3 | No majority-class baseline | yes | HIGH |
| 4 | Random split leaks across multi-planet systems sharing a `kepid` | yes | HIGH |
| 5 | "Detects new exoplanets" — it classifies catalogued KOIs | yes | FATAL |
| 6 | Dec 210.7 is outside the physical range | yes | HIGH |
| 7 | `koi_teq` is Kelvin, labelled Celsius | yes | HIGH |
| 8 | 450 K is not the habitable zone | yes | HIGH |
| 9 | `koi_srad` fill values treated as data | yes | MED-HIGH |
| 10 | Kepler observed one fixed field, not a representative sky sample | yes | HIGH |

Three further real problems found that were **not** planted: the untested TESS
domain-shift claim, "AI can replace manual vetting", and "will help find life beyond
Earth". It also supplied a rewritten abstract that survives the claims it removed.

Notable depth: it did not merely flag Dec 210.7 as out of range, it checked that the
swapped reading (RA 210.7, Dec 45.2) still lands outside the Kepler field in
Cygnus–Lyra, so neither interpretation rescues the value.

## Eval 2 — data-scout URL verification

Roughly sixty URLs fetched. Findings that changed the harness:

| Finding | Status |
|---|---|
| `disc.gsfc.nasa.gov/information/tools?title=Hydrology%20Data%20Rods` | **404**, independently re-verified. Service retired. |
| `power.larc.nasa.gov/parameters/` and the POWER API parameter dictionary | 404. *Not* in the harness catalogue — no fix needed, recorded to prevent a later "fix" adding them. |
| `appliedsciences.nasa.gov/get-involved/training` (ARSET) | Live but the body says the programme has moved. Flagged in the catalogue rather than removed. |
| `www.earthdata.nasa.gov/*` | 403 to automated fetch on every path tried, while `gibs.`, `urs.` and `search.` subdomains work. Looks like a WAF rule, not a dead site. Check these in a browser before declaring them dead. |
| GEOS-5 FP forecast, NCCS OPeNDAP | **Live, no auth**, 44 variables, `t2m` and `qv2m` present. Independently re-verified. Now in the catalogue. |

Two weaknesses it found in the harness's own instructions, both fixed:

1. The `nasa-data-access` canonical snippet used `GPM_3IMERGDF` (Final Run, roughly
   3.5 months behind). A team copying it into an early-warning tool ships a product
   that looks live and is silently stale. **Nothing errors.**
2. `data-scout` step 1 said "read the challenge's Resources tab first" with no branch
   for the case where no challenge URL is supplied, so it silently fell through to
   step 2 with its highest-priority instruction skipped.

It also observed that the catalogue was organised by variable and carried no notion
of latency at all — the single dimension that determined the whole manifest for a
forecasting task.

## Eval 3 — challenge-scout on the real 2025 set

Scored the 19 published 2025 challenges against the operator's real profile.

**Defect found in the skill:** the saturation anchor table read `1 = every team will
do this, 5 = thin field`, while the ranking formula was
`(demo legibility x 2) + award surface + differentiator - saturation`. Subtracting a
dimension scored that way penalises thin fields and rewards crowded ones. Every
ranking would have been inverted. Fixed in both the skill and the agent.

**Its recommendation**, scored with saturation read as crowding: Data Pathways to
Healthy Cities, built for Lima, targeting Local Impact, with Best Use of Data and
Global Connection as secondary surfaces. Runner-up NASA Farm Navigators, rejected
because both hard gates sit at 3.

**Its hardest call:** eliminating Stellar Stories despite it producing 8 of 45
finalists — the most of any challenge — on the grounds that the winning shape there
is illustration, the team has no illustrator, and missing capabilities constrain the
choice rather than being solvable over a weekend.

## 2025 outcome data

Finalists and honorable mentions by origin (68 projects): Universal Event 11,
Brazil 9, India 5, Egypt 5, Bangladesh 4, Philippines 3, United States 3,
South Korea 3, then 2 each for Taiwan, Colombia, Peru, Mexico, Argentina and Turkey,
and 1 each for thirteen others.

Finalists by challenge (45): Stellar Stories 8, Will It Rain 6, A World Away 5,
Commercializing LEO 4, Space Biology Engine 4, then 1–2 each across the rest. The top
five produced 27 of 45.

Full winner tables for 2021–2025 live in
`plugins/spaceapps-harness/skills/spaceapps-brief/references/winners-2021-2025.md`.
