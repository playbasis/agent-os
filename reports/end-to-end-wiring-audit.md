# End-to-End Wiring Audit

Generated At: 2026-07-07T16:05:28.081Z

Profile: fixture

Claim Status: needs-attention

## Summary
- Internal harness wired: false
- Real service evidence present: true
- Live write activation complete: false
- OSS clean export verified: false
- Zero leak: false
- OpenAPI operations with evidence: 153/232
- Direct safe-live operation evidence: 24
- Unevidenced operations: 79
- Domain-adapter-needed operations: 24
- Domain adapter probes: 4/14
- Domain adapter probe families: 3
- Domain adapter blocked private operations: 10
- Source-backed staging 404 operations: 5
- Feature-flag-gated staging 404 operations: 5
- Module-imported staging 404 operations: 0
- Contract-only route-diagnosis operations: 0
- Private-adapter route-diagnosis operations: 24
- Feature-flag activation gates: 2
- Feature-flag activation blocked operations: 5
- Feature-flag activation flags: billing, health
- Connector workflow templates: 5
- Connector workflow clone targets: 4
- Connector workflow recorded create-verify-rollback runs: 0
- Connector workflow gated live-write connectors: 1
- Connector workflow pending private contracts: 24
- Connector workflow replay plans: 5
- Connector workflow zero leak: true
- Run warehouse evidence packs: 830
- Agent-loop mechanics ledger wired: true
- Agent-loop mechanics covered: 16/16
- Agent-loop ledger records: 61
- Agent-loop live-backed records: 54
- Agent-loop blocked records: 10
- Agent-loop promotion decision: promote-to-platform-patch-review

## Mechanics Evidence
| Mechanic | Proof status | Strength | Evidence level | Ledger records | Ledger live-backed | Ledger blocked | Activation | Readiness | Next proof |
| --- | --- | --- | --- | ---: | ---: | ---: | --- | --- | --- |
| events | safe-live-wired-with-activation-gate | safe-live | safe-live-probe | 5 | 4 | 1 | write-probe-gated | missing-required-env | Satisfy events-ingest gate (missing-required-env) then run: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| points | safe-live-wired | safe-live | safe-live-probe | 2 | 2 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| xp | safe-live-wired-with-ledger-blockers | safe-live | safe-live-probe | 4 | 4 | 1 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| quests | safe-live-wired | safe-live | safe-live-probe | 3 | 3 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| rulesets | safe-live-wired | safe-live | safe-live-probe | 5 | 5 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| adjudications | safe-live-wired | safe-live | safe-live-probe | 5 | 5 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| experiments | readiness-only-blocked | readiness-only | available-only | 5 | 3 | 2 | write-probe-gated | missing-required-env | Satisfy experiments gate (missing-required-env) then run: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| feedback | safe-live-wired | safe-live | safe-live-probe | 5 | 5 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| credits | safe-live-wired | safe-live | safe-live-probe | 2 | 2 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| leaderboards | safe-live-wired | safe-live | safe-live-probe | 4 | 4 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| cohorts | safe-live-wired | safe-live | safe-live-probe | 2 | 2 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| campaigns | readiness-only-blocked | readiness-only | available-only | 3 | 1 | 2 | identifier-required | missing-required-env | Satisfy campaigns gate (missing-required-env) then run: pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id |
| rewards | safe-live-wired-with-ledger-blockers | safe-live | safe-live-probe | 4 | 4 | 2 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| webhooks | readiness-only-blocked | readiness-only | available-only | 3 | 1 | 2 | write-probe-gated | missing-required-env | Satisfy webhooks gate (missing-required-env) then run: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| analytics | safe-live-wired | safe-live | safe-live-probe | 5 | 5 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |
| workspaceops | safe-live-wired | safe-live | safe-live-probe | 4 | 4 | 0 | n/a | n/a | Keep collecting hash-only SafeProbeEvidence and link it to held-out outcome movement. |

## Feature Flag Route Activation Gates
| Feature Flag | Operations | Source-backed 404s | Operation IDs | Required action | Rerun command |
| --- | ---: | ---: | --- | --- | --- |
| billing | 1 | 1 | listBillingPlans | Enable or verify feature flag billing in staging, then rerun safe read probes for 1 source-backed operation. | pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing |
| health | 4 | 4 | listHealthAppointmentPackages, listHealthContent, listHealthDepartments, listHealthMilestones | Enable or verify feature flag health in staging, then rerun safe read probes for 4 source-backed operations. | pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing |

## Activation Replay Plan
- Replay from: openapi-safe-read-reprobe
- Next safe command: pnpm pbos audit scorecard --profile staging-sandbox && pnpm pbos audit route-diagnosis --profile staging-sandbox && pnpm pbos audit domain-adapters --profile staging-sandbox
- Steps: 0 ready / 8 blocked / 10 total
- External-state steps: 2
- Write-probe steps: 4
- Private-adapter steps: 2

| Step | Kind | Status | Resume From | Command | Missing Env Keys | Missing Flags | Feature Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| feature-flag:billing | feature-flag | blocked | openapi-safe-read-reprobe | pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing | none | none | billing |
| feature-flag:health | feature-flag | blocked | openapi-safe-read-reprobe | pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing | none | none | health |
| openapi-safe-read-reprobe | safe-read-reprobe | waiting-on-upstream | route-diagnosis | pnpm pbos audit scorecard --profile staging-sandbox && pnpm pbos audit route-diagnosis --profile staging-sandbox && pnpm pbos audit domain-adapters --profile staging-sandbox | none | none | billing, health |
| write-activation:events-ingest | write-probe | blocked | mechanics-probe | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | none |
| write-activation:experiments | write-probe | blocked | mechanics-probe | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | none |
| write-activation:campaigns | write-probe | blocked | mechanics-probe | pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id | PBOS_PROBE_CAMPAIGN_ID | none | none |
| write-activation:webhooks | write-probe | blocked | mechanics-probe | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, PBOS_PROBE_WEBHOOK_URL | --allow-write-probes | none |
| private-adapter:baby-app | private-adapter | blocked | domain-adapter-probes | pnpm pbos audit domain-probes --profile staging-sandbox --families baby-app | none | none | none |
| private-adapter:health | private-adapter | blocked | domain-adapter-probes | pnpm pbos audit domain-probes --profile staging-sandbox --families health | none | none | health |
| rebuild-proof-surfaces | rebuild-proof-surfaces | waiting-on-upstream | proof-surface-rebuild | pnpm pbos audit wiring --profile staging-sandbox && pnpm sandbox:build && pnpm pbos runs:index && pnpm pbos knowledge compile --sources reports --out reports/agent-os-wiki && pnpm pbos knowledge lint --path reports/agent-os-wiki | none | none | none |

## Value Lanes
| Lane | Status | Strength | Evidence | Next proof |
| --- | --- | --- | --- | --- |
| mission-kernel-evidence-packs | wired | fixture | 830 evidence packs in run warehouse | Keep indexing all mission runs and require evidence packs before promotion. |
| playbasis-safe-live-mechanics | wired | safe-live | 13 live-recorded capabilities; 20 safe-live calls | Increase direct SafeProbeEvidence coverage for unevidenced OpenAPI operations. |
| openapi-route-diagnosis | wired | readiness-only | 79 diagnosed; 5 source-backed staging 404; 5 feature-flag-gated; 0 module-imported staging gaps; 0 contract-only | Enable or verify the relevant staging feature flags, then rerun safe read probes. |
| openapi-feature-flag-activation | gated | readiness-only | 2 feature flags (billing, health); 5 source-backed safe-read operations blocked | Enable or verify billing, health in staging, then rerun safe read probes. |
| agent-loop-mechanics-ledger | wired | safe-live | 16/16 mechanics; 61 records; 54 live-backed; 10 blocked; decision=promote-to-platform-patch-review | Use the ledger as the mission reward/governance substrate, then prove held-out outcome movement from mechanics changes. |
| playbasis-live-write-activation | gated | readiness-only | 0/4 activation gates ready | Run only in disposable staging with required env key names present and --allow-write-probes. |
| domain-private-adapters | gated | safe-live | 22 safe-read-backed paths; 24 private-adapter-needed operations; private read contracts 24 (24 pending); adapter probes 4/14; read target met=false; blocked private ops 10 | Expand private Baby App and Health adapters from representative safe probes to complete aggregate-only SafeProbeEvidence coverage. |
| connector-workflow-crud-readiness | gated | safe-live | 5 workflow templates; 4 clones; 0 recorded create-verify-rollback runs; 1 gated live-write connectors; 24 private contracts pending; replay plans 5 | Run one disposable WorkspaceOps CRUD execution and clone it to Playbasis mechanics writes only after sandbox gates are satisfied. |
| workspaceops-runtime-surface | wired | safe-live | recorded/safe-live-probe | Tie WorkspaceOps runtime/super-prompt calls to mission outcome deltas, not only surface coverage. |
| ceo-simulator-benchmark | fixture-only | clean-room-sim | 0.1083 relative lift; held-out hash only=true | Adapt one private WorkspaceOps CEO-sim primitive and compare against the clean-room fixture world. |
| value-measurement-experiment | fixture-only | fixture | pov fixture winner; 6 reviewer rows | Replace deterministic reviewer rows with real blind review while keeping preregistration and losses. |
| oss-export-boundary | missing | missing | 95 clean-export files; 1 forbidden hits | Publish only the public ruler/kernel once license and private-data review are complete. |

