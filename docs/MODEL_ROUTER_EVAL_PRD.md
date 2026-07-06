# PRD: PBOS Model Router & Multi-Model Eval Harness ("router-lab")

Status: Draft v0.3 - 2026-07-05 (repo-fitted, Phase 0 seeded)
Owner: Bolt
Branch context: `codex/navigator-rendered-pixel-loop`
External inputs (live in `playbasis-platform`, NOT this repo): `AZURE_RESOURCE_INVENTORY.md`, `docs/runbooks/codex-azure-openai-team-capacity.md`. The July 5 inventory refresh is present; generated router catalog currently shows no GPT-5.6 entries.
Canonical framing: `docs/VISION.md` treats future model names and tier labels
as hypotheses until the router catalog and telemetry prove availability and
utility.

---

## 1. Problem

Every mission, navigator proof, and CEO-sim run makes provider calls through `ProviderBridge` (`packages/service-connectors`) with a single implicit deployment choice per capability (env keys like `PB_AZURE_OPENAI_*_DEPLOYMENT`). We do not know:

- Whether GPT-5.5 xhigh everywhere is worth its cost vs. tiered light/medium/high routing.
- Which harness stages need frontier reasoning vs. a cheap fast model (e.g., Gemini Flash 3.1).
- What each stage costs in tokens, latency, and dollars per accepted outcome.
- Whether a multi-provider router beats any single-model configuration on governance-adjusted utility.

Without per-stage telemetry and a controlled eval matrix, model selection is vibes. The PoV's thesis is "evidence-gated, not vibes" — model routing must meet the same standard.

## 2. Goals

1. Run the same mission/goal through the harness under different model configurations and measure quality, cost, tokens, latency, and failure modes per stage.
2. Produce a cost/benefit Pareto frontier: quality vs. cost per accepted outcome, per configuration.
3. Derive a data-backed routing policy (stage → model/effort/provider) and prove it beats both all-xhigh and all-cheap baselines on held-out scenarios.
4. Make telemetry a first-class evidence artifact, consistent with existing proof/eval schemas in `schemas/` and `reports/`.
5. Keep it OSS-safe: public harness + fixture configs; private deployment env keys, pricing overlay, and held-out sets (consistent with `export-oss-candidate --verify` scanning).

### Non-goals

- A general-purpose LLM gateway product.
- Live routing in WorkspaceOps production (later phase; this is the eval lab).
- Fine-tuning or training models.
- Any SOTA/AGI claim. Output is a benchmark report, not marketing.

## 3. What this builds on (existing repo assets)

- **`ProviderBridge`** (`packages/service-connectors`): the single choke point for Azure OpenAI chat/image calls, env-vault-configured deployments, `PBOS_ALLOW_PROVIDER_CALLS` live-call gate, `provider:smoke` readiness checks. Telemetry and per-stage model selection hook here — no new call path.
- **Provider council** (`packages/navigator`): multi-seat judging (Proposer, Adversary, Estimator, Synthesizer) with disagreement tracking and session evidence. The router generalizes "which model sits in which seat" from council judging to every harness stage.
- **Deterministic fixture profile** + `local-monorepo` + `staging-sandbox` profiles: same input, replayable, so model config is the only variable.
- **Run warehouse** (`packages/run-warehouse`) and `reports/` conventions for artifacts.
- **Super-plan eval families** (`packages/cli/src/super-plan.ts`): `ceo-sim`, `value run`, `audit scorecard` — router-lab becomes a sibling family with the same proof discipline (pre-registration, held-out isolation, replay stability).
- **Playbasis API leverage recording**: telemetry records double as Events; config arms register as Experiments; budget caps enforce via Credits — extending `playbasis-api-leverage.json` reporting.

Current Phase 0 seed implementation:

