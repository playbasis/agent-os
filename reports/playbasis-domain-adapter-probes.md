# Playbasis Domain Adapter Probes

- Profile: staging-sandbox
- Mode: safe-live-readonly
- Status: warn
- Adapter families: 3
- Safe read probes: 4/14
- Safe read target met: false
- Blocked private operations: 10
- Private read adapter contracts: 24
- Private read adapter contracts verified: 0
- Private read adapter contracts pending: 24
- Safe-live families: 1
- Fixture families: 0
- Raw URLs included: false
- Raw payloads included: false
- Request bodies included: false
- Response bodies included: false
- Env values included: false
- Claim boundary: Hash-only private-domain adapter probe evidence; this does not prove full private adapter completion.

| Family | Tool | Operation | Adapter mode | Status | OK | Blocked reason |
| --- | --- | --- | --- | --- | --- | --- |
| baby-app | baby-app.state.inspect | babyGetState | safe-read-preflight | 401 | false | none |
| baby-app | baby-app.billing.entitlement.inspect | babyGetBillingEntitlement | safe-read-preflight | 401 | false | none |
| baby-app | baby-app.magic-albums.inspect | babyListMagicAlbums | safe-read-preflight | 401 | false | none |
| baby-app | baby-app.projection.jobs.inspect | babyListProjectionJobs | safe-read-preflight | 401 | false | none |
| baby-app | baby-app.account.export.inspect | babyExportAccount | private-auth-required | blocked | false | private-auth-required |
| baby-app | baby-app.session.inspect | babyGetSession | private-auth-required | blocked | false | private-auth-required |
| baby-app | baby-app.magic-album.detail.inspect | babyGetMagicAlbum | identifier-required | blocked | false | identifier-required |
| baby-app | baby-app.projection.job.detail.inspect | babyGetProjectionJob | identifier-required | blocked | false | identifier-required |
| health | health.departments.inspect | listHealthDepartments | safe-read-preflight | 404 | false | none |
| health | health.providers.inspect | listHealthProviders | safe-read-preflight | 404 | false | none |
| health | health.content.inspect | listHealthContent | safe-read-preflight | 404 | false | none |
| health | health.milestones.inspect | listHealthMilestones | safe-read-preflight | 404 | false | none |
| health | health.appointment-packages.inspect | listHealthAppointmentPackages | safe-read-preflight | 404 | false | none |
| health | health.appointment-slots.inspect | listHealthAppointmentSlots | safe-read-preflight | 404 | false | none |
| health | health.appointments.private.inspect | listHealthAppointments | private-auth-required | blocked | false | private-auth-required |
| health | health.care-plans.private.inspect | listHealthCarePlans | private-auth-required | blocked | false | private-auth-required |
| health | health.care-plan.detail.inspect | getHealthCarePlan | identifier-required | blocked | false | identifier-required |
| health | health.content.detail.inspect | getHealthContent | identifier-required | blocked | false | identifier-required |
| health | health.patient.detail.inspect | getHealthPatientDetail | identifier-required | blocked | false | identifier-required |
| health | health.tree.state.inspect | getHealthTreeState | identifier-required | blocked | false | identifier-required |
| booking | booking.availability-rules.inspect | listBookingAvailabilityRules | safe-read-preflight | 200 | true | none |
| booking | booking.locations.inspect | listBookingLocations | safe-read-preflight | 200 | true | none |
| booking | booking.resources.inspect | listBookingResources | safe-read-preflight | 200 | true | none |
| booking | booking.schedules.inspect | listBookingSchedules | safe-read-preflight | 200 | true | none |

## Private Read Adapter Contracts

| Family | Tool | Operation | Operation ID | Contract status | Code boundary | Telemetry |
| --- | --- | --- | --- | --- | --- | --- |
| baby-app | baby-app.export-account.inspect | GET account/export | babyExportAccount | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.session.inspect | GET auth/session | babyGetSession | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.billing.entitlement.inspect | GET billing/entitlement | babyGetBillingEntitlement | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.magic-albums.inspect | GET magic-albums | babyListMagicAlbums | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.magic-album.detail.inspect | GET magic-albums/{albumId} | babyGetMagicAlbum | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.projection.jobs.inspect | GET projections/jobs | babyListProjectionJobs | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.projection.job.detail.inspect | GET projections/jobs/{sessionId} | babyGetProjectionJob | pending-private-implementation | private-repo-only | hash-only |
| baby-app | baby-app.state.inspect | GET state | babyGetState | pending-private-implementation | private-repo-only | hash-only |
| health | health.care-plans.inspect | GET health/care-plans | listHealthCarePlans | pending-private-implementation | private-repo-only | hash-only |
| health | health.care-plan.detail.inspect | GET health/care-plans/{carePlanId} | getHealthCarePlan | pending-private-implementation | private-repo-only | hash-only |
| health | health.coach.history.inspect | GET health/coach/history | listHealthCoachHistory | pending-private-implementation | private-repo-only | hash-only |
| health | health.consent.logs.inspect | GET health/consent/logs | listHealthConsentLogs | pending-private-implementation | private-repo-only | hash-only |
| health | health.content.detail.inspect | GET health/content/{contentId} | getHealthContent | pending-private-implementation | private-repo-only | hash-only |
| health | health.family.members.inspect | GET health/family/members | listHealthFamilyMembers | pending-private-implementation | private-repo-only | hash-only |
| health | health.labs.inspect | GET health/labs | listHealthLabReports | pending-private-implementation | private-repo-only | hash-only |
| health | health.metrics.inspect | GET health/metrics | listHealthMetrics | pending-private-implementation | private-repo-only | hash-only |
| health | health.notifications.preferences.inspect | GET health/notifications/preferences | listHealthNotificationPreferences | pending-private-implementation | private-repo-only | hash-only |
| health | health.patients.inspect | GET health/patients | listHealthPatients | pending-private-implementation | private-repo-only | hash-only |
| health | health.patient.detail.inspect | GET health/patients/{patientId} | getHealthPatientDetail | pending-private-implementation | private-repo-only | hash-only |
| health | health.phi.access.inspect | GET health/phi/access | listHealthPhiAccessLogs | pending-private-implementation | private-repo-only | hash-only |
| health | health.profile.inspect | GET health/profile | getHealthProfile | pending-private-implementation | private-repo-only | hash-only |
| health | health.staff.roles.inspect | GET health/staff/roles | listHealthStaffRoles | pending-private-implementation | private-repo-only | hash-only |
| health | health.tree.state.inspect | GET health/tree/{schoolId} | getHealthTreeState | pending-private-implementation | private-repo-only | hash-only |
| health | health.triage.inspect | GET health/triage | listHealthTriage | pending-private-implementation | private-repo-only | hash-only |
