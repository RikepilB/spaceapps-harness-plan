# Space Apps Harness

A shared harness for the NASA International Space Apps Challenge: nine subagents and ten
skills covering the whole arc from "which challenge do we pick" to "the judges scored our
submission". Built on the published rubric and five years of global winners.

This repo is both the plugin and a Claude Code plugin marketplace, so a teammate goes from
nothing to working in two commands.

## Install (teammates start here)

```
/plugin marketplace add RikepilB/spaceapps-harness
/plugin install spaceapps-harness@spaceapps-harness
```

Then read [docs/ONBOARDING.md](docs/ONBOARDING.md). It takes about ten minutes and one of
its steps has a deadline attached, so do it before the hackathon, not on the day.

## What's in it

**Agents** — `challenge-scout`, `prior-art-analyst`, `data-scout`, `team-architect`,
`scope-planner`, `build-engineer`, `science-validator`, `submission-auditor`,
`pitch-director`.

**Skills** — `spaceapps-brief`, `challenge-selection`, `nasa-data-access`,
`award-targeting`, `team-building`, `hackathon-war-room`, `project-page-builder`,
`demo-video`, `judge-simulation`, `sandcastle-orchestration`.

## How the team uses it

| Document | For |
|---|---|
| [docs/ONBOARDING.md](docs/ONBOARDING.md) | A new teammate, day one |
| [docs/TEAM-RUNBOOK.md](docs/TEAM-RUNBOOK.md) | The hackathon weekend, hour by hour, who runs what |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Changing the harness and getting it released |
| [CLAUDE.md](CLAUDE.md) | Shared context every teammate's Claude reads automatically |
| [evals/](evals/) | Regression tests that keep the agents honest |

## Why the evals exist

The first version of this plugin shipped with six real defects, including a scoring
formula whose sign was backwards and a code sample that would have fed an "early warning"
tool data running three months behind. Both were found by running the agents against
fixtures with planted errors, not by reading the files.

So: **every change to an agent or skill runs the evals.** See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

MIT.
