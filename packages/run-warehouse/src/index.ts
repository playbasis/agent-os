import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { EvidencePack, ProfileName } from "@playbasis-agent-os/kernel";

export type WarehouseEvalSuiteName = "training" | "heldOut" | "trust" | "economic";

export interface RunWarehouseBuildOptions {
  repoRoot: string;
  runsRoot?: string;
  reportsRoot?: string;
}

export interface RunWarehouseQueryOptions {
  profile?: ProfileName | string;
  minHeldOutScore?: number;
  minTrainingScore?: number;
  missionId?: string;
  promotionDecision?: string;
  serviceFamily?: string;
  mechanicsActivationReady?: boolean;
  mechanicsActivationMissingEnvKey?: string;
  mechanicsActivationMissingOperatorFlag?: string;
  agentLoopLedgerWired?: boolean;
  agentLoopPromotionDecision?: string;
  agentLoopMinLiveBackedRecords?: number;
  agentLoopMaxBlockedRecords?: number;
  agentLoopMechanic?: string;
  mechanicsSensitiveHeldoutReady?: boolean;
  minMechanicsSensitiveHeldoutLift?: number;
  playbasisMechanicsCausalProofReady?: boolean;
  minPlaybasisLiveMechanics?: number;
  minOutcomeLinkedMechanics?: number;
}

export interface RunWarehouseRun {
  runId: string;
  missionId: string;
  missionTitle: string;
  missionTemplateId: string;
  parentMissionId?: string;
  profile: string;
  startedAt?: string;
  completedAt?: string;
  durationMs: number;
  promotionDecision: string;
  artifactCount: number;
  artifactBytes: number;
  traceEventCount: number;
  toolCount: number;
  evalScores: Record<WarehouseEvalSuiteName, number>;
  redaction: {
    checkedArtifacts: number;
    leaksDetected: number;
  };
  mechanicsActivationReadiness?: RunWarehouseMechanicsActivationReadiness;
  agentLoopMechanicsLedger?: RunWarehouseAgentLoopMechanicsLedger;
  relativePath: string;
}

export interface RunWarehouseTrace {
  runId: string;
  eventCount: number;
  eventTypes: Record<string, number>;
  relativePath: string;
}

export interface RunWarehouseArtifact {
  runId: string;
  path: string;
  type: string;
  bytes: number;
  sha256: string;
  publicReady: boolean;
  summary: string;
}

export interface RunWarehouseEval {
  runId: string;
  name: string;
  suite: WarehouseEvalSuiteName;
  source: string;
  visibleToOptimizer: boolean;
  score: number;
  status: string;
}

export interface RunWarehouseProofReport {
  proofId: string;
  kind: "value-proof" | "robust-proof" | "provider-smoke" | "unknown";
  profile?: string;
  passed?: boolean;
  relativePath: string;
  startedAt?: string;
  completedAt?: string;
}

export interface RunWarehouseOptimizationSession {
  sessionId: string;
  kind: "scripted-maturity-ladder" | "mission-optimizer";
  profile?: string;
  missionId?: string;
  candidateCount: number;
  baselineRunId?: string;
  bestRunId?: string;
  selectedWinnerRunId?: string;
  trainingScore?: number;
  heldOutScore?: number;
  relativePath: string;
}

export interface RunWarehouseServiceProbe {
  proofId: string;
  serviceFamily: string;
  name: string;
  method?: string;
  pathLabel?: string;
  urlHash?: string;
  status?: string | number;
  ok: boolean;
  durationMs?: number;
  responseBytes?: number;
  bodyHash?: string;
  outputHash?: string;
  redactionLeaks?: number;
}

