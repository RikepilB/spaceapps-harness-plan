# Space Apps Harness

**A Claude Code plugin for entering the NASA International Space Apps Challenge seriously**:
nine subagents, eleven skills, a team runbook, a verified dataset catalogue, and a
regression suite that keeps the whole thing honest.

[![validate](https://github.com/RikepilB/spaceapps-harness-plan/actions/workflows/validate.yml/badge.svg)](https://github.com/RikepilB/spaceapps-harness-plan/actions/workflows/validate.yml)
[![links](https://github.com/RikepilB/spaceapps-harness-plan/actions/workflows/links.yml/badge.svg)](https://github.com/RikepilB/spaceapps-harness-plan/actions/workflows/links.yml)
[![licence: MIT](https://img.shields.io/badge/licence-MIT-0F5F5B.svg)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-3B2B55.svg)](https://code.claude.com/docs/en/plugin-marketplaces)

Built for the 2026 edition (hackathon **14–15 November 2026**) and structured so it
survives to the next one. Open source, so any team can install it, and any team that
finds it wrong can say so.

---

## Why this exists

Space Apps is not won by the best code. In 2025 it drew **11,500+ submissions** and
produced **10 global winners**, and every one of those projects was scored on the same
five published criteria:

> **Impact** · **Creativity** · **Validity** · **Relevance** · **Presentation**

Two of those five are not engineering. One of them, Presentation, is a multiplier on
the rest: a judge who cannot understand the project cannot score its Impact or its
Validity at all.

Most teams discover this at hour 26, when the build is done and the project page is
blank. This repo is the attempt to know it at hour 0.

### The funnel

```
11,500+ submissions
   ↓  local judges nominate
 1,290+ global nominees          ~11% of submissions
   ↓  NASA + partner agency experts
    45 finalists (+23 mentions)  ~3.5% of nominees
   ↓  executive panel
    10 global winners            ~1 in 1,150
```

The realistic first target is **nominee**. It is the only gate your local judges
control, and roughly one submission in nine clears it.

---

## Quick start

In Claude Code:

```
/plugin marketplace add RikepilB/spaceapps-harness-plan
/plugin install spaceapps-harness@spaceapps-harness-plan
```

Check it took: ask Claude *"what are the Space Apps judging criteria?"* You should get
the five criteria straight back, not a web search.

Pick up new versions with `/plugin marketplace update`.

Then read **[docs/ONBOARDING.md](docs/ONBOARDING.md)**. Ten minutes, and one step
depends on an external account, so do it before the hackathon rather than on the day.

### On Richard's team?

Claim your row on the **[Crew Readiness Board](https://claude.ai/artifact/Sg5wekdyyznqAZVjtygwTv)**:
the onboarding checklist as a live board, so the whole crew can see who is actually
set up before the weekend.

> **Team-only.** The board is a private page with a shared roster of real names, so it
> opens only for people it has been shared with. Ask Richard for access. Everyone else:
> the same checklist is [docs/ONBOARDING.md](docs/ONBOARDING.md).

---

## What's inside

### Nine agents, one per stage of the weekend

| Agent | Stage | What it does |
|---|---|---|
| `challenge-scout` | Investigation | Reads every published challenge, scores them on six dimensions against your team's real capability, recommends one and says why the runner-up loses |
| `prior-art-analyst` | Investigation | Mines past winners and finalists for what scored, what is saturated, and which lane is still open |
| `data-scout` | Databases | Builds a dataset manifest with verified endpoints, auth, formats and a working fetch snippet. Refuses to list a URL it has not confirmed resolves |
| `team-architect` | Organization | Audits capability gaps, writes the recruiting spec, assigns roles |
| `scope-planner` | Planning | Converts the challenge into an hour-by-hour plan with named cut-line owners |
| `build-engineer` | Execution | Implements against the plan, naming the debts it takes and why |
| `science-validator` | Validity | Adversarially attacks the science, units, statistics and data handling before a judge does |
| `submission-auditor` | Presentation | Scores the draft against the real rubric, returns fixes ranked by payoff per minute |
| `pitch-director` | Presentation | Video script, shot list, demo run-of-show, three pitch lengths |

### Eleven skills

**Knowledge**: `spaceapps-brief` (rules, timeline, rubric, five years of winners,
extracted patterns), `nasa-data-access` (a catalogue harvested from the challenges'
own curated Resources lists).

**Decisions**: `challenge-selection`, `award-targeting`, `team-building`.

**Execution**: `hackathon-war-room`, `project-page-builder`, `demo-video`,
`judge-simulation`.

**Meta**: `sandcastle-orchestration` (running agents in parallel sandboxes),
`session-handoff` (turning a session into a traceable record).

---

## The three ideas this is built on

**1. Target an award category, not just a challenge.**
There are ten awards and one winner each, so they are ten separate games. Five of them
(Storytelling, Art & Technology, Most Inspirational, Global Connection, Local Impact)
are half the prize pool and attract a much thinner field of technically strong teams.
Enter the race where your rarest asset is scarcest. `award-targeting` has the full
argument.

**2. Plan backwards from the demo.**
Judges see a project page, a short video and maybe a live pitch. They do not see your
architecture. Every hour spent on something a judge cannot perceive is an hour spent
on nothing, unless it is load-bearing for something they can.

**3. Name the beneficiary.**
Nearly every winner is the same four-part object: *a real named dataset + a transform
that does real work + an interface a non-expert can drive + a named beneficiary*.
Miss the third and you fail Presentation. Miss the fourth and you fail Impact.

---

## How a team uses it

| Document | For | When |
|---|---|---|
| [docs/ONBOARDING.md](docs/ONBOARDING.md) | A new teammate, day one | Before the event |
| [docs/TEAM-RUNBOOK.md](docs/TEAM-RUNBOOK.md) | Who runs which agent, hour by hour | The weekend |
| [CLAUDE.md](CLAUDE.md) | Shared context every teammate's Claude reads automatically | Always |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Changing the harness and getting it released | After anything goes wrong |
| [docs/handoff/](docs/handoff/) | Session history. Start at `HANDOFF.md` for current state | Picking the work back up |

---

## How it stays honest

**Version 0.1.0 shipped with six real defects.** None were visible by reading the
files. All six were found by running the agents against inputs with known-wrong
answers:

| Defect | Why it mattered |
|---|---|
| The saturation dimension's anchors contradicted the ranking formula's sign | **Every challenge ranking would have been backwards** |
| The canonical data snippet used IMERG Final Run, ~3.5 months behind | An "early warning" tool built on it looks live and is silently stale. **Nothing errors.** |
| No notion of data latency anywhere | The single dimension that decides a forecasting project's whole manifest |
| A dead link in the catalogue (verified 404) | An hour lost at 2am on the Saturday |
| `data-scout` had no branch for "no challenge URL supplied" | It silently skipped its own highest-priority step |
| No forecast data source at all | Missed GEOS-5 FP: open, no auth, five of six variables a frost-warning tool needs |

**Version 0.4.0 shipped with a seventh, in the tooling.** Every agent's frontmatter
was invalid YAML, so the real plugin loader rejected all nine. The validator checked
that fields were *present* rather than that the block *parsed*, and reported 22 green
ticks on nine broken files. It now parses, and `scripts/test-validator.mjs` feeds it
the broken input to prove it says no.

So the rule is: **a change to an agent or skill runs the evals.**

```bash
node scripts/validate-plugin.mjs  # structural checks, no install needed
npm test                          # proves the validator rejects broken frontmatter
node scripts/check-links.mjs      # every URL in the catalogue and docs
npm install
npx tsx evals/run-evals.ts        # needs Docker or Podman running
```

Each eval runs an agent in a sandbox on its own branch and lands its output as a
commit you review. `evals/fixtures/exofinder.md` carries ten planted defects;
`evals/keys/exofinder.yaml` scores them with a pass threshold of 8 out of 10. The
current agent catches all ten, plus three that were never planted.

The link checker runs weekly in CI. Its first run found the Pandonia data portal
returning **410 Gone**; the catalogue now points at the live one.

Fixtures are the test. **Never edit one to make a run pass.**

---

## Dates for 2026

Checked against [spaceappschallenge.org/2026](https://www.spaceappschallenge.org/2026/)
on 18 September 2026. Rows marked *expected* follow previous years' pattern and are not
yet on the 2026 page.

| Date | What | Status |
|---|---|---|
| 26 Aug | Accounts, registration and local-event selection open | Published |
| 17 Sep | Team formation opens. **14 challenge summaries are live** | Published |
| ~28 Oct | Full challenge statements, with the curated Resources lists | *Expected* |
| ~13 Nov | Judging & Awards Guide and submission guide | *Expected* |
| **14–15 Nov** | **The hackathon** | Published |
| **15 Nov, 23:59** | **Submission deadline, on your local event's clock** | Published |
| 30 Nov | Participant survey | Published |
| Dec–Jan | Nominees, finalists, then global winners | *Expected* |

On the Universal Event the deadline follows the local time of **whoever created the
team**, so the Lead creates it.

> **Teams may not begin working on the challenges before the hackathon opens.**
> Accounts, tooling, reading and team formation beforehand are fine. Code and assets
> are not. This is a rule, not a convention.

---

## Roadmap

Work is tracked as [issues](https://github.com/RikepilB/spaceapps-harness-plan/issues)
grouped into [milestones](https://github.com/RikepilB/spaceapps-harness-plan/milestones)
pinned to the event calendar:

| Milestone | Due | Done when |
|---|---|---|
| Open-source launch | 25 Sep 2026 | Public, licensed, installable by anyone, templates and link check live |
| Evals run for real | 16 Oct 2026 | `run-evals.ts` has executed against a real sandbox and every agent has a fixture |
| Harness freeze | 7 Nov 2026 | A tagged release the team pins for the weekend. No prompt changes after this |
| Post-event retro | 30 Nov 2026 | One issue per thing the harness got wrong, filed while it is fresh |

The freeze date is deliberate. `CONTRIBUTING.md` has a rule that outranks the rest:
**do not let the harness become the project.**

---

## Contributing

The most useful thing you can report is **an agent giving bad advice, with its output
pasted verbatim**. Prompts fail silently; the output is the only evidence.

[Open an issue](https://github.com/RikepilB/spaceapps-harness-plan/issues/new/choose).
There are forms for bad agent advice, dead links, and stages of the weekend nothing
covers. To change an agent, follow [CONTRIBUTING.md](CONTRIBUTING.md): write the
failing fixture first, then change the prompt, then run the evals, then open the PR
with the output attached.

---

## Repo map

```
.claude-plugin/marketplace.json   makes this repo installable
plugins/spaceapps-harness/        the plugin: 9 agents, 11 skills, 5 reference files
evals/                            fixtures, scoring keys, sandcastle runner
docs/ONBOARDING.md                new teammate, day one
docs/TEAM-RUNBOOK.md              the weekend, hour by hour
docs/handoff/                     append-only session history
scripts/validate-plugin.mjs       dependency-free structural validator (CI)
scripts/test-validator.mjs        proves the validator rejects broken input (CI)
scripts/check-links.mjs           dependency-free link checker (CI, weekly)
.github/                          workflows, issue forms, PR template
CLAUDE.md                         shared working agreements
CONTRIBUTING.md                   the improvement loop
```

---

## Status

Built, stress-tested, documented, public. Current state and open blockers live in
[docs/handoff/HANDOFF.md](docs/handoff/HANDOFF.md).

Known gap: `evals/run-evals.ts` is syntax-checked but has never been executed against
a real sandbox. Expect to debug it on first run, and do that well before November.
It is the first issue in the *Evals run for real* milestone.

## Licence

[MIT](LICENSE). Not affiliated with or endorsed by NASA. Dataset names and URLs point
to their publishers' own terms.
