# Loss Function Design Addendum for Navigator

Last updated: 2026-07-05
Companion to: `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md`,
`docs/PROOF_SOTA_RESEARCH_COMMERCIALIZATION_PLAN.md`, and
`docs/ROBUST_PROOF_PROTOCOL.md`.
Canonical framing: `docs/VISION.md` defines the system promise; this addendum
defines how that promise becomes measurable loss functions and non-gameable
eval gates.

This addendum codifies the next Navigator upgrade: stop treating a mission
spec, scripted ladder, or checklist as the optimizer target. The target must
be an explicit loss function with fences, instruments, blinded evaluation,
and forced entropy. The agent can then search for steps, but it cannot
silently rewrite what success means.

## 1. What the LFD Frame Validates

The system has already converged on the same physics:

- Optimizers exploit cheap targets. Heuristic evals, maturity ladders, and
  keyword-shaped gates all become shortcuts unless the target is engineered
  as carefully as the agent.
- The PoV's discipline is directionally right: held-out gates, path-fan
  pre-registration, evidence packs, falsifiers, redaction gates, run
  warehouse indexing, and safe provider metadata are the receipts that make
  the work auditable.
- The current proof is still not enough: a governed exoskeleton with real
  rails is not yet a self-improving mind. The next proof needs a target that
  cannot be won by memorization, fixture equilibrium, or self-reported lift.

The short framing: **Loss Function Design with receipts**. The research
contribution is not merely "an agent got a better score"; it is a repeatable
method for making autonomous improvement measurable, blinded, replayable,
and safe to inspect.

## 1.1 Essay-to-PoV Translation, 2026-07-05

The external LFD essay is useful because it independently names the same
failure mode the PoV already hit: when the eval target is cheap, the agent
does not become smarter; it becomes better at exploiting the evaluator. The
PoV's historical sequence maps directly:

| Essay failure | PoV equivalent | Hardening response |
| --- | --- | --- |
| Seed the eval data | Heuristic evals flattered by visible feature checks | Training/held-out split plus trust gates |
| Memorize misses | Scripted maturity ladder and candidate self-reporting | Scorer-only held-out families and pre-registration |
| Enumerate keywords | Checklist-shaped artifacts and eval-shaped fields | Safe evidence boundary plus memorization alarm |

The difference to preserve is that this repo should not publish a self-scored
story. It should publish **LFD with receipts**: path-fan pre-registration,
hash-committed answer keys, scorer-only held-out output, evidence packs,
falsifiers, redaction gates, run warehouse summaries, and proof commands that
can be rerun.

The essay adds six concrete mechanics that are now part of the Navigator
roadmap:

1. **Loss function as the goal artifact.** `goal.json` must carry the target,
   constraints, instruments, entropy rules, and blinded eval reference. A
   mission spec is only a starting path, not the definition of success.
2. **Eval sets too large to enumerate.** Generated families need hundreds of
   cases, capacity caps, and rotation rules. The Flappy mutation factory is
   the first family; asset-clone/pixel-diff is the second objective domain.
3. **Blinding by filesystem and command boundary.** `visibleToOptimizer:
   false` is not enough. Held-out bodies and answer keys live outside this
   workspace, with only commitments and aggregate scorer outputs in repo.
4. **Forced entropy.** Training-up/held-out-flat forces fence removal or
   family widening. Stall forces a bounded non-leading path step. Every
   cycle logs hypothesis, expected failure mode, and diagnostic instrument.
5. **Time and spend inside the loss.** Progress Sharpe is the selection
   criterion, not just a dashboard metric: verified progress per unit of
   hours, spend, and risk.
6. **Instruments available mid-run.** The inner agent must be able to query
   budget, elapsed time, spend, training score, held-out scorer status,
   calibration, and evidence safety before and after risky steps.

Use any external `/lfd-design` skill or open-source reference as reading
material only until its license and prompt/code reuse terms are checked. Do
not paste third-party skill code or private prompt material into this repo.

