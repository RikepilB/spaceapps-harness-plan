# Project context

This repo is the team's Space Apps harness: a Claude Code plugin (agents + skills) plus
the evals that keep it honest.

## Ground truth about the event

Re-check anything dated against spaceappschallenge.org before acting on it. The structure
is stable year to year; the dates move.

- Hackathon: **14–15 November 2026**. Submissions close on the **local event's** clock.
- On the Universal Event, the deadline follows the local time of **whoever created the
  team**.
- Teams: **at most six** members, all registered for the same event. One team per
  person, one challenge per team. The 2026 page states no minimum; the original
  research recorded solo entry as allowed. Do not tell a solo participant they cannot
  enter (#9 tracks confirming it).
- **No work on the challenges before the hackathon opens.** Accounts, tooling, reading
  and team formation beforehand are fine. Code and assets are not.
- Judging: five criteria, equally weighted — Impact, Creativity, Validity, Relevance,
  Presentation.
- Funnel, 2025 actuals: 11,500+ submissions → 1,290+ nominees → 45 finalists + 23
  honorable mentions → 10 winners.

## Working agreements

- **Never invent a metric, a user count, or a projected impact number.** If a figure is
  not sourced, it does not go in the project page, the video, or the pitch.
- **Never fill a chart with synthetic data and present it as a result.** Every number
  shown traces to a real datum.
- Name datasets specifically — "TEMPO tropospheric NO2, Level 3", never "NASA data".
- State limitations. Judges scoring Validity read a named limitation as competence.
- Cache fetched data to disk. A live API call inside a demo is a dependency on someone
  else's uptime during the only ten minutes that matter.

## Code conventions

- TypeScript strict everywhere. `interface` for data shapes, Zod for anything external or
  model-produced. Functional components, Server Components by default.
- Python: full type hints, Google-style docstrings, `snake_case`, Pydantic over raw dicts,
  `pathlib` over `os.path`, never a bare `except`.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- Comment the *why*, not the *what*.

## Editing the harness

Agent and skill files are the product. Changing one means running `evals/` before the PR.
Do not edit `evals/fixtures/` — the errors in those files are the test.