## Remaining Gaps
| Gap | Severity | Status | Next action |
| --- | --- | --- | --- |
| connector-workflow-live-crud-runs | high | blocked | Run a disposable create->read-verify->update->rollback execution for the WorkspaceOps template, then clone the same hash-only ledger schema to Playbasis mechanics writes. |
| connector-workflow-private-adapter-contracts | high | needs-private-adapter | Implement private adapter workflow clones for 24 pending read contracts, then emit hash-only telemetry. |
| activation-blocked:events-ingest | high | blocked | Run next proof for events-ingest: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes. Missing requirements: PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, --allow-write-probes. |
| activation-blocked:experiments | high | blocked | Run next proof for experiments: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes. Missing requirements: PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, --allow-write-probes. |
| activation-blocked:campaigns | medium | blocked | Run next proof for campaigns: pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id. Missing requirements: PBOS_PROBE_CAMPAIGN_ID. |
| activation-blocked:webhooks | high | blocked | Run next proof for webhooks: pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes. Missing requirements: PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, PBOS_PROBE_WEBHOOK_URL, --allow-write-probes. |
| private-adapter:baby-app | high | needs-private-adapter | Add baby-app private adapter fixtures that emit SafeProbeEvidence shape without live payloads. |
| private-adapter:health | high | needs-private-adapter | Enable or verify feature flag(s) health for 4 failed safe-read probes before claiming health domain availability. |
| feature-flag-blocked:billing | high | blocked | Enable or verify feature flag billing in staging, then rerun safe read probes for 1 source-backed operation. Command: pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing. |
| feature-flag-blocked:health | high | blocked | Enable or verify feature flag health in staging, then rerun safe read probes for 4 source-backed operations. Command: pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing. |
| openapi-source-backed-staging-404 | high | blocked | Enable or verify the staging feature flags for the source-backed 404 routes, then rerun `pnpm pbos audit probe-backlog --profile staging-sandbox --include-identifier-reads --allow-failing`. |
| real-blind-value-review | high | needs-external-review | Run the preregistered value experiment with real blind reviewers, timing rows, costs, losses, and zero-leak scan. |
| workspaceops-ceo-sim-private-primitive | medium | needs-private-adapter | Run one private WorkspaceOps CEO-sim primitive through a hash-only adapter and compare against fixture policy arms. |
| oss-clean-export-verification | high | blocked | Run pbos export-oss-candidate --verify and require install/typecheck/test/scan inside a clean export copy. |

## Claim Boundary
Current public claim: evidence-gated autonomy infrastructure benchmark/kernel

Not yet proven:
- AGI
- ASI
- SOTA super-agent
- measured economic value
- external benchmark win

Completion requires:
- Disposable staging write probes for events-ingest, experiments, campaigns, and webhooks where applicable.
- Connector workflow create->verify->update->rollback runs with idempotency, replay, and rollback hashes.
- Staging feature flags enabled or verified for source-backed OpenAPI routes before counting them as live safe-read proof.
- Private Baby App and Health adapters that emit SafeProbeEvidence without payload bodies.
- Real blind human/external review rows before claiming measured economic value.
- External benchmark or customer evidence before claiming SOTA or market superiority.