## 2. Replace Specs With Loss-Function Goal Artifacts

`pbos navigate compile` should emit the four LFD components explicitly:

1. **Target**: the scalar or vector loss to descend, the bar to clear, and
   the blinded eval reference that will score it.
2. **Constraints**: time, spend, surface area, methodology, safety, and
   secret-handling fences.
3. **Instruments**: one command or query per constraint so the inner agent
   can check its own state during the run.
4. **Entropy rules**: mandatory exploration rules that fire when training
   lift diverges from held-out lift or when progress stalls.

The goal remains human-readable, but the optimizer receives a target surface,
not a recipe. Missions can still contain steps as a starting baseline; they
must not be the definition of success.

Minimum `goal.json` extension:

```jsonc
{
  "lossFunction": {
    "target": {
      "name": "flappy_prompt_twin_transfer_loss",
      "primaryMetric": "heldOutPassRate",
      "direction": "maximize",
      "bar": 0.8,
      "trainingEvalRef": "eval-families/flappy/train-manifest.json",
      "blindedEvalRef": "scorer-only:flappy-heldout-v1",
      "answerKeyCommitment": {
        "algorithm": "sha256",
        "hash": "<committed-before-run>"
      }
    },
    "constraints": [
      {
        "name": "wall_clock_hours",
        "limit": 2,
        "instrument": "pbos budget:status --field elapsedHours"
      },
      {
        "name": "provider_spend_usd",
        "limit": 25,
        "instrument": "pbos budget:status --field spendUsd"
      },
      {
        "name": "safe_evidence_only",
        "limit": "no raw URLs, env keys, request bodies, response bodies, or selected live payloads",
        "instrument": "pbos evidence:scan <runId>"
      }
    ],
    "instruments": [
      "pbos budget:status",
      "pbos eval:training <runId>",
      "pbos warehouse:latest-observations --goal <goalId>",
      "pbos navigate calibration <goalId>",
      "pbos evidence:scan <runId>"
    ],
    "entropyRules": [
      {
        "name": "memorization_alarm",
        "condition": "trainingLift > 0.05 && heldOutLift <= 0.01",
        "forcedNextMove": "remove_or_cap_eval_shaped_artifact; widen held-out family; do not add another keyword gate"
      },
      {
        "name": "stall_exploration",
        "condition": "primaryMetricDelta <= 0 for one cycle",
        "forcedNextMove": "execute one step from a non-leading path in the registered fan"
      },
      {
        "name": "cycle_hypothesis_required",
        "condition": "every cycle",
        "forcedNextMove": "log hypothesis, expected failure mode, and diagnostic instrument before execution"
      }
    ],
    "timeCostPenalty": {
      "qualityWeight": 1,
      "hourPenaltyLambda": 0.04,
      "spendPenaltyMu": 0.01,
      "selectionMetric": "progressSharpe"
    }
  }
}
```

Implementation targets:

- `packages/navigator`: extend `NavigatorGoal` and `compileNavigatorGoal`.
- `packages/cli`: add `pbos navigate compile --lfd` once the schema lands.
- `schemas/navigator`: publish the goal artifact schema.
- `tests/navigator.test.ts`: assert targets, constraints, instruments, and
  entropy rules are present and deterministic in fixture mode.

Current status: `NavigatorGoal` now includes `lossFunction`,
`compileNavigatorGoal` emits it by default, `schemas/navigator/goal.schema.json`
requires it, and `tests/navigator.test.ts` verifies target, constraints,
instruments, entropy rules, Progress Sharpe selection, scorer-only held-out
refs, and answer-key commitments. A separate `--lfd` flag is unnecessary
while every compiled Navigator goal is expected to carry the LFD target.

## 3. Build an Eval Factory That Enumeration Cannot Beat

The highest-leverage next asset is an eval family too large and varied to
memorize. The repo already has the ingredients in the Flappy source repair
and mutation proof surface. Invert that machinery into a generator:

