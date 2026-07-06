# Design Language and the Native Navigator App

Last updated: 2026-07-05
Companion to: `docs/COCKPIT_UX_AND_WIDE_EXPLORATION.md` (the 24-screen spec),
`docs/USE_CASES_AND_GOAL_PATTERNS.md`, `design/tokens.css`,
`design/mockups/`.
Canonical framing: `docs/VISION.md` defines the mission-optimizer product
language. This document defines the Navigator app's visual system and
self-build path under that doctrine.

This codifies the visual identity and build path for the native-feeling
macOS Navigator app: the mission-control surface above worker harnesses. It
is the north star for the self-build loop: the app is built by pointing our
own asset-clone / pixel-diff harness at these screens as targets and
descending until the rendered UI matches within tolerance.

## 1. The Feeling (product identity)

A high-tech cockpit that is calm, not busy. It should feel alive without
being noisy, powerful without being jargony. A first-time user should read
one card and understand what the system is doing and whether it is winning.
The five questions from the cockpit spec are always answerable at a glance:
what is it optimizing, what is it doing now, what evidence has it collected,
is it improving or fooling itself, what needs my approval.

Three adjectives to hold: alive, honest, effortless.

- Alive: subtle motion everywhere - pulsing run-dots, drawing-in path
  lines, filling meters, and shimmer on glass edges. Nothing
  spins pointlessly; every animation encodes a real state change.
- Honest: the visuals never oversell. Reality fraction, held-out lift, and
  "promoted vs. working" are first-class, colored truthfully. Green is
  earned, not decorative.
- Effortless: native macOS ergonomics - traffic-light chrome, vibrancy,
  SF-family type, generous spacing, keyboard-first. It should feel like an
  Apple app that happens to run an agent OS.

## 2. Visual Language

Codified as tokens in `design/tokens.css`. Highlights:

