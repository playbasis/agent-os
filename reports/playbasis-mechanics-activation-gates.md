# Playbasis Mechanics Activation Gates

- Generated: 2026-07-06T05:44:48.990Z
- Profile checked: staging-sandbox
- Source report hash: 302a327d3cfe2d3603ea2679baad4e8b0ae8d827d42560bcc25f1c4ae9b6dbde
- Ready gates: 0/4
- Create-verify-rollback plans: 4/4
- Recorded create-verify-rollback runs: 0/4
- Blocked create-verify-rollback runs: 4
- Disposable-sandbox rollback boundaries: 3
- Missing required env keys: PBOS_ALLOW_WRITE_PROBES, PBOS_PROBE_CAMPAIGN_ID, PBOS_PROBE_WEBHOOK_URL, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID
- Missing required operator flags: --allow-write-probes
- Claim boundary: Activation readiness for Playbasis mechanics gates; live proof still requires SafeProbeEvidence.

| Capability | Activation status | Readiness | Owner | Missing env keys | Missing flags | Rollback policy | Next command |
| --- | --- | --- | --- | --- | --- | --- | --- |
| events-ingest | write-probe-gated | missing-required-env | Playbasis API / Events | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | disposable-sandbox-boundary | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| experiments | write-probe-gated | missing-required-env | Playbasis API / Experiments | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID | --allow-write-probes | disposable-sandbox-boundary | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| campaigns | identifier-required | missing-required-env | Playbasis API / Campaigns | PBOS_PROBE_CAMPAIGN_ID | none | read-only-identifier-lifecycle | pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id |
| webhooks | write-probe-gated | missing-required-env | Playbasis API / Webhooks | PBOS_ALLOW_WRITE_PROBES, PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, PBOS_WRITE_PROBE_SANDBOX_ID, PBOS_PROBE_WEBHOOK_URL | --allow-write-probes | disposable-sandbox-boundary | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |

## Create Verify Rollback Checklist

| Capability | Phase | Status | Blocked by | Action | Command |
| --- | --- | --- | --- | --- | --- |
| events-ingest | create | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Create one disposable events-ingest probe record in the staging sandbox. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| events-ingest | verify | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Verify the events-ingest write through SafeProbeEvidence and top-level response metadata only. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| events-ingest | rollback | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Discard the disposable sandbox tenant/namespace that received the event write; OpenAPI has no event delete rollback path. | dispose-sandbox-or-private-lifecycle-step |
| experiments | create | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Create one disposable experiments probe record in the staging sandbox. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| experiments | verify | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Verify the experiments write through SafeProbeEvidence and top-level response metadata only. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| experiments | rollback | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, flag:--allow-write-probes | Discard the disposable sandbox tenant/namespace used for the experiment or bandit write; do not write to durable tenant experiments. | dispose-sandbox-or-private-lifecycle-step |
| campaigns | create | blocked | env:PBOS_PROBE_CAMPAIGN_ID | Select or seed a disposable campaign identifier and prove it is safe for read-only inspection. | pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id |
| campaigns | verify | blocked | env:PBOS_PROBE_CAMPAIGN_ID | Verify the disposable campaign lookup through SafeProbeEvidence. | pnpm pbos mechanics probe --profile staging-sandbox; if the campaign default candidate returns 404, rerun after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id |
| campaigns | rollback | blocked | env:PBOS_PROBE_CAMPAIGN_ID | Expire, delete, or abandon only the disposable probe campaign through the private seed/admin path; never use a real campaign id. | dispose-sandbox-or-private-lifecycle-step |
| webhooks | create | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, env:PBOS_PROBE_WEBHOOK_URL, flag:--allow-write-probes | Create one disposable webhooks probe record in the staging sandbox. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| webhooks | verify | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, env:PBOS_PROBE_WEBHOOK_URL, flag:--allow-write-probes | Verify the webhooks write through SafeProbeEvidence and top-level response metadata only. | pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes |
| webhooks | rollback | blocked | env:PBOS_ALLOW_WRITE_PROBES, env:PBOS_WRITE_PROBE_DISPOSABLE_SANDBOX, env:PBOS_WRITE_PROBE_SANDBOX_ID, env:PBOS_PROBE_WEBHOOK_URL, flag:--allow-write-probes | Use a disposable webhook destination and sandbox namespace, then discard the destination and sandbox record after verification. | dispose-sandbox-or-private-lifecycle-step |

Safety: this report includes env key names and readiness booleans only. It does not include env values, env value hashes, raw payloads, request bodies, response bodies, raw URLs, or tenant data.
