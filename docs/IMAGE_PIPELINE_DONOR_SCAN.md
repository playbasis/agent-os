# GPT5 Image Pipeline Donor Scan

Date: 2026-07-06
Scope: disk review of the local GPT-image pipeline POC for reusable image
generation, visual evaluation, benchmark, and edit-surface patterns.
Canonical framing: `docs/VISION.md`, `docs/ROBUST_PROOF_PROTOCOL.md`, and
`docs/CAPABILITY_BRIDGES_SEARCH_RESEARCH_IMAGE.md` define the proof and
clean-room boundary for turning donor ideas into governed image capability.

Public-repo note: the code this document describes lives in
`packages/donor-primitives` and `packages/cli` in the private harness.
Neither package is part of this public repo's exported package set (see
`README.md`), so this document is architecture/process documentation of
internal capability, not a pointer to code present in this checkout.

## Search Surface

Reviewed donor files under `../playbasis-platform/poc/gpt5-image-pipeline/`:

- `server.mjs`
- `scripts/lint-live-canvas-text-fit.mjs`
- `benchmarks.json`
- `docs/rfs-menu-photoshoot-poc.md`
- `docs/rfs-menu-photoshoot-poc-goal.md`
- `docs/episode-v2-azure-blob-sop.md`

This repo remains the implementation target. Donor code is reference material
only. Do not import, vendor, or copy POC modules into this repo. Port only
interfaces, evaluation shapes, prompt discipline, and artifact-boundary rules
after rewriting them in this codebase's style.

## Donor Candidates

| Donor file | Useful pattern | Decision |
|---|---|---|
| `server.mjs` | GPT-image-2 generation and edit calls, multi-stage route/spec/generate/evaluate/rank/refine loop, retry/backoff, manifest persistence, hash-based layout-analysis cache | Reference only for architecture. Rebuild any adopted bridge as clean TypeScript inside this repo's provider/evidence surfaces. |
| `server.mjs` | Quality rubric with alignment, realism, composition, artifact severity, strengths, issues, improved prompt, and confidence | Good candidate for image-create evidence summaries and visual-quality reports. Keep scores aggregate and source-grounded. |
| `server.mjs` | Bounding-box taxonomy: required object, strength, defect, text, composition, context, using normalized image coordinates | Good candidate for future visual evidence overlays. Store boxes as metadata, not pixels. |
| `server.mjs` | Layout-zone schema for subject, logo, headline, subheadline, CTA, safe empty area, avoid, and background-interest zones | Useful for editable marketing/dashboard surfaces and reference-image-to-layout workflows. Keep as schema ideas, not donor code. |
| `server.mjs` | Pairwise selection with forward and reverse image order to detect position bias, then combined agreement/confidence | Strong pattern for visual promotion gates. Adopt only after proof artifacts distinguish winning reasons from rejected-candidate defects. |
| `server.mjs` | Refinement prompt that preserves core intent and successful traits while targeting the highest-impact visible issues | Useful for Prompt Twin and image-asset repair loops. Must be regenerated from local evidence, not pasted from donor prompts. |
| `server.mjs` | Retry/backoff wrapper honoring retryable HTTP status codes and `Retry-After`, with jitter and retry telemetry | Reusable reliability pattern for provider bridges. Public artifacts should keep retry counts/wait summaries, not provider payloads. |
| `benchmarks.json` | Taxonomy-driven benchmark set with audience, vertical, surface, difficulty, defaults, and templated cases | Useful for an image eval-family shape. Public repo should keep manifests, commitments, hashes, and aggregate results only. |
| `scripts/lint-live-canvas-text-fit.mjs` | Browser-based SVG text-fit lint using Playwright and `getBBox()` against declared text boxes | Good fit for dashboard/Navigator visual gates because it checks real browser layout rather than estimated text width. |
| `docs/rfs-menu-photoshoot-poc*.md` | Production photoshoot workflow: source-backed items, venue visual systems, prompt-style experiments, pilot batches, review statuses, final manifest, and retry notes | Useful operating discipline. Do not reuse source photos or generated donor images. References are factual grounding only. |
| `docs/episode-v2-azure-blob-sop.md` | Static bundle publication SOP with local QA, dry-run/upload separation, credential handling, content-type checks, and rollback notes | Useful for future public artifact publishing. Keep secrets and operator credentials outside generated bundles. |

## Useful Patterns To Port