- Input: one clean or broken Pygame seed template plus a catalog of known
  defect operators.
- Output: 300-500 distinct broken Pygame variants.
- Each variant carries machine-scorable ground truth: injected defect ids,
  expected repair properties, and validator outcomes.
- Training split is visible to the optimizer.
- Held-out split is scorer-only and physically outside the coder's
  workspace.
- Answer keys are hash-committed before a run and revealed only during
  scoring.

Capacity rule: the eval family must be large enough that enumeration is more
expensive than learning the general repair behavior. A candidate that improves
only by listing known defect names should be treated as an evaluator failure,
not as agent progress. The forced next move is to remove answer-shaped fields,
cap list lengths, rotate held-out cases, or widen the generator.

Current status: `pbos eval-factory:flappy` now writes a deterministic
500-case Flappy family with 320 training cases in
`eval-families/flappy/train/manifest.json` and 180 held-out cases represented
only by `eval-families/flappy/scorer-commitments/heldout-v1.commitment.json`.
The commitment stores aggregate counts, an operator histogram, a held-out
manifest hash, and an answer-key hash; it does not store held-out case ids,
mutation recipes, expected repair properties, source bodies, or answer keys.
The private held-out manifest and answer key are written outside the repo by
default under `$PBOS_PRIVATE_EVAL_ROOT/flappy-heldout-v1/`;
the CLI refuses to write that private store inside the PoV worktree.
`pbos eval-factory:flappy-score` returns aggregate held-out scoring for an
artifact without including raw cases, answer keys, or artifact text.

First defect operator catalog:

| Operator | Ground truth |
| --- | --- |
| Disable gravity | repaired game must show nonzero gravity samples and bird motion |
| Freeze pipe speed | pipes must advance over the frame window |
| Disable scoring | score must increment after pipe crossing |
| Remove bounds/collision checks | validator must observe collision or bounds logic |
| Break jump impulse | player input must change vertical velocity |
| Spawn impossible gaps | repair must preserve playability while fixing gap bounds |
| Corrupt event loop | generated artifact must still pump events and exit deterministically |
| Hide state update behind constants | repair must fix behavior, not only names |

Recommended layout:

```text
eval-families/
  flappy/
    train/
      manifest.json
      variants/
    scorer-commitments/
      heldout-v1.answer-key.sha256
      heldout-v1.manifest.sha256
```

Held-out variant bodies and answer keys should not live in this worktree.
For local internal runs, store them under a scorer-only path outside the PoV
repo, for example:

```text
$PBOS_PRIVATE_EVAL_ROOT/flappy-heldout-v1/
```

The PoV repo may store only commitments, schema, public training examples,
and aggregate scoring outputs.

## 4. Make Blinding Infrastructure, Not Policy

`visibleToOptimizer: false` is necessary but not sufficient. A capable agent
will route around a policy flag if the data is reachable. Treat blinding as
a filesystem and command-boundary property.

Required rules:

- The coding agent workspace contains training manifests and scorer
  commitments only.
- Held-out variants, answer keys, and scorer-specific metadata live outside
  the workspace.
- The scorer receives candidate artifacts plus the committed held-out
  reference, not the optimizer transcript.
- The scorer writes aggregate scores and hashes back to the warehouse.
- Any command that prints held-out contents is forbidden from normal agent
  prompts and blocked by convention and test fixtures.

Minimum scorer output:

```jsonc
{
  "schemaVersion": 1,
  "suite": "heldOut",
  "family": "flappy-heldout-v1",
  "answerKeyCommitment": "sha256:<pre-run-hash>",
  "candidateArtifactHash": "<sha256>",
  "casesScored": 400,
  "passRate": 0.81,
  "failureClusters": [
    { "defectFamily": "pipe-motion", "count": 12 },
    { "defectFamily": "event-loop", "count": 7 }
  ],
  "rawCasesIncluded": false,
  "answerKeyIncluded": false
}
```

## 5. Add Forced Entropy to the Loop

