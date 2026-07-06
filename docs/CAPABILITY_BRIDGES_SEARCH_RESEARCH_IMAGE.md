# Capability Bridges: Web Search, Deep Research, and Image Generation for Navigator Loops

Last updated: 2026-07-04
Companion to: `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md`,
`docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md`,
`docs/ROBUST_PROOF_PROTOCOL.md`.
Canonical framing: `docs/VISION.md` defines governed tool use; this document
shows how web search, deep research, and image generation bridge into that
control plane.

This doc records what a direct code inspection of the Playbasis monorepo
found on 2026-07-04, why it changes the build plan for adding web search,
deep research, and image generation to the automated loops, and how to do
the work as three parallel tracks. It also carries the standing review
ledger so remaining gaps from the same-day code review are not lost between
sessions.

Headline: these capabilities do NOT need to be built. They already exist in
the monorepo as governed, production-shaped tool plugins with approval
policies, model bindings, and trace instrumentation. The work is bridging,
not building - the same gated pattern this repo has used for every other
capability.

## 1. Verified Findings in the Monorepo

All paths relative to `../playbasis-platform/apps/website`.

### 1.1 Tool-kind registry with per-tool governance

`lib/workspace-ops-runtime-tool-kinds.ts` (103 lines) defines 21 runtime
tool kinds including `web_search`, `deep_research`, `image_create` (raster
model lane), `image_generate` (lightweight SVG lane), `video_create`
(Sora), `vision_analyze`, `document_generate`, `spreadsheet_generate`,
plus the governed social/publish lane. Each kind has a usage description
that discriminates lanes ("web_search: quick source discovery... Not for a
full research report"). The approval split is already decided:

- Auto-approve: `web_search`, `image_create`, `image_generate`,
  `vision_analyze`, `document_generate`, `spreadsheet_generate`, others.
- Human approval required: `deep_research`, `video_create`, `file_edit`,
  `outbound_api_call`, `dashboard_app_execute_governed`, all social
  publish/schedule/connect kinds.

### 1.2 Real plugin implementations

`lib/dashboard-agents.ts` (16.5k lines) holds a versioned plugin registry
(`dashboardAgentToolDefinitions`) where each tool declares pluginId,
capabilities, outputTypes, approvalMode, and an `execute()`:

- `web_search`: live DuckDuckGo HTML scrape (`searchWebResults`, line
  ~4755) with timeouts, per-call trace events, structured title/URL
  results.
- `deep_research`: a real mini-pipeline - base query plus three expansion
  queries (analysis / trends 2026 / competitive landscape), URL dedupe,
  heartbeat trace events, then LLM synthesis through Azure with per-tool
  model bindings (`TOOL_LLM_BINDINGS`), retry-with-compaction, and a
  durable cited report artifact. Approval-gated. A code comment notes
  "Gemini deep research can be wired later".
- `image_create`: real Azure OpenAI image API (`lib/azure-openai-image.ts`,
  312 lines) with sizes, quality tiers, style-reference input,
  transparency, revised-prompt capture, and token usage.
- `video_create`: `AzureOpenAISoraService` (`lib/azure-openai-sora.ts`).
- All calls wrapped in `traceToolApiCall` for durable observability.

### 1.3 Routing intelligence with mismatch guards

`lib/workspace-ops-chat-runtime.ts` (7k lines) refuses to dispatch
`web_search` when the ask is a cited multi-source brief (forces
`deep_research`), refuses `deep_research` for lightweight lookups, and
blocks `video_create` for research-shaped requests. The steering
discrimination between quick lookup / deep synthesis / creative asset is
already written.

### 1.4 Super-prompt catalog

`lib/workspace-ops-super-prompt-catalog.ts` (3.8k lines): 289 presets with
`orchestrationMode: single-turn | turn-based | swarm`, DAG nodes with
`dependsOn`, per-node `toolKind` + `agentSlug` + `approvalRequired`, and an
honest `runtimeGaps` field (image_create is currently marked failing in
the eval environment - "Needs runtime wiring").

### 1.5 Model routing tiers

`lib/agent-model-routing.ts` (174 lines): nano / reasoning / builder /
codex / frontier tiers with stage allowlists and env-gated frontier
access. Directly reusable as council seat tiers: nano seats for cheap
pairwise judgments, frontier seats for synthesis.

### 1.6 Agent qualifications

`lib/agent-capabilities.ts` (1.7k lines): agents carry
`AgentToolQualification` entries with primary/secondary proficiency per
tool kind - the labor-market certification model, already implemented.
`lib/agent-tool-health.ts` monitors per-tool health.

## 2. What Each Capability Buys the Loop

| Capability | Loop seat | Value |
| --- | --- | --- |
| `web_search` | OBSERVE / ORIENT | Grounds the Goal Compiler's SOTA definition in what reference products actually do; feeds path re-weighting with evidence from outside the codebase; discovers public artifacts for the eval factory (the LFD distillation move). |
| `deep_research` | FAN / council | The cheapest real fix for the fan-diversity gap (all paths are currently one plan with different numbers): research-informed path proposals. Research packets are what council Estimator seats should consume. |
| `image_create` + pixel-diff scorer | Second objective domain | Image generation alone is unmeasurable vibes. The PAIR - generate, then score with a deterministic pixel-diff instrument - creates a second objective playground beyond Flappy ("asset clone until diff < threshold"). Gives the Prompt Twin taste gate visual artifacts to judge. |
| `web_search` on stall | Forced entropy | LFD stall rule upgraded: a stalled cycle's mandated non-obvious jump becomes "search how others solved this, propose a new path family from what you find." Entropy plus knowledge acquisition in one mechanism. |

## 3. Three Parallel Tracks

Each track follows the proven gated-ProviderBridge pattern, lives in
distinct files, and can be built by a separate session. Coordinate only on
shared kernel types (if a new observation-source type is needed, land that
one small change first).

### Track 1: research-bridge (web_search + deep_research)

Status: shipped 2026-07-04 in
`packages/service-connectors/src/index.ts`,
`packages/navigator/src/index.ts`, `packages/cli/src/index.ts`,
`tests/service-value-probes.test.ts`, `tests/navigator.test.ts`, and the
safe live cassette at
`reports/research-cassettes/research-web_search-039c26c55ea9-live-recorded-cassette.json`.

- New runtime tools in `packages/service-connectors` mirroring the
  monorepo plugin contracts (thin reimplementation; do not import private
  code into the OSS lane).
- Cassette record/replay: live calls record sanitized cassettes; fixture
  profile replays them deterministically. Live only behind
  `PBOS_ALLOW_PROVIDER_CALLS`-style gates.
- Outbound query redaction: every query is scanned against the env vault
  before sending.
- Fetched pages are untrusted input: store content hashes and extracted
  summaries only, never raw pages, in evidence packs and context packets.
- Surface as `pbos navigate observe --query "..."` producing real
  `NavigationObservation`s.
- Acceptance: a web-sourced observation enters a loop proof and moves path
  weights; reality-fraction reporting includes web-sourced observations as
  their own source class; zero leaks; fixture cassette replay is
  deterministic.

### Track 2: creative-bridge (image_create + pixel-diff loss)

Status: shipped 2026-07-05 in `packages/service-connectors/src/index.ts`,
`packages/navigator/src/index.ts`, `packages/cli/src/index.ts`,
`packages/sandbox-dashboard/src/index.ts`, `tests/provider-bridge.test.ts`,
`tests/service-value-probes.test.ts`, `tests/navigator.test.ts`, and
`tests/sandbox-dashboard.test.ts`.

- `image_create` through the gated ProviderBridge (metadata + hashes only,
  like the existing provider smoke discipline).
- A deterministic pixel-diff scorer as the layer-1 instrument (per the LFD
  lesson: give the agent a pixel-diff tool, not an LLM staring at
  screenshots).
- New mission family: asset-clone - reproduce a target composition until
  diff < threshold, with held-out target variants from the eval factory.
- Prompt Twin taste gate reviews visual artifacts (style/brand fit) but
  never overrules the diff instrument.
- Acceptance: a loop demonstrably descends pixel-diff on held-out targets;
  the second domain is registered in the eval factory; spend instruments
  cap image calls per loop.

Latest fixture proof:

- Goal: `goals/asset-clone/goal.json`
- Eval family: `eval-families/asset-clone/train/manifest.json` plus
  `eval-families/asset-clone/scorer-commitments/heldout-v1.commitment.json`
- Private answer sheet: `$PBOS_PRIVATE_EVAL_ROOT/asset-clone-heldout-v1/`
- Proof: `reports/navigator/make-asset-clone-image-create-runs-descend-held--d2b2cca0/asset-clone-proof.json`
- `image_create`: fixture evidence `ok`, image hash recorded, no raw prompt,
  URL, request body, response body, b64 payload, image bytes, or env values
- Pixel scorer: baseline similarity `0.5332`, Navigator similarity
  `1.0000`, pixel diff ratio `0.0000`, pre-registered expected similarity
  `0.9800`, all 10 asset-clone gates passed
- Loop diagnostic: `navigation-asset-clone-loop-proof.json` reports
  reality/held-out layer fraction `1.0000`, but generic loop gates still
  fail old path-fit/human-feedback assumptions. Treat that as item 9 work,
  not a failure of the asset-clone scorer.

### Track 3: catalog-bridge (vocabulary + governance import)

Status: shipped 2026-07-04 in
`packages/navigator/src/index.ts`, `schemas/navigator/path.schema.json`,
`tests/navigator.test.ts`, and `goals/twin-ab/path-fan.json`.

- Import the 21 tool-kind vocabulary, the approval-required split, and the
  primary/secondary proficiency model as POV types (the eval workspace
  contract already reads super-prompt ids, so this is completing an
  existing dependency, not adding one).
- Navigator path milestones declare `toolKind` needs; validation rejects
  paths whose tool kinds are not in the registry or whose approval class
  is missing.
- Acceptance: approval parity test proves `deep_research` and
  `video_create` are approval-gated in POV exactly as in the monorepo;
  paths carry validated toolKind declarations.

Suggested order: Track 3 first (smallest, unblocks vocabulary), Track 1
second (feeds fan diversity and reality fraction), Track 2 third (new
domain, benefits from eval-factory work landing in parallel).

## 4. Safety Rails Added by These Bridges

Web-facing tools open two new leak directions; both get explicit gates:

1. Outbound: queries can exfiltrate context. Query redaction against the
   env vault is mandatory before any network call; queries are logged as
   hashes plus safe summaries.
2. Inbound: fetched content is untrusted and may contain prompt
   injection. Raw pages never enter evidence packs, context packets, or
   council packets - only hashes, extracted structured fields, and
   summaries produced under an injection-aware prompt.

Plus the standing LFD rule: instruments before capability. Per-loop caps
on search calls, research runs, and image generations, visible to the
agent via budget commands, ship before the tools are enabled in any loop.

Known fragility to record honestly: the monorepo web_search backbone is
DuckDuckGo HTML scraping - rate-limitable and brittle. Acceptable for PoV
loops behind cassettes; flag a provider upgrade (the monorepo already
anticipates wiring a stronger research provider later). The catalog's own
`runtimeGaps` notes image_create failing in the monorepo eval environment;
Track 2 should verify the Azure image path independently before relying on
it.

## 5. Review Ledger (2026-07-04)

Standing record so gaps survive across sessions. Credit first: the
following review recommendations shipped the same day - real mission
dispatch into loop observations with fixture/dispatched weight fractions
(reality fraction), pre-observation path-fan registration, calibration
reports, ambition-ratchet decision records, bounded daily-loop mechanics,
fixture council seat votes with disagreement metrics, gated provider
council seats with identity-diversity tracking, shape-memory consumption
in fan generation, a first prompt-twin A/B proof, LFD goal artifacts,
and a 500-case Flappy eval factory with in-repo training cases plus
outside-repo held-out answer keys committed by hash. The catalog-bridge
also now mirrors the monorepo's 21 WorkspaceOps tool kinds, approval split,
and primary/secondary qualification model in Navigator paths. The
research-bridge now exposes `workspaceops.web_search` and
`workspaceops.deep_research`, blocks secret-bearing outbound queries,
stores hash-only safe cassettes, and feeds web-sourced observations into
Navigator loop proofs. The live council session now runs all four
ProviderBridge seats on one web-grounded top-contested Navigator decision
and records live seat counts, provider identity diversity, winner tally,
and disagreement. The creative-bridge now exposes gated `image_create`
ProviderBridge evidence, a deterministic asset-clone eval family with
private held-out target grids outside the repo, pre-registered pixel-diff
scoring, and a dashboard creative-bridge panel.

Remaining gaps, ranked:

1. Fan diversity now has first runtime enforcement: stalled cycles trigger
   stall-to-search and bounded non-leading-path exploration using the
   registered fan. Remaining gap: research-informed path proposals still
   need to create genuinely different plan shapes, not only reweight the
   existing fan.
2. Council is now live at the provider-seat layer: Proposer, Adversary,
   Estimator, and Synthesizer judged one web-grounded top-contested
   Navigator decision with `PBOS_ALLOW_PROVIDER_CALLS=1`. Remaining gap:
   independent multi-provider/model diversity is not proven unless four
   distinct provider identities are configured.
3. Twin A/B v2 now scores against the committed held-out Flappy family after
   pre-registering expected lift. Latest result: expected `0.1000`, control
   held-out pass rate `0.1000`, twin held-out pass rate `1.0000`, observed
   held-out lift `+0.9000`, met the pre-registered bar. Remaining gap:
   add the stuffed-artifact negative proof so memorized/template lift is
   visibly rejected.
4. Gate naming honesty is now enforced: the stale
   `navigator-beats-static-baseline` claim is absent, the compatibility gate
   is `reweighting-selects-best-fitting-path`, and it checks raw path-fit
   non-regression rather than calling fixture lift economic value.
5. Progress Sharpe is now the Navigator selection criterion for
   efficient-frontier paths. Reports show raw path-fit, Progress Sharpe,
   evidence confidence, reality/held-out fraction, and a contained-drift
   alarm budget separately so cost-aware selection cannot hide quality loss.
6. Remaining gap: use Progress Sharpe beyond path selection, especially in
   ambition ratchet policy, daily-loop portfolio allocation, and any future
   provider-spend decisions.

Standing coaching rules:

- Proof-surface freeze: no new `prove:*` commands until the
  reality-fraction trend is visibly rising; every new proof must raise it,
  not just pass.
- Reality fraction belongs on the dashboard credibility board as a
  first-class trend.
- Pre-registered targets and third-party-reproducible scoring stay
  non-negotiable: the differentiation is "LFD with receipts" - descending
  loops that keep audit-grade evidence. Self-scored lift numbers without
  pre-registration are content for a tweet, not a claim.

## 6. Merged Priority Queue

Interleaving this doc with the LFD addendum backlog:

1. P0 shipped: Eval factory (LFD addendum), LFD goal format in
   `navigate compile`, Track 3 catalog-bridge, and Track 1
   research-bridge.
2. P1 shipped: stall-to-search forced entropy and the memorization alarm
   comparator.
3. P1 shipped: live provider-seat council on one real contested decision.
4. P1 shipped: Twin A/B v2 pre-registered held-out scorer proof.
   P1 remaining: agent-facing budget instruments.
5. P2 shipped: Track 2 creative-bridge as the second domain.
6. P2 shipped: Progress Sharpe as the path-selection criterion, with raw
   path-fit reported separately and the old baseline gate retuned to honest
   non-regression language.

The through-line: every item either adds real-world sensing under
governance, or makes the score harder to fool. Nothing on this list adds
proof surface without raising reality fraction.
