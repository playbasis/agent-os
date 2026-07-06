# Navigator Stunning-Visuals Pass — Handover

Last updated: 2026-07-05
Scope: a design/styling/visual pass on `apps/navigator-desktop`, focused on
closing the gap between the app and the lush dashboard reference
(`visual_reference/ChatGPT Image ...10_55_19.png`). Verified by eye in the
live browser, not by self-scored numbers.
Canonical framing: `docs/VISION.md` defines the Navigator mission-optimizer
doctrine; this handover records a proof-specific visual-quality pass.

## What the prior work lacked

The delegated build got the structure right (System Pulse rail, globe
placement, colored sparklines) but stopped at "competent dark dashboard,"
not "stunning." Three concrete reasons, all fixable in CSS/markup:

1. The gauges were dull because of a bug: `.pulse-ring { color: var(--ink) }`
   overrode the per-tone color, so every ring rendered as a flat WHITE
   `4px solid` border. They were not even colored, let alone glowing, and
   they showed no progress arc.
2. The globe was a faint, flat wireframe (thin `rgba(191,219,254,.64)`
   strokes, `fill:none`). No lit sphere, no bright limb, no orbital ring, no
   halo — so the reference's signature "glowing planet" read as a grey
   doodle.
3. There was no atmospheric depth. Flat surfaces, no aurora bloom, no glow
   behind the hero. The reference's luminosity comes from layered radial
   light; the app had none.

Root cause (documented in `DESIGN_LANGUAGE_AND_NATIVE_APP.md` line ~49 and
enforced by a unit test): the pipeline had been optimizing toward "calm and
scoreable." A test literally asserted `appCss.not.toContain("radial-gradient")`
— it fenced OUT the exact treatment that makes the reference beautiful. You
cannot pixel-diff your way to stunning against a calm target, and you cannot
unit-test your way to beauty by banning gradients.

## What I changed

All edits in `apps/navigator-desktop/src/{app.js,styles.css}` +
`index.html`, plus one test:

- **Gauges → glowing conic progress arcs.** Removed the ink override; the
  ring now uses `conic-gradient(currentColor 0 var(--pct)%, faint track)`
  in the true tone color (green/violet/cyan/amber/blue), a dark inner disc
  for the donut, an inner glow, and an outer color glow. `pulseMetric` now
  passes a real percentage per metric (87/92/72/58/76).
- **Globe → luminous lit sphere.** Rebuilt the SVG: a radial `orbCore`
  gradient (bright cyan-white highlight offset up-left → deep blue edge), a
  bright `orb-limb` rim, six meridian/parallel ellipses with a soft glow, a
  tilted gradient orbital ring with a bright traveler dot, a pulsing halo,
  and twinkling stars. Strong multi-layer `drop-shadow` glow.
- **Atmosphere.** Added three aurora radial glows to the mission window
  background (blue top-right, teal bottom-left, violet right) and a soft
  radial bloom behind the globe in the hero.
- **Motion, accessibility-safe.** Halo pulse + star twinkle, both collapsed
  under `prefers-reduced-motion`.
- **Flipped the anti-stunning test.** `tests/navigator-app.test.ts` now
  asserts the rich treatment IS present (`conic-gradient`, `radial-gradient`,
  `drop-shadow`) plus the reduced-motion guard, instead of banning gradients.
- **Cache-bust.** `index.html` loads `src/app.js?v=2` (the static dev server
  aggressively cached the ES module, hiding markup edits). Bump the version
  when editing `app.js` during dev, or add no-cache headers to
  `navigator:serve`.

Result: the Mission Command hero now reads in the same tier as the lush
reference — luminous globe, glowing tone-colored gauges, atmospheric depth.
Verified live in the browser at 1240×800. `pnpm typecheck` clean;
`pnpm test` 72/72 green.

## How this is now codified

The manual patch is no longer just a memory in this note. The builder process
is codified in `design/navigator-builder-process.json` and validated by
`pnpm navigator:process:validate`. `pnpm navigator:build` now runs that
validator first and writes the safe process summary into
`apps/navigator-desktop/public/navigator-data.json` and
`reports/navigator-app/build-report.json`.

The enforced default route is `premium-blended-visual-route`. It requires
reference role audit, best-route selection, design review before editing, real
browser human visual review after rendering, blind style scoring, held-out
state review, safety review, and handover memory. It explicitly prohibits the
routes that caused this miss: pixel-diff-only, calm-scoreable-only,
single-screen-hero-only, architecture-as-style-reference, and
self-scored-visual-quality-only.

## Honest boundary

I elevated the **Mission Command** hero screen — the one directly compared to
the reference. Screens 02–06 got a broad restyle from the delegated session
(the Path Fan already shows a colored converging fan and its earlier
right-panel clipping is fixed) but they have NOT received the same
glow/gauge/atmosphere pass. They are good, not yet stunning.

## How to improve going forward

1. **Put beauty in the loss, or judge it by eye — never fence it out.** The
   blind visual-quality profile (saturation, accent coverage, hue entropy,
   depth) should be the real quality gate and should PULL UP; keep
   pixel-diff as a layout diagnostic only (the delegated session already
   started this decoupling — finish it). Delete any remaining "no gradient /
   no negative letter-spacing" fences; they encode flatness.
2. **Verify visually every cycle.** A self-scored `1.0000` visual number is
   the same self-grading trap flagged elsewhere in this repo. Screenshot the
   real render and look at it. My whole judgment here came from the browser,
   not a metric.
3. **Elevate 02–06 to the hero's tier:** give Live Cockpit real glowing
   meters, Evidence/Credibility a luminous reality-fraction gauge, and
   Promotion Passport a certificate-grade seal with depth. Reuse the
   `.pulse-ring` conic pattern and the `orb-*` glow recipe.
4. **Premium typography:** allow slight negative letter-spacing on large
   hero headings (currently discouraged) — it reads as polish, not noise.
5. **Motion as life, deterministic for scoring:** freeze animations at a
   fixed frame for pixel captures, but keep the halo pulse, gauge fill, and
   sparkline draw-in live in the app.

The one-line lesson: the previous loop converged to calm-and-scoreable
because that is what its instruments rewarded. Stunning came from changing
what we optimize/allow — and from a human looking at the screen.
