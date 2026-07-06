# Cockpit UX and Wide-Exploration Search

Last updated: 2026-07-04
Companion to: `docs/NAVIGATOR_PATH_PLANNING_AND_MODEL_COUNCIL_PLAN.md`,
`docs/USE_CASES_AND_GOAL_PATTERNS.md`.
Canonical framing: `docs/VISION.md` defines the product language; this
document expands the human cockpit and wide-exploration search surface.

Two things are codified here so they are not lost:

1. The desktop product surface - how a human authors an objective function,
   approves an operating envelope, watches competing strategies evolve, and
   promotes results into reusable capability. This is the cockpit that makes
   the invisible loop visible.
2. Wide-exploration search - the capability to expand a goal into ~100 plan
   steps and try ~1000 candidate strategies to find the optimal path, and
   how to do that without the cost or the search collapsing.

## Part A: The Cockpit

### Core principle

The product is a mission-control cockpit for governed autonomy, not a
chatbot. The user is not "prompting an agent"; they are authoring an
objective function, approving the operating envelope, watching competing
strategies evolve, and deciding what gets promoted. This maps directly onto
the kernel loop: observe -> orient -> decide -> act -> evidence -> evaluate
-> promote -> learn -> compound.

The user must always be able to answer five questions:

1. What is the system trying to optimize?
2. What is it doing right now?
3. What evidence has it collected?
4. Is it improving or fooling itself?
5. What needs human approval?

The single most important UX rule: the user should never feel like they are
watching a spinner. They should feel like they are watching an intelligent
system form hypotheses, test them, learn from evidence, expose tradeoffs,
ask for approval at the right moments, and become more capable over time.

### Three persistent zones

- Left rail: missions, workspaces, agents, tools, approvals, evidence
  packs, benchmarks, policies.
- Center canvas: the active mission flow (goal, path fan, execution graph,
  evidence, evals, outputs).
- Right inspector: objective function, risk, spend, progress, model/tool
  calls, confidence, blockers, and what the system learned.

### The screens (condensed spec)

Each screen below is a durable requirement, not a mockup. Order reflects the
user journey.

