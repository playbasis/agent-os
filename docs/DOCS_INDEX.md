# Documentation Index

Last updated: 2026-07-06

This index defines which documents are canonical, which are deep dives, and
how to resolve overlap. The repo moves quickly; docs are part of the proof
surface, not a side artifact.

## Canonical Reading Order

1. `docs/VISION.md` - product doctrine, claim boundary, operating loop,
   product language, demo strategy, architecture north star, and roadmap.
2. `docs/DOCS_INDEX.md` - this routing layer for canonical docs, deep dives,
   raw notes, and conflict resolution.
3. `README.md` - public-facing overview: status, claim-boundary summary,
   quick start, profiles, and the public data boundary.
4. `docs/COMMANDS.md` - complete `pbos` command reference grouped by
   workflow, including the safety notes attached to each proof command.
5. `docs/ROBUST_PROOF_PROTOCOL.md` - proof commands, gates, latest verified
   evidence, and strict claim boundary.
6. `docs/AGENT_OS_POV_HANDOVER.md` - current engineering handover and package
   responsibilities.
7. `docs/CURRENT_STATE_ASSESSMENT_AND_PRIVATE_ASSETS.md` - durable honesty
   framing and private judgment/provenance boundary.

If these conflict, the latest proof artifacts and `ROBUST_PROOF_PROTOCOL.md`
win over aspirational language.

## Product And Architecture Deep Dives

- `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md` - path-fan
  planning, model councils, ambition ratchet, context packets, checkpointed
  loop proofing, and implementation status.
- `docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md` - objective functions,
  held-out eval factories, blinding, forced entropy, Progress Sharpe, and
  agent-facing instruments.
- `docs/COCKPIT_UX_AND_WIDE_EXPLORATION.md` - 24-screen mission cockpit and
  wide-exploration search.
- `docs/DESIGN_LANGUAGE_AND_NATIVE_APP.md` - premium native-feeling Navigator
  app visual system and self-build loop.
- `docs/OPERATOR_TWIN_SCREENSHOT_FRONTEND_PRODUCT_REQUEST.md` - target lane
  for replacing more of the user's HITL Codex-driver role with context packs,
  worker dispatch packets, gated worker-run requests, cycle reports, review
  passports, and real frontend artifacts from screenshot references under proof
  gates.
- `docs/USE_CASES_AND_GOAL_PATTERNS.md` - target mission templates, fit
  filter, and anti-patterns.
- `docs/CAPABILITY_BRIDGES_SEARCH_RESEARCH_IMAGE.md` - web search, deep
  research, image generation, and catalog bridge tracks.

## Proof, Routing, And Commercialization

- `docs/PROOF_SOTA_RESEARCH_COMMERCIALIZATION_PLAN.md` - claim ladder,
  metric stack, research publication path, benchmark plan, and sales path.
- `docs/MODEL_ROUTER_EVAL_PRD.md` - router-lab product requirements.
- `docs/MODEL_ROUTER_EVAL_HANDOVER.md` - router-lab implementation handover.
- `docs/MODEL_ROUTER_DONOR_SCAN.md` - donor scan for model routing assets and
  OSS boundary.
- `docs/IMAGE_PIPELINE_DONOR_SCAN.md` - donor scan for a local GPT-image
  pipeline POC: critique/refinement patterns ported into
  `packages/donor-primitives` and `packages/cli` (not part of this repo's
  exported package set).
- `docs/NAVIGATOR_BLENDED_VISUAL_HANDOVER.md` - blended visual proof state.
- `docs/NAVIGATOR_STUNNING_VISUALS_HANDOVER.md` - premium visual-quality pass
  and process contract.

## Raw Source Notes

- `docs/VISION_NOTES.md` - raw source-note archive. It contains valuable
  thinking, but also duplicate sections, external references, future model
  hypotheses, ideal-world logs, and aspirational capability lists. Use it as
  source material, not as a claim boundary.

## Conflict Resolutions

| Conflict | Resolution |
| --- | --- |
| "Agent OS" versus "proof lab" | Today: governed proof lab. Target: production Agent OS after durable queues, tenancy, auth, observability, and customer proof packs exist. |
| Flappy versus reference UI versus help-center search | Flappy is an internal eval family. Reference UI -> production app is the near-term system demo. Help-center search is the stronger business pilot when data access exists. |
| Game language versus enterprise language | Use game language internally for state/reward design; translate to mission, checkpoint, proof pack, certification, and capability graph in product copy. |
| Future model/tier names versus current availability | `reports/model-catalog.json` and router-lab artifacts are source of truth. Future names in notes are hypotheses. |
| Pixel conformance versus premium quality | Pixel score is diagnostic; promotion requires blind visual quality, held-out states, human visual review, accessibility, and zero-leak proof. |
| Training lift versus real improvement | Training lift is optimizer signal. Final claims require held-out lift, real runtime evidence, human/external review, or economic baselines. |
| Council diversity versus one provider | A four-seat council proves protocol shape unless distinct provider identities and disagreement are configured and measured. |
| Operator Twin versus current harness | Current evidence proves a governed proof workbench plus narrow Prompt Twin/visual loops. The target Operator Twin must drive worker quests, donor context, code diffs, rendered scoring, and review without the user steering each turn. |

## Maintenance Rules

- Update `docs/VISION.md` only for durable doctrine changes, not every proof
  number.
- Update `docs/ROBUST_PROOF_PROTOCOL.md` when proof commands, gates, latest
  evidence, or claim boundaries change.
- Update `README.md` when CLI commands, package layout, profiles, or runnable
  app/proof surfaces change.
- Keep raw private data, env values, provider payloads, screenshots used as
  hidden targets, and answer keys out of git.
- When adding a new subsystem, add it to README and this index before calling
  the repo map current.
