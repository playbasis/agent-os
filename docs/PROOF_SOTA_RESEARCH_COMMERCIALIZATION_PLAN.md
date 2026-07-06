# Proof of Value, SOTA Positioning, Research Sharing, and Commercialization Plan

Last updated: 2026-07-05
Companion to: `docs/AGENT_OS_POV_HANDOVER.md`,
`docs/ROBUST_PROOF_PROTOCOL.md`, and
`docs/LOSS_FUNCTION_DESIGN_NAVIGATOR_ADDENDUM.md`.
Canonical framing: `docs/VISION.md` defines the product doctrine and claim
language; this plan defines what evidence would license stronger claims.
This plan defines what evidence would license each stronger claim, in what
order to gather it, and how the same evidence becomes both publishable
research and a sellable product.

## 0. The Honest Starting Point

What the system can truthfully claim today (per the claim boundary in
`ROBUST_PROOF_PROTOCOL.md`):

- A robust, reproducible, monorepo-backed harness kernel: replayable mission
  runs, multi-profile connectors, real API/WorkspaceOps/provider calls,
  evidence packs, promotion gates, hill-climb improvement, zero secret leaks
  across 562 indexed evidence packs in the current run warehouse summary.
- The current evals are feature/checklist heuristics. They are useful
  engineering gates for trace coverage, artifact completeness, service
  coverage, and leak safety; they are not external judgments of task quality.
- The historical hill climb is scripted by maturity level. V2 keeps it as a
  deterministic generator named `scripted-maturity-ladder`, not as evidence
  of open-ended intelligence.
- The current LLM usage in the hard proof is provider smoke and gated
  metadata, not deep task intelligence. It proves the bridge and redaction
  boundary, not autonomous reasoning quality.
- The current system is a governed exoskeleton with real rails and safety,
  not yet a self-improving mind. V2 adds candidate generation, held-out
  evals, run memory, and real WorkspaceOps/super-prompt adapters to move in
  that direction.
- The first publishable breakthrough is evidence-gated autonomy
  infrastructure, not SOTA task success.

What it cannot claim yet, and why:

1. **"It creates value"** - the historical eval lift (0.6071 -> 1.0000) is
   measured by the system's own heuristic evals, which the scripted ladder
   directly optimizes. That is a working improvement loop, not proof of
   value. It is structurally vulnerable to Goodhart's law: climbing the
   grader.
2. **"It is SOTA"** - there is no external benchmark, no named baseline, and
   no third party who can reproduce a comparison.
3. **"Buy it"** - there is no measured economic delta (hours saved, cost per
   accepted artifact) against any alternative.

Everything below is ordered to close those three gaps in that order, because
each gap's evidence is a prerequisite for the next claim.

## 1. The Claim Ladder

Never say a rung's words before its evidence exists. Each rung reuses the
evidence of the rung below.

| Rung | Claim | Evidence that licenses it |
| --- | --- | --- |
| 1 (now) | "Robust internal proof of a governed harness kernel" | Current default robust proof: 13/13 gates across fixture/local-monorepo, plus separate staging value proof, zero leaks. Done. |
| 2 | "Measured improvement that survives held-out evaluation" | Optimizer lift on training gates plus held-out gates the optimizer never saw, with external-judge scoring and a published rubric. |
| 3 | "Measured economic value" | Blind baseline experiment: system vs human vs human+chat-assistant on the same mission; hours, cost, and blind quality review with N>=10 per arm. |
| 4 | "Competitive with named agent frameworks" | Same public benchmark subset run through our kernel and 2+ named baselines, one-command reproducible, results within or above baseline range. |
| 5 | "SOTA on evidence-gated autonomy" (category SOTA) | We publish the benchmark for governed autonomy, hold the top score, and at least one external team has run it. |

Rule: marketing language, README language, and investor language all point
at the highest rung whose evidence is committed to the repo, and no higher.

## 2. The Metric Stack (What "Measurable" Means Here)

Four tiers. The dashboard should grow one panel per tier.

### Tier A - External benchmark metrics (licenses rungs 4-5)

- Score on a public agentic benchmark subset vs named baselines.
- Candidate benchmarks, chosen because they are work-task shaped (where the
  harness architecture matters) rather than pure-reasoning shaped:
  - TheAgentCompany (realistic knowledge-work tasks) - closest to
    WorkspaceOps missions; best first target.
  - GAIA (general assistant tasks with verifiable answers) - well known,
    cheap to score.
  - tau-bench style tool-use tasks - matches the governed-tool-policy story.
