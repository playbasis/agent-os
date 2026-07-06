# Robust Proof Protocol

Companion to: `docs/VISION.md`. The vision doc defines the product doctrine;
this protocol defines the gates and evidence that keep the doctrine honest.

This PoV is considered robust only when the proof harness passes, not when a single demo run succeeds.

## Primary Command

```bash
pnpm prove:robust
```

This runs:

- frozen donor archive verification
- fixture profile service doctor and four-candidate hill climb
- local-monorepo profile service doctor and four-candidate hill climb
- evidence, trace, promotion-report, artifact, eval, and redaction integrity gates
- monorepo service leverage gates against Playbasis OpenAPI and WorkspaceOps super-prompt sources
- provider-readiness gates using whitelisted env key names only
- optional live Azure Responses smoke gate when explicitly requested

## Hard Value Proof Command

Use this when the claim must include real service calls and not only fixture/deterministic proof:

```bash
pnpm value:proof:staging
```

This requires `PBOS_ALLOW_PROVIDER_CALLS=1` and runs:

- real Playbasis API probes using configured env-backed base URL, tenant header, and APIM subscription header
- real WorkspaceOps HTTP probes
- real Azure Responses smoke with parsed schema JSON
- a four-candidate staging-sandbox hill climb
- promoted best-run value artifact checks
- secret-leak checks across generated artifacts

The value proof fails unless it captures multiple successful Playbasis API calls, at least one WorkspaceOps call, a successful provider call, monotonic eval improvement, required value artifacts with hashes/bytes, and zero secret leaks.

For the broader internal proof, include staging:

```bash
pnpm pbos proof:robust examples/workspaceops-launch-pack/mission.json --profiles fixture,local-monorepo,staging-sandbox --iterations 4
```

To prove an actual provider call, open the gate deliberately:

```bash
PBOS_ALLOW_PROVIDER_CALLS=1 pnpm pbos provider:smoke --profile staging-sandbox --require-live
```

Or attach that live gate to the broader proof:

```bash
PBOS_ALLOW_PROVIDER_CALLS=1 pnpm pbos proof:robust examples/workspaceops-launch-pack/mission.json --profiles fixture,local-monorepo,staging-sandbox --iterations 4 --require-live-llm
```

The live smoke report records only redacted metadata: env variable names used for URL/API key/deployment, response ID, HTTP status, duration, token usage, output hash, and parsed schema status. It does not write endpoints, keys, provider request bodies, raw responses, or env values.

To prove a live four-seat Navigator provider council over a real/web-sourced
contested decision, open the provider gate deliberately and pass the
pre-recorded safe observation pack:

```bash
PBOS_ALLOW_PROVIDER_CALLS=1 pnpm pbos navigate prove:council-session goals/twin-ab/goal.json \
  --profile staging-sandbox \
  --require-live \
  --observations reports/navigator/make-twin-steered-harness-runs-measurably-beat-t-f10115b1/research-observation-web_search-039c26c55ea9.json
```

This proof fails unless Proposer, Adversary, Estimator, and Synthesizer all
return parsed live provider metadata, the selected decision is a
top-contested N2 match, and the decision context includes non-fixture
observations. It stores response IDs, hashes, token counts, parsed votes,
winner tally, disagreement, falsifiers, and provider identity hashes only.

## Required Gates

Every robust proof report must pass:

- `frozen-donor-archive`
- `required-profiles-covered`
- `unique-sessions-and-runs`
- `<profile>-hill-climb-improves`
- `evidence-trace-artifact-integrity`
- `zero-secret-leaks`
- `sota-style-ai-ml-llm-loop-signals`
- `high-value-workflow-artifacts`
- `donor-derived-primitives-implemented`
- `local-monorepo-service-leverage`
- `llm-provider-embedded-and-gated`
- `live-llm-provider-smoke` when `--require-live-llm` is supplied
- `profile-doctors-executed`

The live council-session proof additionally gates on:

- `provider-council-session-classified`
- `four-provider-seats-recorded`
- `provider-council-session-contested-decision`
- `live-provider-required-if-requested`
- `live-council-real-observation-context`
- `provider-council-session-disagreement-measured`
- `safe-provider-council-session-boundary`

## Latest Verified Evidence

Latest hard value proof with real API calls:

- Proof id: `value-proof-workspaceops-launch-pack-staging-sandbox-20260705122454869-0084e615`
- Report: `runs/value-proof-workspaceops-launch-pack-staging-sandbox-20260705122454869-0084e615/value-proof-report.json`
- Profile: `staging-sandbox`
- Gates passed: 6/6
- Real Playbasis API calls: 3/4 succeeded
- Successful probes are recorded as safe hashes, byte counts, status codes, and selected non-secret summaries only.
- Real WorkspaceOps calls: 2/2 succeeded, both HTTP 200 with response byte counts and body hashes
- Real LLM provider call: Azure Responses HTTP 200, provider response id recorded, parsed schema JSON, 174 total tokens
- Hill-climb improvement: `0.4761 -> 1.0000 (+0.5239)` across four staging candidates
- Held-out lift: `+0.0413`
- Best run: `workspaceops-launch-pack-candidate-3-20260705122526-f4db621a`
- Value artifacts: 11 required artifacts have SHA-256 hashes, byte counts, and summaries
- Secret leaks: 0 across 34 scanned artifacts

