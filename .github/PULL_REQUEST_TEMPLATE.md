## What changed

<!-- One or two sentences. -->

## Why

<!-- The failure this fixes. If an agent gave bad advice, link the issue with the paste. -->

## Evals

A change to an agent or a skill runs the evals. Tick one:

- [ ] Ran `npx tsx evals/run-evals.ts`, output attached below
- [ ] Not an agent or skill change (docs, CI, tooling, catalogue URL)
- [ ] Could not run them, and I have said why below

<!-- Eval output, or the reason. A PR that changes an agent with no eval result and no
     reason gets sent back. -->

## Checklist

- [ ] `node scripts/validate-plugin.mjs` passes
- [ ] No fixture in `evals/fixtures/` was edited to make a run pass
- [ ] If this is a release: `plugin.json` and `marketplace.json` versions agree