Path reweighting is not enough. Without entropy rules, an optimizer can
knob-grind the leading path and overfit whatever signal is easiest. Add
forced moves that are triggered by observed failure modes.

### Memorization Alarm

Condition:

```text
training score rises while held-out score is flat or down
```

Action:

- Mark the cycle `memorization_detected`.
- Forbid "add more eval-shaped keywords" as the next move.
- Force one fence-removal or family-widening task:
  - cap enumerated list size,
  - remove answer-shaped artifact fields,
  - widen variant generation,
  - rotate held-out case family,
  - increase capacity of the generated eval family.

### Stall Exploration

Condition:

```text
primary loss does not improve in the last cycle
```

Action:

- Sample from a non-leading registered path.
- Spend a bounded budget on that path.
- Map the result back into observations and reweight the entire fan.

This is epsilon-greedy exploration over the existing path fan. The fan is
already the entropy reservoir.

### Hypothesis Per Cycle

Every cycle must log:

- hypothesis,
- expected failure mode,
- diagnostic instrument,
- expected metric movement,
- what result would falsify the move.

This extends the council falsifier discipline to every loop cycle so the
reasoning survives context compaction and warehouse replay.

Current status: runtime loop enforcement now records cycle hypotheses,
detects training-up/held-out-flat memorization divergence, forces
family-widening or artifact-pruning moves, and triggers bounded
stall-to-search or non-leading-path exploration through the registered
path fan.

## 6. Put Time and Spend Inside the Loss

Budgets are currently gates. LFD makes them part of selection.

Promotion and path selection should optimize Progress Sharpe:

```text
progressSharpe = verifiedProgress / (hours + spendPenalty + riskPenalty)
loss = qualityLoss + lambda * hours + mu * spend + rho * risk
```

Interpretation:

- 80 percent quality in 2 hours can beat 100 percent quality in 30 days.
- A path that needs repeated provider calls must justify the spend with
  held-out or reality-layer progress.
- Fixture-only progress can improve protocol confidence but should receive a
  low or zero `verifiedProgress` multiplier when the claim is task quality.

Implementation status and targets:

- Done in `packages/navigator`: `progressSharpe` is exposed on N2
  frontier selection and loop baseline comparisons. Efficient-frontier
  selection ranks by Progress Sharpe, with raw path-fit, constraint alarms,
  evidence confidence, reality/held-out fraction, and Sharpe lift reported
  separately.
- Remaining in `packages/navigator`: carry Progress Sharpe into calibration
  reports, ambition ratchet decisions, daily-loop allocation, and any
  provider-spend selection policy.
- `packages/evals`: include time/spend in economic suite scores.
- `packages/run-warehouse`: index cycle-level time, spend, and verified
  progress.

Selection rule: Navigator now ranks efficient-frontier path moves by Progress
Sharpe first, with raw quality as a reported component. This prevents a path
that reaches marginally higher quality at wildly higher time/spend from
looking like the winner. Constraint alarms are part of the loss, not only a
post-hoc gate.

## 7. Add Agent-Facing Instruments

A constraint without an instrument is only a wish. The inner agent should be
able to query the state of the loss during the run.

Minimum command surface:

```bash
pnpm pbos budget:status
pnpm pbos budget:status --run <runId>
pnpm pbos eval:training <runId>
pnpm pbos eval:held-out <runId> --scorer-ref <ref>
pnpm pbos warehouse:latest-observations --goal <goalId>
pnpm pbos navigate calibration <goalId>
pnpm pbos evidence:scan <runId>
```

Prompt rule for autonomous runs:

```text
Before taking a nontrivial step, call the relevant instrument for the
constraint you might violate. After the step, record the observed metric
delta and whether the cycle hypothesis survived.
```

The instruments are part of the loss surface. If a constraint has no callable
instrument, the compiler should mark the goal as incomplete rather than
letting the run proceed as if the constraint were enforceable.

