# Canonical Vision

Last updated: 2026-07-06

Status: canonical product and architecture doctrine for this repo. For current
measured capability and proof status, use `README.md`,
`docs/ROBUST_PROOF_PROTOCOL.md`, `reports/agent-os-sandbox-data.json`,
`reports/run-warehouse/summary.json`, and `reports/model-catalog.json`.
`docs/VISION_NOTES.md` is the raw source-note archive that fed this document,
not a claim boundary.

## Thesis

Playbasis Agent OS is an evidence-gated mission optimizer for governed agent
work.

It should not be trusted because a model sounds smart. It should be trusted
only when meaningful decisions are scored against evidence, bounded by policy,
and reproducible after the fact.

The durable product promise is:

```text
Give Playbasis a goal and a measurable definition of better.

It gives worker agents the right next quests, tracks every attempt, branches
when progress stalls, raises the bar when progress is easy, and promotes only
what actually improves the score under governance.
```

## What This Is Today

Today this repo is a governed agent proof lab, not a finished production Agent
OS.

The believable center is already valuable:

```text
mission JSON
-> registered tools
-> traces and artifacts
-> redaction scan
-> evidence pack
-> evals
-> promotion or revision
-> warehouse and dashboard
```

The evidence, governance, and measurement rails are real. Broad autonomous
intelligence is still mostly scaffolding.

Current defensible claims:

- Replayable mission runs with traces, artifacts, evidence packs, evals, and
  promotion decisions.
- Multi-profile service connectors and gated provider calls with redacted
  metadata only.
- Zero-leak proof discipline across indexed evidence packs.
- Router-lab Phase 0 telemetry for provider/model routing in fixture mode.
- Prompt Twin A/B and Navigator visual-quality proofs as bounded internal
  evidence families, not broad intelligence claims.
- A runnable Navigator shell and proof dashboard fed by generated report data.

Claims not yet licensed:

- Production-grade multi-tenant Agent OS.
- General autonomous intelligence or broad self-improvement.
- External SOTA task success.
- Measured economic value versus human or named framework baselines.
- Independent multi-provider council judgment unless distinct provider
  identities are configured and proven.

The rule is simple: measured proof outranks aspiration.

## Target Category

Do not position Playbasis as another coding harness.

Worker harnesses such as Codex, Claude Code, local scripts, browsers, image
generators, test runners, and future agent frameworks are the workers.
Playbasis is the mission harness above them.

```text
worker harness
  read code -> edit code -> run commands -> produce diff

Playbasis mission harness
  compile objective -> generate approaches -> delegate work -> evaluate
  -> reweight paths -> checkpoint/replay -> promote -> distill learning
```

The differentiated category is evidence-gated autonomous operations: an
outer-loop system that decides which work is good enough to keep.

Short positioning:

```text
Codex writes code.
Claude Code writes code.
Playbasis runs the experiment that decides which code is actually good enough
to keep.
```

## Operating Loop

The canonical loop is Evidence-Gated Adaptive Search:

1. Observe world state: repo, product, customer context, prior runs, current
   scores, risks, budgets, and approvals.
2. Compile the mission: objective, constraints, allowed tools, forbidden
   actions, budgets, metrics, stop conditions, and evidence requirements.
3. Generate a path fan: many meaningfully different approaches, not one brittle
   plan.
4. Select paths by expected value: quality, cost, time, risk, diversity, and
   evidence strength.
5. Delegate clean worker quests: small scoped tasks with allowed actions,
   forbidden actions, success metric, budget, and escalation rule.
6. Collect evidence: runtime probes, tests, visual diffs, held-out evals, web
   observations, user review, hashes, costs, and tool outcomes.
7. Reweight paths: exploit what is working, branch when progress stalls, and
   force exploration when candidates collapse into the same answer.
8. Checkpoint and replay: preserve state so the system can branch, model-swap,
   re-score, or roll back.
9. Promote only with a passport: no artifact graduates without scores, gates,
   evidence links, costs, risk notes, and a rollback path.
10. Distill learning: save winning prompts, failed approaches, tool sequences,
    model-routing lessons, reusable assets, and private eval signals.

## Core Concepts

| Concept | Canonical meaning |
| --- | --- |
| Mission | A measurable job with objective, constraints, gates, budget, and evidence requirements. |
| Objective function | The visible loss/reward definition for "better"; includes quality, time, cost, risk, novelty, reuse, and governance. |
| Quest | A small worker assignment compiled from mission state. Product copy may call this a task or next step. |
| Path fan | A set of meaningfully different action trajectories. Diversity matters; duplicate parameterizations do not count. |
| Reality fraction | How much confidence comes from real observations versus fixtures, simulations, or model-only judgment. |
| Evidence atom | A small scored observation with source, trust level, artifact hash, metric value, and safety status. |
| Promotion passport | The certificate that an artifact or strategy is good enough to keep. |
| Checkpoint | A replayable save point: repo state, artifacts, scores, decisions, costs, and next options. |
| Memory | Reusable lessons, prompts, tools, skills, evals, taste data, and routing statistics. |
| Governance envelope | Policy-as-code for spend, tools, data exposure, approvals, credentials, side effects, and rollback. |

