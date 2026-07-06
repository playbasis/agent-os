# Operator Twin and Screenshot-to-Frontend Product Request

Last updated: 2026-07-06

Status: target product lane. This is not a current capability claim. It
translates the user's intended product into measurable artifacts, evidence
requirements, and build phases.

## Product Request

Build an Operator Twin that can take over more of the user's current HITL
role when driving coding agents.

The product should accept a goal, repo state, relevant local donor knowledge,
and optionally one or more screenshots. It should produce a completed software
change, with proof that the change is good enough to keep.

The most important first vertical is:

```text
Screenshot + request
-> frontend implementation plan
-> worker coding quests
-> code changes
-> rendered browser captures
-> visual, functional, accessibility, and safety scores
-> promotion passport or clear failure report
```

In plain product terms: the user should be able to hand the system a picture
of a desired UI and ask it to build the real frontend until it is at least as
good as the reference, without personally steering every Codex turn.

## The Artifact Being Improved

For this lane, the artifact is not just a report and not just a model answer.

The promoted artifact is a working frontend implementation:

- source code changes
- design-system or component changes
- generated or reused assets
- responsive states
- rendered screenshots stored outside the repo
- a proof pack with hashes, scores, tests, review notes, and rollback notes

The proof pack is the wrapper. The frontend implementation is the thing being
improved.

For the self-improvement version, the artifact is the Navigator app itself:
the harness uses its own visual loop, proof dashboard, and Prompt Twin review
to improve the product that operates the harness.

## Current Evidence

The repo already has useful pieces of this product, but they are bounded.

| Piece | Current evidence | Honest boundary |
| --- | --- | --- |
| Evidence harness | Run warehouse and sandbox reports show indexed runs, traces, artifacts, evals, promotion decisions, and redaction checks. | Proves the workbench can record and score attempts, not that it can replace the user. |
| Prompt Twin | Prompt Twin A/B artifacts show a twin-steered Flappy repair arm beating a control arm on a narrow held-out task. | Proves a narrow steering/judgment pattern, not a general user clone for arbitrary Codex work. |
| Visual loop | Navigator scripts can capture rendered UI, score pixel diffs, score blind visual-quality signals, and produce safe public reports. | Proves visual diagnostics and fixture-style scoring, not general screenshot-to-app automation. |
| Self-build direction | Navigator app docs and reports define a self-build route with rendered captures, visual-quality reports, and a builder-process gate. | Current app is a static HTML/JS/CSS shell, not the requested native Tauri/React app. |
| Donor reuse | Donor registry and donor-primitives packages preserve reusable ideas from local donor files. | There is no complete automatic donor-file retriever that selects the best files for each coding quest. |

Current local evidence supports the claim:

```text
The repo can run and record governed attempts with proof artifacts, and it
has narrow Prompt Twin and visual UI proof loops.
```

It does not support the stronger claim:

```text
The repo can already replace the user as the Codex driver or build arbitrary
frontends from screenshots end to end.
```

## Product Requirements

### 1. Operator Twin Manager

The Operator Twin Manager turns the user's role into a repeatable control
loop.

Inputs:

- user goal
- repo status and available commands
- screenshot or visual references when present
- relevant donor files and prior successful runs
- budget, approval, and safety policy

Outputs:

- a worker quest packet with exact task scope
- donor/context bundle used to brief the worker
- allowed and forbidden edits
- success metrics and stop conditions
- review decision: promote, continue, ask user, or block
- evidence explaining the decision

Acceptance gate:

```text
Given a bounded coding task, the manager can run at least one complete
worker loop without user steering, produce a code diff, run verification,
review the result using evidence, and either promote or continue with a
specific next quest.
```

### 2. Screenshot-to-Frontend Builder

The screenshot builder turns image references into measurable frontend work.

Inputs:

- one or more private screenshots
- target viewport and device constraints
- product intent and interaction requirements
- existing app/design-system context

Outputs:

- target manifest with hashes and viewport metadata
- implementation branch or patch
- real rendered captures from the app, not only mockups
- pixel/layout score
- blind style score
- accessibility and responsive checks
- human or Prompt Twin visual review
- promotion passport

Acceptance gate:

```text
Given one screenshot and a target route, the system builds or modifies a
real frontend screen, captures it in a browser, scores it against the target,
fixes at least one failed visual signal, and records the before/after proof.
```

"As good or superior" must be measured. The first version should define it as:

- below the declared visual mismatch threshold
- no responsive overflow at required viewports
- no accessibility regressions
- passes private style/taste review
- improves or preserves component reuse
- tests/build pass

### 3. Donor-Grounded Context Selection

The product must retrieve useful local knowledge instead of relying on one
large undifferentiated prompt.

Required behavior:

- index donor files, prior run artifacts, design docs, and code examples
- select a small cited context pack for the task
- explain why each donor/source was included
- exclude private/raw data from public proof artifacts
- record source hashes, not raw private payloads
- include clean-room donor-derived hints from the donor registry and
  Playbasis primitive map when those reports are present

Acceptance gate:

```text
For a screenshot-to-frontend task, the system attaches a donor/context pack
that includes the relevant design tokens, visual-process rules, app files,
prior failed visual signals, and any reusable donor primitive used by the
worker.
```

### 4. Self-Improvement Loop

The system should use the same lane on itself.

Required behavior:

- Navigator generates its own improvement mission
- Operator Twin compiles worker quests
- worker changes Navigator app/code/docs
- visual and functional gates replay
- winning deltas are stored as reusable memory
- failed deltas become negative examples

Acceptance gate:

```text
A Navigator self-improvement cycle changes the Navigator app or harness,
shows a measured before/after improvement on a pre-registered target, and
stores the lesson for a later cycle to consume.
```

## Missing Capabilities

These are the main gaps between the current repo and the requested product:

1. No general worker-driver adapter that can run Codex-like coding loops from
   a quest packet and inspect the resulting diff.
2. No complete donor/context retriever that chooses the most relevant local
   files for each task and records why.
3. No first-class screenshot ingestion command that creates a frontend mission
   from arbitrary image input.
4. No general visual repair loop that patches app code repeatedly until the
   screenshot target and held-out states pass.
5. No reliable "better than screenshot" metric without a declared target
   threshold, private taste gate, and human or Prompt Twin review.
6. No durable memory consumer that proves later cycles reuse earlier lessons.
7. No native Tauri/React Navigator app yet; the current Navigator shell is
   static HTML/JS/CSS.

## Build Plan

### Phase 1 - Product Gate

Add a mission type for `screenshot_frontend_build` with required fields:
target image metadata, route, viewport set, app path, allowed files,
forbidden files, verification commands, and promotion thresholds.

Current seed artifacts:

- `schemas/operator-twin/screenshot-frontend-mission.schema.json`
- `examples/operator-twin-screenshot-frontend/mission.json`
- `pbos operator-twin init-screenshot --image /path/outside/repo/screenshot.png --out goals/operator-twin/<id>/mission.json --objective "..." --route /app/route`
- `pbos operator-twin context-pack examples/operator-twin-screenshot-frontend/mission.json`

### Phase 2 - Context Pack

Add a context-pack generator that collects:

- current app files
- design tokens
- visual process docs
- relevant prior Navigator reports
- donor-primitives references, donor registry candidates, and Playbasis
  primitive hints
- failing visual signals

The pack should be hash-addressed and small enough to brief a worker. Current
`context-pack` output includes hash-only donor context from
`reports/donor-port-registry.json` and
`reports/playbasis-primitive-leverage-map.json`: selected candidate labels,
source hashes, capabilities, relevance reasons, and loop-role hints. It does
not include donor file bodies, private screenshot bytes, private target pixels,
or raw private payloads.

### Phase 3 - Worker Quest Packet

Generate a worker-facing task packet:

