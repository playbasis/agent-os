# Navigator Blended Visual Proof Handover

Last updated: 2026-07-05
Canonical framing: `docs/VISION.md` defines the Navigator mission-optimizer
doctrine; this handover records one visual-proof pass and should not override
the broader product or claim boundary.

## What the Previous Work Lacked

The prior Navigator visual proof was strong on deterministic rendering but weak
on design ambition. It optimized toward a calm self-authored pixel target, so
the exact-pixel loss rewarded flat, low-saturation, low-risk UI. That proved
browser conformance, not premium visual quality.

The missing distinction was reference role:

- `architecture_diagram.png` is a system and workflow reference only.
- The four dark dashboard images and four light dashboard images are the visual
  style references.
- The goal is a blended app direction, not a copy of either group.

## What Changed

- Added `navigator-visual-quality-v1`, a blind visual-quality eval family for
  image-to-app workflows.
- Built a private blended style profile from 8 dashboard references while
  excluding the architecture diagram from style scoring.
- Public reports expose hashes, role counts, aggregate score, gate names, and
  replay advice only. Target feature bands and reference feature vectors stay
  private under `$PBOS_PRIVATE_EVAL_ROOT/`.
- Added a replay ledger so failed gates resume from the invalidated artifact
  instead of restarting the proof.
- Upgraded Mission Command toward the dark dashboard cockpit reference:
  luminous mission hero, globe, command input, telemetry rail, multi-hue cards.
- Upgraded Path Fan with architecture-derived structure: staged process strip,
  learn-compound loop, richer multi-path fan.
- Added light-dashboard influence to held-out state styling through cleaner,
  brighter panels and readable state surfaces.

## Current Measured State

- Training visual quality: pass, blind style score `1.0000`.
- Training rendered capture: complete and dimension-matched.
- Training old pixel target: scored as a diagnostic, not a quality gate.
- Held-out rendered pixels: pass across 24 private state fixtures.
- Held-out visual quality: scored but not required yet; last score was near
  threshold and includes replay advice.
- Build report: `blindVisualStyleStatus: pass`.

## How to Continue

Use checkpoint replay:

```bash
pnpm navigator:visual-quality:profile
pnpm navigator:rendered:capture -- --suite training
pnpm navigator:rendered-pixel:score -- --suite training --allow-failing
pnpm navigator:visual-quality:score -- --suite training --allow-failing
pnpm navigator:build
```

Only rerun the profile when references or blend policy change. If app/CSS
changes, replay from rendered capture. If only reporting changes, replay from
`navigator:build`.

Next improvement should make held-out visual quality required after the private
held-out style fixtures stabilize. Do not tune to one screenshot; patch toward
the failing blind signals and preserve role separation between system and style
references.