- **GPT-image-2 reference generation:** keep base image generation and reference
  image edits behind an explicit provider bridge. The donor uses text-free base
  images plus editable overlays as the safer default; reference images are
  inputs for grounding or edits, not public artifacts.
- **Quality rubric:** score visible output on alignment, realism, composition,
  and artifacts, then record strengths, issues, improvement directions,
  improved prompt, and confidence. This is more useful than a single beauty
  score because it gives the repair loop concrete causes.
- **Bounding-box taxonomy:** classify visible evidence boxes as required
  objects, strengths, defects, text regions, composition anchors, or context.
  Coordinates should be normalized and bounded, with confidence and notes.
- **Layout-zone schema:** separate subject/avoid zones from headline,
  subheadline, logo, CTA, and safe empty areas. This supports image-to-editable
  layout workflows without asking an image model to burn in text.
- **Pairwise selection:** compare top candidates in both image orders, combine
  agreement, and carry winning/losing reasons separately. This reduces position
  bias and prevents rejected-candidate defects from being misattributed to the
  selected image.
- **Refinement prompt:** refine only from observed issues and selected-candidate
  evidence. Preserve the original intent and successful traits; avoid unbounded
  prompt drift after every iteration.
- **Retry/backoff:** treat 408, 409, 423, 425, 429, and 5xx responses as
  retryable; respect `Retry-After`; emit retry count and wait-time metrics.
- **Benchmark config:** define eval families by taxonomy axes, default run
  settings, and templated cases. Keep simple sanity cases, baseline cases,
  stress cases, and adversarial text-fidelity cases separate.
- **Browser text-fit lint:** use a real browser to load saved SVG/canvas
  designs, call `getBBox()` for text nodes, and compare rendered bounds against
  declared fit boxes with a small overflow tolerance.

## Evidence Dashboard Edit Surface

The image donor scan is relevant to the evidence dashboard only as design and
proof inspiration. The dashboard artifact itself is generated by
`pbos evidence-dashboard improve`.

Allowed edit surface for dashboard changes:

- generator code, dashboard prompt text, and runner/orchestration code,
  including source-data selection and browser-check logic;
- CLI command wiring for the dashboard harness;
- docs that describe the harness, generated artifacts, and operating boundary.

Output-only surfaces:

- `reports/evidence-improvement-report.html`
- `reports/evidence-improvement-report-screenshot.png`
- `reports/evidence-improvement-report-mobile-screenshot.png`
- `reports/snapshots/*`

If any dashboard report, screenshot, trace, or snapshot needs to change, update
the harness first and regenerate it with `pbos evidence-dashboard improve`.

## Clean-Room / OSS Boundary

Public-safe to adopt:

- Schema ideas for routing, scoring, boxes, layout zones, and benchmark axes.
- Provider-neutral state machines for generate/evaluate/rank/refine loops.
- Retry/backoff policy shape and aggregate retry metrics.
- Hash-only references to images, prompts, provider deployments, and generated
  artifacts.
- Image dimensions, MIME type labels, normalized boxes, aggregate scores, and
  public-safe manifests.

Excluded from this repo and public OSS artifacts:

- Direct imports, vendored files, copied functions, or pasted prompts from the
  donor POC.
- Raw generated images from the donor POC.
- Raw source/reference photos, screenshots, masks, target pixels, or private
  target grids.
- Raw provider request bodies, responses, `b64_json`, base64 image payloads,
  OCR payloads, or private URLs.
- API keys, endpoints, deployment values, Azure resource credentials, and
  operator env files.
- Private menu/source research bodies beyond public-safe summaries, hashes, and
  source labels.

Adoption rule: for image/provider references, public artifacts store hashes and
dimensions only. They may also store derived non-pixel metadata such as MIME
labels, normalized layout/box metadata, aggregate scores, and redacted
usage/retry metrics. They must not store raw images or provider payloads.

## Clean-Room Port Status: Critique-Driven Variant Generation (2026-07-07)

The primitives above sanitize/validate a refinement plan that is assumed to
already exist (e.g., from a future live vision-model call). This addendum
closes the other half: a working, deterministic generator that computes a
critique from this repo's own metrics and produces a genuinely new design
variant from it today, with no live vision-model call required.

- Added `packages/cli/src/image-critique.ts`: `critiqueDesignVariant` compares
  the leading candidate's `VisualFeatureSet` against the real GPT-image-2
  reference's features (both already computed by the existing
  `scoreVisualTarget` pipeline), flags actionable dimensions (dark-depth,
  saturation/accent-coverage, hue-entropy) versus non-actionable ones
  (edge-density, contrast-spread, luminance, light-surface), and
  `generateRefinedVariant` applies targeted HSL token adjustments to produce
  one new variant — not one of the fixed named templates.
