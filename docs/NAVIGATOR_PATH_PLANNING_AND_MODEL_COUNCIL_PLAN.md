# Navigator: Path-Distribution Planning, Model Councils, and the Ambition Ratchet

Last updated: 2026-07-04
Companion to: `docs/AGENT_OS_POV_HANDOVER.md`, `docs/ROBUST_PROOF_PROTOCOL.md`,
`docs/PROOF_SOTA_RESEARCH_COMMERCIALIZATION_PLAN.md`, and
`docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md`.
Canonical framing: `docs/VISION.md` defines the mission-optimizer doctrine;
this document is the Navigator path-fan and adjudication deep dive.

This plan codifies two things into the next build phase:

1. The **path-distribution insight** from the stock-simulation work at
   `~/simulation_project`: do not forecast one outcome, forecast a
   fan of distinct paths, then let arriving reality re-weight the fan until
   it converges on one. Repurpose that for software planning, goal setting,
   and hill climbing.
2. The **Navigator system**: a control plane that takes an ambitious goal,
   defines what GREAT/SOTA looks like, generates and ranks many candidate
   plan-paths, convenes model councils for decisions, executes autonomously
   for hours, absorbs human feedback without losing momentum, detects drift
   between expectation and reality, and ratchets ambition up while results
   keep following.

The judgment layer for all of this is the **Prompt Twin** (see the verified
corpus at `~/Documents/Codex/2026-05-30/can-you-take-a-transcript-and`):
the user's quality bar, taste, and steering style, applied as a reviewer and
as part of the value function - measured by objective outcomes, not style
fidelity.

## 0. The Core Insight, Stated Precisely

The stock simulator's interesting property: it predicted the price AND the
path. It generated many Monte Carlo paths with distinct shapes; the
prediction was not known up front - it EMERGED as actual historical data
arrived and confirmed one of the forecasted paths.

The transfer: a software plan is also a path - a sequence of intermediate
states with a shape (front-loaded risk, steady grind, late integration
crunch, big-leap-then-polish). Today agents commit to one plan and improvise
when it breaks. Navigator instead:

- generates a FAN of candidate plan-paths for the same goal,
- declares, for each path, the measurable state expected at each step,
- executes the next step of the leading path,
- treats every piece of run evidence as an "actual data point" that
  re-weights the whole fan,
- switches paths when a different path's predictions fit reality better,
- raises the target when reality keeps beating the envelope (the ambition
  ratchet), and
- escalates to a human only when reality falls outside all paths' envelopes.

One honesty note before the machinery: chess engines work because the
evaluation function is cheap and correct. Plan search is only as good as its
value function. That is why the eval stack built this week (held-out gates,
trust gates, runtime probes, Prompt Twin judge) is a prerequisite, not a
nice-to-have. Search without a trustworthy evaluator is noise generation.

Loss Function Design is the next hardening layer. `navigate compile` now
emits a goal artifact that contains not only rubrics and paths, but also the
target loss, constraints, instruments, entropy rules, and blinded eval
commitments that the optimizer is not allowed to inspect. The remaining LFD
build plan is in `docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md`.

## 1. Concept Mapping: Quant Finance -> Software Navigation

This table is the codification of the repurposing. Left column exists in
the audited quant repos; right column is what Navigator builds.

| Quant concept (exists on disk) | Navigator equivalent |
| --- | --- |
| Price path (time series) | Plan-path: ordered milestones, each with a measurable expected state |
| Monte Carlo path ensemble (`modules/simulation.py`) | Plan ensemble: 20-200 candidate paths with distinct shapes and step orders |
| Drift/bias term in paths | Ambition parameter: how aggressive the path's targets are |
| GARCH volatility (`modules/analysis.py`) | Per-milestone uncertainty: how wide the acceptable outcome band is |
| Actual prices arriving over time | Run evidence arriving: gate results, runtime probes, twin verdicts, cost |
| Convergence on one forecasted path | Path re-weighting: likelihood of each path given evidence so far |
| RMSE/MAE ranking of sims vs actual (`ml_tuner.py`) | Drift score: plan-vs-reality error per path, used to rank and prune |
| Conformal prediction intervals (`queue-analytics/forecasting/conformal.py`) | Expectation envelope: drift alarms fire when reality exits the band |
| Efficient frontier (`packages/bie` frontier module) | Plan frontier: expected value vs cost/risk scatter; pick from the frontier |
| ELO ranking (`packages/bie` ELO module) | Path and proposal tournaments: pairwise council judgments -> ELO |
| Hyperopt parameter tuning (`ml_tuner.py`) | Prompt/strategy tuning: mission-optimizer candidates as the parameter space |
| Q-learning stock selection (`good_idea/pick_stocks-new.py`) | Mission selection policy: which goal/step earns compute next |
| Portfolio weights, max-Sharpe (`good_idea`, Boltfolio) | Compute allocation across goals and agents (the labor-market credits) |
| Sharpe ratio | Progress Sharpe: verified progress per unit of cost and risk |
| Walk-forward backtest (the missing piece in the quant repos) | Held-out task families: strategies must transfer, not memorize |
| Curve-shape similarity (`curve_similarity.py`) | Path-shape library: match a new goal to historically successful plan shapes |

