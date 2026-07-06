# Activation Replay Execution

- Generated: 2026-07-05T23:02:15.987Z
- Profile: staging-sandbox
- Mode: safe-execution
- Replay from: openapi-safe-read-reprobe
- Next safe command: pnpm pbos audit scorecard --profile staging-sandbox && pnpm pbos audit route-diagnosis --profile staging-sandbox && pnpm pbos audit domain-adapters --profile staging-sandbox
- Planned steps: 10
- Executed safe commands: 9
- Passed safe commands: 9
- Failed safe commands: 0
- Skipped plan steps: 8
- Zero leak: true

## Planned Step Results
| Step | Kind | Plan Status | Execution Status | Commands | Missing Env Keys | Missing Flags | Feature Flags |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| feature-flag:billing | feature-flag | blocked | skipped-blocked | 0 | none | none | billing |
| feature-flag:health | feature-flag | blocked | skipped-blocked | 0 | none | none | health |
| openapi-safe-read-reprobe | safe-read-reprobe | waiting-on-upstream | executed | 4 | none | none | billing, health |
| write-activation:events-ingest | write-probe | blocked | skipped-blocked | 0 | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | none |
| write-activation:experiments | write-probe | blocked | skipped-blocked | 0 | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | none |
| write-activation:campaigns | write-probe | blocked | skipped-blocked | 0 | PBOS_PROBE_CAMPAIGN_ID | none | none |
| write-activation:webhooks | write-probe | blocked | skipped-blocked | 0 | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, PBOS_PROBE_WEBHOOK_URL | --allow-write-probes | none |
| private-adapter:baby-app | private-adapter | blocked | skipped-blocked | 0 | none | none | none |
| private-adapter:health | private-adapter | blocked | skipped-blocked | 0 | none | none | health |
| rebuild-proof-surfaces | rebuild-proof-surfaces | waiting-on-upstream | executed | 5 | none | none | none |

## Safe Command Evidence
| Step | Command | Status | OK | Duration Ms | Stdout Hash | Stderr Hash | Failure |
| --- | --- | ---: | --- | ---: | --- | --- | --- |
| openapi-safe-read-reprobe | pnpm pbos audit probe-backlog --include-identifier-reads --allow-failing | 0 | true | 2093 | `5f7763f35c82f8ab...` | `e3b0c44298fc1c14...` | none |
| openapi-safe-read-reprobe | pnpm pbos audit scorecard | 0 | true | 888 | `2ba9daf5e265c35e...` | `e3b0c44298fc1c14...` | none |
| openapi-safe-read-reprobe | pnpm pbos audit route-diagnosis | 0 | true | 2491 | `09bbeb23e3139cb9...` | `e3b0c44298fc1c14...` | none |
| openapi-safe-read-reprobe | pnpm pbos audit domain-adapters | 0 | true | 872 | `7e1556a4c94de52e...` | `e3b0c44298fc1c14...` | none |
| rebuild-proof-surfaces | pnpm pbos audit wiring | 0 | true | 410 | `9eef2a966daf5366...` | `e3b0c44298fc1c14...` | none |
| rebuild-proof-surfaces | pnpm sandbox:build | 0 | true | 939 | `81e148e634272254...` | `e3b0c44298fc1c14...` | none |
| rebuild-proof-surfaces | pnpm pbos runs:index | 0 | true | 1202 | `a57c8cd41128303d...` | `e3b0c44298fc1c14...` | none |
| rebuild-proof-surfaces | pnpm pbos knowledge compile | 0 | true | 416 | `4236a57bd4ab8a32...` | `e3b0c44298fc1c14...` | none |
| rebuild-proof-surfaces | pnpm pbos knowledge lint | 0 | true | 391 | `1c12766a2737357c...` | `e3b0c44298fc1c14...` | none |

This report stores command labels, statuses, timings, and stdout/stderr hashes only. It does not store stdout, stderr, env values, request bodies, response bodies, raw URLs, provider payloads, or private adapter bodies.
