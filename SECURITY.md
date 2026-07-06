# Security Policy

## Reporting a Vulnerability

Please report suspected vulnerabilities privately via
**GitHub Security Advisories** ("Report a vulnerability" on the repository's
Security tab). Do not open a public issue for anything that could expose
credentials, private data, or an exploitable path.

We will acknowledge reports within 5 business days. Please include steps to
reproduce, the affected package or command, and the profile
(`fixture` / `local-monorepo` / `staging-sandbox`) involved.

## Scope Notes for This Repository

This harness is designed around explicit data boundaries. Reports are
especially valuable if you find any of the following, each of which is a
violation of the project's stated guarantees:

- credential values, `.env*` content, or provider secrets appearing in any
  tracked file, trace, artifact, or report;
- raw provider request/response bodies or unhashed provider identifiers in
  public artifacts (hash-only telemetry is the contract);
- held-out eval bodies or answer keys reachable from public files or exposed
  to an optimizing agent at run time;
- content from `raw-donors/` or private connectors appearing in the OSS
  export produced by `pnpm pbos export-oss-candidate`;
- a path by which a non-fixture profile can perform live writes without its
  explicit allow-flags and environment gates.

## Hardening Facts

- The `fixture` profile makes no network, database, or LLM calls.
- Env values are loaded in memory only, whitelisted per profile, redacted in
  traces, and scanned before artifacts are written.
- Every evidence pack carries a secret-redaction check; runs failing the scan
  are not promoted.