Game language is useful internally because it clarifies state, rewards, pacing,
and progression. Enterprise/product language should translate it:

| Internal metaphor | Product language |
| --- | --- |
| Quest | Mission task or next step |
| XP | Measured improvement |
| Badge | Certification or permission |
| Skill tree | Capability graph |
| Save point | Checkpoint |
| Loot | Reusable artifact |
| Game director | Adaptive mission director |
| Referee | Evaluation council |

## Evidence Doctrine

The project exists to avoid Goodharting itself.

Required principles:

- Training-visible metrics can guide search; they cannot license final claims.
- Held-out scoring, external review, runtime probes, and real-world evidence
  carry more weight than model judgment.
- Answer keys, private Prompt Twin data, private customer evals, private
  screenshots, env values, provider payloads, and raw live evidence stay out of
  public artifacts.
- Pre-register targets, path fans, thresholds, answer-key commitments, and
  success criteria before scoring whenever a result will support a claim.
- Publish negative results. A failed or flat held-out result is evidence, not
  an embarrassment.
- Track reality fraction explicitly; fixture-only improvement has a credibility
  ceiling.
- If visible scores rise while held-out scores stay flat or fall, trigger a
  memorization/Goodhart alarm.

The open-core packaging rule is:

```text
Open-source the ruler. Keep the answer sheets.
```

The public ruler is the evidence-pack format, eval schema, fixture harness,
safe scoring format, and future EGA-Bench spec. The private answer sheets are
Prompt Twin taste ground truth, generated held-out cases, customer evals,
Playbasis connectors, WorkspaceOps integrations, provider routing, env
profiles, and live evidence.

## Product Surface

Navigator is the human-facing mission control surface for this loop.

The user should always be able to answer five questions at a glance:

1. What is Playbasis optimizing?
2. What is it doing now?
3. What evidence has it collected?
4. Is it improving or fooling itself?
5. What needs my approval?

Use grounded product language:

| Avoid as primary copy | Prefer in UX copy |
| --- | --- |
| Autonomous Agent OS | Mission proof lab or mission optimizer |
| Navigator intelligence | Suggested approaches |
| Council | Reviewers |
| Evidence pack | Proof pack |
| Reality fraction | Confidence from real data |
| Held-out lift | Improvement on private test set |
| Promotion passport | Ready to keep |
| Path fan | Approaches to try |

The UI should feel premium and native, but never magical. The visual design
must earn trust by showing evidence, uncertainty, cost, risk, and approval
state plainly.

## Canonical Demos

There are two canonical demos, with different roles.

### Near-Term System Demo

Reference UI images -> production app.

This is the best near-term proof because the repo already has Navigator visual
diagnostics, asset-clone evals, browser/render checks, design tokens, and a
self-build path.

The product version of this demo is the Operator Twin screenshot-to-frontend
lane in `docs/OPERATOR_TWIN_SCREENSHOT_FRONTEND_PRODUCT_REQUEST.md`: a
private screenshot and request should become a hash-only context pack, a
worker dispatch quest, a gated worker-run request or configured worker command,
cycle-level attempt/review closure, frontend code changes, rendered browser
captures, visual/functional/accessibility scores, and a promotion passport.
Current artifacts prove pieces of this lane, not the full replacement of the
user's HITL Codex-driver role.

Success looks like:

- multiple implementation strategies
- desktop and mobile visual scoring
- Playwright flows
- accessibility checks
- performance budget
- typecheck/lint/test gates
- human or private taste review
- evidence pack and promotion passport
- reusable design-system assets and repair strategies

### Business Pilot Demo

Help-center search improvement.

This is the better customer-facing pilot once data access exists because it is
easy to understand economically:

```text
Improve help-center search so customers find the right answers faster.
Increase successful search sessions without increasing support tickets,
under a declared experiment budget, using private search logs and controlled
tests.
```

Evaluator dimensions: search success, time to answer, ticket deflection,
customer confidence, A/B result, and private held-out failed-query set.

The apparent conflict is intentional: reference UI is the fastest proving
ground for the mission loop; help-center search is the stronger buyer story.

## Architecture North Star

The mature system has five persistent state layers:

- World state: repo/product/customer state, tests, screenshots, errors, budget,
  branch, candidate paths, approvals, and known failures.
- Agent state: model/worker used, tool permissions, cost profile, success
  rate, failure modes, certifications, latency, and task-type fit.
- Mission state: objective, constraints, metrics, milestones, difficulty,
  approvals, reward weights, and stop conditions.
- Path state: candidate trajectories, priors/posteriors, evidence, expected
  cost, expected risk, and replay points.
- Memory state: winning prompts, failed prompts, tool sequences, design tokens,
  hidden eval failures, human preferences, and promoted assets.