- Pick ONE first (recommended: a 20-30 task TheAgentCompany subset). Depth
  beats breadth; a defensible result on one benchmark outranks noisy results
  on three.

### Tier B - Economic metrics (licenses rung 3; what buyers care about)

Per mission template, measured against a human baseline:

- Cost per accepted artifact (model cost + infra + human review minutes).
- Wall-clock time to first accepted artifact.
- First-pass acceptance rate (reviewer accepts without rework).
- Rework rate and rework minutes.
- Autonomy rate: fraction of steps needing no human touch.
- Human-minutes per mission (the number that becomes the sales deck).

### Tier C - Compounding metrics (proves the OS thesis, not just the demo)

- Held-out eval lift (see 3.1) - the honest replacement for the current
  self-graded lift number.
- Reuse rate: fraction of a new mission's steps/tools/templates drawn from
  previously banked assets. Rising = compounding is real.
- Cost-per-mission trend across sessions (should fall).
- Regression escape rate: bugs/failures that passed gates (should fall as
  the eval foundry grows).

### Tier D - Trust metrics (the differentiator; no competitor reports these)

- Evidence completeness: fraction of runs with full pack (trace, artifacts,
  eval, promotion decision, hashes).
- Zero-leak streak (currently 562/562 indexed runs - keep publishing this).
- Budget adherence: runs completing within declared credit/cost budget.
- Replay determinism rate in fixture mode.
- Approval-policy conformance: no ungoverned side effects, ever.

Tier D is the moat. Every agent framework demos task success; none ship
audit-grade evidence per run. Measure it, publish it, and make competitors
answer for not having it.

### Tier E - Private eval moat (protects the product edge)

The open-core rule is: **open-source the ruler, keep the answer sheets**.
The public ruler is the evidence-pack format, eval schema, fixture scoring
harness, and EGA-Bench specification. The private answer sheets are the
Prompt Twin corpus, generated held-out eval families, scorer-only answer
keys, Playbasis connectors, WorkspaceOps integrations, provider routing,
env profiles, and live evidence. The first concrete private eval family is
the Flappy held-out scorer family: public commitments and aggregate scorer
outputs live in this repo, while held-out case bodies and answer keys stay
outside the optimizer workspace.

This is not secrecy for its own sake. Private held-out families and private
taste ground truth are the information asymmetry that lets the product keep
improving after the generic kernel becomes public. Zero-leak scanning is
therefore moat defense as well as compliance.

The LFD packaging sentence is now explicit: **open-source the ruler, keep
the answer sheets**. Publish the measurement protocol, fixture harness, and
safe scoring format; keep private held-out cases, Prompt Twin taste ground
truth, customer evals, answer keys, and live connector evidence out of the
public export.

## 3. Phase 1 (Days 1-30): Make the Numbers Credible

Goal: rungs 2 and 3. Nothing here requires new research - it requires rigor.

### 3.1 Kill the Goodhart problem

- Split evals into `training gates` (optimizer may see) and `held-out
  gates` (scored only after candidate selection, rotated periodically).
- Add an external-judge scorer: a strong LLM with a published rubric, run on
  artifacts, prompt version-pinned, plus periodic human spot-check of judge
  agreement (report the agreement rate).
- Dashboard reports BOTH lifts side by side. If held-out lift is much lower
  than training lift, that is a finding, not an embarrassment - publish it.
- Acceptance: `pnpm pbos optimize ...` selects by optimizer-visible
  training score only, then reports held-out scores after selection;
  dashboard shows training score, held-out score, trust gates, external judge
  score, human review score, economic value, and real workflow coverage.

### 3.2 The economic baseline experiment (the single highest-ROI task)

Design (pre-register it in the repo BEFORE running, so results are
credible):

- Task: produce the launch-pack deliverables for 3 fresh product briefs.
- Arms: (a) Agent OS staging profile, (b) skilled human alone, (c) skilled
  human + generic chat assistant.
- Blind review: two reviewers score all artifacts on a fixed rubric without
  knowing which arm produced them.
- Record: wall-clock, cost, acceptance, rework, quality scores.
- Deliverable: `docs/VALUE_MEASUREMENT_REPORT_001.md` with raw data in
  `reports/experiments/`.