- Wired into `improveEvidenceDashboard`: the generated variant is rendered and
  scored through the same real Playwright pipeline as the fixed variants, then
  fairly compared against all of them via a refactored `applyPromotionDecisions`
  (previously `scoreDesignVariants` marked its own single-batch winner, which
  would have let a separately-scored generated variant win by default rather
  than on merit).
- Added `--reuse-reference <path>` to `pbos evidence-dashboard improve` so this
  loop, and this port's verification, do not require a new paid GPT-image-2
  call every run.
- Verified end-to-end at zero additional cost using the real reference image
  from mission `20260706T140102Z`: mission
  `reports/evidence-dashboard-redesign-mission-20260707T023900Z.json` shows 7
  `candidateDirections` (6 fixed + `generated-critique-1`), a populated
  `critiqueDrivenGeneration` block with a real detected issue
  (`meanSaturation` off by `0.101` from the live reference, `major`,
  `actionable`), the resulting token adjustments, and a fair (non-automatic-win)
  comparison against the incumbent `launch-proof-sheet`.
- Added `tests/image-critique.test.ts` (5 tests, deterministic, no I/O).

Not covered by this addendum: the bounding-box/layout-zone primitives already
ported into `packages/donor-primitives` are region-level and would need a
live vision-model call this generator does not make; this remains the
donor-primitives module's documented future work, not duplicated here.

## Clean-Room Port Status

Completed in this repo:

- `packages/donor-primitives/src/index.ts` now exposes clean-room image-analysis
  primitives for weighted visual-quality scoring, normalized boxes, layout
  zones, pairwise order-bias normalization, refinement-plan sanitization, and
  text-fit issue summaries.
- `tests/image-analysis-primitives.test.ts` covers the clean-room primitives and
  public-safe manifest/schema contracts.
- `schemas/image/image-create-evidence.schema.json` defines the repo-native
  image-create evidence shape: prompt/request hashes, provider status, generated
  image hash/dimensions, quality rubric, normalized boxes/zones, pairwise
  evidence, refinement plan, and hard exclusions for raw provider payloads and
  raw image bytes.
- `eval-families/image-generation-v1/manifest.json` mirrors the donor benchmark
  taxonomy at the plan level without copying donor cases or assets. It defines
  public-safe cases for evidence-dashboard references, screenshot-to-frontend
  work, safe-text editable graphics, and adversarial text-fit reports.
- The evidence-dashboard browser checks now use the clean-room text-fit summary
  as a render gate, alongside console, overflow, offscreen, source-data, leak,
  generated-not-hand-edited, and visual-reference gates.

Live reference status:

- `ProviderBridge.imageCreate()` now supports the same clean-room fallback used
  by the platform image tools: if image-specific Azure OpenAI env keys are not
  present, the bridge can use the general Playbasis Azure OpenAI endpoint/key and
  the default `gpt-image-2` deployment. Provider calls still require
  `PBOS_ALLOW_PROVIDER_CALLS=1`, and public artifacts still record only safe
  metadata.
- A manual env-remap probe first proved the live path with a private PNG outside
  the repo:
  `reports/navigator/evidence-dashboard-live-image-reference-probe-20260706T170200Z.json`
  records hash
  `f0a82ac991066c39475a2bba50c272af5ec6f76c728dce4b84867caca4d4f7a3`,
  908212 bytes, and dimensions `1792x1024`.
- The reproducible no-shim fallback probe is
  `reports/navigator/evidence-dashboard-live-image-reference-fallback-probe-20260706T201700Z.json`.
  It records hash
  `6aaf38dc2211df58c8bf27652c0585419262eefadde758f0aab4523b21feae4e`,
  435478 bytes, dimensions `1024x1024`, `configured: true`,
  `callsEnabled: true`, and `deploymentKey: "default:gpt-image-2"`.
- The raw PNGs remain under a private eval root outside this repository,
  matching the same boundary used by `navigator-rendered-ui-v2` and other
  held-out families. Public reports do not include raw prompts, raw request
  bodies, raw response bodies, private paths, image bytes, base64 payloads,
  endpoints, or env values.
- The dashboard report and snapshots remain output-only; improve them through
  `pbos evidence-dashboard improve`, not direct report edits.
