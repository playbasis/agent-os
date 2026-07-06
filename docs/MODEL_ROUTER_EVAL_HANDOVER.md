# Handover: Model Router & Multi-Model Eval Harness ("router-lab")

Date: 2026-07-05
Audience: any engineer or coding agent picking up this work cold.
Companion spec: `docs/MODEL_ROUTER_EVAL_PRD.md` (read it after this note — this note gives you orientation, the PRD gives you requirements).
Canonical framing: `docs/VISION.md` defines the router as part of the
mission-optimizer control plane, not as a standalone model leaderboard.

---

## 1. What this project is (60-second version)

This repo (`playbasis-agent-os-pov`) is the **Playbasis Agent OS PoV**: a portable, evidence-gated agent kernel. Its thesis: an agent should not be trusted because it sounds smart — it should be trusted because every decision is scored against evidence, bounded by governance, and reproducible after the fact. It sits alongside two other systems it is NOT:

- **Playbasis platform** (separate repo `playbasis-platform`): gamification/economy APIs — events, points, quests, rulesets, adjudications, experiments, credits, feedback. The PoV uses these as governance/measurement substrate.
- **WorkspaceOps**: the commercial product runtime. The PoV clean-room ports "donor" primitives from it (never raw-copies into OSS paths; see `raw-donors/` and the donor registry/verification tooling).

The PoV already ships evidence-gated eval families: mission runs (`pbos run`), navigator path-fan proofs (`pbos navigate prove*`), a CEO business-simulator benchmark (`pbos ceo-sim run|eval|prove`), a value-measurement experiment (`pbos value run`), an audit scorecard, and a verified OSS export (`pbos export-oss-candidate --verify`).

## 2. The task you are picking up

Build **router-lab**: a new eval family that runs the same mission/goal through the harness under different model configurations and measures quality, cost, tokens, and latency per stage — to answer, with evidence:

> Is GPT-5.5 xhigh everywhere worth its cost, or does a tiered/multi-provider router (GPT-5.5 light/medium/high/xhigh, GPT-5.6, Gemini Flash 3.1) beat it on cost per accepted outcome?

The deliverable is NOT a production router. It is a benchmark harness + telemetry + a proven routing policy artifact, held to the same proof discipline as `ceo-sim`: pre-registration, held-out isolation, replay stability, honest negative results.

## 3. Why it is designed this way (decisions already made)

1. **No full permutation sweep.** 9 stages × ~6 models is millions of configs. Design: preset sweep → per-stage ablation (swap ONE stage at a time against a fixed base config) → compose `router-v1` from marginal-lift data → held-out validation. Do not "improve" this back into a cross-product.
2. **Instrument `ProviderBridge`, nothing else.** All provider calls already flow through `ProviderBridge` in `packages/service-connectors/src/index.ts` (~line 1977), configured via env-vault deployment keys and gated by `PBOS_ALLOW_PROVIDER_CALLS`. One choke point = one telemetry site = one model-selection site.
3. **The router generalizes the existing council.** `packages/navigator` already runs a multi-seat provider council (Proposer, Adversary, Estimator, Synthesizer) with disagreement tracking and session evidence. Routing = "which model sits in which seat" extended to every harness stage. Reuse those evidence types; don't invent parallel ones.
4. **Judge must differ from executor.** If the S6 evaluator shares a model family with the S4 executor, scores inflate (self-grading bias). Enforce cross-family judging or report both conditions. Council disagreement tracking is the detector.
5. **Model names are catalog data, not code.** GPT-5.5 tiers, GPT-5.6, Gemini Flash 3.1 come from private inventory docs in `playbasis-platform` (`AZURE_RESOURCE_INVENTORY.md`, `docs/runbooks/codex-azure-openai-team-capacity.md`). Never hardcode pricing or quotas. The July 5 inventory refresh is now present and the generated catalog has zero GPT-5.6 entries, so wave 1 freezes on the observed catalog unless a later sync proves otherwise.
6. **Pre-registered success criterion:** `router-v1` reaches ≥95% of `all-xhigh` held-out quality at ≤60% of its cost, or strictly Pareto-dominates it. If neither: the honest finding is "buy xhigh," and that report still ships.

## 4. Repo orientation