- Acceptance: the report states hours and dollars per arm, with N and the
  rubric attached. Whatever the result, it is the first honest value number,
  and iterating on it is now an engineering problem.

### 3.3 Foundation tasks pulled forward from the handover's 10x list

These make Phases 2-3 possible, so they land in Phase 1:

- Run warehouse (handover task 1) - metrics over time need a queryable index.
- `SafeProbeEvidence` (task 3) - publishing anything requires the evidence
  boundary to be safe by construction, not by review.
- Second flagship mission (task 5, competitive-intel pack) - N=2 mission
  templates is the minimum to claim generality.

## 4. Phase 2 (Days 31-60): External Comparison and the Benchmark Play

Goal: rung 4, and the artifact that eventually delivers rung 5.

### 4.1 Run a public benchmark subset honestly

- Adapt the kernel to execute a 20-30 task subset of the chosen benchmark
  (TheAgentCompany recommended) via a `packages/benchmark-adapter`.
- Run 2+ named baselines on the SAME tasks with the SAME model: (a) plain
  single model call, (b) a popular open agent framework configured in good
  faith (e.g., a LangGraph/AutoGen reference agent).
- Publish the harness so anyone can rerun the comparison with one command.
- Report results even if we only reach parity. The headline is not "we beat
  X" - it is "parity on task success, PLUS a complete audit-grade evidence
  pack per task, at measured cost, with zero leaks." No baseline can say the
  second half.
- Acceptance: one table, three systems, one benchmark subset, reproducible;
  benchmark panel added to the sandbox dashboard.

### 4.2 Define the category benchmark: Evidence-Gated Autonomy

This is the legitimate route to "clearly SOTA": when you are creating the
measurement for a property nobody else measures, publishing the benchmark IS
the research contribution (the tau-bench / HELM / SWE-bench playbook).

- Working name: `EGA-Bench` (Evidence-Gated Autonomy Benchmark).
- Score per task = task success x evidence completeness x safety (zero
  leaks, budget adherence, approval conformance) x replayability.
- Seed content: 20-50 missions across 3 domains (launch pack, competitive
  intel, ops/reporting), each with machine-checkable gates - reuse our gate
  suite format directly.
- Ship: spec, dataset, scoring harness, our own scores, and baseline scores
  showing that ungoverned frameworks fail the safety/evidence dimensions.
- Every task must be runnable in fixture mode (deterministic, no secrets)
  so external teams can participate without our infrastructure.
- Acceptance: `docs/EGA_BENCH_SPEC.md` + scoring harness + our published
  scores; pre-registered scoring rules committed before our runs.

### 4.3 OSS export hardening (handover task 9)

- The export tree must install/typecheck/test cleanly with no private lane
  content; license review of donor-derived code completes here.
- This unblocks Phase 3's release and matches the monorepo master plan's
  extraction path toward `github.com/playbasis`.

## 5. Phase 3 (Days 61-90): Publish the Research, Open the Funnel, Sign a Pilot

### 5.1 Research sharing (the credibility engine)

Four artifacts, in dependency order:

1. **OSS release**: `@playbasis/agent-os-kernel` - kernel, evals,
   hill-climber, sandbox-dashboard, sanitized examples, fixture profile.
   Apache-2.0. Private lane stays private (connectors, profiles, env,
   donors, live evidence).
2. **Technical report** (arXiv-style): "Evidence-Gated Autonomy: a governed
   kernel for auditable agent operations." Contents: evidence-pack format,
   promotion gates, held-out-vs-training lift results (including negative
   findings), economic experiment results, benchmark comparison table.
   Honest limitations section - it buys more credibility than the results.
3. **EGA-Bench release**: spec + dataset + harness + leaderboard page.
   Invite named frameworks to submit; their absence is also a result.
4. **Reproducibility packet**: published (sanitized) evidence packs as
   supplementary material - the format itself is a contribution to the
   "how do you audit agents" conversation.

Cadence afterward: a monthly public "state of the kernel" note - new
missions, metric trends (Tiers B-D), benchmark movements. Compounding in
public is the marketing.

### 5.2 Commercialization path

**Wedge: regulated and reputation-sensitive enterprises** - starting with
Playbasis's existing bank/enterprise customers in SEA. They are the segment
that cannot adopt ungoverned agents at all. What we call evidence packs,
promotion gates, budget caps, and adjudication trails, their compliance
teams call model risk management, audit trail, and change control. We sell
autonomy that their auditors can sign off on.

