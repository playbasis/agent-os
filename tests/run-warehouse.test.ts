import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildRunWarehouseIndex,
  queryRunWarehouse,
  summarizeRunWarehouse,
  writeRunWarehouseIndex
} from "@playbasis-agent-os/run-warehouse";

describe("run warehouse", () => {
  it("indexes runs, traces, artifacts, evals, proof reports, service probes, and lineage", async () => {
    const repoRoot = await mkdtemp(path.join(os.tmpdir(), "pbos-warehouse-"));
    const runDir = path.join(repoRoot, "runs/mission-candidate-1-run");
    await mkdir(runDir, { recursive: true });
    await writeJson(path.join(runDir, "evidence.json"), evidence());
    await writeJson(path.join(runDir, "artifacts/playbasis-mechanics-activation-gates.json"), mechanicsActivationReadiness());
    await writeJson(path.join(runDir, "artifacts/agent-loop-mechanics-ledger.json"), agentLoopMechanicsLedger());
    await writeFile(path.join(runDir, "trace.jsonl"), [
      JSON.stringify({ type: "run.started" }),
      JSON.stringify({ type: "step.completed" }),
      JSON.stringify({ type: "run.completed" })
    ].join("\n"), "utf8");
    await writeJson(path.join(repoRoot, "runs/value-proof/value-proof-report.json"), valueProof());
    await writeJson(path.join(repoRoot, "runs/optimization/optimization-report.json"), optimizationReport());
    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-coverage.json"), mechanicsCoverage());
    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-activation-gates.json"), mechanicsActivationReadiness());
    await writeJson(path.join(repoRoot, "reports/workspaceops-ceo-sim-adapter.json"), workspaceOpsCeoSimAdapter());
    await writeJson(path.join(repoRoot, "reports/workspaceops-ceo-sim-policy-experiment.json"), workspaceOpsCeoSimPolicyExperiment());
    await writeJson(path.join(repoRoot, "reports/workspaceops-ceo-sim-repair-quest.json"), workspaceOpsCeoSimRepairQuest());
    await writeJson(path.join(repoRoot, "reports/workspaceops-ceo-sim-delta-replay.json"), workspaceOpsCeoSimDeltaReplay());
    await writeJson(path.join(repoRoot, "reports/workspaceops-ceo-sim-delta-heldout.json"), workspaceOpsCeoSimDeltaHeldoutReview());
    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-heldout-score.json"), mechanicsSensitiveHeldout());
    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-outcome-attribution.json"), mechanicsOutcomeAttribution());
	    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-intervention-experiment.json"), mechanicsInterventionExperiment());
	    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-replicated-intervention.json"), mechanicsReplicatedIntervention());
	    await writeJson(path.join(repoRoot, "reports/playbasis-mechanics-blind-causal-review.json"), mechanicsBlindCausalReview());
	    await writeJson(path.join(repoRoot, "reports/agent-loop-mechanics-ledger.json"), agentLoopMechanicsLedger());

    const index = await buildRunWarehouseIndex({ repoRoot });
    const summary = summarizeRunWarehouse(index);
    const matches = queryRunWarehouse(index, { profile: "fixture", minHeldOutScore: 0.8 });
    const activationBlockedMatches = queryRunWarehouse(index, {
      mechanicsActivationReady: false,
      mechanicsActivationMissingEnvKey: "PBOS_PROBE_CAMPAIGN_ID",
      mechanicsActivationMissingOperatorFlag: "--allow-write-probes"
    });
    const activationReadyMatches = queryRunWarehouse(index, { mechanicsActivationReady: true });
    const agentLoopLedgerMatches = queryRunWarehouse(index, {
      agentLoopLedgerWired: true,
      agentLoopMechanic: "rewards",
      agentLoopPromotionDecision: "candidate-ready-heldout-review",
      agentLoopMinLiveBackedRecords: 10,
      agentLoopMaxBlockedRecords: 2
    });
    const agentLoopIncompleteMatches = queryRunWarehouse(index, { agentLoopLedgerWired: false });
    const mechanicsHeldoutMatches = queryRunWarehouse(index, {
      mechanicsSensitiveHeldoutReady: true,
      minMechanicsSensitiveHeldoutLift: 0.8
    });
    const mechanicsEvidenceMatches = queryRunWarehouse(index, {
      playbasisMechanicsCausalProofReady: false,
      minPlaybasisLiveMechanics: 2,
      minOutcomeLinkedMechanics: 2
    });
    const written = await writeRunWarehouseIndex({ repoRoot });

    expect(index.counts.runs).toBe(1);
    expect(index.counts.traces).toBe(1);
    expect(index.counts.artifacts).toBe(1);
    expect(index.counts.evals).toBe(4);
    expect(index.counts.proofReports).toBe(1);
    expect(index.counts.optimizationSessions).toBe(1);
    expect(index.counts.serviceProbes).toBe(11);
    expect(index.counts.parentChildRunEdges).toBe(1);
    expect(matches).toHaveLength(1);
    expect(activationBlockedMatches).toHaveLength(1);
    expect(activationReadyMatches).toHaveLength(0);
    expect(agentLoopLedgerMatches).toHaveLength(1);
    expect(agentLoopIncompleteMatches).toHaveLength(0);
    expect(mechanicsHeldoutMatches).toHaveLength(1);
    expect(mechanicsEvidenceMatches).toHaveLength(1);
    expect(index.runs[0]?.mechanicsActivationReadiness).toMatchObject({
      profile: "staging-sandbox",
      totalGates: 2,
      blockedGates: 2,
      allReady: false,
      relativePath: "mission-candidate-1-run/artifacts/playbasis-mechanics-activation-gates.json"
    });
    expect(index.runs[0]?.mechanicsActivationReadiness?.missingRequiredEnvKeys).toEqual(expect.arrayContaining([
      "PBOS_PROBE_CAMPAIGN_ID",
      "PBOS_PROBE_WEBHOOK_URL"
    ]));
    expect(JSON.stringify(index.runs[0]?.mechanicsActivationReadiness)).not.toContain("https://secret.example");
    expect(JSON.stringify(index.runs[0]?.mechanicsActivationReadiness)).not.toContain("super-secret-webhook");
    expect(index.runs[0]?.agentLoopMechanicsLedger).toMatchObject({
      profile: "local-monorepo",
      mechanicsCovered: 16,
      requiredMechanics: 16,
      totalRecords: 41,
      liveBackedRecords: 13,
      blockedRecords: 2,
      promotionDecision: "candidate-ready-heldout-review",
      zeroLeak: true,
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false,
      relativePath: "mission-candidate-1-run/artifacts/agent-loop-mechanics-ledger.json"
    });
    expect(index.runs[0]?.agentLoopMechanicsLedger?.mechanics).toEqual(expect.arrayContaining([
      "events",
      "rewards",
      "workspaceops"
    ]));
    expect(index.runs[0]?.agentLoopMechanicsLedger?.missingMechanics).toEqual([]);
    expect(summary.averageScores.heldOut).toBe(0.9);
    expect(summary.serviceFamilies["playbasis-api"]).toEqual({ ok: 2, total: 3 });
    expect(summary.serviceFamilies.workspaceops).toEqual({ ok: 7, total: 7 });
    expect(summary.serviceFamilies.provider).toEqual({ ok: 1, total: 1 });
    expect(summary.mechanicsCoverage).toMatchObject({
      profile: "staging-sandbox",
      status: "ok",
      apiSuccessfulCalls: 1,
      apiTotalCalls: 2,
      workspaceSuccessfulCalls: 1,
      workspaceTotalCalls: 1,
      safeLiveProbeMechanics: 2,
      rawPayloadsIncluded: false,
      envValuesIncluded: false
    });
    expect(summary.mechanicsCoverage?.liveRecordedMechanics).toEqual(expect.arrayContaining(["events", "workspaceops"]));
    expect(index.mechanicsActivationReadiness).toMatchObject({
      profile: "staging-sandbox",
      readyGates: 0,
      totalGates: 2,
      blockedGates: 2,
      writeGatedCapabilities: 1,
      identifierRequiredCapabilities: 1,
      allReady: false,
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    });
    expect(summary.mechanicsActivationReadiness?.missingRequiredEnvKeys).toEqual(expect.arrayContaining([
      "PBOS_ALLOW_WRITE_PROBES",
      "PBOS_PROBE_CAMPAIGN_ID",
      "PBOS_PROBE_WEBHOOK_URL"
    ]));
    expect(summary.mechanicsActivationReadiness?.missingRequiredOperatorFlags).toEqual(["--allow-write-probes"]);
    expect(JSON.stringify(summary.mechanicsActivationReadiness)).not.toContain("https://secret.example");
    expect(JSON.stringify(summary.mechanicsActivationReadiness)).not.toContain("super-secret-webhook");
    expect(summary.mechanicsActivationReadinessRuns).toMatchObject({
      runsWithReadiness: 1,
      readyRuns: 0,
      blockedRuns: 1,
      missingRequiredOperatorFlags: ["--allow-write-probes"],
      latest: {
        runId: "mission-candidate-1-run",
        profile: "fixture",
        readyGates: 0,
        totalGates: 2,
        blockedGates: 2,
        allReady: false,
        relativePath: "mission-candidate-1-run/artifacts/playbasis-mechanics-activation-gates.json"
      }
    });
    expect(summary.mechanicsActivationReadinessRuns.missingRequiredEnvKeys).toEqual(expect.arrayContaining([
      "PBOS_ALLOW_WRITE_PROBES",
      "PBOS_PROBE_CAMPAIGN_ID",
      "PBOS_PROBE_WEBHOOK_URL"
    ]));
    expect(summary.workspaceOpsCeoSimAdapter).toMatchObject({
      profile: "local-monorepo",
      status: "warn",
      mode: "local-monorepo-script",
      exercisedRealSurface: true,
      commandExecuted: true,
      exitCode: 0,
      passedChecks: 120,
      failedChecks: 1,
      failedCheckIds: ["matrix:smart-score-variance"],
      scenarioReportCount: 7,
      matrixCheckCount: 14,
      redactionLeaks: 0,
      rawStdoutIncluded: false,
      rawStderrIncluded: false
    });
    expect(summary.workspaceOpsCeoSimAdapter?.improvementTargets[0]).toMatchObject({
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      severity: "warn",
      playbasisMechanics: expect.arrayContaining(["experiments", "rulesets", "leaderboards", "workspaceops"])
    });
    expect(summary.workspaceOpsCeoSimPolicyExperiment).toMatchObject({
      profile: "local-monorepo",
      status: "warn",
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      targetResolved: false,
      targetObserved: 47.2,
      targetThreshold: 60,
      suiteExitCode: 0,
      variantCount: 1,
      selectedVariantId: "standard-smart",
      promoted: false,
      redactionLeaks: 0,
      rawStdoutIncluded: false,
      rawStderrIncluded: false,
      rawDayLogsIncluded: false
    });
    expect(summary.workspaceOpsCeoSimPolicyExperiment?.mechanics).toEqual(expect.arrayContaining(["events", "experiments", "rulesets", "workspaceops"]));
    expect(summary.workspaceOpsCeoSimRepairQuest).toMatchObject({
      profile: "local-monorepo",
      status: "open",
      questId: "ceo-sim-repair-fixture",
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      targetResolved: false,
      selectedVariantId: "standard-smart",
      promoted: false,
      targetObserved: 47.2,
      targetThreshold: 60,
      recordedMechanics: 10,
      totalMechanics: 16,
      blockedMechanics: 2,
      plannedMechanics: 4,
      redactionLeaks: 0,
      rawExperimentBodyIncluded: false,
      rawSimulatorBodyIncluded: false
    });
    expect(summary.workspaceOpsCeoSimRepairQuest?.mechanics).toEqual(expect.arrayContaining(["events", "points", "xp", "quests", "rulesets", "adjudications", "experiments", "feedback", "credits", "leaderboards", "cohorts", "campaigns", "rewards", "webhooks", "analytics", "workspaceops"]));
    expect(summary.workspaceOpsCeoSimDeltaReplay).toMatchObject({
      profile: "local-monorepo",
      status: "ok",
      mode: "local-temp-patch",
      baselineObserved: 59.2,
      selectedDeltaId: "score-sign-reject",
      selectedDeltaResolvedTarget: true,
      selectedDeltaRequiresPlatformPatch: true,
      promotionDecision: "candidate-ready-heldout-review",
      deltaCount: 2,
      resolvedDeltaCount: 1,
      tempFilesDeleted: true,
      platformSourceMutated: false,
      rawPatchedSourceIncluded: false,
      redactionLeaks: 0
    });
    expect(summary.workspaceOpsCeoSimDeltaHeldoutReview).toMatchObject({
      profile: "local-monorepo",
      status: "ok",
      mode: "scorer-only-private-bundle",
      candidateDeltaId: "score-sign-reject",
      selectedDeltaResolvedTarget: true,
      heldOutExists: true,
      heldOutOutsideRepo: true,
      heldOutFileCount: 2,
      privateScorerInputsRead: true,
      score: 0.94,
      threshold: 0.8,
      pass: true,
      casesScored: 12,
      casesPassed: 11,
      casesFailed: 1,
      promotionDecision: "promote-to-platform-patch-review",
      redactionLeaks: 0,
      rawHeldOutBodiesIncluded: false,
      rawAnswerKeysIncluded: false
    });
    expect(index.mechanicsSensitiveHeldout).toMatchObject({
      profile: "fixture",
      familyId: "playbasis-mechanics-heldout-v1",
      scorerMode: "scorer-only-private-bundle",
      claimStatus: "mechanics-sensitive-heldout-smoke",
      genericEvalCeilingDetected: true,
      genericHeldOutLift: 0,
      mechanicsSensitiveHeldOutLift: 0.875,
      mechanicsExecutionLift: 0.74,
      controlRunId: "mechanics-control-run",
      treatmentRunId: "mechanics-treatment-run",
      controlScore: 0.125,
      treatmentScore: 1,
      nonSaturatedMeasurementReady: true,
      scorerDistinguishesTreatment: true,
      candidateReadyForBlindReplication: true,
      causalProofReady: false,
      zeroLeak: true,
      privateBundleProvided: true,
      privateBundleOutsideRepo: true,
      privateBundleBodiesIncluded: false,
      privateBundleAnswerKeysIncluded: false,
      rawPayloadsIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false,
      envValuesIncluded: false,
      rawUrlsIncluded: false,
      privateBodiesIncluded: false,
      rawHeldOutCasesIncluded: false,
      answerKeysIncluded: false,
      rawArtifactBodiesIncluded: false,
      relativePath: "playbasis-mechanics-heldout-score.json"
    });
	    expect(summary.mechanicsSensitiveHeldout).toEqual(index.mechanicsSensitiveHeldout);
	    expect(summary.mechanicsSensitiveHeldout?.relativePath).toBe("playbasis-mechanics-heldout-score.json");
	    expect(summary.mechanicsSensitiveHeldout?.privateBundleBodiesIncluded).toBe(false);
	    expect(summary.mechanicsSensitiveHeldout?.privateBundleAnswerKeysIncluded).toBe(false);
	    expect(index.mechanicsBlindCausalReview).toMatchObject({
	      profile: "fixture",
	      familyId: "playbasis-mechanics-blind-causal-review-v1",
	      reviewMode: "fixture-simulated-review",
	      blindedPairCount: 3,
	      blindReviewRowsPresent: true,
	      fixtureOnly: true,
	      humanRowsPresent: false,
	      externalRowsPresent: false,
	      reviewerCount: 2,
	      reviewRowCount: 6,
	      reviewedPairCount: 3,
	      pairCoverageRate: 1,
	      treatmentPreferenceRate: 1,
	      blindExternalReviewReady: false,
	      causalProofReady: false,
	      zeroLeak: true,
	      rawReviewTextIncluded: false,
	      answerKeysIncluded: false,
	      treatmentControlMappingIncluded: false,
	      relativePath: "playbasis-mechanics-blind-causal-review.json"
	    });
	    expect(summary.mechanicsBlindCausalReview).toEqual(index.mechanicsBlindCausalReview);
	    expect(summary.playbasisMechanicsEvidence).toMatchObject({
	      claimStatus: "replicated-mechanics-sensitive-measurement-ready",
      profile: "staging-sandbox",
      liveRecordedMechanics: 2,
      recordedMechanics: 2,
      availableOnlyMechanics: 1,
      outcomeLinkedMechanics: 2,
      activationReady: false,
      readyActivationGates: 0,
      blockedActivationGates: 2,
      agentLoopLedgerWired: true,
      agentLoopLiveBackedRecords: 13,
      agentLoopBlockedRecords: 2,
      genericHeldOutLift: 0,
      mechanicsSensitiveHeldOutLift: 0.875,
      mechanicsExecutionLift: 0.74,
      nonSaturatedMeasurementReady: true,
	      replicatedMeasurementReady: true,
	      replicatedTreatmentWinRate: 1,
	      replicatedMedianMechanicsSensitiveHeldOutLift: 0.875,
	      blindReviewRowsPresent: true,
	      blindReviewReady: false,
	      blindReviewMode: "fixture-simulated-review",
	      blindReviewRows: 6,
	      blindReviewHumanRowsPresent: false,
	      blindReviewExternalRowsPresent: false,
	      blindReviewTreatmentPreferenceRate: 1,
	      candidateReadyForBlindReplication: true,
	      causalProofReady: false,
      zeroLeak: true
    });
    expect(summary.playbasisMechanicsEvidence?.blockers).toEqual(expect.arrayContaining([
      "activation-gates-blocked",
      "blind-external-causal-review-not-ready",
      "intervention-causal-proof-not-ready",
      "outcome-attribution-causal-proof-not-ready"
    ]));
    expect(summary.playbasisMechanicsEvidence?.relativePaths).toMatchObject({
      mechanicsCoverage: "playbasis-mechanics-coverage.json",
      activationReadiness: "playbasis-mechanics-activation-gates.json",
      outcomeAttribution: "playbasis-mechanics-outcome-attribution.json",
      interventionExperiment: "playbasis-mechanics-intervention-experiment.json",
	      mechanicsSensitiveHeldout: "playbasis-mechanics-heldout-score.json",
	      mechanicsReplicatedIntervention: "playbasis-mechanics-replicated-intervention.json",
	      mechanicsBlindCausalReview: "playbasis-mechanics-blind-causal-review.json",
	      agentLoopLedger: "agent-loop-mechanics-ledger.json"
	    });
    expect(summary.agentLoopMechanicsLedger).toMatchObject({
      profile: "local-monorepo",
      missionId: "workspaceops-launch-pack",
      runId: "reports-latest",
      status: "ok",
      totalRecords: 41,
      mechanicsCovered: 16,
      requiredMechanics: 16,
      liveBackedRecords: 13,
      localRuntimeRecords: 10,
      tempPatchRecords: 9,
      candidateReadyRecords: 7,
      blockedRecords: 2,
      plannedRecords: 4,
      promotionDecision: "candidate-ready-heldout-review",
      redactionLeaks: 0,
      zeroLeak: true,
      rawPayloadsIncluded: false,
      envValuesIncluded: false
    });
    expect(summary.agentLoopMechanicsLedger?.mechanics).toEqual(expect.arrayContaining(["events", "rewards", "workspaceops"]));
    expect(summary.agentLoopMechanicsLedger?.missingMechanics).toEqual([]);
    expect(summary.agentLoopMechanicsLedgerRuns).toMatchObject({
      runsWithLedger: 1,
      wiredRuns: 1,
      incompleteRuns: 0,
      zeroLeakRuns: 1,
      promotedToPlatformPatchReviewRuns: 0,
      candidateReadyRuns: 1,
      blockedRuns: 1,
      missingMechanics: [],
      latest: {
        runId: "mission-candidate-1-run",
        profile: "fixture",
        mechanicsCovered: 16,
        requiredMechanics: 16,
        totalRecords: 41,
        liveBackedRecords: 13,
        blockedRecords: 2,
        promotionDecision: "candidate-ready-heldout-review",
        relativePath: "mission-candidate-1-run/artifacts/agent-loop-mechanics-ledger.json"
      }
    });
    expect(written.indexPath.endsWith("reports/run-warehouse/index.json")).toBe(true);
  });
});

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function evidence() {
  return {
    runId: "mission-candidate-1-run",
    missionId: "mission-candidate-1",
    missionTitle: "Mission Candidate",
    profile: "fixture",
    startedAt: "2026-07-04T00:00:00.000Z",
    completedAt: "2026-07-04T00:01:00.000Z",
    durationMs: 60000,
    toolsUsed: ["tool"],
    steps: [{ id: "step", tool: "tool", status: "ok", summary: "ok" }],
    artifacts: [
      {
        id: "artifact",
        path: "artifacts/report.md",
        type: "markdown",
        summary: "report",
        sha256: "a".repeat(64),
        bytes: 12000,
        publicReady: false
      }
    ],
    evals: [
      { name: "training", suite: "training", source: "heuristic", visibleToOptimizer: true, score: 0.8, status: "warn", summary: "training" },
      { name: "heldout", suite: "heldOut", source: "heuristic", visibleToOptimizer: false, score: 0.9, status: "pass", summary: "held-out" },
      { name: "trust", suite: "trust", source: "system", visibleToOptimizer: false, score: 1, status: "pass", summary: "trust" },
      { name: "economic", suite: "economic", source: "human-review", visibleToOptimizer: false, score: 0, status: "fail", summary: "economic" }
    ],
    promotionDecision: "promote",
    qualitySignals: {},
    redactionReport: {
      checkedArtifacts: 1,
      leaksDetected: 0
    }
  };
}

