# Playbasis Agent OS Intelligence Report (v2)

Generated: 2026-07-07T17:51:46.744Z

## Executive Summary

- One-liner: A 12-lane codebase whose center of gravity is pbos cli command surface under apps/navigator-desktop.
- Short read: Active lanes: PBOS CLI Command Surface, Navigator Path-Fan Proof Loop, Tooling, Tests, And Quality Gates.
- Momentum: Latest visible momentum concentrates in pbos cli command surface and adjacent lanes, with 62 commits in 2026-07 reading as cli / command surface + missions / proof loop + visual / navigator.
- Defensibility: The codebase shows multiple independent capability lanes moving in parallel, which is harder to replicate than a single-product repo.
- Investor line: The repo concentrates momentum in pbos cli command surface under apps/navigator-desktop, with supporting distribution via packages/cli.
- Lab line: A 12-lane codebase anchored on pbos cli command surface, with 1 top-level apps feeding the monorepo.
- Capability bundle: repo-local (pathHash=a2bd58f12675, pathIncluded=false)

## Repository Scores

| Score | Value | Grade | Band | Interpretation |
| --- | --- | --- | --- | --- |
| Codebase Health | 74.4 | B | healthy | Healthy overall. Pay attention to 3 large files and 13 single-point-of-failure paths. |
| Momentum | 92.5 | A+ | excellent | Heavy active momentum: ~275 commits/month and ~811,173 insertions/month; 10 clearly rising lanes. |
| Velocity | 60 | C | watch | Mixed velocity: either a lot of churn or uneven monthly output. |
| Focus | 61.7 | C | watch | Scattered: momentum is spread evenly enough that no lane is the strategic leader. |

## Narrative Phases

- **Admin / builder × WorkspaceOps build-out** (2026-07 → 2026-07) — 62 commits. CLI / command surface 17%, Missions / proof loop 17%, Visual / Navigator 16%

## Capability Groups

| Capability | Lines | 30d | 90d | Rank | Direction |
| --- | --- | --- | --- | --- | --- |
| PBOS CLI Command Surface | 26,584 | 46 | 46 | 534.9 | rising |
| Navigator Path-Fan Proof Loop | 11,959 | 39 | 39 | 448.5 | rising |
| Tooling, Tests, And Quality Gates | 25,336 | 43 | 43 | 392.4 | rising |
| Docs, Strategy, And Claim Boundary | 11,585 | 50 | 50 | 324.6 | rising |
| Adaptive Search And Optimizers | 40,028 | 35 | 35 | 283.2 | rising |
| Mission Kernel And Evidence Packs | 2,500 | 17 | 17 | 194.4 | rising |
| Router Lab And Provider Bridge | 12,977 | 14 | 14 | 164.6 | rising |
| Operator Twin And Visual Critique Loop | 8,946 | 12 | 12 | 139.8 | rising |
| Evals And Promotion Gates | 14,202 | 19 | 19 | 98.9 | rising |
| Run Warehouse And Reports | 7,501 | 8 | 8 | 83.3 | stable |
| Donor Clean-Room And OSS Boundary | 1,566 | 7 | 7 | 62.8 | stable |
| Playbasis Platform Bridge | 394 | 13 | 13 | 10.5 | rising |

## Valuable Assets