- `@playbasis-agent-os/router-lab` (`packages/router-lab`) provides the pure stage catalog, catalog sync, model selection, usage normalization, cost estimation, and hash-only telemetry primitives.
- `schemas/router/model-catalog.schema.json` and `schemas/router/telemetry.schema.json` define the public artifact envelope.
- `pbos router catalog --sync <inventory-path>` writes `reports/model-catalog.json` from the external inventory.
- `ProviderBridge` accepts optional explicit router context and can emit per-call telemetry without exposing raw deployment values or provider response ids.
- `pbos router run examples/router-phase0/mission.json --profile fixture --config fixture-echo` now proves the Phase 0 fixture telemetry gate: exactly 2 router-eligible provider calls, exactly 2 hash-only telemetry records, and strict failure when router context is missing.

## 4. Core concepts

### 4.1 Model Catalog

A versioned registry generated from the external inventory docs, stored at `schemas/router/model-catalog.schema.json` + `reports/model-catalog.json`. Each entry:

```json
{
  "id": "azure/gpt-5.5-xhigh",
  "provider": "azure-openai",
  "family": "gpt-5.5",
  "effort": "xhigh",
  "deploymentEnvKey": "PB_AZURE_OPENAI_GPT55_XHIGH_DEPLOYMENT",
  "contextWindow": null,
  "priceInPerMtok": null,
  "priceOutPerMtok": null,
  "capabilities": ["tools", "structured-output", "long-context"],
  "quotaTpm": null,
  "inventorySource": "playbasis-platform/AZURE_RESOURCE_INVENTORY.md@<hash>",
  "verifiedAt": "2026-07-05"
}
```

Pricing/quota values load from a private overlay (proposal: env-vault-managed `profiles/private/pricing.json`), never hardcoded, excluded by the OSS export scanner. Current generated catalog from the July 5 inventory contains 13 unique entries: `fixture/echo`, 7 text-capable entries, 6 image-generation entries, and zero GPT-5.6 entries. Wave 1 should freeze on the observed GPT-5.5/current catalog plus fixture arms unless a later inventory proves GPT-5.6 availability. Gemini Flash 3.1 still needs a governed `ProviderBridge` route + governance review before live use.

### 4.2 Stage Map (router decision points)

Each harness stage is a routing decision point mapped to actual packages:

| # | Stage | Repo home | Action space (high level) | Capability need |
|---|-------|-----------|---------------------------|-----------------|
| S1 | Intake / mission compile | `kernel`, mission JSON | parse goal, draft contract, detect missing instruments, pre-register | reasoning: medium |
| S2 | Objective & governance config | `kernel`, profiles | weight objective, emit policy, flag gameability | reasoning: high |
| S3 | Planning / path-fan generation | `navigator` | generate candidate paths, estimate cost/risk, prune, diversify | reasoning: highest |
| S4 | Execution / tool loop | `kernel`, `service-connectors` | tool calls, sandbox runs, sim ticks, delegation, spend | tool-use reliability |
| S5 | Evidence capture | `run-warehouse` | trace/span emission, artifact hashing, API-leverage records | cheap/structured |
| S6 | Evaluation / council | `evals`, `navigator` council | deterministic checks, held-out scoring, judge seats, disagreement | judge quality; must differ from S4 model family (self-grading bias) |
| S7 | Governance | approval gates | approval requests, gate decisions, rejection rationale, rollback | precision > creativity |
| S8 | Promotion & reporting | `reports/`, dashboards | passports, proof JSON, human-readable summary | cheap/structured |
| S9 | Learning distillation | `hill-climber`, `mission-optimizer` | lesson extraction, memory writes, policy mutation | reasoning: high |

A **Model Config** is a mapping `{stage → catalog_id}` plus global defaults, stored as JSON in `goals/router/configs/`. Named presets:

- `all-xhigh` — GPT-5.5 xhigh everywhere (cost ceiling baseline)
- `all-light` — cheapest everywhere (cost floor baseline)
- `tiered-v1` — hypothesis: xhigh at S3/S6, medium at S1/S2/S9, flash at S4/S5/S7/S8
- `single-provider-*` / `multi-provider-*` variants
- `router-v1` — learned policy output of Phase 3