function valueProof() {
  return {
    proofId: "value-proof",
    profile: "fixture",
    passed: true,
    api: {
      probes: [
        {
          serviceFamily: "playbasis-api",
          name: "api.system.health",
          method: "GET",
          pathLabel: "health",
          urlHash: "b".repeat(64),
          status: 200,
          ok: true,
          durationMs: 1,
          responseBytes: 2,
          bodyHash: "c".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        }
      ]
    },
    providerProbe: {
      serviceFamily: "provider",
      name: "azure.responses.smoke",
      method: "POST",
      pathLabel: "responses",
      urlHash: "d".repeat(64),
      status: 200,
      ok: true,
      durationMs: 1,
      responseBytes: 2,
      outputHash: "e".repeat(64),
      redaction: { scanned: true, leaksDetected: 0 }
    }
  };
}

function optimizationReport() {
  return {
    optimizationId: "optimization",
    missionId: "mission",
    profile: "fixture",
    candidates: [{ id: "candidate" }],
    selectedWinnerRunId: "mission-candidate-1-run",
    bestTrainingScore: 0.8,
    bestHeldOutScore: 0.9
  };
}

function mechanicsCoverage() {
  const apiProbe = {
    serviceFamily: "playbasis-api",
    name: "mechanic.events.list",
    method: "GET",
    pathLabel: "events",
    urlHash: "1".repeat(64),
    status: 200,
    ok: true,
    durationMs: 1,
    responseBytes: 2,
    bodyHash: "2".repeat(64),
    redaction: { scanned: true, leaksDetected: 0 }
  };
  const failedApiProbe = {
    serviceFamily: "playbasis-api",
    name: "mechanic.webhooks.endpoint",
    method: "GET",
    pathLabel: "webhooks/endpoints",
    urlHash: "3".repeat(64),
    status: 405,
    ok: false,
    durationMs: 1,
    responseBytes: 2,
    bodyHash: "4".repeat(64),
    redaction: { scanned: true, leaksDetected: 0 }
  };
  const workspaceProbe = {
    serviceFamily: "workspaceops",
    name: "workspaceops.landing",
    method: "GET",
    pathLabel: "workspace-ops",
    urlHash: "5".repeat(64),
    status: 200,
    ok: true,
    durationMs: 1,
    responseBytes: 2,
    bodyHash: "6".repeat(64),
    redaction: { scanned: true, leaksDetected: 0 }
  };
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:02:00.000Z",
    profile: "staging-sandbox",
    apiCoverage: {
      status: "warn",
      mode: "safe-live-readonly",
      successfulCalls: 1,
      totalCalls: 2,
      mechanics: [
        { category: "events", ok: true },
        { category: "webhooks", ok: false }
      ],
      probes: [apiProbe, failedApiProbe],
      safety: { rawPayloadsIncluded: false, envValuesIncluded: false }
    },
    workspaceOps: {
      status: "ok",
      successfulCalls: 1,
      totalCalls: 1,
      probes: [workspaceProbe]
    },
    coverage: {
      status: "ok",
      mode: "safe-live-readonly",
      successfulCalls: 2,
      totalCalls: 3,
      mechanics: [
        { category: "events", ok: true },
        { category: "webhooks", ok: false },
        { category: "workspaceops", ok: true }
      ],
      probes: [apiProbe, failedApiProbe, workspaceProbe],
      safety: { rawPayloadsIncluded: false, envValuesIncluded: false }
    },
    playbasisApiLeverage: {
      summary: {
        liveRecordedCapabilities: 2,
        rawPayloadsIncluded: false,
        envValuesIncluded: false
      },
      playbasisMechanics: [
        { category: "events", status: "recorded", liveBacked: true },
        { category: "workspaceops", status: "recorded", liveBacked: true },
        { category: "webhooks", status: "available", liveBacked: false }
      ]
    }
  };
}