**Open-core structure** (the lanes are already drawn in the handover):

- Free/OSS: kernel, eval engine, hill climber, dashboard, fixture profile,
  EGA-Bench spec, public fixture cases, and scoring harness. This is the
  distribution and hiring funnel: the ruler is public.
- Paid control plane: run warehouse at scale, multi-tenant dashboards,
  release passports, compliance/report exports, private service connectors,
  WorkspaceOps integration, private held-out eval families, Prompt Twin
  corpus access, scorer-only answer-key management, SLAs, managed profiles.
  The answer sheets stay private.
- Metered on **credits** - the billing primitive already native to
  Playbasis. Missions carry credit budgets; invoices are literally the
  budget ledger. No new billing infrastructure required.

**Design-partner pilot** (target: 1-2 signed by day 90):

- Offer: one WorkspaceOps daily loop in the partner's domain (e.g., campaign
  launch packs, competitive monitoring, ops reporting) run for 4-6 weeks.
- Success criteria written into the pilot agreement AS the Tier B metrics:
  human-minutes per deliverable, first-pass acceptance rate, cost per
  accepted artifact - measured by the same instrumentation we publish.
- Every pilot deliverable ships with its evidence pack; the pack is the
  differentiator demo, not a slide.
- Pricing: pilot fee + credit metering; convert to annual control-plane
  subscription on success criteria being met.

**Positioning sentence** (usable at rung 3, strengthens at 4-5):

> Playbasis Agent OS is the governed agent kernel for organizations that
> need autonomy their auditors can sign: every run produces court-grade
> evidence, every promotion passes gates, every dollar is budgeted - and it
> is the reference implementation behind EGA-Bench, the public benchmark
> for evidence-gated autonomy.

## 6. Risks and Pre-Committed Mitigations

- **Goodhart / self-grading** - held-out gates, external judge with
  agreement reporting, human blind review. Never publish a training-gate
  lift as "improvement" again after Phase 1.
- **Self-scored breakthrough theater** - do not repeat external "50x" style
  claims unless the target was pre-registered, the scorer was blinded where
  appropriate, and the result can be reproduced without exposing answer
  keys. Large internal lifts are engineering signals until external or
  scorer-only evidence supports them.
- **Benchmark cherry-picking accusations** - pre-register task subsets and
  scoring before running; run baselines in good faith with configs
  published; report losses alongside wins.
- **Leakage when publishing** - `SafeProbeEvidence` by construction, OSS
  export verification gate, and the existing zero-leak scanner run over
  every published artifact. One leaked secret would destroy the trust
  positioning permanently; this is the non-negotiable gate.
- **Own-benchmark skepticism ("they win their own game")** - pair EGA-Bench
  results with the public-benchmark parity table (4.1) in every publication;
  actively solicit external submissions.
- **Overclaim drift** - the claim ladder (section 1) is the editorial gate
  for every README, deck, and post. The existing `ROBUST_PROOF_PROTOCOL.md`
  claim boundary stays authoritative and gets updated per rung.

## 7. 90-Day Scorecard (Definition of Done)

By day 90, all true:

- [x] Held-out gate suite live; dashboard shows training vs held-out lift.
- [ ] `docs/VALUE_MEASUREMENT_REPORT_001.md` with blind-reviewed
      hours/dollars/quality per arm, N>=10 artifacts per arm.
- [ ] Run warehouse queryable; Tier B-D metrics trend panels on dashboard.
- [ ] Two+ mission templates proven end to end.
- [ ] Public benchmark subset: our kernel + 2 named baselines, one-command
      reproducible, results table committed.
- [ ] `EGA_BENCH_SPEC.md` + dataset + scoring harness + our scores public.
- [ ] OSS kernel released under `github.com/playbasis`, clean install
      verified from the export tree.
- [ ] Technical report public.
- [ ] 1-2 design-partner pilots signed with Tier B success criteria in the
      agreement.
- [ ] Zero secret leaks across all published artifacts (streak unbroken).

## 8. Sequencing Note for the Next Agent

Do not reorder Phase 1 after Phase 2. The temptation is to chase the
benchmark first because it is the flashy result; but benchmark results
computed by a self-graded, un-warehoused system will not survive scrutiny,
and re-running them later doubles the cost. Credibility infrastructure
first, comparison second, publication third. That order is the plan.
