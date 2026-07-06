# OpenAPI Route Diagnosis

Generated At: 2026-07-05T23:02:09.649Z

Profile: staging-sandbox

## Summary
- Diagnosed operations: 79
- Failed safe-read operations: 5
- Source-backed staging 404 operations: 5
- Source-backed not-probed operations: 0
- Contract-only operations: 0
- Private-adapter-required operations: 24
- Write-gated operations: 49
- Identifier-resolver-needed operations: 1
- No platform source found operations: 0
- Generated-client-backed operations: 79
- API-controller-backed operations: 78
- Domain-client-backed operations: 17
- Feature-flag-guarded operations: 34
- Feature-flag-guarded staging 404 operations: 5
- Module-imported staging 404 operations: 0
- Zero leak: true

## Representative Diagnoses
| Operation | Operation ID | Probe class | Last probe | Diagnosis | Exposure | Source labels |
| --- | --- | --- | --- | --- | --- | --- |
| GET /billing/plans | listBillingPlans | safe-read-probe-candidate | 404 | source-backed-staging-404 | feature-flag-gated | playbasis-platform/apps/admin-portal/src/data/billing.ts<br>playbasis-platform/apps/api/src/billing/billing.controller.ts<br>playbasis-platform/apps/api/src/billing/billing.service.ts |
| GET /health/appointments/packages | listHealthAppointmentPackages | safe-read-probe-candidate | 404 | source-backed-staging-404 | feature-flag-gated | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-mobile/src/api/booking-growth.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts |
| GET /health/content | listHealthContent | safe-read-probe-candidate | 404 | source-backed-staging-404 | feature-flag-gated | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/apps/health-portal/src/api/useHealthData.ts |
| GET /health/departments | listHealthDepartments | safe-read-probe-candidate | 404 | source-backed-staging-404 | feature-flag-gated | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-mobile/src/api/booking-growth.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts |
| GET /health/milestones | listHealthMilestones | safe-read-probe-candidate | 404 | source-backed-staging-404 | feature-flag-gated | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /admin/bandits/{key}/arms | getBanditArms | identifier-required | n/a | identifier-resolver-needed | identifier-needed | playbasis-platform/apps/api/src/bandits/bandits.controller.ts<br>playbasis-platform/apps/api/src/bandits/bandits.service.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts |
| GET /account/export | babyExportAccount | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| GET /auth/session | babyGetSession | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| GET /billing/entitlement | babyGetBillingEntitlement | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| GET /magic-albums | babyListMagicAlbums | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts |
| GET /magic-albums/{albumId} | babyGetMagicAlbum | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts |
| GET /projections/jobs | babyListProjectionJobs | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| GET /projections/jobs/{sessionId} | babyGetProjectionJob | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| GET /state | babyGetState | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/admin-portal/src/data/games.ts<br>playbasis-platform/apps/admin-portal/src/lib/agentic/campaign/orchestrator.ts<br>playbasis-platform/apps/admin-portal/src/lib/agentic/geminiDeepResearch.ts |
| GET /health/care-plans | listHealthCarePlans | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/apps/health-portal/src/api/useHealthData.ts |
| GET /health/care-plans/{carePlanId} | getHealthCarePlan | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/coach/history | listHealthCoachHistory | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/consent/logs | listHealthConsentLogs | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/content/{contentId} | getHealthContent | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/family/members | listHealthFamilyMembers | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-mobile/src/api/booking-growth.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts |
| GET /health/labs | listHealthLabReports | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/metrics | listHealthMetrics | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/notifications/preferences | listHealthNotificationPreferences | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/patients | listHealthPatients | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/apps/health-portal/src/api/useHealthData.ts |
| GET /health/patients/{patientId} | getHealthPatientDetail | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts |
| GET /health/phi/access | listHealthPhiAccessLogs | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/profile | getHealthProfile | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/staff/roles | listHealthStaffRoles | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/apps/health-portal/src/api/useHealthData.ts |
| GET /health/tree/{schoolId} | getHealthTreeState | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health-tree.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/health/health.ts |
| GET /health/triage | listHealthTriage | domain-adapter-needed | n/a | private-adapter-required | private-adapter | playbasis-platform/apps/api/src/health/health.controller.ts<br>playbasis-platform/apps/health-portal/src/api/healthClient.ts<br>playbasis-platform/apps/health-portal/src/api/useHealthData.ts |
| DELETE /account | babyDeleteAccount | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/admin-portal/src/data/prompts.ts<br>playbasis-platform/apps/admin-portal/src/lib/agentic/playbasisContext.ts<br>playbasis-platform/apps/admin-portal/src/lib/agentic/quick-start-templates.ts |
| POST /ai-text/chat | babyAiChat | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /ai-text/chat-starters | babyAiChatStarters | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /ai-text/explanation | babyAiExplanation | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /ai-text/weekly-insight | babyAiWeeklyInsight | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /auth/google/link | babyLinkGoogleSession | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /auth/google/session | babyCreateGoogleSession | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /auth/guest/session | babyCreateGuestSession | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /auth/refresh | babyRefreshSession | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |
| POST /auth/sign-out | babySignOut | write-probe-gated | n/a | write-gated | write-gated | playbasis-platform/apps/api/src/baby/baby.controller.ts<br>playbasis-platform/packages/client/src/generated/openapi.ts<br>playbasis-platform/packages/client/src/generated/orval/baby-app/baby-app.ts |

This report diagnoses why OpenAPI backlog operations are not yet live proof. It stores route/source labels and probe statuses only; it does not include raw URLs, request bodies, response bodies, env values, tenant data, or private payloads.