export interface RunWarehouseMechanicsCoverage {
  generatedAt?: string;
  profile?: string;
  status: string;
  mode?: string;
  apiSuccessfulCalls: number;
  apiTotalCalls: number;
  workspaceSuccessfulCalls: number;
  workspaceTotalCalls: number;
  recordedMechanics: string[];
  liveRecordedMechanics: string[];
  availableMechanics: string[];
  safeLiveProbeMechanics: number;
  rawPayloadsIncluded: boolean;
  envValuesIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseMechanicsActivationReadiness {
  generatedAt?: string;
  profile?: string;
  readyGates: number;
  totalGates: number;
  blockedGates: number;
  writeGatedCapabilities: number;
  identifierRequiredCapabilities: number;
  missingRequiredEnvKeys: string[];
  missingRequiredOperatorFlags: string[];
  allReady: boolean;
  sourceReportHash?: string;
  sourceLiveRecordedCapabilities: number;
  rawPayloadsIncluded: boolean;
  envValuesIncluded: boolean;
  requestBodiesIncluded: boolean;
  responseBodiesIncluded: boolean;
  gates: Array<{
    capability: string;
    activationStatus: string;
    readinessStatus: string;
    readyToRun: boolean;
    missingRequiredEnvKeys: string[];
    missingRequiredOperatorFlags: string[];
  }>;
  relativePath: string;
}

export interface RunWarehouseWorkspaceOpsCeoSimAdapter {
  generatedAt?: string;
  profile?: string;
  status: string;
  mode?: string;
  exercisedRealSurface: boolean;
  commandExecuted: boolean;
  exitCode: number | null;
  failureCategory?: string;
  passedChecks: number;
  failedChecks: number;
  failedCheckIds: string[];
  improvementTargets: Array<{
    targetId: string;
    severity: string;
    playbasisMechanics: string[];
  }>;
  scenarioReportCount: number;
  matrixCheckCount: number;
  resumeCheckPassed?: boolean;
  sourceFilesPresent: number;
  sourceFilesTotal: number;
  redactionLeaks: number;
  rawStdoutIncluded: boolean;
  rawStderrIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseWorkspaceOpsCeoSimPolicyExperiment {
  generatedAt?: string;
  profile?: string;
  status: string;
  mode?: string;
  exercisedRealSurface: boolean;
  targetId: string;
  targetResolved: boolean;
  targetObserved?: number;
  targetThreshold: number;
  suiteExitCode: number | null;
  variantCount: number;
  selectedVariantId?: string;
  promoted: boolean;
  mechanics: string[];
  redactionLeaks: number;
  rawStdoutIncluded: boolean;
  rawStderrIncluded: boolean;
  rawDayLogsIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseWorkspaceOpsCeoSimRepairQuest {
  generatedAt?: string;
  profile?: string;
  status: string;
  questId: string;
  targetId: string;
  targetResolved: boolean;
  selectedVariantId?: string;
  promoted: boolean;
  targetObserved?: number;
  targetThreshold: number;
  recordedMechanics: number;
  totalMechanics: number;
  blockedMechanics: number;
  plannedMechanics: number;
  mechanics: string[];
  redactionLeaks: number;
  rawExperimentBodyIncluded: boolean;
  rawSimulatorBodyIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseWorkspaceOpsCeoSimDeltaReplay {
  generatedAt?: string;
  profile?: string;
  status: string;
  mode?: string;
  baselineObserved?: number;
  selectedDeltaId?: string;
  selectedDeltaResolvedTarget: boolean;
  selectedDeltaRequiresPlatformPatch: boolean;
  promotionDecision: string;
  deltaCount: number;
  resolvedDeltaCount: number;
  tempFilesDeleted: boolean;
  platformSourceMutated: boolean;
  rawPatchedSourceIncluded: boolean;
  redactionLeaks: number;
  relativePath: string;
}

export interface RunWarehouseWorkspaceOpsCeoSimDeltaHeldoutReview {
  generatedAt?: string;
  profile?: string;
  status: string;
  mode?: string;
  candidateDeltaId?: string;
  selectedDeltaResolvedTarget: boolean;
  heldOutExists: boolean;
  heldOutOutsideRepo: boolean;
  heldOutFileCount: number;
  privateScorerInputsRead: boolean;
  score?: number;
  threshold: number;
  pass: boolean;
  casesScored: number;
  casesPassed: number;
  casesFailed: number;
  promotionDecision: string;
  redactionLeaks: number;
  rawHeldOutBodiesIncluded: boolean;
  rawAnswerKeysIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseMechanicsSensitiveHeldout {
  generatedAt?: string;
  profile?: string;
  familyId: string;
  scorerMode?: string;
  claimStatus: string;
  genericEvalCeilingDetected: boolean;
  genericHeldOutLift: number;
  mechanicsSensitiveHeldOutLift: number;
  mechanicsExecutionLift: number;
  controlRunId: string;
  treatmentRunId: string;
  controlScore: number;
  treatmentScore: number;
  nonSaturatedMeasurementReady: boolean;
  scorerDistinguishesTreatment: boolean;
  candidateReadyForBlindReplication: boolean;
  causalProofReady: boolean;
  zeroLeak: boolean;
  privateBundleProvided: boolean;
  privateBundleOutsideRepo: boolean;
  privateBundleBodiesIncluded: boolean;
  privateBundleAnswerKeysIncluded: boolean;
  rawPayloadsIncluded: boolean;
  requestBodiesIncluded: boolean;
  responseBodiesIncluded: boolean;
  envValuesIncluded: boolean;
  rawUrlsIncluded: boolean;
  privateBodiesIncluded: boolean;
  rawHeldOutCasesIncluded: boolean;
  answerKeysIncluded: boolean;
  rawArtifactBodiesIncluded: boolean;
  gates: Array<{
    name: string;
    status: string;
    summary: string;
  }>;
  relativePath: string;
}

export interface RunWarehouseMechanicsReplicatedIntervention {
  generatedAt?: string;
  profile?: string;
  familyId: string;
  replicateCount: number;
  treatmentWins: number;
  treatmentWinRate: number;
  medianMechanicsSensitiveHeldOutLift: number;
  averageMechanicsSensitiveHeldOutLift: number;
  averageGenericHeldOutLift: number;
  averageMechanicsExecutionLift: number;
  replicatedMeasurementReady: boolean;
  causalProofReady: boolean;
  zeroLeak: boolean;
  rawPayloadsIncluded: boolean;
  requestBodiesIncluded: boolean;
  responseBodiesIncluded: boolean;
  envValuesIncluded: boolean;
  rawUrlsIncluded: boolean;
  privateBodiesIncluded: boolean;
  rawHeldOutCasesIncluded: boolean;
  answerKeysIncluded: boolean;
  rawArtifactBodiesIncluded: boolean;
  gates: Array<{
    name: string;
    status: string;
    summary: string;
  }>;
  relativePath: string;
}

export interface RunWarehouseMechanicsBlindCausalReview {
  generatedAt?: string;
  profile?: string;
  familyId: string;
  reviewMode: string;
  packetHash: string;
  blindedPairCount: number;
  blindReviewRowsPresent: boolean;
  fixtureOnly: boolean;
  humanRowsPresent: boolean;
  externalRowsPresent: boolean;
  reviewerCount: number;
  reviewRowCount: number;
  reviewedPairCount: number;
  pairCoverageRate: number;
  treatmentPreferenceRate: number | null;
  interReviewerAgreement: number | null;
  blindExternalReviewReady: boolean;
  causalProofReady: boolean;
  zeroLeak: boolean;
  rawPayloadsIncluded: boolean;
  requestBodiesIncluded: boolean;
  responseBodiesIncluded: boolean;
  envValuesIncluded: boolean;
  rawUrlsIncluded: boolean;
  privateBodiesIncluded: boolean;
  rawArtifactBodiesIncluded: boolean;
  rawReviewTextIncluded: boolean;
  answerKeysIncluded: boolean;
  treatmentControlMappingIncluded: boolean;
  gates: Array<{
    name: string;
    status: string;
    summary: string;
  }>;
  relativePath: string;
}

export interface RunWarehousePlaybasisMechanicsEvidence {
  claimStatus: "causal-proof-ready" | "replicated-mechanics-sensitive-measurement-ready" | "mechanics-sensitive-measurement-ready" | "correlated-not-causal" | "insufficient-evidence";
  profile?: string;
  liveRecordedMechanics: number;
  recordedMechanics: number;
  availableOnlyMechanics: number;
  outcomeLinkedMechanics: number;
  activationReady: boolean;
  readyActivationGates: number;
  blockedActivationGates: number;
  agentLoopLedgerWired: boolean;
  agentLoopLiveBackedRecords: number;
  agentLoopBlockedRecords: number;
  genericHeldOutLift: number;
  mechanicsSensitiveHeldOutLift: number;
  mechanicsExecutionLift: number;
  nonSaturatedMeasurementReady: boolean;
  replicatedMeasurementReady: boolean;
  replicatedTreatmentWinRate: number;
  replicatedMedianMechanicsSensitiveHeldOutLift: number;
  blindReviewRowsPresent: boolean;
  blindReviewReady: boolean;
  blindReviewMode?: string;
  blindReviewRows: number;
  blindReviewHumanRowsPresent: boolean;
  blindReviewExternalRowsPresent: boolean;
  blindReviewTreatmentPreferenceRate: number | null;
  candidateReadyForBlindReplication: boolean;
  causalProofReady: boolean;
  zeroLeak: boolean;
  blockers: string[];
  relativePaths: {
    mechanicsCoverage?: string;
    activationReadiness?: string;
    outcomeAttribution?: string;
    interventionExperiment?: string;
	    mechanicsSensitiveHeldout?: string;
	    mechanicsReplicatedIntervention?: string;
	    mechanicsBlindCausalReview?: string;
	    agentLoopLedger?: string;
	  };
}

export interface RunWarehouseAgentLoopMechanicsLedger {
  generatedAt?: string;
  profile?: string;
  missionId: string;
  runId: string;
  status: string;
  totalRecords: number;
  mechanicsCovered: number;
  requiredMechanics: number;
  liveBackedRecords: number;
  localRuntimeRecords: number;
  tempPatchRecords: number;
  candidateReadyRecords: number;
  blockedRecords: number;
  plannedRecords: number;
  mechanics: string[];
  missingMechanics: string[];
  promotionDecision: string;
  redactionLeaks: number;
  zeroLeak: boolean;
  rawPayloadsIncluded: boolean;
  envValuesIncluded: boolean;
  requestBodiesIncluded: boolean;
  responseBodiesIncluded: boolean;
  relativePath: string;
}

export interface RunWarehouseRedactionReport {
  runId: string;
  checkedArtifacts: number;
  leaksDetected: number;
}

export interface RunWarehouseIndex {
  schemaVersion: 1;
  generatedAt: string;
  source: {
    repoRootName: string;
    runsRoot: string;
  };
  counts: {
    runs: number;
    traces: number;
    artifacts: number;
    evals: number;
    proofReports: number;
    optimizationSessions: number;
    serviceProbes: number;
    redactionReports: number;
    parentChildRunEdges: number;
    missionTemplates: number;
  };
  runs: RunWarehouseRun[];
  traces: RunWarehouseTrace[];
  artifacts: RunWarehouseArtifact[];
  evals: RunWarehouseEval[];
  proofReports: RunWarehouseProofReport[];
  optimizationSessions: RunWarehouseOptimizationSession[];
  serviceProbes: RunWarehouseServiceProbe[];
  mechanicsCoverage?: RunWarehouseMechanicsCoverage;
  mechanicsActivationReadiness?: RunWarehouseMechanicsActivationReadiness;
  workspaceOpsCeoSimAdapter?: RunWarehouseWorkspaceOpsCeoSimAdapter;
  workspaceOpsCeoSimPolicyExperiment?: RunWarehouseWorkspaceOpsCeoSimPolicyExperiment;
  workspaceOpsCeoSimRepairQuest?: RunWarehouseWorkspaceOpsCeoSimRepairQuest;
  workspaceOpsCeoSimDeltaReplay?: RunWarehouseWorkspaceOpsCeoSimDeltaReplay;
  workspaceOpsCeoSimDeltaHeldoutReview?: RunWarehouseWorkspaceOpsCeoSimDeltaHeldoutReview;
	  mechanicsSensitiveHeldout?: RunWarehouseMechanicsSensitiveHeldout;
	  mechanicsReplicatedIntervention?: RunWarehouseMechanicsReplicatedIntervention;
	  mechanicsBlindCausalReview?: RunWarehouseMechanicsBlindCausalReview;
	  playbasisMechanicsEvidence?: RunWarehousePlaybasisMechanicsEvidence;
  agentLoopMechanicsLedger?: RunWarehouseAgentLoopMechanicsLedger;
  redactionReports: RunWarehouseRedactionReport[];
  lineage: {
    parentChildRuns: Array<{ parentMissionId: string; childMissionId: string; runId: string }>;
    missionTemplates: Array<{ missionTemplateId: string; runCount: number; profiles: string[] }>;
  };
}

export interface RunWarehouseSummary {
  generatedAt: string;
  counts: RunWarehouseIndex["counts"];
  profiles: Record<string, number>;
  promotionDecisions: Record<string, number>;
  averageScores: Record<WarehouseEvalSuiteName, number>;
  zeroLeakRuns: number;
  serviceFamilies: Record<string, { ok: number; total: number }>;
  mechanicsCoverage?: RunWarehouseMechanicsCoverage;
  mechanicsActivationReadiness?: RunWarehouseMechanicsActivationReadiness;
  mechanicsActivationReadinessRuns: {
    runsWithReadiness: number;
    readyRuns: number;
    blockedRuns: number;
    missingRequiredEnvKeys: string[];
    missingRequiredOperatorFlags: string[];
    latest?: {
      runId: string;
      profile: string;
      readyGates: number;
      totalGates: number;
      blockedGates: number;
      allReady: boolean;
      relativePath: string;
    };
  };
  agentLoopMechanicsLedgerRuns: {
    runsWithLedger: number;
    wiredRuns: number;
    incompleteRuns: number;
    zeroLeakRuns: number;
    promotedToPlatformPatchReviewRuns: number;
    candidateReadyRuns: number;
    blockedRuns: number;
    missingMechanics: string[];
    latest?: {
      runId: string;
      profile: string;
      mechanicsCovered: number;
      requiredMechanics: number;
      totalRecords: number;
      liveBackedRecords: number;
      blockedRecords: number;
      promotionDecision: string;
      relativePath: string;
    };
  };
  workspaceOpsCeoSimAdapter?: RunWarehouseWorkspaceOpsCeoSimAdapter;
  workspaceOpsCeoSimPolicyExperiment?: RunWarehouseWorkspaceOpsCeoSimPolicyExperiment;
  workspaceOpsCeoSimRepairQuest?: RunWarehouseWorkspaceOpsCeoSimRepairQuest;
  workspaceOpsCeoSimDeltaReplay?: RunWarehouseWorkspaceOpsCeoSimDeltaReplay;
  workspaceOpsCeoSimDeltaHeldoutReview?: RunWarehouseWorkspaceOpsCeoSimDeltaHeldoutReview;
	  mechanicsSensitiveHeldout?: RunWarehouseMechanicsSensitiveHeldout;
	  mechanicsReplicatedIntervention?: RunWarehouseMechanicsReplicatedIntervention;
	  mechanicsBlindCausalReview?: RunWarehouseMechanicsBlindCausalReview;
	  playbasisMechanicsEvidence?: RunWarehousePlaybasisMechanicsEvidence;
  agentLoopMechanicsLedger?: RunWarehouseAgentLoopMechanicsLedger;
  latestRuns: Array<Pick<RunWarehouseRun, "runId" | "missionId" | "profile" | "promotionDecision" | "completedAt" | "evalScores">>;
}

export async function buildRunWarehouseIndex(options: RunWarehouseBuildOptions): Promise<RunWarehouseIndex> {
  const runsRoot = options.runsRoot ?? path.join(options.repoRoot, "runs");
  const reportsRoot = options.reportsRoot ?? path.join(options.repoRoot, "reports");
  const files = await walkFiles(runsRoot);
  const evidenceFiles = files.filter((file) => path.basename(file) === "evidence.json");
  const traceFiles = files.filter((file) => path.basename(file) === "trace.jsonl");
  const proofFiles = files.filter((file) =>
    ["value-proof-report.json", "robust-proof-report.json", "provider-smoke-report.json"].includes(path.basename(file))
  );
  const sessionFiles = files.filter((file) =>
    ["hill-climb-report.json", "optimization-report.json"].includes(path.basename(file))
  );

  const runs: RunWarehouseRun[] = [];
  const artifacts: RunWarehouseArtifact[] = [];
  const evals: RunWarehouseEval[] = [];
  const redactionReports: RunWarehouseRedactionReport[] = [];
  const parentChildRuns: RunWarehouseIndex["lineage"]["parentChildRuns"] = [];

  for (const file of evidenceFiles) {
    const evidence = await readJson<EvidencePack>(file);
    if (!evidence) continue;
    const runId = evidence.runId || path.basename(path.dirname(file));
    const runDir = path.dirname(file);
    const parentMissionId = parentMissionIdFor(evidence.missionId);
    const missionTemplateId = parentMissionId ?? evidence.missionId;
    const normalizedEvals = (evidence.evals ?? []).map((item) => ({
      runId,
      name: item.name,
      suite: normalizeEvalSuite(String(item.suite), item.name),
      source: String(item.source ?? "heuristic"),
      visibleToOptimizer: Boolean(item.visibleToOptimizer),
      score: numberValue(item.score),
      status: String(item.status ?? "unknown")
    }));
    const trace = await traceSummaryForRun(traceFiles, runId);
    const mechanicsActivationReadiness = await summarizeMechanicsActivationReadiness(
      path.join(runDir, "artifacts", "playbasis-mechanics-activation-gates.json"),
      runsRoot
    );
    const agentLoopMechanicsLedger = await summarizeAgentLoopMechanicsLedger(
      path.join(runDir, "artifacts", "agent-loop-mechanics-ledger.json"),
      runsRoot
    );
    const artifactBytes = (evidence.artifacts ?? []).reduce((sum, artifact) => sum + numberValue(artifact.bytes), 0);
    const run: RunWarehouseRun = {
      runId,
      missionId: evidence.missionId,
      missionTitle: evidence.missionTitle,
      missionTemplateId,
      parentMissionId,
      profile: evidence.profile,
      startedAt: evidence.startedAt,
      completedAt: evidence.completedAt,
      durationMs: numberValue(evidence.durationMs),
      promotionDecision: evidence.promotionDecision,
      artifactCount: evidence.artifacts.length,
      artifactBytes,
      traceEventCount: trace?.eventCount ?? 0,
      toolCount: evidence.toolsUsed.length,
      evalScores: {
        training: aggregateSuiteScore(normalizedEvals, "training"),
        heldOut: aggregateSuiteScore(normalizedEvals, "heldOut"),
        trust: aggregateSuiteScore(normalizedEvals, "trust"),
        economic: aggregateSuiteScore(normalizedEvals, "economic")
      },
      redaction: {
        checkedArtifacts: numberValue(evidence.redactionReport.checkedArtifacts),
        leaksDetected: numberValue(evidence.redactionReport.leaksDetected)
      },
      mechanicsActivationReadiness,
      agentLoopMechanicsLedger,
      relativePath: path.relative(runsRoot, file)
    };
    runs.push(run);
    evals.push(...normalizedEvals);
    redactionReports.push({ runId, ...run.redaction });
    artifacts.push(...evidence.artifacts.map((artifact) => ({
      runId,
      path: artifact.path,
      type: artifact.type,
      bytes: artifact.bytes,
      sha256: artifact.sha256,
      publicReady: artifact.publicReady,
      summary: artifact.summary
    })));
    if (parentMissionId) {
      parentChildRuns.push({ parentMissionId, childMissionId: evidence.missionId, runId });
    }
  }

  const traces = (await Promise.all(traceFiles.map((file) => summarizeTraceFile(file, runsRoot)))).filter(
    (item): item is RunWarehouseTrace => Boolean(item)
  );
  const proofReports = (await Promise.all(proofFiles.map((file) => summarizeProofReport(file, runsRoot)))).filter(
    (item): item is RunWarehouseProofReport => Boolean(item)
  );
  const optimizationSessions = (await Promise.all(sessionFiles.map((file) => summarizeOptimizationSession(file, runsRoot)))).filter(
    (item): item is RunWarehouseOptimizationSession => Boolean(item)
  );
  const mechanicsCoveragePath = path.join(reportsRoot, "playbasis-mechanics-coverage.json");
  const mechanicsCoverage = await summarizeMechanicsCoverage(mechanicsCoveragePath, reportsRoot);
  const mechanicsActivationReadinessPath = path.join(reportsRoot, "playbasis-mechanics-activation-gates.json");
  const mechanicsActivationReadiness = await summarizeMechanicsActivationReadiness(mechanicsActivationReadinessPath, reportsRoot);
  const workspaceOpsCeoSimAdapterPath = path.join(reportsRoot, "workspaceops-ceo-sim-adapter.json");
  const workspaceOpsCeoSimAdapter = await summarizeWorkspaceOpsCeoSimAdapter(workspaceOpsCeoSimAdapterPath, reportsRoot);
  const workspaceOpsCeoSimPolicyExperimentPath = path.join(reportsRoot, "workspaceops-ceo-sim-policy-experiment.json");
  const workspaceOpsCeoSimPolicyExperiment = await summarizeWorkspaceOpsCeoSimPolicyExperiment(workspaceOpsCeoSimPolicyExperimentPath, reportsRoot);
  const workspaceOpsCeoSimRepairQuestPath = path.join(reportsRoot, "workspaceops-ceo-sim-repair-quest.json");
  const workspaceOpsCeoSimRepairQuest = await summarizeWorkspaceOpsCeoSimRepairQuest(workspaceOpsCeoSimRepairQuestPath, reportsRoot);
  const workspaceOpsCeoSimDeltaReplayPath = path.join(reportsRoot, "workspaceops-ceo-sim-delta-replay.json");
  const workspaceOpsCeoSimDeltaReplay = await summarizeWorkspaceOpsCeoSimDeltaReplay(workspaceOpsCeoSimDeltaReplayPath, reportsRoot);
  const workspaceOpsCeoSimDeltaHeldoutPath = path.join(reportsRoot, "workspaceops-ceo-sim-delta-heldout.json");
  const workspaceOpsCeoSimDeltaHeldoutReview = await summarizeWorkspaceOpsCeoSimDeltaHeldoutReview(workspaceOpsCeoSimDeltaHeldoutPath, reportsRoot);
  const mechanicsSensitiveHeldoutPath = path.join(reportsRoot, "playbasis-mechanics-heldout-score.json");
  const mechanicsSensitiveHeldout = await summarizeMechanicsSensitiveHeldout(mechanicsSensitiveHeldoutPath, reportsRoot);
	  const mechanicsReplicatedInterventionPath = path.join(reportsRoot, "playbasis-mechanics-replicated-intervention.json");
	  const mechanicsReplicatedIntervention = await summarizeMechanicsReplicatedIntervention(mechanicsReplicatedInterventionPath, reportsRoot);
	  const mechanicsBlindCausalReviewPath = path.join(reportsRoot, "playbasis-mechanics-blind-causal-review.json");
	  const mechanicsBlindCausalReview = await summarizeMechanicsBlindCausalReview(mechanicsBlindCausalReviewPath, reportsRoot);
	  const agentLoopMechanicsLedgerPath = path.join(reportsRoot, "agent-loop-mechanics-ledger.json");
  const agentLoopMechanicsLedger = await summarizeAgentLoopMechanicsLedger(agentLoopMechanicsLedgerPath, reportsRoot);
  const playbasisMechanicsEvidence = await summarizePlaybasisMechanicsEvidence({
    reportsRoot,
    mechanicsCoverage,
	    mechanicsActivationReadiness,
	    mechanicsSensitiveHeldout,
	    mechanicsReplicatedIntervention,
	    mechanicsBlindCausalReview,
	    agentLoopMechanicsLedger
	  });
  const serviceProbes = [
    ...(await Promise.all(proofFiles.map((file) => extractServiceProbes(file)))).flat(),
    ...await extractMechanicsCoverageProbes(mechanicsCoveragePath),
    ...await extractWorkspaceOpsCeoSimAdapterProbes(workspaceOpsCeoSimAdapterPath),
    ...await extractWorkspaceOpsCeoSimPolicyExperimentProbes(workspaceOpsCeoSimPolicyExperimentPath),
    ...await extractWorkspaceOpsCeoSimDeltaReplayProbes(workspaceOpsCeoSimDeltaReplayPath),
    ...await extractWorkspaceOpsCeoSimDeltaHeldoutReviewProbes(workspaceOpsCeoSimDeltaHeldoutPath)
  ];
  const missionTemplates = buildMissionTemplates(runs);

  const index: RunWarehouseIndex = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      repoRootName: path.basename(options.repoRoot),
      runsRoot: path.relative(options.repoRoot, runsRoot) || "."
    },
    counts: {
      runs: runs.length,
      traces: traces.length,
      artifacts: artifacts.length,
      evals: evals.length,
      proofReports: proofReports.length,
      optimizationSessions: optimizationSessions.length,
      serviceProbes: serviceProbes.length,
      redactionReports: redactionReports.length,
      parentChildRunEdges: parentChildRuns.length,
      missionTemplates: missionTemplates.length
    },
    runs: runs.sort((a, b) => dateMs(a.completedAt) - dateMs(b.completedAt)),
    traces,
    artifacts,
    evals,
    proofReports,
    optimizationSessions,
    serviceProbes,
    mechanicsCoverage,
    mechanicsActivationReadiness,
    workspaceOpsCeoSimAdapter,
    workspaceOpsCeoSimPolicyExperiment,
    workspaceOpsCeoSimRepairQuest,
    workspaceOpsCeoSimDeltaReplay,
    workspaceOpsCeoSimDeltaHeldoutReview,
	    mechanicsSensitiveHeldout,
	    mechanicsReplicatedIntervention,
	    mechanicsBlindCausalReview,
	    playbasisMechanicsEvidence,
    agentLoopMechanicsLedger,
    redactionReports,
    lineage: {
      parentChildRuns,
      missionTemplates
    }
  };
  return index;
}

export async function writeRunWarehouseIndex(options: RunWarehouseBuildOptions): Promise<{
  index: RunWarehouseIndex;
  summary: RunWarehouseSummary;
  indexPath: string;
  summaryPath: string;
}> {
  const reportsRoot = options.reportsRoot ?? path.join(options.repoRoot, "reports");
  const outputRoot = path.join(reportsRoot, "run-warehouse");
  const index = await buildRunWarehouseIndex(options);
  const summary = summarizeRunWarehouse(index);
  await mkdir(outputRoot, { recursive: true });
  const indexPath = path.join(outputRoot, "index.json");
  const summaryPath = path.join(outputRoot, "summary.json");
  await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return { index, summary, indexPath, summaryPath };
}

export function queryRunWarehouse(index: RunWarehouseIndex, query: RunWarehouseQueryOptions): RunWarehouseRun[] {
  const serviceRunIds = query.serviceFamily
    ? new Set(index.optimizationSessions.flatMap(() => [] as string[]))
    : undefined;
  const proofFamilies = query.serviceFamily
    ? new Set(index.serviceProbes.filter((probe) => probe.serviceFamily === query.serviceFamily && probe.ok).map((probe) => probe.proofId))
    : undefined;
  return index.runs.filter((run) =>
    (!query.profile || run.profile === query.profile)
    && (!query.missionId || run.missionId === query.missionId || run.missionTemplateId === query.missionId)
    && (!query.promotionDecision || run.promotionDecision === query.promotionDecision)
    && (query.minHeldOutScore === undefined || run.evalScores.heldOut >= query.minHeldOutScore)
    && (query.minTrainingScore === undefined || run.evalScores.training >= query.minTrainingScore)
    && (query.mechanicsActivationReady === undefined || run.mechanicsActivationReadiness?.allReady === query.mechanicsActivationReady)
    && (!query.mechanicsActivationMissingEnvKey || Boolean(run.mechanicsActivationReadiness?.missingRequiredEnvKeys.includes(query.mechanicsActivationMissingEnvKey)))
    && (!query.mechanicsActivationMissingOperatorFlag || Boolean(run.mechanicsActivationReadiness?.missingRequiredOperatorFlags.includes(query.mechanicsActivationMissingOperatorFlag)))
    && (query.agentLoopLedgerWired === undefined || isAgentLoopLedgerWired(run.agentLoopMechanicsLedger) === query.agentLoopLedgerWired)
    && (!query.agentLoopPromotionDecision || run.agentLoopMechanicsLedger?.promotionDecision === query.agentLoopPromotionDecision)
    && (query.agentLoopMinLiveBackedRecords === undefined || numberValue(run.agentLoopMechanicsLedger?.liveBackedRecords) >= query.agentLoopMinLiveBackedRecords)
    && (query.agentLoopMaxBlockedRecords === undefined || numberValue(run.agentLoopMechanicsLedger?.blockedRecords) <= query.agentLoopMaxBlockedRecords)
    && (!query.agentLoopMechanic || Boolean(run.agentLoopMechanicsLedger?.mechanics.includes(query.agentLoopMechanic)))
    && (query.mechanicsSensitiveHeldoutReady === undefined || index.mechanicsSensitiveHeldout?.nonSaturatedMeasurementReady === query.mechanicsSensitiveHeldoutReady)
    && (query.minMechanicsSensitiveHeldoutLift === undefined || numberValue(index.mechanicsSensitiveHeldout?.mechanicsSensitiveHeldOutLift) >= query.minMechanicsSensitiveHeldoutLift)
    && (query.playbasisMechanicsCausalProofReady === undefined || index.playbasisMechanicsEvidence?.causalProofReady === query.playbasisMechanicsCausalProofReady)
    && (query.minPlaybasisLiveMechanics === undefined || numberValue(index.playbasisMechanicsEvidence?.liveRecordedMechanics) >= query.minPlaybasisLiveMechanics)
    && (query.minOutcomeLinkedMechanics === undefined || numberValue(index.playbasisMechanicsEvidence?.outcomeLinkedMechanics) >= query.minOutcomeLinkedMechanics)
    && (!serviceRunIds || serviceRunIds.has(run.runId) || Boolean(proofFamilies?.size))
  );
}

export function summarizeRunWarehouse(index: RunWarehouseIndex): RunWarehouseSummary {
  return {
    generatedAt: new Date().toISOString(),
    counts: index.counts,
    profiles: countBy(index.runs.map((run) => run.profile)),
    promotionDecisions: countBy(index.runs.map((run) => run.promotionDecision)),
    averageScores: {
      training: average(index.runs.map((run) => run.evalScores.training)),
      heldOut: average(index.runs.map((run) => run.evalScores.heldOut)),
      trust: average(index.runs.map((run) => run.evalScores.trust)),
      economic: average(index.runs.map((run) => run.evalScores.economic))
    },
    zeroLeakRuns: index.runs.filter((run) => run.redaction.leaksDetected === 0).length,
    serviceFamilies: Object.fromEntries(
      Object.entries(groupBy(index.serviceProbes, (probe) => probe.serviceFamily))
        .map(([family, probes]) => [family, { ok: probes.filter((probe) => probe.ok).length, total: probes.length }])
    ),
    mechanicsCoverage: index.mechanicsCoverage,
    mechanicsActivationReadiness: index.mechanicsActivationReadiness,
    mechanicsActivationReadinessRuns: summarizeRunMechanicsActivationReadiness(index.runs),
    agentLoopMechanicsLedgerRuns: summarizeRunAgentLoopMechanicsLedger(index.runs),
    workspaceOpsCeoSimAdapter: index.workspaceOpsCeoSimAdapter,
    workspaceOpsCeoSimPolicyExperiment: index.workspaceOpsCeoSimPolicyExperiment,
    workspaceOpsCeoSimRepairQuest: index.workspaceOpsCeoSimRepairQuest,
    workspaceOpsCeoSimDeltaReplay: index.workspaceOpsCeoSimDeltaReplay,
	    workspaceOpsCeoSimDeltaHeldoutReview: index.workspaceOpsCeoSimDeltaHeldoutReview,
	    mechanicsSensitiveHeldout: index.mechanicsSensitiveHeldout,
	    mechanicsReplicatedIntervention: index.mechanicsReplicatedIntervention,
	    mechanicsBlindCausalReview: index.mechanicsBlindCausalReview,
	    playbasisMechanicsEvidence: index.playbasisMechanicsEvidence,
    agentLoopMechanicsLedger: index.agentLoopMechanicsLedger,
    latestRuns: [...index.runs]
      .sort((a, b) => dateMs(b.completedAt) - dateMs(a.completedAt))
      .slice(0, 10)
      .map((run) => ({
        runId: run.runId,
        missionId: run.missionId,
        profile: run.profile,
        promotionDecision: run.promotionDecision,
        completedAt: run.completedAt,
        evalScores: run.evalScores
      }))
  };
}

async function walkFiles(root: string): Promise<string[]> {
  const output: string[] = [];
  try {
    await walk(root, output);
  } catch {
    return [];
  }
  return output;
}

async function walk(directory: string, output: string[]): Promise<void> {
  const entries = await readdir(directory);
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry);
    const itemStat = await stat(absolutePath);
    if (itemStat.isDirectory()) {
      await walk(absolutePath, output);
    } else {
      output.push(absolutePath);
    }
  }
}

async function readJson<T>(filePath: string): Promise<T | undefined> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return undefined;
  }
}