```
packages/
  cli/                 pbos entrypoint (src/index.ts, ~5.2k lines) + super-plan.ts (audit/value/ceo-sim/oss builders)
  service-connectors/  ProviderBridge — ALL provider calls; env-vault config; provider:smoke
  navigator/           path fan, provider council, proof reports (~8k lines)
  kernel/              mission compile/execute
  evals/               eval gates, scoring
  run-warehouse/       run/trace/artifact storage
  hill-climber/, mission-optimizer/   learning loops
  env-vault/           secret/env loading
schemas/               JSON schemas for artifacts
reports/               generated proof artifacts (ceo-sim-proof.json, playbasis-api-leverage*.json, ...)
examples/workspaceops-launch-pack/mission.json   canonical fixture mission
goals/                 navigator goal specs
tests/                 vitest suites (incl. super-plan.test.ts)
raw-donors/            reference-only donor code — never import into OSS packages
docs/                  SCREAMING_SNAKE topic docs; PRD lives here
```

Conventions: commands are `pbos <family> <verb>` (see `ceo-sim` handling at `packages/cli/src/index.ts:203` and its usage string near the bottom); reports write to `reports/` via the same pattern as `ceo-sim-run.json` (cli/index.ts ~line 669); every family publishes a `playbasis-api-leverage-<family>.json`; profiles are `fixture` (deterministic, no live calls), `local-monorepo`, `staging-sandbox` (live calls require `PBOS_ALLOW_PROVIDER_CALLS=1`).

Gates that must stay green: `pnpm test`, `pnpm donor:verify`, `pnpm prove:robust`, `pnpm pbos export-oss-candidate --verify` (and `pnpm typecheck` if defined).

Router-lab seed implementation now exists:

- `packages/router-lab` exports stage IDs, catalog parsing, model selection, provider usage normalization, explicit pricing-overlay cost math, and hash-only telemetry helpers.
- `schemas/router/model-catalog.schema.json` and `schemas/router/telemetry.schema.json` define the current artifact shapes.
- `pbos router catalog --sync ../playbasis-platform/AZURE_RESOURCE_INVENTORY.md` writes `reports/model-catalog.json`. Current catalog: 13 unique entries, 7 text-capable, 6 image-generation, 0 GPT-5.6.
- `ProviderBridge` accepts optional router context and emits telemetry for smoke, prompt-twin judgment, council judgment, image creation, and research-brief paths. Deployment values and response ids are hashed only.
- Router Phase 0 robustness is implemented: `pbos router run examples/router-phase0/mission.json --profile fixture --config fixture-echo` enforces strict router context, expects 2 provider bridge calls, and fails unless telemetry has exactly 2 hash-only records.
- `packages/router-lab` and `tests/router-lab.test.ts` are included in the clean OSS export set; `packages/service-connectors` remains excluded by existing policy.
- Verification performed: full Vitest suite, TypeScript typecheck, frozen donor verification, catalog sync from July 5 inventory, clean OSS export verification, and robust proof for fixture/local-monorepo all pass in this checkout.

## 5. Current state / warnings

- Branch: `codex/navigator-rendered-pixel-loop`; last committed HEAD `0526c2f feat: descend navigator rendered pixel loop`.
- **The working tree contains uncommitted V2 hardening changes plus recent super-plan work. Do not revert, stash, or clean anything you did not write.** Additive changes only; if you must touch a modified file, diff first.
- This checkout is a **git worktree** whose parent gitdir (`../playbasis-agent-os-donor-copy/.git`) may not be accessible from a sandboxed environment — `git` commands can fail with "not a git repository." Work file-based if so; do not "fix" the worktree pointer.
- Files added by this router pass include `docs/MODEL_ROUTER_EVAL_PRD.md`, this note, `docs/MODEL_ROUTER_DONOR_SCAN.md`, `packages/router-lab`, `schemas/router/*`, `tests/router-lab.test.ts`, and `reports/model-catalog.json`.
- External blockers: Gemini Flash 3.1 has no governed `ProviderBridge` route yet (needs adapter + governance review before live use; fixture/echo arm is not blocked). GPT-5.6 is absent from the July 5 catalog.

## 6. Written plan

### Phase 0 — Instrumentation (do this first; everything depends on it)