Latest robust proof run:

- Proof id: `robust-proof-workspaceops-launch-pack-20260705162509280-6378d400`
- Report: `runs/robust-proof-workspaceops-launch-pack-20260705162509280-6378d400/robust-proof-report.json`
- Profiles: `fixture`, `local-monorepo`
- Candidate runs: 8
- Gates passed: 13/13
- Score improvement per profile: `0.4761 -> 1.0000 (+0.5239)`
- Local monorepo leverage: 201 OpenAPI paths and 272 WorkspaceOps super-prompt ids
- Provider proof: whitelisted provider env keys/deployments present, live LLM readiness true, calls gated unless explicitly enabled
- Donor primitive proof: governed tool policy, approval queue, context compaction, swarm lanes, source priority, query optimization, adaptive reward harness, robustness sweep, and WorkspaceOps daily autonomy artifacts present in best runs
- Secret leaks: 0

Latest router Phase 0 fixture proof:

- Run id: `router-phase0-fixture-20260705153235-22b86d5c`
- Report: `reports/router-run.json`
- Config: `fixture-echo`
- Profile: `fixture`
- Expected provider calls: 2
- Telemetry: 2/2 records complete, both stage `S4`, call kinds `provider.research.brief` and `azure.image.create`
- Cost: `0`
- Gates passed: fixture profile only, zero provider-call budget, telemetry complete, fixture model only, hash-only private-material scan
- Promotion decision: `revise` because generic mission eval gates are not optimized for the fixture router mission

Latest live provider council-session proof:

- Proof id: `navigator-provider-council-session-make-twin-steered-harness-runs-measurably-beat-t-f10115b1-8b1e7f83`
- Report: `goals/twin-ab/navigation-provider-council-session-live-proof.md`
- Profile: `staging-sandbox`
- Provider gate: `PBOS_ALLOW_PROVIDER_CALLS=1`
- Live seats: 4/4 (`Proposer`, `Adversary`, `Estimator`, `Synthesizer`)
- Decision source: top-contested N2 match `judge-009`
- Deterministic prior disagreement: `0.5000`
- Observation context: 2 web-sourced observations, fixture weight fraction `0.0000`
- Live winner tally: all four seats selected the same right-hand path; live disagreement was measured as `0.0000`
- Provider identity diversity: `1/4`, so this proves live provider-seat judgment, not independent multi-provider judgment
- Safety: raw prompts, raw provider responses, endpoints, URLs, env values, request bodies, response bodies, headers, and selected live payload fields are excluded

Latest Prompt Twin A/B v2 held-out proof:

- Proof id: `flappy-prompt-twin-ab-make-twin-steered-harness-runs-measurably-beat-t-f10115b1-a626b8f1`
- Report: `goals/twin-ab/navigation-prompt-twin-ab-proof.md`
- Command: `pnpm pbos navigate prove:prompt-twin-ab goals/twin-ab/goal.json --commitment eval-families/flappy/scorer-commitments/heldout-v1.commitment.json --expected-lift 0.10`
- Pre-registered expected lift: `0.1000`
- Control held-out pass rate: `0.1000`
- Twin held-out pass rate: `1.0000`
- Observed held-out lift: `+0.9000`
- Result: met the pre-registered bar
- Commitment: goal answer-key commitment matches `eval-families/flappy/scorer-commitments/heldout-v1.commitment.json`
- Safety: public proof artifacts exclude raw held-out cases, answer keys, raw artifact bodies, source bodies, raw command output, URLs, env values, and provider payloads

## Claim Boundary

The default proof proves a robust, monorepo-backed harness kernel with evidence-gated operating-system properties: replayable mission runs, multi-profile service connectors, AI/ML/LLM provider readiness and gating, high-value workflow artifacts, donor-derived agent primitives, ML-style scoring, continuous-improvement loops, and explicit training-score lift. The historical hill climb is scripted by maturity level; it is a deterministic proof of the loop, not a claim of open-ended intelligence or broad self-improvement.

The live proof additionally requires a successful Azure Responses smoke call through the env-backed provider bridge, with redacted metadata only. The live council proof adds four parsed provider-seat judgments on one real/web-sourced contested Navigator decision, but it is not a claim of independent multi-provider judgment unless distinct provider identities are configured.

The hard value proof additionally requires successful real Playbasis API calls and WorkspaceOps calls, then ties those service calls to a promoted hill-climbed evidence pack and hashed value artifacts. The Prompt Twin A/B v2 proof adds one pre-registered, scorer-only held-out lift result on the Flappy eval family; router-lab Phase 0 adds fixture telemetry completeness for provider call routing. Neither establishes general task intelligence.

It does not claim SOTA task success, AGI/ASI behavior, economic value, or an external benchmark win until held-out lift, human/external review, measured economic baselines, and competitor benchmarks exist.
