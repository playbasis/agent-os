# Model Router Donor Scan

Date: 2026-07-05
Scope: disk search for reusable Playbasis code related to model routing, telemetry, tokens, tool registries, agents, and standalone OSS boundaries.
Canonical framing: `docs/VISION.md` defines the clean-room and proof-boundary
rules for turning donor ideas into governed router capability.

## Search Surface

Reviewed adjacent and donor directories under the local home directory:

- `../playbasis-platform`
- `../playbasis-agent-os-donor-copy`
- `$PBOS_PRIVATE_EVAL_ROOT`
- `~/playbasis-ai`
- `~/playbasis-ai-sdk`
- `~/playbasis-eval-portal`
- `<repo-root>/raw-donors/playbasis-platform`

This repo remains the implementation target. Donor code was treated as reference material only; new router-lab code is clean-room, pure TypeScript where possible, and avoids importing from `raw-donors/` or private platform packages.

## Donor Candidates

| Donor file | Useful pattern | Decision |
|---|---|---|
| `playbasis-platform/packages/usage-telemetry/src/index.ts` | Usage event vocabulary, trace ids, token/cost fields, ingestion envelope | Ported the vocabulary shape only. Router telemetry writes local JSONL and does not depend on platform ingestion APIs. |
| `playbasis-platform/packages/image-router/src/index.ts` | Catalog-style model selection, env allow/disable filters, provider usage normalization | Ported catalog/selection/usage-normalization patterns. Did not copy the image-specific catalog or app routing policy. |
| `playbasis-platform/packages/agent-runtime/src/index.ts` | Tool, guardrail, and trace-span contracts | Deferred. Useful for future S4 tool registry and agent runtime work, but too broad for Phase 0 router telemetry. |
| `playbasis-platform/packages/genai-sdk/src/core/intent-router.ts` | Simple intent-to-tier routing | Reference only. Too app-specific and not evidence-gated enough for router-lab. |
| `playbasis-platform/packages/bie/src/pricing/tokenCost.ts` | Token cost formula using per-million-token prices | Ported the explicit pricing-overlay math pattern. No hardcoded 2026 price table is included. |
| `playbasis-platform/docs/WORKSPACEOPS_MODEL_ROUTING_POLICY_2026-05-04.md` | Existing selective frontier-lane policy and telemetry requirement | Reflected in PRD/router plan: strongest models only where marginal lift justifies cost. |
| `playbasis-platform/AZURE_RESOURCE_INVENTORY.md` | Current model inventory source of truth | Used only via `pbos router catalog --sync <path>`. The generated catalog stores hashes and env-key labels, not env values or pricing overlays. |

## Implemented From The Scan

- Added `packages/router-lab` as a standalone router/eval primitive package.
- Added `schemas/router/model-catalog.schema.json` and `schemas/router/telemetry.schema.json`.
- Added `pbos router catalog --sync <inventory-path>` and `router:catalog`.
- Generated `reports/model-catalog.json` from the July 5 inventory: 13 unique entries, 7 text-capable, 6 image-generation, 0 GPT-5.6.
- Added optional router context and hash-only telemetry in `ProviderBridge`.
- Threaded explicit S4 context through selected Playbasis tool registry provider calls.
- Added `requireContext` strict mode so router-covered provider methods fail before fixture or live work when explicit stage context is missing.
- Added `pbos router run examples/router-phase0/mission.json --profile fixture --config fixture-echo`, which writes `reports/router-run.json` plus run-scoped telemetry under `reports/router-telemetry/`.
- Added focused tests for catalog safety, provider usage normalization, pricing-overlay-only cost estimation, stage selection, and ProviderBridge telemetry.
- Included the pure `packages/router-lab` package and `tests/router-lab.test.ts` in the clean OSS export set.

## Verification Evidence

Commands run successfully on 2026-07-05:

- `./node_modules/.bin/vitest run`
- `./node_modules/.bin/tsc --noEmit`
- `node scripts/verify-donor-manifest.mjs --frozen`
- `./node_modules/.bin/tsx packages/cli/src/index.ts router catalog --sync ../playbasis-platform/AZURE_RESOURCE_INVENTORY.md`
- `./node_modules/.bin/tsx packages/cli/src/index.ts router run examples/router-phase0/mission.json --profile fixture --config fixture-echo`
- `./node_modules/.bin/tsx packages/cli/src/index.ts export-oss-candidate --verify`
- `./node_modules/.bin/tsx packages/cli/src/index.ts proof:robust examples/workspaceops-launch-pack/mission.json --profiles fixture,local-monorepo --iterations 4`

The clean export verifier runs its temp-checkout install as `pnpm install --frozen-lockfile --ignore-scripts` with `CI=true` and `PNPM_CONFIG_IGNORE_SCRIPTS=true`, because pnpm's ignored-builds policy can otherwise fail non-interactive verification on `esbuild` even when typecheck/test/scan are valid.

## Standalone / OSS Boundary

Public-safe:

- Router stage definitions.
- Catalog schema and parser.
- Fixture model (`fixture/echo`).
- Telemetry schema with deployment and response hashes.
- Pricing calculation when an explicit private overlay is provided.
- Tests using synthetic fixture inventory and fixture provider URLs.

Private or excluded:

- Raw provider deployment values.
- API keys, endpoints, or env-vault values.
- Pricing overlays and held-out eval bodies.
- `packages/service-connectors`, `packages/env-vault`, and `packages/cli` in the existing clean export policy.
- Donor source directories and raw donor code.

## Remaining Work

- Add Phase 1 model-config presets and `pbos router ablate|eval|prove|report`.
- Wire catalog-selected deployment env keys into every provider-call path that participates in S1-S9, not just the initial bridge paths.
- Add private pricing overlay loading through env-vault and verify reconciliation against provider billing for staging runs.
- Add governed Gemini/alternate-provider adapters only after route approval.
- Keep GPT-5.6 out of wave 1 until a later inventory sync produces concrete entries.