The worker agent should not see this entire system. It should receive a clean
quest packet:

```text
Task:
  Improve the mobile dashboard layout.

Current evidence:
  Screenshot diff shows card overflow at 390px.

Allowed:
  Edit layout CSS and dashboard components.

Forbidden:
  Do not change copy, auth, billing, or product hierarchy.

Success:
  Mobile screenshot mismatch under threshold; desktop score and tests remain
  safe.

Escalate if:
  The fix requires changing product direction or accepting a major visual
  tradeoff.
```

Complexity belongs in the Playbasis control plane, not in the worker prompt.

## Capability Blueprint

The 100-capability list in `docs/VISION_NOTES.md` is an aspiration map. It
should be implemented in maturity slices, not as a giant platform rewrite.

Canonical capability groups:

1. Core kernel: mission compiler, goal contract, run state machine,
   checkpoint/resume, run identity, causal run graph, deterministic replay,
   live reality profile, and promotion passport.
2. Planning/search: path fans, diversity scoring, milestone envelopes,
   Bayesian reweighting, efficient frontier, Progress Sharpe, forced entropy,
   strategy mutation, and recombination.
3. Model/worker orchestration: model catalog, router, fallback graph,
   reasoning effort, specialist workers, adversarial review, drift monitoring,
   and capability certification.
4. Tool/protocol layer: MCP/tool gateway, tool manifests, tool attestation,
   side-effect classifier, dry run, simulator, structured errors, and approval
   parity.
5. Sandbox/execution: isolated workspaces, command runner, snapshot/restore,
   network policy, secretless runtime, outbound scanners, dependency scanners,
   artifact hash ledger, test harness, and budget governor.
6. Memory/knowledge: context compression, mission memory, skill memory, asset
   ledger, ground-truth vault, freshness scoring, contradiction index, poisoning
   detection, right-to-forget, and reuse-rate metric.
7. Evidence/evaluation: evidence packs, reality fraction, held-out evals,
   pre-registration, split enforcement, generalization gap, memorization alarm,
   evaluator hierarchy, benchmark adapters, and negative-result publishing.
8. Council/adjudication: specialist reviewers, disagreement metric, reviewer
   ELO, minority reports, adjudication court, human escalation, falsifier
   field, override log, payoff-based review, and reputation economy.
9. Security/safety: policy-as-code, zero-trust tools, least-privilege
   credentials, prompt-injection firewall, sensitive-domain classifiers,
   misuse monitoring, supply-chain scanner, containment, audit log, and
   incident response.
10. Enterprise trust: tenant isolation, data residency, compliance mapping,
    risk classification, audit exports, SLA telemetry, billing controls,
    change management, customer proof packs, and autonomy maturity score.

Future model names, tier labels, and provider examples are design hypotheses
until `reports/model-catalog.json` and router-lab proof artifacts show they
exist and are configured.

## Roadmap

The roadmap is claim-led. Do not add random features; add the next piece of
evidence that unlocks a stronger claim.

| Maturity | Claim | Required evidence |
| --- | --- | --- |
| M0 | Governed internal proof lab | Current robust proof, zero-leak evidence, replayable mission runs. |
| M1 | Measured held-out improvement | Training-visible lift plus private held-out lift the optimizer never saw. |
| M2 | Mission-level value | Blind baseline against human and human+assistant arms with cost, time, and quality. |
| M3 | Multi-worker mission optimizer | Path-fan workers, router telemetry, checkpoint/replay, and promoted best-of-many artifacts. |
| M4 | Competitive governed agent framework | Named public benchmark subset against named baselines, plus evidence/safety dimensions. |
| M5 | Production Agent OS | Durable queues, scheduling, retries, tenancy, auth, observability, policy-as-code, billing, and customer audit packs. |

Immediate build priority:

1. Keep README, claim boundaries, and CLI command inventory fresh.
2. Make the Operator Twin screenshot-to-frontend lane produce a real frontend
   code artifact, not only a proof report or launch pack.
3. Make the reference-UI -> production-app mission prove best-of-many search
   with recombination, not just one visual pass.
4. Turn held-out evals, human review, and negative results into first-class
   dashboard panels.
5. Promote reusable design/repair skills only after evidence, not after
   plausibility.
6. Add a docs freshness gate so stale maps do not weaken proof credibility.

## Conflict Resolution Rules

When docs disagree, use this hierarchy:

1. Current code, generated reports, and committed proof artifacts.
2. `docs/ROBUST_PROOF_PROTOCOL.md` and this `docs/VISION.md` claim boundary.
3. `README.md` and `docs/DOCS_INDEX.md` for navigation.
4. Current PRDs and handovers for active implementation detail.
5. `docs/VISION_NOTES.md` and older handovers as raw/reference material.

If a claim sounds stronger than the latest proof artifacts, weaken the claim.
If a future architecture sounds useful but lacks evidence, mark it as a target
capability, not current behavior.