## 8. Strategic Moat: Open-Source the Ruler, Keep the Answer Sheets

The durable asset is not only the kernel. It is the private ability to score
work against targets other systems cannot see or cheaply enumerate.

Private assets:

- Prompt Twin corpus: private taste and quality ground truth, never in git.
- Generated held-out eval families: large private case sets with committed
  answer keys.
- Playbasis service connectors, WorkspaceOps integrations, provider routing,
  env profiles, and live evidence.

Public assets:

- Generic kernel.
- Trace and evidence-pack format.
- Eval schema.
- Safe scoring harness.
- EGA-Bench specification.
- Sanitized fixture examples and public training cases.

Packaging rule:

```text
Open-source the ruler. Keep the answer sheets.
```

The public benchmark should define the measurement and let others run
against fixture/public cases. Private held-out families and Prompt Twin
ground truth remain the information asymmetry for internal product quality,
partner pilots, and competitive benchmarking.

This is the packaging rule for the eventual open-core line:

- The **ruler** is public: formats, fixture harness, schemas, scoring
  protocol, public cases, and replay commands.
- The **answer sheets** stay private: Prompt Twin corpus, private held-out
  cases, scorer answer keys, private visual targets, customer evals, live
  service traces, provider routing, and internal WorkspaceOps adapters.
- Zero-leak scanning is therefore moat defense as well as compliance. A leak
  of private answers weakens both the trust story and the product advantage.

## 9. Implementation Backlog

### P0 - Eval Factory

- Done: add a Flappy mutation generator module in `packages/navigator`.
- Done: generate 500 variants with known defect ids and expected repair
  properties.
- Done: write the training manifest into the repo.
- Done: write held-out commitments only; generated commitment artifacts do
  not include held-out case ids, mutation recipes, expected properties,
  source bodies, or answer keys.
- Done: write the private held-out manifest and answer key outside the repo,
  with hashes matching the in-repo commitment.
- Done: add a scorer-only command that returns aggregate held-out results
  without raw cases, answer keys, or artifact text.
- Done: upgrade Prompt Twin A/B to pre-register expected held-out lift before
  scoring and attach aggregate control/twin held-out scores to the proof.
  Latest proof: expected lift `0.1000`, control pass rate `0.1000`, twin pass
  rate `1.0000`, observed held-out lift `+0.9000`, result met the
  pre-registered bar.
- Add proof scenario: keyword-stuffed or defect-list-stuffed artifact
  improves training but underperforms held-out scoring.
- Add generator capacity assertions so small eval families cannot be reported
  as anti-enumeration proof.

### P0 - LFD Goal Format

- Done: extend `NavigatorGoal` with `lossFunction`.
- Done: make `pbos navigate compile` emit target, constraints, instruments,
  entropy rules, scorer-only held-out refs, answer-key commitments, and
  Progress Sharpe selection.
- Done: recompile `goals/twin-ab/goal.json` in the new shape.
- Done: add schema and tests.
- Done: wire entropy rules into actual loop execution commands.
- Next: wire the agent-facing instruments into actual loop execution
  commands rather than treating them as declared constraints.
- Next: fail compilation or mark the goal incomplete when a constraint lacks
  a callable instrument.

### P1 - Forced Entropy

- Done: add memorization alarm: training up plus held-out flat/down triggers a
  forced family-widening or artifact-pruning move.
- Done: add stall exploration: flat progress forces one bounded non-leading path
  step.
- Done: add cycle hypothesis fields to loop checkpoints.

### P1 - Agent-Facing Instruments

- Add budget, score, calibration, and evidence scan commands.
- Teach mission prompts to call those instruments before risky steps.
- Index instrument calls in the warehouse.

### P2 - Progress Sharpe

- Done: add the asset-clone second objective domain with gated
  `image_create` ProviderBridge evidence and deterministic pixel-diff
  scoring. Latest fixture proof writes private held-out visual targets
  outside the repo, pre-registers expected similarity `0.9800`, scores
  baseline similarity `0.5332` vs Navigator similarity `1.0000`, emits
  held-out observations, and stores only hashes/aggregate pixel metrics in
  public artifacts.
