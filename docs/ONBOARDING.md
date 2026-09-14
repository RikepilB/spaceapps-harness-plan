# Onboarding: ten minutes, do it before the event

Welcome. This gets you from nothing to ready. One step has a hard dependency on an
external account, so do not leave it to the day.

## 1. Install the harness (2 min)

In Claude Code:

```
/plugin marketplace add RikepilB/spaceapps-harness
/plugin install spaceapps-harness@spaceapps-harness
```

Check it took: ask Claude *"what are the Space Apps judging criteria"*. You should get
Impact, Creativity, Validity, Relevance, Presentation — not a web search.

## 2. Register for the event (3 min)

1. Create an account at spaceappschallenge.org
2. Register for the current hackathon
3. **Select the same event as the rest of the team.** Members of one team must all be
   registered to the same event. Getting this wrong is not fixable by anyone but you.
4. Accept the terms

## 3. Create your data accounts (3 min, but do it today)

- **Earthdata Login** — <https://urs.earthdata.nasa.gov/>. Free and instant. Most NASA
  Earth-science data is gated behind it. Creating it on the day costs an hour nobody has.
- **api.nasa.gov key** — free, instant. `DEMO_KEY` throttles at roughly 30 requests an
  hour and will fail mid-demo.

Then confirm your machine works:

```bash
pip install earthaccess xarray netCDF4 rasterio
python -c "import earthaccess, xarray; print('ok')"
```

If that errors, sort it now. Not at hour 3.

## 4. Read two things (2 min)

- `docs/TEAM-RUNBOOK.md` — what happens on the weekend and who does what
- `CLAUDE.md` — the working agreements, especially the two about never inventing numbers

## 5. Know your role

Roles are assigned by name before the event, not negotiated during it. If you do not know
which of Lead / Data / Core / Interface / Narrative / Floater is yours, ask now.

## What you can and cannot do before the hackathon

**Can:** read the published challenges, create accounts, install tooling, learn
libraries, form the team, study past winners.

**Cannot:** write the project's code, build its assets, or train its models. Teams are not
permitted to begin working on the challenges before the hackathon opens. This is a rule,
not a convention.

## If you get stuck

Ask Claude — the harness covers most of it. `spaceapps-brief` answers rules and timeline
questions, `nasa-data-access` answers data questions. If the answer is wrong, that is a
bug worth reporting: see CONTRIBUTING.md.