function mechanicsActivationReadiness() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:02:05.000Z",
    profile: "staging-sandbox",
    sourceReport: {
      generatedAt: "2026-07-04T00:02:00.000Z",
      hash: "7".repeat(64),
      liveRecordedCapabilities: 2,
      gatedCapabilities: 2,
      writeGatedCapabilities: 1
    },
    gates: [
      {
        category: "experiments",
        capability: "experiments",
        activationStatus: "write-probe-gated",
        currentEvidenceLevel: "available-only",
        requiredProfile: "staging-sandbox",
        requiredProfileMatches: true,
        requiredOperatorFlags: ["--allow-write-probes"],
        missingRequiredOperatorFlags: ["--allow-write-probes"],
        requiredEnvKeys: ["PBOS_ALLOW_WRITE_PROBES"],
        missingRequiredEnvKeys: ["PBOS_ALLOW_WRITE_PROBES"],
        optionalEnvKeys: [],
        presentOptionalEnvKeys: [],
        safetyConstraints: ["Use only disposable sandbox data."],
        nextCommand: "pnpm pbos mechanics probe --profile staging-sandbox --allow-write-probes",
        readyToRun: false,
        readinessStatus: "missing-required-env",
        claimBoundary: "Do not count this capability as live-recorded until SafeProbeEvidence exists."
      },
      {
        category: "campaigns",
        capability: "campaigns",
        activationStatus: "identifier-required",
        currentEvidenceLevel: "available-only",
        requiredProfile: "staging-sandbox",
        requiredProfileMatches: true,
        requiredOperatorFlags: [],
        missingRequiredOperatorFlags: [],
        requiredEnvKeys: ["PBOS_PROBE_CAMPAIGN_ID"],
        missingRequiredEnvKeys: ["PBOS_PROBE_CAMPAIGN_ID"],
        optionalEnvKeys: [],
        presentOptionalEnvKeys: [],
        safetyConstraints: ["Use a probe campaign id."],
        nextCommand: "pnpm pbos mechanics probe --profile staging-sandbox after setting PBOS_PROBE_CAMPAIGN_ID to a disposable id",
        readyToRun: false,
        readinessStatus: "missing-required-env",
        claimBoundary: "Do not count this capability as live-recorded until SafeProbeEvidence exists."
      }
    ],
    summary: {
      totalGates: 2,
      readyGates: 0,
      blockedGates: 2,
      writeGatedCapabilities: 1,
      identifierRequiredCapabilities: 1,
      missingRequiredEnvKeys: [
        "PBOS_ALLOW_WRITE_PROBES",
        "PBOS_PROBE_CAMPAIGN_ID",
        "PBOS_PROBE_WEBHOOK_URL=https://secret.example/super-secret-webhook"
      ],
      missingRequiredOperatorFlags: ["--allow-write-probes"],
      allReady: false
    },
    safety: {
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    }
  };
}