- Done: promote Progress Sharpe from a report metric to the
  efficient-frontier path-selection criterion.
- Done: include time/spend/risk penalties and constraint-alarm penalties in
  path ranking.
- Done: report raw path-fit quality and Progress Sharpe separately in
  Navigator loop reports, CLI output, schemas, and the sandbox credibility
  board.
- Done: add a regression test showing that a slower/higher-spend quality
  gain can lose to faster verified progress.
- Remaining: include Progress Sharpe in ratchet decisions, warehouse cycle
  summaries, and economic suite rollups.

### P2 - External LFD Reference Review

- Locate and read the external `/lfd-design` reference only in a separate
  review task.
- Record useful concepts as paraphrased design notes.
- Do not import code, prompts, examples, or datasets until license and reuse
  terms are explicitly reviewed.

### Strategic - Commercialization Plan

- Name private eval families plus Prompt Twin corpus as the explicit moat.
- State the packaging rule in the open-core section.
- Keep zero-leak scanning as moat defense, not only compliance.

## 10. Acceptance Criteria

The LFD upgrade is credible when all of these are true:

- `pbos navigate compile` emits a loss-function goal artifact with target,
  constraints, instruments, entropy rules, and pre-registration fields.
- A Flappy eval factory can produce at least 300 deterministic training and
  held-out cases from known defect operators.
- Held-out case bodies and answer keys are absent from the PoV repo.
- Answer key commitments are stored before scoring.
- A scorer-only command returns aggregate held-out results without revealing
  cases or keys.
- Prompt Twin A/B writes a pre-registration before held-out scoring and
  reports expected lift, control pass rate, twin pass rate, observed lift,
  and met/missed status from aggregate scorer output.
- A deliberately keyword-stuffed artifact improves training score but fails
  or underperforms held-out scoring.
- The loop records cycle hypotheses and forced entropy actions.
- Training lift is never labeled value or intelligence.
- Improvement requires held-out lift.
- Economic value requires time, spend, acceptance, rework, and human or
  external review data.
- Self-scored "50x" style claims are forbidden. A large score lift counts
  only when the scoring target was pre-registered, blinded where needed, and
  reproducible without exposing answer keys.

Recommended proof commands after implementation:

```bash
pnpm typecheck
pnpm test
pnpm pbos eval-factory:flappy --cases 500 --train-out eval-families/flappy/train/manifest.json --heldout-commit-out eval-families/flappy/scorer-commitments/heldout-v1.commitment.json --private-heldout-out $PBOS_PRIVATE_EVAL_ROOT/flappy-heldout-v1
pnpm pbos navigate compile "Make twin-steered harness runs measurably beat the control manager on held-out Flappy Bird variants" --out goals/twin-ab/goal.json
pnpm pbos navigate fan goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:prompt-twin-ab goals/twin-ab/goal.json --commitment eval-families/flappy/scorer-commitments/heldout-v1.commitment.json --expected-lift 0.10
pnpm pbos eval-factory:flappy-score --artifact reports/navigator/make-twin-steered-harness-runs-measurably-beat-t-f10115b1/flappy-prompt-twin-arm.py --commitment eval-families/flappy/scorer-commitments/heldout-v1.commitment.json --out reports/eval-factory/flappy-heldout-score.json
pnpm pbos runs:index
pnpm pbos runs:summary
pnpm prove:robust
```

## 11. Claim Boundary

Do not claim SOTA, AGI, ASI, or economic value from this upgrade alone.
The honest claim after the LFD work is:

```text
Playbasis Agent OS implements evidence-gated loss-function navigation:
pre-registered targets, blinded held-out scoring, forced exploration,
safe evidence capture, and replayable run memory.
```

Stronger claims require held-out lift, external or human review, measured
economic value, and named baseline comparisons.