### 4.3 Run Matrix

`run = mission × seed × model_config`. Full per-stage cross-product explodes (9 stages × 6 models ≈ 10M configs), so we explicitly do NOT enumerate all permutations:

1. **Preset sweep**: ~6–10 named configs × N seeds. Establishes the envelope.
2. **Per-stage ablation**: hold `tiered-v1` fixed, swap one stage at a time through the catalog (stages × models × seeds — tractable; isolates marginal value of model strength per stage).
3. **Router search**: greedy/bandit selection over ablation results composes `router-v1`.
4. **Held-out validation**: `router-v1` vs. `all-xhigh` vs. `all-light` on unseen scenarios, ≥50 seeds.

### 4.4 Telemetry Envelope

Every `ProviderBridge` call emits one record (JSONL to run warehouse):

```json
{
  "runId": "…", "mission": "…", "seed": 17,
  "stage": "S3", "step": 4, "attempt": 1,
  "model": "azure/gpt-5.5-xhigh", "deployment": "…",
  "tokensIn": 0, "tokensOut": 0, "tokensReasoning": 0, "cachedTokens": 0,
  "latencyMs": 0, "costUsd": 0.0,
  "outcome": "accepted|retried|rejected|error",
  "qualitySignals": { "gatePassed": true, "judgeScore": null },
  "traceId": "…", "hash": "…"
}
```

Records double as Playbasis Events; budget caps enforce via Credits; config arms register as Experiments — all recorded in `playbasis-api-leverage.json` as with existing families.

## 5. Metrics

Primary (per config):

- **Governance-adjusted utility** (reuse existing mission/CEO-sim scoring) — quality axis.
- **Cost per accepted outcome** (USD and tokens) — cost axis.
- **Pareto rank** on (quality, cost).

Secondary: end-to-end latency and wall-clock per mission; retry/error rate per stage per model; tool-call malformation rate (S4) — the key router signal for cheap models; council/judge agreement rate when S6 model varies (self-grading bias check); replay stability across seeds (must not degrade current gates); marginal lift per stage (Δquality, Δcost when upgrading only that stage).

Router success criterion (pre-registered): `router-v1` achieves ≥95% of `all-xhigh` held-out quality at ≤60% of its cost, or strictly Pareto-dominates it. If neither holds, the honest finding is "buy xhigh" — an acceptable result.

## 6. CLI surface

Follows the `pbos <family> <verb>` convention used by `ceo-sim` and `mechanics`:

```
pbos router catalog --sync <inventory-path>          # regenerate catalog from external inventory
pbos router run <mission.json> --config tiered-v1 --profile fixture --seeds 10
pbos router ablate <mission.json> --base tiered-v1 --stage S3 --models all --seeds 10
pbos router eval --configs all-xhigh,all-light,tiered-v1,router-v1 --seeds 50
pbos router prove --heldout <path> --config router-v1 --profile staging-sandbox
pbos router report                                    # Pareto frontier + policy recommendation
```

Package scripts: `router:fixture`, `router:eval`, `router:prove:staging` (the latter with `PBOS_ALLOW_PROVIDER_CALLS=1`, mirroring `provider:smoke:staging`).

## 7. Artifacts (in `reports/`)

- `model-catalog.json` — versioned catalog (public schema; private pricing overlay stays out).
- `router-telemetry.jsonl` — raw per-call envelopes (run warehouse).
- `router-run.json` — per-run rollup: stage costs, outcomes, config.
- `router-ablation.json` — marginal lift matrix (stage × model).
- `router-proof.json` — held-out comparison, Pareto data, pre-registered criterion result.
- `routing-policy.json` — recommended stage→model mapping with evidence links.
- `playbasis-api-leverage-router.json` — API categories exercised, matching existing leverage reports.

## 8. Phases