function workspaceOpsCeoSimAdapter() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:03:00.000Z",
    profile: "local-monorepo",
    adapter: {
      schemaVersion: 1,
      generatedAt: "2026-07-04T00:03:00.000Z",
      profile: "local-monorepo",
      status: "warn",
      mode: "local-monorepo-script",
      exercisedRealSurface: true,
      sourceFiles: [
        { label: "apps/website/lib/business-simulation.ts", exists: true, sourceHash: "7".repeat(64) },
        { label: "apps/website/lib/business-simulation-qa.ts", exists: true, sourceHash: "8".repeat(64) }
      ],
      command: {
        label: "workspaceops.business-simulation.qa-json",
        executed: true,
        exitCode: 0,
        durationMs: 32,
        timeoutMs: 60000,
        failureCategory: "none"
      },
      parsedSummary: {
        passedChecks: 120,
        failedChecks: 1,
        failedCheckIds: ["matrix:smart-score-variance"],
        scenarioReportCount: 7,
        matrixCheckCount: 14,
        resumeCheckPassed: true
      },
      improvementTargets: [
        {
          targetId: "ceo-sim.policy-diversity.smart-score-variance",
          sourceFailedCheckIds: ["matrix:smart-score-variance"],
          severity: "warn",
          diagnosis: "Smart policy is too stable.",
          nextLoopAction: "Run experiment variants.",
          playbasisMechanics: ["events", "experiments", "rulesets", "leaderboards", "workspaceops"],
          evidencePolicy: "hash-only-no-raw-simulator-body"
        }
      ],
      redaction: { scanned: true, leaksDetected: 0 },
      safety: {
        rawStdoutIncluded: false,
        rawStderrIncluded: false,
        rawWorkspaceOpsTenantDataIncluded: false,
        rawDonorCodeIncluded: false,
        envValuesIncluded: false,
        requestBodiesIncluded: false,
        responseBodiesIncluded: false
      },
      probes: [
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.adapter",
          method: "GET",
          pathLabel: "business-simulation-qa",
          urlHash: "9".repeat(64),
          status: 200,
          ok: true,
          durationMs: 32,
          responseBytes: 1234,
          bodyHash: "a".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        }
      ]
    }
  };
}