async function summarizeTraceFile(filePath: string, runsRoot: string): Promise<RunWarehouseTrace | undefined> {
  try {
    const lines = (await readFile(filePath, "utf8")).split(/\r?\n/).filter(Boolean);
    const eventTypes: Record<string, number> = {};
    for (const line of lines) {
      const parsed = JSON.parse(line) as { type?: string };
      const type = String(parsed.type ?? "unknown");
      eventTypes[type] = (eventTypes[type] ?? 0) + 1;
    }
    return {
      runId: path.basename(path.dirname(filePath)),
      eventCount: lines.length,
      eventTypes,
      relativePath: path.relative(runsRoot, filePath)
    };
  } catch {
    return undefined;
  }
}

async function traceSummaryForRun(traceFiles: string[], runId: string): Promise<RunWarehouseTrace | undefined> {
  const traceFile = traceFiles.find((file) => path.basename(path.dirname(file)) === runId);
  return traceFile ? summarizeTraceFile(traceFile, path.dirname(path.dirname(traceFile))) : undefined;
}

async function summarizeProofReport(filePath: string, runsRoot: string): Promise<RunWarehouseProofReport | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const basename = path.basename(filePath);
  const kind = basename === "value-proof-report.json"
    ? "value-proof"
    : basename === "robust-proof-report.json" ? "robust-proof" : basename === "provider-smoke-report.json" ? "provider-smoke" : "unknown";
  return {
    proofId: String(report.proofId ?? report.smokeId ?? path.basename(path.dirname(filePath))),
    kind,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    passed: typeof report.passed === "boolean" ? report.passed : typeof report.ok === "boolean" ? report.ok : undefined,
    relativePath: path.relative(runsRoot, filePath),
    startedAt: typeof report.startedAt === "string" ? report.startedAt : undefined,
    completedAt: typeof report.completedAt === "string" ? report.completedAt : undefined
  };
}

