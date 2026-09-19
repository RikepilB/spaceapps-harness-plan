# HANDOFF

The harness is public, licensed and installable by anyone. The backlog is on GitHub as
16 issues in four milestones pinned to the event calendar. The next piece of real work
is making the eval runner execute once (#1).

## 1. What the audit found

Verified in the repo or on spaceappschallenge.org, 18 Sep 2026.

| Finding | Evidence | Where it went |
|---|---|---|
| No licence text although README and manifests said MIT | no `LICENSE` in tree | Fixed, PR #17 |
| Crew Readiness Board install commands used the pre-rename repo name | `RikepilB/spaceapps-harness`, `spaceapps-harness@spaceapps-harness` | Fixed, artifact v2 |
| Catalogue URL dead | `data.pandonia-global-network.org` → 410 | Fixed, PR #17 |
| Eval runner never executed | README Status; no results on any branch | #1 |
| `data-scout` has an eval prompt but no scoring key | `evals/keys/` holds only `exofinder.yaml` | #2 |
| 7 of 9 agents have no fixture | `evals/prompts/` holds 2 files | #3, #5, #6, #7 |
| Scoring is manual though keys are machine-checkable | `must_mention_any`, `pass_threshold` | #4 |
| Eval model pinned to `claude-opus-4-8` | `evals/run-evals.ts` | #8 |
| Team size contradicts itself in three places | `CLAUDE.md` "2–6"; `rules-and-timeline.md` "solo permitted"; `team-building/SKILL.md` "2 to 6… solo allowed" | `CLAUDE.md` fixed here; skill half #9 |
| devDependencies all `"*"`, no lockfile | `package.json` | #12 |
| Link checker: Node `fetch` fails where `curl` succeeds | `data.nasa.gov` 200 under curl | #13 |
| Four README dates not on the 2026 page | 28 Oct, 13 Nov, Dec, Jan | Marked *expected*; #14 |
| No release tags | `git tag` empty | #15 |

## 2. Decisions and why

- **Issues, not prompt edits.** `CONTRIBUTING.md`: a change to an agent or skill runs
  the evals, and the evals cannot run yet. So agent and skill bodies were left alone
  and every behavioural finding became an issue.
- **Link checker written, not installed.** A dependency-free Node script instead of a
  third-party action, matching `validate-plugin.mjs`. Only 404/410 fail the build;
  403/429 from government hosts with bot protection are reported, not failed.
- **Private, merge, then public.** The repo was created private, PR #17 merged, then
  visibility flipped. The old "this repo is private" README was never visible publicly.
- **Milestones follow the event calendar.** The 7 Nov freeze enforces
  `CONTRIBUTING.md`'s rule: do not let the harness become the project.

## 3. Risks and open assumptions

- **The board is shared with nobody yet.** The README tells teammates to ask Richard;
  until he shares it from the page's share menu, the link opens for no one else.
- **The link checker misses soft 404s.** A retired page that redirects to a homepage
  returns 200. `/resources/participant-faqs/`, the original source for team rules, now
  does exactly that. Add it to #13's scope.
- **Line endings.** Python `write_text` on Windows writes CRLF and turned three
  one-line edits into whole-file diffs. Caught before push. Edit with `sed -i` or open
  files with `newline=""`.

## 4. Next steps, in priority order

1. Share the Crew Readiness Board with each teammate (operator, manual).
2. #1: run the evals once, with Docker or Podman and `.sandcastle/.env`.
3. #9: confirm the minimum team size from an official 2026 source, then fix both skill references.
4. #11: run `challenge-scout` on the 14 published summaries. The team needs a shortlist anyway, and this is the agent's first real input.
5. #2 and #3: lock in the v0.1.0 defects as scored regressions.

### Concrete instruction to resume

Read `docs/handoff/HANDOFF.md`, then open the milestone *Evals run for real* on GitHub
and start at #1.