function workspaceOpsCeoSimPolicyExperiment() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:04:00.000Z",
    profile: "local-monorepo",
    experiment: {
      schemaVersion: 1,
      generatedAt: "2026-07-04T00:04:00.000Z",
      profile: "local-monorepo",
      status: "warn",
      mode: "local-monorepo-script",
      exercisedRealSurface: true,
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      targetFailedCheckId: "matrix:smart-score-variance",
      targetResolved: false,
      targetMetric: {
        name: "smartScoreStdDev",
        threshold: 60,
        observed: 47.2,
        sourceCheckId: "matrix:smart-score-variance"
      },
      suiteCommand: {
        label: "workspaceops.business-simulation.qa-json",
        executed: true,
        exitCode: 0,
        durationMs: 40,
        timeoutMs: 60000,
        failureCategory: "none"
      },
      variants: [
        {
          variantId: "standard-smart",
          score: {
            utilityScore: 810,
            failedChecks: 0
          }
        }
      ],
      selection: {
        selectedVariantId: "standard-smart",
        promoted: false
      },
      mechanicsPlan: [
        { mechanic: "events", role: "event ledger", evidenceHash: "1".repeat(64) },
        { mechanic: "experiments", role: "variant arms", evidenceHash: "2".repeat(64) },
        { mechanic: "rulesets", role: "promotion gate", evidenceHash: "3".repeat(64) },
        { mechanic: "workspaceops", role: "runtime oracle", evidenceHash: "4".repeat(64) }
      ],
      redaction: { scanned: true, leaksDetected: 0 },
      safety: {
        rawStdoutIncluded: false,
        rawStderrIncluded: false,
        rawScenarioBodiesIncluded: false,
        rawDayLogsIncluded: false,
        rawWorkspaceOpsTenantDataIncluded: false,
        envValuesIncluded: false,
        requestBodiesIncluded: false,
        responseBodiesIncluded: false
      },
      probes: [
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.policy-experiment.suite",
          method: "GET",
          pathLabel: "business-simulation-qa",
          urlHash: "a".repeat(64),
          status: 200,
          ok: true,
          durationMs: 40,
          responseBytes: 1234,
          bodyHash: "b".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        },
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.policy-experiment.standard-smart",
          method: "GET",
          pathLabel: "business-simulation-qa:standard-smart",
          urlHash: "c".repeat(64),
          status: 200,
          ok: true,
          durationMs: 38,
          responseBytes: 900,
          bodyHash: "d".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        }
      ]
    }
  };
}

