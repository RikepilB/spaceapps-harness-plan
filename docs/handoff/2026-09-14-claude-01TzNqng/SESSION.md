# SESSION

Factual record. Anything not directly observed in this session is marked as an
inference in `HANDOFF.md` and is not repeated here.

## Identity

| | |
|---|---|
| Session id | `01TzNqng9bCxiL7dCbTjyP72` |
| Agent | Claude Opus 5, Cowork (cloud container, remote) |
| Dates | 13 Sep 2026 – 14 Sep 2026 |
| Operator | Richard Pillaca |
| Repo at export | `spaceapps-harness`, 1 commit, `e4a57f0`, branch `main`, no remote |
| Working dir | ephemeral cloud container; repo also delivered as a zip |

## Objective as stated by the operator

Across five turns, in the operator's own words:

1. Deep research on the NASA Space Apps Challenge — steps, data sources, databases,
   how to win, past nominees/awards/winners. A web page identifying all of it. Think
   of a winning project. A product to make hackathon participation easier.
2. Create agents for every aspect (investigation, databases, planning, organization,
   topics, presentation) and skills around necessities. A full hackathon
   participation harness.
3. Keep investigating, stress-test the plugin/agents/skills, analyse what projects
   suit his qualities, who to recruit, how to organize the team.
4. A whole process to share it with the team, use it, collaborate and improve. Add
   the sandcastle skill.
5. Keep all the session data documented, traceable, related, remembered.

## Decisions taken by the operator

Collected via one structured question at the start of turn 1:

| Decision | Choice |
|---|---|
| Harness delivery format | Cowork plugin (`.plugin` file) |
| Product scope | Internal tooling only, for now |
| Event | **Universal Event** (no local event) |

## Artefacts produced

| Artefact | Where | State |
|---|---|---|
| Space Apps Winner's Atlas | published artifact | v2 |
| Crew Readiness Board | published artifact | v1, `db` capability, org-internal |
| `spaceapps-harness` plugin | `plugins/spaceapps-harness/` | v0.1.0 → v0.2.0 → v0.3.0 |
| Plugin marketplace | `.claude-plugin/marketplace.json` | v0.3.0 |
| Eval suite | `evals/` | 2 cases, 1 scored fixture |
| Team docs | `docs/ONBOARDING.md`, `docs/TEAM-RUNBOOK.md` | complete |
| Contribution loop | `CONTRIBUTING.md` | complete |
| Shared agent context | `CLAUDE.md` | complete |
| Structural validator + CI | `scripts/validate-plugin.mjs`, `.github/workflows/validate.yml` | passing, 21 checks |

## Plugin inventory at export

**9 agents** — `challenge-scout`, `prior-art-analyst`, `data-scout`, `team-architect`,
`scope-planner`, `build-engineer`, `science-validator`, `submission-auditor`,
`pitch-director`.

**10 skills** — `spaceapps-brief` (4 references), `challenge-selection`,
`nasa-data-access` (1 reference), `award-targeting`, `team-building`,
`hackathon-war-room`, `project-page-builder`, `demo-video`, `judge-simulation`,
`sandcastle-orchestration`.

## Verification actually run

| Check | Command / method | Result |
|---|---|---|
| Plugin + marketplace structure | `node scripts/validate-plugin.mjs` | 21 passed, 0 warnings, 0 errors |
| Eval runner syntax | `node --experimental-strip-types --check evals/run-evals.ts` | OK |
| Atlas page JS | `new Function()` parse + element-id reachability | parses, all ids resolve |
| Crew page JS | same | parses, all ids resolve |
| GEOS-5 FP forecast endpoint | WebFetch on the `.info` page | live, no auth, `t2m`/`qv2m` present |
| Hydrology Data Rods link | WebFetch | **404 confirmed** |
| IMERG Early vs Final | WebSearch, both NASA catalogue pages | two distinct products, confirmed |

## Not done

- Nothing pushed to GitHub. No remote configured. The install commands in
  `README.md` do not resolve yet.
- `npm install` never run; `evals/run-evals.ts` has never been executed against a
  real sandbox. Its syntax is checked, its behaviour is not.
- The 2026 Judging & Awards Guide is not published until 13 Nov 2026. The rubric in
  the harness is the 2019–2025 version.
