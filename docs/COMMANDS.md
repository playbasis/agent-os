# Command Reference

Last updated: 2026-07-06

The complete `pbos` command surface, grouped by workflow. For a five-minute
introduction, use the Quick Start in the [README](../README.md). All commands
below run against the deterministic `fixture` profile unless noted; see
[Profiles](../README.md#profiles) for what each profile is allowed to touch.

## Setup and Health

```bash
pnpm install
pnpm pbos donor:verify                          # verify frozen donor manifest hashes
pnpm pbos services:doctor --profile fixture     # connector health for the chosen profile
pnpm mission:doctor -- --profile fixture        # mission-loop preflight
```

## Core Mission Loop

```bash
pnpm pbos run examples/workspaceops-launch-pack/mission.json --profile fixture
pnpm pbos hill-climb examples/workspaceops-launch-pack/mission.json --profile fixture --iterations 4
pnpm pbos optimize examples/workspaceops-launch-pack/mission.json --profile fixture --iterations 4
pnpm pbos eval <runId>
pnpm pbos replay <runId>
```

Shortcuts: `pnpm mission:fixture`, `pnpm hill-climb:fixture`, `pnpm optimize:fixture`.

## Navigator: Goals, Path Fans, and Proofs

```bash
pnpm pbos navigate compile "<goal text>" --out goals/twin-ab/goal.json
pnpm pbos navigate fan goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:n2 goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:loop goals/twin-ab/goal.json --paths 20 --mission examples/workspaceops-launch-pack/mission.json --profile fixture
pnpm pbos navigate prove:daily-loop goals/twin-ab/goal.json --mission examples/workspaceops-launch-pack/mission.json --profile fixture --days 3 --paths 20
pnpm pbos navigate prove:validator goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:source-repair goals/twin-ab/goal.json --apply --restore-after-proof
pnpm pbos navigate prove:primitives goals/twin-ab/goal.json --paths 20
```

Notes:

- `prove:loop --mission <mission.json>` dispatches a real kernel mission, maps
  its evidence pack into Navigator observations, and reports
  fixture/dispatched-run observation weight fractions. It also writes a
  pre-observation `path-fan-registration.json`, a `path-calibration-report.json`
  with coverage/RMSE-style scores per registered path envelope, and an
  `ambition-ratchet-decision.json`.
- `fan --shape-memory <shape-library-entry.json>` consumes a prior emitted by a
  previous loop proof, boosts matching path families, and records the matched
  memory entry on generated paths.
- `prove:daily-loop` dispatches one mission-backed Navigator cycle per
  simulated day and writes leases, next wakeups, daily-loop events,
  shape-memory writes, and ratchet summaries. This is a bounded proof of
  daily-loop mechanics, not always-on production scheduling.
- `prove:n2` records deterministic Proposer/Adversary/Estimator/Synthesizer
  seat votes and council disagreement metrics; this is a fixture
  council-diversity proof, not live multi-model judging.
- `prove:validator` runs the real local Flappy smoke probe and a generated
  repaired Pygame artifact; pass `--python <path>` to override the runtime.
- `prove:source-repair` replaces the original seed only when `--apply` is
  provided; `--restore-after-proof` leaves the source tree clean afterward.

## Prompt Twin and Council Proofs

```bash
pnpm pbos navigate prove:prompt-twin goals/twin-ab/goal.json --profile fixture
pnpm pbos navigate prove:prompt-twin-ab goals/twin-ab/goal.json \
  --commitment eval-families/flappy/scorer-commitments/heldout-v1.commitment.json \
  --expected-lift 0.10
pnpm pbos navigate prove:council-provider goals/twin-ab/goal.json --profile fixture
pnpm pbos navigate prove:council-session goals/twin-ab/goal.json --profile fixture
```

Notes:

- `prove:prompt-twin` uses fixture judgment by default; the gated
  ProviderBridge path requires `PBOS_ALLOW_PROVIDER_CALLS=1
  --profile staging-sandbox --require-live`.
- `prove:prompt-twin-ab` runs a generated control arm against a Prompt
  Twin-steered repair arm, writes a pre-registration before held-out scoring,
  and stores only hashes, aggregate scorer outputs, and safe runtime metrics.
- `prove:council-session` records live/gated/failed seat counts plus
  disagreement across all four council seats; `--require-live` requires four
  live provider seats. Proof artifacts store hashed provider identity
  metadata only.

## Eval Factories and Held-Out Families

```bash
pnpm pbos eval-factory:flappy --cases 500 \
  --train-out eval-families/flappy/train/manifest.json \
  --heldout-commit-out eval-families/flappy/scorer-commitments/heldout-v1.commitment.json \
  --private-heldout-out $PBOS_PRIVATE_EVAL_ROOT/flappy-heldout-v1
pnpm pbos eval-factory:flappy-score --artifact <artifact.py> \
  --commitment eval-families/flappy/scorer-commitments/heldout-v1.commitment.json \
  --out reports/eval-factory/flappy-heldout-score.json
pnpm pbos eval-factory:asset-clone --cases 240 \
  --train-out eval-families/asset-clone/train/manifest.json \
  --heldout-commit-out eval-families/asset-clone/scorer-commitments/heldout-v1.commitment.json \
  --private-heldout-out $PBOS_PRIVATE_EVAL_ROOT/asset-clone-heldout-v1
```

Held-out case bodies always live outside the repo under
`$PBOS_PRIVATE_EVAL_ROOT`; only manifests, commitments, and hashes are public.

## Asset Clone and Navigator App Visual Loop

```bash
pnpm pbos navigate compile "<visual goal>" --domain asset-clone --out goals/asset-clone/goal.json
pnpm pbos navigate observe --query "<observation>" --kind image_create --profile fixture --goal goals/asset-clone/goal.json
pnpm pbos navigate prove:asset-clone goals/asset-clone/goal.json --profile fixture \
  --commitment eval-families/asset-clone/scorer-commitments/heldout-v1.commitment.json \
  --private-heldout $PBOS_PRIVATE_EVAL_ROOT/asset-clone-heldout-v1 \
  --expected-diff-ratio 0.02

pnpm navigator:process:validate
pnpm navigator:build
pnpm navigator:rendered:capture -- --suite training     # also: heldOut, external
pnpm navigator:rendered-pixel:score -- --suite training --allow-failing
pnpm navigator:visual-quality:profile
pnpm navigator:visual-quality:score -- --suite training --allow-failing
pnpm navigator:serve
```

`prove:asset-clone` exercises the creative bridge with gated `image_create`
evidence, private held-out target grids outside the repo, pre-registration
before pixel scoring, and aggregate pixel-diff output only. No raw prompts,
URLs, image payloads, target pixels, or answer keys enter public artifacts.
`navigator:build` fails unless the builder process contract
(`design/navigator-builder-process.json`) passes.

## Router Lab

```bash
pnpm pbos router catalog --sync <inventory-path>
pnpm pbos router run examples/router-phase0/mission.json --profile fixture --config fixture-echo
```

## Value, Audit, and Research Loops

```bash
pnpm pbos audit scorecard --profile fixture
pnpm pbos value run --family workspaceops-launch-pack --arms pov,human,generic-agent --profile fixture
pnpm pbos value:proof examples/workspaceops-launch-pack/mission.json --profile staging-sandbox --iterations 4 --require-live
pnpm pbos mechanics probe --profile fixture
pnpm pbos research-loop run --family ceo-sim --iterations 3 --profile fixture
pnpm pbos ceo-sim run --policy pbos-agent --days 14 --profile fixture
pnpm pbos ceo-sim prove --heldout <path-outside-repo> --profile staging-sandbox
pnpm pbos ceo-sim workspaceops-adapter --profile local-monorepo
pnpm pbos ceo-sim policy-experiment --profile local-monorepo
pnpm pbos ceo-sim repair-quest --profile local-monorepo
```

## Warehouse, Dashboard, and Knowledge

```bash
pnpm pbos runs:index
pnpm pbos runs:query --profile staging-sandbox --min-heldout-score 0.8
pnpm pbos runs:summary
pnpm pbos sandbox:build
pnpm pbos knowledge compile --sources reports --out reports/agent-os-wiki
pnpm pbos knowledge lint --path reports/agent-os-wiki
```

## Proof Gates and Export

```bash
pnpm pbos proof:robust examples/workspaceops-launch-pack/mission.json --profiles fixture,local-monorepo --iterations 4
pnpm prove:robust
pnpm pbos provider:smoke --profile staging-sandbox --require-live
pnpm pbos export-oss-candidate --verify
```

See `docs/ROBUST_PROOF_PROTOCOL.md` for the pass gates behind `proof:robust`
and the current claim boundary attached to its output.