function workspaceOpsCeoSimRepairQuest() {
  const mechanics = [
    ["events", "recorded"],
    ["points", "recorded"],
    ["xp", "blocked"],
    ["quests", "recorded"],
    ["rulesets", "recorded"],
    ["adjudications", "recorded"],
    ["experiments", "recorded"],
    ["feedback", "planned"],
    ["credits", "recorded"],
    ["leaderboards", "recorded"],
    ["cohorts", "planned"],
    ["campaigns", "planned"],
    ["rewards", "blocked"],
    ["webhooks", "planned"],
    ["analytics", "recorded"],
    ["workspaceops", "recorded"]
  ];
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:05:00.000Z",
    profile: "local-monorepo",
    repairQuest: {
      schemaVersion: 1,
      generatedAt: "2026-07-04T00:05:00.000Z",
      profile: "local-monorepo",
      status: "open",
      questId: "ceo-sim-repair-fixture",
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      targetResolved: false,
      sourceExperiment: {
        evidenceHash: "e".repeat(64),
        targetObserved: 47.2,
        targetThreshold: 60,
        selectedVariantId: "standard-smart",
        promoted: false,
        variantCount: 5
      },
      mechanicsLedger: mechanics.map(([mechanic, status], index) => ({
        mechanic,
        recordType: `fixture-${mechanic}`,
        action: `fixture ${mechanic} action`,
        status,
        evidenceHash: String(index).repeat(64).slice(0, 64),
        safePayloadHash: String(index + 1).repeat(64).slice(0, 64)
      })),
      redaction: { scanned: true, leaksDetected: 0 },
      safety: {
        rawExperimentBodyIncluded: false,
        rawSimulatorBodyIncluded: false,
        rawWorkspaceOpsTenantDataIncluded: false,
        envValuesIncluded: false,
        requestBodiesIncluded: false,
        responseBodiesIncluded: false
      }
    }
  };
}

function workspaceOpsCeoSimDeltaReplay() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:06:00.000Z",
    profile: "local-monorepo",
    replay: {
      schemaVersion: 1,
      generatedAt: "2026-07-04T00:06:00.000Z",
      profile: "local-monorepo",
      status: "ok",
      mode: "local-temp-patch",
      exercisedRealSurface: true,
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      targetThreshold: 60,
      baselineObserved: 59.2,
      selectedDeltaId: "score-sign-reject",
      selectedDeltaResolvedTarget: true,
      selectedDeltaRequiresPlatformPatch: true,
      promotionDecision: "candidate-ready-heldout-review",
      deltas: [
        {
          deltaId: "score-sign-reject",
          targetResolved: true,
          failedChecks: 0
        },
        {
          deltaId: "cash-runway-pressure-reject",
          targetResolved: false,
          failedChecks: 1
        }
      ],
      redaction: { scanned: true, leaksDetected: 0 },
      safety: {
        tempFilesDeleted: true,
        platformSourceMutated: false,
        rawPatchedSourceIncluded: false,
        rawStdoutIncluded: false,
        rawStderrIncluded: false,
        rawSimulatorBodyIncluded: false,
        envValuesIncluded: false
      },
      probes: [
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.delta-replay.score-sign-reject",
          method: "GET",
          pathLabel: "business-simulation-qa-delta:score-sign-reject",
          urlHash: "f".repeat(64),
          status: 200,
          ok: true,
          durationMs: 44,
          responseBytes: 1200,
          bodyHash: "a".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        },
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.delta-replay.cash-runway-pressure-reject",
          method: "GET",
          pathLabel: "business-simulation-qa-delta:cash-runway-pressure-reject",
          urlHash: "b".repeat(64),
          status: 200,
          ok: true,
          durationMs: 42,
          responseBytes: 1200,
          bodyHash: "c".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        }
      ]
    }
  };
}

function workspaceOpsCeoSimDeltaHeldoutReview() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:06:30.000Z",
    profile: "local-monorepo",
    review: {
      schemaVersion: 1,
      generatedAt: "2026-07-04T00:06:30.000Z",
      profile: "local-monorepo",
      status: "ok",
      mode: "scorer-only-private-bundle",
      targetId: "ceo-sim.policy-diversity.smart-score-variance",
      sourceReplayHash: "d".repeat(64),
      candidateDeltaId: "score-sign-reject",
      candidateEvidenceHash: "e".repeat(64),
      selectedDeltaResolvedTarget: true,
      heldOut: {
        familyId: "ceo-sim-heldout-v1",
        provided: true,
        exists: true,
        outsideRepo: true,
        pathHash: "9".repeat(64),
        fileCount: 2,
        manifestHash: "8".repeat(64),
        answerKeyHash: "7".repeat(64),
        bundleHash: "6".repeat(64),
        privateScorerInputsRead: true,
        answerKeysIncluded: false,
        heldOutBodiesIncluded: false
      },
      score: {
        threshold: 0.8,
        score: 0.94,
        pass: true,
        casesScored: 12,
        casesPassed: 11,
        casesFailed: 1,
        robustnessPenalty: 0.04
      },
      gates: [],
      promotionDecision: "promote-to-platform-patch-review",
      redaction: { scanned: true, leaksDetected: 0 },
      safety: {
        rawHeldOutBodiesIncluded: false,
        rawAnswerKeysIncluded: false,
        rawSimulatorBodiesIncluded: false,
        rawPatchedSourceIncluded: false,
        envValuesIncluded: false,
        requestBodiesIncluded: false,
        responseBodiesIncluded: false
      },
      probes: [
        {
          serviceFamily: "workspaceops",
          name: "workspaceops.ceo-sim.delta-heldout.scorer",
          method: "GET",
          pathLabel: "ceo-sim-heldout-v1",
          urlHash: "5".repeat(64),
          status: 200,
          ok: true,
          durationMs: 0,
          responseBytes: 0,
          outputHash: "4".repeat(64),
          redaction: { scanned: true, leaksDetected: 0 }
        }
      ]
    }
  };
}

