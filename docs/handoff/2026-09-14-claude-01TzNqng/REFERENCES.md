# REFERENCES

Every source consulted, and every instruction document this repo carries.

## Instruction documents in this repo

| File | Role |
|---|---|
| `CLAUDE.md` | Shared context every teammate's Claude reads. Event ground truth, working agreements, code conventions. |
| `CONTRIBUTING.md` | The improvement loop: fixture first, then prompt, then evals, then PR. |
| `README.md` | Install path and repo map. |
| `docs/ONBOARDING.md` | New teammate, day one. |
| `docs/TEAM-RUNBOOK.md` | Weekend schedule, who runs which agent when. |
| `docs/handoff/HANDOFF.md` | Root index. Current state and append-only session index. |

No `AGENTS.md` present. No parent handoff — this is the first session package.

## Primary sources (official)

| Source | Used for |
|---|---|
| https://www.spaceappschallenge.org/2026/ | 2026 dates, theme, registration, step 04 team formation |
| https://www.spaceappschallenge.org/resources/participant-faqs/ | Timeline, team rules, no-early-work rule, minors rule |
| https://legacy.spaceappschallenge.org/resources/faq/ | Universal Event mechanics, Team Lead rules, winners trip |
| https://www.spaceappschallenge.org/2025/awards/ | The ten award category definitions, verbatim |
| https://www.spaceappschallenge.org/2025/awards/global-finalists/ | All 45 finalists (via Next.js flight payload) |
| https://www.spaceappschallenge.org/2025/awards/honorable-mentions/ | All 23 honorable mentions |
| https://www.spaceappschallenge.org/2025/awards/global-nominees/ | Nominee count (1,290+) |
| https://www.spaceappschallenge.org/2025/challenges/ | All 18 (+1) 2025 challenges, difficulty, subjects |
| Each 2025 challenge page, Resources tab | The curated NASA + partner dataset lists |
| https://www.spaceappschallenge.org/2026/space-agency-partners/ | The 17 partner agencies |

## Winner announcements

| Year | Source |
|---|---|
| 2025 | https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/ |
| 2024 | https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/ |
| 2023 | https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners |
| 2022 | https://www.earthdata.nasa.gov/news/2022-space-apps-challenge-winners |
| 2021 | https://www.earthdata.nasa.gov/news/spaceapps-2021-winners |

## Judging criteria

- https://sa-2019.s3.amazonaws.com/media/documents/Space_Apps_2019_Judging_and_Awards.pdf
  — the five criteria verbatim, plus the stage structure.
- https://spaceappssarawak.com/faqs/ — local-event restatement, used to confirm the
  same five criteria were in force for 2025.

The 2026 Judging & Awards Guide is not published until 13 Nov 2026. Re-check then.

## Verified during this session

| Claim | Method | Result |
|---|---|---|
| GEOS-5 FP forecast is open, no auth | WebFetch on `opendap.nccs.nasa.gov/dods/GEOS-5/fp/0.25_deg/fcast/tavg1_2d_slv_Nx.latest.info` | live, 44 vars, `t2m` + `qv2m` present, no auth indicated |
| Hydrology Data Rods deep link | WebFetch | 404 |
| IMERG Early vs Final are distinct | WebSearch, both NASA Earthdata catalogue entries | confirmed |

## Tooling and third-party

- https://github.com/mattpocock/sandcastle and its README — the `sandcastle-orchestration`
  skill is written against this, not from recall.
- https://code.claude.com/docs/en/plugin-marketplaces — `marketplace.json` schema and
  the install commands.

## Discovered, not documented publicly

- `api.spaceappschallenge.org/graphql` backs the site's award and challenge lists.
- The award list pages use infinite scroll; the rendered data also sits in the
  Next.js flight payload, recoverable by regex over `self.__next_f.push` without
  driving the scroll.