The last row is quietly powerful: as the run warehouse accumulates finished
goals, Navigator can match a new goal's early trajectory against past
trajectories and import the shape that worked - compounding memory of HOW
work succeeds, not just what was produced.

## 2. What Navigator Is (One Paragraph)

Navigator is a governed loop that wraps any agent (Claude, Codex, the PoV
kernel) with an augmented decision stack: a Goal Compiler that turns an
ambitious prompt into a SOTA rubric and benchmark ladder; a Path Generator
that produces a fan of distinct plan-paths; a Value Function stack (runtime
probes, held-out gates, trust gates, Prompt Twin judgment, council scores)
that prices every state; a Model Council protocol for decisions worth more
than they cost; a Context Quartermaster that keeps the working context dense
and offloads everything else to the run warehouse; and a HUD that renders
the path fan, the realized trajectory, drift alarms, and the plan frontier.
It runs autonomously for hours under budgets, absorbs human feedback as
high-weight evidence rather than a plan reset, and ratchets ambition up
whenever reality beats the envelope.

## 3. Components

### 3.1 Goal Compiler

Input: an ambitious goal in natural language.
Output: `goal.json` containing:

- `northStar`: the 10x-100x statement, kept as direction, never as a claim.
- `sotaDefinition`: what GREAT looks like, written as measurable properties
  (benchmarks, latencies, pass rates, review scores, adoption events).
- `benchmarkLadder`: ordered rungs from "works" to "clearly SOTA", each with
  an objective check. Mirrors the claim ladder discipline already in
  `PROOF_SOTA_RESEARCH_COMMERCIALIZATION_PLAN.md`.
- `valueFunction`: which evaluators apply, with weights (runtime probes,
  held-out gates, twin judge, cost).
- `budgets`: tokens, dollars, wall-clock, council-call allowance.
- `escalationPolicy`: what reaches a human and when.