function mechanicsSensitiveHeldout() {
  return {
    schemaVersion: 1,
    reportId: "playbasis-mechanics-heldout-fixture",
    generatedAt: "2026-07-04T00:06:45.000Z",
    profile: "fixture",
    familyId: "playbasis-mechanics-heldout-v1",
    scorerRef: "scorer-only:playbasis-mechanics.heldout.v1",
    sourceExperiment: {
      path: "reports/playbasis-mechanics-intervention-experiment.json",
      hash: "e".repeat(64),
      reportId: "playbasis-mechanics-intervention-fixture",
      genericEvalCeilingDetected: true,
      genericHeldOutLift: 0
    },
    scorerMode: "scorer-only-private-bundle",
    privateBundle: {
      provided: true,
      outsideRepo: true,
      fileCount: 2,
      pathHash: "p".repeat(64),
      manifestHash: "m".repeat(64),
      answerKeyHash: "a".repeat(64),
      bundleHash: "b".repeat(64),
      bodiesRead: true,
      bodiesIncluded: false,
      answerKeysIncluded: false
    },
    arms: [
      {
        arm: "control",
        runId: "mechanics-control-run",
        mechanicsSensitiveHeldOutScore: 0.125,
        casesScored: 16,
        casesPassed: 2,
        maxPossibleScore: 1
      },
      {
        arm: "treatment",
        runId: "mechanics-treatment-run",
        mechanicsSensitiveHeldOutScore: 1,
        casesScored: 16,
        casesPassed: 16,
        maxPossibleScore: 1
      }
    ],
    deltas: {
      mechanicsSensitiveHeldOutLift: 0.875,
      genericHeldOutLift: 0,
      mechanicsExecutionLift: 0.74
    },
    summary: {
      controlRunId: "mechanics-control-run",
      treatmentRunId: "mechanics-treatment-run",
      nonSaturatedMeasurementReady: true,
      scorerDistinguishesTreatment: true,
      candidateReadyForBlindReplication: true,
      causalProofReady: false,
      zeroLeak: true,
      claimStatus: "mechanics-sensitive-heldout-smoke"
    },
    gates: [
      {
        name: "generic-ceiling-addressed",
        status: "pass",
        summary: "Generic held-out suite was saturated.",
        resumePoint: "use scorer when generic held-out is saturated"
      }
    ],
    safety: {
      rawPayloadsIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false,
      envValuesIncluded: false,
      rawUrlsIncluded: false,
      privateBodiesIncluded: false,
      rawHeldOutCasesIncluded: false,
      answerKeysIncluded: false,
      rawArtifactBodiesIncluded: false
    }
  };
}

function mechanicsOutcomeAttribution() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:06:50.000Z",
    summary: {
      claimStatus: "mechanics-correlated-not-causal",
      outcomeLinkedMechanics: 2,
      liveBackedRecords: 13,
      totalLedgerRecords: 41,
      causalProofReady: false,
      zeroLeak: true
    },
    mechanics: [
      {
        mechanic: "events",
        evidenceLevel: "safe-live",
        ledgerRecords: 5,
        liveBackedRecords: 4,
        linkedOutcomeSignals: ["run-count"],
        nextIntervention: "Compare held-out lift in a preregistered control/treatment run."
      },
      {
        mechanic: "workspaceops",
        evidenceLevel: "safe-live",
        ledgerRecords: 4,
        liveBackedRecords: 4,
        linkedOutcomeSignals: ["service-probes"],
        nextIntervention: "Keep runtime evidence hash-only."
      }
    ],
    safety: {
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    }
  };
}

function mechanicsInterventionExperiment() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:06:55.000Z",
    summary: {
      claimStatus: "executable-intervention-smoke",
      interventionSmokePassed: false,
      candidateReadyForReplicatedHeldOutReview: false,
      causalProofReady: false,
      zeroLeak: true
    },
    deltas: {
      trainingLift: 0,
      heldOutLift: 0,
      trustDelta: 0,
      economicLift: 0,
      mechanicsExecutionLift: 0.74
    },
    measurementDiagnostics: {
      genericEvalCeilingDetected: true,
      mechanicsExecutionScoreIsOutcomeProof: false,
      primaryHeldOutLiftMeasurable: false
    },
    safety: {
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    }
  };
}