| Path | Category | Score | Why |
| --- | --- | --- | --- |
| `packages/cli/src/index.ts` | tooling | 356 | Referenced by 40 package script entries. |
| `packages/navigator/src/index.ts` | tooling | 304 | Referenced by 40 package script entries. |
| `packages/service-connectors/src/index.ts` | tooling | 243 | Referenced by 40 package script entries. |
| `packages/run-warehouse/src/index.ts` | tooling | 196 | Referenced by 40 package script entries. |
| `packages/evals/src/index.ts` | tooling | 196 | Referenced by 40 package script entries. |
| `packages/kernel/src/index.ts` | tooling | 192 | Referenced by 40 package script entries. |
| `packages/router-lab/src/index.ts` | tooling | 185 | Referenced by 40 package script entries. |
| `packages/mission-optimizer/src/index.ts` | tooling | 181 | Referenced by 40 package script entries. |
| `docs/ROBUST_PROOF_PROTOCOL.md` | docs-source | 97 | Referenced by 15 markdown docs. |
| `docs/VISION.md` | docs-source | 88 | Referenced by 21 markdown docs. |
| `packages/cli/src/evidence-dashboard.ts` | tooling | 41 | Referenced by 1 markdown doc. |
| `scripts/generate-platform-intelligence-v2.ts` | generation-pipeline | 33 | Referenced by 5 package script entries. |
| `packages/cli/src/image-critique.ts` | tooling | 28 | Referenced by 2 markdown docs. |
| `scripts/platform-intelligence/portfolio.ts` | tooling | 12 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/scoring.ts` | tooling | 6 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/render.ts` | tooling | 6 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/history.ts` | tooling | 6 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/viz.ts` | tooling | 6 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/llm.ts` | tooling | 5 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/types.ts` | tooling | 5 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/audit.ts` | tooling | 5 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/scoring.fixtures.test.ts` | tooling | 5 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/README.md` | docs-source | 5 | Matches Tooling, Tests, And Quality Gates. |
| `scripts/platform-intelligence/render-markdown.ts` | tooling | 5 | Matches Tooling, Tests, And Quality Gates. |

## Key Docs

- `AGENTS.md` — Primary agent instructions and repo operating discipline.
- `docs/VISION.md` — Canonical product doctrine, claim boundary, operating loop, and roadmap.
- `docs/DOCS_INDEX.md` — Canonical document routing layer and conflict-resolution map.
- `README.md` — Public-facing overview, status, setup, package map, and public/private boundary.
- `docs/COMMANDS.md` — Complete pbos command reference and proof workflow map.
- `docs/ROBUST_PROOF_PROTOCOL.md` — Current proof gates, latest verified evidence, and strict claim boundary.
- `docs/AGENT_OS_POV_HANDOVER.md` — Current engineering handover and package responsibilities.
- `docs/CURRENT_STATE_ASSESSMENT_AND_PRIVATE_ASSETS.md` — Honesty framing and public/private evidence boundary.
- `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md` — Path-fan planning, model council, ambition ratchet, and loop-proof architecture.
- `docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md` — Objective functions, held-out eval design, blinding, and anti-Goodhart mechanics.
- `docs/OPERATOR_TWIN_SCREENSHOT_FRONTEND_PRODUCT_REQUEST.md` — Target screenshot-to-frontend lane and worker-dispatch product request.
- `docs/EVIDENCE_DASHBOARD_HARNESS.md` — Evidence dashboard generation and verification contract.
- `docs/IMAGE_PIPELINE_DONOR_SCAN.md` — Image pipeline donor scan and clean-room visual critique port history.
- `docs/MODEL_ROUTER_EVAL_PRD.md` — Model-router eval product requirements and routing metric design.
- `docs/CAPABILITY_BRIDGES_SEARCH_RESEARCH_IMAGE.md` — Search, research, and image-generation bridge tracks.
- `docs/PROOF_SOTA_RESEARCH_COMMERCIALIZATION_PLAN.md` — Claim ladder, research path, benchmark plan, and sales path.
- `docs/DESIGN_LANGUAGE_AND_NATIVE_APP.md` — Navigator visual system and native-feeling app direction.
- `CONTRIBUTING.md` — Linked from a primary repo index or root map document.
- `SECURITY.md` — Linked from a primary repo index or root map document.

## Risks

- **[high] Oversized file: packages/cli/src/index.ts** — File holds 11,494 lines. Large files amplify merge conflicts and ownership ambiguity.
- **[high] Oversized file: packages/service-connectors/src/index.ts** — File holds 10,484 lines. Large files amplify merge conflicts and ownership ambiguity.
- **[medium] Oversized file: packages/cli/src/super-plan.ts** — File holds 9,662 lines. Large files amplify merge conflicts and ownership ambiguity.
- **[medium] 13 structurally load-bearing files active** — These files are referenced across docs, deploys, or runtime. Concentrated ownership here is unavoidable but must be made explicit.
- **[medium] Config/CSS surface is a large share of the repo** — Design-token consolidation or style-system extraction would reduce this surface area and cut duplication.
- **[low] Documentation weight outpaces code in several lanes** — Docs are good until they drift faster than code changes. Consider consolidation or pruning to an index + evidence links.

## LLM Passes

| Pass | Status | Tier | Deployment | Effort | Duration |
| --- | --- | --- | --- | --- | --- |
| llm-disabled | skipped | full | gpt-5.5 | low | -ms |
