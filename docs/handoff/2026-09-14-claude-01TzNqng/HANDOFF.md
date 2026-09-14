# HANDOFF

Written for whoever picks this up next, including the operator after a gap. Facts
observed in this session are stated plainly. Anything reasoned rather than observed
is marked **[inference]**.

---

## 1. Objective and real scope

The stated goal was to win the 2026 NASA Space Apps Challenge, entering through the
Universal Event, and to build reusable tooling for doing so.

What the session actually delivered, in order: research, a strategy reference, a
plugin harness, a stress test that broke the harness, fixes, a collaboration layer,
and this record. The scope expanded four times mid-session. Each expansion was
absorbed rather than re-planned, which worked here because each new ask built on the
previous artefact.

One thing the operator asked for was deliberately not built: a public,
participant-facing product. They chose "internal tooling only, for now" when asked.
Worth re-examining only after the hackathon — building it now competes for the same
hours as preparing to compete. **[inference]**

---

## 2. Sequence of decisions, and why

**Ask the three scoping questions before building.** Harness format, product scope,
and event type each changed what got built. Answers: Cowork plugin, internal only,
Universal Event.

**Scrape the award pages through the Next.js flight payload rather than the UI.**
The pages are client-rendered with infinite scroll and `WebFetch` returned only
headings. Driving the scroll worked but was slow; regexing `self.__next_f.push` out
of the served HTML recovered the full 45-finalist and 23-mention lists in one call
each, and recovered the per-challenge Resources lists that are otherwise behind a tab.

**Target award categories rather than challenges.** The five non-engineering awards
(Storytelling, Art & Technology, Most Inspirational, Global Connection, Local Impact)
are half the prize pool and attract a thinner field of strong engineering teams.
**[inference, from the winner set and the category definitions — not a published
statistic.]** This reframing drove the team-recruiting order and the project picks.

**Stress-test by planting defects, not by reading files.** Prompts fail silently.
Ten known errors were planted in a fake submission and the agent was scored against
them. This is what found the real bugs; reading the files had found none.

**Change the project recommendation after the capability audit.** The first
recommendation (an Andean frost-warning tool) required exactly the geospatial skills
the operator does not have. It was demoted to a conditional second track. Recorded
here because reversing a recommendation is the kind of thing that gets quietly
dropped.

**Refuse the pre-authorised dismissal.** The operator stated in advance that any
critical signal on the sandcastle skill would be a false positive. The repo was read
anyway and found clean. The refusal was to the standing instruction, not to the tool:
a check whose result is pre-committed is not a check.

**Split project memory from user memory.** Project facts live in `CLAUDE.md` and this
package. The operator's personal memory keeps only durable facts about *him* — his
event choice, his goals, his decisions.

---

## 3. What was built

### The plugin — `plugins/spaceapps-harness/`, v0.3.0

Nine agents across the arc: `challenge-scout` and `prior-art-analyst`
(investigation), `data-scout` (databases), `team-architect` (organization),
`scope-planner` (planning), `build-engineer` (execution), `science-validator`
(validity), `submission-auditor` and `pitch-director` (presentation).

Ten skills, four carrying reference files. `spaceapps-brief` holds the rules,
timeline, rubric, the ten award definitions, five years of winners and the extracted
patterns. `nasa-data-access` holds a catalogue harvested from the challenges' own
curated Resources lists.

### The collaboration layer

The repo is its own plugin marketplace, so a teammate installs with
`/plugin marketplace add` then `/plugin install` rather than being handed a file.
`docs/ONBOARDING.md` is day one, `docs/TEAM-RUNBOOK.md` is the weekend, `CLAUDE.md`
gives every teammate's Claude the same working agreements, `CONTRIBUTING.md` is the
improvement loop, `scripts/validate-plugin.mjs` runs in CI with no install step.

### The evals — `evals/`

Two cases. `evals/fixtures/exofinder.md` carries ten planted defects and
`evals/keys/exofinder.yaml` scores them with a pass threshold of 8/10. The runner
uses sandcastle to run each agent in a sandbox on its own branch.

### The artifacts