- exact edit target
- target image hash and safe description
- visual/fidelity bar
- donor/context hints by source hash, capability, and relevance reason
- commands to run
- failure evidence from the previous cycle
- stop/escalation criteria

Current seed command:

- `pbos operator-twin inspect-attempt <mission.json> --context-pack <context-pack.json> [--changed-file <path>]`
- `pbos operator-twin dispatch-quest <mission.json> --context-pack <context-pack.json> --review-passport <review-passport.json> [--attempt-report <attempt-report.json>]`
- `pbos operator-twin run-worker <worker-quest.json> [--execute --worker-command <cmd> --worker-arg <arg>]`
- `pbos operator-twin cycle <mission.json> --context-pack <context-pack.json> --worker-run <worker-run.json> --rendered-report <rendered.json> --visual-report <visual.json> --browser-report <browser.json> --leak-report <leak.json> --test-status pass|fail --review-decision promote|continue|blocked [--changed-file <path>]`

`run-worker` is a gated worker-adapter seam, not autonomous magic. By default
it writes a queued run request without executing anything. Execution requires
both `--execute` and `PBOS_ALLOW_OPERATOR_TWIN_WORKER_EXEC=1`; the worker
prompt, stdout, stderr, and command args are recorded by hash and byte count,
not by raw body.

`cycle` is the first loop-closure command. It consumes the worker-run report,
changed-file scope, rendered evidence, visual-quality evidence, browser route
verification, leak scan, test status, and reviewer decision, then writes one
cycle report with attempt scope gates, review gates, decision, and next bounded
quest. It reports `waiting-for-worker` when the worker-run is only queued or
dry-run.

### Phase 4 - Render and Score

Reuse the existing Navigator capture and visual-quality tools, but generalize
them so any app route can be scored against a private screenshot target.

### Phase 5 - Review and Continue

Add the Operator Twin review step:

- inspect diff, test output, visual reports, and safety scan
- decide promote, continue, or ask user
- if continue, write the next quest from the failure evidence

Current seed command:

- `pbos operator-twin review <mission.json> --context-pack <context-pack.json> --rendered-report <rendered.json> --visual-report <visual.json> --browser-report <browser.json> --leak-report <leak.json> --test-status pass|fail --review-decision promote|continue|blocked`
- `pbos operator-twin dispatch-quest <mission.json> --context-pack <context-pack.json> --review-passport <review-passport.json> --attempt-report <attempt-report.json>`

The review passport is the decision record. The dispatch quest is the
worker-facing continuation packet: it carries the next task, allowed and
forbidden files, commands, evidence requirements, failing review gates,
hash-only context pointers, and hash-only donor hints selected from the donor
registry and Playbasis primitive map. `run-worker` can hand that packet to a
configured local worker command under explicit execution gates. A run report
still does not prove the worker produced the correct frontend; it only proves
whether the configured worker command consumed the bounded prompt and what
hash-only IO and workspace status were observed.

The cycle report links the worker-run, attempt scope, browser/rendered/visual
review evidence, and next quest. This reduces the user's manual sequencing work
but still does not prove autonomous completion unless a real worker runs,
changes scoped files, browser/rendered/visual/test/leak evidence passes, and
review promotes the artifact.

### Phase 6 - Self-Improvement Proof

Run the lane on Navigator itself and require:

- pre-registered target
- before/after visual or functional score
- test/build pass
- no secret leak
- memory entry consumed in a later cycle

## Claim Boundary

Allowed now:

- The repo has an evidence-gated harness with narrow Prompt Twin and visual
  frontend proof loops.
- The product direction is technically plausible because the repo already has
  run evidence, visual scoring, private target handling, and proof reports.

Not allowed yet:

- The system replaces the user as Codex operator.
- The system can build arbitrary frontends from screenshots end to end.
- The system is generally self-improving.
- The system produces economically valuable UI without human or external
  validation.

The next proof should not be another generic launch pack. It should be one
complete screenshot-to-frontend vertical slice, with the frontend code change
as the promoted artifact.