async function summarizeOptimizationSession(filePath: string, runsRoot: string): Promise<RunWarehouseOptimizationSession | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const candidates = Array.isArray(report.candidates) ? report.candidates as Array<Record<string, unknown>> : [];
  const isHillClimb = path.basename(filePath) === "hill-climb-report.json";
  return {
    sessionId: String(report.sessionId ?? path.basename(path.dirname(filePath))),
    kind: isHillClimb ? "scripted-maturity-ladder" : "mission-optimizer",
    profile: typeof report.profile === "string" ? report.profile : undefined,
    missionId: typeof report.missionId === "string" ? report.missionId : undefined,
    candidateCount: candidates.length,
    baselineRunId: typeof report.baselineRunId === "string" ? report.baselineRunId : undefined,
    bestRunId: typeof report.bestRunId === "string" ? report.bestRunId : undefined,
    selectedWinnerRunId: typeof report.selectedWinnerRunId === "string" ? report.selectedWinnerRunId : undefined,
    trainingScore: numberOrUndefined(report.bestTrainingScore ?? report.trainingScore),
    heldOutScore: numberOrUndefined(report.bestHeldOutScore ?? report.heldOutScore),
    relativePath: path.relative(runsRoot, filePath)
  };
}

async function extractServiceProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const proofId = String(report.proofId ?? report.smokeId ?? path.basename(path.dirname(filePath)));
  const probes: RunWarehouseServiceProbe[] = [];
  const api = report.api as { probes?: Array<Record<string, unknown>> } | undefined;
  const workspaceOps = report.workspaceOps as { probes?: Array<Record<string, unknown>> } | undefined;
  for (const probe of [...(api?.probes ?? []), ...(workspaceOps?.probes ?? [])]) {
    probes.push(summarizeProbe(proofId, probe));
  }
  const providerProbe = report.providerProbe as Record<string, unknown> | undefined;
  if (providerProbe) probes.push(summarizeProbe(proofId, providerProbe));
  return probes;
}

async function extractMechanicsCoverageProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const coverage = objectField(report.coverage) ?? objectField(report.apiCoverage);
  const probes = arrayField<Record<string, unknown>>(coverage?.probes);
  return probes.map((probe) => summarizeProbe("playbasis-mechanics-coverage", probe));
}

async function extractWorkspaceOpsCeoSimAdapterProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const adapter = objectField(report.adapter) ?? report;
  const probes = arrayField<Record<string, unknown>>(adapter.probes);
  return probes.map((probe) => summarizeProbe("workspaceops-ceo-sim-adapter", probe));
}

async function extractWorkspaceOpsCeoSimPolicyExperimentProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const experiment = objectField(report.experiment) ?? report;
  const probes = arrayField<Record<string, unknown>>(experiment.probes);
  return probes.map((probe) => summarizeProbe("workspaceops-ceo-sim-policy-experiment", probe));
}

async function extractWorkspaceOpsCeoSimDeltaReplayProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const replay = objectField(report.replay) ?? report;
  const probes = arrayField<Record<string, unknown>>(replay.probes);
  return probes.map((probe) => summarizeProbe("workspaceops-ceo-sim-delta-replay", probe));
}