**Space Apps Winner's Atlas** (v2) — the strategy reference. Timeline, funnel,
rubric, the ten awards, all 78 of the 2025 ranked projects with live filtering,
2021–2024 winners, the data catalogue, the playbook, the team analysis, the two
project tracks.

**Crew Readiness Board** (v1) — the shareable team page. Install commands, a shared
readiness board backed by the `db` capability, the setup checklist, roles, the
weekend timeline, the rules.

---

## 4. Results of the stress test

Three agents were run live against realistic inputs. This is the section to read if
you read only one.

**`science-validator` passed clean.** Ten planted defects, ten caught, plus three
real problems that had not been planted (TESS domain shift, the "replaces
astronomers" overclaim, the "find life" overreach). It correctly ranked label
leakage and the false detection claim as fatal.

**`data-scout` found three dead links inside the harness's own catalogue** and one
stale one, by honouring its own "never list a dataset you have not confirmed
resolves" rule across roughly sixty URLs. It also identified that the skill's
canonical code sample used IMERG **Final** Run — roughly 3.5 months behind — which
anyone copying it into an early-warning tool would ship as a silently stale product.
Nothing errors in that failure mode, which is what makes it the worst bug found.

**`challenge-scout` found a sign error.** The saturation dimension's anchor table ran
1 = crowded, 5 = thin field, while the ranking formula subtracted saturation. Every
ranking the skill produced would have been backwards.

### The six defects, all fixed in v0.2.0

| # | Defect | Fix |
|---|---|---|
| 1 | Saturation anchors contradicted the ranking formula | Re-anchored as crowding, with an explicit note that it is the only dimension where high is bad. Fixed in both the skill and the agent. |
| 2 | Canonical snippet used IMERG Final (~3.5 months latent) | Switched to `GPM_3IMERGDE` Early, with the Final variant commented alongside |
| 3 | No latency concept anywhere in the data guidance | Added a forecast/nowcast/hindcast gate as the first question, with a latency table |
| 4 | Dead link: Hydrology Data Rods (404, verified) | Replaced with the GES DISC tools index, noting the retirement |
| 5 | `data-scout` step 1 unexecutable with no challenge URL | Added an explicit branch: say so, ask, mark the manifest provisional |
| 6 | No forecast data source in the catalogue | Added GEOS-5 FP forecast — verified live, no auth, five of six variables a frost tool needs |

`team-building` (skill) and `team-architect` (agent) were added in the same release
to close a coverage gap the operator's next question exposed.

---

## 5. Research findings worth keeping

**The funnel, 2025 actuals.** 11,500+ submissions → 1,290+ global nominees → 45
finalists + 23 honorable mentions → 10 winners. Roughly 1 in 1,150. The realistic
first target is *nominee*, which is the only gate local judges control.

**Three juries read different things.** Local judges see a pitch and can ask
questions, so Presentation and Relevance dominate. Global judges read the page and
watch the video with nobody present, so Validity and Impact rise. An executive panel
then assigns one winner per category, making the last round a question of category
fit. Consequence: write the project page for someone who will never meet you.

**The Universal Event is not the weaker route.** It produced 9 of 45 finalists and 2
of 10 winners in 2025 — more finalists than any single country.

**Universal Event deadlines follow the team creator's local time.** Whoever creates
the team sets the clock for everyone, and the Team Lead's location determines where
the team is listed. Act on this deliberately.

**The recurring winner shape.** A named dataset, a transform that does real work, an
interface a non-expert can drive, and a named beneficiary. Missing the third fails
Presentation; missing the fourth fails Impact. **[inference, from the winner set.]**

**Archetypes repeat even though titles change.** Roughly a third of any year's
challenge set is "turn Earth observation into a decision". **[inference, from the
2023–2025 sets.]**

---

## 6. The operator-specific analysis

Capability audit, scored against what the challenges demand:

| Capability | Score | Consequence |
|---|---|---|
| Ships a deployed web interface unaided | 5 | — |
| Credible tie to a specific place | 5 | Local Impact, Most Inspirational open |
| Presents on camera | 4 | Presentation covered |
| Trains and evaluates a model honestly | 3 | — |
| Domain background | 3 | — |
| **Data engineering on scientific formats** | **1** | Constrains which challenges are viable |
| **Design / illustration / animation** | **1** | Closes three award categories |

**Recruiting order: designer first, local credibility second, second engineer third.**
Two engineers produce one project with a merge conflict, not two projects.

**Two project tracks.** Track A (Lima urban, vector and tabular only, never opens a
scientific binary) is reachable solo. Track B (Andean frost warning, forecast-shaped,
sharper decision) unlocks only with a geospatial hire. Which track is live is a
function of recruiting, not preference.

All of section 6 is **[inference]** — reasoned from the operator's stated background
and the observed winner data, not from anything the operator asserted about their own
limits.

---

## 7. Git state and relevant files

Single commit `e4a57f0` on `main`, no remote configured, working tree clean at the
point of this package. 42 files tracked before this handoff; this package adds more.

Files a successor should open first, in order:

1. `docs/handoff/HANDOFF.md` — current state and the session index
2. `CLAUDE.md` — the working agreements
3. `docs/TEAM-RUNBOOK.md` — who runs what on the weekend
4. `plugins/spaceapps-harness/skills/spaceapps-brief/references/winning-patterns.md`
5. `evals/keys/exofinder.yaml` — what "the agent still works" means concretely

---

## 8. Errors, blockers, risks and open assumptions

**Blocker: nothing is pushed.** No remote. The install commands in `README.md` and on
the Crew Readiness Board do not resolve until someone pushes to
`RikepilB/spaceapps-harness`. This was deliberate — creating a public repo under the
operator's name is theirs to authorise — but it means the collaboration layer is
inert until they act.

**Limitation: the shared board is organization-internal.** Pages declaring the `db`
capability cannot be shared publicly. Teammates outside the operator's organization
will get the local-only fallback, not the shared board. The page degrades cleanly,
but the shared view will not light up for them. If the team is external, either
rebuild the board without the shared layer or rely on the repo docs.

**Untested: the eval runner has never run.** `evals/run-evals.ts` is syntax-checked
only. `npm install` was never run, no Docker was available, and the sandcastle API it
calls was written from the README rather than from an observed execution. Expect to
debug it on first use.

**Risk: the rubric may change.** Everything in the harness uses the 2019–2025
criteria. The 2026 Judging & Awards Guide lands 13 Nov 2026, the day before the
hackathon. Re-read it that day and diff it against
`skills/spaceapps-brief/references/judging-rubric.md`.

**Assumption not verified: the 2026 theme.** "The Next Frontier" appeared in a page
summary and in a third-party listing, but was never confirmed against an official
page in this session. Treat as unconfirmed.

**Assumption: archetype recurrence.** The prediction that 2026 will carry roughly the
same mix of challenge archetypes rests on three years of data. It has never been
tested against a future year.

**Risk the harness itself creates.** Nine agents and ten skills is a lot of surface.
`CONTRIBUTING.md` carries the rule that matters: do not let the harness become the
project. If the week before the event goes to improving the harness rather than
preparing to build, it has failed at the thing it was for.

---

## 9. Next steps, in priority order

1. **Push the repo.** `git remote add origin git@github.com:RikepilB/spaceapps-harness.git && git push -u origin main`. Nothing else in the collaboration layer works until this happens.
2. **Recruit a designer.** Highest marginal score impact, and it is what unlocks the Stellar Stories archetype that currently fails the scope gate.
3. **Create the team yourself** on the Space Apps site, so the submission clock follows a timezone you control.
4. **Run the evals once for real**, with Docker up, and fix whatever breaks in `run-evals.ts`. Do this well before November.
5. **28 Oct: run `challenge-scout`** on the real 2026 statements the day they publish, then `prior-art-analyst` on the shortlist.
6. **13 Nov: read the 2026 Judging & Awards Guide** and diff it against the stored rubric.

### Concrete instruction to resume

> Read `docs/handoff/HANDOFF.md`, then this package's `SESSION.md` and `EVIDENCE.md`.
> The harness is built and stress-tested but unpushed and the eval runner is
> unexecuted. Start by pushing the repo, then run `npx tsx evals/run-evals.ts` with
> Docker running and fix what breaks. Do not add agents; nine is already more than a
> team can hold in mind.