- Surfaces: deep near-black (#070a09 -> #0c1211) with warmth, never flat
  gray. Depth comes from layered translucency, not borders.
- Glass: translucent panels (rgba white .055-.09) with backdrop-blur ~18px,
  a hairline top-edge highlight (the shimmer gradient), and soft inset
  1px borders. This is the core material - sidebars, cards, inputs, meters.
- Accents: Playbasis teal (#2dd4bf) as primary, cyan (#22d3ee) as its
  gradient partner, violet (#a78bfa) for depth and secondary state, amber
  for budget/warnings, rose for risk/dissent. Two-ramp discipline: teal->cyan
  for progress, violet->cyan for governance/taste.
- Glow: accents emit controlled light through shadows, outlines, SVG orbital
  elements, and deterministic surface washes. Scoreability must not flatten the
  app; visual richness is now measured by a blind dashboard-style gate rather
  than forbidden outright.
- Ambient texture (the "elevation map / grid / globe" ask):
  - Topographic contour lines - faint teal curves drifting behind the main
    canvas, evoking an elevation/terrain map. Used at very low opacity so it
    reads as texture, not chart.
  - Abstract grid rules behind charts, near-invisible, for depth.
- Type: SF Pro Display / system-ui. Letter spacing stays at 0; tabular
  numerals are used on every metric so numbers don't jitter as they update.
- Radii: macOS-style window chrome can be softer, but framed content cards
  are kept compact at 8px so dense workflow screens stay disciplined.
- Chrome: real macOS window - 14px rounded corners, traffic lights, a
  centered vibrancy title bar.

## 3. Motion System

Every transition should feel physical (spring or ease-out), never linear.

- Screen transitions: shared-element - a mission card on Home expands into
  the full Live Cockpit (the card's glass frame morphs into the window's
  main panel). Use a 320ms spring; the sidebar stays fixed (native feel).
- Path fan: candidate lines draw in via stroke-dashoffset (~2.4s stagger);
  the realized trajectory draws bolder and glowing on top; nodes pop in as
  evidence arrives; the live node blips.
- Meters: fill from zero on mount via ease-out; when a value updates live it
  tweens, never jumps.
- Evidence stream: new events fade+rise in (translateY 6px), with a typing
  cursor on the streaming line so the system reads as thinking, not buffering.
- Aurora + orb: slow, continuous, low-amplitude drift/rotation (8-14s) for
  ambient life.
- Reduced motion: `prefers-reduced-motion` collapses all durations to 0
  (already in tokens). Alive must degrade gracefully.

## 4. Key Screens (build order, from the user flow)

Rendered north-star mockups exist for the first six screens under
`design/mockups/`. These are deterministic render/layout reference targets, not
the final definition of visual quality. The richer style target is a private
blend of the dark and light dashboard references under `visual_reference/`.
`architecture_diagram.png` is system structure only and is excluded from style
scoring.

1. Mission Command (Home) - glass sidebar, mission cards with live pulse +
   sparkline + three headline metrics (objective, reality, held-out/sharpe),
   topographic/grid texture, "+ New Mission." TARGET #01.
2. Goal Composer / Objective Function Builder - plain-English goal field with
   a live cursor, mission-type chips, a "missing instruments" amber callout,
   and the weighted objective sliders with a gameability guard. TARGET #02.
3. Path Fan Canvas - the signature visualization: faint fan of candidate
   strategies, glowing realized trajectory, envelope band, and a live
   re-weighting side panel. TARGET #03.
4. Live Mission Cockpit - streaming multi-agent reasoning in plain language,
   spend/reality/safety/budget meters, and an inline approval card. TARGET #04.
5. Evidence + Credibility (Reality Fraction Board) - chronological evidence
   ledger and the reality-fraction breakdown (runtime / held-out / web vs.
   fixture / model). TARGET #05.
6. Promotion Passport + Learning Distillation - the certification card and
   "what the system learned" panel. TARGET #06.

Screens 7-24 are specified in `docs/COCKPIT_UX_AND_WIDE_EXPLORATION.md` and
become later targets. The runnable shell at `apps/navigator-desktop/` renders
the first six screens from real report data where available.

## 5. The Premium Self-Build Loop

This is the point: the app should build itself through the same evidence-gated
loop, but the route must optimize for premium visual quality rather than only
for pixel conformance. The manual stunning pass exposed a process bug: the old
loop could satisfy calm deterministic targets while missing the luminous depth,
stateful gauges, and atmosphere that made the references valuable. That lesson
is now codified in `design/navigator-builder-process.json`.

The default route is `premium-blended-visual-route`:

1. Orient and restate the claim boundary.
2. Audit reference roles: dark and light dashboards are style references;
   `architecture_diagram.png` is system structure only.
3. Select the best route using Progress Sharpe plus blind visual quality.
4. Run design review before editing: name the screen family, visual mechanism,
   and expected failure.
5. Patch reusable visual mechanisms, not one screenshot.
6. Replay only the invalidated checkpoint: capture, pixel diagnostic, blind
   style score, then build.
7. Inspect the real browser render by eye; reject competent-but-not-stunning
   outcomes even if a self-score passes.
8. Run held-out/external/safety review.
9. Write the handover and next-route memory.

The harness remains governed:

- `pbos navigate compile "<screen goal>" --domain asset-clone` compiles a
  loss-function goal whose target is a rendered screen.
- `pbos eval-factory:asset-clone` generates the blinded held-out target
  set; targets live OUTSIDE the repo (e.g.
  `$PBOS_PRIVATE_EVAL_ROOT/...`) with hash-committed
  scorer commitments, so the coder cannot memorize the answer.
- `pbos navigate observe --kind image_create` / the render step produces a
  candidate screen; the pixel-diff scorer compares it to the target.
- `pbos navigate prove:asset-clone <goal.json> --commitment <...> --expected-diff-ratio 0.02`
  runs the arm, scores pixel similarity, and writes a proof with only hashes
  and safe metrics (no raw images committed).

Loss function for the app build has three visible layers:
`layout/render conformance` from deterministic rendered captures,
`blind blended visual quality` from `navigator-visual-quality-v1`, and
`human visual review` of the real browser render. Pixel diff against the old
calm targets is diagnostic when the app intentionally moves toward the richer
dashboard references. Quality promotion requires the process contract to pass,
the blind style gate to pass, and the raw/private artifacts to stay outside the
repo.

Pipeline discipline (same as every other domain):
- Pre-register the target hash before the build run.
- Held-out screen variants (different data states: empty, loading, error,
  dense) so the app generalizes to states, not one screenshot.
- Memorization alarm: if pixel match on the visible target rises while
  held-out states stay broken, force removal of a target-shaped shortcut.
- Process alarm: if a cycle skips design review or human visual review, the
  cycle is not eligible for promotion even when the self-scored visual gate
  passes.

## 6. Recommended Tech Stack (for the native feel)

Two viable paths; pick per priority:

- Tauri + React + CSS (recommended): true native macOS window, small binary,
  real vibrancy via `NSVisualEffectView` (window `transparent` + `vibrancy`),
  web rendering for the glass/motion. Best blend of native chrome + web
  animation fidelity, and the pixel-diff loop scores the webview directly.
- SwiftUI (most native): best window/vibrancy/gesture fidelity, but the
  self-build pixel-diff loop is harder to drive from our TS harness and the
  glass/motion tokens must be re-expressed in Swift. Choose only if native
  purity outranks self-build velocity.

Either way: tokens in `design/tokens.css` are the contract; a SwiftUI build
would mirror them as a Swift token file.

## 7. Guardrails Specific to the App

- No dark patterns: approval cards state risk-if-approved AND risk-if-denied.
- Truthful color: green only for earned/promoted/passing; never decorative.
- Every metric shown must trace to a real evidence source; no vanity numbers.
- Raw screenshots and any private target images stay out of git (same zero-leak
  rule); commit only reference mockups we authored and hashes.
- Accessibility is a gate, not a nicety: focus-visible, sr-only summaries,
  reduced-motion, and contrast are part of the loss function.

## 8. Handover: task Codex to build it

Paste the goal in `design/HANDOVER_GOAL.md` into Codex. It compiles the app
build as a Navigator asset-clone mission, then forces the premium builder
process in `design/navigator-builder-process.json`: route selection, design
review, implementation, replay, real-browser human visual review, held-out
state review, safety review, and handover memory. Pixel diff stays useful for
layout, but the promotion path now requires the blind blended style gate and a
human verdict that the rendered app is genuinely premium.

## 9. Current App Shell

The first implementation is dependency-free and webview-ready:

- `apps/navigator-desktop/index.html`
- `apps/navigator-desktop/src/styles.css`
- `apps/navigator-desktop/src/app.js`
- `scripts/build-navigator-app-data.mjs`

Run `pnpm navigator:build` to generate
`apps/navigator-desktop/public/navigator-data.json` from
`reports/run-warehouse/summary.json` and
`reports/agent-os-sandbox-data.json`. The script also reads the Navigator
app self-build proof artifacts produced by:

```bash
pnpm pbos navigate compile "Make the Playbasis Navigator desktop app match six balanced dark and light reference targets while preserving zero-leak evidence boundaries" --domain asset-clone --out goals/navigator-app/goal.json
pnpm pbos navigate fan goals/navigator-app/goal.json --paths 20 --out goals/navigator-app/path-fan.json
pnpm pbos eval-factory:asset-clone --family navigator-app-ui-heldout-v1 --cases 240 --train-cases 80 --train-out eval-families/navigator-app-ui/train/manifest.json --heldout-commit-out eval-families/navigator-app-ui/scorer-commitments/heldout-v1.commitment.json --private-heldout-out $PBOS_PRIVATE_EVAL_ROOT/navigator-app-ui-heldout-v1 --report-out reports/eval-factory/navigator-app-ui-eval-family-report.json
pnpm pbos navigate prove:asset-clone goals/navigator-app/goal.json --fan goals/navigator-app/path-fan.json --commitment eval-families/navigator-app-ui/scorer-commitments/heldout-v1.commitment.json --private-heldout $PBOS_PRIVATE_EVAL_ROOT/navigator-app-ui-heldout-v1 --expected-diff-ratio 0.02 --profile fixture
```

`reports/navigator-app/build-report.json` now includes target/source hashes,
zero forbidden hits, the `proof-passed` self-build status, and a safe browser
check summary when `reports/navigator-app/browser-check.json` exists. The
browser check stores no screenshots or raw screenshot bytes; it records only
viewport dimensions, overflow counts, screen-walk status, console status, and
acceptance gates.

The current rendered-pixel proof path is:

1. Capture and score the committed six-screen training suite:

```bash
pnpm navigator:rendered:capture -- --suite training
pnpm navigator:rendered-pixel:score -- --suite training
```

2. Capture and score unseen state variants from the private evaluator store:

```bash
pnpm navigator:rendered:capture -- --suite heldOut
pnpm navigator:rendered-pixel:score -- --suite heldOut
```

3. Capture and score the private raster smoke target:

```bash
pnpm navigator:rendered:capture -- --suite external
pnpm navigator:rendered-pixel:score -- --suite external --allow-failing
```

The capture CLI uses pinned Playwright Chromium, fixed viewport/DPR, and a
bundled Inter webfont. The scorer uses ImageMagick, gates training and held-out
on fuzzed AE plus RMSE, keeps zero-fuzz AE diagnostic-only, and writes only
hashes, dimensions, byte counts, render-environment metadata, and aggregate
metrics. Raw screenshots, held-out fixture bodies, and external target PNGs stay
under `$PBOS_PRIVATE_EVAL_ROOT/`.

Current measured state: Cycle 041 preserved the original six-screen baseline
conformance proof. Cycle 042 adds manifest-driven training/held-out/external
scoring. Cycle 043 adds blind blended visual-quality scoring and replay advice.
Cycle 044 codifies the manual stunning pass into a validated premium builder
process. Training visual quality now passes against the private dark+light
dashboard profile; the old calm pixel target is retained as a render diagnostic,
not a beauty claim. See `reports/navigator/app-build-log.md`,
`docs/NAVIGATOR_BLENDED_VISUAL_HANDOVER.md`, and
`docs/NAVIGATOR_STUNNING_VISUALS_HANDOVER.md`.

This does not replace the Tauri wrapper goal; it is the deterministic webview
surface that Tauri should wrap. It also does not yet implement CI pixel-diff
scoring without the browser automation capture step. That is the next proof
increment.