async function extractWorkspaceOpsCeoSimDeltaHeldoutReviewProbes(filePath: string): Promise<RunWarehouseServiceProbe[]> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return [];
  const review = objectField(report.review) ?? report;
  const probes = arrayField<Record<string, unknown>>(review.probes);
  return probes.map((probe) => summarizeProbe("workspaceops-ceo-sim-delta-heldout", probe));
}

async function summarizeMechanicsCoverage(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseMechanicsCoverage | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const apiCoverage = objectField(report.apiCoverage);
  const workspaceOps = objectField(report.workspaceOps);
  const coverage = objectField(report.coverage) ?? apiCoverage;
  const leverage = objectField(report.playbasisApiLeverage);
  const safety = objectField(coverage?.safety);
  const summary = objectField(leverage?.summary);
  const mechanics = arrayField<Record<string, unknown>>(coverage?.mechanics);
  const playbasisMechanics = arrayField<Record<string, unknown>>(leverage?.playbasisMechanics);
  const recordedMechanics = mechanics
    .filter((item) => item.ok === true)
    .map((item) => String(item.category ?? item.capability ?? "unknown"))
    .filter(Boolean);
  const liveRecordedMechanics = playbasisMechanics
    .filter((item) => item.status === "recorded" && item.liveBacked === true)
    .map((item) => String(item.category ?? item.capability ?? "unknown"))
    .filter(Boolean);
  const availableMechanics = playbasisMechanics.length > 0
    ? playbasisMechanics
      .filter((item) => item.status === "available")
      .map((item) => String(item.category ?? item.capability ?? "unknown"))
      .filter(Boolean)
    : mechanics
      .filter((item) => item.ok !== true)
      .map((item) => String(item.category ?? item.capability ?? "unknown"))
      .filter(Boolean);
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    status: String(coverage?.status ?? apiCoverage?.status ?? "unknown"),
    mode: typeof coverage?.mode === "string" ? coverage.mode : typeof apiCoverage?.mode === "string" ? apiCoverage.mode : undefined,
    apiSuccessfulCalls: numberValue(apiCoverage?.successfulCalls),
    apiTotalCalls: numberValue(apiCoverage?.totalCalls),
    workspaceSuccessfulCalls: numberValue(workspaceOps?.successfulCalls),
    workspaceTotalCalls: numberValue(workspaceOps?.totalCalls),
    recordedMechanics,
    liveRecordedMechanics,
    availableMechanics,
    safeLiveProbeMechanics: numberValue(summary?.liveRecordedCapabilities),
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true || summary?.rawPayloadsIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true || summary?.envValuesIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeMechanicsActivationReadiness(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseMechanicsActivationReadiness | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const sourceReport = objectField(report.sourceReport);
  const summary = objectField(report.summary);
  const safety = objectField(report.safety);
  const gates = arrayField<Record<string, unknown>>(report.gates).map((gate) => ({
    capability: String(gate.capability ?? "unknown"),
    activationStatus: String(gate.activationStatus ?? "unknown"),
    readinessStatus: String(gate.readinessStatus ?? "unknown"),
    readyToRun: gate.readyToRun === true,
    missingRequiredEnvKeys: arrayField<unknown>(gate.missingRequiredEnvKeys).map(safeEnvKeyName).filter(Boolean),
    missingRequiredOperatorFlags: arrayField<unknown>(gate.missingRequiredOperatorFlags).map(String).filter(Boolean)
  }));
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    readyGates: numberValue(summary?.readyGates),
    totalGates: numberValue(summary?.totalGates),
    blockedGates: numberValue(summary?.blockedGates),
    writeGatedCapabilities: numberValue(summary?.writeGatedCapabilities),
    identifierRequiredCapabilities: numberValue(summary?.identifierRequiredCapabilities),
    missingRequiredEnvKeys: arrayField<unknown>(summary?.missingRequiredEnvKeys).map(safeEnvKeyName).filter(Boolean),
    missingRequiredOperatorFlags: arrayField<unknown>(summary?.missingRequiredOperatorFlags).map(String).filter(Boolean),
    allReady: summary?.allReady === true,
    sourceReportHash: typeof sourceReport?.hash === "string" ? sourceReport.hash : undefined,
    sourceLiveRecordedCapabilities: numberValue(sourceReport?.liveRecordedCapabilities),
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true,
    requestBodiesIncluded: safety?.requestBodiesIncluded === true,
    responseBodiesIncluded: safety?.responseBodiesIncluded === true,
    gates,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeWorkspaceOpsCeoSimAdapter(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseWorkspaceOpsCeoSimAdapter | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const adapter = objectField(report.adapter) ?? report;
  const command = objectField(adapter.command);
  const parsedSummary = objectField(adapter.parsedSummary);
  const redaction = objectField(adapter.redaction);
  const safety = objectField(adapter.safety);
  const sourceFiles = arrayField<Record<string, unknown>>(adapter.sourceFiles);
  const improvementTargets = arrayField<Record<string, unknown>>(adapter.improvementTargets);
  return {
    generatedAt: typeof adapter.generatedAt === "string"
      ? adapter.generatedAt
      : typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof adapter.profile === "string" ? adapter.profile : typeof report.profile === "string" ? report.profile : undefined,
    status: String(adapter.status ?? "unknown"),
    mode: typeof adapter.mode === "string" ? adapter.mode : undefined,
    exercisedRealSurface: adapter.exercisedRealSurface === true,
    commandExecuted: command?.executed === true,
    exitCode: typeof command?.exitCode === "number" ? command.exitCode : null,
    failureCategory: typeof command?.failureCategory === "string" ? command.failureCategory : undefined,
    passedChecks: numberValue(parsedSummary?.passedChecks),
    failedChecks: numberValue(parsedSummary?.failedChecks),
    failedCheckIds: arrayField<string>(parsedSummary?.failedCheckIds).map(String),
    improvementTargets: improvementTargets.map((target) => ({
      targetId: String(target.targetId ?? "unknown"),
      severity: String(target.severity ?? "unknown"),
      playbasisMechanics: arrayField<string>(target.playbasisMechanics).map(String)
    })),
    scenarioReportCount: numberValue(parsedSummary?.scenarioReportCount),
    matrixCheckCount: numberValue(parsedSummary?.matrixCheckCount),
    resumeCheckPassed: typeof parsedSummary?.resumeCheckPassed === "boolean" ? parsedSummary.resumeCheckPassed : undefined,
    sourceFilesPresent: sourceFiles.filter((item) => item.exists === true).length,
    sourceFilesTotal: sourceFiles.length,
    redactionLeaks: numberValue(redaction?.leaksDetected),
    rawStdoutIncluded: safety?.rawStdoutIncluded === true,
    rawStderrIncluded: safety?.rawStderrIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeWorkspaceOpsCeoSimPolicyExperiment(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseWorkspaceOpsCeoSimPolicyExperiment | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const experiment = objectField(report.experiment) ?? report;
  const suiteCommand = objectField(experiment.suiteCommand);
  const targetMetric = objectField(experiment.targetMetric);
  const selection = objectField(experiment.selection);
  const redaction = objectField(experiment.redaction);
  const safety = objectField(experiment.safety);
  const variants = arrayField<Record<string, unknown>>(experiment.variants);
  const mechanicsPlan = arrayField<Record<string, unknown>>(experiment.mechanicsPlan);
  return {
    generatedAt: typeof experiment.generatedAt === "string"
      ? experiment.generatedAt
      : typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof experiment.profile === "string" ? experiment.profile : typeof report.profile === "string" ? report.profile : undefined,
    status: String(experiment.status ?? "unknown"),
    mode: typeof experiment.mode === "string" ? experiment.mode : undefined,
    exercisedRealSurface: experiment.exercisedRealSurface === true,
    targetId: String(experiment.targetId ?? "unknown"),
    targetResolved: experiment.targetResolved === true,
    targetObserved: numberOrUndefined(targetMetric?.observed),
    targetThreshold: numberValue(targetMetric?.threshold),
    suiteExitCode: typeof suiteCommand?.exitCode === "number" ? suiteCommand.exitCode : null,
    variantCount: variants.length,
    selectedVariantId: typeof selection?.selectedVariantId === "string" ? selection.selectedVariantId : undefined,
    promoted: selection?.promoted === true,
    mechanics: mechanicsPlan.map((item) => String(item.mechanic ?? "unknown")).filter(Boolean),
    redactionLeaks: numberValue(redaction?.leaksDetected),
    rawStdoutIncluded: safety?.rawStdoutIncluded === true,
    rawStderrIncluded: safety?.rawStderrIncluded === true,
    rawDayLogsIncluded: safety?.rawDayLogsIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeWorkspaceOpsCeoSimRepairQuest(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseWorkspaceOpsCeoSimRepairQuest | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const repairQuest = objectField(report.repairQuest) ?? report;
  const sourceExperiment = objectField(repairQuest.sourceExperiment);
  const redaction = objectField(repairQuest.redaction);
  const safety = objectField(repairQuest.safety);
  const ledger = arrayField<Record<string, unknown>>(repairQuest.mechanicsLedger);
  return {
    generatedAt: typeof repairQuest.generatedAt === "string"
      ? repairQuest.generatedAt
      : typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof repairQuest.profile === "string" ? repairQuest.profile : typeof report.profile === "string" ? report.profile : undefined,
    status: String(repairQuest.status ?? "unknown"),
    questId: String(repairQuest.questId ?? "unknown"),
    targetId: String(repairQuest.targetId ?? "unknown"),
    targetResolved: repairQuest.targetResolved === true,
    selectedVariantId: typeof sourceExperiment?.selectedVariantId === "string" ? sourceExperiment.selectedVariantId : undefined,
    promoted: sourceExperiment?.promoted === true,
    targetObserved: numberOrUndefined(sourceExperiment?.targetObserved),
    targetThreshold: numberValue(sourceExperiment?.targetThreshold),
    recordedMechanics: ledger.filter((item) => item.status === "recorded").length,
    totalMechanics: ledger.length,
    blockedMechanics: ledger.filter((item) => item.status === "blocked").length,
    plannedMechanics: ledger.filter((item) => item.status === "planned").length,
    mechanics: ledger.map((item) => String(item.mechanic ?? "unknown")).filter(Boolean),
    redactionLeaks: numberValue(redaction?.leaksDetected),
    rawExperimentBodyIncluded: safety?.rawExperimentBodyIncluded === true,
    rawSimulatorBodyIncluded: safety?.rawSimulatorBodyIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeWorkspaceOpsCeoSimDeltaReplay(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseWorkspaceOpsCeoSimDeltaReplay | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const replay = objectField(report.replay) ?? report;
  const safety = objectField(replay.safety);
  const redaction = objectField(replay.redaction);
  const deltas = arrayField<Record<string, unknown>>(replay.deltas);
  return {
    generatedAt: typeof replay.generatedAt === "string"
      ? replay.generatedAt
      : typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof replay.profile === "string" ? replay.profile : typeof report.profile === "string" ? report.profile : undefined,
    status: String(replay.status ?? "unknown"),
    mode: typeof replay.mode === "string" ? replay.mode : undefined,
    baselineObserved: numberOrUndefined(replay.baselineObserved),
    selectedDeltaId: typeof replay.selectedDeltaId === "string" ? replay.selectedDeltaId : undefined,
    selectedDeltaResolvedTarget: replay.selectedDeltaResolvedTarget === true,
    selectedDeltaRequiresPlatformPatch: replay.selectedDeltaRequiresPlatformPatch === true,
    promotionDecision: String(replay.promotionDecision ?? "unknown"),
    deltaCount: deltas.length,
    resolvedDeltaCount: deltas.filter((delta) => delta.targetResolved === true && numberValue(delta.failedChecks) === 0).length,
    tempFilesDeleted: safety?.tempFilesDeleted === true,
    platformSourceMutated: safety?.platformSourceMutated === true,
    rawPatchedSourceIncluded: safety?.rawPatchedSourceIncluded === true,
    redactionLeaks: numberValue(redaction?.leaksDetected),
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeWorkspaceOpsCeoSimDeltaHeldoutReview(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseWorkspaceOpsCeoSimDeltaHeldoutReview | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const review = objectField(report.review) ?? report;
  const heldOut = objectField(review.heldOut);
  const score = objectField(review.score);
  const redaction = objectField(review.redaction);
  const safety = objectField(review.safety);
  return {
    generatedAt: typeof review.generatedAt === "string"
      ? review.generatedAt
      : typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof review.profile === "string" ? review.profile : typeof report.profile === "string" ? report.profile : undefined,
    status: String(review.status ?? "unknown"),
    mode: typeof review.mode === "string" ? review.mode : undefined,
    candidateDeltaId: typeof review.candidateDeltaId === "string" ? review.candidateDeltaId : undefined,
    selectedDeltaResolvedTarget: review.selectedDeltaResolvedTarget === true,
    heldOutExists: heldOut?.exists === true,
    heldOutOutsideRepo: heldOut?.outsideRepo === true,
    heldOutFileCount: numberValue(heldOut?.fileCount),
    privateScorerInputsRead: heldOut?.privateScorerInputsRead === true,
    score: numberOrUndefined(score?.score),
    threshold: numberValue(score?.threshold),
    pass: score?.pass === true,
    casesScored: numberValue(score?.casesScored),
    casesPassed: numberValue(score?.casesPassed),
    casesFailed: numberValue(score?.casesFailed),
    promotionDecision: String(review.promotionDecision ?? "unknown"),
    redactionLeaks: numberValue(redaction?.leaksDetected),
    rawHeldOutBodiesIncluded: safety?.rawHeldOutBodiesIncluded === true,
    rawAnswerKeysIncluded: safety?.rawAnswerKeysIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeMechanicsSensitiveHeldout(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseMechanicsSensitiveHeldout | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const sourceExperiment = objectField(report.sourceExperiment);
  const deltas = objectField(report.deltas);
  const summary = objectField(report.summary);
  const privateBundle = objectField(report.privateBundle);
  const safety = objectField(report.safety);
  const arms = arrayField<Record<string, unknown>>(report.arms);
  const control = arms.find((arm) => arm.arm === "control");
  const treatment = arms.find((arm) => arm.arm === "treatment");
  const gates = arrayField<Record<string, unknown>>(report.gates).map((gate) => ({
    name: String(gate.name ?? "unknown"),
    status: String(gate.status ?? "unknown"),
    summary: String(gate.summary ?? "")
  }));
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    familyId: String(report.familyId ?? "unknown"),
    scorerMode: typeof report.scorerMode === "string" ? report.scorerMode : undefined,
    claimStatus: String(summary?.claimStatus ?? "unknown"),
    genericEvalCeilingDetected: sourceExperiment?.genericEvalCeilingDetected === true,
    genericHeldOutLift: numberValue(deltas?.genericHeldOutLift),
    mechanicsSensitiveHeldOutLift: numberValue(deltas?.mechanicsSensitiveHeldOutLift),
    mechanicsExecutionLift: numberValue(deltas?.mechanicsExecutionLift),
    controlRunId: String(summary?.controlRunId ?? control?.runId ?? "unknown"),
    treatmentRunId: String(summary?.treatmentRunId ?? treatment?.runId ?? "unknown"),
    controlScore: numberValue(control?.mechanicsSensitiveHeldOutScore),
    treatmentScore: numberValue(treatment?.mechanicsSensitiveHeldOutScore),
    nonSaturatedMeasurementReady: summary?.nonSaturatedMeasurementReady === true,
    scorerDistinguishesTreatment: summary?.scorerDistinguishesTreatment === true,
    candidateReadyForBlindReplication: summary?.candidateReadyForBlindReplication === true,
    causalProofReady: summary?.causalProofReady === true,
    zeroLeak: summary?.zeroLeak === true,
    privateBundleProvided: privateBundle?.provided === true,
    privateBundleOutsideRepo: privateBundle?.outsideRepo !== false,
    privateBundleBodiesIncluded: privateBundle?.bodiesIncluded === true,
    privateBundleAnswerKeysIncluded: privateBundle?.answerKeysIncluded === true,
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true,
    requestBodiesIncluded: safety?.requestBodiesIncluded === true,
    responseBodiesIncluded: safety?.responseBodiesIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true,
    rawUrlsIncluded: safety?.rawUrlsIncluded === true,
    privateBodiesIncluded: safety?.privateBodiesIncluded === true,
    rawHeldOutCasesIncluded: safety?.rawHeldOutCasesIncluded === true,
    answerKeysIncluded: safety?.answerKeysIncluded === true,
    rawArtifactBodiesIncluded: safety?.rawArtifactBodiesIncluded === true,
    gates,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizeMechanicsReplicatedIntervention(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseMechanicsReplicatedIntervention | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const aggregate = objectField(report.aggregate);
  const safety = objectField(report.safety);
  const gates = arrayField<Record<string, unknown>>(report.gates).map((gate) => ({
    name: String(gate.name ?? "unknown"),
    status: String(gate.status ?? "unknown"),
    summary: String(gate.summary ?? "")
  }));
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    familyId: String(report.familyId ?? "unknown"),
    replicateCount: numberValue(report.replicateCount),
    treatmentWins: numberValue(aggregate?.treatmentWins),
    treatmentWinRate: numberValue(aggregate?.treatmentWinRate),
    medianMechanicsSensitiveHeldOutLift: numberValue(aggregate?.medianMechanicsSensitiveHeldOutLift),
    averageMechanicsSensitiveHeldOutLift: numberValue(aggregate?.averageMechanicsSensitiveHeldOutLift),
    averageGenericHeldOutLift: numberValue(aggregate?.averageGenericHeldOutLift),
    averageMechanicsExecutionLift: numberValue(aggregate?.averageMechanicsExecutionLift),
    replicatedMeasurementReady: aggregate?.replicatedMeasurementReady === true,
    causalProofReady: aggregate?.causalProofReady === true,
    zeroLeak: aggregate?.allZeroLeak === true,
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true,
    requestBodiesIncluded: safety?.requestBodiesIncluded === true,
    responseBodiesIncluded: safety?.responseBodiesIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true,
    rawUrlsIncluded: safety?.rawUrlsIncluded === true,
    privateBodiesIncluded: safety?.privateBodiesIncluded === true,
    rawHeldOutCasesIncluded: safety?.rawHeldOutCasesIncluded === true,
    answerKeysIncluded: safety?.answerKeysIncluded === true,
    rawArtifactBodiesIncluded: safety?.rawArtifactBodiesIncluded === true,
    gates,
    relativePath: path.relative(reportsRoot, filePath)
	  };
	}

async function summarizeMechanicsBlindCausalReview(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseMechanicsBlindCausalReview | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const aggregate = objectField(report.aggregate);
  const safety = objectField(report.safety);
  const sourcePacket = objectField(report.sourcePacket);
  const gates = arrayField<Record<string, unknown>>(report.gates).map((gate) => ({
    name: String(gate.name ?? "unknown"),
    status: String(gate.status ?? "unknown"),
    summary: String(gate.summary ?? "")
  }));
  const preferenceRateValue = aggregate?.treatmentPreferenceRate;
  const agreementValue = aggregate?.interReviewerAgreement;
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    familyId: String(report.familyId ?? "unknown"),
    reviewMode: String(report.reviewMode ?? "unknown"),
    packetHash: String(sourcePacket?.packetHash ?? ""),
    blindedPairCount: numberValue(sourcePacket?.blindedPairCount),
    blindReviewRowsPresent: aggregate?.blindReviewRowsPresent === true,
    fixtureOnly: aggregate?.fixtureOnly === true,
    humanRowsPresent: aggregate?.humanRowsPresent === true,
    externalRowsPresent: aggregate?.externalRowsPresent === true,
    reviewerCount: numberValue(aggregate?.reviewerCount),
    reviewRowCount: numberValue(aggregate?.reviewRowCount),
    reviewedPairCount: numberValue(aggregate?.reviewedPairCount),
    pairCoverageRate: numberValue(aggregate?.pairCoverageRate),
    treatmentPreferenceRate: typeof preferenceRateValue === "number" ? preferenceRateValue : null,
    interReviewerAgreement: typeof agreementValue === "number" ? agreementValue : null,
    blindExternalReviewReady: aggregate?.blindExternalReviewReady === true,
    causalProofReady: aggregate?.causalProofReady === true,
    zeroLeak: aggregate?.zeroLeak === true,
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true,
    requestBodiesIncluded: safety?.requestBodiesIncluded === true,
    responseBodiesIncluded: safety?.responseBodiesIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true,
    rawUrlsIncluded: safety?.rawUrlsIncluded === true,
    privateBodiesIncluded: safety?.privateBodiesIncluded === true,
    rawArtifactBodiesIncluded: safety?.rawArtifactBodiesIncluded === true,
    rawReviewTextIncluded: safety?.rawReviewTextIncluded === true,
    answerKeysIncluded: safety?.answerKeysIncluded === true,
    treatmentControlMappingIncluded: safety?.treatmentControlMappingIncluded === true,
    gates,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

async function summarizePlaybasisMechanicsEvidence(input: {
  reportsRoot: string;
  mechanicsCoverage?: RunWarehouseMechanicsCoverage;
  mechanicsActivationReadiness?: RunWarehouseMechanicsActivationReadiness;
  mechanicsSensitiveHeldout?: RunWarehouseMechanicsSensitiveHeldout;
  mechanicsReplicatedIntervention?: RunWarehouseMechanicsReplicatedIntervention;
  mechanicsBlindCausalReview?: RunWarehouseMechanicsBlindCausalReview;
  agentLoopMechanicsLedger?: RunWarehouseAgentLoopMechanicsLedger;
}): Promise<RunWarehousePlaybasisMechanicsEvidence | undefined> {
  const outcomePath = path.join(input.reportsRoot, "playbasis-mechanics-outcome-attribution.json");
  const interventionPath = path.join(input.reportsRoot, "playbasis-mechanics-intervention-experiment.json");
  const outcome = await readJson<Record<string, unknown>>(outcomePath);
  const intervention = await readJson<Record<string, unknown>>(interventionPath);
  const outcomeSummary = objectField(outcome?.summary);
  const interventionSummary = objectField(intervention?.summary);
  const interventionDeltas = objectField(intervention?.deltas);
  const hasEvidence = Boolean(
    input.mechanicsCoverage
    || input.mechanicsActivationReadiness
	    || input.mechanicsSensitiveHeldout
	    || input.mechanicsReplicatedIntervention
	    || input.mechanicsBlindCausalReview
	    || input.agentLoopMechanicsLedger
    || outcome
    || intervention
  );
  if (!hasEvidence) return undefined;

  const liveRecordedMechanics = input.mechanicsCoverage?.liveRecordedMechanics.length ?? numberValue(outcomeSummary?.liveBackedMechanics);
  const recordedMechanics = input.mechanicsCoverage?.recordedMechanics.length ?? liveRecordedMechanics;
  const availableOnlyMechanics = input.mechanicsCoverage?.availableMechanics.length ?? 0;
  const outcomeLinkedMechanics = numberValue(outcomeSummary?.outcomeLinkedMechanics);
  const activationReady = input.mechanicsActivationReadiness?.allReady === true;
  const agentLoopLedgerWired = isAgentLoopLedgerWired(input.agentLoopMechanicsLedger);
  const nonSaturatedMeasurementReady = input.mechanicsSensitiveHeldout?.nonSaturatedMeasurementReady === true;
	  const replicatedMeasurementReady = input.mechanicsReplicatedIntervention?.replicatedMeasurementReady === true;
	  const blindReviewReady = input.mechanicsBlindCausalReview?.blindExternalReviewReady === true;
	  const candidateReadyForBlindReplication = input.mechanicsSensitiveHeldout?.candidateReadyForBlindReplication === true;
  const mechanicsSensitiveHeldOutLift = numberValue(input.mechanicsSensitiveHeldout?.mechanicsSensitiveHeldOutLift);
  const genericHeldOutLift = numberValue(input.mechanicsSensitiveHeldout?.genericHeldOutLift);
  const mechanicsExecutionLift = input.mechanicsSensitiveHeldout
    ? input.mechanicsSensitiveHeldout.mechanicsExecutionLift
    : input.mechanicsReplicatedIntervention
      ? input.mechanicsReplicatedIntervention.averageMechanicsExecutionLift
    : numberValue(interventionDeltas?.mechanicsExecutionLift);
  const noCoverageLeak = input.mechanicsCoverage
    ? !input.mechanicsCoverage.rawPayloadsIncluded && !input.mechanicsCoverage.envValuesIncluded
    : true;
  const noReadinessLeak = input.mechanicsActivationReadiness
    ? !input.mechanicsActivationReadiness.rawPayloadsIncluded
      && !input.mechanicsActivationReadiness.envValuesIncluded
      && !input.mechanicsActivationReadiness.requestBodiesIncluded
      && !input.mechanicsActivationReadiness.responseBodiesIncluded
    : true;
  const noHeldoutLeak = input.mechanicsSensitiveHeldout
    ? input.mechanicsSensitiveHeldout.zeroLeak
      && !input.mechanicsSensitiveHeldout.rawPayloadsIncluded
      && !input.mechanicsSensitiveHeldout.requestBodiesIncluded
      && !input.mechanicsSensitiveHeldout.responseBodiesIncluded
      && !input.mechanicsSensitiveHeldout.envValuesIncluded
      && !input.mechanicsSensitiveHeldout.privateBodiesIncluded
      && !input.mechanicsSensitiveHeldout.answerKeysIncluded
      && !input.mechanicsSensitiveHeldout.rawArtifactBodiesIncluded
    : true;
	  const noReplicationLeak = input.mechanicsReplicatedIntervention
    ? input.mechanicsReplicatedIntervention.zeroLeak
      && !input.mechanicsReplicatedIntervention.rawPayloadsIncluded
      && !input.mechanicsReplicatedIntervention.requestBodiesIncluded
      && !input.mechanicsReplicatedIntervention.responseBodiesIncluded
      && !input.mechanicsReplicatedIntervention.envValuesIncluded
      && !input.mechanicsReplicatedIntervention.privateBodiesIncluded
      && !input.mechanicsReplicatedIntervention.answerKeysIncluded
      && !input.mechanicsReplicatedIntervention.rawArtifactBodiesIncluded
	    : true;
	  const noBlindReviewLeak = input.mechanicsBlindCausalReview
	    ? input.mechanicsBlindCausalReview.zeroLeak
	      && !input.mechanicsBlindCausalReview.rawPayloadsIncluded
	      && !input.mechanicsBlindCausalReview.requestBodiesIncluded
	      && !input.mechanicsBlindCausalReview.responseBodiesIncluded
	      && !input.mechanicsBlindCausalReview.envValuesIncluded
	      && !input.mechanicsBlindCausalReview.privateBodiesIncluded
	      && !input.mechanicsBlindCausalReview.rawArtifactBodiesIncluded
	      && !input.mechanicsBlindCausalReview.rawReviewTextIncluded
	      && !input.mechanicsBlindCausalReview.answerKeysIncluded
	      && !input.mechanicsBlindCausalReview.treatmentControlMappingIncluded
	    : true;
	  const noLedgerLeak = input.agentLoopMechanicsLedger
    ? input.agentLoopMechanicsLedger.zeroLeak
      && !input.agentLoopMechanicsLedger.rawPayloadsIncluded
      && !input.agentLoopMechanicsLedger.envValuesIncluded
      && !input.agentLoopMechanicsLedger.requestBodiesIncluded
      && !input.agentLoopMechanicsLedger.responseBodiesIncluded
    : true;
	  const zeroLeak = noCoverageLeak && noReadinessLeak && noHeldoutLeak && noReplicationLeak && noBlindReviewLeak && noLedgerLeak;
	  const causalProofReady = outcomeSummary?.causalProofReady === true
	    && interventionSummary?.causalProofReady === true
	    && input.mechanicsSensitiveHeldout?.causalProofReady === true
	    && input.mechanicsReplicatedIntervention?.replicatedMeasurementReady === true
	    && blindReviewReady
	    && activationReady
    && agentLoopLedgerWired
    && zeroLeak;
  const blockers = [
    activationReady ? undefined : "activation-gates-blocked",
    agentLoopLedgerWired ? undefined : "agent-loop-ledger-not-wired",
    nonSaturatedMeasurementReady ? undefined : "non-saturated-heldout-missing",
    candidateReadyForBlindReplication ? undefined : "blind-replication-candidate-not-ready",
    replicatedMeasurementReady ? undefined : "replicated-measurement-not-ready",
    input.mechanicsSensitiveHeldout?.causalProofReady === true || replicatedMeasurementReady ? undefined : "heldout-causal-proof-not-ready",
	    blindReviewReady ? undefined : "blind-external-causal-review-not-ready",
    outcomeSummary?.causalProofReady === true ? undefined : "outcome-attribution-causal-proof-not-ready",
    interventionSummary?.causalProofReady === true ? undefined : "intervention-causal-proof-not-ready",
    zeroLeak ? undefined : "zero-leak-not-proven"
  ].filter((item): item is string => Boolean(item));
  const claimStatus: RunWarehousePlaybasisMechanicsEvidence["claimStatus"] = causalProofReady
    ? "causal-proof-ready"
    : replicatedMeasurementReady
      ? "replicated-mechanics-sensitive-measurement-ready"
    : nonSaturatedMeasurementReady && mechanicsSensitiveHeldOutLift > 0
      ? "mechanics-sensitive-measurement-ready"
      : outcomeLinkedMechanics > 0 || liveRecordedMechanics > 0
        ? "correlated-not-causal"
        : "insufficient-evidence";

  return {
    claimStatus,
	    profile: input.mechanicsCoverage?.profile
	      ?? input.mechanicsSensitiveHeldout?.profile
	      ?? input.mechanicsReplicatedIntervention?.profile
	      ?? input.mechanicsBlindCausalReview?.profile
	      ?? input.agentLoopMechanicsLedger?.profile,
    liveRecordedMechanics,
    recordedMechanics,
    availableOnlyMechanics,
    outcomeLinkedMechanics,
    activationReady,
    readyActivationGates: numberValue(input.mechanicsActivationReadiness?.readyGates),
    blockedActivationGates: numberValue(input.mechanicsActivationReadiness?.blockedGates),
    agentLoopLedgerWired,
    agentLoopLiveBackedRecords: numberValue(input.agentLoopMechanicsLedger?.liveBackedRecords),
    agentLoopBlockedRecords: numberValue(input.agentLoopMechanicsLedger?.blockedRecords),
    genericHeldOutLift,
    mechanicsSensitiveHeldOutLift,
    mechanicsExecutionLift,
    nonSaturatedMeasurementReady,
	    replicatedMeasurementReady,
	    replicatedTreatmentWinRate: numberValue(input.mechanicsReplicatedIntervention?.treatmentWinRate),
	    replicatedMedianMechanicsSensitiveHeldOutLift: numberValue(input.mechanicsReplicatedIntervention?.medianMechanicsSensitiveHeldOutLift),
	    blindReviewRowsPresent: input.mechanicsBlindCausalReview?.blindReviewRowsPresent === true,
	    blindReviewReady,
	    blindReviewMode: input.mechanicsBlindCausalReview?.reviewMode,
	    blindReviewRows: numberValue(input.mechanicsBlindCausalReview?.reviewRowCount),
	    blindReviewHumanRowsPresent: input.mechanicsBlindCausalReview?.humanRowsPresent === true,
	    blindReviewExternalRowsPresent: input.mechanicsBlindCausalReview?.externalRowsPresent === true,
	    blindReviewTreatmentPreferenceRate: input.mechanicsBlindCausalReview?.treatmentPreferenceRate ?? null,
	    candidateReadyForBlindReplication,
    causalProofReady,
    zeroLeak,
    blockers: uniqueSorted(blockers),
    relativePaths: {
      mechanicsCoverage: input.mechanicsCoverage?.relativePath,
      activationReadiness: input.mechanicsActivationReadiness?.relativePath,
      outcomeAttribution: outcome ? path.relative(input.reportsRoot, outcomePath) : undefined,
      interventionExperiment: intervention ? path.relative(input.reportsRoot, interventionPath) : undefined,
	      mechanicsSensitiveHeldout: input.mechanicsSensitiveHeldout?.relativePath,
	      mechanicsReplicatedIntervention: input.mechanicsReplicatedIntervention?.relativePath,
	      mechanicsBlindCausalReview: input.mechanicsBlindCausalReview?.relativePath,
	      agentLoopLedger: input.agentLoopMechanicsLedger?.relativePath
    }
  };
}

async function summarizeAgentLoopMechanicsLedger(
  filePath: string,
  reportsRoot: string
): Promise<RunWarehouseAgentLoopMechanicsLedger | undefined> {
  const report = await readJson<Record<string, unknown>>(filePath);
  if (!report) return undefined;
  const summary = objectField(report.summary);
  const promotion = objectField(report.promotion);
  const redaction = objectField(report.redaction);
  const safety = objectField(report.safety);
  const byMechanic = objectField(summary?.byMechanic);
  const mechanics = byMechanic
    ? Object.entries(byMechanic)
      .filter(([, count]) => numberValue(count) > 0)
      .map(([mechanic]) => mechanic)
      .sort()
    : [];
  return {
    generatedAt: typeof report.generatedAt === "string" ? report.generatedAt : undefined,
    profile: typeof report.profile === "string" ? report.profile : undefined,
    missionId: String(report.missionId ?? "unknown"),
    runId: String(report.runId ?? "unknown"),
    status: String(report.status ?? "unknown"),
    totalRecords: numberValue(summary?.totalRecords),
    mechanicsCovered: numberValue(summary?.mechanicsCovered),
    requiredMechanics: numberValue(summary?.requiredMechanics),
    liveBackedRecords: numberValue(summary?.liveBackedRecords),
    localRuntimeRecords: numberValue(summary?.localRuntimeRecords),
    tempPatchRecords: numberValue(summary?.tempPatchRecords),
    candidateReadyRecords: numberValue(summary?.candidateReadyRecords),
    blockedRecords: numberValue(summary?.blockedRecords),
    plannedRecords: numberValue(summary?.plannedRecords),
    mechanics,
    missingMechanics: arrayField<string>(summary?.missingMechanics).map(String).sort(),
    promotionDecision: String(promotion?.decision ?? "unknown"),
    redactionLeaks: numberValue(redaction?.leaksDetected),
    zeroLeak: summary?.zeroLeak === true,
    rawPayloadsIncluded: safety?.rawPayloadsIncluded === true,
    envValuesIncluded: safety?.envValuesIncluded === true,
    requestBodiesIncluded: safety?.requestBodiesIncluded === true,
    responseBodiesIncluded: safety?.responseBodiesIncluded === true,
    relativePath: path.relative(reportsRoot, filePath)
  };
}

function summarizeProbe(proofId: string, probe: Record<string, unknown>): RunWarehouseServiceProbe {
  const redaction = probe.redaction as { leaksDetected?: number } | undefined;
  return {
    proofId,
    serviceFamily: String(probe.serviceFamily ?? "unknown"),
    name: String(probe.name ?? "unknown"),
    method: typeof probe.method === "string" ? probe.method : undefined,
    pathLabel: typeof probe.pathLabel === "string" ? probe.pathLabel : undefined,
    urlHash: typeof probe.urlHash === "string" ? probe.urlHash : undefined,
    status: typeof probe.status === "number" ? probe.status : typeof probe.status === "string" ? probe.status : undefined,
    ok: probe.ok === true,
    durationMs: numberOrUndefined(probe.durationMs),
    responseBytes: numberOrUndefined(probe.responseBytes),
    bodyHash: typeof probe.bodyHash === "string" ? probe.bodyHash : undefined,
    outputHash: typeof probe.outputHash === "string" ? probe.outputHash : undefined,
    redactionLeaks: numberOrUndefined(redaction?.leaksDetected)
  };
}

function objectField(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function arrayField<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

function safeEnvKeyName(value: unknown): string {
  const text = String(value ?? "");
  const key = text.includes("=") ? text.split("=")[0] : text;
  return /^[A-Z][A-Z0-9_]{1,}$/.test(key) ? key : "";
}

function buildMissionTemplates(runs: RunWarehouseRun[]): RunWarehouseIndex["lineage"]["missionTemplates"] {
  return Object.entries(groupBy(runs, (run) => run.missionTemplateId))
    .map(([missionTemplateId, items]) => ({
      missionTemplateId,
      runCount: items.length,
      profiles: [...new Set(items.map((item) => item.profile))].sort()
    }))
    .sort((a, b) => b.runCount - a.runCount || a.missionTemplateId.localeCompare(b.missionTemplateId));
}

function summarizeRunMechanicsActivationReadiness(
  runs: RunWarehouseRun[]
): RunWarehouseSummary["mechanicsActivationReadinessRuns"] {
  const runsWithReadiness = runs.filter((run) => run.mechanicsActivationReadiness);
  const latestRun = [...runsWithReadiness]
    .sort((left, right) => dateMs(right.completedAt) - dateMs(left.completedAt))[0];
  const latest = latestRun?.mechanicsActivationReadiness
    ? {
        runId: latestRun.runId,
        profile: latestRun.profile,
        readyGates: latestRun.mechanicsActivationReadiness.readyGates,
        totalGates: latestRun.mechanicsActivationReadiness.totalGates,
        blockedGates: latestRun.mechanicsActivationReadiness.blockedGates,
        allReady: latestRun.mechanicsActivationReadiness.allReady,
        relativePath: latestRun.mechanicsActivationReadiness.relativePath
      }
    : undefined;
  return {
    runsWithReadiness: runsWithReadiness.length,
    readyRuns: runsWithReadiness.filter((run) => run.mechanicsActivationReadiness?.allReady === true).length,
    blockedRuns: runsWithReadiness.filter((run) => run.mechanicsActivationReadiness?.allReady !== true).length,
    missingRequiredEnvKeys: uniqueSorted(runsWithReadiness.flatMap((run) =>
      run.mechanicsActivationReadiness?.missingRequiredEnvKeys ?? []
    )),
    missingRequiredOperatorFlags: uniqueSorted(runsWithReadiness.flatMap((run) =>
      run.mechanicsActivationReadiness?.missingRequiredOperatorFlags ?? []
    )),
    latest
  };
}

function summarizeRunAgentLoopMechanicsLedger(
  runs: RunWarehouseRun[]
): RunWarehouseSummary["agentLoopMechanicsLedgerRuns"] {
  const runsWithLedger = runs.filter((run) => run.agentLoopMechanicsLedger);
  const latestRun = [...runsWithLedger]
    .sort((left, right) => dateMs(right.completedAt) - dateMs(left.completedAt))[0];
  const latest = latestRun?.agentLoopMechanicsLedger
    ? {
        runId: latestRun.runId,
        profile: latestRun.profile,
        mechanicsCovered: latestRun.agentLoopMechanicsLedger.mechanicsCovered,
        requiredMechanics: latestRun.agentLoopMechanicsLedger.requiredMechanics,
        totalRecords: latestRun.agentLoopMechanicsLedger.totalRecords,
        liveBackedRecords: latestRun.agentLoopMechanicsLedger.liveBackedRecords,
        blockedRecords: latestRun.agentLoopMechanicsLedger.blockedRecords,
        promotionDecision: latestRun.agentLoopMechanicsLedger.promotionDecision,
        relativePath: latestRun.agentLoopMechanicsLedger.relativePath
      }
    : undefined;
  return {
    runsWithLedger: runsWithLedger.length,
    wiredRuns: runsWithLedger.filter((run) => isAgentLoopLedgerWired(run.agentLoopMechanicsLedger)).length,
    incompleteRuns: runsWithLedger.filter((run) => !isAgentLoopLedgerWired(run.agentLoopMechanicsLedger)).length,
    zeroLeakRuns: runsWithLedger.filter((run) => run.agentLoopMechanicsLedger?.zeroLeak === true).length,
    promotedToPlatformPatchReviewRuns: runsWithLedger.filter((run) =>
      run.agentLoopMechanicsLedger?.promotionDecision === "promote-to-platform-patch-review"
    ).length,
    candidateReadyRuns: runsWithLedger.filter((run) =>
      run.agentLoopMechanicsLedger?.promotionDecision === "candidate-ready-heldout-review"
    ).length,
    blockedRuns: runsWithLedger.filter((run) =>
      run.agentLoopMechanicsLedger?.promotionDecision === "blocked"
        || numberValue(run.agentLoopMechanicsLedger?.blockedRecords) > 0
    ).length,
    missingMechanics: uniqueSorted(runsWithLedger.flatMap((run) =>
      run.agentLoopMechanicsLedger?.missingMechanics ?? []
    )),
    latest
  };
}

function isAgentLoopLedgerWired(ledger: RunWarehouseAgentLoopMechanicsLedger | undefined): boolean {
  if (!ledger) return false;
  return ledger.status === "ok"
    && ledger.zeroLeak
    && !ledger.rawPayloadsIncluded
    && !ledger.envValuesIncluded
    && !ledger.requestBodiesIncluded
    && !ledger.responseBodiesIncluded
    && ledger.requiredMechanics > 0
    && ledger.mechanicsCovered >= ledger.requiredMechanics
    && ledger.totalRecords > 0;
}

function parentMissionIdFor(missionId: string): string | undefined {
  const match = missionId.match(/^(.+)-candidate-\d+$/);
  return match?.[1];
}

function normalizeEvalSuite(value: string | undefined, name: string): WarehouseEvalSuiteName {
  if (value === "training" || value === "heldOut" || value === "trust" || value === "economic") return value;
  if (/^heldout|held-out/i.test(name)) return "heldOut";
  if (/external|human|economic|value|minutes|cost|rework|review/i.test(name)) return "economic";
  if (/step-success|trace-coverage|secret|redaction|budget|approval|policy|leak/i.test(name)) return "trust";
  return "training";
}

function aggregateSuiteScore(evals: RunWarehouseEval[], suite: WarehouseEvalSuiteName): number {
  return average(evals.filter((item) => item.suite === suite).map((item) => item.score));
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] ?? [];
    groups[key].push(item);
    return groups;
  }, {});
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function average(values: number[]): number {
  const clean = values.filter(Number.isFinite);
  if (clean.length === 0) return 0;
  return Number((clean.reduce((sum, value) => sum + value, 0) / clean.length).toFixed(4));
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function numberOrUndefined(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function dateMs(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