The compiler itself is a council task: one model drafts the SOTA
definition, another attacks it ("is this measurable? is this ambitious
enough?"), a third synthesizes. The Prompt Twin reviews the rubric against
the user's taste before it is frozen for the run.

### 3.2 Path Generator

Produces K candidate plan-paths (start with K=20, scale with budget).
Diversity is forced, not hoped for - generation is seeded across:

- shape templates (risk-first, grind, spike-and-stabilize, parallel-tracks,
  research-then-build, build-then-measure),
- ambition levels (safe target, stretch, moonshot),
- resource assumptions (solo agent, swarm, council-heavy),
- and the path-shape library of past successful trajectories (section 1).

Each path is a JSON artifact:

```jsonc
{
  "pathId": "p017-spike-stabilize-stretch",
  "shape": "spike-and-stabilize",
  "ambition": "stretch",
  "milestones": [
    { "id": "m1", "state": "adapter emits outcomes jsonl, 100+ rows", "eta": "2h",
      "envelope": { "metric": "rows", "min": 100, "expected": 400 } },
    { "id": "m2", "state": "A/B arm running, 10 runs complete", "eta": "6h",
      "envelope": { "metric": "runs", "min": 10, "expected": 20 } }
  ],
  "predictedOutcome": { "metric": "held-out pass rate", "value": 0.7, "band": [0.55, 0.85] },
  "estimatedCost": { "tokens": 2000000, "hours": 8 },
  "weight": 0.05
}
```

### 3.3 Value Function Stack (the chess evaluator)

Ordered by trustworthiness; higher layers arbitrate lower ones:

1. Reality: runtime probes, tests, deployed behavior, measured cost.
2. Held-out gates (never optimizer-visible - already wired into the PoV).
3. Trust gates: leaks, budgets, approvals (already on the credibility board).
4. Prompt Twin judgment: the user's quality bar as a scored review with a
   published rubric - validated against objective outcomes per the A/B plan.
5. Council scores: ELO from pairwise model judgments - cheapest, least
   trusted, used for pruning not promotion.

Rule: a path can be EXPLORED on council scores but only ADVANCES the
benchmark ladder on layers 1-3, with layer 4 as the taste gate.

### 3.4 Model Council

Protocol, not vibes:

- Roles: Proposer, Adversary (attacks the proposal), Estimator (predicts
  cost/outcome), Synthesizer (writes the decision), Recorder (evidence pack
  entry). Different models or different prompts of the same model.
- Convening rule (payoff-matrix discipline): convene a council only when
  `expected value of a better decision > council cost`. Route by stakes:
  cheap fast model solo for reversible low-stakes; full council for path
  switches, ambition ratchets, and promotion decisions.
- Ranking: pairwise judgments feed the bie ELO module; frontier module
  picks among ranked options by value-vs-cost.
- Synthesis discipline: the Synthesizer must state what evidence would
  prove the decision wrong - this becomes the drift check for that choice.
- Every council session is an evidence-pack artifact: participants, inputs
  (hashes), votes, dissent, decision, falsifier.

### 3.5 Context Quartermaster

The "always the most valuable, dense, salient context window" requirement,
made mechanical:

- Working context holds: goal.json, the leading path, last drift report,
  active milestone, and the freshest evidence summaries. Nothing else.
- Everything else lives in the run warehouse, retrievable by milestone id,
  path id, decision id, or topic.
- Offload triggers: after every milestone, the Quartermaster compresses the
  transcript into a milestone summary (what was tried, what worked, verdict,
  open threads) and evicts the raw detail.
- Council calls receive PACKETS (curated context slices), never the full
  transcript - this is what lets a swarm scale without context collapse.
- Human feedback enters as a first-class observation artifact with high
  evidence weight - it re-weights the path fan and may update goal.json,
  but it does not reset the loop. Momentum is preserved because the fan,
  not a single plan, is the unit of planning.

### 3.6 The Navigator Loop

```text
COMPILE    goal -> rubric, ladder, value function, budgets
FAN        generate K paths, weight uniformly (or by shape-library prior)
STEP       execute next milestone of the max-weight path
EVIDENCE   collect gate results, probes, twin verdict, cost into the pack
REWEIGHT   score every path's predictions against the new evidence
           (RMSE-style drift per path); renormalize weights; prune the
           bottom decile; occasionally spawn fresh paths (exploration)
CHECK      drift alarm? reality outside ALL envelopes -> council replan,
           possibly human escalation
RATCHET    reality above the leading path's expected band for k consecutive
           milestones -> council considers raising ambition (promote a
           stretch/moonshot path)
DISTILL    milestone summary to warehouse; shape library updated; loop
```

### 3.7 The HUD

Extend the sandbox dashboard (the design system from today's overhaul is
ready for it):

- **Path fan chart**: the K paths as faint lines over milestone-time, the
  realized trajectory as a bold line, envelopes as bands - visually
  identical to the stock simulator's fan of Monte Carlo paths with the
  actual price overlaid. This is the signature visualization.
- **Plan frontier scatter**: expected value vs cost, frontier highlighted,
  current path marked.
- **Drift panel**: per-path drift scores, alarms, last course correction.
- **Council log**: sessions, decisions, dissents, falsifiers.
- **Ambition ratchet history**: every time the target moved and why.

## 4. Where Existing Assets Plug In

| Asset | Role in Navigator |
| --- | --- |
| PoV kernel + evidence packs | Execution substrate; every STEP is a mission run |
| `packages/run-warehouse` (new) | Path fan, decisions, milestone summaries, shape library storage |
| `packages/mission-optimizer` (new) | The tuner for prompt/strategy parameters inside a path |
| Training/held-out eval split (new) | Layers 2 of the value function |
| Prompt Twin corpus + reviewer skill | Layer 4: taste gate and steering feedback |
| Flappy Bird harness + Pygame validator | First objective playground: layer-1 reality checks |
| `packages/bie` ELO + Monte Carlo + frontier | Council ranking, path scoring, plan frontier |
| `queue-analytics/forecasting/conformal.py` | Envelope construction and drift alarms; v1 proof executes the source through a safe probe |
| `simulation_project/modules/*` | Reference implementation of fan-generate/re-weight/converge |
| `good_idea` Q-learning + portfolio scripts | Reference for mission-selection policy and compute allocation |
| Business simulation | Cheap rollout world for path prior estimation (priors only, never promotion evidence) |
| Glimsp swarm / harness swarm mode | Fan-out execution of parallel path probes |
| WorkspaceOps | Eventually: the human-facing surface for escalations and feedback-in-stride |

Sanitization boundary for the quant repos: mine ideas and module structure;
do not import credentialed scripts (one older SQL-learning file has
hardcoded DB fields), do not commit ticker CSVs or generated PNGs, keep all
raw data local. Same rule as the prompt corpus.

## 5. Build Phases

### Phase N1 (days): Paths as artifacts, navigation by hand

- Define `goal.json` and `path.json` schemas (JSON Schema files in repo).
- Build `pbos navigate compile <goal>` (council-drafted rubric, twin-reviewed)
  and `pbos navigate fan <goal>` (K paths via shape-template seeding).
- Run ONE goal through the loop manually: **the Prompt Twin coding-outcomes
  A/B from the previous plan** - chosen because its layer-1 value function
  (Pygame validator) already exists, so Navigator's judgment can be checked
  against ground truth from day one.
- Reweighting math v1: simple normalized inverse drift (RMSE-style) - no
  cleverness until the loop runs.
- Accept when: the goal completes with a full evidence trail; at least one
  path switch or prune happened for a reason the log can defend; the fan +
  realized trajectory render on the dashboard (static version acceptable).

### Phase N2 (weeks): Council + frontier + drift alarms

- Council protocol implemented with 2-3 distinct models; sessions are
  evidence-pack artifacts with falsifiers.
- bie ELO wired to pairwise council judgments; frontier module picks among
  paths; payoff-matrix convening rule enforced with per-decision budgets.
- Envelope/drift alarms ported from the conformal concept; ambition ratchet
  live with council sign-off.
- HUD: interactive fan chart, frontier scatter, drift panel, council log.
- Accept when: on a second goal, Navigator's path choice beats a
  single-plan baseline run of the same goal on the objective metric, at
  comparable cost - measured, not asserted.

### Phase N3 (weeks-months): Long-horizon autonomy

- Multi-hour unattended runs: checkpoint/resume, budget enforcement,
  escalation-only interrupts; human feedback merged in stride (as evidence,
  mid-loop, without restart).
- Shape library: completed trajectories are stored and matched against new
  goals; measure whether shape-prior paths win more often than cold paths.
- First "discovery run": point Navigator at one Tier-1 monorepo goal (e.g.
  the super-prompt runtime split behind a golden master) and let it run a
  full day autonomously.
- Accept when: one 8+ hour unattended run completes a real goal with zero
  ungoverned side effects, produces a defensible decision trail, and the
  post-hoc human review (the actual user) rates the trail "would have
  steered similarly" on a majority of decisions.

## 6. Honesty Rails (Non-Negotiable)

- The value function comes before the search. No path search runs against
  evaluators that have not passed the held-out/trust discipline.
- Simulated rollouts and council opinions are PRIORS. Only layer 1-3
  evidence advances the benchmark ladder or promotes anything.
- "10x-100x better" is direction, not a claim. Public language stays on the
  claim ladder; the ladder's rungs are what get reported.
- Ambition ratchets up only on measured over-performance, and every ratchet
  records its falsifier.
- Councils have budgets; a decision that costs more deliberation than its
  stakes is taken by the cheapest competent model and logged.
- Human feedback always wins ties. The twin approximates the user's
  judgment; it never overrules the actual user.
- All quant-repo reuse respects the sanitization boundary above.

## 7. The First Command

When the next agent picks this up, the first concrete deliverable is:

```bash
pnpm pbos navigate compile "Make twin-steered harness runs measurably beat
the control manager on held-out Flappy Bird variants" \
  --out goals/twin-ab/goal.json
pnpm pbos navigate fan goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:n2 goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:loop goals/twin-ab/goal.json --paths 20
pnpm pbos navigate prove:validator goals/twin-ab/goal.json --paths 20
```

Everything after that is the loop doing its job - and the loop's own first
goal is proving that the loop helps.

## 8. Implementation Status

Phase N1 is implemented in the PoV repo:

- `packages/navigator` defines `NavigatorGoal`, `NavigationPath`,
  `NavigationObservation`, `ReweightReport`, `CouncilSession`, and
  `NavigatorProofReport`.
- `pbos navigate compile` writes a deterministic council-reviewed
  `goal.json` with SOTA properties, benchmark ladder, value stack, budgets,
  escalation policy, Prompt Twin rubric, and falsifier.
- `pbos navigate fan` writes a forced-diversity path fan with shape,
  ambition, resource-mode, per-milestone envelopes, ELO-style council score,
  and efficient-frontier metadata.
- `pbos navigate prove` runs fixture observations through RMSE-style drift
  reweighting, prunes the bottom decile, proves a path switch, emits
  `navigation-proof.json` / `navigation-proof.md`, and renders a static
  path-fan HUD at `reports/navigator/<goalId>/path-fan-hud.html`.
- Schemas live under `schemas/navigator/`.
- Unit coverage lives in `tests/navigator.test.ts`.

Phase N2 now has deterministic fixture mechanics in the PoV repo:

- `buildCouncilTournament` runs a deterministic pairwise tournament over the
  top candidate paths, updates ELO ratings, records every judgment with a
  criterion, margin, rationale, and input hash, and stores a falsifier for
  dominated winners.
- Each pairwise tournament judgment now records deterministic
  Proposer/Adversary/Estimator/Synthesizer seat votes, per-seat margins, and
  a match disagreement rate. The N2 proof records seat summaries and a
  `council-seat-diversity-measured` gate. This fixes the earlier "one scorer
  wearing several hats" issue at the fixture-protocol layer. Live provider
  seats now exist through the separate provider council-session proof;
  independent multi-provider councils remain future work.
- `computeEfficientFrontier` / `selectFrontierPath` select the highest ELO
  path that remains non-dominated on value, cost, and risk.
- `buildConformalEnvelopeReport` calibrates per-metric drift bands from the
  path fan residual distribution, inspired by the queue-analytics conformal
  interval pattern, and reports selected-path alarms plus all-path breach
  status.
- `buildNavigatorContextPacket` writes a compact handoff packet containing
  hashes, active path/milestone state, latest observation IDs, and safety
  boundaries while omitting raw chats, prompts, URLs, env values, request
  payloads, and response payloads.
- `generateNavigationPaths` now uses shape-specific milestone language, so
  plan diversity is visible in the work sequence, not only in numeric
  envelopes.
- `pbos navigate prove:n2` writes `navigation-n2-proof.json`,
  `navigation-n2-proof.md`,
  `reports/navigator/<goalId>/n2-council-frontier-report.json`, and
  `reports/navigator/<goalId>/context-packet.json`.

The first deterministic loop proof is also implemented:

- `buildNavigatorLoopProofReport` executes the fixture observation stream
  milestone by milestone, reweights the path fan after each observation,
  writes a checkpoint at every step, and proves that resume from a mid-loop
  checkpoint reaches the same final path as an uninterrupted run.
- `pbos navigate prove:loop --mission <mission.json>` now dispatches a real
  kernel mission through `MissionRunner`, maps its evidence pack into
  Navigator observations, and appends those observations to the same loop.
  This is the first proof that STEP can cause work and let the loop eat the
  resulting evidence instead of only replaying fixture observations.
- `pbos navigate prove:loop` now writes
  `reports/navigator/<goalId>/path-fan-registration.json` before dispatching
  mission work. The registration hashes the full path fan, path IDs, and
  envelope set so later observations can be checked against a forecast that
  existed before the evidence arrived.
- The loop now emits
  `reports/navigator/<goalId>/path-calibration-report.json`, ranking every
  registered path by coverage and normalized RMSE against observed outcomes.
  This turns the RMSE-vs-actual forecasting analogy into a committed scoring
  surface instead of an implicit reweighting detail.
- The loop now emits
  `reports/navigator/<goalId>/ambition-ratchet-decision.json`. The decision
  compares observations against the active path envelopes, counts trailing
  over-max observations, selects a higher-ambition candidate, and records
  deterministic ratchet-seat votes. The latest proof promotes the selected
  `research-then-build:stretch` path to the `research-then-build:moonshot`
  candidate after 4/2 over-max observations and a 3/4 ratchet vote.
- The loop report now records observation provenance and weight mix, including
  fixture weight fraction, dispatched-run weight fraction, and reality/held-out
  layer fraction.
- The loop includes a high-weight fixture human-feedback observation so
  user steering is merged as evidence in stride without restarting the
  run.
- The proof compares the Navigator-selected path against a static single-plan
  baseline path on `path-fit-score` and records cost comparability. The gate is
  intentionally named `reweighting-selects-best-fitting-path`, not SOTA or
  economic value.
- A shape-memory entry is emitted so the successful
  `research-then-build:stretch:solo-agent` trajectory can become a future
  prior.
- `pbos navigate fan --shape-memory <shape-library-entry.json>` now consumes
  that prior, boosts matching path families, and annotates generated paths
  with the source entry IDs, weight boost, value boost, and risk reduction.
- `pbos navigate prove:loop --shape-memory <shape-library-entry.json>` records
  a `shape-memory-prior-consumed` gate. The latest proof consumes one supplied
  entry, matches one path, keeps the dispatched mission evidence stream, and
  reports path-fit lift against a no-memory static baseline.
- `pbos navigate prove:daily-loop --mission <mission.json> --days 3` now
  dispatches one mission-backed Navigator cycle per simulated day, acquires a
  daily lease, records a next wakeup, writes a daily event row, appends the
  day's shape-memory entry as a prior for the next day, and reports aggregate
  lift and ratchet counts. This is a bounded daily-loop mechanics proof, not
  an always-on production scheduler.
- `pbos navigate prove:loop` writes `navigation-loop-proof.json`,
  `navigation-loop-proof.md`,
  `reports/navigator/<goalId>/loop-checkpoints.jsonl`, and
  `reports/navigator/<goalId>/shape-library-entry.json`.
  Memory-shaped fans can also be written to
  `reports/navigator/<goalId>/path-fan-with-shape-memory.json`.

A first source-grounded validator bridge is implemented:

- `buildNavigatorValidatorProofReport` reads the real broken Pygame seed at
  `../playbasis-platform/seeds/agent-harness/flappy_bird_broken.py`
  through the CLI, stores only a source hash, LOC count, detected constants,
  and rule-check ids, and never stores raw source.
- The bridge detects concrete defects such as inactive gravity, unmoving
  pipes, missing score progression, and missing collision/bounds failure
  checks, then compares a static baseline arm against the Navigator-selected
  arm.
- `pbos navigate prove:validator` also runs a bounded Flappy Flyer smoke
  probe in `../playbasis-platform/games/flappy-flyer` using the
  PoV-bundled `tsx` runner and the real Flappy tsconfig. The command stores
  status, duration, stdout hash, and stderr hash only.
- The same command now generates a repaired Pygame seed artifact from safe
  metadata, executes it headlessly with Python/Pygame, parses only the final
  safe JSON summary, and stores command output hashes rather than raw stdout
  or stderr.
- The validator report converts source-grounded rule evidence into
  calibrated Navigator observations and reuses the checkpointed loop proof.

The first monorepo primitive bridge is also implemented:

- `pbos navigate prove:primitives` directly imports
  `../playbasis-platform/packages/bie/dist/index.js` and executes
  the real `computeEfficientFrontier` and `runEloTournament` exports against
  Navigator path candidates.
- The same command executes the queue-analytics conformal source at
  `~/client_test/pb-healthcare-demo/services/queue-analytics/forecasting/conformal.py`
  through a generated safe probe script. It stores forecast counts,
  confidence levels, coverage, interval values, and stdout/stderr hashes
  only.
- The BIE swarm coordinator, worker, and launcher are source-mapped with
  hashes, LOC, symbols, modes, and non-secret `PB_BIE_*` configuration names.
  Credentialed swarm stages are not executed in this proof.

The first Prompt Twin judgment bridge is implemented:

- `pbos navigate prove:prompt-twin` builds a compact context from the
  Navigator path candidate, validator proof, and monorepo primitive proof,
  then writes a Prompt Twin judgment proof.
- Fixture mode produces deterministic reviewer evidence for repeatable tests.
  Live mode routes through `ProviderBridge.promptTwinJudgment` only when
  `PBOS_ALLOW_PROVIDER_CALLS=1` and `--require-live` are explicitly supplied.
- The proof records input/rubric/evidence hashes, response id, token counts,
  body/output hashes, verdict, score, risks, steering, and falsifier. It does
  not store raw prompts, raw provider responses, endpoints, keys, or env
  values.
- The report has a hard `reality-gates-not-overridden` gate: Prompt Twin taste
  approval fails the proof if validator or primitive gates are not proven.
- The first live provider run is committed as a separate `*-live-*` artifact.
  It proves real model judging and safe metadata capture, but the model
  returned `revise` below the quality threshold, so the live quality approval
  gate correctly remains failed.

The first real Prompt Twin A/B runtime proof is implemented and has now been
upgraded to v2 held-out scoring:

- `pbos navigate prove:prompt-twin-ab` generates two safe Flappy/Pygame
  runtime artifacts from source metadata: a limited control-manager arm that
  preserves no-gravity/no-pipe-motion failure modes, and a Prompt Twin-steered
  repair arm that fixes gravity, pipe motion, scoring, and collision/bounds
  behavior.
- Both arms execute under the same safe JSON command probe. The current proof
  records control runtime score `0.1000`, twin runtime score `1.0000`, runtime
  lift `+0.9000`, rule repair lift `+3`, control exit status `2`, and twin
  exit status `0`.
- This is the first proof where the named Prompt Twin A/B goal is checked by
  real runtime behavior the loop generated, not only by path metadata or a
  judgment bridge. The proof stores artifact hashes, rule ids, command hashes,
  and safe runtime summaries only.
- The v2 proof writes a held-out pre-registration before scoring and then
  scores both generated artifacts against
  `eval-families/flappy/scorer-commitments/heldout-v1.commitment.json`.
  Pre-registered expected lift: `0.1000`; control held-out pass rate:
  `0.1000`; twin held-out pass rate: `1.0000`; observed held-out lift:
  `+0.9000`; result: met the pre-registered bar.
- The Navigator loop now consumes the held-out observation with
  `held-out-scorer` provenance instead of treating runtime lift as a
  held-out proxy. The report still includes runtime lift, but improvement
  language should use the scorer-only held-out lift.

The first provider council-seat bridge is implemented:

- `pbos navigate prove:council-provider` selects a contested N2 council match
  when available, otherwise falls back to a selected-vs-baseline pair, and
  asks one ProviderBridge council seat to judge the two path candidates.
- Fixture mode and non-enabled live profiles skip provider calls safely while
  still writing hashes, chosen path ids, skipped status, and a falsifier.
  `--require-live` fails unless a configured provider returns parsed live
  judgment metadata.
- The proof records input/rubric/evidence hashes, response id, token counts,
  body/output hashes, chosen winner path, confidence, risks, and falsifier.
  It does not store raw prompts, raw provider responses, endpoints, keys,
  request bodies, response bodies, or env values.
- This closes only the first provider-seat protocol gap. It is not yet live
  multi-model council diversity because the current proof exercises one
  bounded provider seat, not multiple independent live model seats.

The first provider council-session bridge is implemented:

- `pbos navigate prove:council-session` runs the same contested path pair
  through all four ProviderBridge council seats: Proposer, Adversary,
  Estimator, and Synthesizer.
- Fixture mode writes four gated seat records with no network calls. Live
  mode still requires `PBOS_ALLOW_PROVIDER_CALLS=1`, and `--require-live`
  fails unless all four seats return live provider metadata.
- The command now accepts `--observations <json>`, so the contested N2
  decision can be grounded in web-sourced, mission, runtime, or provider
  observations instead of fixture-only state.
- The session proof records live/gated/failed/parsed seat counts, winner
  tally, aggregate disagreement, average confidence, token counts, hashes,
  decision context, observation mix, and falsifiers. It does not store raw
  prompts, raw provider responses, endpoints, keys, request bodies, response
  bodies, or env values.
- ProviderBridge now prefers per-seat council deployment keys when they are
  configured, so future live runs can route Proposer, Adversary, Estimator,
  and Synthesizer through different deployments. The proof stores only hashed
  provider identity metadata and a distinct-identity count; it does not store
  raw env key names or deployment values.
- The latest live proof ran all four provider seats against top-contested
  match `judge-009` with two web-sourced observations, `liveSeatCount=4`,
  `fixtureWeightFraction=0.0000`, deterministic prior disagreement `0.5000`,
  and measured live provider-seat disagreement `0.0000`. This upgrades the
  protocol from one provider seat to a full four-seat live provider session.
  It is still not a true independent multi-provider council unless future
  profile config assigns genuinely independent providers or deployments per
  seat.

The first guarded original-source repair proof is implemented:

- `pbos navigate prove:source-repair` refuses to mutate the original Flappy
  seed unless `--apply` is provided.
- The default package script also uses `--restore-after-proof`, so the command
  directly replaces
  `playbasis-platform/seeds/agent-harness/flappy_bird_broken.py`, executes the
  original path under the safe Pygame runtime probe, records the observed
  repaired hash, and then restores the exact pre-run source bytes.
- The proof records pre-source, repaired-source, mutation-observed, and final
  source hashes; fixed rule ids; unresolved blocking rule ids; command output
  hashes; restore policy; and safe runtime metrics. It does not store raw
  source or raw command output.
- The command refuses to run when the target source file is already dirty
  unless a future operator explicitly opts into an override.

Current proof artifacts:

- `goals/twin-ab/goal.json`
- `goals/twin-ab/path-fan.json`
- `goals/twin-ab/navigation-proof.json`
- `goals/twin-ab/navigation-proof.md`
- `goals/twin-ab/navigation-n2-proof.json`
- `goals/twin-ab/navigation-n2-proof.md`
- `goals/twin-ab/navigation-loop-proof.json`
- `goals/twin-ab/navigation-loop-proof.md`
- `goals/twin-ab/navigation-validator-proof.json`
- `goals/twin-ab/navigation-validator-proof.md`
- `goals/twin-ab/navigation-source-repair-proof.json`
- `goals/twin-ab/navigation-source-repair-proof.md`
- `reports/navigator/<goalId>/path-fan-hud-data.json`
- `reports/navigator/<goalId>/path-fan-hud.html`
- `reports/navigator/<goalId>/path-fan-with-shape-memory.json`
- `reports/navigator/<goalId>/n2-council-frontier-report.json`
- `reports/navigator/<goalId>/context-packet.json`
- `reports/navigator/<goalId>/loop-checkpoints.jsonl`
- `reports/navigator/<goalId>/mission-evidence-observations.json`
- `reports/navigator/<goalId>/path-fan-registration.json`
- `reports/navigator/<goalId>/path-calibration-report.json`
- `reports/navigator/<goalId>/ambition-ratchet-decision.json`
- `goals/twin-ab/navigation-daily-loop-proof.json`
- `goals/twin-ab/navigation-daily-loop-proof.md`
- `reports/navigator/<goalId>/daily-loop-proof.json`
- `reports/navigator/<goalId>/daily-loop-proof.md`
- `reports/navigator/<goalId>/daily-loop-events.jsonl`
- `reports/navigator/<goalId>/shape-library-entry.json`
- `reports/navigator/<goalId>/flappy-validator-evidence.json`
- `reports/navigator/<goalId>/flappy-pygame-repair-evidence.json`
- `reports/navigator/<goalId>/flappy-pygame-repair-manifest.json`
- `reports/navigator/<goalId>/flappy-pygame-repaired-seed.py`
- `reports/navigator/<goalId>/flappy-source-mutation-proof.json`
- `reports/navigator/<goalId>/flappy-source-mutation-proof.md`
- `reports/navigator/<goalId>/validator-observations.json`
- `goals/twin-ab/navigation-monorepo-primitives-proof.json`
- `goals/twin-ab/navigation-monorepo-primitives-proof.md`
- `reports/navigator/<goalId>/monorepo-primitive-proof.json`
- `reports/navigator/<goalId>/monorepo-primitive-sources.json`
- `reports/navigator/<goalId>/navigator-conformal-probe.py`
- `goals/twin-ab/navigation-prompt-twin-proof.json`
- `goals/twin-ab/navigation-prompt-twin-proof.md`
- `goals/twin-ab/navigation-prompt-twin-live-proof.json`
- `goals/twin-ab/navigation-prompt-twin-live-proof.md`
- `goals/twin-ab/navigation-prompt-twin-ab-proof.json`
- `goals/twin-ab/navigation-prompt-twin-ab-proof.md`
- `reports/navigator/<goalId>/prompt-twin-context.json`
- `reports/navigator/<goalId>/prompt-twin-judgment-evidence.json`
- `reports/navigator/<goalId>/prompt-twin-live-context.json`
- `reports/navigator/<goalId>/prompt-twin-live-judgment-evidence.json`
- `reports/navigator/<goalId>/prompt-twin-live-observation.json`
- `reports/navigator/<goalId>/prompt-twin-observation.json`
- `reports/navigator/<goalId>/flappy-prompt-twin-ab-proof.json`
- `reports/navigator/<goalId>/flappy-prompt-twin-ab-proof.md`
- `reports/navigator/<goalId>/flappy-prompt-twin-ab-heldout-preregistration.json`
- `reports/navigator/<goalId>/flappy-prompt-twin-ab-heldout-result.json`
- `reports/navigator/<goalId>/flappy-control-manager-heldout-score.json`
- `reports/navigator/<goalId>/flappy-prompt-twin-heldout-score.json`
- `reports/navigator/<goalId>/flappy-prompt-twin-ab-observations.json`
- `reports/navigator/<goalId>/flappy-control-manager-arm.py`
- `reports/navigator/<goalId>/flappy-prompt-twin-arm.py`
- `goals/twin-ab/navigation-provider-council-proof.json`
- `goals/twin-ab/navigation-provider-council-proof.md`
- `reports/navigator/<goalId>/provider-council-seat-context.json`
- `reports/navigator/<goalId>/provider-council-seat-judgment-evidence.json`
- `reports/navigator/<goalId>/provider-council-seat-observation.json`
- `goals/twin-ab/navigation-provider-council-session-proof.json`
- `goals/twin-ab/navigation-provider-council-session-proof.md`
- `reports/navigator/<goalId>/provider-council-session-context.json`
- `reports/navigator/<goalId>/provider-council-session-judgment-evidence.json`
- `reports/navigator/<goalId>/provider-council-session-observation.json`
- `goals/twin-ab/navigation-provider-council-session-live-proof.json`
- `goals/twin-ab/navigation-provider-council-session-live-proof.md`
- `reports/navigator/<goalId>/provider-council-session-live-context.json`
- `reports/navigator/<goalId>/provider-council-session-live-judgment-evidence.json`
- `reports/navigator/<goalId>/provider-council-session-live-observation.json`

Still not implemented: live independent multi-provider councils, live Prompt
Twin approval above the quality
threshold, the full credentialed BIE swarm pipeline, true multi-hour
autonomous execution, persistent daily-loop scheduling, and committing a
persistent repair back to the platform repo. Those are N3/LFD items; the
current proofs now cover deterministic
checkpoint/resume, human feedback-in-stride, baseline comparison,
pre-observation fan registration, forecast calibration scoring,
deterministic multi-seat council voting with disagreement metrics,
explicit ambition-ratchet decisions with promoted moonshot candidates,
bounded daily-loop execution with leases, wakeups, mission evidence, and
shape-memory compounding,
shape-memory write/read mechanics, source-grounded Flappy validator evidence, a passing
bounded smoke probe against the real Flappy Flyer package, a generated
repaired Pygame artifact that executes headlessly for 300 frames with safe
runtime metrics, direct BIE frontier/ELO import execution, conformal source
execution, safe swarm harness provenance, fixture Prompt Twin approval, live
Prompt Twin provider judging with an honest `revise` result, a real
Prompt Twin A/B runtime proof with `+0.9000` measured runtime lift and a
pre-registered held-out scorer proof with control `0.1000`, twin `1.0000`,
and observed held-out lift `+0.9000`, live four-seat
provider council judgment on one web-grounded top-contested Navigator
decision, and guarded
direct mutation of the original Flappy seed with post-proof restore. The loop
now also consumes observations from a dispatched WorkspaceOps launch-pack
mission and a bounded three-day daily-loop proof, but this is still not
always-on production autonomy.