1. Home / Mission Command - dashboard of active autonomous missions. Each
   card: objective score, reality fraction, held-out lift, Progress Sharpe,
   risk tier, spend, next approval, last meaningful learning, and a live
   progress pulse ("Cycle 4 running. 3 of 12 candidate paths active. Best
   path improved held-out lift +7.4%, cost efficiency dropped.").

2. New Mission / Goal Brief - structured goal composer: outcome, hard
   constraints, soft preferences, deadline, budget, risk tolerance, required
   evidence, human approval points. User picks a mission type (build
   software / run research / improve benchmark / generate asset / optimize
   workflow / investigate incident / create deliverable / train-eval skill).
   System returns a draft Mission Contract and reports parsed constraints +
   MISSING INSTRUMENTS ("no held-out scoring method; no spend cap; no
   rollback definition").

3. Objective Function Builder - weighted editor, e.g. 30% task quality +
   20% held-out lift + 15% reality fraction + 10% safety margin + 10% cost
   efficiency + 10% reuse potential + 5% taste fit. Sliders + definitions +
   attached instruments per dimension. System WARNS when the function is
   gameable ("Task Quality weighted heavily but no held-out evaluator
   attached; the agent may optimize visible tests only."). Shows current
   score and expected trajectory.

4. Governance Envelope - allowed tools, forbidden tools, approval-required
   actions, budget limits, credential access, data classes, external
   comms rules, rollback requirements, kill-switch triggers. Compiles to
   policy-as-code. Reports risk tier + gated-action count + missing
   rollback paths.

5. Capability Map / Tool Readiness - required capabilities vs. available
   tools, each with status (available / gated / partial / missing).
   Readiness scores: execution / evaluation / governance.

6. Mission Compiler Review - the compiled mission (goal, objective,
   constraints, tools, evidence requirements, eval gates, approval points,
   failure modes, PRE-REGISTRATION HASH). Approving here pre-registers what
   the mission is trying to prove BEFORE evidence gathering starts.

7. Path Fan Canvas - visual fan of candidate strategies, each with expected
   quality, time, cost, risk, evidence strength, novelty, probability of
   success, milestone envelope. User can pin / ban / add-hypothesis /
   demand-more-diversity. Path weights update live as evidence arrives, with
   a stated reason ("Path 4 up 14% -> 31%: passed fixture replay and
   improved held-out coverage.").

8. Dry Run / Simulated Execution - what the system INTENDS to do (files
   read/written, commands, web queries, tool calls, cost estimate, expected
   artifacts) before real execution. Blocking reality access visibly lowers
   the credibility ceiling ("Live web calls removed; reality fraction
   ceiling reduced from 62% to 38%.").

9. Live Mission Cockpit - real-time: current cycle/step, active path,
   subagent activity, tool calls, tests, evidence, spend meter, risk meter,
   objective score movement. Streams in human language WHAT changed, WHY,
   what evidence caused it, the next action, and whether confidence rose or
   fell. No black-box spinner.

10. Evidence Feed - chronological ledger; each item has source, trust level,
    hash, timestamp, related path, related objective dimension, impact on
    score. Score movements are explained ("rose 61% -> 68%: held-out lift
    improved, cost efficiency declined slightly").

11. Reality Fraction Board - credibility dashboard: reality fraction broken
    into runtime probes / held-out gates / web evidence vs. fixtures / model
    judgment. User can demand more reality; system states the cost of doing
    so.

12. Evaluation & Council - runtime results, held-out results, judge review,
    council disagreement, security review, cost review, falsifiers,
    promotion recommendation (e.g. "Promote with caveat" + dissent).

13. Approval Inbox - focused queue; each card states why approval is needed,
    risk if approved, risk if denied, evidence so far, rollback plan,
    recommended decision, and the impact of denial ("caps reality fraction
    at 43%").

14. Output Review - the artifact next to its supporting evidence; distinguishes
    working / evaluated / promoted / reusable-capability.

15. Promotion Passport - certification card: what/why promoted, objective
    score, evidence pack, tests passed, known limitations, rollback path,
    reuse tags, extracted skill, future drift checks. Promotion scope:
    mission-only / workspace ledger / org-wide / public / private customer
    control plane.

16. Learning Distillation - new skill learned, bad strategy pruned, better
    evaluator discovered, tool reliability update, governance rule update,
    new benchmark case. Accepted lessons enter mission/skill/policy memory.
    Tracks improvement quantitatively (scores, cost, reality, reuse, fewer
    interventions) AND qualitatively (taste, judgment, decomposition, risk
    awareness, explanations).

17. Objective Function Evolution - history of objective functions across
    cycles; which dimensions were under-instrumented; simulate how past
    decisions would change under a revised function. This is where the
    system gets smarter at knowing what "better" means.

18. Benchmark & Evals Lab - create/run/manage evals: public benchmark
    adapters, private held-out sets, customer evals, Prompt Twin taste
    evals, regression, red-team, drift. Reports training lift vs. held-out
    lift vs. generalization gap vs. memorization risk - prevents fake
    progress.

19. Agent Labor Market - marketplace of agents/skills with reputation,
    certifications, cost, historical accuracy, disagreement rate, best
    domains, failure modes. System routes to the cheapest competent agent
    unless escalation is required.

20. WorkspaceOps Daily View - morning (highest-leverage missions), midday
    (approvals), afternoon (gate reviews), night (learned + what should
    compound tomorrow).

21. Audit / Evidence Pack Viewer - full chain of custody; exports as
    internal report / customer report / compliance export / benchmark
    submission / investor proof pack / OSS reproducibility artifact.

22. System Improvement Dashboard - meta-metrics: reality fraction trend,
    held-out lift trend, Progress Sharpe trend, reuse rate trend, council
    disagreement trend, manual intervention rate, cost per promoted
    capability, safety incidents, rollback frequency, benchmark coverage.
    The system proposes missions to improve ITSELF ("highest-leverage
    improvement is eval-family diversity").

23. Failure / Honest Negative Result - a failed mission is not waste:
    reports the finding (e.g. "training +21%, held-out flat -> likely
    memorized template structure") and the recommended next move. Logged as
    reusable knowledge. An honest negative with evidence is success.

24. End-to-end flow: define goal -> compile contract -> tune objective ->
    system flags missing instruments -> approve governance -> generate path
    fan -> review diversity -> pre-register targets/evals -> dry run ->
    approve execution boundaries -> execute in sandbox -> evidence arrives
    -> path weights update -> objective score moves -> system explains ->
    council evaluates -> human approves gated actions -> promote or reject
    -> distill lessons -> reusable skills enter ledger -> benchmarks/policies
    update -> future missions start smarter.

### The product promise (one line)

You set the objective. The system explores the path fan, gathers evidence,
obeys governance, shows its work, improves the score, and compounds what it
learns.

## Part B: Wide-Exploration Search (100 steps, 1000 strategies)

The cockpit above shows a fan of ~20 paths. The ambition is larger: expand
a goal into ~100 plan steps and try ~1000 candidate strategies to find the
optimal path - like a chess engine exploring plays. This section codifies
how to do that without cost blowup or search collapse.

### B.1 Deep decomposition (the 100 steps)

- A path is not three fixed milestones; it is a decomposition tree. A
  research-informed path generator (research-bridge) proposes an ordered
  plan of up to ~100 concrete steps, each with an input, expected
  measurable state, envelope, and idempotency key.
- Depth is bounded by budget, not by a hard cap: expand a step into
  sub-steps only when the expected value of finer planning exceeds the
  planning cost (the same payoff discipline as council convening).
- Steps carry a shape tag (risk-first, grind, spike-stabilize, etc.) so the
  tree is auditable and matchable against the shape library.

### B.2 Wide candidate search (the 1000 strategies)

- Generate strategies across the diversity axes already defined: shape x
  ambition x resource mode x decomposition order x tool mix. 1000 is the
  Cartesian reach, not 1000 hand-written plans.
- CRITICAL: never execute 1000 strategies for real. That is the cost trap.
  Instead, run a cheap-to-expensive ladder:
  1. Simulate all ~1000 in the world simulator / on priors (near-free).
  2. Rank by predicted objective value with the efficient frontier + ELO;
     keep the frontier and prune the dominated (bottom ~90%).
  3. Run cheap fixture/cassette probes on the top ~100.
  4. Dispatch real runs on only the top ~5-10 that survive.
- This is beam search with a cost-aware width: wide where thinking is cheap,
  narrow where acting is expensive. The reweighting machinery already
  supports prune-and-renormalize; wide-exploration is that machinery run at
  larger K with a simulation pre-filter.

### B.3 Keeping the search honest at scale

- Calibration scoring on the generators: a strategy generator earns the
  right to propose more candidates only if its envelope predictions match
  realized values (Brier-style). Bad guessers get less of the 1000.
- Forced entropy still applies: if the top of the frontier stops moving,
  inject non-obvious strategies (research "how others solved this") rather
  than widening the same neighborhood.
- Pre-registration scales too: the full candidate set and the eval keys are
  hash-committed before any real dispatch, so a large search cannot be
  accused of post-hoc fitting.
- Reality fraction is the guard against simulation self-delusion: a search
  that ranks 1000 strategies on priors alone has near-zero reality
  fraction; only real dispatch on the survivors raises it. Simulation wins
  promote NOTHING on their own.

### B.4 Why this is the chess-engine analogy done right

A chess engine explores millions of positions cheaply because the
evaluation function is fast and correct, and only commits to one move. Our
version: explore ~1000 strategies cheaply on priors + simulation, evaluate
with the trustworthy value stack, commit real compute to a handful, and let
arriving evidence re-rank. The engine is only as good as its evaluator -
which is why the eval factory, held-out blinding, and reality fraction are
prerequisites for wide search, not features to bolt on after.

### B.5 Acceptance criteria for wide-exploration

- `navigate fan --paths 1000` generates a diverse candidate set, simulates
  and ranks it, and emits a frontier of survivors WITHOUT dispatching real
  runs for the dominated set.
- A `path-decomposition.json` can hold up to ~100 ordered steps per surviving
  path with envelopes and idempotency keys.
- The proof reports: candidates generated, candidates simulated, candidates
  fixture-probed, candidates really dispatched, and reality fraction - so
  the cost ladder is visible and auditable.
- Pre-registration hash covers the full candidate set; no post-hoc addition
  of a strategy after seeing results.
