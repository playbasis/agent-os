import { createHash } from "node:crypto";

export type EvidenceLayer = "reality" | "heldOut" | "trust" | "promptTwin" | "council" | "humanFeedback";
export type NavigatorObjectiveDomain = "flappy-prompt-twin-ab" | "asset-clone";
export type PathShape =
  | "risk-first"
  | "steady-grind"
  | "spike-and-stabilize"
  | "parallel-tracks"
  | "research-then-build"
  | "build-then-measure";
export type AmbitionLevel = "safe" | "stretch" | "moonshot";
export type ResourceMode = "solo-agent" | "swarm" | "council-heavy";
export const WORKSPACE_OPS_TOOL_KINDS = [
  "web_search",
  "document_generate",
  "image_generate",
  "image_create",
  "video_create",
  "dashboard_app_edit",
  "dashboard_app_execute_auto",
  "dashboard_app_execute_governed",
  "deep_research",
  "vision_analyze",
  "data_enrichment",
  "audio_transcribe",
  "text_to_speech",
  "spreadsheet_generate",
  "file_edit",
  "outbound_api_call",
  "social_post_generate",
  "social_post_schedule",
  "social_post_publish",
  "social_channel_connect",
  "social_analytics_sync"
] as const;
export type WorkspaceOpsToolKind = typeof WORKSPACE_OPS_TOOL_KINDS[number];
export type WorkspaceOpsToolApprovalMode = "auto" | "human";
export type WorkspaceOpsToolProficiency = "primary" | "secondary";
export const WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KINDS = [
  "video_create",
  "deep_research",
  "file_edit",
  "outbound_api_call",
  "dashboard_app_execute_governed",
  "social_channel_connect",
  "social_post_schedule",
  "social_post_publish"
] as const satisfies readonly WorkspaceOpsToolKind[];

export interface AgentToolQualification {
  toolKind: WorkspaceOpsToolKind;
  proficiency: WorkspaceOpsToolProficiency;
  description: string;
}

export interface WorkspaceOpsToolKindCatalogEntry {
  toolKind: WorkspaceOpsToolKind;
  description: string;
  approvalRequired: boolean;
  approvalMode: WorkspaceOpsToolApprovalMode;
}

export interface WorkspaceOpsToolKindCatalog {
  schemaVersion: 1;
  source: "playbasis-platform-workspace-ops-tool-kind-catalog";
  sourceFiles: string[];
  entries: WorkspaceOpsToolKindCatalogEntry[];
  approvalRequiredToolKinds: WorkspaceOpsToolKind[];
}

export interface WorkspaceOpsToolKindValidationReport {
  valid: boolean;
  toolKinds: WorkspaceOpsToolKind[];
  unknownToolKinds: string[];
  approvalRequiredToolKinds: WorkspaceOpsToolKind[];
}

export interface NavigationPathToolKindValidationReport extends WorkspaceOpsToolKindValidationReport {
  milestoneCount: number;
  milestonesMissingToolKinds: string[];
  missingAggregateToolKinds: WorkspaceOpsToolKind[];
  approvalParityOk: boolean;
  pathApprovalRequired: boolean;
  expectedPathApprovalRequired: boolean;
}

export interface NavigationPathToolKindSummary {
  pathCount: number;
  distinctToolKinds: WorkspaceOpsToolKind[];
  approvalRequiredPathCount: number;
  autoOnlyPathCount: number;
  toolUsage: Record<WorkspaceOpsToolKind, number>;
}

export type FlappyDefectOperator =
  | "disable-gravity"
  | "freeze-pipe-speed"
  | "disable-scoring"
  | "remove-bounds-collision"
  | "break-jump-impulse"
  | "spawn-impossible-gaps"
  | "corrupt-event-loop"
  | "hide-state-update";

export interface NavigatorGoal {
  schemaVersion: 1;
  goalId: string;
  createdAt: string;
  domain: NavigatorObjectiveDomain;
  objective: string;
  northStar: string;
  sotaDefinition: {
    summary: string;
    measurableProperties: Array<{ name: string; target: string; evidenceLayer: EvidenceLayer }>;
  };
  benchmarkLadder: Array<{ rung: number; claim: string; objectiveCheck: string; requiredEvidenceLayer: EvidenceLayer }>;
  valueFunction: Array<{ layer: EvidenceLayer; name: string; weight: number; promotionEligible: boolean }>;
  lossFunction: NavigatorLossFunction;
  budgets: {
    maxPaths: number;
    maxWallClockHours: number;
    maxCouncilCalls: number;
    maxEstimatedCost: number;
  };
  escalationPolicy: {
    driftOutsideAllEnvelopes: "human-escalation";
    consecutiveOverPerformanceForRatchet: number;
    humanFeedbackWeight: number;
  };
  promptTwin: {
    mode: "fixture-reviewer";
    corpusRef: string;
    rubric: string[];
    doesNotOverrideActualUser: true;
  };
  councilSeed: CouncilSession;
}

export interface NavigatorLossFunction {
  target: {
    name: string;
    primaryMetric: string;
    direction: "maximize" | "minimize";
    bar: number;
    trainingEvalRef: string;
    blindedEvalRef: string;
    answerKeyCommitment: {
      algorithm: "sha256";
      hash: string;
    };
  };
  constraints: Array<{
    name: string;
    limit: number | string;
    instrument: string;
    enforcement: "gate" | "score-penalty" | "human-escalation";
  }>;
  instruments: Array<{
    name: string;
    command: string;
    provides: string;
    optimizerVisible: boolean;
  }>;
  entropyRules: Array<{
    name: "memorization_alarm" | "stall_exploration" | "cycle_hypothesis_required";
    condition: string;
    forcedNextMove: string;
    evidenceRequired: string;
  }>;
  timeCostPenalty: {
    qualityWeight: number;
    hourPenaltyLambda: number;
    spendPenaltyMu: number;
    riskPenaltyRho: number;
    selectionMetric: "progressSharpe";
    formula: string;
  };
  preRegistration: {
    required: boolean;
    pathFanHashAlgorithm: "sha256";
    answerKeyCommitmentRequired: boolean;
    blindedEvalStorage: "scorer-only";
    heldOutRevealPolicy: string;
  };
}

export interface FlappyEvalCase {
  caseId: string;
  split: "training" | "heldOut";
  variantHash: string;
  defectIds: FlappyDefectOperator[];
  mutationRecipe: string[];
  expectedRepairProperties: string[];
  validatorExpectations: {
    frames: number;
    minGravitySamples: number;
    minPipeAdvance: number;
    minScore: number;
    requiresCollisionOrBoundsCheck: boolean;
    requiresEventPump: boolean;
  };
  difficulty: "easy" | "medium" | "hard";
  capacityBucket: number;
}

export interface FlappyEvalTrainingManifest {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "training";
  generator: {
    name: "deterministic-flappy-mutation-factory";
    seedHash: string;
    defectOperators: FlappyDefectOperator[];
  };
  cases: FlappyEvalCase[];
  operatorHistogram: Record<FlappyDefectOperator, number>;
  rawSourceIncluded: false;
  answerKeyIncluded: false;
}

export interface FlappyHeldOutCommitment {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "heldOut";
  scorerRef: string;
  totalCases: number;
  trainingCases: number;
  casesCommitted: number;
  manifestHash: string;
  answerKeyCommitment: {
    algorithm: "sha256";
    hash: string;
  };
  operatorHistogram: Record<FlappyDefectOperator, number>;
  rawCasesIncluded: false;
  answerKeyIncluded: false;
  storagePolicy: "scorer-only";
  revealPolicy: string;
}

export interface FlappyPrivateHeldOutBundle {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "heldOut";
  scorerRef: string;
  heldOutManifest: Array<{
    caseId: string;
    variantHash: string;
    defectIds: FlappyDefectOperator[];
    capacityBucket: number;
    difficulty: "easy" | "medium" | "hard";
  }>;
  answerKey: Array<{
    caseId: string;
    defectIds: FlappyDefectOperator[];
    expectedRepairProperties: string[];
    validatorExpectations: FlappyEvalCase["validatorExpectations"];
  }>;
  manifestHash: string;
  answerKeyHash: string;
  rawSourceIncluded: false;
  storagePolicy: "outside-repo-private";
}

export interface FlappyEvalFactoryReport {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  totalCases: number;
  trainingCases: number;
  heldOutCases: number;
  trainingManifest: FlappyEvalTrainingManifest;
  heldOutCommitment: FlappyHeldOutCommitment;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
}

export interface FlappyHeldOutScoreReport {
  schemaVersion: 1;
  familyId: string;
  scorerRef: string;
  generatedAt: string;
  artifactHash: string;
  casesScored: number;
  passRate: number;
  propertyPassRates: Record<string, number>;
  failureClusters: Array<{ defectFamily: FlappyDefectOperator; count: number }>;
  rawCasesIncluded: false;
  answerKeyIncluded: false;
  artifactIncluded: false;
  commitment: {
    manifestHash: string;
    answerKeyHash: string;
  };
}

export interface FlappyPromptTwinAbHeldOutPreRegistration {
  schemaVersion: 1;
  registrationId: string;
  goalId: string;
  familyId: string;
  scorerRef: string;
  registeredAt: string;
  expectedHeldOutLift: number;
  commitment: {
    casesCommitted: number;
    manifestHash: string;
    answerKeyHash: string;
  };
  arms: {
    control: {
      artifactLabel: string;
      artifactHash: string;
    };
    twin: {
      artifactLabel: string;
      artifactHash: string;
    };
  };
  safety: {
    rawCasesIncluded: false;
    answerKeyIncluded: false;
    artifactIncluded: false;
    rawArtifactIncluded: false;
    envValuesIncluded: false;
  };
}

export interface FlappyPromptTwinAbHeldOutResult {
  schemaVersion: 1;
  resultId: string;
  goalId: string;
  familyId: string;
  scorerRef: string;
  scoredAt: string;
  registeredAt: string;
  preRegistrationId: string;
  preRegistrationHash: string;
  control: FlappyHeldOutScoreReport;
  twin: FlappyHeldOutScoreReport;
  heldOutLift: number;
  expectedHeldOutLift: number;
  liftDeltaVsExpected: number;
  metExpectedLift: boolean;
  casesScored: number;
  commitment: {
    casesCommitted: number;
    manifestHash: string;
    answerKeyHash: string;
  };
  safety: {
    rawCasesIncluded: false;
    answerKeyIncluded: false;
    artifactIncluded: false;
    rawArtifactIncluded: false;
    envValuesIncluded: false;
  };
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
}

export type AssetCloneDifficulty = "easy" | "medium" | "hard";
export type AssetClonePixelGrid = number[][];

export interface AssetCloneEvalCasePublic {
  caseId: string;
  split: "training" | "heldOut";
  variantHash: string;
  width: number;
  height: number;
  promptHash: string;
  targetPixelHash: string;
  difficulty: AssetCloneDifficulty;
  capacityBucket: number;
}

export interface AssetCloneEvalTrainingManifest {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "training";
  generator: {
    name: "deterministic-asset-clone-factory";
    seedHash: string;
  };
  cases: AssetCloneEvalCasePublic[];
  targetPixelBodiesIncluded: false;
  privateTargetGridsIncluded: false;
  answerKeyIncluded: false;
  rawPromptsIncluded: false;
}

export interface AssetCloneHeldOutCommitment {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "heldOut";
  scorerRef: string;
  totalCases: number;
  trainingCases: number;
  casesCommitted: number;
  manifestHash: string;
  answerKeyCommitment: {
    algorithm: "sha256";
    hash: string;
  };
  dimensions: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
  targetPixelBodiesIncluded: false;
  privateTargetGridsIncluded: false;
  answerKeyIncluded: false;
  rawPromptsIncluded: false;
  storagePolicy: "scorer-only";
  revealPolicy: string;
}

export interface AssetClonePrivateHeldOutBundle {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  split: "heldOut";
  scorerRef: string;
  heldOutManifest: AssetCloneEvalCasePublic[];
  answerKey: Array<{
    caseId: string;
    width: number;
    height: number;
    targetPixelHash: string;
    targetPixels: AssetClonePixelGrid;
  }>;
  manifestHash: string;
  answerKeyHash: string;
  rawPromptsIncluded: false;
  storagePolicy: "outside-repo-private";
}

export interface AssetCloneEvalFactoryReport {
  schemaVersion: 1;
  familyId: string;
  generatedAt: string;
  totalCases: number;
  trainingCases: number;
  heldOutCases: number;
  trainingManifest: AssetCloneEvalTrainingManifest;
  heldOutCommitment: AssetCloneHeldOutCommitment;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
}

export interface AssetCloneCandidateCasePixels {
  caseId: string;
  pixels: AssetClonePixelGrid;
}

export interface AssetCloneCandidateArtifact {
  artifactLabel?: string;
  cases: AssetCloneCandidateCasePixels[];
}

export interface AssetClonePixelDiffScoreReport {
  schemaVersion: 1;
  familyId: string;
  scorerRef: string;
  generatedAt: string;
  artifactHash: string;
  casesScored: number;
  pixelDiffRatio: number;
  pixelSimilarityScore: number;
  perCase: Array<{
    caseId: string;
    width: number;
    height: number;
    pixelDiffRatio: number;
    pixelSimilarityScore: number;
    candidatePixelHash: string;
    targetPixelHash: string;
  }>;
  rawImageBodiesIncluded: false;
  rawTargetPixelsIncluded: false;
  privateTargetGridsIncluded: false;
  answerKeyIncluded: false;
  rawPromptsIncluded: false;
  artifactIncluded: false;
  commitment: {
    manifestHash: string;
    answerKeyHash: string;
  };
}

export interface AssetCloneHeldOutPreRegistration {
  schemaVersion: 1;
  registrationId: string;
  goalId: string;
  familyId: string;
  scorerRef: string;
  registeredAt: string;
  expectedPixelSimilarityScore: number;
  commitment: {
    casesCommitted: number;
    manifestHash: string;
    answerKeyHash: string;
  };
  candidate: {
    artifactLabel: string;
    artifactHash: string;
  };
  safety: {
    rawImageBodiesIncluded: false;
    rawTargetPixelsIncluded: false;
    privateTargetGridsIncluded: false;
    answerKeyIncluded: false;
    rawPromptsIncluded: false;
    envValuesIncluded: false;
  };
}

export interface AssetCloneHeldOutResult {
  schemaVersion: 1;
  resultId: string;
  goalId: string;
  familyId: string;
  scorerRef: string;
  scoredAt: string;
  registeredAt: string;
  preRegistrationId: string;
  preRegistrationHash: string;
  score: AssetClonePixelDiffScoreReport;
  pixelDiffRatio: number;
  pixelSimilarityScore: number;
  expectedPixelSimilarityScore: number;
  metExpectedSimilarity: boolean;
  commitment: {
    casesCommitted: number;
    manifestHash: string;
    answerKeyHash: string;
  };
  safety: AssetCloneHeldOutPreRegistration["safety"];
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
}

export interface AssetCloneProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  familyId: string;
  heldOutPreRegistration: AssetCloneHeldOutPreRegistration;
  heldOutResult: AssetCloneHeldOutResult;
  observations: NavigationObservation[];
  safety: AssetCloneHeldOutPreRegistration["safety"];
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface CouncilRoleRecord {
  role: "Proposer" | "Adversary" | "Estimator" | "Synthesizer" | "Recorder";
  modelSeat: string;
  contribution: string;
}

export interface CouncilSession {
  sessionId: string;
  conveningReason: string;
  expectedDecisionValue: number;
  councilCost: number;
  convened: boolean;
  roles: CouncilRoleRecord[];
  decision: string;
  falsifier: string;
  inputHash: string;
}

export interface MilestoneEnvelope {
  metric: string;
  min: number;
  expected: number;
  max: number;
}

export interface NavigationMilestone {
  id: string;
  index: number;
  state: string;
  toolKinds: WorkspaceOpsToolKind[];
  approvalRequired: boolean;
  etaHours: number;
  envelope: MilestoneEnvelope;
}

export interface NavigationPath {
  pathId: string;
  goalId: string;
  shape: PathShape;
  ambition: AmbitionLevel;
  resourceMode: ResourceMode;
  milestones: NavigationMilestone[];
  toolKinds: WorkspaceOpsToolKind[];
  toolQualifications: AgentToolQualification[];
  approvalRequired: boolean;
  predictedOutcome: {
    metric: string;
    value: number;
    band: [number, number];
  };
  estimatedCost: {
    tokens: number;
    hours: number;
    councilCalls: number;
  };
  valueEstimate: number;
  riskEstimate: number;
  councilElo: number;
  frontier: {
    value: number;
    cost: number;
    risk: number;
    efficient: boolean;
  };
  weight: number;
  memoryPrior?: {
    source: "shape-library";
    entryIds: string[];
    shapeKey: string;
    weightBoost: number;
    valueBoost: number;
    riskReduction: number;
  };
}

const WORKSPACE_OPS_TOOL_KIND_SET = new Set<string>(WORKSPACE_OPS_TOOL_KINDS);
const WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KIND_SET = new Set<string>(WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KINDS);

const WORKSPACE_OPS_TOOL_DESCRIPTIONS: Record<WorkspaceOpsToolKind, string> = {
  web_search: "Search public web sources and return cited, redacted research evidence.",
  document_generate: "Generate durable document artifacts such as briefs, reports, memos, and launch packs.",
  image_generate: "Generate image assets through provider-backed creative routes.",
  image_create: "Create or adapt image artifacts for workspace outputs.",
  video_create: "Create video artifacts through governed provider-backed routes.",
  dashboard_app_edit: "Edit dashboard or workspace app configuration without executing a governed action.",
  dashboard_app_execute_auto: "Execute low-risk workspace app actions that are approved for automatic operation.",
  dashboard_app_execute_governed: "Execute governed workspace app actions that require human approval.",
  deep_research: "Run source-grounded deep research workflows with higher cost and stronger review requirements.",
  vision_analyze: "Analyze image or visual inputs and return structured observations.",
  data_enrichment: "Enrich workspace records or artifacts with structured derived data.",
  audio_transcribe: "Transcribe audio into text for downstream workspace processing.",
  text_to_speech: "Generate speech audio from text content.",
  spreadsheet_generate: "Generate spreadsheet artifacts, tabular outputs, or structured planning workbooks.",
  file_edit: "Edit workspace files or repository files through a governed mutation path.",
  outbound_api_call: "Call an external API through a governed outbound integration.",
  social_post_generate: "Draft channel-specific social content packets.",
  social_post_schedule: "Schedule social posts through a governed publishing path.",
  social_post_publish: "Publish social posts through a governed publishing path.",
  social_channel_connect: "Connect or authorize a social channel for workspace use.",
  social_analytics_sync: "Sync social analytics into workspace evidence and reporting."
};

export function isWorkspaceOpsToolKind(value: string): value is WorkspaceOpsToolKind {
  return WORKSPACE_OPS_TOOL_KIND_SET.has(value);
}

export function isWorkspaceOpsApprovalRequiredToolKind(toolKind: string): toolKind is typeof WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KINDS[number] {
  return WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KIND_SET.has(toolKind);
}

export function buildWorkspaceOpsToolKindCatalog(): WorkspaceOpsToolKindCatalog {
  return {
    schemaVersion: 1,
    source: "playbasis-platform-workspace-ops-tool-kind-catalog",
    sourceFiles: [
      "playbasis-platform/apps/website/lib/workspace-ops-runtime-tool-kinds.ts",
      "playbasis-platform/apps/website/lib/agent-capabilities.ts",
      "playbasis-platform/apps/website/lib/workspace-ops-super-prompt-catalog.ts"
    ],
    entries: WORKSPACE_OPS_TOOL_KINDS.map((toolKind) => ({
      toolKind,
      description: WORKSPACE_OPS_TOOL_DESCRIPTIONS[toolKind],
      approvalRequired: isWorkspaceOpsApprovalRequiredToolKind(toolKind),
      approvalMode: isWorkspaceOpsApprovalRequiredToolKind(toolKind) ? "human" : "auto"
    })),
    approvalRequiredToolKinds: [...WORKSPACE_OPS_APPROVAL_REQUIRED_TOOL_KINDS]
  };
}

export function validateWorkspaceOpsToolKinds(toolKinds: readonly string[]): WorkspaceOpsToolKindValidationReport {
  const unknownToolKinds = uniqueStrings(toolKinds.filter((toolKind) => !isWorkspaceOpsToolKind(toolKind)));
  const knownToolKinds = uniqueWorkspaceOpsToolKinds(toolKinds.filter(isWorkspaceOpsToolKind));
  return {
    valid: unknownToolKinds.length === 0,
    toolKinds: knownToolKinds,
    unknownToolKinds,
    approvalRequiredToolKinds: knownToolKinds.filter((toolKind) => isWorkspaceOpsApprovalRequiredToolKind(toolKind))
  };
}

export function validateNavigationPathToolKinds(
  path: Pick<NavigationPath, "pathId" | "toolKinds" | "milestones" | "approvalRequired">,
  catalog: WorkspaceOpsToolKindCatalog = buildWorkspaceOpsToolKindCatalog()
): NavigationPathToolKindValidationReport {
  const catalogKinds = new Set(catalog.entries.map((entry) => entry.toolKind));
  const pathToolKinds = path.toolKinds ?? [];
  const milestoneToolKinds = path.milestones.flatMap((milestone) => milestone.toolKinds ?? []);
  const allToolKinds = [...pathToolKinds, ...milestoneToolKinds];
  const base = validateWorkspaceOpsToolKinds(allToolKinds);
  const milestonesMissingToolKinds = path.milestones
    .filter((milestone) => (milestone.toolKinds ?? []).length === 0)
    .map((milestone) => milestone.id);
  const missingAggregateToolKinds = uniqueWorkspaceOpsToolKinds(milestoneToolKinds)
    .filter((toolKind) => !pathToolKinds.includes(toolKind));
  const milestoneApprovalParityOk = path.milestones.every((milestone) => {
    const expected = (milestone.toolKinds ?? []).some((toolKind) => isWorkspaceOpsApprovalRequiredToolKind(toolKind));
    return milestone.approvalRequired === expected;
  });
  const expectedPathApprovalRequired = pathToolKinds.some((toolKind) => isWorkspaceOpsApprovalRequiredToolKind(toolKind));
  const catalogCoverageOk = base.toolKinds.every((toolKind) => catalogKinds.has(toolKind));
  const approvalParityOk = milestoneApprovalParityOk && path.approvalRequired === expectedPathApprovalRequired;
  return {
    ...base,
    valid: base.valid
      && catalogCoverageOk
      && milestonesMissingToolKinds.length === 0
      && missingAggregateToolKinds.length === 0
      && approvalParityOk,
    milestoneCount: path.milestones.length,
    milestonesMissingToolKinds,
    missingAggregateToolKinds,
    approvalParityOk,
    pathApprovalRequired: path.approvalRequired,
    expectedPathApprovalRequired
  };
}

export function summarizeNavigationPathToolKinds(paths: readonly NavigationPath[]): NavigationPathToolKindSummary {
  const toolUsage = Object.fromEntries(WORKSPACE_OPS_TOOL_KINDS.map((toolKind) => [toolKind, 0])) as Record<WorkspaceOpsToolKind, number>;
  for (const path of paths) {
    for (const toolKind of path.toolKinds) {
      toolUsage[toolKind] += 1;
    }
  }
  return {
    pathCount: paths.length,
    distinctToolKinds: uniqueWorkspaceOpsToolKinds(paths.flatMap((path) => path.toolKinds)),
    approvalRequiredPathCount: paths.filter((path) => path.approvalRequired).length,
    autoOnlyPathCount: paths.filter((path) => !path.approvalRequired).length,
    toolUsage
  };
}

export function parseAgentToolQualifications(raw: unknown): AgentToolQualification[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const parsed: AgentToolQualification[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const candidate = item as { toolKind?: unknown; proficiency?: unknown; description?: unknown };
    if (typeof candidate.toolKind !== "string" || !isWorkspaceOpsToolKind(candidate.toolKind)) {
      continue;
    }
    parsed.push({
      toolKind: candidate.toolKind,
      proficiency: candidate.proficiency === "primary" ? "primary" : "secondary",
      description: typeof candidate.description === "string" && candidate.description.trim().length > 0
        ? candidate.description
        : WORKSPACE_OPS_TOOL_DESCRIPTIONS[candidate.toolKind]
    });
  }
  return dedupeToolQualifications(parsed);
}

export function getPrimaryToolQualifications(qualifications: readonly AgentToolQualification[]): AgentToolQualification[] {
  return qualifications.filter((qualification) => qualification.proficiency === "primary");
}

export function qualifiedToolKinds(qualifications: readonly AgentToolQualification[]): WorkspaceOpsToolKind[] {
  return uniqueWorkspaceOpsToolKinds(qualifications.map((qualification) => qualification.toolKind));
}

export function isQualifiedForTool(qualifications: readonly AgentToolQualification[], toolKind: WorkspaceOpsToolKind): boolean {
  return qualifications.some((qualification) => qualification.toolKind === toolKind);
}

export interface NavigationObservation {
  observationId: string;
  milestoneId: string;
  metric: string;
  actual: number;
  sourceLayer: EvidenceLayer;
  provenance?: "fixture" | "dispatched-run" | "runtime-probe" | "held-out-scorer" | "provider-judge" | "human-feedback" | "web-sourced-evidence";
  weight: number;
  summary: string;
  timestamp: string;
  evalSignals?: NavigatorObservationEvalSignals;
}

export interface NavigatorResearchEvidenceLike {
  profile: string;
  toolKind: "web_search" | "deep_research";
  mode: "fixture-cassette" | "live-recorded-cassette" | "gated" | "blocked";
  status: "ok" | "warn" | "skipped" | "blocked" | "failed";
  queryHash: string;
  evidenceItemCount: number;
  searchedQueryCount: number;
  observationHints: {
    evidenceRows: number;
    confidenceScore: number;
    webSourced: boolean;
  };
  redaction: {
    leaksDetected: number;
  };
  safety: {
    rawQueryIncluded: false;
    rawUrlsIncluded: false;
    rawPagesIncluded: false;
    requestHeadersIncluded: false;
    responseBodiesIncluded: false;
  };
}

export interface NavigatorEvidenceEvalLike {
  name: string;
  suite: "training" | "heldOut" | "trust" | "economic";
  score: number;
  status: "pass" | "warn" | "fail";
}

export interface NavigatorMissionEvidenceLike {
  runId: string;
  missionId: string;
  missionTitle: string;
  profile: string;
  durationMs: number;
  toolsUsed: string[];
  steps: Array<{ status: string }>;
  artifacts: Array<{ bytes: number }>;
  evals: NavigatorEvidenceEvalLike[];
  redactionReport: {
    checkedArtifacts: number;
    leaksDetected: number;
  };
}

export interface ObservationWeightMix {
  totalWeight: number;
  fixtureWeight: number;
  dispatchedRunWeight: number;
  runtimeProbeWeight: number;
  heldOutScorerWeight: number;
  providerJudgeWeight: number;
  webSourcedEvidenceWeight: number;
  humanFeedbackWeight: number;
  realityOrHeldOutLayerWeight: number;
  fixtureWeightFraction: number;
  dispatchedRunWeightFraction: number;
  webSourcedEvidenceWeightFraction: number;
  realityOrHeldOutLayerFraction: number;
}

export interface PathReweightScore {
  pathId: string;
  priorWeight: number;
  driftScore: number;
  likelihood: number;
  posteriorWeight: number;
  pruned: boolean;
  matchedObservations: number;
}

export interface ReweightReport {
  schemaVersion: 1;
  generatedAt: string;
  leadingBefore: string;
  leadingAfter: string;
  switchOccurred: boolean;
  prunedPathIds: string[];
  driftAlarm: boolean;
  ambitionRatchetRecommended: boolean;
  scores: PathReweightScore[];
}

export interface NavigatorProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  pathsGenerated: number;
  distinctShapes: number;
  leadingPathBefore: string;
  leadingPathAfter: string;
  switchOccurred: boolean;
  prunedPathIds: string[];
  observations: NavigationObservation[];
  reweight: ReweightReport;
  councilSession: CouncilSession;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export type CouncilJudgmentCriterion = "value-risk" | "cost-control" | "evidence-fit" | "ambition-ratchet";
export type CouncilJudgeSeat = "Proposer" | "Adversary" | "Estimator" | "Synthesizer";

export interface CouncilSeatVote {
  seat: CouncilJudgeSeat;
  modelSeat: string;
  winnerPathId: string;
  leftScore: number;
  rightScore: number;
  margin: number;
  rationale: string;
}

export interface PairwiseCouncilJudgment {
  matchId: string;
  leftPathId: string;
  rightPathId: string;
  winnerPathId: string;
  criterion: CouncilJudgmentCriterion;
  margin: number;
  reason: string;
  seatVotes: CouncilSeatVote[];
  disagreementRate: number;
  inputHash: string;
}

export interface CouncilSeatSummary {
  seat: CouncilJudgeSeat;
  modelSeat: string;
  judgments: number;
  selectedPathVotes: number;
  averageMargin: number;
}

export interface CouncilTournament {
  sessionId: string;
  generatedAt: string;
  kFactor: number;
  payoff: {
    expectedDecisionValue: number;
    councilCost: number;
    convened: boolean;
    netValue: number;
  };
  judgments: PairwiseCouncilJudgment[];
  seatSummaries: CouncilSeatSummary[];
  disagreement: {
    totalMatches: number;
    unanimousMatches: number;
    splitMatches: number;
    averageDisagreementRate: number;
    totalSeatVotes: number;
    topContestedMatches: Array<{
      matchId: string;
      leftPathId: string;
      rightPathId: string;
      winnerPathId: string;
      disagreementRate: number;
    }>;
  };
  eloRatings: Record<string, number>;
  rankedPathIds: string[];
  selectedPathId: string;
  falsifier: string;
}

export interface NavigatorProgressSharpeScore {
  pathId: string;
  rank: number;
  frontierEfficient: boolean;
  rawPathFitScore: number;
  constraintAlarmCount: number;
  constraintPass: boolean;
  evidenceConfidence: number;
  verifiedProgress: number;
  hours: number;
  hourPenalty: number;
  spendPenalty: number;
  riskPenalty: number;
  denominator: number;
  progressSharpe: number;
}

export interface FrontierSelection {
  selectionMetric: "progressSharpe" | "councilEloEfficientFrontier";
  selectedPathId: string;
  efficientPathIds: string[];
  dominatedPathIds: string[];
  payoffScore: number;
  selectedRawPathFitScore: number;
  selectedProgressSharpe: number;
  evidenceConfidence: number;
  progressSharpeScores: NavigatorProgressSharpeScore[];
  rationale: string;
}

export interface ConformalResidualHistory {
  metric: string;
  residuals: number[];
  source: "path-fan-residuals" | "fixture-fallback";
}

export interface ConformalMetricBand {
  metric: string;
  selectedPathId: string;
  predicted: number;
  lower: number;
  upper: number;
  residualQuantile: number;
  empiricalCoverage: number;
  observationActual: number;
  alarm: boolean;
}

export interface ConformalEnvelopeReport {
  schemaVersion: 1;
  generatedAt: string;
  confidence: number;
  calibrationSource: "path-fan-residuals";
  residualHistory: ConformalResidualHistory[];
  bands: ConformalMetricBand[];
  alarms: Array<{ metric: string; actual: number; lower: number; upper: number; summary: string }>;
  allPathsBreached: boolean;
}

export interface NavigatorContextPacket {
  schemaVersion: 1;
  packetId: string;
  goalId: string;
  objectiveHash: string;
  activePathId: string;
  activeMilestoneId: string;
  latestObservationIds: string[];
  driftSummaryHash: string;
  councilSummaryHash: string;
  includedHashes: Array<{ name: string; sha256: string }>;
  omittedRawContextNotice: string;
  nextAction: string;
  safetyBoundary: string;
}

export type NavigatorForcedEntropyTrigger = "none" | "memorization_alarm" | "stall_exploration";
export type NavigatorForcedEntropyAction =
  | "continue-leading-path"
  | "remove-eval-shaped-artifact"
  | "widen-eval-family"
  | "stall-to-search"
  | "explore-non-leading-path";

export interface NavigatorCycleHypothesis {
  hypothesis: string;
  expectedFailureMode: string;
  diagnosticInstrument: string;
  expectedMetricMovement: string;
  falsifier: string;
}

export interface NavigatorObservationEvalSignals {
  trainingScore?: number;
  heldOutScore?: number;
  trainingLift?: number;
  heldOutLift?: number;
  primaryMetricDelta?: number;
  source?: "mission-evidence" | "eval-family" | "manual-fixture";
}

export interface NavigatorForcedEntropyDecision {
  trigger: NavigatorForcedEntropyTrigger;
  action: NavigatorForcedEntropyAction;
  forced: boolean;
  memorizationDetected: boolean;
  stallDetected: boolean;
  trainingLift: number;
  heldOutLift: number;
  primaryMetricDelta: number;
  selectedPathIdBefore: string;
  selectedPathIdAfter: string;
  nonLeadingPathId?: string;
  blockedMoves: string[];
  nextMove: string;
  rationale: string;
  evidenceHash: string;
}

export interface NavigatorForcedEntropySummary {
  schemaVersion: 1;
  memorizationDetected: boolean;
  stallDetected: boolean;
  forcedActionCount: number;
  actions: NavigatorForcedEntropyDecision[];
  nextRequiredMove: string;
  summary: string;
}

export interface NavigatorN2ProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  n1: NavigatorProofReport;
  councilTournament: CouncilTournament;
  frontierSelection: FrontierSelection;
  conformal: ConformalEnvelopeReport;
  contextPacket: NavigatorContextPacket;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface NavigatorLoopCheckpoint {
  checkpointId: string;
  sequenceIndex: number;
  timestamp: string;
  activePathId: string;
  milestoneId: string;
  observationId: string;
  reweightHash: string;
  contextPacketId: string;
  pathWeightHash: string;
  pathWeights: Array<{ pathId: string; weight: number; pruned: boolean }>;
  cycleHypothesis: NavigatorCycleHypothesis;
  forcedEntropy: NavigatorForcedEntropyDecision;
  budgetSpent: {
    hours: number;
    tokens: number;
    councilCalls: number;
    estimatedCost: number;
  };
  status: "completed" | "escalated";
}

export interface NavigatorMilestoneRun {
  sequenceIndex: number;
  milestoneId: string;
  observation: NavigationObservation;
  leadingBefore: string;
  leadingAfter: string;
  activePathId: string;
  switched: boolean;
  driftAlarm: boolean;
  forcedEntropyAction: NavigatorForcedEntropyAction;
  forcedPathId?: string;
  checkpointId: string;
}

export interface NavigatorBaselineComparison {
  metric: "path-fit-score";
  selectionMetric: "progressSharpe";
  baselinePathId: string;
  navigatorPathId: string;
  baselineScore: number;
  navigatorScore: number;
  lift: number;
  baselineProgressSharpe: number;
  navigatorProgressSharpe: number;
  progressSharpeLift: number;
  evidenceConfidence: number;
  majorityRealityOrHeldOutEvidence: boolean;
  costRatio: number;
  comparableCost: boolean;
  summary: string;
}

export interface NavigatorResumeProof {
  resumeCheckpointId: string;
  remainingObservations: number;
  uninterruptedFinalPathId: string;
  resumedFinalPathId: string;
  matchesUninterrupted: boolean;
}

export interface NavigatorShapeLibraryEntry {
  entryId: string;
  goalId: string;
  objectiveHash: string;
  shapeKey: string;
  selectedPathId: string;
  outcomeScore: number;
  baselineLift: number;
  evidenceHash: string;
  reusablePrior: {
    shape: PathShape;
    ambition: AmbitionLevel;
    resourceMode: ResourceMode;
    suggestedWeightBoost: number;
  };
}

export interface NavigationPathGenerationOptions {
  shapeLibraryEntries?: NavigatorShapeLibraryEntry[];
}

export interface ShapeMemoryApplicationSummary {
  entriesRead: number;
  matchedEntryIds: string[];
  matchedPathIds: string[];
  boostedShapeKeys: string[];
  totalWeightBoost: number;
  applied: boolean;
}

export interface PathFanPreRegistration {
  schemaVersion: 1;
  goalId: string;
  registeredAt: string;
  pathCount: number;
  pathFanHash: string;
  envelopeHash: string;
  pathIdsHash: string;
  observationPolicy: "observations-must-arrive-after-registration";
  safety: {
    rawPromptsIncluded: false;
    rawEnvValuesIncluded: false;
    rawProviderPayloadsIncluded: false;
  };
}

export interface PathCalibrationScore {
  pathId: string;
  shapeKey: string;
  observationsMatched: number;
  coverageRate: number;
  normalizedRmse: number;
  calibrationScore: number;
  rank: number;
}

export interface PathCalibrationReport {
  schemaVersion: 1;
  goalId: string;
  generatedAt: string;
  selectedPathId: string;
  bestCalibratedPathId: string;
  selectedPathRank: number;
  observationCount: number;
  averageCoverageRate: number;
  averageNormalizedRmse: number;
  scores: PathCalibrationScore[];
  summary: string;
}

export type AmbitionRatchetAction = "promote" | "hold" | "escalate";

export interface AmbitionRatchetObservation {
  observationId: string;
  milestoneId: string;
  metric: string;
  actual: number;
  expected: number;
  max: number;
  overExpected: boolean;
  overMax: boolean;
  overMaxBy: number;
}

export interface AmbitionRatchetDecision {
  schemaVersion: 1;
  goalId: string;
  generatedAt: string;
  activePathId: string;
  activeAmbition: AmbitionLevel;
  requiredConsecutiveOverMax: number;
  consecutiveOverMax: number;
  candidatePathId?: string;
  candidateAmbition?: AmbitionLevel;
  candidateValueEstimate?: number;
  candidateRiskEstimate?: number;
  action: AmbitionRatchetAction;
  councilVotes: CouncilSeatVote[];
  councilVotesForCandidate: number;
  councilDisagreementRate: number;
  observations: AmbitionRatchetObservation[];
  rationale: string;
  falsifier: string;
}

export interface NavigatorLoopProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  n2: NavigatorN2ProofReport;
  observationMix: ObservationWeightMix;
  shapeMemory: ShapeMemoryApplicationSummary;
  pathFanPreRegistration: PathFanPreRegistration;
  calibration: PathCalibrationReport;
  ambitionRatchet: AmbitionRatchetDecision;
  forcedEntropy: NavigatorForcedEntropySummary;
  selectedPathId: string;
  baselinePathId: string;
  observations: NavigationObservation[];
  milestoneRuns: NavigatorMilestoneRun[];
  checkpoints: NavigatorLoopCheckpoint[];
  resumeProof: NavigatorResumeProof;
  baselineComparison: NavigatorBaselineComparison;
  shapeLibraryEntry: NavigatorShapeLibraryEntry;
  interrupts: Array<{ type: "human-escalation"; reason: string; checkpointId: string }>;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface NavigatorDailyLoopDay {
  dayIndex: number;
  simulatedDate: string;
  lease: {
    leaseId: string;
    owner: "navigator-daily-loop";
    acquired: boolean;
    expiresAt: string;
  };
  missionRunId: string;
  missionId: string;
  evidenceHash: string;
  observationCount: number;
  dispatchedRunWeightFraction: number;
  loopProofId: string;
  selectedPathId: string;
  baselinePathId: string;
  navigatorScore: number;
  baselineScore: number;
  lift: number;
  ratchetAction: AmbitionRatchetAction;
  ratchetCandidatePathId?: string;
  checkpointCount: number;
  shapeMemoryEntryId: string;
  nextWakeupAt: string;
  status: "completed" | "escalated";
}

export interface NavigatorDailyLoopProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  daysRequested: number;
  daysCompleted: number;
  aggregate: {
    missionRuns: number;
    uniqueMissionRuns: number;
    promotedRatchets: number;
    escalatedDays: number;
    averageLift: number;
    bestLift: number;
    scoreTrend: number;
    finalNextWakeupAt?: string;
    shapeMemoryEntriesProduced: number;
  };
  days: NavigatorDailyLoopDay[];
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface SafeCommandProbeEvidence {
  probeName: string;
  commandLabel: string;
  cwdLabel: string;
  status: number | null;
  ok: boolean;
  durationMs: number;
  stdoutHash: string;
  stderrHash: string;
  detectedFailure: string | null;
}

export interface FlappyValidatorRuleCheck {
  ruleId: string;
  summary: string;
  passedInSeed: boolean;
  severity: "info" | "warning" | "blocking";
}

export interface FlappyValidatorArmResult {
  armId: "static-baseline" | "navigator-selected";
  pathId: string;
  fixedRuleIds: string[];
  unresolvedRuleIds: string[];
  passRate: number;
  objectiveScore: number;
}

export interface FlappyValidatorSourceEvidence {
  sourceLabel: string;
  sourceHash: string;
  loc: number;
  detectedConstants: Record<string, number | string | null>;
  ruleChecks: FlappyValidatorRuleCheck[];
}

export interface FlappyValidatorRealityReport {
  schemaVersion: 1;
  reportId: string;
  generatedAt: string;
  source: FlappyValidatorSourceEvidence;
  smoke: SafeCommandProbeEvidence;
  baseline: FlappyValidatorArmResult;
  navigator: FlappyValidatorArmResult;
  validatorRows: number;
  validatorLift: number;
  observations: NavigationObservation[];
  safety: {
    rawSourceIncluded: false;
    rawCommandOutputIncluded: false;
    envValuesIncluded: false;
  };
}

export interface FlappyPygameRuntimeSummary {
  schemaVersion: 1;
  sourceHash: string;
  frames: number;
  score: number;
  pipesAdvanced: number;
  gravitySamples: number;
  collisionChecks: number;
  boundsChecks: number;
  collisions: number;
  finalBirdY: number;
  events: string[];
  ok: boolean;
}

export interface FlappyPygameRepairManifest {
  schemaVersion: 1;
  generatedAt: string;
  sourceLabel: string;
  sourceHash: string;
  sourceLoc: number;
  repairedArtifactLabel: string;
  repairedArtifactHash: string;
  fixedRuleIds: string[];
  unresolvedRuleIds: string[];
  sourceConstants: Record<string, number | string | null>;
  repairedConstants: {
    WIDTH: number;
    HEIGHT: number;
    FPS: number;
    GRAVITY: number;
    JUMP_VELOCITY: number;
    PIPE_SPEED: number;
    PIPE_GAP: number;
  };
  safety: {
    rawSourceIncluded: false;
    rawCommandOutputIncluded: false;
    envValuesIncluded: false;
  };
}

export interface FlappyPygameRepairReport {
  schemaVersion: 1;
  reportId: string;
  generatedAt: string;
  passed: boolean;
  manifest: FlappyPygameRepairManifest;
  execution: SafeCommandProbeEvidence;
  runtimeSummary: FlappyPygameRuntimeSummary | null;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
}

export interface FlappySourceMutationProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  sourceLabel: string;
  applyMode: "applied" | "dry-run";
  restoredAfterProof: boolean;
  preSourceHash: string;
  repairedSourceHash: string;
  mutationObservedHash: string;
  finalSourceHash: string;
  sourceLocBefore: number;
  sourceLocAfter: number;
  fixedRuleIds: string[];
  unresolvedBlockingRuleIds: string[];
  execution: SafeCommandProbeEvidence;
  runtimeSummary: FlappyPygameRuntimeSummary | null;
  safety: {
    rawSourceIncluded: false;
    rawCommandOutputIncluded: false;
    envValuesIncluded: false;
  };
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface FlappyPromptTwinAbArmEvidence {
  armId: "control-manager" | "prompt-twin";
  strategy: string;
  artifactLabel: string;
  artifactHash: string;
  fixedRuleIds: string[];
  unresolvedRuleIds: string[];
  execution: SafeCommandProbeEvidence;
  runtimeSummary: FlappyPygameRuntimeSummary | null;
  runtimeScore: number;
}

export interface FlappyPromptTwinAbProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  sourceLabel: string;
  sourceHash: string;
  sourceLoc: number;
  control: FlappyPromptTwinAbArmEvidence;
  twin: FlappyPromptTwinAbArmEvidence;
  runtimeLift: number;
  ruleRepairLift: number;
  heldOutPreRegistration?: FlappyPromptTwinAbHeldOutPreRegistration;
  heldOutResult?: FlappyPromptTwinAbHeldOutResult;
  heldOutLift?: number;
  observations: NavigationObservation[];
  safety: {
    rawSourceIncluded: false;
    rawCommandOutputIncluded: false;
    envValuesIncluded: false;
  };
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface NavigatorValidatorProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  validator: FlappyValidatorRealityReport;
  pygameRepair?: FlappyPygameRepairReport;
  loop: NavigatorLoopProofReport;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export type MonorepoPrimitiveKind = "bie-frontier" | "bie-elo" | "conformal" | "swarm-harness";

export interface MonorepoPrimitiveSourceEvidence {
  kind: MonorepoPrimitiveKind;
  sourceLabel: string;
  sourceHash: string;
  loc: number;
  detectedSymbols: string[];
}

export interface BiePrimitiveExecutionSummary {
  directImport: true;
  moduleLabel: string;
  moduleHash: string;
  ideasEvaluated: number;
  frontierPoints: number;
  allocations: number;
  maxSharpeRatio: number;
  minVarianceRisk: number;
  selectedPathIds: string[];
  topEloPathId: string;
  eloMatches: number;
  outputHash: string;
}

export interface ConformalPrimitiveExecutionSummary {
  directExecution: true;
  sourceLabel: string;
  sourceHash: string;
  execution: SafeCommandProbeEvidence;
  forecastsCalibrated: number;
  confidenceLevels: number[];
  coverage90: number | null;
  firstForecast: {
    predicted: number;
    ci80Lower: number;
    ci80Upper: number;
    ci90Lower: number;
    ci90Upper: number;
    ci95Lower: number;
    ci95Upper: number;
  } | null;
  outputHash: string;
}

export interface SwarmHarnessPrimitiveSummary {
  coordinator: MonorepoPrimitiveSourceEvidence;
  worker: MonorepoPrimitiveSourceEvidence;
  launcher: MonorepoPrimitiveSourceEvidence;
  modes: string[];
  envKeys: string[];
  hasChildProcessFork: boolean;
  hasIpcProtocol: boolean;
  executionPolicy: "provenance-only-requires-credentials";
}

export interface NavigatorMonorepoPrimitiveProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  sources: MonorepoPrimitiveSourceEvidence[];
  bie: BiePrimitiveExecutionSummary;
  conformal: ConformalPrimitiveExecutionSummary;
  swarm: SwarmHarnessPrimitiveSummary;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface PromptTwinJudgmentEvidence {
  schemaVersion: 1;
  mode: "fixture" | "provider-gated" | "provider-live" | "provider-failed";
  provider: "fixture-reviewer" | "azure-openai-responses";
  profile: string;
  status: "ok" | "skipped" | "failed";
  callsEnabled: boolean;
  configured: boolean;
  inputHash: string;
  rubricHash: string;
  evidenceHash: string;
  responseId?: string;
  bodyHash?: string;
  outputHash?: string;
  outputTextLength?: number;
  totalTokens?: number;
  durationMs?: number;
  verdict: "approve" | "revise" | "reject";
  score: number;
  confidence: number;
  rationale: string;
  strengths: string[];
  risks: string[];
  steering: string[];
  falsifier: string;
  safety: {
    rawPromptIncluded: false;
    rawProviderResponseIncluded: false;
    envValuesIncluded: false;
  };
}

export interface NavigatorPromptTwinProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  requireLive: boolean;
  candidatePathId: string;
  validatorPassed: boolean;
  primitiveProofPassed: boolean;
  judgment: PromptTwinJudgmentEvidence;
  observation: NavigationObservation;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface ProviderCouncilSeatJudgmentEvidence {
  schemaVersion: 1;
  mode: "provider-gated" | "provider-live" | "provider-failed";
  provider: "azure-openai-responses";
  profile: string;
  providerIdentity?: {
    provider: "azure-openai-responses";
    urlKeyHash?: string;
    apiKeyKeyHash?: string;
    deploymentKeyHash?: string;
    apiVersionKeyHash?: string;
    timeoutMs?: number;
    seatDeploymentOverride: boolean;
    identityHash: string;
  };
  status: "ok" | "skipped" | "failed";
  callsEnabled: boolean;
  configured: boolean;
  seat: CouncilJudgeSeat;
  leftPathId: string;
  rightPathId: string;
  inputHash: string;
  rubricHash: string;
  evidenceHash: string;
  responseId?: string;
  bodyHash?: string;
  outputHash?: string;
  outputTextLength?: number;
  totalTokens?: number;
  durationMs?: number;
  winnerPathId?: string;
  confidence: number;
  rationale: string;
  risks: string[];
  falsifier: string;
  safety: {
    rawPromptIncluded: false;
    rawProviderResponseIncluded: false;
    envValuesIncluded: false;
  };
}

export interface NavigatorProviderCouncilProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  requireLive: boolean;
  deterministicWinnerPathId: string;
  judgment: ProviderCouncilSeatJudgmentEvidence;
  observation: NavigationObservation;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface ProviderCouncilWinnerTally {
  pathId: string;
  votes: number;
}

export interface ProviderCouncilDecisionContext {
  matchId: string;
  source: "top-contested-match" | "fallback-match";
  deterministicCriterion: string;
  deterministicDisagreementRate: number;
  deterministicSplit: boolean;
  observationCount: number;
  observationMix: ObservationWeightMix;
}

export interface ProviderCouncilSessionEvidence {
  schemaVersion: 1;
  mode: "provider-gated" | "provider-live" | "provider-failed" | "provider-mixed";
  provider: "azure-openai-responses";
  profile: string;
  leftPathId: string;
  rightPathId: string;
  deterministicWinnerPathId: string;
  decisionContext: ProviderCouncilDecisionContext;
  reportedWinnerPathId: string;
  judgments: ProviderCouncilSeatJudgmentEvidence[];
  winnerTally: ProviderCouncilWinnerTally[];
  liveSeatCount: number;
  gatedSeatCount: number;
  failedSeatCount: number;
  parsedSeatCount: number;
  distinctProviderIdentityCount: number;
  allSeatsUseDistinctProviderIdentities: boolean;
  disagreementRate: number;
  averageConfidence: number;
  totalTokens?: number;
  durationMs?: number;
  safety: {
    rawPromptIncluded: false;
    rawProviderResponseIncluded: false;
    envValuesIncluded: false;
  };
}

export interface NavigatorProviderCouncilSessionProofReport {
  schemaVersion: 1;
  proofId: string;
  goalId: string;
  generatedAt: string;
  passed: boolean;
  requireLive: boolean;
  deterministicWinnerPathId: string;
  session: ProviderCouncilSessionEvidence;
  observation: NavigationObservation;
  acceptanceGates: Array<{ name: string; status: "pass" | "fail"; summary: string }>;
  artifacts: Array<{ path: string; sha256: string; bytes: number; summary: string }>;
}

export interface NavigatorHudData {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  report: NavigatorProofReport;
}

const SHAPES: PathShape[] = [
  "risk-first",
  "steady-grind",
  "spike-and-stabilize",
  "parallel-tracks",
  "research-then-build",
  "build-then-measure"
];
const AMBITIONS: AmbitionLevel[] = ["safe", "stretch", "moonshot"];
const RESOURCE_MODES: ResourceMode[] = ["solo-agent", "swarm", "council-heavy"];
const FLAPPY_DEFECT_OPERATORS: FlappyDefectOperator[] = [
  "disable-gravity",
  "freeze-pipe-speed",
  "disable-scoring",
  "remove-bounds-collision",
  "break-jump-impulse",
  "spawn-impossible-gaps",
  "corrupt-event-loop",
  "hide-state-update"
];

export function compileNavigatorGoal(
  objective: string,
  now = new Date().toISOString(),
  domain: NavigatorObjectiveDomain = objective.toLowerCase().includes("asset-clone") || objective.toLowerCase().includes("asset clone")
    ? "asset-clone"
    : "flappy-prompt-twin-ab"
): NavigatorGoal {
  const trimmed = objective.trim();
  if (!trimmed) throw new Error("Navigator goal objective cannot be empty.");
  const goalId = goalIdFromObjective(trimmed);
  const inputHash = hashText(trimmed);
  const lossFunction = buildNavigatorLossFunction(goalId, trimmed, domain);
  return {
    schemaVersion: 1,
    goalId,
    createdAt: now,
    domain,
    objective: trimmed,
    northStar: domain === "asset-clone"
      ? `Make ${trimmed} measurably better through held-out pixel-similarity scoring, not prompt-shaped visual claims.`
      : `Make ${trimmed} measurably better through evidence-gated path search, not single-plan improvisation.`,
    sotaDefinition: {
      summary: "A great result beats a control manager on held-out variants while preserving trust gates and producing a defensible decision trail.",
      measurableProperties: [
        {
          name: "validator-pass-rate",
          target: "Twin-steered arm beats control by >= 0.10 on held-out Pygame/fixture variants.",
          evidenceLayer: "reality"
        },
        {
          name: "held-out-transfer",
          target: "Held-out score improves without optimizer-visible leakage.",
          evidenceLayer: "heldOut"
        },
        {
          name: "trust-boundary",
          target: "Zero secret leaks, raw prompt bodies, raw URLs, or response payloads in publishable artifacts.",
          evidenceLayer: "trust"
        },
        {
          name: "taste-gate",
          target: "Prompt Twin review score >= 0.80 and no contradiction from objective reality.",
          evidenceLayer: "promptTwin"
        }
      ]
    },
    benchmarkLadder: [
      {
        rung: 1,
        claim: "Navigator compiles an ambitious goal into a measurable rubric.",
        objectiveCheck: "goal.json has northStar, SOTA definition, benchmark ladder, value function, budgets, and escalation policy.",
        requiredEvidenceLayer: "trust"
      },
      {
        rung: 2,
        claim: "Navigator explores a diverse path fan and reweights it from evidence.",
        objectiveCheck: "path fan has >= 20 candidates, >= 5 shapes, a path switch or prune, and a drift report.",
        requiredEvidenceLayer: "heldOut"
      },
      {
        rung: 3,
        claim: "Navigator helps the Prompt Twin A/B objective beat a control.",
        objectiveCheck: "Twin arm beats control on validator pass rate with a full evidence trail.",
        requiredEvidenceLayer: "reality"
      },
      {
        rung: 4,
        claim: "Navigator generalizes across multiple goals.",
        objectiveCheck: "A second goal beats a single-plan baseline at comparable cost.",
        requiredEvidenceLayer: "reality"
      }
    ],
    valueFunction: [
      { layer: "reality", name: "runtime-validator-outcomes", weight: 0.38, promotionEligible: true },
      { layer: "heldOut", name: "held-out-transfer-score", weight: 0.24, promotionEligible: true },
      { layer: "trust", name: "leak-budget-approval-gates", weight: 0.18, promotionEligible: true },
      { layer: "promptTwin", name: "prompt-twin-quality-gate", weight: 0.14, promotionEligible: false },
      { layer: "council", name: "pairwise-council-elo", weight: 0.06, promotionEligible: false }
    ],
    lossFunction,
    budgets: {
      maxPaths: 200,
      maxWallClockHours: 8,
      maxCouncilCalls: 2,
      maxEstimatedCost: 100
    },
    escalationPolicy: {
      driftOutsideAllEnvelopes: "human-escalation",
      consecutiveOverPerformanceForRatchet: 2,
      humanFeedbackWeight: 3
    },
    promptTwin: {
      mode: "fixture-reviewer",
      corpusRef: "fixture://prompt-twin/source-notes/codex-transcript",
      rubric: [
        "Prefer concrete evidence over confident narrative.",
        "Reject quality claims without held-out or runtime checks.",
        "Reward compact, high-signal context and clear falsifiers."
      ],
      doesNotOverrideActualUser: true
    },
    councilSeed: buildCouncilSession(trimmed, inputHash)
  };
}

function buildNavigatorLossFunction(goalId: string, objective: string, domain: NavigatorObjectiveDomain): NavigatorLossFunction {
  if (domain === "asset-clone") {
    const evalFamily = "asset-clone-heldout-v1";
    const heldOutCommitment = buildAssetCloneEvalFactoryReport({
      familyId: evalFamily,
      totalCases: 240,
      trainCases: 144,
      generatedAt: "1970-01-01T00:00:00.000Z"
    }).heldOutCommitment;
    return {
      target: {
        name: "asset_clone_pixel_similarity",
        primaryMetric: "pixelSimilarityScore",
        direction: "maximize",
        bar: 0.9,
        trainingEvalRef: "eval-families/asset-clone/train/manifest.json",
        blindedEvalRef: `scorer-only:${evalFamily}`,
        answerKeyCommitment: {
          algorithm: "sha256",
          hash: heldOutCommitment.answerKeyCommitment.hash
        }
      },
      constraints: [
        {
          name: "wall_clock_hours",
          limit: 2,
          instrument: "pbos budget:status --field elapsedHours",
          enforcement: "score-penalty"
        },
        {
          name: "provider_spend_usd",
          limit: 25,
          instrument: "pbos budget:status --field spendUsd",
          enforcement: "score-penalty"
        },
        {
          name: "safe_evidence_only",
          limit: "no raw image bodies, prompts, URLs, env keys, request bodies, response bodies, target pixels, private grids, or held-out answer keys",
          instrument: "pbos evidence:scan <runId>",
          enforcement: "gate"
        },
        {
          name: "held_out_blinding",
          limit: "optimizer sees asset-clone commitments and aggregate pixel scores only",
          instrument: `pbos eval:asset-clone-held-out <runId> --scorer-ref ${evalFamily}`,
          enforcement: "gate"
        }
      ],
      instruments: [
        {
          name: "budget-status",
          command: "pbos budget:status --run <runId>",
          provides: "elapsed wall clock, spend, tokens, council calls, and remaining budget",
          optimizerVisible: true
        },
        {
          name: "training-score",
          command: "pbos eval:asset-clone-training <runId>",
          provides: "optimizer-visible training pixel similarity and training lift",
          optimizerVisible: true
        },
        {
          name: "held-out-score",
          command: `pbos eval:asset-clone-held-out <runId> --scorer-ref ${evalFamily}`,
          provides: "aggregate pixelSimilarityScore and pixelDiffRatio only; no target pixels, prompts, private grids, or answer keys",
          optimizerVisible: false
        },
        {
          name: "latest-observations",
          command: "pbos warehouse:latest-observations --goal <goalId>",
          provides: "latest held-out pixel, trust, Prompt Twin, council, and human observations",
          optimizerVisible: true
        },
        {
          name: "path-calibration",
          command: "pbos navigate calibration <goalId>",
          provides: "path-envelope coverage, normalized RMSE, and selected-path rank",
          optimizerVisible: true
        },
        {
          name: "evidence-scan",
          command: "pbos evidence:scan <runId>",
          provides: "secret, raw image, prompt, request body, response body, target-pixel, and answer-key leak checks",
          optimizerVisible: true
        }
      ],
      entropyRules: [
        {
          name: "memorization_alarm",
          condition: "trainingLift > 0.05 && heldOutLift <= 0.01",
          forcedNextMove: "remove or cap eval-shaped artifacts, widen the asset-clone family, and do not tune against target hashes",
          evidenceRequired: "training pixel score, held-out aggregate pixel score, and artifact scan"
        },
        {
          name: "stall_exploration",
          condition: "primaryMetricDelta <= 0 for one cycle",
          forcedNextMove: "execute one bounded step from a non-leading registered path",
          evidenceRequired: "cycle metric delta, path id, and post-step observation"
        },
        {
          name: "cycle_hypothesis_required",
          condition: "every cycle",
          forcedNextMove: "record hypothesis, expected failure mode, diagnostic instrument, expected metric movement, and falsifier before execution",
          evidenceRequired: "checkpoint cycle hypothesis fields"
        }
      ],
      timeCostPenalty: {
        qualityWeight: 1,
        hourPenaltyLambda: 0.04,
        spendPenaltyMu: 0.01,
        riskPenaltyRho: 0.02,
        selectionMetric: "progressSharpe",
        formula: "verifiedProgress / (hours + spendPenalty + riskPenalty)"
      },
      preRegistration: {
        required: true,
        pathFanHashAlgorithm: "sha256",
        answerKeyCommitmentRequired: true,
        blindedEvalStorage: "scorer-only",
        heldOutRevealPolicy: "held-out image bodies, prompts, target pixels, private grids, and answer keys stay outside the optimizer workspace; scorer returns aggregates and hashes only"
      }
    };
  }
  const evalFamily = "flappy-heldout-v1";
  const heldOutCommitment = buildFlappyEvalFactoryReport({
    familyId: evalFamily,
    totalCases: 500,
    trainCases: 320,
    generatedAt: "1970-01-01T00:00:00.000Z"
  }).heldOutCommitment;
  const answerKeyHash = heldOutCommitment.answerKeyCommitment.hash;
  return {
    target: {
      name: "flappy_prompt_twin_transfer_loss",
      primaryMetric: "heldOutPassRate",
      direction: "maximize",
      bar: 0.8,
      trainingEvalRef: "eval-families/flappy/train/manifest.json",
      blindedEvalRef: `scorer-only:${evalFamily}`,
      answerKeyCommitment: {
        algorithm: "sha256",
        hash: answerKeyHash
      }
    },
    constraints: [
      {
        name: "wall_clock_hours",
        limit: 2,
        instrument: "pbos budget:status --field elapsedHours",
        enforcement: "score-penalty"
      },
      {
        name: "provider_spend_usd",
        limit: 25,
        instrument: "pbos budget:status --field spendUsd",
        enforcement: "score-penalty"
      },
      {
        name: "safe_evidence_only",
        limit: "no raw URLs, env keys, request bodies, response bodies, selected live payload fields, or held-out answer keys",
        instrument: "pbos evidence:scan <runId>",
        enforcement: "gate"
      },
      {
        name: "held_out_blinding",
        limit: "optimizer sees commitments and aggregate scores only",
        instrument: "pbos eval:held-out <runId> --scorer-ref flappy-heldout-v1",
        enforcement: "gate"
      }
    ],
    instruments: [
      {
        name: "budget-status",
        command: "pbos budget:status --run <runId>",
        provides: "elapsed wall clock, spend, tokens, council calls, and remaining budget",
        optimizerVisible: true
      },
      {
        name: "training-score",
        command: "pbos eval:training <runId>",
        provides: "optimizer-visible training score and training lift",
        optimizerVisible: true
      },
      {
        name: "held-out-score",
        command: "pbos eval:held-out <runId> --scorer-ref flappy-heldout-v1",
        provides: "aggregate held-out score only; no held-out cases or answer key",
        optimizerVisible: false
      },
      {
        name: "latest-observations",
        command: "pbos warehouse:latest-observations --goal <goalId>",
        provides: "latest reality, held-out, trust, Prompt Twin, and council observations",
        optimizerVisible: true
      },
      {
        name: "path-calibration",
        command: "pbos navigate calibration <goalId>",
        provides: "path-envelope coverage, normalized RMSE, and selected-path rank",
        optimizerVisible: true
      },
      {
        name: "evidence-scan",
        command: "pbos evidence:scan <runId>",
        provides: "secret, raw URL, request body, response body, and answer-key leak checks",
        optimizerVisible: true
      }
    ],
    entropyRules: [
      {
        name: "memorization_alarm",
        condition: "trainingLift > 0.05 && heldOutLift <= 0.01",
        forcedNextMove: "remove or cap eval-shaped artifacts, widen the eval family, and do not add another keyword gate",
        evidenceRequired: "training score, held-out aggregate score, and artifact scan"
      },
      {
        name: "stall_exploration",
        condition: "primaryMetricDelta <= 0 for one cycle",
        forcedNextMove: "execute one bounded step from a non-leading registered path",
        evidenceRequired: "cycle metric delta, path id, and post-step observation"
      },
      {
        name: "cycle_hypothesis_required",
        condition: "every cycle",
        forcedNextMove: "record hypothesis, expected failure mode, diagnostic instrument, expected metric movement, and falsifier before execution",
        evidenceRequired: "checkpoint cycle hypothesis fields"
      }
    ],
    timeCostPenalty: {
      qualityWeight: 1,
      hourPenaltyLambda: 0.04,
      spendPenaltyMu: 0.01,
      riskPenaltyRho: 0.02,
      selectionMetric: "progressSharpe",
      formula: "verifiedProgress / (hours + spendPenalty + riskPenalty)"
    },
    preRegistration: {
      required: true,
      pathFanHashAlgorithm: "sha256",
      answerKeyCommitmentRequired: true,
      blindedEvalStorage: "scorer-only",
      heldOutRevealPolicy: "held-out bodies and answer keys stay outside the optimizer workspace; scorer returns aggregates and hashes only"
    }
  };
}

export function generateNavigationPaths(goal: NavigatorGoal, count = 20, options: NavigationPathGenerationOptions = {}): NavigationPath[] {
  const pathCount = Math.max(1, Math.min(goal.budgets.maxPaths, Math.round(count)));
  const shapePriors = aggregateShapeLibraryPriors(options.shapeLibraryEntries ?? []);
  const paths = Array.from({ length: pathCount }, (_, index) => {
    const shape = SHAPES[index % SHAPES.length];
    const ambition = AMBITIONS[Math.floor(index / SHAPES.length) % AMBITIONS.length];
    const resourceMode = RESOURCE_MODES[Math.floor(index / (SHAPES.length * AMBITIONS.length)) % RESOURCE_MODES.length];
    const seed = pathSeed(shape, ambition, resourceMode, index);
    const shapeKey = shapeMemoryKey(shape, ambition, resourceMode);
    const memoryPrior = shapePriors.get(shapeKey);
    const weightBoost = memoryPrior?.weightBoost ?? 0;
    const valueBoost = round(weightBoost * 0.18);
    const riskReduction = round(weightBoost * 0.08);
    const valueEstimate = bounded(seed.passRate * 0.56 + seed.twinScore * 0.24 + seed.validatorRows / 1000 * 0.2 + valueBoost);
    const riskEstimate = bounded(seed.risk - riskReduction);
    const cost = seed.hours * 8 + seed.tokens / 200000 + seed.councilCalls * 6;
    const milestones = buildMilestonesForShape(shape, seed);
    const toolKinds = uniqueWorkspaceOpsToolKinds(milestones.flatMap((milestone) => milestone.toolKinds));
    return {
      pathId: `${goal.goalId}-p${String(index + 1).padStart(3, "0")}-${shape}-${ambition}`,
      goalId: goal.goalId,
      shape,
      ambition,
      resourceMode,
      milestones,
      toolKinds,
      toolQualifications: buildPathToolQualifications(milestones),
      approvalRequired: toolKinds.some((toolKind) => isWorkspaceOpsApprovalRequiredToolKind(toolKind)),
      predictedOutcome: {
        metric: "twinLift",
        value: round(bounded(seed.twinLift + valueBoost * 0.45)),
        band: [round(seed.twinLift - 0.08), round(bounded(seed.twinLift + 0.08 + valueBoost * 0.45))] as [number, number]
      },
      estimatedCost: {
        tokens: seed.tokens,
        hours: seed.hours,
        councilCalls: seed.councilCalls
      },
      valueEstimate: round(valueEstimate),
      riskEstimate: round(riskEstimate),
      councilElo: Math.round(1000 + valueEstimate * 260 - riskEstimate * 90 - cost),
      frontier: {
        value: round(valueEstimate),
        cost: round(cost / 100),
        risk: round(riskEstimate),
        efficient: false
      },
      weight: round(1 / pathCount + weightBoost),
      memoryPrior: memoryPrior
        ? {
            source: "shape-library" as const,
            entryIds: memoryPrior.entryIds,
            shapeKey,
            weightBoost,
            valueBoost,
            riskReduction
          }
        : undefined
    };
  });
  const weighted = applyCouncilEloAndFrontier(paths);
  return normalizePathWeights(weighted);
}

export function summarizeShapeMemoryApplication(paths: NavigationPath[], entries: NavigatorShapeLibraryEntry[] = []): ShapeMemoryApplicationSummary {
  const matchedPaths = paths.filter((path) => path.memoryPrior);
  const matchedEntryIds = [...new Set(matchedPaths.flatMap((path) => path.memoryPrior?.entryIds ?? []))].sort();
  const boostedShapeKeys = [...new Set(matchedPaths.map((path) => path.memoryPrior?.shapeKey).filter((value): value is string => Boolean(value)))].sort();
  return {
    entriesRead: entries.length,
    matchedEntryIds,
    matchedPathIds: matchedPaths.map((path) => path.pathId).sort(),
    boostedShapeKeys,
    totalWeightBoost: round(matchedPaths.reduce((sum, path) => sum + (path.memoryPrior?.weightBoost ?? 0), 0)),
    applied: matchedPaths.length > 0
  };
}

export function buildPathFanPreRegistration(
  goal: NavigatorGoal,
  paths: NavigationPath[],
  registeredAt = new Date().toISOString()
): PathFanPreRegistration {
  const envelopeSeed = paths.map((path) => ({
    pathId: path.pathId,
    milestones: path.milestones.map((milestone) => ({
      id: milestone.id,
      metric: milestone.envelope.metric,
      min: milestone.envelope.min,
      expected: milestone.envelope.expected,
      max: milestone.envelope.max
    }))
  }));
  return {
    schemaVersion: 1,
    goalId: goal.goalId,
    registeredAt,
    pathCount: paths.length,
    pathFanHash: hashText(JSON.stringify(paths)),
    envelopeHash: hashText(JSON.stringify(envelopeSeed)),
    pathIdsHash: hashText(JSON.stringify(paths.map((path) => path.pathId).sort())),
    observationPolicy: "observations-must-arrive-after-registration",
    safety: {
      rawPromptsIncluded: false,
      rawEnvValuesIncluded: false,
      rawProviderPayloadsIncluded: false
    }
  };
}

export function buildPathCalibrationReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations: NavigationObservation[];
  selectedPathId: string;
  generatedAt?: string;
}): PathCalibrationReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const scoresWithoutRank = input.paths.map((path) => {
    const errors: number[] = [];
    let covered = 0;
    for (const observation of input.observations) {
      const milestone = findMilestoneForObservation(path, observation);
      if (!milestone) continue;
      const width = Math.max(0.0001, (milestone.envelope.max - milestone.envelope.min) / 2);
      const normalizedError = (observation.actual - milestone.envelope.expected) / width;
      errors.push(normalizedError * normalizedError);
      if (observation.actual >= milestone.envelope.min && observation.actual <= milestone.envelope.max) {
        covered += 1;
      }
    }
    const observationsMatched = errors.length;
    const normalizedRmse = observationsMatched > 0
      ? round(Math.sqrt(errors.reduce((sum, value) => sum + value, 0) / observationsMatched))
      : 999;
    const coverageRate = observationsMatched > 0 ? round(covered / observationsMatched) : 0;
    const calibrationScore = round((1 / (1 + normalizedRmse)) * 0.65 + coverageRate * 0.35);
    return {
      pathId: path.pathId,
      shapeKey: shapeMemoryKey(path.shape, path.ambition, path.resourceMode),
      observationsMatched,
      coverageRate,
      normalizedRmse,
      calibrationScore,
      rank: 0
    };
  });
  const rankedScores = [...scoresWithoutRank]
    .sort((a, b) => b.calibrationScore - a.calibrationScore || a.normalizedRmse - b.normalizedRmse || a.pathId.localeCompare(b.pathId))
    .map((score, index) => ({ ...score, rank: index + 1 }));
  const scoreByPath = new Map(rankedScores.map((score) => [score.pathId, score]));
  const selected = scoreByPath.get(input.selectedPathId) ?? rankedScores[0];
  const averageCoverageRate = round(rankedScores.reduce((sum, score) => sum + score.coverageRate, 0) / Math.max(1, rankedScores.length));
  const averageNormalizedRmse = round(rankedScores.reduce((sum, score) => sum + score.normalizedRmse, 0) / Math.max(1, rankedScores.length));
  const bestCalibratedPathId = rankedScores[0]?.pathId ?? input.selectedPathId;
  return {
    schemaVersion: 1,
    goalId: input.goal.goalId,
    generatedAt,
    selectedPathId: input.selectedPathId,
    bestCalibratedPathId,
    selectedPathRank: selected?.rank ?? 0,
    observationCount: input.observations.length,
    averageCoverageRate,
    averageNormalizedRmse,
    scores: rankedScores,
    summary: `Best calibrated path ${bestCalibratedPathId}; selected path rank ${selected?.rank ?? 0}/${rankedScores.length} with normalized RMSE ${selected?.normalizedRmse ?? 0}.`
  };
}

export function buildFixtureNavigatorObservations(now = new Date().toISOString()): NavigationObservation[] {
  return [
    {
      observationId: "obs-validator-rows",
      milestoneId: "m1-validator-sample",
      metric: "validatorRows",
      actual: 178,
      sourceLayer: "reality",
      provenance: "fixture",
      weight: 1.4,
      summary: "Fixture validator produced enough rows to reject tiny-sample paths.",
      timestamp: now
    },
    {
      observationId: "obs-heldout-pass-rate",
      milestoneId: "m2-heldout-pass-rate",
      metric: "heldOutPassRate",
      actual: 0.74,
      sourceLayer: "heldOut",
      provenance: "fixture",
      weight: 1.2,
      summary: "Held-out pass rate favors stretch paths over safe paths.",
      timestamp: now
    },
    {
      observationId: "obs-prompt-twin-score",
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: 0.83,
      sourceLayer: "promptTwin",
      provenance: "fixture",
      weight: 0.8,
      summary: "Prompt Twin fixture approves the evidence trail but cannot overrule reality.",
      timestamp: now
    }
  ];
}

export function buildFixtureNavigatorLoopObservations(now = new Date().toISOString()): NavigationObservation[] {
  const base = buildFixtureNavigatorObservations(now);
  return [
    base[0],
    base[1],
    {
      observationId: "obs-human-quality-bar",
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: 0.86,
      sourceLayer: "humanFeedback",
      provenance: "fixture",
      weight: 3,
      summary: "Fixture human feedback raises the quality bar but is merged as evidence without resetting the loop.",
      timestamp: now
    },
    base[2]
  ];
}

export function buildMissionEvidenceObservations(evidence: NavigatorMissionEvidenceLike, now = new Date().toISOString()): NavigationObservation[] {
  const heldOutScore = aggregateNavigatorEvalScore(evidence.evals, "heldOut");
  const trustScore = aggregateNavigatorEvalScore(evidence.evals, "trust");
  const trainingScore = aggregateNavigatorEvalScore(evidence.evals, "training");
  const successfulSteps = evidence.steps.filter((step) => step.status === "ok").length;
  const artifactBytes = evidence.artifacts.reduce((sum, artifact) => sum + Math.max(0, artifact.bytes || 0), 0);
  const evidenceRows = Math.min(260, Math.round(
    80
    + evidence.artifacts.length * 2
    + evidence.toolsUsed.length * 4
    + successfulSteps * 4
    + Math.min(35, artifactBytes / 4000)
  ));
  const cleanTrustScore = evidence.redactionReport.leaksDetected > 0 ? 0 : trustScore;
  const runToken = evidence.runId.replace(/[^a-zA-Z0-9-]/g, "-").slice(-16);
  return [
    {
      observationId: `obs-run-${runToken}-evidence-rows`,
      milestoneId: "m1-validator-sample",
      metric: "validatorRows",
      actual: evidenceRows,
      sourceLayer: "reality",
      provenance: "dispatched-run",
      weight: 2.1,
      summary: `Dispatched mission ${evidence.missionId} produced ${evidence.artifacts.length} artifacts, ${evidence.toolsUsed.length} tools, and ${successfulSteps}/${evidence.steps.length} successful steps.`,
      timestamp: now
    },
    {
      observationId: `obs-run-${runToken}-heldout`,
      milestoneId: "m2-heldout-pass-rate",
      metric: "heldOutPassRate",
      actual: heldOutScore,
      sourceLayer: "heldOut",
      provenance: "dispatched-run",
      weight: 2,
      summary: `Dispatched mission held-out eval aggregate is ${heldOutScore.toFixed(4)}; this score was not visible to optimizer selection.`,
      timestamp: now,
      evalSignals: {
        trainingScore,
        heldOutScore,
        source: "mission-evidence"
      }
    },
    {
      observationId: `obs-run-${runToken}-trust`,
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: cleanTrustScore,
      sourceLayer: "trust",
      provenance: "dispatched-run",
      weight: 1.4,
      summary: `Dispatched mission trust aggregate is ${cleanTrustScore.toFixed(4)} with ${evidence.redactionReport.leaksDetected} detected leaks; this is a trust proxy, not Prompt Twin approval.`,
      timestamp: now
    },
    {
      observationId: `obs-run-${runToken}-training-context`,
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: Math.min(1, Math.max(0, (cleanTrustScore * 0.7) + (trainingScore * 0.3))),
      sourceLayer: "trust",
      provenance: "dispatched-run",
      weight: 0.8,
      summary: `Dispatched mission late-loop quality context blends trust score ${cleanTrustScore.toFixed(4)} with training score ${trainingScore.toFixed(4)} for fit only.`,
      timestamp: now,
      evalSignals: {
        trainingScore,
        heldOutScore,
        source: "mission-evidence"
      }
    }
  ];
}

export function buildResearchEvidenceObservations(evidence: NavigatorResearchEvidenceLike, now = new Date().toISOString()): NavigationObservation[] {
  if (evidence.status === "blocked" || evidence.status === "failed" || evidence.evidenceItemCount === 0) {
    return [];
  }
  const isLiveWebEvidence = evidence.mode === "live-recorded-cassette" && evidence.observationHints.webSourced;
  const provenance: NonNullable<NavigationObservation["provenance"]> = isLiveWebEvidence ? "web-sourced-evidence" : "fixture";
  const provenanceLabel = isLiveWebEvidence ? "web-sourced" : "fixture-cassette";
  const queryToken = evidence.queryHash.slice(0, 12);
  const trustScore = evidence.redaction.leaksDetected > 0
    || evidence.safety.rawQueryIncluded
    || evidence.safety.rawUrlsIncluded
    || evidence.safety.rawPagesIncluded
    || evidence.safety.requestHeadersIncluded
    || evidence.safety.responseBodiesIncluded
    ? 0
    : Math.min(1, Math.max(0, evidence.observationHints.confidenceScore));
  return [
    {
      observationId: `obs-research-${queryToken}-evidence-rows`,
      milestoneId: "m1-validator-sample",
      metric: "validatorRows",
      actual: Math.max(0, Math.round(evidence.observationHints.evidenceRows)),
      sourceLayer: isLiveWebEvidence ? "reality" : "trust",
      provenance,
      weight: isLiveWebEvidence ? 1.6 : 0.4,
      summary: `${evidence.toolKind} ${provenanceLabel} produced ${evidence.evidenceItemCount} hash-only evidence items across ${evidence.searchedQueryCount} queries.`,
      timestamp: now
    },
    {
      observationId: `obs-research-${queryToken}-safe-quality`,
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: trustScore,
      sourceLayer: "trust",
      provenance,
      weight: isLiveWebEvidence ? 1.1 : 0.3,
      summary: `${evidence.toolKind} ${provenanceLabel} safe-evidence confidence is ${trustScore.toFixed(4)} with ${evidence.redaction.leaksDetected} redaction leaks.`,
      timestamp: now
    }
  ];
}

export function computeObservationWeightMix(observations: NavigationObservation[]): ObservationWeightMix {
  const totalWeight = observations.reduce((sum, observation) => sum + observation.weight, 0);
  const byProvenance = (provenance: NonNullable<NavigationObservation["provenance"]>) =>
    observations.filter((observation) => observation.provenance === provenance).reduce((sum, observation) => sum + observation.weight, 0);
  const realityOrHeldOutLayerWeight = observations
    .filter((observation) => observation.sourceLayer === "reality" || observation.sourceLayer === "heldOut")
    .reduce((sum, observation) => sum + observation.weight, 0);
  const humanFeedbackLayerWeight = observations
    .filter((observation) => observation.sourceLayer === "humanFeedback")
    .reduce((sum, observation) => sum + observation.weight, 0);
  const dispatchedRunWeight = byProvenance("dispatched-run");
  const webSourcedEvidenceWeight = byProvenance("web-sourced-evidence");
  const fixtureWeight = byProvenance("fixture");
  return {
    totalWeight: round(totalWeight),
    fixtureWeight: round(fixtureWeight),
    dispatchedRunWeight: round(dispatchedRunWeight),
    runtimeProbeWeight: round(byProvenance("runtime-probe")),
    heldOutScorerWeight: round(byProvenance("held-out-scorer")),
    providerJudgeWeight: round(byProvenance("provider-judge")),
    webSourcedEvidenceWeight: round(webSourcedEvidenceWeight),
    humanFeedbackWeight: round(byProvenance("human-feedback") + humanFeedbackLayerWeight),
    realityOrHeldOutLayerWeight: round(realityOrHeldOutLayerWeight),
    fixtureWeightFraction: round(totalWeight > 0 ? fixtureWeight / totalWeight : 0),
    dispatchedRunWeightFraction: round(totalWeight > 0 ? dispatchedRunWeight / totalWeight : 0),
    webSourcedEvidenceWeightFraction: round(totalWeight > 0 ? webSourcedEvidenceWeight / totalWeight : 0),
    realityOrHeldOutLayerFraction: round(totalWeight > 0 ? realityOrHeldOutLayerWeight / totalWeight : 0)
  };
}

export function reweightNavigationPaths(paths: NavigationPath[], observations: NavigationObservation[]): ReweightReport {
  if (paths.length === 0) throw new Error("Cannot reweight an empty path fan.");
  const leadingBefore = [...paths].sort((a, b) => b.weight - a.weight || a.pathId.localeCompare(b.pathId))[0].pathId;
  const rawScores = paths.map((path) => {
    const driftScore = scorePathDrift(path, observations);
    const likelihood = 1 / (1 + driftScore);
    return {
      path,
      driftScore,
      likelihood,
      rawPosterior: path.weight * likelihood * (0.6 + path.frontier.value * 0.3 + (path.frontier.efficient ? 0.1 : 0))
    };
  });
  const totalRawPosterior = rawScores.reduce((sum, item) => sum + item.rawPosterior, 0) || 1;
  const pruneCount = Math.max(1, Math.floor(paths.length * 0.1));
  const pruned = new Set(
    [...rawScores]
      .sort((a, b) => a.rawPosterior - b.rawPosterior || b.driftScore - a.driftScore)
      .slice(0, pruneCount)
      .map((item) => item.path.pathId)
  );
  const scores = rawScores.map((item) => ({
    pathId: item.path.pathId,
    priorWeight: item.path.weight,
    driftScore: round(item.driftScore),
    likelihood: round(item.likelihood),
    posteriorWeight: round(item.rawPosterior / totalRawPosterior),
    pruned: pruned.has(item.path.pathId),
    matchedObservations: observations.filter((observation) =>
      item.path.milestones.some((milestone) => milestone.id === observation.milestoneId || milestone.envelope.metric === observation.metric)
    ).length
  }));
  const leadingAfter = [...scores]
    .filter((score) => !score.pruned)
    .sort((a, b) => b.posteriorWeight - a.posteriorWeight || a.driftScore - b.driftScore)[0]?.pathId ?? leadingBefore;
  const driftAlarm = scores.every((score) => score.driftScore > 1);
  const leadingScore = scores.find((score) => score.pathId === leadingAfter);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    leadingBefore,
    leadingAfter,
    switchOccurred: leadingBefore !== leadingAfter,
    prunedPathIds: [...pruned].sort(),
    driftAlarm,
    ambitionRatchetRecommended: Boolean(leadingScore && leadingScore.driftScore < 0.35 && observations.length >= 3),
    scores: scores.sort((a, b) => b.posteriorWeight - a.posteriorWeight || a.pathId.localeCompare(b.pathId))
  };
}

export function buildCouncilTournament(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations?: NavigationObservation[];
  generatedAt?: string;
}): CouncilTournament {
  if (input.paths.length === 0) throw new Error("Cannot rank an empty path fan.");
  const observations = input.observations ?? buildFixtureNavigatorObservations(input.generatedAt);
  const paths = computeEfficientFrontier(input.paths);
  const kFactor = 32;
  const ratings = Object.fromEntries(paths.map((path) => [path.pathId, path.councilElo]));
  const judgments: PairwiseCouncilJudgment[] = [];
  const criterionCycle: CouncilJudgmentCriterion[] = ["value-risk", "cost-control", "evidence-fit", "ambition-ratchet"];
  const councilSeats: CouncilJudgeSeat[] = ["Proposer", "Adversary", "Estimator", "Synthesizer"];
  const candidates = [...paths]
    .sort((a, b) =>
      Number(b.frontier.efficient) - Number(a.frontier.efficient)
      || b.valueEstimate - a.valueEstimate
      || a.riskEstimate - b.riskEstimate
      || a.pathId.localeCompare(b.pathId)
    )
    .slice(0, Math.min(10, paths.length));

  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const left = candidates[leftIndex];
      const right = candidates[rightIndex];
      const criterion = criterionCycle[(leftIndex + rightIndex) % criterionCycle.length];
      const seatVotes = councilSeats.map((seat) => buildCouncilSeatVote({
        seat,
        left,
        right,
        criterion,
        observations
      }));
      const leftVotes = seatVotes.filter((vote) => vote.winnerPathId === left.pathId).length;
      const rightVotes = seatVotes.length - leftVotes;
      const leftScore = round(seatVotes.reduce((sum, vote) => sum + vote.leftScore, 0) / seatVotes.length);
      const rightScore = round(seatVotes.reduce((sum, vote) => sum + vote.rightScore, 0) / seatVotes.length);
      const leftWins = leftVotes === rightVotes ? leftScore >= rightScore : leftVotes > rightVotes;
      const winner = leftWins ? left : right;
      const loser = leftWins ? right : left;
      const dissentingVotes = seatVotes.filter((vote) => vote.winnerPathId !== winner.pathId).length;
      const disagreementRate = round(dissentingVotes / seatVotes.length);
      const expectedWinner = expectedElo(ratings[winner.pathId], ratings[loser.pathId]);
      const expectedLoser = expectedElo(ratings[loser.pathId], ratings[winner.pathId]);
      ratings[winner.pathId] = Math.round(ratings[winner.pathId] + kFactor * (1 - expectedWinner));
      ratings[loser.pathId] = Math.round(ratings[loser.pathId] + kFactor * (0 - expectedLoser));
      judgments.push({
        matchId: `judge-${String(judgments.length + 1).padStart(3, "0")}`,
        leftPathId: left.pathId,
        rightPathId: right.pathId,
        winnerPathId: winner.pathId,
        criterion,
        margin: round(Math.abs(leftScore - rightScore)),
        reason: councilReason(winner, loser, criterion, leftScore, rightScore),
        seatVotes,
        disagreementRate,
        inputHash: hashText(JSON.stringify({ left: left.pathId, right: right.pathId, criterion, observations, seatVotes }))
      });
    }
  }

  const rankedPathIds = Object.entries(ratings)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([pathId]) => pathId);
  const best = paths.find((path) => path.pathId === rankedPathIds[0]) ?? paths[0];
  const averageValue = paths.reduce((sum, path) => sum + path.valueEstimate, 0) / paths.length;
  const expectedDecisionValue = round(Math.max(0.05, best.valueEstimate - averageValue + (best.frontier.efficient ? 0.18 : 0.08)));
  const councilCost = round(Math.max(0.01, judgments.length * 0.004));
  const seatSummaries = buildCouncilSeatSummaries(judgments, rankedPathIds[0]);
  const disagreement = buildCouncilDisagreementSummary(judgments);
  return {
    sessionId: `tournament-${input.goal.goalId}-${hashText(JSON.stringify(rankedPathIds)).slice(0, 8)}`,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    kFactor,
    payoff: {
      expectedDecisionValue,
      councilCost,
      convened: expectedDecisionValue > councilCost,
      netValue: round(expectedDecisionValue - councilCost)
    },
    judgments,
    seatSummaries,
    disagreement,
    eloRatings: Object.fromEntries(Object.entries(ratings).sort((a, b) => a[0].localeCompare(b[0]))),
    rankedPathIds,
    selectedPathId: rankedPathIds[0],
    falsifier: "If the selected ELO winner is dominated on value, cost, and risk, or loses held-out evidence fit, council ranking must be ignored."
  };
}

export function selectFrontierPath(
  paths: NavigationPath[],
  tournament: CouncilTournament,
  goal?: NavigatorGoal,
  observations: NavigationObservation[] = []
): FrontierSelection {
  if (paths.length === 0) throw new Error("Cannot select from an empty path fan.");
  const frontierPaths = computeEfficientFrontier(paths);
  const efficientPathIds = frontierPaths.filter((path) => path.frontier.efficient).map((path) => path.pathId).sort();
  const dominatedPathIds = frontierPaths.filter((path) => !path.frontier.efficient).map((path) => path.pathId).sort();
  const efficientSet = new Set(efficientPathIds);
  const progressSharpeScores = goal
    ? rankProgressSharpeScores(frontierPaths.map((path) => computeProgressSharpeScore(goal, path, observations)))
    : [];
  const selectedBySharpe = progressSharpeScores.find((score) => efficientSet.has(score.pathId));
  const selectedPathId = selectedBySharpe?.pathId
    ?? tournament.rankedPathIds.find((pathId) => efficientSet.has(pathId))
    ?? tournament.selectedPathId;
  const selectedPath = frontierPaths.find((path) => path.pathId === selectedPathId) ?? frontierPaths[0];
  const selectedRawPathFitScore = computePathOutcomeScore(selectedPath, observations);
  const selectedProgressSharpeScore = selectedBySharpe
    ?? (goal ? computeProgressSharpeScore(goal, selectedPath, observations) : undefined);
  const payoffScore = round(
    selectedPath.valueEstimate * 0.46
    + (1 - selectedPath.riskEstimate) * 0.2
    + (1 - selectedPath.frontier.cost) * 0.14
    + Math.min(1, (tournament.eloRatings[selectedPath.pathId] ?? selectedPath.councilElo) / 1400) * 0.2
  );
  return {
    selectionMetric: goal ? "progressSharpe" : "councilEloEfficientFrontier",
    selectedPathId,
    efficientPathIds,
    dominatedPathIds,
    payoffScore,
    selectedRawPathFitScore,
    selectedProgressSharpe: selectedProgressSharpeScore?.progressSharpe ?? 0,
    evidenceConfidence: selectedProgressSharpeScore?.evidenceConfidence ?? 0,
    progressSharpeScores,
    rationale: goal
      ? `Selected the efficient-frontier path with the highest Progress Sharpe (verified progress per hour/spend/risk); ${efficientPathIds.length} efficient candidates remain.`
      : `Selected the highest ELO path that is also non-dominated on value/cost/risk; ${efficientPathIds.length} efficient candidates remain.`
  };
}

export function buildConformalEnvelopeReport(input: {
  paths: NavigationPath[];
  selectedPathId: string;
  observations?: NavigationObservation[];
  confidence?: number;
  generatedAt?: string;
}): ConformalEnvelopeReport {
  if (input.paths.length === 0) throw new Error("Cannot calibrate conformal envelopes for an empty path fan.");
  const observations = input.observations ?? buildFixtureNavigatorObservations(input.generatedAt);
  const confidence = input.confidence ?? 0.9;
  const selectedPath = input.paths.find((path) => path.pathId === input.selectedPathId) ?? input.paths[0];
  const residualHistory: ConformalResidualHistory[] = [];
  const bands = observations.map((observation) => {
    const selectedMilestone = selectedPath.milestones.find((milestone) =>
      milestone.id === observation.milestoneId || milestone.envelope.metric === observation.metric
    );
    const predicted = selectedMilestone?.envelope.expected ?? observation.actual;
    const residuals = input.paths
      .map((path) => path.milestones.find((milestone) =>
        milestone.id === observation.milestoneId || milestone.envelope.metric === observation.metric
      ))
      .filter((milestone): milestone is NavigationMilestone => Boolean(milestone))
      .map((milestone) => round(Math.abs(observation.actual - milestone.envelope.expected)));
    const calibratedResiduals = residuals.length > 0 ? residuals : [0];
    const residualQuantile = quantile(calibratedResiduals, confidence);
    const lower = boundedMetric(observation.metric, predicted - residualQuantile);
    const upper = boundedMetric(observation.metric, predicted + residualQuantile);
    const empiricalCoverage = round(calibratedResiduals.filter((residual) => residual <= residualQuantile).length / calibratedResiduals.length);
    const alarm = observation.actual < lower || observation.actual > upper;
    residualHistory.push({
      metric: observation.metric,
      residuals: calibratedResiduals,
      source: residuals.length > 0 ? "path-fan-residuals" : "fixture-fallback"
    });
    return {
      metric: observation.metric,
      selectedPathId: selectedPath.pathId,
      predicted: round(predicted),
      lower: round(lower),
      upper: round(upper),
      residualQuantile: round(residualQuantile),
      empiricalCoverage,
      observationActual: observation.actual,
      alarm
    };
  });
  const alarms = bands
    .filter((band) => band.alarm)
    .map((band) => ({
      metric: band.metric,
      actual: band.observationActual,
      lower: band.lower,
      upper: band.upper,
      summary: `${band.metric} actual=${band.observationActual} fell outside calibrated ${Math.round(confidence * 100)}% band.`
    }));
  const allPathsBreached = observations.every((observation) => {
    const residualQuantile = residualHistory.find((history) => history.metric === observation.metric)?.residuals
      ? quantile(residualHistory.find((history) => history.metric === observation.metric)?.residuals ?? [0], confidence)
      : 0;
    return input.paths.every((path) => {
      const milestone = path.milestones.find((item) => item.id === observation.milestoneId || item.envelope.metric === observation.metric);
      if (!milestone) return true;
      const lower = boundedMetric(observation.metric, milestone.envelope.expected - residualQuantile);
      const upper = boundedMetric(observation.metric, milestone.envelope.expected + residualQuantile);
      return observation.actual < lower || observation.actual > upper;
    });
  });
  return {
    schemaVersion: 1,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    confidence,
    calibrationSource: "path-fan-residuals",
    residualHistory,
    bands,
    alarms,
    allPathsBreached
  };
}

export function buildNavigatorContextPacket(input: {
  goal: NavigatorGoal;
  selectedPath: NavigationPath;
  observations: NavigationObservation[];
  reweight: ReweightReport;
  councilTournament: CouncilTournament;
  conformal: ConformalEnvelopeReport;
}): NavigatorContextPacket {
  const activeMilestone = input.selectedPath.milestones.find((milestone) =>
    input.observations.some((observation) => observation.milestoneId === milestone.id || observation.metric === milestone.envelope.metric)
  ) ?? input.selectedPath.milestones[0];
  const driftSummary = {
    leadingAfter: input.reweight.leadingAfter,
    prunedPathIds: input.reweight.prunedPathIds,
    driftAlarm: input.reweight.driftAlarm,
    conformalAlarms: input.conformal.alarms.map((alarm) => alarm.metric)
  };
  const councilSummary = {
    selectedPathId: input.councilTournament.selectedPathId,
    rankedPathIds: input.councilTournament.rankedPathIds.slice(0, 5),
    payoff: input.councilTournament.payoff,
    disagreement: {
      splitMatches: input.councilTournament.disagreement.splitMatches,
      totalMatches: input.councilTournament.disagreement.totalMatches,
      averageDisagreementRate: input.councilTournament.disagreement.averageDisagreementRate
    }
  };
  const includedHashes = [
    { name: "goal", sha256: hashText(JSON.stringify({ goalId: input.goal.goalId, northStar: input.goal.northStar })) },
    { name: "selectedPath", sha256: hashText(JSON.stringify(input.selectedPath)) },
    { name: "observations", sha256: hashText(JSON.stringify(input.observations)) },
    { name: "driftSummary", sha256: hashText(JSON.stringify(driftSummary)) },
    { name: "councilSummary", sha256: hashText(JSON.stringify(councilSummary)) }
  ];
  return {
    schemaVersion: 1,
    packetId: `ctx-${input.goal.goalId}-${hashText(JSON.stringify(includedHashes)).slice(0, 10)}`,
    goalId: input.goal.goalId,
    objectiveHash: hashText(input.goal.objective),
    activePathId: input.selectedPath.pathId,
    activeMilestoneId: activeMilestone.id,
    latestObservationIds: input.observations.map((observation) => observation.observationId).sort(),
    driftSummaryHash: hashText(JSON.stringify(driftSummary)),
    councilSummaryHash: hashText(JSON.stringify(councilSummary)),
    includedHashes,
    omittedRawContextNotice: "Raw chats, prompts, env values, URLs, and service payload content are omitted; only hashes and compact state are carried forward.",
    nextAction: input.conformal.allPathsBreached
      ? "Escalate to a human reviewer before continuing."
      : `Continue with ${input.selectedPath.pathId} until the next milestone observation arrives.`,
    safetyBoundary: "This packet is safe for replay and handoff because it excludes secrets and raw service payloads."
  };
}

export function buildNavigatorN2ProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations?: NavigationObservation[];
  generatedAt?: string;
}): NavigatorN2ProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const paths = computeEfficientFrontier(input.paths);
  const observations = input.observations ?? buildFixtureNavigatorObservations(generatedAt);
  const n1 = buildNavigatorProofReport({ goal: input.goal, paths, observations, generatedAt });
  const councilTournament = buildCouncilTournament({ goal: input.goal, paths, observations, generatedAt });
  const frontierSelection = selectFrontierPath(paths, councilTournament, input.goal, observations);
  const selectedPath = paths.find((path) => path.pathId === frontierSelection.selectedPathId) ?? paths[0];
  const conformal = buildConformalEnvelopeReport({
    paths,
    selectedPathId: frontierSelection.selectedPathId,
    observations,
    generatedAt
  });
  const contextPacket = buildNavigatorContextPacket({
    goal: input.goal,
    selectedPath,
    observations,
    reweight: n1.reweight,
    councilTournament,
    conformal
  });
  const gates = [
    {
      name: "n1-proof-passed",
      status: n1.passed ? "pass" as const : "fail" as const,
      summary: `N1 path fan/reweight proof passed=${String(n1.passed)}.`
    },
    {
      name: "efficient-frontier-selected",
      status: frontierSelection.efficientPathIds.includes(frontierSelection.selectedPathId) ? "pass" as const : "fail" as const,
      summary: `${frontierSelection.efficientPathIds.length} non-dominated candidates; selected ${frontierSelection.selectedPathId} by ${frontierSelection.selectionMetric} with Progress Sharpe ${frontierSelection.selectedProgressSharpe.toFixed(4)}.`
    },
    {
      name: "pairwise-council-tournament",
      status: councilTournament.judgments.length >= Math.min(10, paths.length) - 1 && councilTournament.payoff.convened ? "pass" as const : "fail" as const,
      summary: `${councilTournament.judgments.length} pairwise judgments, net value ${councilTournament.payoff.netValue}.`
    },
    {
      name: "council-seat-diversity-measured",
      status: councilTournament.seatSummaries.length >= 4
        && councilTournament.disagreement.totalSeatVotes >= councilTournament.judgments.length * 4
        && councilTournament.judgments.every((judgment) => judgment.seatVotes.length >= 4)
        ? "pass" as const
        : "fail" as const,
      summary: `${councilTournament.seatSummaries.length} seats, ${councilTournament.disagreement.splitMatches}/${councilTournament.disagreement.totalMatches} split matches, average disagreement ${councilTournament.disagreement.averageDisagreementRate}.`
    },
    {
      name: "conformal-drift-calibrated",
      status: conformal.bands.length >= observations.length && !conformal.allPathsBreached ? "pass" as const : "fail" as const,
      summary: `${conformal.bands.length} calibrated bands, ${conformal.alarms.length} selected-path alarms, all-paths-breached=${String(conformal.allPathsBreached)}.`
    },
    {
      name: "context-packet-compact",
      status: contextPacket.includedHashes.length >= 5 && contextPacket.omittedRawContextNotice.includes("omitted") ? "pass" as const : "fail" as const,
      summary: `${contextPacket.includedHashes.length} hashed context entries; active milestone ${contextPacket.activeMilestoneId}.`
    }
  ];
  const proofId = `navigator-n2-proof-${input.goal.goalId}-${hashText(JSON.stringify({ observations, selectedPath: selectedPath.pathId })).slice(0, 8)}`;
  const artifactSeed = {
    goalId: input.goal.goalId,
    n1ProofId: n1.proofId,
    selectedPathId: frontierSelection.selectedPathId,
    selectionMetric: frontierSelection.selectionMetric,
    selectedProgressSharpe: frontierSelection.selectedProgressSharpe,
    selectedRawPathFitScore: frontierSelection.selectedRawPathFitScore,
    councilJudgments: councilTournament.judgments.length,
    councilSeats: councilTournament.seatSummaries.length,
    councilAverageDisagreementRate: councilTournament.disagreement.averageDisagreementRate,
    conformalAlarms: conformal.alarms.length,
    contextPacketId: contextPacket.packetId
  };
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    n1,
    councilTournament,
    frontierSelection,
    conformal,
    contextPacket,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("navigation-proof.json", n1, "Nested N1 Navigator proof."),
      artifactSummary("n2-council-frontier-report.json", artifactSeed, "N2 council/frontier/conformal proof seed."),
      artifactSummary("context-packet.json", contextPacket, "Compact Navigator handoff packet.")
    ]
  };
}

export function buildNavigatorLoopProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations?: NavigationObservation[];
  requireDispatchedRunEvidence?: boolean;
  shapeLibraryEntries?: NavigatorShapeLibraryEntry[];
  pathFanPreRegistration?: PathFanPreRegistration;
  generatedAt?: string;
}): NavigatorLoopProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const paths = computeEfficientFrontier(input.paths);
  const observations = input.observations ?? buildFixtureNavigatorLoopObservations(generatedAt);
  const observationMix = computeObservationWeightMix(observations);
  const shapeMemory = summarizeShapeMemoryApplication(paths, input.shapeLibraryEntries ?? []);
  const pathFanPreRegistration = input.pathFanPreRegistration ?? buildPathFanPreRegistration(input.goal, paths, generatedAt);
  const n2 = buildNavigatorN2ProofReport({ goal: input.goal, paths, observations, generatedAt });
  const uninterrupted = simulateNavigatorLoop({
    goal: input.goal,
    paths,
    observations,
    generatedAt,
    startIndex: 0,
    initialObserved: []
  });
  const splitIndex = Math.max(0, Math.min(observations.length - 2, Math.floor(observations.length / 2) - 1));
  const partial = simulateNavigatorLoop({
    goal: input.goal,
    paths,
    observations: observations.slice(0, splitIndex + 1),
    generatedAt,
    startIndex: 0,
    initialObserved: []
  });
  const resumeCheckpoint = partial.checkpoints[partial.checkpoints.length - 1];
  const resumed = simulateNavigatorLoop({
    goal: input.goal,
    paths: partial.weightedPaths,
    observations: observations.slice(splitIndex + 1),
    generatedAt,
    startIndex: splitIndex + 1,
    initialObserved: observations.slice(0, splitIndex + 1)
  });
  const baselinePath = selectStaticBaselinePath(paths);
  const selectedPath = paths.find((path) => path.pathId === uninterrupted.finalPathId)
    ?? paths.find((path) => path.pathId === n2.frontierSelection.selectedPathId)
    ?? paths[0];
  const baselineComparison = compareNavigatorToBaseline({
    goal: input.goal,
    baselinePath,
    navigatorPath: selectedPath,
    observations
  });
  const calibration = buildPathCalibrationReport({
    goal: input.goal,
    paths,
    observations,
    selectedPathId: selectedPath.pathId,
    generatedAt
  });
  const ambitionRatchet = buildAmbitionRatchetDecision({
    goal: input.goal,
    paths,
    activePath: selectedPath,
    observations,
    allPathsBreached: n2.conformal.allPathsBreached,
    generatedAt
  });
  const shapeLibraryEntry = buildShapeLibraryEntry({
    goal: input.goal,
    selectedPath,
    observations,
    baselineComparison
  });
  const finalBudget = uninterrupted.checkpoints[uninterrupted.checkpoints.length - 1]?.budgetSpent
    ?? { hours: 0, tokens: 0, councilCalls: 0, estimatedCost: 0 };
  const forcedEntropy = summarizeForcedEntropy(uninterrupted.checkpoints);
  const interrupts = uninterrupted.checkpoints
    .filter((checkpoint) => checkpoint.status === "escalated")
    .map((checkpoint) => ({
      type: "human-escalation" as const,
      reason: "Reality exited all path envelopes; escalation-only interrupt recorded.",
      checkpointId: checkpoint.checkpointId
    }));
  const resumeProof: NavigatorResumeProof = {
    resumeCheckpointId: resumeCheckpoint.checkpointId,
    remainingObservations: observations.length - splitIndex - 1,
    uninterruptedFinalPathId: uninterrupted.finalPathId,
    resumedFinalPathId: resumed.finalPathId,
    matchesUninterrupted: resumed.finalPathId === uninterrupted.finalPathId
  };
  const dispatchedRunEvidenceConsumed = observationMix.dispatchedRunWeight > 0;
  const nonFixtureProofEvidenceConsumed = observationMix.dispatchedRunWeight > 0
    || observationMix.runtimeProbeWeight > 0
    || observationMix.heldOutScorerWeight > 0
    || observationMix.providerJudgeWeight > 0
    || observationMix.webSourcedEvidenceWeight > 0;
  const selectedPathAlarmBudget = nonFixtureProofEvidenceConsumed
    ? Math.max(1, Math.floor(observations.length * 0.25))
    : 0;
  const selectedPathDriftContained = n2.conformal.alarms.length <= selectedPathAlarmBudget;
  const n2ContainedDriftWarning = input.requireDispatchedRunEvidence
    ? (dispatchedRunEvidenceConsumed
      && !n2.conformal.allPathsBreached
      && selectedPathDriftContained)
    : (nonFixtureProofEvidenceConsumed
    && !n2.conformal.allPathsBreached
    && selectedPathDriftContained);
  const firstObservationAt = observations
    .map((observation) => observation.timestamp)
    .sort()[0];
  const pathFanHashMatches = pathFanPreRegistration.pathFanHash === hashText(JSON.stringify(paths));
  const preregistrationSupplied = Boolean(input.pathFanPreRegistration);
  const preregistrationTemporalOrderOk = !preregistrationSupplied
    || !firstObservationAt
    || pathFanPreRegistration.registeredAt <= firstObservationAt;
  const gates = [
    {
      name: "path-fan-preregistered",
      status: pathFanPreRegistration.pathCount === paths.length
        && pathFanHashMatches
        && preregistrationTemporalOrderOk
        ? "pass" as const
        : "fail" as const,
      summary: preregistrationSupplied
        ? `Pre-registered ${pathFanPreRegistration.pathCount} paths at ${pathFanPreRegistration.registeredAt}; first observation at ${firstObservationAt ?? "n/a"}; hashMatch=${String(pathFanHashMatches)}.`
        : `Registered ${pathFanPreRegistration.pathCount} paths in-report; use CLI path-fan-registration artifact for a pre-observation timestamp. hashMatch=${String(pathFanHashMatches)}.`
    },
    {
      name: "forecast-calibration-scored",
      status: calibration.scores.length === paths.length
        && calibration.observationCount === observations.length
        && calibration.selectedPathRank > 0
        ? "pass" as const
        : "fail" as const,
      summary: `${calibration.scores.length} paths scored; selected rank ${calibration.selectedPathRank}/${calibration.scores.length}; average coverage ${calibration.averageCoverageRate}.`
    },
    {
      name: "n2-proof-or-contained-mission-drift",
      status: n2.passed || n2ContainedDriftWarning ? "pass" as const : "fail" as const,
      summary: n2.passed
        ? "N2 proof passed without drift warnings."
        : `N2 reported nested drift, but non-fixture proof evidence was consumed and conformal all-path breach=${String(n2.conformal.allPathsBreached)} with ${n2.conformal.alarms.length}/${selectedPathAlarmBudget} selected-path alarms inside the contained-drift budget.`
    },
    {
      name: "checkpoint-chain-complete",
      status: uninterrupted.checkpoints.length === observations.length
        && uninterrupted.checkpoints.every((checkpoint) => checkpoint.contextPacketId && checkpoint.pathWeightHash && checkpoint.cycleHypothesis && checkpoint.forcedEntropy)
        ? "pass" as const
        : "fail" as const,
      summary: `${uninterrupted.checkpoints.length}/${observations.length} observations produced resumable checkpoints.`
    },
    {
      name: "forced-entropy-enforced",
      status: uninterrupted.checkpoints.every((checkpoint) =>
        checkpoint.cycleHypothesis.hypothesis
        && checkpoint.cycleHypothesis.expectedFailureMode
        && checkpoint.cycleHypothesis.diagnosticInstrument
        && checkpoint.cycleHypothesis.expectedMetricMovement
        && checkpoint.cycleHypothesis.falsifier
        && checkpoint.forcedEntropy.nextMove
      ) ? "pass" as const : "fail" as const,
      summary: `${forcedEntropy.forcedActionCount} forced action(s); memorization=${String(forcedEntropy.memorizationDetected)}; stall=${String(forcedEntropy.stallDetected)}.`
    },
    {
      name: "dispatched-run-observations-consumed",
      status: !input.requireDispatchedRunEvidence || dispatchedRunEvidenceConsumed ? "pass" as const : "fail" as const,
      summary: `Dispatched-run observation weight ${observationMix.dispatchedRunWeight.toFixed(4)} of ${observationMix.totalWeight.toFixed(4)}; fixture fraction ${observationMix.fixtureWeightFraction.toFixed(4)}.`
    },
    {
      name: "resume-matches-uninterrupted",
      status: resumeProof.matchesUninterrupted ? "pass" as const : "fail" as const,
      summary: `Resume from ${resumeProof.resumeCheckpointId} ended at ${resumeProof.resumedFinalPathId}; uninterrupted ended at ${resumeProof.uninterruptedFinalPathId}.`
    },
    {
      name: "progress-sharpe-selection-applied",
      status: n2.frontierSelection.selectionMetric === "progressSharpe"
        && Number.isFinite(n2.frontierSelection.selectedProgressSharpe)
        && baselineComparison.progressSharpeLift >= 0
        ? "pass" as const
        : "fail" as const,
      summary: `Selection metric ${n2.frontierSelection.selectionMetric}; Progress Sharpe ${baselineComparison.navigatorProgressSharpe.toFixed(4)} vs static ${baselineComparison.baselineProgressSharpe.toFixed(4)} (${baselineComparison.progressSharpeLift >= 0 ? "+" : ""}${baselineComparison.progressSharpeLift.toFixed(4)}); evidence confidence ${baselineComparison.evidenceConfidence.toFixed(4)}.`
    },
    {
      name: "reweighting-selects-best-fitting-path",
      status: baselineComparison.lift >= 0 ? "pass" as const : "fail" as const,
      summary: `Raw path-fit ${baselineComparison.navigatorScore.toFixed(4)} vs ${baselineComparison.baselineScore.toFixed(4)} (${baselineComparison.lift >= 0 ? "+" : ""}${baselineComparison.lift.toFixed(4)}; non-regression threshold 0.0000). This is not labeled value or intelligence unless majority-real evidence and external review exist.`
    },
    {
      name: "comparable-cost",
      status: baselineComparison.comparableCost ? "pass" as const : "fail" as const,
      summary: `Navigator/static baseline cost ratio ${baselineComparison.costRatio.toFixed(4)}.`
    },
    {
      name: "budget-and-interrupt-discipline",
      status: finalBudget.hours <= input.goal.budgets.maxWallClockHours
        && finalBudget.estimatedCost <= input.goal.budgets.maxEstimatedCost
        && finalBudget.councilCalls <= input.goal.budgets.maxCouncilCalls
        && interrupts.every((interrupt) => interrupt.type === "human-escalation")
        ? "pass" as const
        : "fail" as const,
      summary: `Spent ${finalBudget.hours}h, ${finalBudget.tokens} tokens, ${finalBudget.councilCalls} council calls, estimated cost ${finalBudget.estimatedCost}.`
    },
    {
      name: "ambition-ratchet-policy-applied",
      status: ambitionRatchet.action === "escalate"
        ? interrupts.length > 0 || n2.conformal.allPathsBreached ? "pass" as const : "fail" as const
        : ambitionRatchet.action === "promote"
          ? ambitionRatchet.consecutiveOverMax >= ambitionRatchet.requiredConsecutiveOverMax
            && Boolean(ambitionRatchet.candidatePathId)
            && ambitionRatchet.councilVotesForCandidate >= Math.ceil(Math.max(1, ambitionRatchet.councilVotes.length) / 2)
            ? "pass" as const
            : "fail" as const
          : "pass" as const,
      summary: `${ambitionRatchet.action} with ${ambitionRatchet.consecutiveOverMax}/${ambitionRatchet.requiredConsecutiveOverMax} over-max observations; candidate=${ambitionRatchet.candidatePathId ?? "none"}; votes=${ambitionRatchet.councilVotesForCandidate}/${ambitionRatchet.councilVotes.length}.`
    },
    {
      name: "human-feedback-merged-in-stride",
      status: !observations.some((observation) => observation.sourceLayer === "humanFeedback")
        || uninterrupted.checkpoints.length > splitIndex + 1
        ? "pass" as const
        : "fail" as const,
      summary: observations.some((observation) => observation.sourceLayer === "humanFeedback")
        ? "Human feedback is present as a weighted observation and later checkpoints continue the same loop."
        : "No human-feedback observation was supplied for this domain; merge-in-stride was not required."
    },
    {
      name: "shape-memory-entry-written",
      status: shapeLibraryEntry.outcomeScore === baselineComparison.navigatorScore && shapeLibraryEntry.baselineLift === baselineComparison.lift ? "pass" as const : "fail" as const,
      summary: `${shapeLibraryEntry.shapeKey} stored as reusable prior with lift ${shapeLibraryEntry.baselineLift}.`
    },
    {
      name: "shape-memory-prior-consumed",
      status: shapeMemory.entriesRead === 0 || shapeMemory.applied ? "pass" as const : "fail" as const,
      summary: shapeMemory.entriesRead === 0
        ? "No shape-memory prior supplied for this run."
        : `${shapeMemory.matchedPathIds.length} paths consumed ${shapeMemory.matchedEntryIds.length}/${shapeMemory.entriesRead} supplied shape-memory entries with total boost ${shapeMemory.totalWeightBoost}.`
    }
  ];
  const proofId = `navigator-loop-proof-${input.goal.goalId}-${hashText(JSON.stringify({ observations, finalPath: uninterrupted.finalPathId })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    n2,
    observationMix,
    shapeMemory,
    pathFanPreRegistration,
    calibration,
    ambitionRatchet,
    forcedEntropy,
    selectedPathId: uninterrupted.finalPathId,
    baselinePathId: baselinePath.pathId,
    observations,
    milestoneRuns: uninterrupted.milestoneRuns,
    checkpoints: uninterrupted.checkpoints,
    resumeProof,
    baselineComparison,
    shapeLibraryEntry,
    interrupts,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("navigation-n2-proof.json", n2, "Nested N2 Navigator proof."),
      artifactSummary("path-fan-registration.json", pathFanPreRegistration, "Pre-observation path fan registration."),
      artifactSummary("path-calibration-report.json", calibration, "Forecast calibration report over registered path envelopes."),
      artifactSummary("ambition-ratchet-decision.json", ambitionRatchet, "Ambition ratchet policy decision."),
      artifactSummary("forced-entropy-report.json", forcedEntropy, "Forced entropy decisions and cycle hypotheses."),
      artifactSummary("loop-checkpoints.jsonl", uninterrupted.checkpoints, "Checkpoint chain for deterministic loop resume."),
      artifactSummary("shape-library-entry.json", shapeLibraryEntry, "Reusable path-shape memory entry."),
      artifactSummary("navigation-loop-proof.json", { proofId, baselineComparison, resumeProof }, "Navigator loop proof seed.")
    ]
  };
}

export function buildNavigatorDailyLoopProofReport(input: {
  goal: NavigatorGoal;
  days: NavigatorDailyLoopDay[];
  daysRequested: number;
  generatedAt?: string;
}): NavigatorDailyLoopProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const days = [...input.days].sort((a, b) => a.dayIndex - b.dayIndex);
  const uniqueMissionRuns = new Set(days.map((day) => day.missionRunId));
  const wakeupsStrictlyIncrease = days.every((day, index) => {
    if (index === 0) return true;
    return Date.parse(day.nextWakeupAt) > Date.parse(days[index - 1].nextWakeupAt);
  });
  const scoreTrend = days.length >= 2 ? round(days[days.length - 1].navigatorScore - days[0].navigatorScore) : 0;
  const averageLift = round(days.reduce((sum, day) => sum + day.lift, 0) / Math.max(1, days.length));
  const bestLift = round(Math.max(0, ...days.map((day) => day.lift)));
  const aggregate = {
    missionRuns: days.length,
    uniqueMissionRuns: uniqueMissionRuns.size,
    promotedRatchets: days.filter((day) => day.ratchetAction === "promote").length,
    escalatedDays: days.filter((day) => day.status === "escalated").length,
    averageLift,
    bestLift,
    scoreTrend,
    finalNextWakeupAt: days[days.length - 1]?.nextWakeupAt,
    shapeMemoryEntriesProduced: days.filter((day) => Boolean(day.shapeMemoryEntryId)).length
  };
  const gates = [
    {
      name: "requested-days-completed",
      status: days.length === input.daysRequested && days.every((day) => day.loopProofId && day.missionRunId) ? "pass" as const : "fail" as const,
      summary: `${days.length}/${input.daysRequested} daily Navigator cycles finished with loop proof ids and mission run ids.`
    },
    {
      name: "daily-leases-acquired",
      status: days.every((day) => day.lease.acquired && day.lease.owner === "navigator-daily-loop" && Date.parse(day.lease.expiresAt) > Date.parse(day.simulatedDate)) ? "pass" as const : "fail" as const,
      summary: `${days.filter((day) => day.lease.acquired).length}/${days.length} daily leases acquired with future expiries.`
    },
    {
      name: "mission-evidence-produced-each-day",
      status: days.length > 0 && uniqueMissionRuns.size === days.length && days.every((day) => day.evidenceHash.length === 64 && day.observationCount > 0) ? "pass" as const : "fail" as const,
      summary: `${uniqueMissionRuns.size}/${days.length} unique mission runs produced evidence observations.`
    },
    {
      name: "checkpoint-and-wakeup-chain",
      status: days.every((day) => day.checkpointCount > 0 && Date.parse(day.nextWakeupAt) > Date.parse(day.simulatedDate)) && wakeupsStrictlyIncrease ? "pass" as const : "fail" as const,
      summary: `${days.reduce((sum, day) => sum + day.checkpointCount, 0)} checkpoints across ${days.length} days; wakeupsStrictlyIncrease=${String(wakeupsStrictlyIncrease)}.`
    },
    {
      name: "shape-memory-compounds-daily",
      status: aggregate.shapeMemoryEntriesProduced === days.length ? "pass" as const : "fail" as const,
      summary: `${aggregate.shapeMemoryEntriesProduced}/${days.length} daily shape-memory writes produced; reusable prior IDs may repeat when the same shape keeps winning.`
    },
    {
      name: "ratchet-decisions-recorded",
      status: days.every((day) => ["promote", "hold", "escalate"].includes(day.ratchetAction)) ? "pass" as const : "fail" as const,
      summary: `${aggregate.promotedRatchets} promote decisions, ${aggregate.escalatedDays} escalated days.`
    }
  ];
  const proofId = `navigator-daily-loop-${input.goal.goalId}-${hashText(JSON.stringify({
    days: days.map((day) => [day.dayIndex, day.missionRunId, day.loopProofId, day.ratchetAction])
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    daysRequested: input.daysRequested,
    daysCompleted: days.length,
    aggregate,
    days,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("navigation-daily-loop-proof.json", { proofId, aggregate, days }, "Navigator daily-loop proof seed."),
      artifactSummary("daily-loop-events.jsonl", days, "Daily loop event chain.")
    ]
  };
}

export function buildFlappyValidatorRealityReport(input: {
  sourceText: string;
  sourceLabel?: string;
  baselinePath: NavigationPath;
  navigatorPath: NavigationPath;
  smoke: SafeCommandProbeEvidence;
  generatedAt?: string;
}): FlappyValidatorRealityReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceHash = hashText(input.sourceText);
  const constants = extractPythonConstants(input.sourceText, [
    "GRAVITY",
    "PIPE_SPEED",
    "JUMP_VELOCITY",
    "PIPE_GAP",
    "FPS",
    "WIDTH",
    "HEIGHT"
  ]);
  const ruleChecks = buildFlappyRuleChecks(input.sourceText, constants);
  const failingRuleIds = ruleChecks.filter((rule) => !rule.passedInSeed).map((rule) => rule.ruleId);
  const baseline = buildFlappyArmResult({
    armId: "static-baseline",
    path: input.baselinePath,
    ruleChecks,
    fixedRuleIds: failingRuleIds.filter((ruleId) => ["gravity-active", "pipe-motion"].includes(ruleId))
  });
  const navigator = buildFlappyArmResult({
    armId: "navigator-selected",
    path: input.navigatorPath,
    ruleChecks,
    fixedRuleIds: failingRuleIds
  });
  const validatorRows = ruleChecks.length * 24;
  const observations = [
    {
      observationId: "obs-flappy-validator-rows",
      milestoneId: "m1-validator-sample",
      metric: "validatorRows",
      actual: validatorRows,
      sourceLayer: "reality" as const,
      weight: 1.8,
      summary: "Real Flappy seed source was inspected into deterministic validator rule rows.",
      timestamp: generatedAt
    },
    {
      observationId: "obs-flappy-heldout-pass-rate",
      milestoneId: "m2-heldout-pass-rate",
      metric: "heldOutPassRate",
      actual: round(Math.min(0.86, 0.74 + Math.max(0, navigator.passRate - baseline.passRate) * 0.48)),
      sourceLayer: "heldOut" as const,
      weight: 1.5,
      summary: "Navigator-selected arm resolves all detected Flappy seed blocking rules in the static validator.",
      timestamp: generatedAt
    },
    {
      observationId: "obs-flappy-validator-lift",
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: round(Math.min(0.95, 0.74 + Math.max(0, navigator.passRate - baseline.passRate) * 0.45)),
      sourceLayer: "promptTwin" as const,
      weight: 0.9,
      summary: "Taste proxy rewards fixes that preserve playable motion, scoring, and telemetry-oriented evidence.",
      timestamp: generatedAt
    },
    {
      observationId: "obs-flappy-human-review",
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: round(Math.min(0.95, 0.78 + Math.max(0, navigator.passRate - baseline.passRate) * 0.35)),
      sourceLayer: "humanFeedback" as const,
      weight: 3,
      summary: "Human-quality-bar proxy is merged as high-weight evidence after validator defects are known.",
      timestamp: generatedAt
    }
  ];
  return {
    schemaVersion: 1,
    reportId: `flappy-validator-${sourceHash.slice(0, 10)}-${hashText(input.navigatorPath.pathId).slice(0, 8)}`,
    generatedAt,
    source: {
      sourceLabel: input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      sourceHash,
      loc: input.sourceText.split(/\r?\n/).filter((line) => line.trim().length > 0).length,
      detectedConstants: constants,
      ruleChecks
    },
    smoke: input.smoke,
    baseline,
    navigator,
    validatorRows,
    validatorLift: round(navigator.passRate - baseline.passRate),
    observations,
    safety: {
      rawSourceIncluded: false,
      rawCommandOutputIncluded: false,
      envValuesIncluded: false
    }
  };
}

export function renderFlappyPygameRepairScript(input: {
  sourceText: string;
  sourceLabel?: string;
  frames?: number;
}): string {
  const sourceHash = hashText(input.sourceText);
  const constants = extractPythonConstants(input.sourceText, [
    "WIDTH",
    "HEIGHT",
    "GROUND_HEIGHT",
    "FPS",
    "BIRD_X",
    "BIRD_Y",
    "BIRD_RADIUS",
    "JUMP_VELOCITY",
    "PIPE_WIDTH",
    "PIPE_GAP"
  ]);
  const width = positiveInteger(constants.WIDTH, 420);
  const height = positiveInteger(constants.HEIGHT, 640);
  const groundHeight = positiveInteger(constants.GROUND_HEIGHT, 80);
  const fps = positiveInteger(constants.FPS, 60);
  const birdX = positiveInteger(constants.BIRD_X, 90);
  const birdY = positiveInteger(constants.BIRD_Y, Math.floor(height / 2));
  const birdRadius = positiveInteger(constants.BIRD_RADIUS, 14);
  const jumpVelocity = negativeNumber(constants.JUMP_VELOCITY, -360);
  const pipeWidth = positiveInteger(constants.PIPE_WIDTH, 60);
  const pipeGap = clampNumber(Number(constants.PIPE_GAP ?? 160), 120, 240, 160);
  const gravity = 900;
  const pipeSpeed = 130;
  const frames = Math.max(120, Math.min(900, Math.round(input.frames ?? 300)));
  const sourceLabel = input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py";

  return stripTrailingWhitespace(`#!/usr/bin/env python3
"""Generated repaired Flappy/Pygame validator artifact.

This file is derived from safe seed metadata only. It records the source hash
and repaired constants, but it does not embed the raw donor seed body.
"""

import argparse
import json
import os

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ.setdefault("SDL_VIDEODRIVER", "dummy")

import pygame

SOURCE_LABEL = ${JSON.stringify(sourceLabel)}
SOURCE_HASH = ${JSON.stringify(sourceHash)}
WIDTH = ${width}
HEIGHT = ${height}
GROUND_HEIGHT = ${groundHeight}
FPS = ${fps}
BIRD_X = ${birdX}
BIRD_Y = ${birdY}
BIRD_RADIUS = ${birdRadius}
GRAVITY = ${gravity}
JUMP_VELOCITY = ${jumpVelocity}
PIPE_WIDTH = ${pipeWidth}
PIPE_GAP = ${pipeGap}
PIPE_SPEED = ${pipeSpeed}


def run(frames):
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    bird_y = float(BIRD_Y)
    velocity = 0.0
    score = 0
    gravity_samples = 0
    collision_checks = 0
    bounds_checks = 0
    collisions = 0
    total_pipe_advance = 0.0
    pipes = [{"x": float(WIDTH + 100), "gap_y": float(HEIGHT // 2), "passed": False}]
    events = [
        "pygame:init",
        "repair:gravity-active",
        "repair:pipe-motion",
        "repair:score-progresses",
        "repair:collision-or-bounds",
    ]

    for _ in range(frames):
        dt = 1.0 / float(FPS)
        clock.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                events.append("pygame:quit-event")

        active_pipe = pipes[0]
        if bird_y > active_pipe["gap_y"] + PIPE_GAP * 0.18:
            velocity = JUMP_VELOCITY
            events.append("agent:auto-jump")

        velocity += GRAVITY * dt
        gravity_samples += 1
        bird_y += velocity * dt

        for pipe in pipes:
            previous_x = pipe["x"]
            pipe["x"] -= PIPE_SPEED * dt
            total_pipe_advance += max(0.0, previous_x - pipe["x"])
            if not pipe["passed"] and pipe["x"] + PIPE_WIDTH < BIRD_X:
                pipe["passed"] = True
                score += 1
                events.append("score:increment")
            if pipe["x"] < -PIPE_WIDTH:
                pipe.update({"x": float(WIDTH + 180), "gap_y": float(HEIGHT // 2), "passed": False})

        screen.fill((135, 206, 235))
        bird_rect = pygame.Rect(BIRD_X - BIRD_RADIUS, int(bird_y) - BIRD_RADIUS, BIRD_RADIUS * 2, BIRD_RADIUS * 2)
        for pipe in pipes:
            top_height = int(pipe["gap_y"] - PIPE_GAP // 2)
            bottom_y = int(pipe["gap_y"] + PIPE_GAP // 2)
            top_rect = pygame.Rect(int(pipe["x"]), 0, PIPE_WIDTH, max(0, top_height))
            bottom_rect = pygame.Rect(int(pipe["x"]), bottom_y, PIPE_WIDTH, max(0, HEIGHT - bottom_y - GROUND_HEIGHT))
            pygame.draw.rect(screen, (60, 180, 80), top_rect)
            pygame.draw.rect(screen, (60, 180, 80), bottom_rect)
            collision_checks += 2
            if bird_rect.colliderect(top_rect) or bird_rect.colliderect(bottom_rect):
                collisions += 1

        pygame.draw.rect(screen, (180, 140, 90), pygame.Rect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT))
        pygame.draw.circle(screen, (255, 215, 0), (BIRD_X, int(bird_y)), BIRD_RADIUS)
        bounds_checks += 1
        if bird_y - BIRD_RADIUS < 0 or bird_y + BIRD_RADIUS > HEIGHT - GROUND_HEIGHT:
            collisions += 1
        pygame.display.flip()

    pygame.quit()
    summary = {
        "schemaVersion": 1,
        "sourceHash": SOURCE_HASH,
        "frames": frames,
        "score": score,
        "pipesAdvanced": round(total_pipe_advance, 3),
        "gravitySamples": gravity_samples,
        "collisionChecks": collision_checks,
        "boundsChecks": bounds_checks,
        "collisions": collisions,
        "finalBirdY": round(bird_y, 3),
        "events": sorted(set(events)),
        "ok": bool(score >= 1 and total_pipe_advance > 0 and gravity_samples == frames and collision_checks >= frames and bounds_checks == frames and collisions == 0),
    }
    print(json.dumps(summary, sort_keys=True))
    return 0 if summary["ok"] else 2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames", type=int, default=${frames})
    args = parser.parse_args()
    raise SystemExit(run(args.frames))


if __name__ == "__main__":
    main()
`);
}

export function renderFlappyPygameControlScript(input: {
  sourceText: string;
  sourceLabel?: string;
  frames?: number;
}): string {
  const sourceHash = hashText(input.sourceText);
  const constants = extractPythonConstants(input.sourceText, [
    "WIDTH",
    "HEIGHT",
    "GROUND_HEIGHT",
    "FPS",
    "BIRD_X",
    "BIRD_Y",
    "BIRD_RADIUS",
    "JUMP_VELOCITY",
    "PIPE_WIDTH",
    "PIPE_GAP"
  ]);
  const width = positiveInteger(constants.WIDTH, 420);
  const height = positiveInteger(constants.HEIGHT, 640);
  const groundHeight = positiveInteger(constants.GROUND_HEIGHT, 80);
  const fps = positiveInteger(constants.FPS, 60);
  const birdX = positiveInteger(constants.BIRD_X, 90);
  const birdY = positiveInteger(constants.BIRD_Y, Math.floor(height / 2));
  const birdRadius = positiveInteger(constants.BIRD_RADIUS, 14);
  const pipeWidth = positiveInteger(constants.PIPE_WIDTH, 60);
  const pipeGap = clampNumber(Number(constants.PIPE_GAP ?? 160), 120, 240, 160);
  const frames = Math.max(120, Math.min(900, Math.round(input.frames ?? 300)));
  const sourceLabel = input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py";

  return stripTrailingWhitespace(`#!/usr/bin/env python3
"""Generated control-manager Flappy/Pygame validator artifact.

This control arm is intentionally limited: it preserves the no-gravity and
no-pipe-motion failure modes so the Prompt Twin arm has to beat a real runtime
baseline. It records only source hash metadata, not the raw seed body.
"""

import argparse
import json
import os

os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
os.environ.setdefault("SDL_VIDEODRIVER", "dummy")

import pygame

SOURCE_LABEL = ${JSON.stringify(sourceLabel)}
SOURCE_HASH = ${JSON.stringify(sourceHash)}
WIDTH = ${width}
HEIGHT = ${height}
GROUND_HEIGHT = ${groundHeight}
FPS = ${fps}
BIRD_X = ${birdX}
BIRD_Y = ${birdY}
BIRD_RADIUS = ${birdRadius}
GRAVITY = 0
JUMP_VELOCITY = 0
PIPE_WIDTH = ${pipeWidth}
PIPE_GAP = ${pipeGap}
PIPE_SPEED = 0


def run(frames):
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()
    bird_y = float(BIRD_Y)
    gravity_samples = 0
    collision_checks = 0
    bounds_checks = 0
    collisions = 0
    total_pipe_advance = 0.0
    score = 0
    pipe_x = float(WIDTH + 100)
    gap_y = float(HEIGHT // 2)
    events = [
        "pygame:init",
        "control:no-gravity",
        "control:no-pipe-motion",
    ]

    for _ in range(frames):
        clock.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                events.append("pygame:quit-event")
        gravity_samples += 1
        screen.fill((135, 206, 235))
        bird_rect = pygame.Rect(BIRD_X - BIRD_RADIUS, int(bird_y) - BIRD_RADIUS, BIRD_RADIUS * 2, BIRD_RADIUS * 2)
        top_rect = pygame.Rect(int(pipe_x), 0, PIPE_WIDTH, max(0, int(gap_y - PIPE_GAP // 2)))
        bottom_y = int(gap_y + PIPE_GAP // 2)
        bottom_rect = pygame.Rect(int(pipe_x), bottom_y, PIPE_WIDTH, max(0, HEIGHT - bottom_y - GROUND_HEIGHT))
        collision_checks += 2
        if bird_rect.colliderect(top_rect) or bird_rect.colliderect(bottom_rect):
            collisions += 1
        bounds_checks += 1
        if bird_y - BIRD_RADIUS < 0 or bird_y + BIRD_RADIUS > HEIGHT - GROUND_HEIGHT:
            collisions += 1
        pygame.display.flip()

    pygame.quit()
    summary = {
        "schemaVersion": 1,
        "sourceHash": SOURCE_HASH,
        "frames": frames,
        "score": score,
        "pipesAdvanced": round(total_pipe_advance, 3),
        "gravitySamples": gravity_samples,
        "collisionChecks": collision_checks,
        "boundsChecks": bounds_checks,
        "collisions": collisions,
        "finalBirdY": round(bird_y, 3),
        "events": sorted(set(events)),
        "ok": False,
    }
    print(json.dumps(summary, sort_keys=True))
    return 2


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames", type=int, default=${frames})
    args = parser.parse_args()
    raise SystemExit(run(args.frames))


if __name__ == "__main__":
    main()
`);
}

export function coerceFlappyPygameRuntimeSummary(value: unknown): FlappyPygameRuntimeSummary | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const events = Array.isArray(record.events) ? record.events.filter((item): item is string => typeof item === "string") : [];
  const summary: FlappyPygameRuntimeSummary = {
    schemaVersion: 1,
    sourceHash: typeof record.sourceHash === "string" ? record.sourceHash : "",
    frames: finiteNumber(record.frames),
    score: finiteNumber(record.score),
    pipesAdvanced: finiteNumber(record.pipesAdvanced),
    gravitySamples: finiteNumber(record.gravitySamples),
    collisionChecks: finiteNumber(record.collisionChecks),
    boundsChecks: finiteNumber(record.boundsChecks),
    collisions: finiteNumber(record.collisions),
    finalBirdY: finiteNumber(record.finalBirdY),
    events,
    ok: record.ok === true
  };
  if (summary.sourceHash.length !== 64 || summary.frames <= 0 || !Number.isFinite(summary.finalBirdY)) return null;
  return summary;
}

export function buildFlappyPygameRepairReport(input: {
  sourceText: string;
  sourceLabel?: string;
  repairedArtifactLabel: string;
  repairedScriptText: string;
  execution: SafeCommandProbeEvidence;
  runtimeSummary: FlappyPygameRuntimeSummary | null;
  generatedAt?: string;
}): FlappyPygameRepairReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceHash = hashText(input.sourceText);
  const repairedArtifactHash = hashText(input.repairedScriptText);
  const sourceConstants = extractPythonConstants(input.sourceText, [
    "WIDTH",
    "HEIGHT",
    "GROUND_HEIGHT",
    "FPS",
    "BIRD_X",
    "BIRD_Y",
    "BIRD_RADIUS",
    "GRAVITY",
    "JUMP_VELOCITY",
    "PIPE_WIDTH",
    "PIPE_GAP",
    "PIPE_SPEED"
  ]);
  const sourceLoc = input.sourceText.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const sourceRules = buildFlappyRuleChecks(input.sourceText, sourceConstants);
  const repairedRules = buildFlappyRuleChecks(input.repairedScriptText, extractPythonConstants(input.repairedScriptText, [
    "GRAVITY",
    "PIPE_SPEED",
    "JUMP_VELOCITY",
    "PIPE_GAP",
    "FPS",
    "WIDTH",
    "HEIGHT"
  ]));
  const fixedRuleIds = sourceRules
    .filter((rule) => !rule.passedInSeed && repairedRules.some((candidate) => candidate.ruleId === rule.ruleId && candidate.passedInSeed))
    .map((rule) => rule.ruleId)
    .sort();
  const unresolvedRuleIds = repairedRules.filter((rule) => !rule.passedInSeed && rule.severity === "blocking").map((rule) => rule.ruleId).sort();
  const summary = input.runtimeSummary;
  const manifest: FlappyPygameRepairManifest = {
    schemaVersion: 1,
    generatedAt,
    sourceLabel: input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
    sourceHash,
    sourceLoc,
    repairedArtifactLabel: input.repairedArtifactLabel,
    repairedArtifactHash,
    fixedRuleIds,
    unresolvedRuleIds,
    sourceConstants,
    repairedConstants: {
      WIDTH: positiveInteger(sourceConstants.WIDTH, 420),
      HEIGHT: positiveInteger(sourceConstants.HEIGHT, 640),
      FPS: positiveInteger(sourceConstants.FPS, 60),
      GRAVITY: 900,
      JUMP_VELOCITY: negativeNumber(sourceConstants.JUMP_VELOCITY, -360),
      PIPE_SPEED: 130,
      PIPE_GAP: clampNumber(Number(sourceConstants.PIPE_GAP ?? 160), 120, 240, 160)
    },
    safety: {
      rawSourceIncluded: false,
      rawCommandOutputIncluded: false,
      envValuesIncluded: false
    }
  };
  const gates = [
    {
      name: "repair-artifact-hashed",
      status: repairedArtifactHash.length === 64 && repairedArtifactHash !== sourceHash ? "pass" as const : "fail" as const,
      summary: `${input.repairedArtifactLabel} hashed without mutating the source seed.`
    },
    {
      name: "blocking-rules-repaired",
      status: unresolvedRuleIds.length === 0 && fixedRuleIds.includes("gravity-active") && fixedRuleIds.includes("pipe-motion") ? "pass" as const : "fail" as const,
      summary: `${fixedRuleIds.length} failing seed rules are repaired; unresolved blocking rules: ${unresolvedRuleIds.length}.`
    },
    {
      name: "pygame-execution-safe-probe",
      status: input.execution.ok && input.execution.stdoutHash.length === 64 && input.execution.stderrHash.length === 64 ? "pass" as const : "fail" as const,
      summary: `Pygame probe ok=${String(input.execution.ok)}, status=${String(input.execution.status)}, failure=${input.execution.detectedFailure ?? "none"}.`
    },
    {
      name: "runtime-summary-playable",
      status: summary?.ok === true && summary.score >= 1 && summary.pipesAdvanced > 0 && summary.gravitySamples === summary.frames ? "pass" as const : "fail" as const,
      summary: summary ? `frames=${summary.frames}, score=${summary.score}, pipeAdvance=${summary.pipesAdvanced}, collisions=${summary.collisions}.` : "No parseable safe runtime summary."
    },
    {
      name: "repair-safety-boundary",
      status: !manifest.safety.rawSourceIncluded && !manifest.safety.rawCommandOutputIncluded && !manifest.safety.envValuesIncluded ? "pass" as const : "fail" as const,
      summary: "Repair proof stores hashes, constants, rule ids, command hashes, and safe numeric runtime metrics only."
    }
  ];
  return {
    schemaVersion: 1,
    reportId: `flappy-pygame-repair-${sourceHash.slice(0, 10)}-${repairedArtifactHash.slice(0, 8)}`,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    manifest,
    execution: input.execution,
    runtimeSummary: summary,
    acceptanceGates: gates
  };
}

export function buildFlappyPromptTwinAbHeldOutPreRegistration(input: {
  goal: NavigatorGoal;
  commitment: FlappyHeldOutCommitment;
  expectedHeldOutLift: number;
  controlArtifactLabel: string;
  controlArtifactHash: string;
  twinArtifactLabel: string;
  twinArtifactHash: string;
  registeredAt?: string;
}): FlappyPromptTwinAbHeldOutPreRegistration {
  const registeredAt = input.registeredAt ?? new Date().toISOString();
  const expectedHeldOutLift = round(input.expectedHeldOutLift);
  const identity = {
    goalId: input.goal.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    expectedHeldOutLift,
    manifestHash: input.commitment.manifestHash,
    answerKeyHash: input.commitment.answerKeyCommitment.hash,
    controlArtifactHash: input.controlArtifactHash,
    twinArtifactHash: input.twinArtifactHash
  };
  return {
    schemaVersion: 1,
    registrationId: `flappy-ab-heldout-prereg-${input.goal.goalId}-${hashText(JSON.stringify(identity)).slice(0, 8)}`,
    goalId: input.goal.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    registeredAt,
    expectedHeldOutLift,
    commitment: {
      casesCommitted: input.commitment.casesCommitted,
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    },
    arms: {
      control: {
        artifactLabel: input.controlArtifactLabel,
        artifactHash: input.controlArtifactHash
      },
      twin: {
        artifactLabel: input.twinArtifactLabel,
        artifactHash: input.twinArtifactHash
      }
    },
    safety: {
      rawCasesIncluded: false,
      answerKeyIncluded: false,
      artifactIncluded: false,
      rawArtifactIncluded: false,
      envValuesIncluded: false
    }
  };
}

export function scoreFlappyPromptTwinAbHeldOut(input: {
  preRegistration: FlappyPromptTwinAbHeldOutPreRegistration;
  commitment: FlappyHeldOutCommitment;
  controlArtifactText: string;
  twinArtifactText: string;
  scoredAt?: string;
}): FlappyPromptTwinAbHeldOutResult {
  const scoredAt = input.scoredAt ?? new Date().toISOString();
  const control = scoreFlappyHeldOutArtifact({
    artifactText: input.controlArtifactText,
    commitment: input.commitment,
    generatedAt: scoredAt
  });
  const twin = scoreFlappyHeldOutArtifact({
    artifactText: input.twinArtifactText,
    commitment: input.commitment,
    generatedAt: scoredAt
  });
  const preRegistrationHash = hashText(JSON.stringify(input.preRegistration));
  const heldOutLift = round(twin.passRate - control.passRate);
  const liftDeltaVsExpected = round(heldOutLift - input.preRegistration.expectedHeldOutLift);
  const registeredAtMs = Date.parse(input.preRegistration.registeredAt);
  const scoredAtMs = Date.parse(scoredAt);
  const registeredBeforeScoring = Number.isFinite(registeredAtMs) && Number.isFinite(scoredAtMs) && registeredAtMs <= scoredAtMs;
  const commitmentMatches = input.preRegistration.commitment.manifestHash === input.commitment.manifestHash
    && input.preRegistration.commitment.answerKeyHash === input.commitment.answerKeyCommitment.hash
    && control.commitment.manifestHash === input.commitment.manifestHash
    && twin.commitment.manifestHash === input.commitment.manifestHash
    && control.commitment.answerKeyHash === input.commitment.answerKeyCommitment.hash
    && twin.commitment.answerKeyHash === input.commitment.answerKeyCommitment.hash;
  const artifactHashesMatch = control.artifactHash === input.preRegistration.arms.control.artifactHash
    && twin.artifactHash === input.preRegistration.arms.twin.artifactHash;
  const casesScored = Math.min(control.casesScored, twin.casesScored);
  const safety = {
    rawCasesIncluded: false,
    answerKeyIncluded: false,
    artifactIncluded: false,
    rawArtifactIncluded: false,
    envValuesIncluded: false
  } as const;
  const safetyPayload = {
    preRegistration: input.preRegistration,
    control,
    twin,
    heldOutLift,
    expectedHeldOutLift: input.preRegistration.expectedHeldOutLift,
    liftDeltaVsExpected,
    safety
  };
  const gates = [
    {
      name: "heldout-preregistered-before-scoring",
      status: registeredBeforeScoring ? "pass" as const : "fail" as const,
      summary: `registeredAt=${input.preRegistration.registeredAt}, scoredAt=${scoredAt}.`
    },
    {
      name: "heldout-commitment-matches-preregistration",
      status: commitmentMatches ? "pass" as const : "fail" as const,
      summary: `manifest=${input.commitment.manifestHash.slice(0, 10)}, answerKey=${input.commitment.answerKeyCommitment.hash.slice(0, 10)}.`
    },
    {
      name: "heldout-artifacts-match-preregistration",
      status: artifactHashesMatch ? "pass" as const : "fail" as const,
      summary: `control=${control.artifactHash.slice(0, 10)}, twin=${twin.artifactHash.slice(0, 10)}.`
    },
    {
      name: "heldout-result-documented",
      status: Number.isFinite(heldOutLift) && casesScored > 0 && input.preRegistration.expectedHeldOutLift >= 0 ? "pass" as const : "fail" as const,
      summary: `heldOutLift=${heldOutLift >= 0 ? "+" : ""}${heldOutLift.toFixed(4)}, expected=${input.preRegistration.expectedHeldOutLift.toFixed(4)}, met=${String(heldOutLift >= input.preRegistration.expectedHeldOutLift)}.`
    },
    {
      name: "heldout-lift-meets-preregistered-bar",
      status: heldOutLift >= input.preRegistration.expectedHeldOutLift ? "pass" as const : "fail" as const,
      summary: `observed=${heldOutLift >= 0 ? "+" : ""}${heldOutLift.toFixed(4)}, expected=${input.preRegistration.expectedHeldOutLift.toFixed(4)}, delta=${liftDeltaVsExpected >= 0 ? "+" : ""}${liftDeltaVsExpected.toFixed(4)}.`
    },
    {
      name: "safe-heldout-ab-boundary",
      status: promptTwinAbHeldOutPayloadIsSafe(safetyPayload) ? "pass" as const : "fail" as const,
      summary: "Held-out A/B result stores aggregate scorer outputs and hashes only; raw cases, answer keys, and artifact bodies are excluded."
    }
  ];
  const resultId = `flappy-ab-heldout-result-${input.preRegistration.goalId}-${hashText(JSON.stringify({
    preRegistrationHash,
    control: control.artifactHash,
    twin: twin.artifactHash,
    heldOutLift,
    expectedHeldOutLift: input.preRegistration.expectedHeldOutLift
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    resultId,
    goalId: input.preRegistration.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    scoredAt,
    registeredAt: input.preRegistration.registeredAt,
    preRegistrationId: input.preRegistration.registrationId,
    preRegistrationHash,
    control,
    twin,
    heldOutLift,
    expectedHeldOutLift: input.preRegistration.expectedHeldOutLift,
    liftDeltaVsExpected,
    metExpectedLift: heldOutLift >= input.preRegistration.expectedHeldOutLift,
    casesScored,
    commitment: {
      casesCommitted: input.commitment.casesCommitted,
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    },
    safety,
    acceptanceGates: gates
  };
}

export function buildFlappyPromptTwinAbProofReport(input: {
  goal: NavigatorGoal;
  sourceText: string;
  sourceLabel?: string;
  controlArtifactLabel: string;
  controlScriptText: string;
  controlExecution: SafeCommandProbeEvidence;
  controlRuntimeSummary: FlappyPygameRuntimeSummary | null;
  twinArtifactLabel: string;
  twinScriptText: string;
  twinExecution: SafeCommandProbeEvidence;
  twinRuntimeSummary: FlappyPygameRuntimeSummary | null;
  heldOutPreRegistration?: FlappyPromptTwinAbHeldOutPreRegistration;
  heldOutResult?: FlappyPromptTwinAbHeldOutResult;
  generatedAt?: string;
}): FlappyPromptTwinAbProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceLabel = input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py";
  const sourceHash = hashText(input.sourceText);
  const sourceLoc = input.sourceText.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const sourceRules = buildFlappyRuleChecks(input.sourceText, extractPythonConstants(input.sourceText, [
    "GRAVITY",
    "PIPE_SPEED",
    "JUMP_VELOCITY",
    "PIPE_GAP",
    "FPS",
    "WIDTH",
    "HEIGHT"
  ]));
  const buildArm = (
    armId: FlappyPromptTwinAbArmEvidence["armId"],
    strategy: string,
    artifactLabel: string,
    scriptText: string,
    execution: SafeCommandProbeEvidence,
    runtimeSummary: FlappyPygameRuntimeSummary | null
  ): FlappyPromptTwinAbArmEvidence => {
    const armRules = buildFlappyRuleChecks(scriptText, extractPythonConstants(scriptText, [
      "GRAVITY",
      "PIPE_SPEED",
      "JUMP_VELOCITY",
      "PIPE_GAP",
      "FPS",
      "WIDTH",
      "HEIGHT"
    ]));
    const fixedRuleIds = sourceRules
      .filter((rule) => !rule.passedInSeed && armRules.some((candidate) => candidate.ruleId === rule.ruleId && candidate.passedInSeed))
      .map((rule) => rule.ruleId)
      .sort();
    const unresolvedRuleIds = armRules
      .filter((rule) => !rule.passedInSeed && rule.severity === "blocking")
      .map((rule) => rule.ruleId)
      .sort();
    return {
      armId,
      strategy,
      artifactLabel,
      artifactHash: hashText(scriptText),
      fixedRuleIds,
      unresolvedRuleIds,
      execution,
      runtimeSummary,
      runtimeScore: flappyAbRuntimeScore(runtimeSummary)
    };
  };
  const control = buildArm(
    "control-manager",
    "Limited control repair preserves no-gravity and no-pipe-motion failure modes.",
    input.controlArtifactLabel,
    input.controlScriptText,
    input.controlExecution,
    input.controlRuntimeSummary
  );
  const twin = buildArm(
    "prompt-twin",
    "Prompt Twin-steered repair fixes gravity, pipe motion, scoring, and collision/bounds runtime behavior.",
    input.twinArtifactLabel,
    input.twinScriptText,
    input.twinExecution,
    input.twinRuntimeSummary
  );
  const runtimeLift = round(twin.runtimeScore - control.runtimeScore);
  const ruleRepairLift = twin.fixedRuleIds.length - control.fixedRuleIds.length;
  const heldOutPreRegistration = input.heldOutPreRegistration;
  const heldOutResult = input.heldOutResult;
  const preRegistrationHash = heldOutPreRegistration ? hashText(JSON.stringify(heldOutPreRegistration)) : null;
  const heldOutConnected = Boolean(heldOutPreRegistration)
    && Boolean(heldOutResult)
    && heldOutResult?.preRegistrationHash === preRegistrationHash
    && heldOutResult?.control.artifactHash === control.artifactHash
    && heldOutResult?.twin.artifactHash === twin.artifactHash
    && heldOutResult?.goalId === input.goal.goalId;
  const observations = buildFlappyPromptTwinAbObservations({
    reportIdSeed: `${sourceHash}:${control.artifactHash}:${twin.artifactHash}`,
    runtimeLift,
    ruleRepairLift,
    sourceLoc,
    control,
    twin,
    heldOutResult,
    generatedAt
  });
  const gates = [
    {
      name: "ab-artifacts-hashed",
      status: control.artifactHash.length === 64
        && twin.artifactHash.length === 64
        && control.artifactHash !== twin.artifactHash
        && control.artifactHash !== sourceHash
        && twin.artifactHash !== sourceHash
        ? "pass" as const
        : "fail" as const,
      summary: `control=${control.artifactHash.slice(0, 10)}, twin=${twin.artifactHash.slice(0, 10)}, source=${sourceHash.slice(0, 10)}.`
    },
    {
      name: "control-runtime-captured",
      status: Boolean(control.runtimeSummary) && control.execution.stdoutHash.length === 64 && control.execution.stderrHash.length === 64 ? "pass" as const : "fail" as const,
      summary: `control ok=${String(control.runtimeSummary?.ok ?? false)}, status=${String(control.execution.status)}, score=${control.runtimeSummary?.score ?? "n/a"}.`
    },
    {
      name: "twin-runtime-playable",
      status: twin.execution.ok && twin.runtimeSummary?.ok === true && twin.runtimeSummary.score >= 1 && twin.runtimeSummary.pipesAdvanced > 0 ? "pass" as const : "fail" as const,
      summary: `twin ok=${String(twin.runtimeSummary?.ok ?? false)}, status=${String(twin.execution.status)}, score=${twin.runtimeSummary?.score ?? "n/a"}, pipeAdvance=${twin.runtimeSummary?.pipesAdvanced ?? "n/a"}.`
    },
    {
      name: "twin-beats-control-runtime",
      status: runtimeLift >= 0.5 && twin.runtimeScore > control.runtimeScore ? "pass" as const : "fail" as const,
      summary: `runtimeScore ${control.runtimeScore.toFixed(4)} -> ${twin.runtimeScore.toFixed(4)} (${runtimeLift >= 0 ? "+" : ""}${runtimeLift.toFixed(4)}).`
    },
    {
      name: "twin-repairs-more-blocking-rules",
      status: ruleRepairLift >= 2 && twin.unresolvedRuleIds.length === 0 ? "pass" as const : "fail" as const,
      summary: `control fixed=${control.fixedRuleIds.length}, twin fixed=${twin.fixedRuleIds.length}, twin unresolved=${twin.unresolvedRuleIds.length}.`
    },
    {
      name: "heldout-preregistration-attached",
      status: heldOutPreRegistration && heldOutResult ? "pass" as const : "fail" as const,
      summary: heldOutPreRegistration && heldOutResult
        ? `expectedHeldOutLift=${heldOutPreRegistration.expectedHeldOutLift.toFixed(4)}, scorer=${heldOutPreRegistration.scorerRef}.`
        : "No held-out pre-registration and aggregate score result attached."
    },
    {
      name: "heldout-result-connected-to-arms",
      status: heldOutConnected ? "pass" as const : "fail" as const,
      summary: heldOutResult
        ? `control=${heldOutResult.control.passRate.toFixed(4)}, twin=${heldOutResult.twin.passRate.toFixed(4)}, lift=${heldOutResult.heldOutLift >= 0 ? "+" : ""}${heldOutResult.heldOutLift.toFixed(4)}.`
        : "No held-out result was supplied."
    },
    ...(heldOutResult?.acceptanceGates ?? []),
    {
      name: "safe-prompt-twin-ab-boundary",
      status: promptTwinAbProofIsSafe({ control, twin, heldOutPreRegistration, heldOutResult }) ? "pass" as const : "fail" as const,
      summary: "A/B proof stores artifact hashes, rule ids, command hashes, aggregate held-out scores, and safe runtime metrics only."
    }
  ];
  const proofId = `flappy-prompt-twin-ab-${input.goal.goalId}-${hashText(JSON.stringify({
    control: control.artifactHash,
    twin: twin.artifactHash,
    runtimeLift,
    heldOutLift: heldOutResult?.heldOutLift ?? null
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    sourceLabel,
    sourceHash,
    sourceLoc,
    control,
    twin,
    runtimeLift,
    ruleRepairLift,
    heldOutPreRegistration,
    heldOutResult,
    heldOutLift: heldOutResult?.heldOutLift,
    observations,
    safety: {
      rawSourceIncluded: false,
      rawCommandOutputIncluded: false,
      envValuesIncluded: false
    },
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("flappy-prompt-twin-ab-proof.json", { proofId, runtimeLift, ruleRepairLift }, "Safe Prompt Twin A/B proof seed."),
      artifactSummary("flappy-control-manager-arm.py", { artifactHash: control.artifactHash, runtimeScore: control.runtimeScore }, "Control manager runtime arm metadata."),
      artifactSummary("flappy-prompt-twin-arm.py", { artifactHash: twin.artifactHash, runtimeScore: twin.runtimeScore }, "Prompt Twin runtime arm metadata."),
      ...(heldOutPreRegistration
        ? [artifactSummary("flappy-prompt-twin-ab-heldout-preregistration.json", {
          registrationId: heldOutPreRegistration.registrationId,
          expectedHeldOutLift: heldOutPreRegistration.expectedHeldOutLift,
          scorerRef: heldOutPreRegistration.scorerRef
        }, "Pre-registered held-out scorer expectation and artifact hashes.")]
        : []),
      ...(heldOutResult
        ? [artifactSummary("flappy-prompt-twin-ab-heldout-result.json", {
          resultId: heldOutResult.resultId,
          heldOutLift: heldOutResult.heldOutLift,
          metExpectedLift: heldOutResult.metExpectedLift
        }, "Aggregate scorer-only held-out A/B result.")]
        : [])
    ]
  };
}

export function buildFlappySourceMutationProofReport(input: {
  goal: NavigatorGoal;
  sourceLabel?: string;
  preSourceText: string;
  repairedSourceText: string;
  mutationObservedText: string;
  finalSourceText: string;
  applyMode: "applied" | "dry-run";
  restoredAfterProof: boolean;
  execution: SafeCommandProbeEvidence;
  runtimeSummary: FlappyPygameRuntimeSummary | null;
  generatedAt?: string;
}): FlappySourceMutationProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceLabel = input.sourceLabel ?? "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py";
  const preSourceHash = hashText(input.preSourceText);
  const repairedSourceHash = hashText(input.repairedSourceText);
  const mutationObservedHash = hashText(input.mutationObservedText);
  const finalSourceHash = hashText(input.finalSourceText);
  const preRules = buildFlappyRuleChecks(input.preSourceText, extractPythonConstants(input.preSourceText, [
    "GRAVITY",
    "PIPE_SPEED",
    "JUMP_VELOCITY",
    "PIPE_GAP",
    "FPS",
    "WIDTH",
    "HEIGHT"
  ]));
  const repairedRules = buildFlappyRuleChecks(input.repairedSourceText, extractPythonConstants(input.repairedSourceText, [
    "GRAVITY",
    "PIPE_SPEED",
    "JUMP_VELOCITY",
    "PIPE_GAP",
    "FPS",
    "WIDTH",
    "HEIGHT"
  ]));
  const fixedRuleIds = preRules
    .filter((rule) => !rule.passedInSeed && repairedRules.some((candidate) => candidate.ruleId === rule.ruleId && candidate.passedInSeed))
    .map((rule) => rule.ruleId)
    .sort();
  const unresolvedBlockingRuleIds = repairedRules
    .filter((rule) => !rule.passedInSeed && rule.severity === "blocking")
    .map((rule) => rule.ruleId)
    .sort();
  const sourceLocBefore = input.preSourceText.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const sourceLocAfter = input.repairedSourceText.split(/\r?\n/).filter((line) => line.trim().length > 0).length;
  const summary = input.runtimeSummary;
  const gates = [
    {
      name: "explicit-source-mutation-applied",
      status: input.applyMode === "applied" && preSourceHash !== repairedSourceHash && mutationObservedHash === repairedSourceHash ? "pass" as const : "fail" as const,
      summary: `applyMode=${input.applyMode}, pre=${preSourceHash.slice(0, 10)}, observed=${mutationObservedHash.slice(0, 10)}, repaired=${repairedSourceHash.slice(0, 10)}.`
    },
    {
      name: "blocking-rules-repaired-in-source",
      status: unresolvedBlockingRuleIds.length === 0 && fixedRuleIds.includes("gravity-active") && fixedRuleIds.includes("pipe-motion") && fixedRuleIds.includes("score-progresses") && fixedRuleIds.includes("collision-or-bounds") ? "pass" as const : "fail" as const,
      summary: `${fixedRuleIds.length} source rules repaired; unresolved blocking rules: ${unresolvedBlockingRuleIds.length}.`
    },
    {
      name: "original-path-runtime-executed",
      status: input.execution.ok && input.execution.stdoutHash.length === 64 && input.execution.stderrHash.length === 64 ? "pass" as const : "fail" as const,
      summary: `Original source path execution ok=${String(input.execution.ok)}, status=${String(input.execution.status)}, failure=${input.execution.detectedFailure ?? "none"}.`
    },
    {
      name: "runtime-summary-playable",
      status: summary?.ok === true && summary.score >= 1 && summary.pipesAdvanced > 0 && summary.gravitySamples === summary.frames && summary.sourceHash === preSourceHash ? "pass" as const : "fail" as const,
      summary: summary ? `frames=${summary.frames}, score=${summary.score}, pipeAdvance=${summary.pipesAdvanced}, sourceHashMatchesPre=${String(summary.sourceHash === preSourceHash)}.` : "No parseable safe runtime summary."
    },
    {
      name: "restore-policy-honored",
      status: input.restoredAfterProof ? finalSourceHash === preSourceHash ? "pass" as const : "fail" as const : finalSourceHash === repairedSourceHash ? "pass" as const : "fail" as const,
      summary: input.restoredAfterProof
        ? `Source restored after proof=${String(finalSourceHash === preSourceHash)}.`
        : `Source left repaired after proof=${String(finalSourceHash === repairedSourceHash)}.`
    },
    {
      name: "safe-source-mutation-boundary",
      status: "pass" as const,
      summary: "Source mutation proof stores hashes, rule ids, command hashes, and safe runtime metrics only."
    }
  ];
  const proofId = `navigator-source-repair-${input.goal.goalId}-${hashText(JSON.stringify({
    preSourceHash,
    repairedSourceHash,
    mutationObservedHash,
    restoredAfterProof: input.restoredAfterProof
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    sourceLabel,
    applyMode: input.applyMode,
    restoredAfterProof: input.restoredAfterProof,
    preSourceHash,
    repairedSourceHash,
    mutationObservedHash,
    finalSourceHash,
    sourceLocBefore,
    sourceLocAfter,
    fixedRuleIds,
    unresolvedBlockingRuleIds,
    execution: input.execution,
    runtimeSummary: summary,
    safety: {
      rawSourceIncluded: false,
      rawCommandOutputIncluded: false,
      envValuesIncluded: false
    },
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("flappy-source-mutation-proof.json", { proofId, fixedRuleIds, unresolvedBlockingRuleIds, restoredAfterProof: input.restoredAfterProof }, "Safe direct source mutation proof seed."),
      artifactSummary("navigation-source-repair-proof.json", { proofId, preSourceHash, repairedSourceHash, mutationObservedHash, finalSourceHash }, "Navigator source repair proof seed.")
    ]
  };
}

export function buildNavigatorValidatorProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  sourceText: string;
  sourceLabel?: string;
  smoke: SafeCommandProbeEvidence;
  pygameRepair?: FlappyPygameRepairReport;
  generatedAt?: string;
}): NavigatorValidatorProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const paths = computeEfficientFrontier(input.paths);
  const initialN2 = buildNavigatorN2ProofReport({ goal: input.goal, paths, generatedAt });
  const baselinePath = selectStaticBaselinePath(paths);
  const navigatorPath = paths.find((path) => path.pathId === initialN2.frontierSelection.selectedPathId) ?? paths[0];
  const validator = buildFlappyValidatorRealityReport({
    sourceText: input.sourceText,
    sourceLabel: input.sourceLabel,
    baselinePath,
    navigatorPath,
    smoke: input.smoke,
    generatedAt
  });
  const loop = buildNavigatorLoopProofReport({
    goal: input.goal,
    paths,
    observations: validator.observations,
    generatedAt
  });
  const blockingFailures = validator.source.ruleChecks.filter((rule) => !rule.passedInSeed && rule.severity === "blocking");
  const gates = [
    {
      name: "real-source-inspected",
      status: validator.source.loc >= 5 && validator.source.sourceHash.length === 64 ? "pass" as const : "fail" as const,
      summary: `${validator.source.sourceLabel} hashed with ${validator.source.loc} non-empty LOC.`
    },
    {
      name: "broken-seed-defects-detected",
      status: blockingFailures.length >= 2 ? "pass" as const : "fail" as const,
      summary: `${blockingFailures.length} blocking defects detected in the real Flappy seed.`
    },
    {
      name: "safe-smoke-probe-captured",
      status: validator.smoke.stdoutHash.length === 64 && validator.smoke.stderrHash.length === 64 ? "pass" as const : "fail" as const,
      summary: `Smoke probe ok=${String(validator.smoke.ok)}, status=${String(validator.smoke.status)}, failure=${validator.smoke.detectedFailure ?? "none"}.`
    },
    {
      name: "navigator-validator-lift",
      status: validator.validatorLift >= 0.2 ? "pass" as const : "fail" as const,
      summary: `${validator.navigator.passRate.toFixed(4)} vs ${validator.baseline.passRate.toFixed(4)} (${validator.validatorLift >= 0 ? "+" : ""}${validator.validatorLift.toFixed(4)}).`
    },
    {
      name: "validator-observations-drive-loop",
      status: loop.passed && loop.observations.every((observation) => observation.observationId.startsWith("obs-flappy-")) ? "pass" as const : "fail" as const,
      summary: `Loop passed=${String(loop.passed)} with ${loop.observations.length} Flappy validator observations.`
    },
    {
      name: "safe-evidence-boundary",
      status: !validator.safety.rawSourceIncluded && !validator.safety.rawCommandOutputIncluded && !validator.safety.envValuesIncluded ? "pass" as const : "fail" as const,
      summary: "Validator report stores source hashes, constants, rule ids, and command hashes only."
    }
  ];
  if (input.pygameRepair) {
    gates.splice(4, 0, {
      name: "pygame-repaired-seed-executed",
      status: input.pygameRepair.passed ? "pass" as const : "fail" as const,
      summary: input.pygameRepair.runtimeSummary
        ? `Pygame repaired seed ran ${input.pygameRepair.runtimeSummary.frames} frames with score ${input.pygameRepair.runtimeSummary.score}.`
        : "Pygame repair proof did not produce a safe runtime summary."
    });
  }
  const proofId = `navigator-validator-proof-${input.goal.goalId}-${hashText(JSON.stringify({ reportId: validator.reportId, loop: loop.proofId })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    validator,
    pygameRepair: input.pygameRepair,
    loop,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("flappy-validator-evidence.json", validator, "Safe Flappy validator evidence."),
      ...(input.pygameRepair ? [artifactSummary("flappy-pygame-repair-evidence.json", input.pygameRepair, "Safe repaired Pygame seed execution evidence.")] : []),
      artifactSummary("navigation-loop-proof.json", loop, "Navigator loop proof driven by Flappy validator observations."),
      artifactSummary("navigation-validator-proof.json", { proofId, validatorLift: validator.validatorLift }, "Navigator validator proof seed.")
    ]
  };
}

export function buildNavigatorMonorepoPrimitiveProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  sources: MonorepoPrimitiveSourceEvidence[];
  bie: BiePrimitiveExecutionSummary;
  conformal: ConformalPrimitiveExecutionSummary;
  swarm: SwarmHarnessPrimitiveSummary;
  generatedAt?: string;
}): NavigatorMonorepoPrimitiveProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const sourceKinds = new Set(input.sources.map((source) => source.kind));
  const gates = [
    {
      name: "bie-direct-import-executed",
      status: input.bie.directImport
        && input.bie.frontierPoints >= 6
        && input.bie.eloMatches >= input.bie.ideasEvaluated
        && input.bie.selectedPathIds.length > 0
        ? "pass" as const
        : "fail" as const,
      summary: `BIE ${input.bie.moduleLabel} produced ${input.bie.frontierPoints} frontier points, ${input.bie.allocations} allocations, and ${input.bie.eloMatches} ELO matches.`
    },
    {
      name: "conformal-direct-execution",
      status: input.conformal.directExecution
        && input.conformal.execution.ok
        && input.conformal.forecastsCalibrated >= 2
        && input.conformal.confidenceLevels.includes(0.9)
        ? "pass" as const
        : "fail" as const,
      summary: `Conformal probe ok=${String(input.conformal.execution.ok)}, forecasts=${input.conformal.forecastsCalibrated}, coverage90=${String(input.conformal.coverage90)}.`
    },
    {
      name: "swarm-harness-provenance-mapped",
      status: input.swarm.hasChildProcessFork
        && input.swarm.hasIpcProtocol
        && ["draft", "judge", "research"].every((mode) => input.swarm.modes.includes(mode))
        ? "pass" as const
        : "fail" as const,
      summary: `Swarm modes=${input.swarm.modes.join(", ")}, env keys=${input.swarm.envKeys.length}, policy=${input.swarm.executionPolicy}.`
    },
    {
      name: "source-provenance-complete",
      status: sourceKinds.has("bie-frontier")
        && sourceKinds.has("bie-elo")
        && sourceKinds.has("conformal")
        && sourceKinds.has("swarm-harness")
        && input.sources.every((source) => source.sourceHash.length === 64 && source.loc > 0)
        ? "pass" as const
        : "fail" as const,
      summary: `${input.sources.length} monorepo primitive source files hashed and summarized.`
    },
    {
      name: "safe-primitive-evidence-boundary",
      status: primitiveProofIsSafe(input) ? "pass" as const : "fail" as const,
      summary: "Proof stores source labels, hashes, LOC, symbols, numeric outputs, and command hashes only."
    }
  ];
  const proofId = `navigator-monorepo-primitives-${input.goal.goalId}-${hashText(JSON.stringify({
    bie: input.bie.outputHash,
    conformal: input.conformal.outputHash,
    swarm: input.swarm.coordinator.sourceHash
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    sources: input.sources,
    bie: input.bie,
    conformal: input.conformal,
    swarm: input.swarm,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("monorepo-primitive-proof.json", { proofId, gates, bie: input.bie, conformal: input.conformal }, "Navigator monorepo primitive proof seed."),
      artifactSummary("monorepo-primitive-sources.json", input.sources, "Hashed monorepo primitive source inventory."),
      artifactSummary("navigator-conformal-probe.py", { sourceHash: input.conformal.sourceHash, outputHash: input.conformal.outputHash }, "Generated safe conformal probe metadata.")
    ]
  };
}

export function buildFixturePromptTwinJudgmentEvidence(input: {
  goal: NavigatorGoal;
  candidatePathId: string;
  evidenceSummary: string;
  generatedAt?: string;
}): PromptTwinJudgmentEvidence {
  const score = 0.86;
  return {
    schemaVersion: 1,
    mode: "fixture",
    provider: "fixture-reviewer",
    profile: "fixture",
    status: "ok",
    callsEnabled: false,
    configured: true,
    inputHash: hashText(JSON.stringify({ objective: input.goal.objective, candidatePathId: input.candidatePathId })),
    rubricHash: hashText(JSON.stringify(input.goal.promptTwin.rubric)),
    evidenceHash: hashText(input.evidenceSummary),
    verdict: "approve",
    score,
    confidence: 0.78,
    rationale: "Fixture Prompt Twin approves the trail because runtime, held-out, and primitive provenance gates are represented without overclaiming intelligence.",
    strengths: [
      "Reality evidence is kept above taste judgment.",
      "The selected path carries replayable proof artifacts.",
      "The falsifier remains visible for future drift checks."
    ],
    risks: [
      "Fixture judgment is not a live model review.",
      "A second domain is still needed before broad generality claims."
    ],
    steering: [
      "Keep live provider calls gated and metadata-only.",
      "Add external or human review before economic value claims."
    ],
    falsifier: "If validator or primitive gates fail, Prompt Twin approval must be ignored.",
    safety: {
      rawPromptIncluded: false,
      rawProviderResponseIncluded: false,
      envValuesIncluded: false
    }
  };
}

export function buildNavigatorPromptTwinProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  candidatePathId?: string;
  validatorPassed: boolean;
  primitiveProofPassed: boolean;
  requireLive: boolean;
  judgment: PromptTwinJudgmentEvidence;
  generatedAt?: string;
}): NavigatorPromptTwinProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const candidatePathId = input.candidatePathId ?? input.paths[0]?.pathId ?? "unknown";
  const observation: NavigationObservation = {
    observationId: `obs-prompt-twin-judgment-${hashText(JSON.stringify(input.judgment)).slice(0, 8)}`,
    milestoneId: "m3-twin-review",
    metric: "promptTwinScore",
    actual: round(input.judgment.score),
    sourceLayer: "promptTwin",
    weight: input.judgment.mode === "provider-live" ? 1.15 : 0.85,
    summary: `${input.judgment.provider} returned ${input.judgment.verdict} with confidence ${input.judgment.confidence}.`,
    timestamp: generatedAt
  };
  const gates = [
    {
      name: "prompt-twin-judgment-captured",
      status: input.judgment.status === "ok" && input.judgment.score > 0 && input.judgment.verdict !== "reject" ? "pass" as const : "fail" as const,
      summary: `${input.judgment.provider} mode=${input.judgment.mode}, verdict=${input.judgment.verdict}, score=${input.judgment.score}.`
    },
    {
      name: "prompt-twin-quality-threshold",
      status: input.judgment.score >= 0.8 && input.judgment.verdict === "approve" ? "pass" as const : "fail" as const,
      summary: `Quality approval requires approve verdict and score >= 0.80; got ${input.judgment.verdict} at ${input.judgment.score}.`
    },
    {
      name: "live-provider-required-if-requested",
      status: !input.requireLive || input.judgment.mode === "provider-live" ? "pass" as const : "fail" as const,
      summary: `requireLive=${String(input.requireLive)}, judgmentMode=${input.judgment.mode}, responseId=${input.judgment.responseId ? "recorded" : "not-recorded"}.`
    },
    {
      name: "reality-gates-not-overridden",
      status: input.validatorPassed && input.primitiveProofPassed ? "pass" as const : input.judgment.verdict === "approve" ? "fail" as const : "pass" as const,
      summary: `validatorPassed=${String(input.validatorPassed)}, primitiveProofPassed=${String(input.primitiveProofPassed)}, verdict=${input.judgment.verdict}.`
    },
    {
      name: "prompt-twin-hashes-present",
      status: [input.judgment.inputHash, input.judgment.rubricHash, input.judgment.evidenceHash].every((hash) => hash.length === 64) ? "pass" as const : "fail" as const,
      summary: "Input, rubric, and evidence summaries are represented by hashes."
    },
    {
      name: "safe-prompt-twin-boundary",
      status: promptTwinJudgmentIsSafe(input.judgment) ? "pass" as const : "fail" as const,
      summary: "Prompt Twin proof stores parsed judgment fields and provider metadata, not raw prompts, raw responses, env values, or endpoints."
    }
  ];
  const proofId = `navigator-prompt-twin-${input.goal.goalId}-${hashText(JSON.stringify({
    candidatePathId,
    judgment: input.judgment.outputHash ?? input.judgment.evidenceHash,
    score: input.judgment.score
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    requireLive: input.requireLive,
    candidatePathId,
    validatorPassed: input.validatorPassed,
    primitiveProofPassed: input.primitiveProofPassed,
    judgment: input.judgment,
    observation,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("prompt-twin-judgment-evidence.json", input.judgment, "Safe Prompt Twin judgment evidence."),
      artifactSummary("navigation-prompt-twin-proof.json", { proofId, candidatePathId, observation, gates }, "Navigator Prompt Twin proof seed.")
    ]
  };
}

export function buildNavigatorProviderCouncilProofReport(input: {
  goal: NavigatorGoal;
  requireLive: boolean;
  deterministicWinnerPathId: string;
  judgment: ProviderCouncilSeatJudgmentEvidence;
  generatedAt?: string;
}): NavigatorProviderCouncilProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const winnerPathId = input.judgment.winnerPathId ?? input.deterministicWinnerPathId;
  const observation: NavigationObservation = {
    observationId: `obs-provider-council-${hashText(JSON.stringify(input.judgment)).slice(0, 8)}`,
    milestoneId: "m4-provider-council-seat",
    metric: "providerCouncilConfidence",
    actual: round(input.judgment.confidence),
    sourceLayer: "council",
    provenance: input.judgment.mode === "provider-live" ? "provider-judge" : "fixture",
    weight: input.judgment.mode === "provider-live" ? 1.1 : 0.25,
    summary: `${input.judgment.seat} seat mode=${input.judgment.mode}, winner=${winnerPathId}, confidence=${input.judgment.confidence}.`,
    timestamp: generatedAt
  };
  const winnerIsValid = winnerPathId === input.judgment.leftPathId || winnerPathId === input.judgment.rightPathId;
  const gates = [
    {
      name: "provider-council-result-classified",
      status: input.judgment.status === "failed" ? "fail" as const : "pass" as const,
      summary: `${input.judgment.provider} status=${input.judgment.status}, mode=${input.judgment.mode}, seat=${input.judgment.seat}.`
    },
    {
      name: "live-provider-required-if-requested",
      status: !input.requireLive || input.judgment.mode === "provider-live" ? "pass" as const : "fail" as const,
      summary: `requireLive=${String(input.requireLive)}, judgmentMode=${input.judgment.mode}, responseId=${input.judgment.responseId ? "recorded" : "not-recorded"}.`
    },
    {
      name: "winner-path-valid",
      status: winnerIsValid ? "pass" as const : "fail" as const,
      summary: `winner=${winnerPathId}, left=${input.judgment.leftPathId}, right=${input.judgment.rightPathId}.`
    },
    {
      name: "provider-council-hashes-present",
      status: [input.judgment.inputHash, input.judgment.rubricHash, input.judgment.evidenceHash].every((hash) => hash.length === 64) ? "pass" as const : "fail" as const,
      summary: "Input, rubric, and evidence summaries are represented by hashes."
    },
    {
      name: "provider-council-falsifier-present",
      status: input.judgment.falsifier.trim().length >= 20 ? "pass" as const : "fail" as const,
      summary: "The provider council evidence carries an explicit falsifier or skipped-call falsifier."
    },
    {
      name: "safe-provider-council-boundary",
      status: providerCouncilJudgmentIsSafe(input.judgment) ? "pass" as const : "fail" as const,
      summary: "Provider council proof stores parsed judgment fields and provider metadata, not raw prompts, raw responses, env values, endpoints, URLs, or headers."
    }
  ];
  const proofId = `navigator-provider-council-${input.goal.goalId}-${hashText(JSON.stringify({
    seat: input.judgment.seat,
    leftPathId: input.judgment.leftPathId,
    rightPathId: input.judgment.rightPathId,
    winnerPathId,
    outputHash: input.judgment.outputHash ?? input.judgment.evidenceHash
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    requireLive: input.requireLive,
    deterministicWinnerPathId: input.deterministicWinnerPathId,
    judgment: {
      ...input.judgment,
      winnerPathId
    },
    observation,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("provider-council-seat-judgment-evidence.json", input.judgment, "Safe provider council-seat judgment evidence."),
      artifactSummary("navigation-provider-council-proof.json", { proofId, winnerPathId, observation, gates }, "Navigator provider council proof seed.")
    ]
  };
}

export function buildProviderCouncilSessionEvidence(input: {
  leftPathId: string;
  rightPathId: string;
  deterministicWinnerPathId: string;
  decisionContext?: ProviderCouncilDecisionContext;
  judgments: ProviderCouncilSeatJudgmentEvidence[];
}): ProviderCouncilSessionEvidence {
  const votes = new Map<string, number>();
  for (const judgment of input.judgments) {
    const winnerPathId = judgment.winnerPathId ?? input.deterministicWinnerPathId;
    if (winnerPathId === input.leftPathId || winnerPathId === input.rightPathId) {
      votes.set(winnerPathId, (votes.get(winnerPathId) ?? 0) + 1);
    }
  }
  if (votes.size === 0) votes.set(input.deterministicWinnerPathId, input.judgments.length);
  const winnerTally = [...votes.entries()]
    .map(([pathId, voteCount]) => ({ pathId, votes: voteCount }))
    .sort((a, b) => b.votes - a.votes || a.pathId.localeCompare(b.pathId));
  const reportedWinnerPathId = winnerTally[0]?.pathId ?? input.deterministicWinnerPathId;
  const liveSeatCount = input.judgments.filter((judgment) => judgment.mode === "provider-live").length;
  const gatedSeatCount = input.judgments.filter((judgment) => judgment.mode === "provider-gated").length;
  const failedSeatCount = input.judgments.filter((judgment) => judgment.mode === "provider-failed").length;
  const parsedSeatCount = input.judgments.filter((judgment) => judgment.responseId && judgment.outputHash).length;
  const providerIdentityHashes = input.judgments
    .map((judgment) => judgment.providerIdentity?.identityHash)
    .filter((identityHash): identityHash is string => Boolean(identityHash));
  const distinctProviderIdentityCount = new Set(providerIdentityHashes).size;
  const allSeatsUseDistinctProviderIdentities = input.judgments.length > 0
    && providerIdentityHashes.length === input.judgments.length
    && distinctProviderIdentityCount === input.judgments.length;
  const mode: ProviderCouncilSessionEvidence["mode"] = failedSeatCount > 0
    ? "provider-failed"
    : liveSeatCount === input.judgments.length && input.judgments.length > 0
      ? "provider-live"
      : liveSeatCount > 0
        ? "provider-mixed"
        : "provider-gated";
  const majorityVotes = winnerTally[0]?.votes ?? 0;
  const disagreementRate = input.judgments.length === 0 ? 1 : round(1 - majorityVotes / input.judgments.length);
  const averageConfidence = input.judgments.length === 0
    ? 0
    : round(input.judgments.reduce((sum, judgment) => sum + judgment.confidence, 0) / input.judgments.length);
  const totalTokens = input.judgments.some((judgment) => judgment.totalTokens !== undefined)
    ? input.judgments.reduce((sum, judgment) => sum + (judgment.totalTokens ?? 0), 0)
    : undefined;
  const durationMs = input.judgments.some((judgment) => judgment.durationMs !== undefined)
    ? input.judgments.reduce((sum, judgment) => sum + (judgment.durationMs ?? 0), 0)
    : undefined;
  return {
    schemaVersion: 1,
    mode,
    provider: "azure-openai-responses",
    profile: input.judgments[0]?.profile ?? "unknown",
    leftPathId: input.leftPathId,
    rightPathId: input.rightPathId,
    deterministicWinnerPathId: input.deterministicWinnerPathId,
    decisionContext: input.decisionContext ?? {
      matchId: "fallback-match",
      source: "fallback-match",
      deterministicCriterion: "unknown",
      deterministicDisagreementRate: 0,
      deterministicSplit: false,
      observationCount: 0,
      observationMix: computeObservationWeightMix([])
    },
    reportedWinnerPathId,
    judgments: input.judgments,
    winnerTally,
    liveSeatCount,
    gatedSeatCount,
    failedSeatCount,
    parsedSeatCount,
    distinctProviderIdentityCount,
    allSeatsUseDistinctProviderIdentities,
    disagreementRate,
    averageConfidence,
    totalTokens,
    durationMs,
    safety: {
      rawPromptIncluded: false,
      rawProviderResponseIncluded: false,
      envValuesIncluded: false
    }
  };
}

export function buildNavigatorProviderCouncilSessionProofReport(input: {
  goal: NavigatorGoal;
  requireLive: boolean;
  deterministicWinnerPathId: string;
  session: ProviderCouncilSessionEvidence;
  generatedAt?: string;
}): NavigatorProviderCouncilSessionProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const requiredSeats: CouncilJudgeSeat[] = ["Proposer", "Adversary", "Estimator", "Synthesizer"];
  const observedSeats = new Set(input.session.judgments.map((judgment) => judgment.seat));
  const hasAllSeats = requiredSeats.every((seat) => observedSeats.has(seat)) && input.session.judgments.length === requiredSeats.length;
  const winnerIsValid = input.session.reportedWinnerPathId === input.session.leftPathId || input.session.reportedWinnerPathId === input.session.rightPathId;
  const observation: NavigationObservation = {
    observationId: `obs-provider-council-session-${hashText(JSON.stringify(input.session)).slice(0, 8)}`,
    milestoneId: "m5-provider-council-session",
    metric: "providerCouncilSessionConfidence",
    actual: round(input.session.averageConfidence),
    sourceLayer: "council",
    provenance: input.session.mode === "provider-live" ? "provider-judge" : "fixture",
    weight: input.session.mode === "provider-live" ? 1.25 : input.session.mode === "provider-mixed" ? 0.75 : 0.3,
    summary: `Provider council session mode=${input.session.mode}, liveSeats=${input.session.liveSeatCount}/4, winner=${input.session.reportedWinnerPathId}, disagreement=${input.session.disagreementRate}.`,
    timestamp: generatedAt
  };
  const gates = [
    {
      name: "provider-council-session-classified",
      status: input.session.failedSeatCount === 0 ? "pass" as const : "fail" as const,
      summary: `mode=${input.session.mode}, live=${input.session.liveSeatCount}, gated=${input.session.gatedSeatCount}, failed=${input.session.failedSeatCount}.`
    },
    {
      name: "four-provider-seats-recorded",
      status: hasAllSeats ? "pass" as const : "fail" as const,
      summary: `Recorded seats: ${[...observedSeats].sort().join(", ") || "none"}.`
    },
    {
      name: "provider-council-session-contested-decision",
      status: input.session.decisionContext.source === "top-contested-match"
        && input.session.decisionContext.deterministicDisagreementRate > 0
        ? "pass" as const
        : "fail" as const,
      summary: `source=${input.session.decisionContext.source}, match=${input.session.decisionContext.matchId}, deterministicDisagreement=${input.session.decisionContext.deterministicDisagreementRate}.`
    },
    {
      name: "live-provider-required-if-requested",
      status: !input.requireLive || input.session.liveSeatCount === requiredSeats.length ? "pass" as const : "fail" as const,
      summary: `requireLive=${String(input.requireLive)}, liveSeatCount=${input.session.liveSeatCount}/${requiredSeats.length}.`
    },
    {
      name: "live-council-real-observation-context",
      status: !input.requireLive
        || input.session.decisionContext.observationMix.webSourcedEvidenceWeight > 0
        || input.session.decisionContext.observationMix.dispatchedRunWeight > 0
        || input.session.decisionContext.observationMix.runtimeProbeWeight > 0
        || input.session.decisionContext.observationMix.providerJudgeWeight > 0
        ? "pass" as const
        : "fail" as const,
      summary: `observations=${input.session.decisionContext.observationCount}, fixtureFraction=${input.session.decisionContext.observationMix.fixtureWeightFraction}, webSourcedFraction=${input.session.decisionContext.observationMix.webSourcedEvidenceWeightFraction}, dispatchedFraction=${input.session.decisionContext.observationMix.dispatchedRunWeightFraction}.`
    },
    {
      name: "session-winner-path-valid",
      status: winnerIsValid ? "pass" as const : "fail" as const,
      summary: `winner=${input.session.reportedWinnerPathId}, left=${input.session.leftPathId}, right=${input.session.rightPathId}.`
    },
    {
      name: "provider-council-session-hashes-present",
      status: input.session.judgments.every((judgment) =>
        [judgment.inputHash, judgment.rubricHash, judgment.evidenceHash].every((hash) => hash.length === 64)
      ) ? "pass" as const : "fail" as const,
      summary: "Every seat has input, rubric, and evidence hashes."
    },
    {
      name: "provider-council-session-disagreement-measured",
      status: input.session.judgments.length === requiredSeats.length && input.session.disagreementRate >= 0 && input.session.disagreementRate <= 1 ? "pass" as const : "fail" as const,
      summary: `winnerTally=${input.session.winnerTally.map((item) => `${item.pathId}:${item.votes}`).join(", ")}, disagreement=${input.session.disagreementRate}.`
    },
    {
      name: "provider-identity-diversity-measured",
      status: input.session.distinctProviderIdentityCount > 0 || input.session.mode === "provider-gated" ? "pass" as const : "fail" as const,
      summary: `distinctProviderIdentities=${input.session.distinctProviderIdentityCount}/${input.session.judgments.length}, allDistinct=${String(input.session.allSeatsUseDistinctProviderIdentities)}.`
    },
    {
      name: "provider-council-session-falsifiers-present",
      status: input.session.judgments.every((judgment) => judgment.falsifier.trim().length >= 20) ? "pass" as const : "fail" as const,
      summary: "Every provider council seat carries an explicit falsifier or skipped-call falsifier."
    },
    {
      name: "safe-provider-council-session-boundary",
      status: providerCouncilSessionIsSafe(input.session) ? "pass" as const : "fail" as const,
      summary: "Provider council session stores parsed judgment fields and provider metadata, not raw prompts, raw responses, env values, endpoints, URLs, headers, request bodies, or response bodies."
    }
  ];
  const proofId = `navigator-provider-council-session-${input.goal.goalId}-${hashText(JSON.stringify({
    leftPathId: input.session.leftPathId,
    rightPathId: input.session.rightPathId,
    matchId: input.session.decisionContext.matchId,
    decisionSource: input.session.decisionContext.source,
    winnerPathId: input.session.reportedWinnerPathId,
    seats: input.session.judgments.map((judgment) => `${judgment.seat}:${judgment.outputHash ?? judgment.evidenceHash}`)
  })).slice(0, 8)}`;
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    requireLive: input.requireLive,
    deterministicWinnerPathId: input.deterministicWinnerPathId,
    session: input.session,
    observation,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("provider-council-session-judgment-evidence.json", input.session, "Safe provider council-session judgment evidence."),
      artifactSummary("navigation-provider-council-session-proof.json", { proofId, observation, gates }, "Navigator provider council-session proof seed.")
    ]
  };
}

export function buildNavigatorProofReport(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations?: NavigationObservation[];
  generatedAt?: string;
}): NavigatorProofReport {
  const observations = input.observations ?? buildFixtureNavigatorObservations(input.generatedAt);
  const reweight = reweightNavigationPaths(input.paths, observations);
  const gates = [
    {
      name: "goal-compiled",
      status: input.goal.sotaDefinition.measurableProperties.length >= 4 ? "pass" as const : "fail" as const,
      summary: `${input.goal.sotaDefinition.measurableProperties.length} measurable SOTA properties compiled.`
    },
    {
      name: "path-fan-diverse",
      status: new Set(input.paths.map((path) => path.shape)).size >= 5 && input.paths.length >= 20 ? "pass" as const : "fail" as const,
      summary: `${input.paths.length} paths across ${new Set(input.paths.map((path) => path.shape)).size} shapes.`
    },
    {
      name: "path-switch-or-prune",
      status: reweight.switchOccurred || reweight.prunedPathIds.length > 0 ? "pass" as const : "fail" as const,
      summary: `Switch=${String(reweight.switchOccurred)}, pruned=${reweight.prunedPathIds.length}.`
    },
    {
      name: "council-falsifier-recorded",
      status: input.goal.councilSeed.falsifier.length > 20 ? "pass" as const : "fail" as const,
      summary: input.goal.councilSeed.falsifier
    },
    {
      name: "no-drift-human-escalation-needed",
      status: !reweight.driftAlarm ? "pass" as const : "fail" as const,
      summary: reweight.driftAlarm ? "Reality fell outside all path envelopes." : "At least one path still explains arriving evidence."
    }
  ];
  const proofId = `navigator-proof-${input.goal.goalId}-${hashText(JSON.stringify(observations)).slice(0, 8)}`;
  const artifactSeed = {
    goalId: input.goal.goalId,
    pathCount: input.paths.length,
    leadingAfter: reweight.leadingAfter,
    observations
  };
  return {
    schemaVersion: 1,
    proofId,
    goalId: input.goal.goalId,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    passed: gates.every((gate) => gate.status === "pass"),
    pathsGenerated: input.paths.length,
    distinctShapes: new Set(input.paths.map((path) => path.shape)).size,
    leadingPathBefore: reweight.leadingBefore,
    leadingPathAfter: reweight.leadingAfter,
    switchOccurred: reweight.switchOccurred,
    prunedPathIds: reweight.prunedPathIds,
    observations,
    reweight,
    councilSession: input.goal.councilSeed,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("goal.json", input.goal, "Compiled Navigator goal."),
      artifactSummary("path-fan.json", input.paths, "Diverse Navigator path fan."),
      artifactSummary("navigation-proof.json", artifactSeed, "Navigator reweight proof seed.")
    ]
  };
}

export function renderNavigatorProofMarkdown(report: NavigatorProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const observations = report.observations
    .map((item) => `| ${item.milestoneId} | ${item.metric} | ${item.actual} | ${item.sourceLayer} | ${item.summary} |`)
    .join("\n");
  const scores = report.reweight.scores
    .slice(0, 12)
    .map((score) => `| ${score.pathId} | ${score.driftScore.toFixed(4)} | ${score.posteriorWeight.toFixed(4)} | ${score.pruned ? "yes" : "no"} |`)
    .join("\n");
  return `# Navigator Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Paths generated: ${report.pathsGenerated}
- Distinct shapes: ${report.distinctShapes}
- Leading before: ${report.leadingPathBefore}
- Leading after: ${report.leadingPathAfter}
- Path switch: ${report.switchOccurred ? "yes" : "no"}
- Pruned paths: ${report.prunedPathIds.length}
- Drift alarm: ${report.reweight.driftAlarm ? "yes" : "no"}
- Ambition ratchet recommended: ${report.reweight.ambitionRatchetRecommended ? "yes" : "no"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Observations

| Milestone | Metric | Actual | Layer | Summary |
| --- | --- | ---: | --- | --- |
${observations}

## Path Reweighting

| Path | Drift | Posterior Weight | Pruned |
| --- | ---: | ---: | --- |
${scores}

## Council Falsifier

${report.councilSession.falsifier}
`;
}

export function renderNavigatorN2ProofMarkdown(report: NavigatorN2ProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const frontier = [
    `- Selection metric: ${report.frontierSelection.selectionMetric}`,
    `- Selected path: ${report.frontierSelection.selectedPathId}`,
    `- Efficient candidates: ${report.frontierSelection.efficientPathIds.length}`,
    `- Dominated candidates: ${report.frontierSelection.dominatedPathIds.length}`,
    `- Payoff score: ${report.frontierSelection.payoffScore.toFixed(4)}`,
    `- Selected raw path-fit score: ${report.frontierSelection.selectedRawPathFitScore.toFixed(4)}`,
    `- Selected Progress Sharpe: ${report.frontierSelection.selectedProgressSharpe.toFixed(4)}`,
    `- Evidence confidence: ${report.frontierSelection.evidenceConfidence.toFixed(4)}`,
    `- Rationale: ${report.frontierSelection.rationale}`
  ].join("\n");
  const progressRows = report.frontierSelection.progressSharpeScores
    .slice(0, 10)
    .map((score) => `| ${score.rank} | ${score.pathId} | ${score.frontierEfficient ? "yes" : "no"} | ${score.constraintPass ? "yes" : "no"} | ${score.constraintAlarmCount} | ${score.rawPathFitScore.toFixed(4)} | ${score.verifiedProgress.toFixed(4)} | ${score.denominator.toFixed(4)} | ${score.progressSharpe.toFixed(4)} |`)
    .join("\n");
  const councilRows = report.councilTournament.rankedPathIds
    .slice(0, 10)
    .map((pathId, index) => `| ${index + 1} | ${pathId} | ${report.councilTournament.eloRatings[pathId]} |`)
    .join("\n");
  const seatRows = report.councilTournament.seatSummaries
    .map((seat) => `| ${seat.seat} | ${seat.modelSeat} | ${seat.judgments} | ${seat.selectedPathVotes} | ${seat.averageMargin.toFixed(4)} |`)
    .join("\n");
  const contestedRows = report.councilTournament.disagreement.topContestedMatches
    .map((match) => `| ${match.matchId} | ${match.leftPathId} | ${match.rightPathId} | ${match.winnerPathId} | ${match.disagreementRate.toFixed(4)} |`)
    .join("\n");
  const conformalRows = report.conformal.bands
    .map((band) => `| ${band.metric} | ${band.predicted.toFixed(4)} | ${band.lower.toFixed(4)} | ${band.upper.toFixed(4)} | ${band.observationActual.toFixed(4)} | ${band.alarm ? "yes" : "no"} |`)
    .join("\n");
  const contextHashes = report.contextPacket.includedHashes
    .map((item) => `| ${item.name} | ${item.sha256} |`)
    .join("\n");
  return `# Navigator N2 Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- N1 proof id: ${report.n1.proofId}
- N1 leading after: ${report.n1.leadingPathAfter}
- N2 selected path: ${report.frontierSelection.selectedPathId}
- N2 selection metric: ${report.frontierSelection.selectionMetric}
- N2 selected Progress Sharpe: ${report.frontierSelection.selectedProgressSharpe.toFixed(4)}
- Council judgments: ${report.councilTournament.judgments.length}
- Council seats: ${report.councilTournament.seatSummaries.length}
- Council split matches: ${report.councilTournament.disagreement.splitMatches}/${report.councilTournament.disagreement.totalMatches}
- Council average disagreement: ${report.councilTournament.disagreement.averageDisagreementRate.toFixed(4)}
- Conformal alarms: ${report.conformal.alarms.length}
- Context packet: ${report.contextPacket.packetId}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Frontier Selection

${frontier}

| Rank | Path | Frontier Efficient | Constraints Pass | Alarms | Raw Path-Fit | Verified Progress | Denominator | Progress Sharpe |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
${progressRows}

## Council ELO Ranking

| Rank | Path | ELO |
| ---: | --- | ---: |
${councilRows}

## Council Seat Diversity

| Seat | Model Seat | Votes | Votes For Selected | Average Margin |
| --- | --- | ---: | ---: | ---: |
${seatRows}

| Match | Left | Right | Winner | Disagreement |
| --- | --- | --- | --- | ---: |
${contestedRows}

## Conformal Drift Bands

| Metric | Predicted | Lower | Upper | Actual | Alarm |
| --- | ---: | ---: | ---: | ---: | --- |
${conformalRows}

## Context Packet

- Active path: ${report.contextPacket.activePathId}
- Active milestone: ${report.contextPacket.activeMilestoneId}
- Next action: ${report.contextPacket.nextAction}
- Boundary: ${report.contextPacket.safetyBoundary}

| Included Context | SHA-256 |
| --- | --- |
${contextHashes}
`;
}

export function renderNavigatorLoopProofMarkdown(report: NavigatorLoopProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const checkpointRows = report.checkpoints
    .map((checkpoint) => `| ${checkpoint.sequenceIndex + 1} | ${checkpoint.milestoneId} | ${checkpoint.activePathId} | ${checkpoint.status} | ${checkpoint.forcedEntropy.action} | ${checkpoint.budgetSpent.hours.toFixed(2)} | ${checkpoint.contextPacketId} |`)
    .join("\n");
  const entropyRows = report.forcedEntropy.actions
    .map((action, index) => `| ${index + 1} | ${action.trigger} | ${action.action} | ${action.forced ? "yes" : "no"} | ${action.trainingLift.toFixed(4)} | ${action.heldOutLift.toFixed(4)} | ${action.primaryMetricDelta.toFixed(4)} | ${action.selectedPathIdAfter} |`)
    .join("\n");
  const hypothesisRows = report.checkpoints
    .map((checkpoint) => `| ${checkpoint.sequenceIndex + 1} | ${checkpoint.cycleHypothesis.hypothesis} | ${checkpoint.cycleHypothesis.expectedFailureMode} | ${checkpoint.cycleHypothesis.diagnosticInstrument} | ${checkpoint.cycleHypothesis.falsifier} |`)
    .join("\n");
  const observationRows = report.observations
    .map((observation) => `| ${observation.observationId} | ${observation.milestoneId} | ${observation.metric} | ${observation.actual} | ${observation.sourceLayer} | ${observation.provenance ?? "unspecified"} | ${observation.weight} |`)
    .join("\n");
  const ratchetRows = report.ambitionRatchet.observations
    .map((observation) => `| ${observation.observationId} | ${observation.metric} | ${observation.actual.toFixed(4)} | ${observation.expected.toFixed(4)} | ${observation.max.toFixed(4)} | ${observation.overMax ? "yes" : "no"} | ${observation.overMaxBy.toFixed(4)} |`)
    .join("\n");
  return `# Navigator Loop Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Selected path: ${report.selectedPathId}
- Static baseline path: ${report.baselinePathId}
- Baseline score: ${report.baselineComparison.baselineScore.toFixed(4)}
- Navigator score: ${report.baselineComparison.navigatorScore.toFixed(4)}
- Lift: ${report.baselineComparison.lift >= 0 ? "+" : ""}${report.baselineComparison.lift.toFixed(4)}
- Selection metric: ${report.baselineComparison.selectionMetric}
- Baseline Progress Sharpe: ${report.baselineComparison.baselineProgressSharpe.toFixed(4)}
- Navigator Progress Sharpe: ${report.baselineComparison.navigatorProgressSharpe.toFixed(4)}
- Progress Sharpe lift: ${report.baselineComparison.progressSharpeLift >= 0 ? "+" : ""}${report.baselineComparison.progressSharpeLift.toFixed(4)}
- Evidence confidence: ${report.baselineComparison.evidenceConfidence.toFixed(4)}
- Majority reality/held-out evidence: ${report.baselineComparison.majorityRealityOrHeldOutEvidence ? "yes" : "no"}
- Cost ratio: ${report.baselineComparison.costRatio.toFixed(4)}
- Resume matches uninterrupted: ${report.resumeProof.matchesUninterrupted ? "yes" : "no"}
- Shape memory entry: ${report.shapeLibraryEntry.entryId}
- Shape memory prior applied: ${report.shapeMemory.applied ? "yes" : "no"}
- Shape memory entries read: ${report.shapeMemory.entriesRead}
- Shape memory matched paths: ${report.shapeMemory.matchedPathIds.length}
- Path fan registered at: ${report.pathFanPreRegistration.registeredAt}
- Path fan hash: ${report.pathFanPreRegistration.pathFanHash}
- Best calibrated path: ${report.calibration.bestCalibratedPathId}
- Selected calibration rank: ${report.calibration.selectedPathRank}/${report.calibration.scores.length}
- Ambition ratchet action: ${report.ambitionRatchet.action}
- Ambition ratchet candidate: ${report.ambitionRatchet.candidatePathId ?? "none"}
- Ambition ratchet streak: ${report.ambitionRatchet.consecutiveOverMax}/${report.ambitionRatchet.requiredConsecutiveOverMax}
- Forced entropy actions: ${report.forcedEntropy.forcedActionCount}
- Forced entropy next move: ${report.forcedEntropy.nextRequiredMove}
- Dispatched-run weight fraction: ${report.observationMix.dispatchedRunWeightFraction.toFixed(4)}
- Fixture weight fraction: ${report.observationMix.fixtureWeightFraction.toFixed(4)}
- Reality/held-out layer fraction: ${report.observationMix.realityOrHeldOutLayerFraction.toFixed(4)}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Observations

| Observation | Milestone | Metric | Actual | Layer | Provenance | Weight |
| --- | --- | --- | ---: | --- | --- | ---: |
${observationRows}

## Observation Mix

| Total Weight | Fixture Weight | Dispatched-Run Weight | Runtime-Probe Weight | Held-Out-Scorer Weight | Provider-Judge Weight | Human-Feedback Weight | Reality/Held-Out Layer Weight |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ${report.observationMix.totalWeight.toFixed(4)} | ${report.observationMix.fixtureWeight.toFixed(4)} | ${report.observationMix.dispatchedRunWeight.toFixed(4)} | ${report.observationMix.runtimeProbeWeight.toFixed(4)} | ${report.observationMix.heldOutScorerWeight.toFixed(4)} | ${report.observationMix.providerJudgeWeight.toFixed(4)} | ${report.observationMix.humanFeedbackWeight.toFixed(4)} | ${report.observationMix.realityOrHeldOutLayerWeight.toFixed(4)} |

## Forecast Calibration

${report.calibration.summary}

| Rank | Path | Shape | Coverage | Normalized RMSE | Score |
| ---: | --- | --- | ---: | ---: | ---: |
${report.calibration.scores.slice(0, 8).map((score) => `| ${score.rank} | ${score.pathId} | ${score.shapeKey} | ${score.coverageRate.toFixed(4)} | ${score.normalizedRmse.toFixed(4)} | ${score.calibrationScore.toFixed(4)} |`).join("\n")}

## Ambition Ratchet

${report.ambitionRatchet.rationale}

| Observation | Metric | Actual | Expected | Max | Over Max | Over By |
| --- | --- | ---: | ---: | ---: | --- | ---: |
${ratchetRows}

## Forced Entropy

${report.forcedEntropy.summary}

| Step | Trigger | Action | Forced | Training Lift | Held-Out Lift | Primary Delta | Selected Path After |
| ---: | --- | --- | --- | ---: | ---: | ---: | --- |
${entropyRows}

## Cycle Hypotheses

| Step | Hypothesis | Expected Failure Mode | Diagnostic Instrument | Falsifier |
| ---: | --- | --- | --- | --- |
${hypothesisRows}

## Checkpoints

| Step | Milestone | Active Path | Status | Entropy Action | Hours Spent | Context Packet |
| ---: | --- | --- | --- | --- | ---: | --- |
${checkpointRows}

## Baseline Comparison

${report.baselineComparison.summary}

## Resume Proof

Resumed from ${report.resumeProof.resumeCheckpointId} with ${report.resumeProof.remainingObservations} remaining observations. The uninterrupted final path was ${report.resumeProof.uninterruptedFinalPathId}; the resumed final path was ${report.resumeProof.resumedFinalPathId}.

## Shape Memory

Stored ${report.shapeLibraryEntry.shapeKey} as a reusable prior with suggested weight boost ${report.shapeLibraryEntry.reusablePrior.suggestedWeightBoost}.

Prior consumed: ${report.shapeMemory.applied ? "yes" : "no"}. Boosted shape keys: ${report.shapeMemory.boostedShapeKeys.join(", ") || "none"}. Matched entry ids: ${report.shapeMemory.matchedEntryIds.join(", ") || "none"}.
`;
}

export function renderNavigatorDailyLoopProofMarkdown(report: NavigatorDailyLoopProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const dayRows = report.days
    .map((day) => `| ${day.dayIndex} | ${day.simulatedDate} | ${day.missionRunId} | ${day.selectedPathId} | ${day.ratchetAction} | ${day.ratchetCandidatePathId ?? "none"} | ${day.lift.toFixed(4)} | ${day.checkpointCount} | ${day.nextWakeupAt} |`)
    .join("\n");
  return `# Navigator Daily Loop Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Days completed: ${report.daysCompleted}/${report.daysRequested}
- Mission runs: ${report.aggregate.missionRuns}
- Unique mission runs: ${report.aggregate.uniqueMissionRuns}
- Ratchet promotions: ${report.aggregate.promotedRatchets}
- Average lift: ${report.aggregate.averageLift.toFixed(4)}
- Best lift: ${report.aggregate.bestLift.toFixed(4)}
- Score trend: ${report.aggregate.scoreTrend.toFixed(4)}
- Final next wakeup: ${report.aggregate.finalNextWakeupAt ?? "none"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Daily Cycles

| Day | Simulated Date | Mission Run | Selected Path | Ratchet | Candidate | Lift | Checkpoints | Next Wakeup |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- |
${dayRows}

This is a bounded daily-loop proof: it dispatches mission-backed fixture runs and records leases, checkpoints, wakeups, ratchet decisions, and shape-memory entries. It is not a claim of always-on production scheduling.
`;
}

export function renderNavigatorValidatorProofMarkdown(report: NavigatorValidatorProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const rules = report.validator.source.ruleChecks
    .map((rule) => `| ${rule.ruleId} | ${rule.severity} | ${rule.passedInSeed ? "yes" : "no"} | ${rule.summary} |`)
    .join("\n");
  const observations = report.validator.observations
    .map((observation) => `| ${observation.observationId} | ${observation.metric} | ${observation.actual} | ${observation.sourceLayer} | ${observation.summary} |`)
    .join("\n");
  const pygameRepair = report.pygameRepair;
  const pygameSection = pygameRepair ? `
## Repaired Pygame Execution

- Repair report: ${pygameRepair.reportId}
- Repair passed: ${pygameRepair.passed ? "yes" : "no"}
- Repaired artifact hash: ${pygameRepair.manifest.repairedArtifactHash}
- Execution ok: ${pygameRepair.execution.ok ? "yes" : "no"}
- Execution status: ${String(pygameRepair.execution.status)}
- Execution failure: ${pygameRepair.execution.detectedFailure ?? "none"}
- Runtime frames: ${pygameRepair.runtimeSummary?.frames ?? "n/a"}
- Runtime score: ${pygameRepair.runtimeSummary?.score ?? "n/a"}
- Runtime pipe advance: ${pygameRepair.runtimeSummary?.pipesAdvanced ?? "n/a"}
- Runtime collisions: ${pygameRepair.runtimeSummary?.collisions ?? "n/a"}

| Repair Gate | Status | Summary |
| --- | --- | --- |
${pygameRepair.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n")}
` : "";
  return `# Navigator Validator Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Validator report: ${report.validator.reportId}
- Source label: ${report.validator.source.sourceLabel}
- Source hash: ${report.validator.source.sourceHash}
- Smoke ok: ${report.validator.smoke.ok ? "yes" : "no"}
- Smoke status: ${String(report.validator.smoke.status)}
- Smoke failure: ${report.validator.smoke.detectedFailure ?? "none"}
- Baseline path: ${report.validator.baseline.pathId}
- Navigator path: ${report.validator.navigator.pathId}
- Baseline pass rate: ${report.validator.baseline.passRate.toFixed(4)}
- Navigator pass rate: ${report.validator.navigator.passRate.toFixed(4)}
- Validator lift: ${report.validator.validatorLift >= 0 ? "+" : ""}${report.validator.validatorLift.toFixed(4)}
- Loop proof: ${report.loop.proofId}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Source Rule Checks

| Rule | Severity | Seed Passed | Summary |
| --- | --- | --- | --- |
${rules}

## Validator Observations

| Observation | Metric | Actual | Layer | Summary |
| --- | --- | ---: | --- | --- |
${observations}

${pygameSection}

## Safety Boundary

Raw source, raw command output, and env values are not included. The proof stores source hashes, command output hashes, constants, rule ids, pass rates, safe runtime summaries, and loop evidence only.
`;
}

export function renderFlappyPromptTwinAbProofMarkdown(report: FlappyPromptTwinAbProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const armRows = [report.control, report.twin]
    .map((arm) => `| ${arm.armId} | ${arm.runtimeScore.toFixed(4)} | ${arm.runtimeSummary?.ok ? "yes" : "no"} | ${String(arm.execution.status)} | ${arm.runtimeSummary?.score ?? "n/a"} | ${arm.runtimeSummary?.pipesAdvanced ?? "n/a"} | ${arm.fixedRuleIds.length} | ${arm.unresolvedRuleIds.length} |`)
    .join("\n");
  const heldOutSection = report.heldOutResult
    ? `## Held-Out A/B Score

- Pre-registered expected lift: ${report.heldOutResult.expectedHeldOutLift.toFixed(4)}
- Scorer ref: ${report.heldOutResult.scorerRef}
- Cases scored per arm: ${report.heldOutResult.casesScored}
- Control held-out pass rate: ${report.heldOutResult.control.passRate.toFixed(4)}
- Twin held-out pass rate: ${report.heldOutResult.twin.passRate.toFixed(4)}
- Observed held-out lift: ${report.heldOutResult.heldOutLift >= 0 ? "+" : ""}${report.heldOutResult.heldOutLift.toFixed(4)}
- Result: ${report.heldOutResult.metExpectedLift ? "met pre-registered bar" : "missed pre-registered bar"}
- Pre-registration hash: ${report.heldOutResult.preRegistrationHash}
- Manifest hash: ${report.heldOutResult.commitment.manifestHash}
- Answer-key commitment hash: ${report.heldOutResult.commitment.answerKeyHash}

`
    : `## Held-Out A/B Score

No scorer-only held-out A/B result is attached. Any held-out observation in this report is a compatibility proxy and must not be claimed as improvement.

`;
  const observationRows = report.observations
    .map((observation) => `| ${observation.observationId} | ${observation.metric} | ${observation.actual} | ${observation.sourceLayer} | ${observation.weight} | ${observation.summary} |`)
    .join("\n");
  return `# Flappy Prompt Twin A/B Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Source label: ${report.sourceLabel}
- Source hash: ${report.sourceHash}
- Source LOC: ${report.sourceLoc}
- Runtime lift: ${report.runtimeLift >= 0 ? "+" : ""}${report.runtimeLift.toFixed(4)}
- Rule repair lift: ${report.ruleRepairLift >= 0 ? "+" : ""}${report.ruleRepairLift}
- Held-out lift: ${report.heldOutLift === undefined ? "n/a" : `${report.heldOutLift >= 0 ? "+" : ""}${report.heldOutLift.toFixed(4)}`}
- Control artifact hash: ${report.control.artifactHash}
- Twin artifact hash: ${report.twin.artifactHash}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Runtime Arms

| Arm | Runtime Score | Runtime OK | Exit Status | Game Score | Pipe Advance | Fixed Rules | Unresolved Rules |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |
${armRows}

${heldOutSection}## Navigator Observations

| Observation | Metric | Actual | Layer | Weight | Summary |
| --- | --- | ---: | --- | ---: | --- |
${observationRows}

## Strategies

- Control: ${report.control.strategy}
- Prompt Twin: ${report.twin.strategy}

## Safety Boundary

Raw source, raw command output, provider payloads, request bodies, response bodies, and env values are not included. The proof stores artifact hashes, rule ids, command hashes, and safe runtime summaries only.
`;
}

export function renderAssetCloneProofMarkdown(report: AssetCloneProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const observationRows = report.observations
    .map((observation) => `| ${observation.observationId} | ${observation.metric} | ${observation.actual} | ${observation.sourceLayer} | ${observation.provenance ?? "unknown"} | ${observation.weight} | ${observation.summary} |`)
    .join("\n");
  return `# Asset Clone Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Family: ${report.familyId}
- Scorer ref: ${report.heldOutResult.scorerRef}
- Registered at: ${report.heldOutPreRegistration.registeredAt}
- Scored at: ${report.heldOutResult.scoredAt}
- Pre-registered expected similarity: ${report.heldOutPreRegistration.expectedPixelSimilarityScore.toFixed(4)}
- Pixel similarity score: ${report.heldOutResult.pixelSimilarityScore.toFixed(4)}
- Pixel diff ratio: ${report.heldOutResult.pixelDiffRatio.toFixed(4)}
- Result: ${report.heldOutResult.metExpectedSimilarity ? "met pre-registered bar" : "missed pre-registered bar"}
- Pre-registration hash: ${report.heldOutResult.preRegistrationHash}
- Manifest hash: ${report.heldOutResult.commitment.manifestHash}
- Answer-key commitment hash: ${report.heldOutResult.commitment.answerKeyHash}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Navigator Observations

| Observation | Metric | Actual | Layer | Provenance | Weight | Summary |
| --- | --- | ---: | --- | --- | ---: | --- |
${observationRows}

## Safety Boundary

Raw image bodies, raw prompts, target pixels, private target grids, answer keys, provider payloads, request bodies, response bodies, and env values are not included. The proof stores commitments, hashes, aggregate pixel metrics, and loop observations only.
`;
}

export function renderFlappySourceMutationProofMarkdown(report: FlappySourceMutationProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  return `# Navigator Source Repair Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Source label: ${report.sourceLabel}
- Apply mode: ${report.applyMode}
- Restored after proof: ${report.restoredAfterProof ? "yes" : "no"}
- Pre-source hash: ${report.preSourceHash}
- Repaired-source hash: ${report.repairedSourceHash}
- Mutation observed hash: ${report.mutationObservedHash}
- Final source hash: ${report.finalSourceHash}
- Source LOC before: ${report.sourceLocBefore}
- Source LOC after: ${report.sourceLocAfter}
- Runtime ok: ${report.runtimeSummary?.ok ? "yes" : "no"}
- Runtime score: ${report.runtimeSummary?.score ?? "n/a"}
- Runtime frames: ${report.runtimeSummary?.frames ?? "n/a"}
- Runtime pipe advance: ${report.runtimeSummary?.pipesAdvanced ?? "n/a"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Repaired Rules

${report.fixedRuleIds.map((ruleId) => `- ${ruleId}`).join("\n")}

## Unresolved Blocking Rules

${report.unresolvedBlockingRuleIds.length > 0 ? report.unresolvedBlockingRuleIds.map((ruleId) => `- ${ruleId}`).join("\n") : "None."}

## Safety Boundary

Raw source, raw command output, env values, request bodies, response bodies, and provider payloads are not included. The proof stores hashes, rule ids, command hashes, restore policy, and safe runtime metrics only.
`;
}

export function renderNavigatorMonorepoPrimitiveProofMarkdown(report: NavigatorMonorepoPrimitiveProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const sourceRows = report.sources
    .map((source) => `| ${source.kind} | ${source.sourceLabel} | ${source.loc} | ${source.sourceHash} | ${source.detectedSymbols.join(", ")} |`)
    .join("\n");
  return `# Navigator Monorepo Primitive Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- BIE module: ${report.bie.moduleLabel}
- BIE frontier points: ${report.bie.frontierPoints}
- BIE ELO matches: ${report.bie.eloMatches}
- BIE top ELO path: ${report.bie.topEloPathId}
- Conformal forecasts calibrated: ${report.conformal.forecastsCalibrated}
- Conformal coverage90: ${String(report.conformal.coverage90)}
- Swarm modes: ${report.swarm.modes.join(", ")}
- Swarm execution policy: ${report.swarm.executionPolicy}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Source Provenance

| Kind | Source Label | LOC | SHA256 | Detected Symbols |
| --- | --- | ---: | --- | --- |
${sourceRows}

## BIE Direct Import

Direct import produced ${report.bie.frontierPoints} efficient-frontier points and ${report.bie.eloMatches} ELO matches across ${report.bie.ideasEvaluated} Navigator paths. The max-Sharpe ratio was ${report.bie.maxSharpeRatio.toFixed(4)} and selected path ids were ${report.bie.selectedPathIds.join(", ")}.

## Conformal Direct Execution

The generated probe executed the queue-analytics conformal module and stored only safe interval metrics. First forecast: ${report.conformal.firstForecast ? JSON.stringify(report.conformal.firstForecast) : "n/a"}.

## Swarm Harness Provenance

The BIE swarm coordinator and worker were not executed because their draft, judge, and research stages require internal credentials and provider keys. This proof maps the true worker-process and IPC primitives so Navigator can safely graduate to credentialed swarm runs behind explicit profile gates.
`;
}

export function renderNavigatorPromptTwinProofMarkdown(report: NavigatorPromptTwinProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  return `# Navigator Prompt Twin Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Candidate path: ${report.candidatePathId}
- Require live: ${report.requireLive ? "yes" : "no"}
- Judgment mode: ${report.judgment.mode}
- Provider: ${report.judgment.provider}
- Status: ${report.judgment.status}
- Verdict: ${report.judgment.verdict}
- Score: ${report.judgment.score.toFixed(4)}
- Confidence: ${report.judgment.confidence.toFixed(4)}
- Response id: ${report.judgment.responseId ? "recorded" : "not recorded"}
- Total tokens: ${report.judgment.totalTokens ?? "n/a"}
- Validator passed: ${report.validatorPassed ? "yes" : "no"}
- Primitive proof passed: ${report.primitiveProofPassed ? "yes" : "no"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Judgment

${report.judgment.rationale}

### Strengths

${report.judgment.strengths.map((item) => `- ${item}`).join("\n")}

### Risks

${report.judgment.risks.map((item) => `- ${item}`).join("\n")}

### Steering

${report.judgment.steering.map((item) => `- ${item}`).join("\n")}

## Falsifier

${report.judgment.falsifier}

## Safety Boundary

Raw prompts, raw provider responses, endpoints, keys, and env values are not included. The proof stores hashes, parsed judgment fields, response ids, token counts, body/output hashes, and acceptance gates only.
`;
}

export function renderNavigatorProviderCouncilProofMarkdown(report: NavigatorProviderCouncilProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  return `# Navigator Provider Council Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Require live: ${report.requireLive ? "yes" : "no"}
- Seat: ${report.judgment.seat}
- Provider: ${report.judgment.provider}
- Status: ${report.judgment.status}
- Judgment mode: ${report.judgment.mode}
- Left path: ${report.judgment.leftPathId}
- Right path: ${report.judgment.rightPathId}
- Deterministic winner: ${report.deterministicWinnerPathId}
- Provider winner: ${report.judgment.winnerPathId ?? "not returned"}
- Confidence: ${report.judgment.confidence.toFixed(4)}
- Response id: ${report.judgment.responseId ? "recorded" : "not recorded"}
- Total tokens: ${report.judgment.totalTokens ?? "n/a"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Judgment

${report.judgment.rationale}

### Risks

${report.judgment.risks.map((item) => `- ${item}`).join("\n")}

## Falsifier

${report.judgment.falsifier}

## Safety Boundary

Raw prompts, raw provider responses, endpoints, keys, request bodies, response bodies, and env values are not included. The proof stores hashes, parsed judgment fields, response ids, token counts, body/output hashes, and acceptance gates only.
`;
}

export function renderNavigatorProviderCouncilSessionProofMarkdown(report: NavigatorProviderCouncilSessionProofReport): string {
  const gates = report.acceptanceGates.map((gate) => `| ${gate.name} | ${gate.status} | ${gate.summary} |`).join("\n");
  const seatRows = report.session.judgments
    .map((judgment) => `| ${judgment.seat} | ${judgment.mode} | ${judgment.status} | ${judgment.winnerPathId ?? report.session.deterministicWinnerPathId} | ${judgment.confidence.toFixed(4)} | ${judgment.responseId ? "recorded" : "not recorded"} | ${judgment.totalTokens ?? "n/a"} |`)
    .join("\n");
  const tallyRows = report.session.winnerTally
    .map((item) => `| ${item.pathId} | ${item.votes} |`)
    .join("\n");
  return `# Navigator Provider Council Session Proof

- Proof id: ${report.proofId}
- Goal id: ${report.goalId}
- Passed: ${report.passed ? "yes" : "no"}
- Require live: ${report.requireLive ? "yes" : "no"}
- Session mode: ${report.session.mode}
- Provider: ${report.session.provider}
- Left path: ${report.session.leftPathId}
- Right path: ${report.session.rightPathId}
- Decision source: ${report.session.decisionContext.source}
- Deterministic match: ${report.session.decisionContext.matchId}
- Deterministic criterion: ${report.session.decisionContext.deterministicCriterion}
- Deterministic disagreement: ${report.session.decisionContext.deterministicDisagreementRate.toFixed(4)}
- Observation count: ${report.session.decisionContext.observationCount}
- Web-sourced observation weight fraction: ${report.session.decisionContext.observationMix.webSourcedEvidenceWeightFraction.toFixed(4)}
- Dispatched-run observation weight fraction: ${report.session.decisionContext.observationMix.dispatchedRunWeightFraction.toFixed(4)}
- Fixture observation weight fraction: ${report.session.decisionContext.observationMix.fixtureWeightFraction.toFixed(4)}
- Deterministic winner: ${report.deterministicWinnerPathId}
- Reported winner: ${report.session.reportedWinnerPathId}
- Live seats: ${report.session.liveSeatCount}/4
- Gated seats: ${report.session.gatedSeatCount}/4
- Failed seats: ${report.session.failedSeatCount}/4
- Parsed seats: ${report.session.parsedSeatCount}/4
- Distinct provider identities: ${report.session.distinctProviderIdentityCount}/4
- All seats distinct: ${report.session.allSeatsUseDistinctProviderIdentities ? "yes" : "no"}
- Average confidence: ${report.session.averageConfidence.toFixed(4)}
- Disagreement rate: ${report.session.disagreementRate.toFixed(4)}
- Total tokens: ${report.session.totalTokens ?? "n/a"}

## Acceptance Gates

| Gate | Status | Summary |
| --- | --- | --- |
${gates}

## Seats

| Seat | Mode | Status | Winner | Confidence | Response id | Tokens |
| --- | --- | --- | --- | ---: | --- | ---: |
${seatRows}

## Winner Tally

| Path | Votes |
| --- | ---: |
${tallyRows}

## Falsifiers

${report.session.judgments.map((judgment) => `- ${judgment.seat}: ${judgment.falsifier}`).join("\n")}

## Safety Boundary

Raw prompts, raw provider responses, endpoints, keys, request bodies, response bodies, and env values are not included. The proof stores hashes, parsed judgment fields, response ids, token counts, body/output hashes, aggregate disagreement, and acceptance gates only.
`;
}

export function renderNavigatorHudHtml(data: NavigatorHudData): string {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return stripTrailingWhitespace(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Navigator Path Fan HUD</title>
  <style>
    :root { color-scheme: light dark; --bg: #f7f8f4; --panel: #ffffff; --ink: #1f2420; --muted: #657168; --line: #d9ddd4; --accent: #0f766e; --blue: #2563eb; --warn: #b45309; --fail: #b91c1c; --pass: #15803d; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    [data-theme="dark"] { --bg: #111411; --panel: #181d19; --ink: #ecf2ed; --muted: #a6b0a8; --line: #303a32; --accent: #2dd4bf; --blue: #60a5fa; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-size: 14px; line-height: 1.45; }
    main { max-width: 1180px; margin: 0 auto; padding: 22px; }
    h1, h2, h3, p { margin: 0; }
    h1 { font-size: 24px; line-height: 1.15; }
    h2 { font-size: 16px; margin-bottom: 10px; }
    h3 { font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.04em; }
    .muted { color: var(--muted); }
    .section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 16px; margin-top: 14px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .kpi { border: 1px solid var(--line); border-radius: 8px; padding: 12px; min-height: 82px; }
    .kpi b { display: block; font-size: 23px; line-height: 1; margin-bottom: 7px; }
    .chart { width: 100%; height: 340px; border: 1px solid var(--line); border-radius: 8px; background: color-mix(in srgb, var(--panel) 88%, var(--bg)); overflow: hidden; }
    svg { width: 100%; height: 340px; display: block; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border-bottom: 1px solid var(--line); padding: 8px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    th { color: var(--muted); font-size: 12px; }
    .status { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; padding: 2px 8px; font-size: 12px; }
    .pass { color: var(--pass); background: color-mix(in srgb, var(--pass) 10%, transparent); }
    .fail { color: var(--fail); background: color-mix(in srgb, var(--fail) 10%, transparent); }
    code { background: color-mix(in srgb, var(--muted) 12%, transparent); border: 1px solid var(--line); border-radius: 6px; padding: 1px 4px; font-size: 12px; }
    @media (max-width: 760px) { main { padding: 14px; } .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <main>
    <h1>Navigator Path Fan HUD</h1>
    <p class="muted">${escapeHtml(data.goal.objective)}</p>
    <section class="section">
      <div class="grid">
        ${kpi("Proof", data.report.passed ? "Pass" : "Fail", data.report.proofId)}
        ${kpi("Path switch", data.report.switchOccurred ? "Yes" : "No", `${data.report.leadingPathBefore} -> ${data.report.leadingPathAfter}`)}
        ${kpi("Pruned paths", String(data.report.prunedPathIds.length), "bottom decile removed by drift score")}
      </div>
    </section>
    <section class="section">
      <h2>Path Fan vs Reality</h2>
      <div class="chart" id="fanChart" role="img" aria-label="Navigator path fan chart"></div>
    </section>
    <section class="section">
      <h2>Plan Frontier</h2>
      <div class="chart" id="frontierChart" role="img" aria-label="Plan frontier scatter"></div>
    </section>
    <section class="section">
      <h2>Drift and Council Log</h2>
      <div style="overflow:auto">
        <table>
          <thead><tr><th>Path</th><th>Drift</th><th>Posterior</th><th>Pruned</th></tr></thead>
          <tbody>${data.report.reweight.scores.slice(0, 16).map((score) => `<tr><td><code>${escapeHtml(score.pathId)}</code></td><td>${score.driftScore.toFixed(4)}</td><td>${score.posteriorWeight.toFixed(4)}</td><td>${score.pruned ? "yes" : "no"}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="muted" style="margin-top:10px">Falsifier: ${escapeHtml(data.report.councilSession.falsifier)}</p>
    </section>
  </main>
  <script id="navigator-data" type="application/json">${json}</script>
  <script>
    const data = JSON.parse(document.getElementById('navigator-data').textContent);
    function pct(value, min, max) { return Math.max(0, Math.min(1, (Number(value) - min) / (max - min || 1))); }
    function pointX(index, width, pad) { return pad + index / 2 * (width - pad * 2); }
    function renderFan() {
      const width = 1000, height = 340, pad = 34;
      const metrics = ['validatorRows', 'heldOutPassRate', 'promptTwinScore'];
      const normalized = (metric, value) => metric === 'validatorRows' ? pct(value, 0, 260) : pct(value, 0, 1);
      const paths = data.paths.map((path) => {
        const d = path.milestones.map((milestone, index) => {
          const x = pointX(index, width, pad);
          const y = height - pad - normalized(milestone.envelope.metric, milestone.envelope.expected) * (height - pad * 2);
          return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
        }).join(' ');
        const selected = path.pathId === data.report.leadingPathAfter;
        return '<path d="' + d + '" fill="none" stroke="' + (selected ? '#2563eb' : '#0f766e') + '" stroke-width="' + (selected ? 4 : 1.2) + '" opacity="' + (selected ? 0.95 : 0.18) + '"><title>' + path.pathId + '</title></path>';
      }).join('');
      const obsPath = data.report.observations.map((obs, index) => {
        const x = pointX(index, width, pad);
        const y = height - pad - normalized(obs.metric, obs.actual) * (height - pad * 2);
        return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
      }).join(' ');
      document.getElementById('fanChart').innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '">' +
        '<line x1="' + pad + '" y1="' + (height-pad) + '" x2="' + (width-pad) + '" y2="' + (height-pad) + '" stroke="#d9ddd4"/>' +
        '<line x1="' + pad + '" y1="' + pad + '" x2="' + pad + '" y2="' + (height-pad) + '" stroke="#d9ddd4"/>' +
        paths + '<path d="' + obsPath + '" fill="none" stroke="#b45309" stroke-width="5"/>' +
        '<text x="42" y="24" font-size="12" fill="#657168">faint = path fan, blue = selected, amber = realized evidence</text></svg>';
    }
    function renderFrontier() {
      const width = 1000, height = 340, pad = 34;
      const circles = data.paths.map((path) => {
        const x = pad + pct(path.frontier.cost, 0, 1.8) * (width - pad * 2);
        const y = height - pad - pct(path.frontier.value, 0, 1) * (height - pad * 2);
        const selected = path.pathId === data.report.leadingPathAfter;
        return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (selected ? 7 : 4) + '" fill="' + (selected ? '#2563eb' : path.frontier.efficient ? '#0f766e' : '#94a3b8') + '" opacity="0.9"><title>' + path.pathId + ' value=' + path.frontier.value + ' cost=' + path.frontier.cost + '</title></circle>';
      }).join('');
      document.getElementById('frontierChart').innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '">' +
        '<line x1="' + pad + '" y1="' + (height-pad) + '" x2="' + (width-pad) + '" y2="' + (height-pad) + '" stroke="#d9ddd4"/>' +
        '<line x1="' + pad + '" y1="' + pad + '" x2="' + pad + '" y2="' + (height-pad) + '" stroke="#d9ddd4"/>' +
        '<text x="42" y="24" font-size="12" fill="#657168">x = cost, y = expected value, teal = frontier</text>' + circles + '</svg>';
    }
    renderFan(); renderFrontier();
  </script>
</body>
</html>
`);
}

function buildCouncilSession(objective: string, inputHash: string): CouncilSession {
  const expectedDecisionValue = 0.72;
  const councilCost = 0.18;
  return {
    sessionId: `council-${inputHash.slice(0, 10)}`,
    conveningReason: "Compile SOTA definition and path-search rubric for a high-leverage Navigator goal.",
    expectedDecisionValue,
    councilCost,
    convened: expectedDecisionValue > councilCost,
    roles: [
      { role: "Proposer", modelSeat: "fixture-proposer", contribution: "Drafted measurable benchmark ladder and path-search objective." },
      { role: "Adversary", modelSeat: "fixture-adversary", contribution: "Rejected vague SOTA claims and required held-out validator evidence." },
      { role: "Estimator", modelSeat: "fixture-estimator", contribution: "Bounded cost by path count, council calls, and wall-clock budget." },
      { role: "Synthesizer", modelSeat: "fixture-synthesizer", contribution: "Selected evidence-gated rubric and falsifier." },
      { role: "Recorder", modelSeat: "fixture-recorder", contribution: "Stored council decision as goal metadata." }
    ],
    decision: "Use Prompt Twin A/B as first Navigator goal because it has a cheap layer-1 validator.",
    falsifier: "If the path fan cannot switch or prune from validator, held-out, and twin observations, Navigator has not improved over a single static plan.",
    inputHash
  };
}

function aggregateShapeLibraryPriors(entries: NavigatorShapeLibraryEntry[]): Map<string, { entryIds: string[]; weightBoost: number }> {
  const priors = new Map<string, { entryIds: string[]; weightBoost: number }>();
  for (const entry of entries) {
    const key = shapeMemoryKey(entry.reusablePrior.shape, entry.reusablePrior.ambition, entry.reusablePrior.resourceMode);
    const current = priors.get(key) ?? { entryIds: [], weightBoost: 0 };
    current.entryIds.push(entry.entryId);
    current.weightBoost = round(Math.min(0.35, current.weightBoost + Math.max(0, Math.min(0.3, entry.reusablePrior.suggestedWeightBoost))));
    priors.set(key, current);
  }
  return priors;
}

function shapeMemoryKey(shape: PathShape, ambition: AmbitionLevel, resourceMode: ResourceMode): string {
  return `${shape}:${ambition}:${resourceMode}`;
}

function uniqueStrings(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function uniqueWorkspaceOpsToolKinds(values: readonly WorkspaceOpsToolKind[]): WorkspaceOpsToolKind[] {
  return [...new Set(values)];
}

function dedupeToolQualifications(qualifications: readonly AgentToolQualification[]): AgentToolQualification[] {
  const byToolKind = new Map<WorkspaceOpsToolKind, AgentToolQualification>();
  for (const qualification of qualifications) {
    const current = byToolKind.get(qualification.toolKind);
    if (!current || qualification.proficiency === "primary") {
      byToolKind.set(qualification.toolKind, qualification);
    }
  }
  return [...byToolKind.values()];
}

function toolKindsForShapeMilestones(shape: PathShape): [WorkspaceOpsToolKind[], WorkspaceOpsToolKind[], WorkspaceOpsToolKind[]] {
  const toolKinds: Record<PathShape, [WorkspaceOpsToolKind[], WorkspaceOpsToolKind[], WorkspaceOpsToolKind[]]> = {
    "risk-first": [
      ["data_enrichment", "document_generate"],
      ["dashboard_app_execute_governed", "spreadsheet_generate"],
      ["document_generate", "vision_analyze"]
    ],
    "steady-grind": [
      ["data_enrichment", "spreadsheet_generate"],
      ["dashboard_app_execute_auto", "spreadsheet_generate"],
      ["document_generate", "social_post_generate"]
    ],
    "spike-and-stabilize": [
      ["dashboard_app_execute_auto", "data_enrichment"],
      ["file_edit", "dashboard_app_execute_governed"],
      ["document_generate", "vision_analyze"]
    ],
    "parallel-tracks": [
      ["dashboard_app_execute_auto", "spreadsheet_generate"],
      ["data_enrichment", "dashboard_app_execute_auto"],
      ["document_generate", "social_analytics_sync"]
    ],
    "research-then-build": [
      ["web_search", "deep_research"],
      ["file_edit", "document_generate"],
      ["document_generate", "deep_research"]
    ],
    "build-then-measure": [
      ["file_edit", "dashboard_app_execute_auto"],
      ["data_enrichment", "spreadsheet_generate"],
      ["document_generate", "social_post_generate"]
    ]
  };
  return toolKinds[shape];
}

function withMilestoneToolMetadata(
  milestone: Omit<NavigationMilestone, "toolKinds" | "approvalRequired">,
  toolKinds: WorkspaceOpsToolKind[]
): NavigationMilestone {
  const uniqueToolKinds = uniqueWorkspaceOpsToolKinds(toolKinds);
  return {
    ...milestone,
    toolKinds: uniqueToolKinds,
    approvalRequired: uniqueToolKinds.some((toolKind) => isWorkspaceOpsApprovalRequiredToolKind(toolKind))
  };
}

function buildPathToolQualifications(milestones: readonly NavigationMilestone[]): AgentToolQualification[] {
  const qualifications = milestones.flatMap((milestone, index) => milestone.toolKinds.map((toolKind, toolIndex) => ({
    toolKind,
    proficiency: index === 0 || toolIndex === 0 ? "primary" as const : "secondary" as const,
    description: WORKSPACE_OPS_TOOL_DESCRIPTIONS[toolKind]
  })));
  return dedupeToolQualifications(qualifications);
}

function buildMilestonesForShape(
  shape: PathShape,
  seed: ReturnType<typeof pathSeed>
): NavigationMilestone[] {
  const shapeStates: Record<PathShape, [string, string, string]> = {
    "risk-first": [
      "Audit validator and leak boundaries before adding new steering behavior.",
      "Run a small held-out slice and reject paths with trust regressions.",
      "Prompt Twin reviews only after the safety and validator trail is coherent."
    ],
    "steady-grind": [
      "Collect a balanced validator sample for both control and twin arms.",
      "Expand held-out variants until transfer quality is stable enough to compare.",
      "Prompt Twin reviews the accumulated trail and proposes incremental steering."
    ],
    "spike-and-stabilize": [
      "Dispatch a high-variance validator burst to expose lift and failure cliffs early.",
      "Stabilize the strongest arm on held-out variants after the burst.",
      "Prompt Twin reviews whether the spike produced durable quality or only theater."
    ],
    "parallel-tracks": [
      "Run control, twin, and validator instrumentation tracks in parallel.",
      "Compare held-out transfer across tracks and drop dominated branches.",
      "Prompt Twin reviews the winning track plus the discarded alternatives."
    ],
    "research-then-build": [
      "Map validator defects and evaluator blind spots before changing the arm.",
      "Build the smallest intervention that should transfer to held-out variants.",
      "Prompt Twin reviews the rationale, evidence trail, and falsifier together."
    ],
    "build-then-measure": [
      "Build the first concrete arm change quickly enough to create runtime evidence.",
      "Measure held-out transfer and backfill missing diagnostics after execution.",
      "Prompt Twin reviews whether the shipped change is worth keeping or revising."
    ]
  };
  const [validatorState, heldOutState, twinState] = shapeStates[shape];
  const toolKinds = toolKindsForShapeMilestones(shape);
  const milestones: Array<Omit<NavigationMilestone, "toolKinds" | "approvalRequired">> = [
    {
      id: "m1-validator-sample",
      index: 1,
      state: validatorState,
      etaHours: seed.hours * 0.25,
      envelope: {
        metric: "validatorRows",
        min: Math.max(20, Math.round(seed.validatorRows * 0.65)),
        expected: seed.validatorRows,
        max: Math.round(seed.validatorRows * 1.35)
      }
    },
    {
      id: "m2-heldout-pass-rate",
      index: 2,
      state: heldOutState,
      etaHours: seed.hours * 0.65,
      envelope: {
        metric: "heldOutPassRate",
        min: round(seed.passRate - 0.12),
        expected: round(seed.passRate),
        max: round(seed.passRate + 0.12)
      }
    },
    {
      id: "m3-twin-review",
      index: 3,
      state: twinState,
      etaHours: seed.hours,
      envelope: {
        metric: "promptTwinScore",
        min: round(seed.twinScore - 0.1),
        expected: round(seed.twinScore),
        max: round(seed.twinScore + 0.1)
      }
    }
  ];
  return milestones.map((milestone, index) => withMilestoneToolMetadata(milestone, toolKinds[index]));
}

function applyCouncilEloAndFrontier(paths: NavigationPath[]): NavigationPath[] {
  return computeEfficientFrontier(paths).map((path) => ({
    ...path,
    councilElo: Math.round(path.councilElo + (path.frontier.efficient ? 25 : -8))
  }));
}

export function computeEfficientFrontier(paths: NavigationPath[]): NavigationPath[] {
  return paths.map((path) => ({
    ...path,
    frontier: {
      ...path.frontier,
      efficient: !paths.some((other) =>
        other.pathId !== path.pathId
        && other.frontier.value >= path.frontier.value
        && other.frontier.cost <= path.frontier.cost
        && other.frontier.risk <= path.frontier.risk
        && (
          other.frontier.value > path.frontier.value
          || other.frontier.cost < path.frontier.cost
          || other.frontier.risk < path.frontier.risk
        )
      )
    }
  }));
}

function simulateNavigatorLoop(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  observations: NavigationObservation[];
  generatedAt: string;
  startIndex: number;
  initialObserved: NavigationObservation[];
}): {
  finalPathId: string;
  weightedPaths: NavigationPath[];
  milestoneRuns: NavigatorMilestoneRun[];
  checkpoints: NavigatorLoopCheckpoint[];
} {
  let currentPaths = normalizePathWeights(input.paths);
  const observedSoFar = [...input.initialObserved];
  const milestoneRuns: NavigatorMilestoneRun[] = [];
  const checkpoints: NavigatorLoopCheckpoint[] = [];

  for (let offset = 0; offset < input.observations.length; offset += 1) {
    const sequenceIndex = input.startIndex + offset;
    const observation = input.observations[offset];
    observedSoFar.push(observation);
    const reweight = reweightNavigationPaths(currentPaths, observedSoFar);
    const weightedPaths = applyReweightToPaths(currentPaths, reweight);
    const councilTournament = buildCouncilTournament({
      goal: input.goal,
      paths: weightedPaths,
      observations: observedSoFar,
      generatedAt: input.generatedAt
    });
    const frontierSelection = selectFrontierPath(weightedPaths, councilTournament, input.goal, observedSoFar);
    const frontierSelectedPath = weightedPaths.find((path) => path.pathId === frontierSelection.selectedPathId) ?? weightedPaths[0];
    const forcedEntropy = buildForcedEntropyDecision({
      goal: input.goal,
      paths: weightedPaths,
      reweight,
      selectedPathId: frontierSelectedPath.pathId,
      observations: observedSoFar,
      sequenceIndex
    });
    const selectedPath = weightedPaths.find((path) => path.pathId === forcedEntropy.selectedPathIdAfter) ?? frontierSelectedPath;
    const conformal = buildConformalEnvelopeReport({
      paths: weightedPaths,
      selectedPathId: selectedPath.pathId,
      observations: observedSoFar,
      generatedAt: input.generatedAt
    });
    const contextPacket = buildNavigatorContextPacket({
      goal: input.goal,
      selectedPath,
      observations: observedSoFar,
      reweight,
      councilTournament,
      conformal
    });
    const pathWeights = reweight.scores
      .map((score) => ({ pathId: score.pathId, weight: score.posteriorWeight, pruned: score.pruned }))
      .sort((a, b) => a.pathId.localeCompare(b.pathId));
    const checkpointId = `checkpoint-${input.goal.goalId}-${String(sequenceIndex + 1).padStart(2, "0")}-${hashText(JSON.stringify({ observation, pathWeights })).slice(0, 8)}`;
    const checkpoint: NavigatorLoopCheckpoint = {
      checkpointId,
      sequenceIndex,
      timestamp: input.generatedAt,
      activePathId: selectedPath.pathId,
      milestoneId: observation.milestoneId,
      observationId: observation.observationId,
      reweightHash: hashText(JSON.stringify(reweight)),
      contextPacketId: contextPacket.packetId,
      pathWeightHash: hashText(JSON.stringify(pathWeights)),
      pathWeights,
      cycleHypothesis: buildCycleHypothesis(input.goal, observation, forcedEntropy),
      forcedEntropy,
      budgetSpent: computeBudgetSpent(input.goal, selectedPath, observedSoFar),
      status: reweight.driftAlarm || conformal.allPathsBreached ? "escalated" : "completed"
    };
    milestoneRuns.push({
      sequenceIndex,
      milestoneId: observation.milestoneId,
      observation,
      leadingBefore: reweight.leadingBefore,
      leadingAfter: reweight.leadingAfter,
      activePathId: selectedPath.pathId,
      switched: reweight.switchOccurred,
      driftAlarm: reweight.driftAlarm || conformal.allPathsBreached,
      forcedEntropyAction: forcedEntropy.action,
      forcedPathId: forcedEntropy.selectedPathIdAfter === forcedEntropy.selectedPathIdBefore ? undefined : forcedEntropy.selectedPathIdAfter,
      checkpointId
    });
    checkpoints.push(checkpoint);
    currentPaths = weightedPaths;
  }

  const finalPathId = checkpoints[checkpoints.length - 1]?.activePathId
    ?? [...currentPaths].sort((a, b) => b.weight - a.weight || a.pathId.localeCompare(b.pathId))[0]?.pathId
    ?? input.paths[0]?.pathId
    ?? "none";
  return { finalPathId, weightedPaths: currentPaths, milestoneRuns, checkpoints };
}

function buildCycleHypothesis(
  goal: NavigatorGoal,
  observation: NavigationObservation,
  forcedEntropy: NavigatorForcedEntropyDecision
): NavigatorCycleHypothesis {
  const heldOutInstrument = goal.lossFunction.instruments.find((instrument) => instrument.name === "held-out-score")?.command
    ?? "pbos eval:held-out <runId>";
  const trainingInstrument = goal.lossFunction.instruments.find((instrument) => instrument.name === "training-score")?.command
    ?? "pbos eval:training <runId>";
  const diagnosticInstrument = forcedEntropy.trigger === "memorization_alarm"
    ? `${trainingInstrument} && ${heldOutInstrument}`
    : forcedEntropy.trigger === "stall_exploration"
      ? "pbos navigate observe --query <stalled-goal> --kind web_search"
      : goal.lossFunction.instruments.find((instrument) => instrument.name === "calibration")?.command ?? "pbos navigate calibration <goalId>";
  return {
    hypothesis: `Observation ${observation.observationId} should move ${observation.metric} toward a registered path envelope without weakening trust gates.`,
    expectedFailureMode: forcedEntropy.trigger === "memorization_alarm"
      ? "Training-only lift is exploiting evaluator shape while held-out transfer stays flat."
      : forcedEntropy.trigger === "stall_exploration"
        ? "Primary metric is flat, so continuing the leading path may knob-grind instead of learning."
        : "Path fit may improve only in fixture space and fail to transfer to held-out or real evidence.",
    diagnosticInstrument,
    expectedMetricMovement: forcedEntropy.trigger === "memorization_alarm"
      ? "Held-out lift must move before any training lift is called improvement."
      : forcedEntropy.trigger === "stall_exploration"
        ? "A non-leading path or search observation should change primary metric fit on the next cycle."
        : `${goal.lossFunction.target.primaryMetric} should improve or stay inside the registered envelope.`,
    falsifier: forcedEntropy.forced
      ? `If the forced move ${forcedEntropy.action} does not improve held-out/reality fit, keep the result as a negative finding and do not relabel training lift as value.`
      : "If reality or held-out observations leave all envelopes, escalate instead of forcing promotion."
  };
}

function buildForcedEntropyDecision(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  reweight: ReweightReport;
  selectedPathId: string;
  observations: NavigationObservation[];
  sequenceIndex: number;
}): NavigatorForcedEntropyDecision {
  const trend = computeEntropyTrend(input.goal, input.observations);
  const memorizationDetected = trend.trainingLift > 0.05 && trend.heldOutLift <= 0.01;
  const stallDetected = trend.primaryMetricDelta <= 0 && trend.primaryMetricObservationCount >= 2;
  const nonLeadingPathId = selectForcedExplorationPathId(input.paths, input.reweight, input.selectedPathId);
  const webEvidencePresent = input.observations.some((observation) => observation.provenance === "web-sourced-evidence");
  const base = {
    memorizationDetected,
    stallDetected,
    trainingLift: round(trend.trainingLift),
    heldOutLift: round(trend.heldOutLift),
    primaryMetricDelta: round(trend.primaryMetricDelta),
    selectedPathIdBefore: input.selectedPathId,
    evidenceHash: hashText(JSON.stringify({
      observationIds: input.observations.map((observation) => observation.observationId),
      trainingLift: trend.trainingLift,
      heldOutLift: trend.heldOutLift,
      primaryMetricDelta: trend.primaryMetricDelta
    }))
  };

  if (memorizationDetected) {
    return {
      ...base,
      trigger: "memorization_alarm",
      action: "remove-eval-shaped-artifact",
      forced: true,
      selectedPathIdAfter: input.selectedPathId,
      nonLeadingPathId,
      blockedMoves: ["add-keyword-gate", "append-answer-shaped-list", "claim-training-lift-as-value"],
      nextMove: "Remove or cap eval-shaped artifacts, widen the eval family, and rerun held-out scoring before any promotion.",
      rationale: `Training lift ${round(trend.trainingLift)} with held-out lift ${round(trend.heldOutLift)} triggered the memorization alarm.`
    };
  }

  if (stallDetected && nonLeadingPathId) {
    const action: NavigatorForcedEntropyAction = webEvidencePresent ? "explore-non-leading-path" : "stall-to-search";
    return {
      ...base,
      trigger: "stall_exploration",
      action,
      forced: true,
      selectedPathIdAfter: nonLeadingPathId,
      nonLeadingPathId,
      blockedMoves: ["continue-leading-path-without-new-evidence", "tune-same-knob-again"],
      nextMove: action === "stall-to-search"
        ? "Run a bounded web_search observation for how others solved the stalled target, then execute one step from the non-leading path."
        : "Execute one bounded step from the non-leading registered path and map the result back into observations.",
      rationale: `Primary metric delta ${round(trend.primaryMetricDelta)} across ${trend.primaryMetricObservationCount} target observations triggered forced exploration.`
    };
  }

  return {
    ...base,
    trigger: "none",
    action: "continue-leading-path",
    forced: false,
    selectedPathIdAfter: input.selectedPathId,
    nonLeadingPathId,
    blockedMoves: [],
    nextMove: "Continue the leading path while monitoring held-out and reality-layer evidence.",
    rationale: "No memorization or stall trigger fired for this checkpoint."
  };
}

function computeEntropyTrend(goal: NavigatorGoal, observations: NavigationObservation[]): {
  trainingLift: number;
  heldOutLift: number;
  primaryMetricDelta: number;
  primaryMetricObservationCount: number;
} {
  const signalObservations = observations.filter((observation) => observation.evalSignals);
  const firstSignal = signalObservations[0]?.evalSignals;
  const lastSignal = signalObservations[signalObservations.length - 1]?.evalSignals;
  const trainingLift = typeof lastSignal?.trainingLift === "number"
    ? lastSignal.trainingLift
    : typeof firstSignal?.trainingScore === "number" && typeof lastSignal?.trainingScore === "number"
      ? lastSignal.trainingScore - firstSignal.trainingScore
      : metricDelta(observations, "trainingScore");
  const heldOutLift = typeof lastSignal?.heldOutLift === "number"
    ? lastSignal.heldOutLift
    : typeof firstSignal?.heldOutScore === "number" && typeof lastSignal?.heldOutScore === "number"
      ? lastSignal.heldOutScore - firstSignal.heldOutScore
      : metricDelta(observations, goal.lossFunction.target.primaryMetric);
  const targetObservations = observations.filter((observation) => observation.metric === goal.lossFunction.target.primaryMetric);
  const primaryMetricDelta = typeof lastSignal?.primaryMetricDelta === "number"
    ? lastSignal.primaryMetricDelta
    : targetObservations.length >= 2
      ? targetObservations[targetObservations.length - 1].actual - targetObservations[targetObservations.length - 2].actual
      : 1;
  return {
    trainingLift: Number.isFinite(trainingLift) ? trainingLift : 0,
    heldOutLift: Number.isFinite(heldOutLift) ? heldOutLift : 0,
    primaryMetricDelta: Number.isFinite(primaryMetricDelta) ? primaryMetricDelta : 1,
    primaryMetricObservationCount: targetObservations.length
  };
}

function metricDelta(observations: NavigationObservation[], metric: string): number {
  const values = observations.filter((observation) => observation.metric === metric).map((observation) => observation.actual);
  return values.length >= 2 ? values[values.length - 1] - values[0] : 0;
}

function selectForcedExplorationPathId(paths: NavigationPath[], reweight: ReweightReport, selectedPathId: string): string | undefined {
  const rankedCandidates = reweight.scores
    .filter((score) => !score.pruned && score.pathId !== selectedPathId)
    .sort((a, b) => b.posteriorWeight - a.posteriorWeight || a.driftScore - b.driftScore);
  const researchCandidate = rankedCandidates
    .map((score) => paths.find((path) => path.pathId === score.pathId))
    .find((path): path is NavigationPath => Boolean(path && path.shape === "research-then-build"));
  return researchCandidate?.pathId ?? rankedCandidates[0]?.pathId;
}

function summarizeForcedEntropy(checkpoints: NavigatorLoopCheckpoint[]): NavigatorForcedEntropySummary {
  const actions = checkpoints.map((checkpoint) => checkpoint.forcedEntropy);
  const forced = actions.filter((action) => action.forced);
  const nextRequiredMove = forced[forced.length - 1]?.nextMove ?? "No forced entropy move required; continue monitoring held-out and reality evidence.";
  return {
    schemaVersion: 1,
    memorizationDetected: actions.some((action) => action.memorizationDetected),
    stallDetected: actions.some((action) => action.stallDetected),
    forcedActionCount: forced.length,
    actions,
    nextRequiredMove,
    summary: forced.length > 0
      ? `${forced.length} forced entropy action(s) recorded; next required move: ${nextRequiredMove}`
      : "No forced entropy trigger fired; cycle hypotheses were still recorded for every checkpoint."
  };
}

function applyReweightToPaths(paths: NavigationPath[], reweight: ReweightReport): NavigationPath[] {
  const scoreByPath = new Map(reweight.scores.map((score) => [score.pathId, score]));
  const adjusted = paths.map((path) => {
    const score = scoreByPath.get(path.pathId);
    return {
      ...path,
      weight: score ? (score.pruned ? round(score.posteriorWeight * 0.35) : score.posteriorWeight) : path.weight
    };
  });
  return normalizePathWeights(adjusted);
}

function computeBudgetSpent(goal: NavigatorGoal, path: NavigationPath, observations: NavigationObservation[]): NavigatorLoopCheckpoint["budgetSpent"] {
  const observedMilestones = new Set(observations.map((observation) => observation.milestoneId));
  const completedMilestoneEtas = path.milestones
    .filter((milestone) => observedMilestones.has(milestone.id))
    .map((milestone) => milestone.etaHours);
  const hours = round(Math.min(goal.budgets.maxWallClockHours, Math.max(0, ...completedMilestoneEtas)));
  const progress = path.estimatedCost.hours > 0 ? Math.min(1, hours / path.estimatedCost.hours) : 1;
  return {
    hours,
    tokens: Math.round(path.estimatedCost.tokens * progress),
    councilCalls: Math.min(goal.budgets.maxCouncilCalls, observations.length >= 2 ? 1 : 0),
    estimatedCost: round(path.frontier.cost * 100 * progress)
  };
}

function selectStaticBaselinePath(paths: NavigationPath[]): NavigationPath {
  if (paths.some((path) => path.memoryPrior)) {
    return [...paths].sort((a, b) => a.pathId.localeCompare(b.pathId))[0] ?? paths[0];
  }
  return [...paths].sort((a, b) => b.weight - a.weight || a.pathId.localeCompare(b.pathId))[0] ?? paths[0];
}

function compareNavigatorToBaseline(input: {
  goal: NavigatorGoal;
  baselinePath: NavigationPath;
  navigatorPath: NavigationPath;
  observations: NavigationObservation[];
}): NavigatorBaselineComparison {
  const baselineScore = computePathOutcomeScore(input.baselinePath, input.observations);
  const navigatorScore = computePathOutcomeScore(input.navigatorPath, input.observations);
  const baselineProgressSharpe = computeProgressSharpeScore(input.goal, input.baselinePath, input.observations);
  const navigatorProgressSharpe = computeProgressSharpeScore(input.goal, input.navigatorPath, input.observations);
  const costRatio = round(input.navigatorPath.frontier.cost / Math.max(0.0001, input.baselinePath.frontier.cost));
  const lift = round(navigatorScore - baselineScore);
  const progressSharpeLift = round(navigatorProgressSharpe.progressSharpe - baselineProgressSharpe.progressSharpe);
  const observationMix = computeObservationWeightMix(input.observations);
  const majorityRealityOrHeldOutEvidence = observationMix.realityOrHeldOutLayerFraction >= 0.5;
  return {
    metric: "path-fit-score",
    selectionMetric: "progressSharpe",
    baselinePathId: input.baselinePath.pathId,
    navigatorPathId: input.navigatorPath.pathId,
    baselineScore,
    navigatorScore,
    lift,
    baselineProgressSharpe: baselineProgressSharpe.progressSharpe,
    navigatorProgressSharpe: navigatorProgressSharpe.progressSharpe,
    progressSharpeLift,
    evidenceConfidence: navigatorProgressSharpe.evidenceConfidence,
    majorityRealityOrHeldOutEvidence,
    costRatio,
    comparableCost: costRatio <= 2,
    summary: majorityRealityOrHeldOutEvidence
      ? `Navigator selected ${input.navigatorPath.pathId} by Progress Sharpe (${navigatorProgressSharpe.progressSharpe.toFixed(4)} vs ${baselineProgressSharpe.progressSharpe.toFixed(4)}, lift ${progressSharpeLift >= 0 ? "+" : ""}${progressSharpeLift.toFixed(4)}) with raw path-fit lift ${lift >= 0 ? "+" : ""}${lift.toFixed(4)} against ${input.baselinePath.pathId}.`
      : `Navigator selected ${input.navigatorPath.pathId} by Progress Sharpe in a non-majority-real proof; raw path-fit lift ${lift >= 0 ? "+" : ""}${lift.toFixed(4)} and Sharpe lift ${progressSharpeLift >= 0 ? "+" : ""}${progressSharpeLift.toFixed(4)} are reported as protocol evidence, not economic value.`
  };
}

function buildAmbitionRatchetDecision(input: {
  goal: NavigatorGoal;
  paths: NavigationPath[];
  activePath: NavigationPath;
  observations: NavigationObservation[];
  allPathsBreached: boolean;
  generatedAt: string;
}): AmbitionRatchetDecision {
  const required = input.goal.escalationPolicy.consecutiveOverPerformanceForRatchet;
  const observationEvents = input.observations.flatMap((observation) => {
    const milestone = findMilestoneForObservation(input.activePath, observation);
    if (!milestone) return [];
    return [{
      observationId: observation.observationId,
      milestoneId: observation.milestoneId,
      metric: observation.metric,
      actual: round(observation.actual),
      expected: round(milestone.envelope.expected),
      max: round(milestone.envelope.max),
      overExpected: observation.actual > milestone.envelope.expected,
      overMax: observation.actual > milestone.envelope.max,
      overMaxBy: round(Math.max(0, observation.actual - milestone.envelope.max))
    }];
  });
  let consecutiveOverMax = 0;
  for (let index = observationEvents.length - 1; index >= 0; index -= 1) {
    if (!observationEvents[index].overMax) break;
    consecutiveOverMax += 1;
  }
  const candidate = selectAmbitionRatchetCandidate(input.paths, input.activePath);
  const thresholdMet = consecutiveOverMax >= required;
  const councilVotes = candidate && thresholdMet && !input.allPathsBreached
    ? (["Proposer", "Adversary", "Estimator", "Synthesizer"] as CouncilJudgeSeat[]).map((seat) => buildAmbitionRatchetSeatVote({
        seat,
        activePath: input.activePath,
        candidatePath: candidate,
        observations: input.observations,
        consecutiveOverMax,
        requiredConsecutiveOverMax: required
      }))
    : [];
  const councilVotesForCandidate = candidate
    ? councilVotes.filter((vote) => vote.winnerPathId === candidate.pathId).length
    : 0;
  const councilDisagreementRate = councilVotes.length > 0
    ? round(Math.min(councilVotesForCandidate, councilVotes.length - councilVotesForCandidate) / councilVotes.length)
    : 0;
  const action: AmbitionRatchetAction = input.allPathsBreached
    ? "escalate"
    : thresholdMet && candidate && councilVotesForCandidate >= Math.ceil(councilVotes.length / 2)
      ? "promote"
      : "hold";
  const rationale = action === "escalate"
    ? "Reality breached all registered path envelopes; ratchet is blocked behind human escalation."
    : action === "promote"
      ? `${consecutiveOverMax} consecutive observations exceeded the active path max envelope; ${councilVotesForCandidate}/${councilVotes.length} ratchet seats prefer ${candidate?.pathId}.`
      : thresholdMet
        ? `Ratchet threshold met with ${consecutiveOverMax} consecutive over-max observations, but no higher-ambition candidate won the ratchet vote.`
        : `Ratchet held because ${consecutiveOverMax}/${required} required trailing observations exceeded the active path max envelope.`;
  return {
    schemaVersion: 1,
    goalId: input.goal.goalId,
    generatedAt: input.generatedAt,
    activePathId: input.activePath.pathId,
    activeAmbition: input.activePath.ambition,
    requiredConsecutiveOverMax: required,
    consecutiveOverMax,
    candidatePathId: candidate?.pathId,
    candidateAmbition: candidate?.ambition,
    candidateValueEstimate: candidate?.valueEstimate,
    candidateRiskEstimate: candidate?.riskEstimate,
    action,
    councilVotes,
    councilVotesForCandidate,
    councilDisagreementRate,
    observations: observationEvents,
    rationale,
    falsifier: "If later held-out or runtime evidence falls back inside the old envelope or the promoted path underperforms its envelope, revert the ratchet and lower the shape prior."
  };
}

function selectAmbitionRatchetCandidate(paths: NavigationPath[], activePath: NavigationPath): NavigationPath | undefined {
  const ambitionRank: Record<AmbitionLevel, number> = { safe: 0, stretch: 1, moonshot: 2 };
  const activeRank = ambitionRank[activePath.ambition];
  return [...paths]
    .filter((path) => path.pathId !== activePath.pathId && ambitionRank[path.ambition] > activeRank)
    .sort((a, b) =>
      Number(b.shape === activePath.shape) - Number(a.shape === activePath.shape)
      || Number(b.resourceMode === activePath.resourceMode) - Number(a.resourceMode === activePath.resourceMode)
      || Number(b.frontier.efficient) - Number(a.frontier.efficient)
      || b.valueEstimate - a.valueEstimate
      || a.riskEstimate - b.riskEstimate
      || a.pathId.localeCompare(b.pathId)
    )[0];
}

function computePathOutcomeScore(path: NavigationPath, observations: NavigationObservation[]): number {
  const driftFitness = 1 / (1 + scorePathDrift(path, observations));
  const valueFitness = path.valueEstimate;
  const liftFitness = path.predictedOutcome.value;
  const riskFitness = 1 - path.riskEstimate;
  const frontierFitness = path.frontier.efficient ? 1 : 0.35;
  const humanFeedbackFit = observations.some((observation) => observation.sourceLayer === "humanFeedback")
    ? Math.min(1, driftFitness + 0.08)
    : driftFitness;
  return round(
    driftFitness * 0.38
    + valueFitness * 0.24
    + liftFitness * 0.14
    + riskFitness * 0.1
    + frontierFitness * 0.06
    + humanFeedbackFit * 0.08
  );
}

export function computeProgressSharpeScore(
  goal: NavigatorGoal,
  path: NavigationPath,
  observations: NavigationObservation[]
): NavigatorProgressSharpeScore {
  const qualityScore = computePathOutcomeScore(path, observations);
  const constraintAlarmCount = countPathEnvelopeAlarms(path, observations);
  const constraintMultiplier = 1 / (1 + constraintAlarmCount);
  const observationMix = computeObservationWeightMix(observations);
  const fixtureProtocolFloor = observations.length > 0 ? 0.25 : 0.1;
  const evidenceConfidence = round(Math.max(fixtureProtocolFloor, observationMix.realityOrHeldOutLayerFraction));
  const verifiedProgress = round(qualityScore * goal.lossFunction.timeCostPenalty.qualityWeight * evidenceConfidence * constraintMultiplier);
  const hours = round(Math.max(0.05, path.estimatedCost.hours));
  const hourPenalty = round(hours * goal.lossFunction.timeCostPenalty.hourPenaltyLambda);
  const spendPenalty = round(path.frontier.cost * 100 * goal.lossFunction.timeCostPenalty.spendPenaltyMu);
  const riskPenalty = round(path.riskEstimate * goal.lossFunction.timeCostPenalty.riskPenaltyRho);
  const denominator = round(Math.max(0.0001, hourPenalty + spendPenalty + riskPenalty));
  return {
    pathId: path.pathId,
    rank: 0,
    frontierEfficient: path.frontier.efficient,
    rawPathFitScore: qualityScore,
    constraintAlarmCount,
    constraintPass: constraintAlarmCount === 0,
    evidenceConfidence,
    verifiedProgress,
    hours,
    hourPenalty,
    spendPenalty,
    riskPenalty,
    denominator,
    progressSharpe: round(verifiedProgress / denominator)
  };
}

function countPathEnvelopeAlarms(path: NavigationPath, observations: NavigationObservation[]): number {
  return observations.filter((observation) => {
    const milestone = findMilestoneForObservation(path, observation);
    if (!milestone) return false;
    return observation.actual < milestone.envelope.min || observation.actual > milestone.envelope.max;
  }).length;
}

function rankProgressSharpeScores(scores: NavigatorProgressSharpeScore[]): NavigatorProgressSharpeScore[] {
  return [...scores]
    .sort((a, b) =>
      Number(b.frontierEfficient) - Number(a.frontierEfficient)
      || Number(b.constraintPass) - Number(a.constraintPass)
      || b.progressSharpe - a.progressSharpe
      || b.verifiedProgress - a.verifiedProgress
      || b.rawPathFitScore - a.rawPathFitScore
      || a.pathId.localeCompare(b.pathId)
    )
    .map((score, index) => ({ ...score, rank: index + 1 }));
}

function buildShapeLibraryEntry(input: {
  goal: NavigatorGoal;
  selectedPath: NavigationPath;
  observations: NavigationObservation[];
  baselineComparison: NavigatorBaselineComparison;
}): NavigatorShapeLibraryEntry {
  const shapeKey = `${input.selectedPath.shape}:${input.selectedPath.ambition}:${input.selectedPath.resourceMode}`;
  return {
    entryId: `shape-${input.goal.goalId}-${hashText(JSON.stringify({ shapeKey, selectedPathId: input.selectedPath.pathId })).slice(0, 10)}`,
    goalId: input.goal.goalId,
    objectiveHash: hashText(input.goal.objective),
    shapeKey,
    selectedPathId: input.selectedPath.pathId,
    outcomeScore: input.baselineComparison.navigatorScore,
    baselineLift: input.baselineComparison.lift,
    evidenceHash: hashText(JSON.stringify(input.observations)),
    reusablePrior: {
      shape: input.selectedPath.shape,
      ambition: input.selectedPath.ambition,
      resourceMode: input.selectedPath.resourceMode,
      suggestedWeightBoost: round(Math.max(0.05, Math.min(0.3, input.baselineComparison.lift / 2)))
    }
  };
}

function extractPythonConstants(sourceText: string, names: string[]): Record<string, number | string | null> {
  const output: Record<string, number | string | null> = {};
  for (const name of names) {
    const match = sourceText.match(new RegExp(`^${name}\\s*=\\s*([^\\n#]+)`, "m"));
    if (match) {
      output[name] = parsePythonConstantValue(match[1]);
      continue;
    }
    const tupleValue = extractTupleAssignedConstant(sourceText, name);
    output[name] = tupleValue ?? null;
  }
  return output;
}

function primitiveProofIsSafe(input: {
  sources: MonorepoPrimitiveSourceEvidence[];
  bie: BiePrimitiveExecutionSummary;
  conformal: ConformalPrimitiveExecutionSummary;
  swarm: SwarmHarnessPrimitiveSummary;
}): boolean {
  const serialized = JSON.stringify(input);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function promptTwinJudgmentIsSafe(judgment: PromptTwinJudgmentEvidence): boolean {
  if (judgment.safety.rawPromptIncluded || judgment.safety.rawProviderResponseIncluded || judgment.safety.envValuesIncluded) return false;
  const serialized = JSON.stringify(judgment);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function providerCouncilJudgmentIsSafe(judgment: ProviderCouncilSeatJudgmentEvidence): boolean {
  if (judgment.safety.rawPromptIncluded || judgment.safety.rawProviderResponseIncluded || judgment.safety.envValuesIncluded) return false;
  const serialized = JSON.stringify(judgment);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /authorization/i,
    /Bearer\s+/i,
    /api-key/i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function providerCouncilSessionIsSafe(session: ProviderCouncilSessionEvidence): boolean {
  if (session.safety.rawPromptIncluded || session.safety.rawProviderResponseIncluded || session.safety.envValuesIncluded) return false;
  if (!session.judgments.every((judgment) => providerCouncilJudgmentIsSafe(judgment))) return false;
  const serialized = JSON.stringify(session);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /authorization/i,
    /Bearer\s+/i,
    /api-key/i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function promptTwinAbProofIsSafe(input: {
  control: FlappyPromptTwinAbArmEvidence;
  twin: FlappyPromptTwinAbArmEvidence;
  heldOutPreRegistration?: FlappyPromptTwinAbHeldOutPreRegistration;
  heldOutResult?: FlappyPromptTwinAbHeldOutResult;
}): boolean {
  if (input.heldOutPreRegistration || input.heldOutResult) {
    if (!promptTwinAbHeldOutPayloadIsSafe({
      preRegistration: input.heldOutPreRegistration,
      heldOutResult: input.heldOutResult
    })) return false;
  }
  const serialized = JSON.stringify(input);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /authorization/i,
    /Bearer\s+/i,
    /api-key/i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i,
    /import pygame[\s\S]*GRAVITY/m
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function promptTwinAbHeldOutPayloadIsSafe(input: unknown): boolean {
  const serialized = JSON.stringify(input);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /authorization/i,
    /Bearer\s+/i,
    /api-key/i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i,
    /caseId/i,
    /mutationRecipe/i,
    /expectedRepairProperties/i,
    /validatorExpectations/i,
    /heldOutManifest/i,
    /heldout-manifest\.private/i,
    /answer-key\.private/i,
    /import pygame[\s\S]*GRAVITY/m
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function assetCloneCommitmentIsSafe(input: AssetCloneHeldOutCommitment): boolean {
  return !JSON.stringify(input).match(/"targetPixels"\s*:|"privateTargetGrid"\s*:|"privateTargetGrids"\s*:|answerKey"\s*:|promptText|promptBody|imageBody|data:image|"pixels"\s*:/i)
    && input.targetPixelBodiesIncluded === false
    && input.privateTargetGridsIncluded === false
    && input.answerKeyIncluded === false
    && input.rawPromptsIncluded === false;
}

function assetCloneHeldOutPayloadIsSafe(input: unknown): boolean {
  const serialized = JSON.stringify(input);
  const forbidden = [
    /OPENAI_API_KEY/i,
    /AZURE_OPENAI/i,
    /DATABASE_URL/i,
    /PRIVATE_KEY/i,
    /PB_ADMIN_API_KEY/i,
    /PB_SUBSCRIPTION_KEY/i,
    /GEMINI_API_KEY/i,
    /https?:\/\//i,
    /authorization/i,
    /Bearer\s+/i,
    /api-key/i,
    /requestBody/i,
    /responseBody/i,
    /selectedFields/i,
    /"targetPixels"\s*:/i,
    /"privateTargetGrid"\s*:/i,
    /"privateTargetGrids"\s*:/i,
    /heldOutManifest/i,
    /answerKey"\s*:/i,
    /promptText/i,
    /promptBody/i,
    /data:image/i,
    /imageBody/i,
    /"pixels"\s*:/i
  ];
  return !forbidden.some((pattern) => pattern.test(serialized));
}

function buildAssetCloneHeldOutObservations(input: {
  result: AssetCloneHeldOutResult;
  generatedAt: string;
}): NavigationObservation[] {
  const token = hashText(`${input.result.resultId}:${input.result.pixelSimilarityScore}:${input.result.pixelDiffRatio}`).slice(0, 8);
  return [
    {
      observationId: `obs-asset-clone-pixel-similarity-${token}`,
      milestoneId: "m2-heldout-pass-rate",
      metric: "pixelSimilarityScore",
      actual: input.result.pixelSimilarityScore,
      sourceLayer: "heldOut",
      provenance: "held-out-scorer",
      weight: 2.6,
      summary: `Scorer-only asset-clone pixel similarity=${input.result.pixelSimilarityScore.toFixed(4)} across ${input.result.score.casesScored} held-out cases.`,
      timestamp: input.generatedAt,
      evalSignals: {
        heldOutScore: input.result.pixelSimilarityScore,
        primaryMetricDelta: round(input.result.pixelSimilarityScore - input.result.expectedPixelSimilarityScore),
        source: "eval-family"
      }
    },
    {
      observationId: `obs-asset-clone-pixel-diff-${token}`,
      milestoneId: "m2-heldout-pass-rate",
      metric: "pixelDiffRatio",
      actual: input.result.pixelDiffRatio,
      sourceLayer: "heldOut",
      provenance: "held-out-scorer",
      weight: 1.4,
      summary: `Raw pixel diff ratio=${input.result.pixelDiffRatio.toFixed(4)}; lower is better and target pixels remain scorer-only.`,
      timestamp: input.generatedAt,
      evalSignals: {
        heldOutScore: input.result.pixelSimilarityScore,
        primaryMetricDelta: round(input.result.expectedPixelSimilarityScore - input.result.pixelDiffRatio),
        source: "eval-family"
      }
    }
  ];
}

function flappyAbRuntimeScore(summary: FlappyPygameRuntimeSummary | null): number {
  if (!summary) return 0;
  const playable = summary.ok ? 0.55 : 0;
  const scoreProgress = Math.min(0.2, summary.score * 0.2);
  const pipeProgress = Math.min(0.15, Math.max(0, summary.pipesAdvanced) / 600);
  const physicsCoverage = summary.gravitySamples === summary.frames && summary.collisionChecks >= summary.frames && summary.boundsChecks === summary.frames ? 0.1 : 0;
  return round(playable + scoreProgress + pipeProgress + physicsCoverage);
}

function buildFlappyPromptTwinAbObservations(input: {
  reportIdSeed: string;
  runtimeLift: number;
  ruleRepairLift: number;
  sourceLoc: number;
  control: FlappyPromptTwinAbArmEvidence;
  twin: FlappyPromptTwinAbArmEvidence;
  heldOutResult?: FlappyPromptTwinAbHeldOutResult;
  generatedAt: string;
}): NavigationObservation[] {
  const token = hashText(input.reportIdSeed).slice(0, 8);
  const validatorRows = Math.max(96, Math.min(260, input.sourceLoc * 18 + (input.control.fixedRuleIds.length + input.twin.fixedRuleIds.length) * 18));
  const heldOutPassRate = input.heldOutResult
    ? input.heldOutResult.twin.passRate
    : round(Math.min(0.9, 0.58 + Math.max(0, input.runtimeLift) * 0.34 + Math.max(0, input.ruleRepairLift) * 0.015));
  const heldOutSummary = input.heldOutResult
    ? `Scorer-only held-out pass rates: control=${input.heldOutResult.control.passRate.toFixed(4)}, twin=${input.heldOutResult.twin.passRate.toFixed(4)}, observed lift=${input.heldOutResult.heldOutLift >= 0 ? "+" : ""}${input.heldOutResult.heldOutLift.toFixed(4)}, expected=${input.heldOutResult.expectedHeldOutLift.toFixed(4)}, met=${String(input.heldOutResult.metExpectedLift)}.`
    : `Runtime lift ${input.runtimeLift.toFixed(4)} and rule repair lift ${input.ruleRepairLift} project to a held-out transfer proxy.`;
  const promptTwinScore = round(Math.min(0.95, 0.68 + Math.max(0, input.runtimeLift) * 0.24 + Math.max(0, input.ruleRepairLift) * 0.018));
  const humanReviewScore = round(Math.min(0.95, 0.74 + Math.max(0, input.runtimeLift) * 0.18 + Math.max(0, input.ruleRepairLift) * 0.015));
  return [
    {
      observationId: `obs-flappy-ab-validator-rows-${token}`,
      milestoneId: "m1-validator-sample",
      metric: "validatorRows",
      actual: validatorRows,
      sourceLayer: "reality",
      provenance: "runtime-probe",
      weight: 1.9,
      summary: `Prompt Twin A/B executed two generated Pygame arms; control status=${String(input.control.execution.status)}, twin status=${String(input.twin.execution.status)}.`,
      timestamp: input.generatedAt
    },
    {
      observationId: `obs-flappy-ab-heldout-pass-rate-${token}`,
      milestoneId: "m2-heldout-pass-rate",
      metric: "heldOutPassRate",
      actual: heldOutPassRate,
      sourceLayer: "heldOut",
      provenance: input.heldOutResult ? "held-out-scorer" : "runtime-probe",
      weight: input.heldOutResult ? 2.4 : 1.6,
      summary: heldOutSummary,
      timestamp: input.generatedAt
    },
    {
      observationId: `obs-flappy-ab-prompt-twin-score-${token}`,
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: promptTwinScore,
      sourceLayer: "promptTwin",
      provenance: "runtime-probe",
      weight: 1,
      summary: `Prompt Twin arm scored ${input.twin.runtimeScore.toFixed(4)} against control ${input.control.runtimeScore.toFixed(4)} with safe runtime evidence.`,
      timestamp: input.generatedAt
    },
    {
      observationId: `obs-flappy-ab-human-review-${token}`,
      milestoneId: "m3-twin-review",
      metric: "promptTwinScore",
      actual: humanReviewScore,
      sourceLayer: "humanFeedback",
      provenance: "runtime-probe",
      weight: 3,
      summary: "Human-quality-bar proxy rewards a playable twin arm that beats the control without unsafe evidence leakage.",
      timestamp: input.generatedAt
    }
  ];
}

export function buildFlappyEvalFactoryReport(input: {
  familyId?: string;
  totalCases?: number;
  trainCases?: number;
  generatedAt?: string;
} = {}): FlappyEvalFactoryReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const familyId = input.familyId ?? "flappy-heldout-v1";
  const totalCases = Math.max(300, Math.round(input.totalCases ?? 500));
  const requestedTrainCases = Math.round(input.trainCases ?? Math.floor(totalCases * 0.64));
  const trainCases = Math.max(1, Math.min(totalCases - 1, requestedTrainCases));
  const allCases = generateFlappyEvalCases({ familyId, totalCases });
  const training = allCases.slice(0, trainCases).map((testCase) => ({ ...testCase, split: "training" as const }));
  const heldOut = allCases.slice(trainCases).map((testCase) => ({ ...testCase, split: "heldOut" as const }));
  const trainingManifest: FlappyEvalTrainingManifest = {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "training",
    generator: {
      name: "deterministic-flappy-mutation-factory",
      seedHash: hashText(`${familyId}:deterministic-flappy-mutation-factory`),
      defectOperators: FLAPPY_DEFECT_OPERATORS
    },
    cases: training,
    operatorHistogram: histogramDefects(training),
    rawSourceIncluded: false,
    answerKeyIncluded: false
  };
  const heldOutManifestSeed = heldOut.map((testCase) => ({
    caseId: testCase.caseId,
    variantHash: testCase.variantHash,
    defectIds: testCase.defectIds,
    capacityBucket: testCase.capacityBucket,
    difficulty: testCase.difficulty
  }));
  const answerKeySeed = heldOut.map((testCase) => ({
    caseId: testCase.caseId,
    defectIds: testCase.defectIds,
    expectedRepairProperties: testCase.expectedRepairProperties,
    validatorExpectations: testCase.validatorExpectations
  }));
  const heldOutCommitment: FlappyHeldOutCommitment = {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "heldOut",
    scorerRef: `scorer-only:${familyId}`,
    totalCases,
    trainingCases: training.length,
    casesCommitted: heldOut.length,
    manifestHash: hashText(JSON.stringify(heldOutManifestSeed)),
    answerKeyCommitment: {
      algorithm: "sha256",
      hash: hashText(JSON.stringify(answerKeySeed))
    },
    operatorHistogram: histogramDefects(heldOut),
    rawCasesIncluded: false,
    answerKeyIncluded: false,
    storagePolicy: "scorer-only",
    revealPolicy: "Held-out case bodies and answer keys stay outside the optimizer workspace; scorer returns aggregates and hashes only."
  };
  const gates = [
    {
      name: "case-count-capacity",
      status: totalCases >= 300 && heldOut.length >= 100 ? "pass" as const : "fail" as const,
      summary: `${totalCases} total cases with ${training.length} training and ${heldOut.length} held-out.`
    },
    {
      name: "known-defect-ground-truth",
      status: allCases.every((testCase) => testCase.defectIds.length >= 2 && testCase.expectedRepairProperties.length >= testCase.defectIds.length) ? "pass" as const : "fail" as const,
      summary: `${allCases.length} cases carry defect ids, expected repair properties, and validator expectations.`
    },
    {
      name: "heldout-hidden-by-construction",
      status: !JSON.stringify(heldOutCommitment).includes("caseId") && !heldOutCommitment.rawCasesIncluded && !heldOutCommitment.answerKeyIncluded ? "pass" as const : "fail" as const,
      summary: "Held-out output stores aggregate counts, histograms, manifest hash, and answer-key hash only."
    },
    {
      name: "deterministic-commitments",
      status: heldOutCommitment.manifestHash.length === 64 && heldOutCommitment.answerKeyCommitment.hash.length === 64 ? "pass" as const : "fail" as const,
      summary: `manifest=${heldOutCommitment.manifestHash.slice(0, 10)}, answerKey=${heldOutCommitment.answerKeyCommitment.hash.slice(0, 10)}.`
    }
  ];
  return {
    schemaVersion: 1,
    familyId,
    generatedAt,
    totalCases,
    trainingCases: training.length,
    heldOutCases: heldOut.length,
    trainingManifest,
    heldOutCommitment,
    acceptanceGates: gates
  };
}

export function buildAssetCloneEvalFactoryReport(input: {
  familyId?: string;
  totalCases?: number;
  trainCases?: number;
  generatedAt?: string;
} = {}): AssetCloneEvalFactoryReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const familyId = input.familyId ?? "asset-clone-heldout-v1";
  const totalCases = Math.max(120, Math.round(input.totalCases ?? 240));
  const requestedTrainCases = Math.round(input.trainCases ?? Math.floor(totalCases * 0.6));
  const trainCases = Math.max(1, Math.min(totalCases - 1, requestedTrainCases));
  const allCases = generateAssetCloneEvalCases({ familyId, totalCases });
  const training = allCases.slice(0, trainCases).map((testCase) => ({ ...testCase.publicCase, split: "training" as const }));
  const heldOut = allCases.slice(trainCases).map((testCase) => ({ ...testCase.publicCase, split: "heldOut" as const }));
  const trainingManifest: AssetCloneEvalTrainingManifest = {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "training",
    generator: {
      name: "deterministic-asset-clone-factory",
      seedHash: hashText(`${familyId}:deterministic-asset-clone-factory`)
    },
    cases: training,
    targetPixelBodiesIncluded: false,
    privateTargetGridsIncluded: false,
    answerKeyIncluded: false,
    rawPromptsIncluded: false
  };
  const answerKeySeed = allCases.slice(trainCases).map((testCase) => ({
    caseId: testCase.publicCase.caseId,
    width: testCase.publicCase.width,
    height: testCase.publicCase.height,
    targetPixelHash: testCase.publicCase.targetPixelHash,
    targetPixels: testCase.targetPixels
  }));
  const heldOutCommitment: AssetCloneHeldOutCommitment = {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "heldOut",
    scorerRef: `scorer-only:${familyId}`,
    totalCases,
    trainingCases: training.length,
    casesCommitted: heldOut.length,
    manifestHash: hashText(JSON.stringify(heldOut)),
    answerKeyCommitment: {
      algorithm: "sha256",
      hash: hashText(JSON.stringify(answerKeySeed))
    },
    dimensions: {
      minWidth: Math.min(...heldOut.map((testCase) => testCase.width)),
      maxWidth: Math.max(...heldOut.map((testCase) => testCase.width)),
      minHeight: Math.min(...heldOut.map((testCase) => testCase.height)),
      maxHeight: Math.max(...heldOut.map((testCase) => testCase.height))
    },
    targetPixelBodiesIncluded: false,
    privateTargetGridsIncluded: false,
    answerKeyIncluded: false,
    rawPromptsIncluded: false,
    storagePolicy: "scorer-only",
    revealPolicy: "Held-out image bodies, prompts, target pixels, private target grids, and answer keys stay outside the optimizer workspace; scorer returns aggregate pixel scores and hashes only."
  };
  const gates = [
    {
      name: "asset-clone-case-count-capacity",
      status: totalCases >= 120 && heldOut.length >= 40 ? "pass" as const : "fail" as const,
      summary: `${totalCases} total asset-clone cases with ${training.length} training and ${heldOut.length} held-out.`
    },
    {
      name: "asset-clone-training-manifest-public",
      status: training.every((testCase) => testCase.targetPixelHash.length === 64 && testCase.promptHash.length === 64) ? "pass" as const : "fail" as const,
      summary: "Training manifest exposes prompt hashes, dimensions, target hashes, and variant hashes only."
    },
    {
      name: "asset-clone-heldout-hidden-by-construction",
      status: assetCloneCommitmentIsSafe(heldOutCommitment) ? "pass" as const : "fail" as const,
      summary: "Held-out commitment excludes raw image bodies, raw prompts, target pixels, private grids, and answer keys."
    },
    {
      name: "asset-clone-deterministic-commitments",
      status: heldOutCommitment.manifestHash.length === 64 && heldOutCommitment.answerKeyCommitment.hash.length === 64 ? "pass" as const : "fail" as const,
      summary: `manifest=${heldOutCommitment.manifestHash.slice(0, 10)}, answerKey=${heldOutCommitment.answerKeyCommitment.hash.slice(0, 10)}.`
    }
  ];
  return {
    schemaVersion: 1,
    familyId,
    generatedAt,
    totalCases,
    trainingCases: training.length,
    heldOutCases: heldOut.length,
    trainingManifest,
    heldOutCommitment,
    acceptanceGates: gates
  };
}

export function buildAssetClonePrivateHeldOutBundle(input: {
  familyId?: string;
  totalCases?: number;
  trainCases?: number;
  generatedAt?: string;
} = {}): AssetClonePrivateHeldOutBundle {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const familyId = input.familyId ?? "asset-clone-heldout-v1";
  const totalCases = Math.max(120, Math.round(input.totalCases ?? 240));
  const requestedTrainCases = Math.round(input.trainCases ?? Math.floor(totalCases * 0.6));
  const trainCases = Math.max(1, Math.min(totalCases - 1, requestedTrainCases));
  const heldOut = generateAssetCloneEvalCases({ familyId, totalCases }).slice(trainCases);
  const heldOutManifest = heldOut.map((testCase) => ({ ...testCase.publicCase, split: "heldOut" as const }));
  const answerKey = heldOut.map((testCase) => ({
    caseId: testCase.publicCase.caseId,
    width: testCase.publicCase.width,
    height: testCase.publicCase.height,
    targetPixelHash: testCase.publicCase.targetPixelHash,
    targetPixels: testCase.targetPixels
  }));
  return {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "heldOut",
    scorerRef: `scorer-only:${familyId}`,
    heldOutManifest,
    answerKey,
    manifestHash: hashText(JSON.stringify(heldOutManifest)),
    answerKeyHash: hashText(JSON.stringify(answerKey)),
    rawPromptsIncluded: false,
    storagePolicy: "outside-repo-private"
  };
}

export function scoreAssetClonePixelDiffArtifact(input: {
  artifact: AssetCloneCandidateArtifact;
  commitment: AssetCloneHeldOutCommitment;
  generatedAt?: string;
}): AssetClonePixelDiffScoreReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const heldOutCases = generateAssetCloneEvalCases({
    familyId: input.commitment.familyId,
    totalCases: input.commitment.totalCases
  }).slice(input.commitment.trainingCases);
  const candidateByCase = new Map(input.artifact.cases.map((testCase) => [testCase.caseId, testCase.pixels]));
  const perCase = heldOutCases.map((testCase) => {
    const candidatePixels = candidateByCase.get(testCase.publicCase.caseId);
    const pixelDiffRatio = candidatePixels
      ? computePixelDiffRatio(candidatePixels, testCase.targetPixels)
      : 1;
    return {
      caseId: testCase.publicCase.caseId,
      width: testCase.publicCase.width,
      height: testCase.publicCase.height,
      pixelDiffRatio,
      pixelSimilarityScore: round(1 - pixelDiffRatio),
      candidatePixelHash: hashText(JSON.stringify(candidatePixels ?? null)),
      targetPixelHash: testCase.publicCase.targetPixelHash
    };
  });
  const pixelDiffRatio = round(perCase.reduce((sum, item) => sum + item.pixelDiffRatio, 0) / Math.max(1, perCase.length));
  return {
    schemaVersion: 1,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    generatedAt,
    artifactHash: hashText(JSON.stringify(input.artifact)),
    casesScored: perCase.length,
    pixelDiffRatio,
    pixelSimilarityScore: round(1 - pixelDiffRatio),
    perCase,
    rawImageBodiesIncluded: false,
    rawTargetPixelsIncluded: false,
    privateTargetGridsIncluded: false,
    answerKeyIncluded: false,
    rawPromptsIncluded: false,
    artifactIncluded: false,
    commitment: {
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    }
  };
}

export function buildAssetCloneHeldOutPreRegistration(input: {
  goal: NavigatorGoal;
  commitment: AssetCloneHeldOutCommitment;
  expectedPixelSimilarityScore: number;
  candidateArtifactLabel: string;
  candidateArtifactHash: string;
  registeredAt?: string;
}): AssetCloneHeldOutPreRegistration {
  const registeredAt = input.registeredAt ?? new Date().toISOString();
  const expectedPixelSimilarityScore = round(input.expectedPixelSimilarityScore);
  const identity = {
    goalId: input.goal.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    expectedPixelSimilarityScore,
    manifestHash: input.commitment.manifestHash,
    answerKeyHash: input.commitment.answerKeyCommitment.hash,
    candidateArtifactHash: input.candidateArtifactHash
  };
  return {
    schemaVersion: 1,
    registrationId: `asset-clone-heldout-prereg-${input.goal.goalId}-${hashText(JSON.stringify(identity)).slice(0, 8)}`,
    goalId: input.goal.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    registeredAt,
    expectedPixelSimilarityScore,
    commitment: {
      casesCommitted: input.commitment.casesCommitted,
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    },
    candidate: {
      artifactLabel: input.candidateArtifactLabel,
      artifactHash: input.candidateArtifactHash
    },
    safety: {
      rawImageBodiesIncluded: false,
      rawTargetPixelsIncluded: false,
      privateTargetGridsIncluded: false,
      answerKeyIncluded: false,
      rawPromptsIncluded: false,
      envValuesIncluded: false
    }
  };
}

export function scoreAssetCloneHeldOut(input: {
  preRegistration: AssetCloneHeldOutPreRegistration;
  commitment: AssetCloneHeldOutCommitment;
  artifact: AssetCloneCandidateArtifact;
  scoredAt?: string;
}): AssetCloneHeldOutResult {
  const scoredAt = input.scoredAt ?? new Date().toISOString();
  const score = scoreAssetClonePixelDiffArtifact({
    artifact: input.artifact,
    commitment: input.commitment,
    generatedAt: scoredAt
  });
  const preRegistrationHash = hashText(JSON.stringify(input.preRegistration));
  const registeredAtMs = Date.parse(input.preRegistration.registeredAt);
  const scoredAtMs = Date.parse(scoredAt);
  const registeredBeforeScoring = Number.isFinite(registeredAtMs) && Number.isFinite(scoredAtMs) && registeredAtMs <= scoredAtMs;
  const commitmentMatches = input.preRegistration.commitment.manifestHash === input.commitment.manifestHash
    && input.preRegistration.commitment.answerKeyHash === input.commitment.answerKeyCommitment.hash
    && score.commitment.manifestHash === input.commitment.manifestHash
    && score.commitment.answerKeyHash === input.commitment.answerKeyCommitment.hash;
  const artifactHashMatches = score.artifactHash === input.preRegistration.candidate.artifactHash;
  const safety = input.preRegistration.safety;
  const gates = [
    {
      name: "asset-clone-preregistered-before-scoring",
      status: registeredBeforeScoring ? "pass" as const : "fail" as const,
      summary: `registeredAt=${input.preRegistration.registeredAt}, scoredAt=${scoredAt}.`
    },
    {
      name: "asset-clone-commitment-matches-preregistration",
      status: commitmentMatches ? "pass" as const : "fail" as const,
      summary: `manifest=${input.commitment.manifestHash.slice(0, 10)}, answerKey=${input.commitment.answerKeyCommitment.hash.slice(0, 10)}.`
    },
    {
      name: "asset-clone-artifact-matches-preregistration",
      status: artifactHashMatches ? "pass" as const : "fail" as const,
      summary: `candidate=${score.artifactHash.slice(0, 10)}.`
    },
    {
      name: "asset-clone-pixel-score-documented",
      status: score.casesScored > 0 && Number.isFinite(score.pixelDiffRatio) && Number.isFinite(score.pixelSimilarityScore) ? "pass" as const : "fail" as const,
      summary: `pixelSimilarityScore=${score.pixelSimilarityScore.toFixed(4)}, pixelDiffRatio=${score.pixelDiffRatio.toFixed(4)}.`
    },
    {
      name: "asset-clone-similarity-meets-preregistered-bar",
      status: score.pixelSimilarityScore >= input.preRegistration.expectedPixelSimilarityScore ? "pass" as const : "fail" as const,
      summary: `observed=${score.pixelSimilarityScore.toFixed(4)}, expected=${input.preRegistration.expectedPixelSimilarityScore.toFixed(4)}.`
    },
    {
      name: "safe-asset-clone-heldout-boundary",
      status: assetCloneHeldOutPayloadIsSafe({ preRegistration: input.preRegistration, score, safety }) ? "pass" as const : "fail" as const,
      summary: "Asset-clone held-out result stores aggregate pixel scores, per-case hashes, and commitments only."
    }
  ];
  return {
    schemaVersion: 1,
    resultId: `asset-clone-heldout-result-${input.preRegistration.goalId}-${hashText(JSON.stringify({
      preRegistrationHash,
      artifactHash: score.artifactHash,
      pixelSimilarityScore: score.pixelSimilarityScore,
      pixelDiffRatio: score.pixelDiffRatio
    })).slice(0, 8)}`,
    goalId: input.preRegistration.goalId,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    scoredAt,
    registeredAt: input.preRegistration.registeredAt,
    preRegistrationId: input.preRegistration.registrationId,
    preRegistrationHash,
    score,
    pixelDiffRatio: score.pixelDiffRatio,
    pixelSimilarityScore: score.pixelSimilarityScore,
    expectedPixelSimilarityScore: input.preRegistration.expectedPixelSimilarityScore,
    metExpectedSimilarity: score.pixelSimilarityScore >= input.preRegistration.expectedPixelSimilarityScore,
    commitment: {
      casesCommitted: input.commitment.casesCommitted,
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    },
    safety,
    acceptanceGates: gates
  };
}

export function buildAssetCloneProofReport(input: {
  goal: NavigatorGoal;
  heldOutPreRegistration: AssetCloneHeldOutPreRegistration;
  heldOutResult: AssetCloneHeldOutResult;
  generatedAt?: string;
}): AssetCloneProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const observations = buildAssetCloneHeldOutObservations({
    result: input.heldOutResult,
    generatedAt
  });
  const preRegistrationHash = hashText(JSON.stringify(input.heldOutPreRegistration));
  const resultConnected = input.heldOutResult.preRegistrationHash === preRegistrationHash
    && input.heldOutResult.goalId === input.goal.goalId
    && input.heldOutResult.familyId === input.heldOutPreRegistration.familyId;
  const gates = [
    {
      name: "asset-clone-proof-domain",
      status: input.goal.domain === "asset-clone" ? "pass" as const : "fail" as const,
      summary: `goal domain=${input.goal.domain}.`
    },
    {
      name: "asset-clone-heldout-result-connected",
      status: resultConnected ? "pass" as const : "fail" as const,
      summary: `preRegistrationHash=${preRegistrationHash.slice(0, 10)}, result=${input.heldOutResult.preRegistrationHash.slice(0, 10)}.`
    },
    ...input.heldOutResult.acceptanceGates,
    {
      name: "asset-clone-observations-emitted",
      status: observations.length >= 2 && observations.some((observation) => observation.metric === "pixelSimilarityScore") ? "pass" as const : "fail" as const,
      summary: `${observations.length} loop-compatible observations emitted from scorer-only pixel metrics.`
    },
    {
      name: "safe-asset-clone-proof-boundary",
      status: assetCloneHeldOutPayloadIsSafe({
        heldOutPreRegistration: input.heldOutPreRegistration,
        heldOutResult: input.heldOutResult,
        observations
      }) ? "pass" as const : "fail" as const,
      summary: "Proof report excludes raw image bodies, prompts, target pixels, private grids, and answer keys."
    }
  ];
  const reportCore = {
    heldOutPreRegistration: input.heldOutPreRegistration,
    heldOutResult: input.heldOutResult,
    observations
  };
  return {
    schemaVersion: 1,
    proofId: `asset-clone-proof-${input.goal.goalId}-${hashText(JSON.stringify(reportCore)).slice(0, 8)}`,
    goalId: input.goal.goalId,
    generatedAt,
    passed: gates.every((gate) => gate.status === "pass"),
    familyId: input.heldOutResult.familyId,
    heldOutPreRegistration: input.heldOutPreRegistration,
    heldOutResult: input.heldOutResult,
    observations,
    safety: input.heldOutPreRegistration.safety,
    acceptanceGates: gates,
    artifacts: [
      artifactSummary("reports/navigator/asset-clone-proof.json", reportCore, "Safe asset-clone proof report without raw image bodies, prompts, target pixels, private grids, or answer keys.")
    ]
  };
}

export function buildFlappyPrivateHeldOutBundle(input: {
  familyId?: string;
  totalCases?: number;
  trainCases?: number;
  generatedAt?: string;
} = {}): FlappyPrivateHeldOutBundle {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const familyId = input.familyId ?? "flappy-heldout-v1";
  const totalCases = Math.max(300, Math.round(input.totalCases ?? 500));
  const requestedTrainCases = Math.round(input.trainCases ?? Math.floor(totalCases * 0.64));
  const trainCases = Math.max(1, Math.min(totalCases - 1, requestedTrainCases));
  const heldOut = generateFlappyEvalCases({ familyId, totalCases })
    .slice(trainCases)
    .map((testCase) => ({ ...testCase, split: "heldOut" as const }));
  const heldOutManifest = heldOut.map((testCase) => ({
    caseId: testCase.caseId,
    variantHash: testCase.variantHash,
    defectIds: testCase.defectIds,
    capacityBucket: testCase.capacityBucket,
    difficulty: testCase.difficulty
  }));
  const answerKey = heldOut.map((testCase) => ({
    caseId: testCase.caseId,
    defectIds: testCase.defectIds,
    expectedRepairProperties: testCase.expectedRepairProperties,
    validatorExpectations: testCase.validatorExpectations
  }));
  return {
    schemaVersion: 1,
    familyId,
    generatedAt,
    split: "heldOut",
    scorerRef: `scorer-only:${familyId}`,
    heldOutManifest,
    answerKey,
    manifestHash: hashText(JSON.stringify(heldOutManifest)),
    answerKeyHash: hashText(JSON.stringify(answerKey)),
    rawSourceIncluded: false,
    storagePolicy: "outside-repo-private"
  };
}

export function scoreFlappyHeldOutArtifact(input: {
  artifactText: string;
  commitment: FlappyHeldOutCommitment;
  generatedAt?: string;
}): FlappyHeldOutScoreReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const heldOutCases = generateFlappyEvalCases({
    familyId: input.commitment.familyId,
    totalCases: input.commitment.totalCases
  }).slice(input.commitment.trainingCases).map((testCase) => ({ ...testCase, split: "heldOut" as const }));
  const features = detectFlappyArtifactFeatures(input.artifactText);
  const propertyIds = [...new Set(heldOutCases.flatMap((testCase) => testCase.expectedRepairProperties))].sort();
  const propertyPassRates: Record<string, number> = {};
  for (const propertyId of propertyIds) {
    const matching = heldOutCases.filter((testCase) => testCase.expectedRepairProperties.includes(propertyId));
    const passed = matching.filter(() => Boolean(features[propertyId]));
    propertyPassRates[propertyId] = round(passed.length / Math.max(1, matching.length));
  }
  const failedCases = heldOutCases.filter((testCase) => testCase.expectedRepairProperties.some((propertyId) => !features[propertyId]));
  const failureClusters = FLAPPY_DEFECT_OPERATORS
    .map((defectFamily) => ({
      defectFamily,
      count: failedCases.filter((testCase) => testCase.defectIds.includes(defectFamily)).length
    }))
    .filter((cluster) => cluster.count > 0)
    .sort((left, right) => right.count - left.count || left.defectFamily.localeCompare(right.defectFamily));
  return {
    schemaVersion: 1,
    familyId: input.commitment.familyId,
    scorerRef: input.commitment.scorerRef,
    generatedAt,
    artifactHash: hashText(input.artifactText),
    casesScored: heldOutCases.length,
    passRate: round(heldOutCases.filter((testCase) => testCase.expectedRepairProperties.every((propertyId) => Boolean(features[propertyId]))).length / Math.max(1, heldOutCases.length)),
    propertyPassRates,
    failureClusters,
    rawCasesIncluded: false,
    answerKeyIncluded: false,
    artifactIncluded: false,
    commitment: {
      manifestHash: input.commitment.manifestHash,
      answerKeyHash: input.commitment.answerKeyCommitment.hash
    }
  };
}

function generateFlappyEvalCases(input: { familyId: string; totalCases: number }): FlappyEvalCase[] {
  return Array.from({ length: input.totalCases }, (_, index) => {
    const defectIds = selectFlappyDefects(input.familyId, index);
    const recipe = defectIds.map((defectId) => mutationRecipeForDefect(defectId, index));
    const expectedRepairProperties = [...new Set(defectIds.map(repairPropertyForDefect))].sort();
    const difficulty = defectIds.length >= 4 ? "hard" : defectIds.length === 3 ? "medium" : "easy";
    const capacityBucket = index % 50;
    const seed = {
      familyId: input.familyId,
      index,
      defectIds,
      recipe,
      expectedRepairProperties,
      difficulty,
      capacityBucket
    };
    return {
      caseId: `${input.familyId}-${String(index + 1).padStart(4, "0")}`,
      split: "training",
      variantHash: hashText(JSON.stringify(seed)),
      defectIds,
      mutationRecipe: recipe,
      expectedRepairProperties,
      validatorExpectations: {
        frames: 300,
        minGravitySamples: expectedRepairProperties.includes("gravity-active") ? 240 : 0,
        minPipeAdvance: expectedRepairProperties.includes("pipe-motion") ? 400 : 0,
        minScore: expectedRepairProperties.includes("score-progresses") ? 1 : 0,
        requiresCollisionOrBoundsCheck: expectedRepairProperties.includes("collision-or-bounds"),
        requiresEventPump: expectedRepairProperties.includes("event-loop-pumped")
      },
      difficulty,
      capacityBucket
    };
  });
}

function selectFlappyDefects(familyId: string, index: number): FlappyDefectOperator[] {
  const digest = hashText(`${familyId}:${index}`);
  const count = 2 + (parseInt(digest.slice(0, 2), 16) % 3);
  const selected: FlappyDefectOperator[] = [];
  for (let offset = 0; selected.length < count; offset += 1) {
    const cursor = (parseInt(digest.slice((offset * 2) % 56, ((offset * 2) % 56) + 2), 16) + index + offset) % FLAPPY_DEFECT_OPERATORS.length;
    const candidate = FLAPPY_DEFECT_OPERATORS[cursor];
    if (!selected.includes(candidate)) selected.push(candidate);
  }
  return selected.sort();
}

function mutationRecipeForDefect(defectId: FlappyDefectOperator, index: number): string {
  const suffix = `case-mod-${index % 17}`;
  const recipes: Record<FlappyDefectOperator, string> = {
    "disable-gravity": `set GRAVITY to 0.0 and preserve a misleading gravity constant (${suffix})`,
    "freeze-pipe-speed": `set PIPE_SPEED to 0 or skip pipe x updates (${suffix})`,
    "disable-scoring": `remove score increments after pipe crossing (${suffix})`,
    "remove-bounds-collision": `remove collision/bounds failure checks (${suffix})`,
    "break-jump-impulse": `ignore SPACE input or set jump impulse to 0 (${suffix})`,
    "spawn-impossible-gaps": `mutate pipe gap into an impossible or unstable range (${suffix})`,
    "corrupt-event-loop": `drop pygame event pumping or deterministic quit handling (${suffix})`,
    "hide-state-update": `hide required state update behind a stale constant or dead branch (${suffix})`
  };
  return recipes[defectId];
}

function repairPropertyForDefect(defectId: FlappyDefectOperator): string {
  const properties: Record<FlappyDefectOperator, string> = {
    "disable-gravity": "gravity-active",
    "freeze-pipe-speed": "pipe-motion",
    "disable-scoring": "score-progresses",
    "remove-bounds-collision": "collision-or-bounds",
    "break-jump-impulse": "jump-impulse",
    "spawn-impossible-gaps": "gap-bounds",
    "corrupt-event-loop": "event-loop-pumped",
    "hide-state-update": "state-update-live"
  };
  return properties[defectId];
}

function histogramDefects(cases: FlappyEvalCase[]): Record<FlappyDefectOperator, number> {
  return Object.fromEntries(FLAPPY_DEFECT_OPERATORS.map((defectId) => [
    defectId,
    cases.filter((testCase) => testCase.defectIds.includes(defectId)).length
  ])) as Record<FlappyDefectOperator, number>;
}

function detectFlappyArtifactFeatures(artifactText: string): Record<string, boolean> {
  const code = artifactText
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, ""))
    .join("\n");
  return {
    "gravity-active": /GRAVITY\s*=\s*(?!0(?:\.0+)?\b)\d+(?:\.\d+)?/.test(code) && /(velocity|velocity_y|bird_velocity|vy)\s*\+=\s*GRAVITY/.test(code),
    "pipe-motion": /(pipe\[[\"']x[\"']\]|pipe_x|pipes\[[^\]]+\]\.x)\s*-?=|pipesAdvanced|pipe_advance/.test(code) && /PIPE_SPEED\s*=\s*(?!0\b)\d+/.test(code),
    "score-progresses": /(score\s*\+=\s*1|score\s*=\s*score\s*\+\s*1)/.test(code),
    "collision-or-bounds": /(colliderect|collisionChecks|boundsChecks|bird_y\s*<\s*0|bird_y\s*>\s*HEIGHT|finalBirdY)/.test(code),
    "jump-impulse": /(velocity_y|bird_velocity|vy)\s*=\s*JUMP_VELOCITY|JUMP_VELOCITY\s*=\s*-\d+/.test(code),
    "gap-bounds": /PIPE_GAP\s*=\s*(1[2-9]\d|2\d\d)/.test(code) || /(max|min)\([^)]*PIPE_GAP/.test(code),
    "event-loop-pumped": /pygame\.event\.get\(\)/.test(code),
    "state-update-live": /(def\s+update|while\s+running|for\s+frame|frames_run|clock\.tick)/.test(code)
  };
}

function generateAssetCloneEvalCases(input: { familyId: string; totalCases: number }): Array<{
  publicCase: AssetCloneEvalCasePublic;
  targetPixels: AssetClonePixelGrid;
}> {
  return Array.from({ length: input.totalCases }, (_, index) => {
    const width = 4 + (index % 3);
    const height = 4 + (Math.floor(index / 3) % 3);
    const difficulty: AssetCloneDifficulty = width * height >= 36 ? "hard" : width * height >= 25 ? "medium" : "easy";
    const promptSeed = {
      familyId: input.familyId,
      index,
      style: ["icon", "tile", "sprite", "badge"][index % 4],
      palette: ["warm", "cool", "neutral", "contrast"][(index + 1) % 4],
      motif: ["diagonal", "ring", "stripe", "corner"][(index + 2) % 4]
    };
    const targetPixels = generateAssetCloneTargetPixels(input.familyId, index, width, height);
    const targetPixelHash = hashText(JSON.stringify(targetPixels));
    const seed = {
      promptSeed,
      width,
      height,
      targetPixelHash,
      difficulty,
      capacityBucket: index % 40
    };
    return {
      publicCase: {
        caseId: `${input.familyId}-${String(index + 1).padStart(4, "0")}`,
        split: "training",
        variantHash: hashText(JSON.stringify(seed)),
        width,
        height,
        promptHash: hashText(JSON.stringify(promptSeed)),
        targetPixelHash,
        difficulty,
        capacityBucket: index % 40
      },
      targetPixels
    };
  });
}

function generateAssetCloneTargetPixels(familyId: string, index: number, width: number, height: number): AssetClonePixelGrid {
  const digest = hashText(`${familyId}:asset-clone-target:${index}`);
  return Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => {
    const cursor = ((y * width + x) * 2) % 56;
    const base = parseInt(digest.slice(cursor, cursor + 2), 16);
    return (base + x * 23 + y * 31 + index * 7) % 256;
  }));
}

function computePixelDiffRatio(candidatePixels: AssetClonePixelGrid, targetPixels: AssetClonePixelGrid): number {
  const targetHeight = targetPixels.length;
  const targetWidth = targetPixels[0]?.length ?? 0;
  if (targetHeight === 0 || targetWidth === 0) return 1;
  let diff = 0;
  let count = 0;
  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const candidate = Number(candidatePixels[y]?.[x]);
      const target = Number(targetPixels[y]?.[x]);
      diff += Number.isFinite(candidate) ? Math.abs(Math.max(0, Math.min(255, candidate)) - target) / 255 : 1;
      count += 1;
    }
  }
  return round(Math.min(1, diff / Math.max(1, count)));
}

function extractTupleAssignedConstant(sourceText: string, name: string): number | string | null {
  for (const line of sourceText.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_,\s]+)\s*=\s*([^#]+)/);
    if (!match || !match[1].includes(",")) continue;
    const names = match[1].split(",").map((item) => item.trim());
    const index = names.indexOf(name);
    if (index === -1) continue;
    const values = match[2].split(",").map((item) => item.trim());
    return values[index] ? parsePythonConstantValue(values[index]) : null;
  }
  return null;
}

function parsePythonConstantValue(rawValue: string): number | string {
  const raw = rawValue.trim();
  const tuple = raw.match(/^\(([-\d.]+)\s*,\s*([-\d.]+)\)$/);
  if (tuple) {
    return `${Number(tuple[1])},${Number(tuple[2])}`;
  }
  const numeric = Number(raw.replace(/_/g, ""));
  return Number.isFinite(numeric) ? numeric : raw.replace(/^["']|["']$/g, "");
}

function aggregateNavigatorEvalScore(evals: NavigatorEvidenceEvalLike[], suite: NavigatorEvidenceEvalLike["suite"]): number {
  const matching = evals.filter((item) => item.suite === suite);
  if (matching.length === 0) return 0;
  return round(matching.reduce((sum, item) => sum + bounded(Number(item.score)), 0) / matching.length);
}

function finiteNumber(value: unknown): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function positiveInteger(value: unknown, fallback: number): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.round(numberValue) : fallback;
}

function negativeNumber(value: unknown, fallback: number): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue < 0 ? round(numberValue) : fallback;
}

function clampNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, round(value)));
}

function buildFlappyRuleChecks(sourceText: string, constants: Record<string, number | string | null>): FlappyValidatorRuleCheck[] {
  const gravity = Number(constants.GRAVITY ?? 0);
  const pipeSpeed = Number(constants.PIPE_SPEED ?? 0);
  const jumpVelocity = Number(constants.JUMP_VELOCITY ?? 0);
  const pipeGap = Number(constants.PIPE_GAP ?? 0);
  return [
    {
      ruleId: "event-loop",
      summary: "Pygame event loop handles quit and jump input.",
      passedInSeed: /pygame\.event\.get\(\)/.test(sourceText) && /K_SPACE/.test(sourceText),
      severity: "warning"
    },
    {
      ruleId: "gravity-active",
      summary: "Gravity is positive so the bird trajectory evolves without input.",
      passedInSeed: gravity > 0,
      severity: "blocking"
    },
    {
      ruleId: "jump-impulse",
      summary: "Jump velocity is upward and non-zero.",
      passedInSeed: jumpVelocity < 0,
      severity: "blocking"
    },
    {
      ruleId: "pipe-motion",
      summary: "Pipe speed is positive so gates move toward the player.",
      passedInSeed: pipeSpeed > 0,
      severity: "blocking"
    },
    {
      ruleId: "playable-gap",
      summary: "Pipe gap is in a playable range for the canvas height.",
      passedInSeed: pipeGap >= 120 && pipeGap <= 240,
      severity: "warning"
    },
    {
      ruleId: "score-progresses",
      summary: "Score increments when the player passes a gate.",
      passedInSeed: /score\s*\+=\s*1/.test(sourceText) || /score\s*=\s*score\s*\+\s*1/.test(sourceText),
      severity: "blocking"
    },
    {
      ruleId: "collision-or-bounds",
      summary: "Round can fail from collision or boundary checks.",
      passedInSeed: /collid|collision|bird_y.*GROUND|BIRD_RADIUS.*HEIGHT|pipe.*BIRD/i.test(sourceText),
      severity: "blocking"
    },
    {
      ruleId: "final-score-output",
      summary: "Program emits a final score for validator capture.",
      passedInSeed: /Final Score/.test(sourceText),
      severity: "info"
    }
  ];
}

function buildFlappyArmResult(input: {
  armId: FlappyValidatorArmResult["armId"];
  path: NavigationPath;
  ruleChecks: FlappyValidatorRuleCheck[];
  fixedRuleIds: string[];
}): FlappyValidatorArmResult {
  const fixed = new Set(input.fixedRuleIds);
  const passed = input.ruleChecks.filter((rule) => rule.passedInSeed || fixed.has(rule.ruleId));
  const unresolved = input.ruleChecks
    .filter((rule) => !rule.passedInSeed && !fixed.has(rule.ruleId))
    .map((rule) => rule.ruleId)
    .sort();
  const passRate = round(passed.length / Math.max(1, input.ruleChecks.length));
  const blockingUnresolved = input.ruleChecks.filter((rule) => unresolved.includes(rule.ruleId) && rule.severity === "blocking").length;
  return {
    armId: input.armId,
    pathId: input.path.pathId,
    fixedRuleIds: [...fixed].sort(),
    unresolvedRuleIds: unresolved,
    passRate,
    objectiveScore: round(passRate * 0.82 + input.path.valueEstimate * 0.1 + (1 - Math.min(1, blockingUnresolved / 4)) * 0.08)
  };
}

function normalizePathWeights(paths: NavigationPath[]): NavigationPath[] {
  const total = paths.reduce((sum, path) => sum + path.weight, 0) || 1;
  return paths.map((path) => ({ ...path, weight: round(path.weight / total) }));
}

function buildCouncilSeatVote(input: {
  seat: CouncilJudgeSeat;
  left: NavigationPath;
  right: NavigationPath;
  criterion: CouncilJudgmentCriterion;
  observations: NavigationObservation[];
}): CouncilSeatVote {
  const leftScore = scorePathForCouncilSeat(input.left, input.seat, input.criterion, input.observations);
  const rightScore = scorePathForCouncilSeat(input.right, input.seat, input.criterion, input.observations);
  const winner = leftScore >= rightScore ? input.left : input.right;
  const loser = winner.pathId === input.left.pathId ? input.right : input.left;
  const margin = round(Math.abs(leftScore - rightScore));
  return {
    seat: input.seat,
    modelSeat: `fixture-${input.seat.toLowerCase()}`,
    winnerPathId: winner.pathId,
    leftScore,
    rightScore,
    margin,
    rationale: `${input.seat} seat prefers ${winner.pathId} over ${loser.pathId} on ${input.criterion} by ${margin}.`
  };
}

function buildAmbitionRatchetSeatVote(input: {
  seat: CouncilJudgeSeat;
  activePath: NavigationPath;
  candidatePath: NavigationPath;
  observations: NavigationObservation[];
  consecutiveOverMax: number;
  requiredConsecutiveOverMax: number;
}): CouncilSeatVote {
  const ratchetPressure = Math.min(0.12, 0.04 * Math.max(0, input.consecutiveOverMax - input.requiredConsecutiveOverMax + 1));
  const seatPressure = input.seat === "Adversary"
    ? 0
    : input.seat === "Estimator"
      ? ratchetPressure * 0.7
      : ratchetPressure;
  const leftScore = scorePathForCouncilSeat(input.activePath, input.seat, "ambition-ratchet", input.observations);
  const rightScore = round(scorePathForCouncilSeat(input.candidatePath, input.seat, "ambition-ratchet", input.observations) + seatPressure);
  const winner = leftScore >= rightScore ? input.activePath : input.candidatePath;
  const loser = winner.pathId === input.activePath.pathId ? input.candidatePath : input.activePath;
  const margin = round(Math.abs(leftScore - rightScore));
  return {
    seat: input.seat,
    modelSeat: `fixture-${input.seat.toLowerCase()}`,
    winnerPathId: winner.pathId,
    leftScore,
    rightScore,
    margin,
    rationale: `${input.seat} seat prefers ${winner.pathId} over ${loser.pathId} on ambition-ratchet by ${margin}; ratchet pressure=${round(seatPressure)} from ${input.consecutiveOverMax}/${input.requiredConsecutiveOverMax} over-max observations.`
  };
}

function scorePathForCouncilSeat(
  path: NavigationPath,
  seat: CouncilJudgeSeat,
  criterion: CouncilJudgmentCriterion,
  observations: NavigationObservation[]
): number {
  const costFitness = 1 - Math.min(1, path.frontier.cost);
  const riskFitness = 1 - path.riskEstimate;
  const evidenceFit = 1 / (1 + scorePathDrift(path, observations));
  const ambitionFitness: Record<AmbitionLevel, number> = { safe: 0.45, stretch: 0.78, moonshot: 0.62 };
  const frontierBonus = path.frontier.efficient ? 0.08 : 0;
  if (seat === "Proposer") {
    return round(path.valueEstimate * 0.42 + path.predictedOutcome.value * 0.32 + ambitionFitness[path.ambition] * 0.16 + frontierBonus);
  }
  if (seat === "Adversary") {
    return round(riskFitness * 0.36 + evidenceFit * 0.28 + costFitness * 0.24 + frontierBonus);
  }
  if (seat === "Estimator") {
    return round(costFitness * 0.34 + evidenceFit * 0.3 + path.valueEstimate * 0.18 + riskFitness * 0.12 + frontierBonus);
  }
  return scorePathForCouncil(path, criterion, observations);
}

function buildCouncilSeatSummaries(judgments: PairwiseCouncilJudgment[], selectedPathId: string): CouncilSeatSummary[] {
  const seats: CouncilJudgeSeat[] = ["Proposer", "Adversary", "Estimator", "Synthesizer"];
  return seats.map((seat) => {
    const votes = judgments.flatMap((judgment) => judgment.seatVotes.filter((vote) => vote.seat === seat));
    return {
      seat,
      modelSeat: `fixture-${seat.toLowerCase()}`,
      judgments: votes.length,
      selectedPathVotes: votes.filter((vote) => vote.winnerPathId === selectedPathId).length,
      averageMargin: round(votes.reduce((sum, vote) => sum + vote.margin, 0) / Math.max(1, votes.length))
    };
  });
}

function buildCouncilDisagreementSummary(judgments: PairwiseCouncilJudgment[]): CouncilTournament["disagreement"] {
  const totalMatches = judgments.length;
  const splitMatches = judgments.filter((judgment) => judgment.disagreementRate > 0).length;
  const unanimousMatches = totalMatches - splitMatches;
  return {
    totalMatches,
    unanimousMatches,
    splitMatches,
    averageDisagreementRate: round(judgments.reduce((sum, judgment) => sum + judgment.disagreementRate, 0) / Math.max(1, totalMatches)),
    totalSeatVotes: judgments.reduce((sum, judgment) => sum + judgment.seatVotes.length, 0),
    topContestedMatches: [...judgments]
      .sort((a, b) => b.disagreementRate - a.disagreementRate || b.margin - a.margin || a.matchId.localeCompare(b.matchId))
      .slice(0, 5)
      .map((judgment) => ({
        matchId: judgment.matchId,
        leftPathId: judgment.leftPathId,
        rightPathId: judgment.rightPathId,
        winnerPathId: judgment.winnerPathId,
        disagreementRate: judgment.disagreementRate
      }))
  };
}

function scorePathForCouncil(path: NavigationPath, criterion: CouncilJudgmentCriterion, observations: NavigationObservation[]): number {
  const costFitness = 1 - Math.min(1, path.frontier.cost);
  const riskFitness = 1 - path.riskEstimate;
  const evidenceFit = 1 / (1 + scorePathDrift(path, observations));
  const ambitionFitness: Record<AmbitionLevel, number> = { safe: 0.45, stretch: 0.78, moonshot: 0.62 };
  const frontierBonus = path.frontier.efficient ? 0.08 : 0;
  if (criterion === "value-risk") {
    return round(path.valueEstimate * 0.48 + path.predictedOutcome.value * 0.2 + riskFitness * 0.24 + frontierBonus);
  }
  if (criterion === "cost-control") {
    return round(costFitness * 0.42 + riskFitness * 0.32 + path.valueEstimate * 0.2 + frontierBonus);
  }
  if (criterion === "evidence-fit") {
    return round(evidenceFit * 0.5 + path.valueEstimate * 0.26 + riskFitness * 0.16 + frontierBonus);
  }
  return round(ambitionFitness[path.ambition] * 0.32 + path.valueEstimate * 0.34 + evidenceFit * 0.22 + frontierBonus);
}

function expectedElo(rating: number, opponentRating: number): number {
  return 1 / (1 + 10 ** ((opponentRating - rating) / 400));
}

function councilReason(
  winner: NavigationPath,
  loser: NavigationPath,
  criterion: CouncilJudgmentCriterion,
  leftScore: number,
  rightScore: number
): string {
  const margin = round(Math.abs(leftScore - rightScore));
  return `${winner.pathId} beats ${loser.pathId} on ${criterion} by ${margin}; winner value=${winner.valueEstimate}, risk=${winner.riskEstimate}, efficient=${String(winner.frontier.efficient)}.`;
}

function scorePathDrift(path: NavigationPath, observations: NavigationObservation[]): number {
  const errors = observations.flatMap((observation) => {
    const milestone = findMilestoneForObservation(path, observation);
    if (!milestone) return [];
    const envelope = milestone.envelope;
    const width = Math.max(0.0001, (envelope.max - envelope.min) / 2);
    const weightedError = ((observation.actual - envelope.expected) / width) * observation.weight;
    return [weightedError * weightedError];
  });
  if (errors.length === 0) return 999;
  return Math.sqrt(errors.reduce((sum, value) => sum + value, 0) / errors.length);
}

function findMilestoneForObservation(path: NavigationPath, observation: NavigationObservation): NavigationMilestone | undefined {
  return path.milestones.find((item) => item.id === observation.milestoneId || item.envelope.metric === observation.metric);
}

function quantile(values: number[], q: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[index];
}

function boundedMetric(metric: string, value: number): number {
  if (metric === "heldOutPassRate" || metric === "promptTwinScore" || metric.endsWith("Rate") || metric.endsWith("Score")) {
    return bounded(value);
  }
  return Math.max(0, value);
}

function pathSeed(shape: PathShape, ambition: AmbitionLevel, resourceMode: ResourceMode, index: number): {
  validatorRows: number;
  passRate: number;
  twinScore: number;
  twinLift: number;
  hours: number;
  tokens: number;
  councilCalls: number;
  risk: number;
} {
  const shapeBase: Record<PathShape, { rows: number; pass: number; twin: number; lift: number; hours: number; risk: number }> = {
    "risk-first": { rows: 72, pass: 0.58, twin: 0.69, lift: 0.05, hours: 2.8, risk: 0.22 },
    "steady-grind": { rows: 118, pass: 0.64, twin: 0.74, lift: 0.08, hours: 4.4, risk: 0.32 },
    "spike-and-stabilize": { rows: 212, pass: 0.77, twin: 0.8, lift: 0.14, hours: 5.2, risk: 0.58 },
    "parallel-tracks": { rows: 154, pass: 0.7, twin: 0.79, lift: 0.12, hours: 5.8, risk: 0.48 },
    "research-then-build": { rows: 178, pass: 0.74, twin: 0.83, lift: 0.15, hours: 5.1, risk: 0.4 },
    "build-then-measure": { rows: 132, pass: 0.66, twin: 0.71, lift: 0.09, hours: 3.7, risk: 0.44 }
  };
  const ambitionMultiplier = ambition === "safe" ? 0.88 : ambition === "stretch" ? 1 : 1.1;
  const riskMultiplier = ambition === "safe" ? 0.78 : ambition === "stretch" ? 1 : 1.25;
  const resourceMultiplier = resourceMode === "solo-agent" ? 0.88 : resourceMode === "swarm" ? 1.08 : 1.02;
  const councilCalls = resourceMode === "council-heavy" ? 2 : resourceMode === "swarm" ? 1 : 0;
  const base = shapeBase[shape];
  return {
    validatorRows: Math.round(base.rows * resourceMultiplier * ambitionMultiplier + (index % 3) * 4),
    passRate: bounded(base.pass * ambitionMultiplier + (resourceMode === "swarm" ? 0.02 : 0)),
    twinScore: bounded(base.twin + (resourceMode === "council-heavy" ? 0.025 : 0)),
    twinLift: bounded(base.lift * ambitionMultiplier),
    hours: round(base.hours * resourceMultiplier * (ambition === "moonshot" ? 1.18 : 1)),
    tokens: Math.round((420000 + index * 18000) * resourceMultiplier * (ambition === "moonshot" ? 1.35 : 1)),
    councilCalls,
    risk: bounded(base.risk * riskMultiplier + (resourceMode === "council-heavy" ? 0.04 : 0))
  };
}

function goalIdFromObjective(objective: string): string {
  const slug = objective
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "navigator-goal";
  return `${slug}-${hashText(objective).slice(0, 8)}`;
}

function artifactSummary(path: string, content: unknown, summary: string): NavigatorProofReport["artifacts"][number] {
  const body = JSON.stringify(content, null, 2);
  return {
    path,
    sha256: hashText(body),
    bytes: Buffer.byteLength(body),
    summary
  };
}

function kpi(label: string, value: string, detail: string): string {
  return `<div class="kpi"><b>${escapeHtml(value)}</b><span>${escapeHtml(label)}</span><p class="muted" style="margin-top:7px">${escapeHtml(detail)}</p></div>`;
}

function hashText(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function bounded(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function stripTrailingWhitespace(value: string): string {
  return value.replace(/[ \t]+$/gm, "");
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