**Phase 0 — Instrumentation (prereq):** telemetry envelope wired into `ProviderBridge` (single choke point — one instrumentation site); stage tagging threaded from kernel/navigator call sites; `fixture/echo` model proves zero-variance replay; catalog generator reads the external inventory. Seed implementation exists for the pure router package, catalog CLI, optional ProviderBridge telemetry hook, strict router context mode, and fixture mission telemetry-completeness gate.

**Phase 1 — Preset sweep:** named presets on 2 mission families (`examples/workspaceops-launch-pack` + CEO-sim 14-day fixture) × ≥10 seeds. First Pareto chart. Gate: replay stability holds; cost accounting reconciles with provider billing within 5%.

**Phase 2 — Per-stage ablation:** marginal lift matrix. Gate: ≥3 stages show statistically distinguishable model sensitivity (if not, routing is pointless — also a valid, publishable finding).

**Phase 3 — Router policy + held-out proof:** compose `router-v1`, pre-register criterion, run held-out via `router prove`. Deliver `router-proof.json` + `ROUTER_REPORT_001` with wins/losses/ties.

**Phase 4 (out of scope here):** live routing in WorkspaceOps behind approval gates; drift monitoring; auto re-benchmark on catalog changes (e.g., GPT-5.6 GA).

## 9. Test plan

- Existing gates stay green: `pnpm test`, `pnpm donor:verify`, `pnpm prove:robust`.
- New tests (in `tests/`): telemetry completeness (provider calls == records); catalog uniqueness (every inventory model exactly once); cost reconciliation; held-out isolation (optimizer never sees held-out scenarios or keys); OSS export excludes pricing overlay, deployment env values, and held-out bodies; `router report` refuses to run without pre-registration.
- Determinism caveat: live-model outputs are stochastic even at fixed seed. Runs record provider/system fingerprints; stability for live arms is measured as score variance across seeds, not bitwise replay. Fixture arms (`fixture/echo`) remain bitwise-replayable, preserving the existing replay gates.

## 10. Risks

- **Combinatorial explosion** — mitigated by preset + ablation design (§4.3).
- **Judge contamination** — S6 evaluator sharing a family with the S4 executor inflates scores; enforce cross-family judging in council seats or report both conditions. The existing council disagreement tracking is the detection mechanism.
- **Pricing/inventory drift** — GPT-5.6 and Flash 3.1 pricing/quota may change; catalog regenerates from inventory, never cached in code. The July 5 inventory is available and currently shows no GPT-5.6 entries; later availability must come from a fresh catalog sync, not code changes.
- **Quota contention** — 50-seed sweeps at xhigh may hit Azure TPM caps (see team-capacity runbook); runner needs rate-aware scheduling and resumable runs.
- **Goodharting the router** — router tuned on training scenarios; held-out proof is mandatory before any "cheaper and as good" claim ships.

## 11. Open questions

1. Confirm Phase 1 anchors: `workspaceops-launch-pack` + `ceo-sim` 14-day fixture?
2. What later inventory or Azure/Firebase evidence unlocks GPT-5.6 for a future wave? The July 5 catalog has zero GPT-5.6 entries, so wave 1 should freeze without it.
3. Gemini Flash 3.1: is there an approved governed route today, or does it need a new `ProviderBridge` adapter + governance review first?
4. Private pricing overlay location: `profiles/private/pricing.json` via env-vault, excluded by the OSS export scanner?
5. Stage tagging: thread a `stage` field through existing `ProviderBridge` call options, or infer from caller package? (Proposal: explicit field; inference is fragile.)

## 12. Assumptions

- WorkspaceOps stays the product runtime; router-lab lives in the PoV as another evidence-gated eval family alongside `ceo-sim` and `value run`.
- No "cheaper and as good" claim without held-out proof.
- Model names/tiers (GPT-5.5 light→xhigh, GPT-5.6, Gemini Flash 3.1) are catalog data sourced from the private inventory docs, never facts baked into code.