function mechanicsReplicatedIntervention() {
  return {
    schemaVersion: 1,
    reportId: "playbasis-mechanics-replication-fixture",
    generatedAt: "2026-07-04T00:07:05.000Z",
    profile: "fixture",
    familyId: "playbasis-mechanics-replication-v1",
    replicationKind: "fixture-executed-control-treatment-replication",
    replicateCount: 3,
    sourceMissionId: "workspaceops-launch-pack",
    scorerRef: "scorer-only:playbasis-mechanics.heldout.v1",
    sourceCommitments: {
      controlMissionHash: "c".repeat(64),
      treatmentMissionHash: "t".repeat(64),
      heldoutCommitmentHash: "h".repeat(64),
      privateBundleHash: "b".repeat(64),
      privateBundleBodiesIncluded: false,
      answerKeysIncluded: false
    },
    replicates: [
      {
        replicateId: "replicate-01",
        controlRunId: "control-1",
        treatmentRunId: "treatment-1",
        interventionReportHash: "1".repeat(64),
        heldoutScoreHash: "2".repeat(64),
        controlScore: 0.125,
        treatmentScore: 1,
        mechanicsSensitiveHeldOutLift: 0.875,
        genericHeldOutLift: 0,
        mechanicsExecutionLift: 0.74,
        treatmentWon: true,
        nonSaturatedMeasurementReady: true,
        zeroLeak: true
      },
      {
        replicateId: "replicate-02",
        controlRunId: "control-2",
        treatmentRunId: "treatment-2",
        interventionReportHash: "3".repeat(64),
        heldoutScoreHash: "4".repeat(64),
        controlScore: 0.125,
        treatmentScore: 1,
        mechanicsSensitiveHeldOutLift: 0.875,
        genericHeldOutLift: 0,
        mechanicsExecutionLift: 0.74,
        treatmentWon: true,
        nonSaturatedMeasurementReady: true,
        zeroLeak: true
      },
      {
        replicateId: "replicate-03",
        controlRunId: "control-3",
        treatmentRunId: "treatment-3",
        interventionReportHash: "5".repeat(64),
        heldoutScoreHash: "6".repeat(64),
        controlScore: 0.125,
        treatmentScore: 1,
        mechanicsSensitiveHeldOutLift: 0.875,
        genericHeldOutLift: 0,
        mechanicsExecutionLift: 0.74,
        treatmentWon: true,
        nonSaturatedMeasurementReady: true,
        zeroLeak: true
      }
    ],
    aggregate: {
      treatmentWins: 3,
      treatmentWinRate: 1,
      medianMechanicsSensitiveHeldOutLift: 0.875,
      averageMechanicsSensitiveHeldOutLift: 0.875,
      averageGenericHeldOutLift: 0,
      averageMechanicsExecutionLift: 0.74,
      allZeroLeak: true,
      allNonSaturatedMeasurementReady: true,
      replicatedMeasurementReady: true,
      causalProofReady: false
    },
    gates: [
      {
        name: "minimum-replicates",
        status: "pass",
        summary: "3/3 replicate pairs were scored.",
        resumePoint: "rerun replicate command"
      }
    ],
    safety: {
      rawPayloadsIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false,
      envValuesIncluded: false,
      rawUrlsIncluded: false,
      privateBodiesIncluded: false,
      rawHeldOutCasesIncluded: false,
      answerKeysIncluded: false,
      rawArtifactBodiesIncluded: false
    }
  };
}

function mechanicsBlindCausalReview() {
  return {
    schemaVersion: 1,
    reportId: "playbasis-mechanics-blind-review-fixture",
    generatedAt: "2026-07-04T00:07:10.000Z",
    profile: "fixture",
    familyId: "playbasis-mechanics-blind-causal-review-v1",
    reviewMode: "fixture-simulated-review",
    sourcePacket: {
      reportId: "playbasis-mechanics-blind-review-packet-fixture",
      packetHash: "p".repeat(64),
      blindedPairCount: 3,
      mappingHash: "m".repeat(64)
    },
    privateMapping: {
      provided: true,
      mappingHash: "m".repeat(64),
      pathLabel: "PBOS_PRIVATE_EVAL_ROOT/playbasis-mechanics-blind-causal-review-v1",
      storagePolicy: "private-scorer-only-outside-repo",
      mappingIncludedInPublicReport: false,
      answerKeyIncludedInPublicReport: false
    },
    reviewers: [
      { reviewerIdHash: "1".repeat(64), rowCount: 3 },
      { reviewerIdHash: "2".repeat(64), rowCount: 3 }
    ],
    rows: [],
    aggregate: {
      blindReviewRowsPresent: true,
      fixtureOnly: true,
      humanRowsPresent: false,
      externalRowsPresent: false,
      reviewerCount: 2,
      reviewRowCount: 6,
      reviewedPairCount: 3,
      pairCoverageRate: 1,
      averageConfidence: 0.8,
      treatmentPreferenceRows: 6,
      mappedPreferenceRows: 6,
      treatmentPreferenceRate: 1,
      interReviewerAgreement: 1,
      blindExternalReviewReady: false,
      causalProofReady: false,
      zeroLeak: true
    },
    gates: [
      {
        name: "non-fixture-review",
        status: "fail",
        summary: "Fixture rows prove import plumbing only.",
        resumePoint: "import human-blind or external-judge rows before causal claims"
      }
    ],
    safety: {
      rawPayloadsIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false,
      envValuesIncluded: false,
      rawUrlsIncluded: false,
      privateBodiesIncluded: false,
      rawArtifactBodiesIncluded: false,
      rawReviewTextIncluded: false,
      answerKeysIncluded: false,
      treatmentControlMappingIncluded: false
    }
  };
}

function agentLoopMechanicsLedger() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-07-04T00:07:00.000Z",
    profile: "local-monorepo",
    missionId: "workspaceops-launch-pack",
    runId: "reports-latest",
    status: "ok",
    sources: {
      mechanicsCoverageHash: "1".repeat(64),
      policyExperimentHash: "2".repeat(64),
      repairQuestHash: "3".repeat(64),
      deltaReplayHash: "4".repeat(64)
    },
    records: [],
    summary: {
      totalRecords: 41,
      mechanicsCovered: 16,
      requiredMechanics: 16,
      missingMechanics: [],
      byStatus: {
        verified: 16,
        recorded: 12,
        "candidate-ready": 7,
        planned: 4,
        blocked: 2
      },
      byMechanic: {
        events: 4,
        points: 2,
        xp: 2,
        quests: 3,
        rulesets: 4,
        adjudications: 4,
        experiments: 4,
        feedback: 3,
        credits: 2,
        leaderboards: 4,
        cohorts: 2,
        campaigns: 2,
        rewards: 3,
        webhooks: 2,
        analytics: 4,
        workspaceops: 4
      },
      liveBackedRecords: 13,
      localRuntimeRecords: 10,
      tempPatchRecords: 9,
      recordedOrVerifiedRecords: 28,
      plannedRecords: 4,
      blockedRecords: 2,
      candidateReadyRecords: 7,
      zeroLeak: true,
      rawPayloadsIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    },
    promotion: {
      decision: "candidate-ready-heldout-review",
      reasons: ["Temp-patch delta score-sign-reject cleared the current target but still requires held-out review."],
      requiredNextProof: ["zero-leak scan", "held-out scorer-only CEO-sim replay"]
    },
    redaction: { scanned: true, leaksDetected: 0 },
    safety: {
      rawPayloadsIncluded: false,
      rawSimulatorBodiesIncluded: false,
      rawPatchedSourceIncluded: false,
      envValuesIncluded: false,
      requestBodiesIncluded: false,
      responseBodiesIncluded: false
    }
  };
}