1. Define `schemas/model-catalog.schema.json` and the telemetry envelope schema (fields in PRD §4.4, camelCase like existing reports).
2. Add a `stage` field to `ProviderBridge` call options (explicit, threaded from call sites — do not infer from caller). Stages S1–S9 per PRD §4.2.
3. Emit one telemetry record per provider call to run-warehouse JSONL (`router-telemetry.jsonl`), including token counts from provider responses, latency, outcome, deployment used.
4. Add a `fixture/echo` catalog model: deterministic canned responses, zero cost — proves the pipeline with bitwise-replayable runs.
5. Add `pbos router catalog --sync <path-to-inventory>`: parses the external inventory doc into `reports/model-catalog.json`; pricing/quota loaded from a private overlay via env-vault (proposal: `profiles/private/pricing.json`), excluded by the OSS export scanner.
6. **Gate:** one fixture mission run produces complete telemetry — assert provider-call count == record count in a new vitest suite.

Current Phase 0 status: items 1, 4, and 5 are seeded; item 2 is threaded through the current router-covered ProviderBridge paths; item 3 writes per-call telemetry for those paths. The fixture mission telemetry completeness gate now passes for `provider.research.brief` plus `workspaceops.image_create`.

### Phase 1 — Preset sweep

1. Add model-config JSON format + presets in `goals/router/configs/`: `all-xhigh`, `all-light`, `tiered-v1`, provider variants (PRD §4.2).
2. Implement `pbos router run <mission.json> --config <name> --profile <p> --seeds N` — wraps the existing mission runner with a config-scoped `ProviderBridge` model selection.
3. Roll up telemetry into `reports/router-run.json`; publish `playbasis-api-leverage-router.json` (Events for calls, Experiments for arms, Credits for budget caps) following the `ceo-sim` publication pattern.
4. Run presets on `examples/workspaceops-launch-pack/mission.json` + the ceo-sim 14-day fixture, ≥10 seeds; produce first Pareto data in `pbos router report`.
5. **Gates:** replay stability unchanged for fixture arms; cost accounting reconciles with provider billing within 5% (staging arms only).

### Phase 2 — Per-stage ablation

1. Implement `pbos router ablate --base tiered-v1 --stage <S#> --models all --seeds N`.
2. Output `reports/router-ablation.json`: marginal Δquality/Δcost matrix (stage × model).
3. Enforce cross-family judging for S6, or run both conditions and report the gap.
4. **Gate:** ≥3 stages show statistically distinguishable sensitivity — if not, write that up honestly; it means routing doesn't pay here.

### Phase 3 — Router policy + held-out proof

1. Compose `router-v1` from ablation data (greedy per-stage pick under the pre-registered criterion; keep it simple before reaching for bandits).
2. Pre-register the criterion (hash-committed, like `eval-factory` held-out commitments) BEFORE running held-out.
3. `pbos router prove --heldout <path outside repo> --config router-v1 --profile staging-sandbox` — held-out scenarios and keys must never be visible to the composition step.
4. Ship `reports/router-proof.json` + `ROUTER_REPORT_001` with wins/losses/ties, including where cheap models fail (expect: S4 tool-call malformation).

### Tests to add throughout (in `tests/`)

Telemetry completeness; catalog uniqueness (every inventory model exactly once); held-out isolation; OSS export excludes pricing overlay, deployment env values, held-out bodies; `router report` refuses to run without pre-registration; live-arm stability measured as score variance across seeds (bitwise replay only asserted for fixture arms).

## 7. Definition of done (first wave)

- All existing gates green; new router tests green.
- Fixture-arm telemetry complete and bitwise-replayable.
- Preset sweep + ablation matrix + held-out proof artifacts exist in `reports/`.
- One honest report answering the xhigh-vs-tiered question with a pre-registered criterion — whichever way it comes out.
- No model IDs/pricing hardcoded; no secrets, pricing overlay, or held-out bodies in the OSS export.

## 8. Pitfalls (learned the hard way elsewhere in this repo)

- Don't claim "cheaper and as good" from training scenarios — held-out only.
- Don't let the optimizer see anything eval-shaped (see the Flappy memorization finding in the eval-factory work).
- Don't import from `raw-donors/` into `packages/` — donor code is reference-only; `pnpm donor:verify` will catch you.
- Don't add marketing language to artifacts. Reports state measurements. The claim ladder (no AGI/ASI/SOTA wording) applies to router-lab output too.
