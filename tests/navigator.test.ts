import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildAssetCloneEvalFactoryReport,
  buildAssetCloneHeldOutPreRegistration,
  buildAssetClonePrivateHeldOutBundle,
  buildAssetCloneProofReport,
  buildFlappyPygameRepairReport,
  buildFlappyEvalFactoryReport,
  buildFlappyPromptTwinAbHeldOutPreRegistration,
  buildFlappyPrivateHeldOutBundle,
  buildFlappyPromptTwinAbProofReport,
  buildFlappySourceMutationProofReport,
  buildFixturePromptTwinJudgmentEvidence,
  buildFlappyValidatorRealityReport,
  buildConformalEnvelopeReport,
  buildFixtureNavigatorObservations,
  buildFixtureNavigatorLoopObservations,
  buildWorkspaceOpsToolKindCatalog,
  buildNavigatorLoopProofReport,
  buildNavigatorDailyLoopProofReport,
  buildNavigatorMonorepoPrimitiveProofReport,
  buildNavigatorN2ProofReport,
  buildProviderCouncilSessionEvidence,
  buildNavigatorProviderCouncilProofReport,
  buildNavigatorProviderCouncilSessionProofReport,
  buildNavigatorProofReport,
  buildNavigatorPromptTwinProofReport,
  buildNavigatorValidatorProofReport,
  buildMissionEvidenceObservations,
  buildPathCalibrationReport,
  buildPathFanPreRegistration,
  buildResearchEvidenceObservations,
  coerceFlappyPygameRuntimeSummary,
  compileNavigatorGoal,
  computeObservationWeightMix,
  computeProgressSharpeScore,
  buildCouncilTournament,
  generateNavigationPaths,
  getPrimaryToolQualifications,
  isQualifiedForTool,
  isWorkspaceOpsApprovalRequiredToolKind,
  parseAgentToolQualifications,
  qualifiedToolKinds,
  summarizeShapeMemoryApplication,
  summarizeNavigationPathToolKinds,
  renderFlappyPygameRepairScript,
  renderFlappyPygameControlScript,
  renderAssetCloneProofMarkdown,
  renderFlappyPromptTwinAbProofMarkdown,
  renderFlappySourceMutationProofMarkdown,
  renderNavigatorDailyLoopProofMarkdown,
  renderNavigatorLoopProofMarkdown,
  renderNavigatorMonorepoPrimitiveProofMarkdown,
  renderNavigatorN2ProofMarkdown,
  renderNavigatorProviderCouncilProofMarkdown,
  renderNavigatorProviderCouncilSessionProofMarkdown,
  renderNavigatorPromptTwinProofMarkdown,
  renderNavigatorValidatorProofMarkdown,
  renderNavigatorHudHtml,
  reweightNavigationPaths,
  scoreFlappyHeldOutArtifact,
  scoreAssetCloneHeldOut,
  scoreAssetClonePixelDiffArtifact,
  scoreFlappyPromptTwinAbHeldOut,
  validateNavigationPathToolKinds,
  validateWorkspaceOpsToolKinds
} from "@playbasis-agent-os/navigator";

const objective = "Make twin-steered harness runs measurably beat the control manager on held-out Flappy Bird variants";

describe("navigator", () => {
  it("compiles a goal with measurable SOTA properties and a council falsifier", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");

    expect(goal.goalId).toContain("make-twin-steered-harness-runs");
    expect(goal.sotaDefinition.measurableProperties.length).toBeGreaterThanOrEqual(4);
    expect(goal.valueFunction.map((item) => item.layer)).toEqual([
      "reality",
      "heldOut",
      "trust",
      "promptTwin",
      "council"
    ]);
    expect(goal.councilSeed.convened).toBe(true);
    expect(goal.councilSeed.falsifier).toMatch(/path fan/i);
    expect(goal.lossFunction.target.primaryMetric).toBe("heldOutPassRate");
    expect(goal.lossFunction.target.direction).toBe("maximize");
    expect(goal.lossFunction.target.blindedEvalRef).toMatch(/^scorer-only:/);
    expect(goal.lossFunction.target.answerKeyCommitment.algorithm).toBe("sha256");
    expect(goal.lossFunction.target.answerKeyCommitment.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(goal.lossFunction.constraints.map((constraint) => constraint.name)).toEqual(expect.arrayContaining([
      "wall_clock_hours",
      "provider_spend_usd",
      "safe_evidence_only",
      "held_out_blinding"
    ]));
    expect(goal.lossFunction.instruments.some((instrument) => instrument.name === "held-out-score" && instrument.optimizerVisible === false)).toBe(true);
    expect(goal.lossFunction.entropyRules.map((rule) => rule.name)).toEqual([
      "memorization_alarm",
      "stall_exploration",
      "cycle_hypothesis_required"
    ]);
    expect(goal.lossFunction.timeCostPenalty.selectionMetric).toBe("progressSharpe");
    expect(goal.lossFunction.preRegistration.blindedEvalStorage).toBe("scorer-only");
    const schema = JSON.parse(readFileSync("schemas/navigator/goal.schema.json", "utf8")) as { required: string[]; properties: Record<string, unknown> };
    expect(schema.required).toContain("lossFunction");
    expect(schema.properties.lossFunction).toBeTruthy();
  });

  it("generates a diverse weighted path fan with frontier candidates", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const totalWeight = paths.reduce((sum, path) => sum + path.weight, 0);

    expect(paths).toHaveLength(20);
    expect(new Set(paths.map((path) => path.shape)).size).toBeGreaterThanOrEqual(5);
    expect(new Set(paths.map((path) => path.ambition)).size).toBe(3);
    expect(new Set(paths.map((path) => path.milestones.map((milestone) => milestone.state).join("|"))).size).toBeGreaterThanOrEqual(5);
    expect(paths.some((path) => path.frontier.efficient)).toBe(true);
    expect(totalWeight).toBeCloseTo(1, 2);
  });

  it("maps generated paths to the WorkspaceOps tool-kind catalog with approval parity", () => {
    const catalog = buildWorkspaceOpsToolKindCatalog();
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const validations = paths.map((path) => validateNavigationPathToolKinds(path, catalog));
    const summary = summarizeNavigationPathToolKinds(paths);
    const parsedQualifications = parseAgentToolQualifications([
      { toolKind: "web_search", proficiency: "primary", description: "source discovery" },
      { toolKind: "document_generate", proficiency: "secondary", description: "report writing" },
      { toolKind: "not_a_tool", proficiency: "primary", description: "invalid" }
    ]);
    const invalid = validateNavigationPathToolKinds({
      ...paths[0],
      toolKinds: [...paths[0].toolKinds, "not_a_tool" as never]
    }, catalog);
    const invalidFlat = validateWorkspaceOpsToolKinds(["web_search", "not_a_tool"]);

    expect(catalog.entries).toHaveLength(21);
    expect(catalog.approvalRequiredToolKinds).toEqual(expect.arrayContaining([
      "video_create",
      "deep_research",
      "file_edit",
      "outbound_api_call",
      "dashboard_app_execute_governed",
      "social_channel_connect",
      "social_post_schedule",
      "social_post_publish"
    ]));
    expect(isWorkspaceOpsApprovalRequiredToolKind("deep_research")).toBe(true);
    expect(isWorkspaceOpsApprovalRequiredToolKind("web_search")).toBe(false);
    expect(validations.every((validation) => validation.valid)).toBe(true);
    expect(paths.every((path) => path.toolKinds.length > 0)).toBe(true);
    expect(paths.every((path) => path.toolQualifications.length > 0)).toBe(true);
    expect(paths.every((path) => path.milestones.every((milestone) => milestone.toolKinds.length > 0))).toBe(true);
    expect(paths.some((path) => path.approvalRequired)).toBe(true);
    expect(paths.some((path) => !path.approvalRequired)).toBe(true);
    expect(summary.pathCount).toBe(20);
    expect(summary.distinctToolKinds).toEqual(expect.arrayContaining(["web_search", "deep_research", "file_edit", "spreadsheet_generate"]));
    expect(summary.approvalRequiredPathCount).toBeGreaterThan(0);
    expect(summary.autoOnlyPathCount).toBeGreaterThan(0);
    expect(parsedQualifications).toHaveLength(2);
    expect(getPrimaryToolQualifications(parsedQualifications).map((qualification) => qualification.toolKind)).toEqual(["web_search"]);
    expect(qualifiedToolKinds(parsedQualifications)).toEqual(["web_search", "document_generate"]);
    expect(isQualifiedForTool(parsedQualifications, "document_generate")).toBe(true);
    expect(invalid.valid).toBe(false);
    expect(invalid.unknownToolKinds).toEqual(["not_a_tool"]);
    expect(invalidFlat.valid).toBe(false);
    expect(invalidFlat.unknownToolKinds).toEqual(["not_a_tool"]);
  });

  it("applies shape-library memory as a reusable prior instead of only writing it", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const baselinePaths = generateNavigationPaths(goal, 20);
    const prior = {
      entryId: "shape-memory-research-stretch-solo",
      goalId: goal.goalId,
      objectiveHash: "a".repeat(64),
      shapeKey: "research-then-build:stretch:solo-agent",
      selectedPathId: "previous-run-p011",
      outcomeScore: 0.9,
      baselineLift: 0.22,
      evidenceHash: "b".repeat(64),
      reusablePrior: {
        shape: "research-then-build" as const,
        ambition: "stretch" as const,
        resourceMode: "solo-agent" as const,
        suggestedWeightBoost: 0.18
      }
    };
    const memoryPaths = generateNavigationPaths(goal, 20, { shapeLibraryEntries: [prior] });
    const baselineTarget = baselinePaths.find((path) => path.shape === "research-then-build" && path.ambition === "stretch" && path.resourceMode === "solo-agent");
    const memoryTarget = memoryPaths.find((path) => path.shape === "research-then-build" && path.ambition === "stretch" && path.resourceMode === "solo-agent");
    const memorySummary = summarizeShapeMemoryApplication(memoryPaths, [prior]);
    const report = buildNavigatorLoopProofReport({
      goal,
      paths: memoryPaths,
      observations: buildFixtureNavigatorLoopObservations("2026-07-04T00:05:00.000Z"),
      shapeLibraryEntries: [prior],
      generatedAt: "2026-07-04T00:10:00.000Z"
    });

    expect(memoryTarget?.memoryPrior?.entryIds).toContain(prior.entryId);
    expect(memoryTarget?.weight ?? 0).toBeGreaterThan(baselineTarget?.weight ?? 0);
    expect(memoryTarget?.valueEstimate ?? 0).toBeGreaterThan(baselineTarget?.valueEstimate ?? 0);
    expect(memorySummary.applied).toBe(true);
    expect(memorySummary.matchedEntryIds).toEqual([prior.entryId]);
    expect(report.passed).toBe(true);
    expect(report.shapeMemory.applied).toBe(true);
    expect(report.ambitionRatchet.action).toBe("hold");
    expect(report.acceptanceGates.find((gate) => gate.name === "shape-memory-prior-consumed")?.status).toBe("pass");
    expect(report.acceptanceGates.find((gate) => gate.name === "ambition-ratchet-policy-applied")?.status).toBe("pass");
  });

  it("reweights the path fan from evidence, switches leading path, and prunes weak paths", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const report = reweightNavigationPaths(paths, buildFixtureNavigatorObservations("2026-07-04T00:05:00.000Z"));

    expect(report.switchOccurred).toBe(true);
    expect(report.prunedPathIds.length).toBeGreaterThan(0);
    expect(report.driftAlarm).toBe(false);
    expect(report.scores[0].pathId).toBe(report.leadingAfter);
  });

  it("pre-registers path fan envelopes and scores forecast calibration from observations", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const observations = buildFixtureNavigatorLoopObservations("2026-07-04T00:05:00.000Z");
    const registration = buildPathFanPreRegistration(goal, paths, "2026-07-04T00:01:00.000Z");
    const calibration = buildPathCalibrationReport({
      goal,
      paths,
      observations,
      selectedPathId: paths[10].pathId,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const report = buildNavigatorLoopProofReport({
      goal,
      paths,
      observations,
      pathFanPreRegistration: registration,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });

    expect(registration.pathCount).toBe(paths.length);
    expect(Date.parse(registration.registeredAt)).toBeLessThan(Date.parse(observations[0].timestamp));
    expect(registration.safety.rawEnvValuesIncluded).toBe(false);
    expect(calibration.scores).toHaveLength(paths.length);
    expect(calibration.selectedPathRank).toBeGreaterThan(0);
    expect(calibration.bestCalibratedPathId).toBe(calibration.scores[0].pathId);
    expect(report.acceptanceGates.find((gate) => gate.name === "path-fan-preregistered")?.status).toBe("pass");
    expect(report.acceptanceGates.find((gate) => gate.name === "forecast-calibration-scored")?.status).toBe("pass");
    expect(report.calibration.scores).toHaveLength(paths.length);
    expect(JSON.stringify(report.pathFanPreRegistration)).not.toContain("OPENAI_API_KEY");
  });

  it("builds a passing proof report and static HUD", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const report = buildNavigatorProofReport({
      goal,
      paths,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const html = renderNavigatorHudHtml({ goal, paths, report });

    expect(report.passed).toBe(true);
    expect(report.switchOccurred).toBe(true);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(html).toContain("Navigator Path Fan HUD");
    expect(html).toContain("Path Fan vs Reality");
    expect(html).not.toContain("selectedFields");
    expect(html).not.toContain("OPENAI_API_KEY");
  });

  it("runs a deterministic council tournament and selects an efficient frontier path", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const tournament = buildCouncilTournament({
      goal,
      paths,
      observations: buildFixtureNavigatorObservations("2026-07-04T00:05:00.000Z"),
      generatedAt: "2026-07-04T00:10:00.000Z"
    });

    expect(tournament.judgments.length).toBeGreaterThanOrEqual(9);
    expect(tournament.payoff.convened).toBe(true);
    expect(tournament.rankedPathIds[0]).toBe(tournament.selectedPathId);
    expect(Object.keys(tournament.eloRatings)).toHaveLength(20);
    expect(tournament.seatSummaries).toHaveLength(4);
    expect(tournament.disagreement.totalSeatVotes).toBe(tournament.judgments.length * 4);
    expect(tournament.judgments.every((judgment) => judgment.seatVotes.length === 4)).toBe(true);
    expect(tournament.disagreement.averageDisagreementRate).toBeGreaterThanOrEqual(0);
    expect(tournament.falsifier).toMatch(/dominated/i);
  });

  it("calibrates conformal drift bands and raises alarms for impossible observations", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const observations = buildFixtureNavigatorObservations("2026-07-04T00:05:00.000Z");
    const report = buildConformalEnvelopeReport({
      paths,
      selectedPathId: paths[0].pathId,
      observations,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const impossible = buildConformalEnvelopeReport({
      paths,
      selectedPathId: paths[0].pathId,
      observations: observations.map((item) => item.metric === "heldOutPassRate" ? { ...item, actual: 2 } : item),
      generatedAt: "2026-07-04T00:10:00.000Z"
    });

    expect(report.bands).toHaveLength(observations.length);
    expect(report.residualHistory.every((item) => item.residuals.length > 0)).toBe(true);
    expect(report.allPathsBreached).toBe(false);
    expect(impossible.alarms.some((alarm) => alarm.metric === "heldOutPassRate")).toBe(true);
  });

  it("builds a passing N2 proof with a compact context packet", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const report = buildNavigatorN2ProofReport({
      goal,
      paths,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorN2ProofMarkdown(report);
    const serializedContext = JSON.stringify(report.contextPacket);

    expect(report.passed).toBe(true);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(report.acceptanceGates.find((gate) => gate.name === "council-seat-diversity-measured")?.status).toBe("pass");
    expect(report.frontierSelection.efficientPathIds).toContain(report.frontierSelection.selectedPathId);
    expect(report.frontierSelection.selectionMetric).toBe("progressSharpe");
    expect(report.frontierSelection.selectedProgressSharpe).toBeGreaterThan(0);
    expect(report.frontierSelection.progressSharpeScores[0].pathId).toBe(report.frontierSelection.selectedPathId);
    expect(report.frontierSelection.progressSharpeScores[0].progressSharpe).toBe(report.frontierSelection.selectedProgressSharpe);
    expect(report.councilTournament.judgments.length).toBeGreaterThan(0);
    expect(report.councilTournament.disagreement.totalSeatVotes).toBeGreaterThan(0);
    expect(report.contextPacket.includedHashes.length).toBeGreaterThanOrEqual(5);
    expect(markdown).toContain("Navigator N2 Proof");
    expect(serializedContext).not.toContain("OPENAI_API_KEY");
    expect(serializedContext).not.toContain("selectedFields");
    expect(serializedContext).not.toContain("https://");
  });

  it("selects efficient-frontier paths by Progress Sharpe instead of raw quality alone", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const templates = generateNavigationPaths(goal, 2);
    const templateA = templates[0];
    const templateB = templates[1];
    if (!templateA || !templateB) throw new Error("Expected two generated path templates.");
    const cheapPath = {
      ...templateA,
      pathId: `${goal.goalId}-cheap-sharpe`,
      predictedOutcome: { ...templateA.predictedOutcome, value: 0.72, band: [0.64, 0.8] as [number, number] },
      estimatedCost: { tokens: 8_000, hours: 1.2, councilCalls: 0 },
      valueEstimate: 0.72,
      riskEstimate: 0.18,
      councilElo: 1030,
      frontier: { value: 0.72, cost: 0.08, risk: 0.18, efficient: false },
      weight: 0.3
    };
    const expensivePath = {
      ...templateB,
      pathId: `${goal.goalId}-expensive-quality`,
      milestones: cheapPath.milestones,
      predictedOutcome: { ...templateB.predictedOutcome, value: 0.9, band: [0.82, 0.98] as [number, number] },
      estimatedCost: { tokens: 320_000, hours: 18, councilCalls: 3 },
      valueEstimate: 0.9,
      riskEstimate: 0.16,
      councilElo: 1280,
      frontier: { value: 0.9, cost: 1.6, risk: 0.16, efficient: false },
      weight: 0.7
    };
    const heldOutMilestone = cheapPath.milestones[1] ?? cheapPath.milestones[0];
    if (!heldOutMilestone) throw new Error("Expected generated path to include at least one milestone.");
    const observations = [
      {
        observationId: "obs-heldout-sharpe-test",
        milestoneId: heldOutMilestone.id,
        metric: heldOutMilestone.envelope.metric,
        actual: heldOutMilestone.envelope.expected,
        sourceLayer: "heldOut" as const,
        provenance: "held-out-scorer" as const,
        weight: 1.5,
        summary: "Held-out aggregate used to verify Progress Sharpe selection.",
        timestamp: "2026-07-04T00:08:00.000Z"
      }
    ];
    const report = buildNavigatorN2ProofReport({
      goal,
      paths: [cheapPath, expensivePath],
      observations,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const cheapScore = computeProgressSharpeScore(goal, cheapPath, observations);
    const expensiveScore = computeProgressSharpeScore(goal, expensivePath, observations);

    expect(report.frontierSelection.selectionMetric).toBe("progressSharpe");
    expect(report.frontierSelection.selectedPathId).toBe(cheapPath.pathId);
    expect(expensiveScore.rawPathFitScore).toBeGreaterThan(cheapScore.rawPathFitScore);
    expect(cheapScore.progressSharpe).toBeGreaterThan(expensiveScore.progressSharpe);
    expect(report.frontierSelection.progressSharpeScores[0].pathId).toBe(cheapPath.pathId);
  });

  it("builds a safe provider council-seat proof without requiring live calls in fixture mode", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const n2 = buildNavigatorN2ProofReport({
      goal,
      paths,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const match = n2.councilTournament.judgments[0];
    const report = buildNavigatorProviderCouncilProofReport({
      goal,
      requireLive: false,
      deterministicWinnerPathId: match.winnerPathId,
      judgment: {
        schemaVersion: 1,
        mode: "provider-gated",
        provider: "azure-openai-responses",
        profile: "fixture",
        status: "skipped",
        callsEnabled: false,
        configured: true,
        seat: "Synthesizer",
        leftPathId: match.leftPathId,
        rightPathId: match.rightPathId,
        inputHash: "a".repeat(64),
        rubricHash: "b".repeat(64),
        evidenceHash: "c".repeat(64),
        winnerPathId: match.winnerPathId,
        confidence: 0,
        rationale: "Provider calls were skipped by fixture policy; deterministic council remains the only winner source.",
        risks: ["Live model diversity is not proven by fixture mode."],
        falsifier: "If a required live provider seat is requested, this skipped judgment must fail the proof.",
        safety: {
          rawPromptIncluded: false,
          rawProviderResponseIncluded: false,
          envValuesIncluded: false
        }
      },
      generatedAt: "2026-07-04T00:15:00.000Z"
    });
    const liveRequired = buildNavigatorProviderCouncilProofReport({
      goal,
      requireLive: true,
      deterministicWinnerPathId: match.winnerPathId,
      judgment: report.judgment,
      generatedAt: "2026-07-04T00:15:00.000Z"
    });
    const markdown = renderNavigatorProviderCouncilProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.observation.sourceLayer).toBe("council");
    expect(report.observation.weight).toBeLessThan(1);
    expect(report.acceptanceGates.find((gate) => gate.name === "live-provider-required-if-requested")?.status).toBe("pass");
    expect(liveRequired.passed).toBe(false);
    expect(liveRequired.acceptanceGates.find((gate) => gate.name === "live-provider-required-if-requested")?.status).toBe("fail");
    expect(markdown).toContain("Navigator Provider Council Proof");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
    expect(JSON.stringify(report)).not.toContain("requestBody");
    expect(JSON.stringify(report)).not.toContain("responseBody");
  });

  it("builds a safe four-seat provider council session proof with explicit live gating", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const n2 = buildNavigatorN2ProofReport({
      goal,
      paths,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const contested = n2.councilTournament.disagreement.topContestedMatches[0];
    if (!contested) throw new Error("Expected deterministic council tournament to include a contested match.");
    const match = n2.councilTournament.judgments.find((judgment) => judgment.matchId === contested.matchId) ?? n2.councilTournament.judgments[0];
    const councilObservations = [
      ...n2.n1.observations,
      {
        observationId: "obs-web-council-test",
        milestoneId: "m1-validator-sample",
        metric: "validatorRows",
        actual: 172,
        sourceLayer: "reality" as const,
        provenance: "web-sourced-evidence" as const,
        weight: 1.5,
        summary: "Hash-only web-sourced evidence for live council test.",
        timestamp: "2026-07-04T00:11:00.000Z"
      }
    ];
    const decisionContext = {
      matchId: match.matchId,
      source: "top-contested-match" as const,
      deterministicCriterion: match.criterion,
      deterministicDisagreementRate: match.disagreementRate,
      deterministicSplit: match.disagreementRate > 0,
      observationCount: councilObservations.length,
      observationMix: computeObservationWeightMix(councilObservations)
    };
    const seats = ["Proposer", "Adversary", "Estimator", "Synthesizer"] as const;
    const hashChars = ["a", "b", "c", "d", "e", "f", "1", "2", "3", "4", "5", "6"];
    const judgments = seats.map((seat, index) => ({
      schemaVersion: 1 as const,
      mode: "provider-gated" as const,
      provider: "azure-openai-responses" as const,
      profile: "fixture",
      status: "skipped" as const,
      providerIdentity: {
        provider: "azure-openai-responses" as const,
        urlKeyHash: hashChars[index].repeat(64),
        apiKeyKeyHash: hashChars[index + 4].repeat(64),
        deploymentKeyHash: hashChars[index + 8].repeat(64),
        timeoutMs: 20000,
        seatDeploymentOverride: true,
        identityHash: hashChars[index].repeat(64)
      },
      callsEnabled: false,
      configured: true,
      seat,
      leftPathId: match.leftPathId,
      rightPathId: match.rightPathId,
      inputHash: hashChars[index].repeat(64),
      rubricHash: hashChars[index + 4].repeat(64),
      evidenceHash: hashChars[index + 8].repeat(64),
      confidence: 0,
      rationale: `${seat} provider calls were skipped by fixture policy.`,
      risks: ["Live model diversity is not proven by fixture mode."],
      falsifier: `If ${seat} is required live, this skipped judgment must fail the session proof.`,
      safety: {
        rawPromptIncluded: false as const,
        rawProviderResponseIncluded: false as const,
        envValuesIncluded: false as const
      }
    }));
    const session = buildProviderCouncilSessionEvidence({
      leftPathId: match.leftPathId,
      rightPathId: match.rightPathId,
      deterministicWinnerPathId: match.winnerPathId,
      decisionContext,
      judgments
    });
    const report = buildNavigatorProviderCouncilSessionProofReport({
      goal,
      requireLive: false,
      deterministicWinnerPathId: match.winnerPathId,
      session,
      generatedAt: "2026-07-04T00:15:00.000Z"
    });
    const liveRequired = buildNavigatorProviderCouncilSessionProofReport({
      goal,
      requireLive: true,
      deterministicWinnerPathId: match.winnerPathId,
      session,
      generatedAt: "2026-07-04T00:15:00.000Z"
    });
    const markdown = renderNavigatorProviderCouncilSessionProofMarkdown(report);

    expect(session.judgments).toHaveLength(4);
    expect(session.gatedSeatCount).toBe(4);
    expect(session.liveSeatCount).toBe(0);
    expect(session.distinctProviderIdentityCount).toBe(4);
    expect(session.allSeatsUseDistinctProviderIdentities).toBe(true);
    expect(session.decisionContext.source).toBe("top-contested-match");
    expect(session.decisionContext.deterministicDisagreementRate).toBeGreaterThan(0);
    expect(session.decisionContext.observationMix.webSourcedEvidenceWeight).toBeGreaterThan(0);
    expect(session.reportedWinnerPathId).toBe(match.winnerPathId);
    expect(report.passed).toBe(true);
    expect(report.observation.sourceLayer).toBe("council");
    expect(report.acceptanceGates.find((gate) => gate.name === "four-provider-seats-recorded")?.status).toBe("pass");
    expect(report.acceptanceGates.find((gate) => gate.name === "provider-council-session-contested-decision")?.status).toBe("pass");
    expect(report.acceptanceGates.find((gate) => gate.name === "provider-identity-diversity-measured")?.status).toBe("pass");
    expect(liveRequired.passed).toBe(false);
    expect(liveRequired.acceptanceGates.find((gate) => gate.name === "live-provider-required-if-requested")?.status).toBe("fail");
    expect(markdown).toContain("Navigator Provider Council Session Proof");
    expect(markdown).toContain("Decision source: top-contested-match");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
    expect(JSON.stringify(report)).not.toContain("requestBody");
    expect(JSON.stringify(report)).not.toContain("responseBody");

    const liveJudgments = judgments.map((judgment, index) => ({
      ...judgment,
      mode: "provider-live" as const,
      profile: "staging-sandbox",
      status: "ok" as const,
      callsEnabled: true,
      responseId: `resp_council_${index}`,
      bodyHash: hashChars[index + 1].repeat(64),
      outputHash: hashChars[index + 2].repeat(64),
      outputTextLength: 240 + index,
      totalTokens: 120 + index,
      durationMs: 900 + index,
      winnerPathId: index === 0 ? match.rightPathId : match.leftPathId,
      confidence: 0.72 + index * 0.03,
      rationale: `${judgment.seat} live provider seat judged the contested pair.`,
      risks: ["Provider preferences remain subordinate to held-out and trust gates."],
      falsifier: `If ${judgment.seat} disagrees with held-out scoring, downgrade the provider seat vote.`
    }));
    const liveSession = buildProviderCouncilSessionEvidence({
      leftPathId: match.leftPathId,
      rightPathId: match.rightPathId,
      deterministicWinnerPathId: match.winnerPathId,
      decisionContext,
      judgments: liveJudgments
    });
    const liveReport = buildNavigatorProviderCouncilSessionProofReport({
      goal,
      requireLive: true,
      deterministicWinnerPathId: match.winnerPathId,
      session: liveSession,
      generatedAt: "2026-07-04T00:20:00.000Z"
    });

    expect(liveSession.mode).toBe("provider-live");
    expect(liveSession.liveSeatCount).toBe(4);
    expect(liveSession.disagreementRate).toBeGreaterThan(0);
    expect(liveReport.passed).toBe(true);
    expect(liveReport.observation.provenance).toBe("provider-judge");
    expect(liveReport.acceptanceGates.find((gate) => gate.name === "live-provider-required-if-requested")?.status).toBe("pass");
    expect(liveReport.acceptanceGates.find((gate) => gate.name === "live-council-real-observation-context")?.status).toBe("pass");
    expect(liveReport.acceptanceGates.find((gate) => gate.name === "provider-council-session-disagreement-measured")?.status).toBe("pass");
    expect(JSON.stringify(liveReport)).not.toContain("requestBody");
    expect(JSON.stringify(liveReport)).not.toContain("responseBody");
  });

  it("runs a checkpointed loop proof that beats a static baseline and resumes exactly", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const observations = buildFixtureNavigatorLoopObservations("2026-07-04T00:05:00.000Z");
    const report = buildNavigatorLoopProofReport({
      goal,
      paths,
      observations,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorLoopProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.checkpoints).toHaveLength(observations.length);
    expect(report.milestoneRuns).toHaveLength(observations.length);
    expect(report.checkpoints.every((checkpoint) => checkpoint.cycleHypothesis.hypothesis && checkpoint.cycleHypothesis.falsifier)).toBe(true);
    expect(report.checkpoints.every((checkpoint) => checkpoint.forcedEntropy.action === "continue-leading-path")).toBe(true);
    expect(report.forcedEntropy.forcedActionCount).toBe(0);
    expect(report.resumeProof.matchesUninterrupted).toBe(true);
    expect(report.baselineComparison.selectionMetric).toBe("progressSharpe");
    expect(report.baselineComparison.navigatorProgressSharpe).toBeGreaterThanOrEqual(report.baselineComparison.baselineProgressSharpe);
    expect(report.acceptanceGates.find((gate) => gate.name === "progress-sharpe-selection-applied")?.status).toBe("pass");
    expect(report.acceptanceGates.some((gate) => gate.name === "navigator-beats-static-baseline")).toBe(false);
    expect(report.baselineComparison.lift).toBeGreaterThanOrEqual(0);
    expect(report.baselineComparison.comparableCost).toBe(true);
    expect(report.observations.some((item) => item.sourceLayer === "humanFeedback")).toBe(true);
    expect(report.shapeLibraryEntry.shapeKey).toContain("research-then-build");
    expect(markdown).toContain("Navigator Loop Proof");
    expect(markdown).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report.checkpoints)).not.toContain("https://");
  });

  it("forces entropy when training rises while held-out is flat or primary progress stalls", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const observations = [
      ...buildFixtureNavigatorLoopObservations("2026-07-04T00:05:00.000Z"),
      {
        observationId: "obs-heldout-flat-before",
        milestoneId: "m2-heldout-pass-rate",
        metric: "heldOutPassRate",
        actual: 0.74,
        sourceLayer: "heldOut" as const,
        provenance: "fixture" as const,
        weight: 1,
        summary: "Held-out transfer is flat before the next training increase.",
        timestamp: "2026-07-04T00:06:00.000Z",
        evalSignals: {
          trainingScore: 0.5,
          heldOutScore: 0.74,
          source: "manual-fixture" as const
        }
      },
      {
        observationId: "obs-training-up-heldout-flat",
        milestoneId: "m2-heldout-pass-rate",
        metric: "heldOutPassRate",
        actual: 0.74,
        sourceLayer: "heldOut" as const,
        provenance: "fixture" as const,
        weight: 1,
        summary: "Training score increased while held-out transfer stayed flat.",
        timestamp: "2026-07-04T00:07:00.000Z",
        evalSignals: {
          trainingScore: 0.62,
          heldOutScore: 0.74,
          primaryMetricDelta: 0,
          source: "manual-fixture" as const
        }
      }
    ];
    const report = buildNavigatorLoopProofReport({
      goal,
      paths,
      observations,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorLoopProofMarkdown(report);
    const memorization = report.forcedEntropy.actions.find((action) => action.trigger === "memorization_alarm");
    const stall = report.forcedEntropy.actions.find((action) => action.trigger === "stall_exploration");
    const schema = JSON.parse(readFileSync("schemas/navigator/loop-proof.schema.json", "utf8")) as { required: string[]; properties: Record<string, unknown> };

    expect(report.forcedEntropy.memorizationDetected).toBe(true);
    expect(report.forcedEntropy.stallDetected).toBe(true);
    expect(report.forcedEntropy.forcedActionCount).toBeGreaterThanOrEqual(2);
    expect(memorization?.action).toBe("remove-eval-shaped-artifact");
    expect(memorization?.blockedMoves).toContain("claim-training-lift-as-value");
    expect(memorization?.nextMove).toMatch(/Remove or cap eval-shaped artifacts/i);
    expect(stall?.action).toBe("stall-to-search");
    expect(stall?.selectedPathIdAfter).not.toBe(stall?.selectedPathIdBefore);
    expect(report.checkpoints.every((checkpoint) => checkpoint.cycleHypothesis.diagnosticInstrument)).toBe(true);
    expect(report.acceptanceGates.find((gate) => gate.name === "forced-entropy-enforced")?.status).toBe("pass");
    expect(markdown).toContain("Forced Entropy");
    expect(markdown).toContain("Cycle Hypotheses");
    expect(schema.required).toContain("forcedEntropy");
    expect(schema.properties.forcedEntropy).toBeTruthy();
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
  });

  it("converts dispatched mission evidence into loop observations and records reality mix", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const missionObservations = buildMissionEvidenceObservations({
      runId: "workspaceops-launch-pack-20260704-realrun",
      missionId: "workspaceops-launch-pack",
      missionTitle: "WorkspaceOps Launch Pack",
      profile: "fixture",
      durationMs: 1200,
      toolsUsed: ["donor.registry.summarize", "playbasis.api.catalog", "artifact.launch.pack"],
      steps: [{ status: "ok" }, { status: "ok" }, { status: "ok" }],
      artifacts: Array.from({ length: 20 }, () => ({ bytes: 5000 })),
      evals: [
        { name: "artifact-completeness", suite: "training", score: 0.9, status: "pass" },
        { name: "heldout-artifact-substance", suite: "heldOut", score: 0.82, status: "warn" },
        { name: "heldout-workflow-coverage", suite: "heldOut", score: 0.86, status: "pass" },
        { name: "secret-redaction", suite: "trust", score: 1, status: "pass" },
        { name: "trace-coverage", suite: "trust", score: 0.92, status: "pass" }
      ],
      redactionReport: {
        checkedArtifacts: 20,
        leaksDetected: 0
      }
    }, "2026-07-04T00:15:00.000Z");
    const observations = [...buildFixtureNavigatorLoopObservations("2026-07-04T00:05:00.000Z"), ...missionObservations];
    const mix = computeObservationWeightMix(observations);
    const report = buildNavigatorLoopProofReport({
      goal,
      paths,
      observations,
      requireDispatchedRunEvidence: true,
      generatedAt: "2026-07-04T00:20:00.000Z"
    });

    expect(missionObservations).toHaveLength(4);
    expect(missionObservations.every((observation) => observation.provenance === "dispatched-run")).toBe(true);
    expect(mix.dispatchedRunWeightFraction).toBeGreaterThan(0.4);
    expect(report.passed).toBe(true);
    expect(report.observationMix.dispatchedRunWeight).toBeGreaterThan(0);
    expect(report.acceptanceGates.find((gate) => gate.name === "dispatched-run-observations-consumed")?.status).toBe("pass");
    expect(report.ambitionRatchet.action).toBe("promote");
    expect(report.ambitionRatchet.candidatePathId).toContain("moonshot");
    expect(report.ambitionRatchet.consecutiveOverMax).toBeGreaterThanOrEqual(report.ambitionRatchet.requiredConsecutiveOverMax);
    expect(report.acceptanceGates.find((gate) => gate.name === "ambition-ratchet-policy-applied")?.status).toBe("pass");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
  });

  it("converts safe research evidence into explicit web-sourced observations", () => {
    const liveResearch = {
      profile: "staging-sandbox",
      toolKind: "web_search" as const,
      mode: "live-recorded-cassette" as const,
      status: "ok" as const,
      queryHash: "a".repeat(64),
      evidenceItemCount: 3,
      searchedQueryCount: 1,
      observationHints: {
        evidenceRows: 130,
        confidenceScore: 0.72,
        webSourced: true
      },
      redaction: {
        leaksDetected: 0
      },
      safety: {
        rawQueryIncluded: false as const,
        rawUrlsIncluded: false as const,
        rawPagesIncluded: false as const,
        requestHeadersIncluded: false as const,
        responseBodiesIncluded: false as const
      }
    };
    const fixtureResearch = {
      ...liveResearch,
      profile: "fixture",
      mode: "fixture-cassette" as const,
      observationHints: {
        evidenceRows: 110,
        confidenceScore: 0.58,
        webSourced: false
      }
    };
    const liveObservations = buildResearchEvidenceObservations(liveResearch, "2026-07-04T00:30:00.000Z");
    const fixtureObservations = buildResearchEvidenceObservations(fixtureResearch, "2026-07-04T00:30:00.000Z");
    const liveMix = computeObservationWeightMix(liveObservations);
    const fixtureMix = computeObservationWeightMix(fixtureObservations);

    expect(liveObservations).toHaveLength(2);
    expect(liveObservations.every((observation) => observation.provenance === "web-sourced-evidence")).toBe(true);
    expect(liveMix.webSourcedEvidenceWeightFraction).toBe(1);
    expect(liveMix.fixtureWeightFraction).toBe(0);
    expect(fixtureObservations).toHaveLength(2);
    expect(fixtureObservations.every((observation) => observation.provenance === "fixture")).toBe(true);
    expect(fixtureMix.webSourcedEvidenceWeightFraction).toBe(0);
    expect(fixtureMix.fixtureWeightFraction).toBe(1);
  });

  it("builds a daily-loop proof with leases, wakeups, mission evidence, and shape-memory progression", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const days = [1, 2, 3].map((dayIndex) => ({
      dayIndex,
      simulatedDate: `2026-07-0${dayIndex}T00:00:00.000Z`,
      lease: {
        leaseId: `lease-${dayIndex}`,
        owner: "navigator-daily-loop" as const,
        acquired: true,
        expiresAt: `2026-07-0${dayIndex}T01:00:00.000Z`
      },
      missionRunId: `run-${dayIndex}`,
      missionId: "workspaceops-launch-pack",
      evidenceHash: String(dayIndex).repeat(64),
      observationCount: 8,
      dispatchedRunWeightFraction: 0.49,
      loopProofId: `loop-${dayIndex}`,
      selectedPathId: `path-${dayIndex}`,
      baselinePathId: "baseline",
      navigatorScore: 0.4 + dayIndex / 100,
      baselineScore: 0.3,
      lift: 0.1 + dayIndex / 100,
      ratchetAction: dayIndex === 3 ? "promote" as const : "hold" as const,
      ratchetCandidatePathId: dayIndex === 3 ? "moonshot" : undefined,
      checkpointCount: 8,
      shapeMemoryEntryId: `shape-${dayIndex}`,
      nextWakeupAt: `2026-07-0${dayIndex + 1}T00:00:00.000Z`,
      status: "completed" as const
    }));
    const report = buildNavigatorDailyLoopProofReport({
      goal,
      days,
      daysRequested: 3,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorDailyLoopProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.aggregate.missionRuns).toBe(3);
    expect(report.aggregate.uniqueMissionRuns).toBe(3);
    expect(report.aggregate.promotedRatchets).toBe(1);
    expect(report.aggregate.shapeMemoryEntriesProduced).toBe(3);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(markdown).toContain("Navigator Daily Loop Proof");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
  });

  it("builds safe Flappy validator evidence and drives the Navigator loop from it", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const sourceText = [
      "import pygame",
      "GRAVITY = 0.0",
      "PIPE_SPEED = 0",
      "JUMP_VELOCITY = -360.0",
      "PIPE_GAP = 160",
      "FPS = 60",
      "for event in pygame.event.get():",
      "    if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE: pass",
      "print('Final Score: 0')"
    ].join("\n");
    const smoke = {
      probeName: "flappy-flyer-smoke",
      commandLabel: "pnpm test",
      cwdLabel: "playbasis-platform/games/flappy-flyer",
      status: 1,
      ok: false,
      durationMs: 25,
      stdoutHash: "0".repeat(64),
      stderrHash: "1".repeat(64),
      detectedFailure: "missing-ts-node"
    };
    const validator = buildFlappyValidatorRealityReport({
      sourceText,
      baselinePath: paths[0],
      navigatorPath: paths[10],
      smoke,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const proof = buildNavigatorValidatorProofReport({
      goal,
      paths,
      sourceText,
      smoke,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorValidatorProofMarkdown(proof);

    expect(validator.source.ruleChecks.some((rule) => rule.ruleId === "gravity-active" && !rule.passedInSeed)).toBe(true);
    expect(validator.source.ruleChecks.some((rule) => rule.ruleId === "pipe-motion" && !rule.passedInSeed)).toBe(true);
    expect(validator.validatorLift).toBeGreaterThanOrEqual(0.2);
    expect(validator.safety.rawSourceIncluded).toBe(false);
    expect(proof.passed).toBe(true);
    expect(proof.loop.passed).toBe(true);
    expect(proof.validator.observations.every((item) => item.observationId.startsWith("obs-flappy-"))).toBe(true);
    expect(markdown).toContain("Navigator Validator Proof");
    expect(JSON.stringify(proof)).not.toContain(sourceText);
    expect(JSON.stringify(proof)).not.toContain("OPENAI_API_KEY");
  });

  it("builds safe repaired Pygame execution evidence without embedding raw seed source", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const sourceText = [
      "import pygame",
      "WIDTH, HEIGHT = 420, 640",
      "GRAVITY = 0.0",
      "PIPE_SPEED = 0",
      "JUMP_VELOCITY = -360.0",
      "PIPE_GAP = 160",
      "FPS = 60",
      "for event in pygame.event.get():",
      "    if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE: pass",
      "print('Final Score: 0')"
    ].join("\n");
    const repairedScript = renderFlappyPygameRepairScript({
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      frames: 300
    });
    const execution = {
      probeName: "flappy-pygame-repaired-seed",
      commandLabel: "python3.11 repaired flappy pygame",
      cwdLabel: "playbasis-agent-os-pov",
      status: 0,
      ok: true,
      durationMs: 120,
      stdoutHash: "2".repeat(64),
      stderrHash: "3".repeat(64),
      detectedFailure: null
    };
    const summary = coerceFlappyPygameRuntimeSummary({
      schemaVersion: 1,
      sourceHash: "4".repeat(64),
      frames: 300,
      score: 1,
      pipesAdvanced: 650,
      gravitySamples: 300,
      collisionChecks: 600,
      boundsChecks: 300,
      collisions: 0,
      finalBirdY: 312.4,
      events: ["repair:gravity-active", "score:increment"],
      ok: true
    });
    const repair = buildFlappyPygameRepairReport({
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      repairedArtifactLabel: "reports/navigator/test/flappy-pygame-repaired-seed.py",
      repairedScriptText: repairedScript,
      execution,
      runtimeSummary: summary,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const proof = buildNavigatorValidatorProofReport({
      goal,
      paths,
      sourceText,
      smoke: execution,
      pygameRepair: repair,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorValidatorProofMarkdown(proof);

    expect(repairedScript).toContain("GRAVITY = 900");
    expect(repairedScript).toContain("PIPE_SPEED = 130");
    expect(repairedScript).not.toContain(sourceText);
    expect(repairedScript).not.toContain("PIPE_SPEED = 0");
    expect(repair.passed).toBe(true);
    expect(repair.manifest.sourceConstants.WIDTH).toBe(420);
    expect(repair.manifest.sourceConstants.HEIGHT).toBe(640);
    expect(repair.manifest.fixedRuleIds).toContain("gravity-active");
    expect(repair.manifest.fixedRuleIds).toContain("pipe-motion");
    expect(repair.manifest.unresolvedRuleIds).toEqual([]);
    expect(proof.passed).toBe(true);
    expect(proof.acceptanceGates.some((gate) => gate.name === "pygame-repaired-seed-executed" && gate.status === "pass")).toBe(true);
    expect(markdown).toContain("Repaired Pygame Execution");
    expect(JSON.stringify(proof)).not.toContain(sourceText);
    expect(JSON.stringify(proof)).not.toContain("OPENAI_API_KEY");
  });

  it("builds a real Prompt Twin A/B proof from separate control and twin runtime arms", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const sourceText = [
      "import pygame",
      "WIDTH, HEIGHT = 420, 640",
      "GRAVITY = 0.0",
      "PIPE_SPEED = 0",
      "JUMP_VELOCITY = -360.0",
      "PIPE_GAP = 160",
      "FPS = 60",
      "for event in pygame.event.get():",
      "    if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE: pass",
      "print('Final Score: 0')"
    ].join("\n");
    const sourceHash = createHash("sha256").update(sourceText).digest("hex");
    const controlScript = renderFlappyPygameControlScript({
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      frames: 300
    });
    const twinScript = renderFlappyPygameRepairScript({
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      frames: 300
    });
    const evalFamily = buildFlappyEvalFactoryReport({
      familyId: "flappy-heldout-v1",
      totalCases: 500,
      trainCases: 320,
      generatedAt: "2026-07-04T00:08:00.000Z"
    });
    const preRegistration = buildFlappyPromptTwinAbHeldOutPreRegistration({
      goal,
      commitment: evalFamily.heldOutCommitment,
      expectedHeldOutLift: 0.1,
      controlArtifactLabel: "reports/navigator/test/flappy-control-manager-arm.py",
      controlArtifactHash: createHash("sha256").update(controlScript).digest("hex"),
      twinArtifactLabel: "reports/navigator/test/flappy-prompt-twin-arm.py",
      twinArtifactHash: createHash("sha256").update(twinScript).digest("hex"),
      registeredAt: "2026-07-04T00:09:00.000Z"
    });
    const heldOutResult = scoreFlappyPromptTwinAbHeldOut({
      preRegistration,
      commitment: evalFamily.heldOutCommitment,
      controlArtifactText: controlScript,
      twinArtifactText: twinScript,
      scoredAt: "2026-07-04T00:09:30.000Z"
    });
    const controlRuntime = coerceFlappyPygameRuntimeSummary({
      schemaVersion: 1,
      sourceHash,
      frames: 300,
      score: 0,
      pipesAdvanced: 0,
      gravitySamples: 300,
      collisionChecks: 600,
      boundsChecks: 300,
      collisions: 0,
      finalBirdY: 320,
      events: ["control:no-gravity", "control:no-pipe-motion"],
      ok: false
    });
    const twinRuntime = coerceFlappyPygameRuntimeSummary({
      schemaVersion: 1,
      sourceHash,
      frames: 300,
      score: 1,
      pipesAdvanced: 650,
      gravitySamples: 300,
      collisionChecks: 600,
      boundsChecks: 300,
      collisions: 0,
      finalBirdY: 312.4,
      events: ["repair:gravity-active", "score:increment"],
      ok: true
    });
    const report = buildFlappyPromptTwinAbProofReport({
      goal,
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      controlArtifactLabel: "reports/navigator/test/flappy-control-manager-arm.py",
      controlScriptText: controlScript,
      controlExecution: {
        probeName: "flappy-control-manager-arm",
        commandLabel: "python control flappy pygame",
        cwdLabel: "playbasis-agent-os-pov",
        status: 2,
        ok: false,
        durationMs: 100,
        stdoutHash: "c".repeat(64),
        stderrHash: "d".repeat(64),
        detectedFailure: "runtime-validation-failed"
      },
      controlRuntimeSummary: controlRuntime,
      twinArtifactLabel: "reports/navigator/test/flappy-prompt-twin-arm.py",
      twinScriptText: twinScript,
      twinExecution: {
        probeName: "flappy-prompt-twin-arm",
        commandLabel: "python prompt twin flappy pygame",
        cwdLabel: "playbasis-agent-os-pov",
        status: 0,
        ok: true,
        durationMs: 110,
        stdoutHash: "e".repeat(64),
        stderrHash: "f".repeat(64),
        detectedFailure: null
      },
      twinRuntimeSummary: twinRuntime,
      heldOutPreRegistration: preRegistration,
      heldOutResult,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const paths = generateNavigationPaths(goal, 20);
    const loop = buildNavigatorLoopProofReport({
      goal,
      paths,
      observations: report.observations,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const mix = computeObservationWeightMix(report.observations);
    const markdown = renderFlappyPromptTwinAbProofMarkdown(report);

    expect(controlScript).toContain("control:no-gravity");
    expect(twinScript).toContain("repair:gravity-active");
    expect(report.passed).toBe(true);
    expect(report.control.runtimeSummary?.ok).toBe(false);
    expect(report.twin.runtimeSummary?.ok).toBe(true);
    expect(report.runtimeLift).toBeGreaterThanOrEqual(0.5);
    expect(report.ruleRepairLift).toBeGreaterThanOrEqual(2);
    expect(heldOutResult.registeredAt).toBe(preRegistration.registeredAt);
    expect(Date.parse(heldOutResult.registeredAt)).toBeLessThanOrEqual(Date.parse(heldOutResult.scoredAt));
    expect(heldOutResult.preRegistrationHash).toBe(createHash("sha256").update(JSON.stringify(preRegistration)).digest("hex"));
    expect(heldOutResult.expectedHeldOutLift).toBe(0.1);
    expect(heldOutResult.control.passRate).toBeLessThan(heldOutResult.twin.passRate);
    expect(heldOutResult.heldOutLift).toBeGreaterThanOrEqual(0.1);
    expect(heldOutResult.metExpectedLift).toBe(true);
    expect(heldOutResult.control.artifactHash).toBe(preRegistration.arms.control.artifactHash);
    expect(heldOutResult.twin.artifactHash).toBe(preRegistration.arms.twin.artifactHash);
    expect(report.heldOutLift).toBe(heldOutResult.heldOutLift);
    expect(report.heldOutResult?.preRegistrationHash).toBe(heldOutResult.preRegistrationHash);
    expect(report.observations).toHaveLength(4);
    expect(report.observations.map((observation) => observation.provenance)).toEqual(["runtime-probe", "held-out-scorer", "runtime-probe", "runtime-probe"]);
    expect(report.observations.map((observation) => observation.sourceLayer)).toEqual(["reality", "heldOut", "promptTwin", "humanFeedback"]);
    expect(report.observations[1].actual).toBe(heldOutResult.twin.passRate);
    expect(mix.runtimeProbeWeight).toBeGreaterThan(0);
    expect(mix.heldOutScorerWeight).toBeGreaterThan(0);
    expect(mix.realityOrHeldOutLayerWeight).toBeGreaterThan(0);
    expect(loop.passed).toBe(true);
    expect(loop.observationMix.runtimeProbeWeight).toBeGreaterThan(0);
    expect(loop.observationMix.heldOutScorerWeight).toBeGreaterThan(0);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(markdown).toContain("Flappy Prompt Twin A/B Proof");
    expect(markdown).toContain("Pre-registered expected lift: 0.1000");
    expect(markdown).toContain("Observed held-out lift:");
    expect(markdown).toContain("Navigator Observations");
    expect(JSON.stringify(report)).not.toContain(sourceText);
    expect(JSON.stringify(report)).not.toContain("caseId");
    expect(JSON.stringify(report)).not.toContain("mutationRecipe");
    expect(JSON.stringify(report)).not.toContain("expectedRepairProperties");
    expect(JSON.stringify(report)).not.toContain("validatorExpectations");
    expect(JSON.stringify(report)).not.toContain(controlScript);
    expect(JSON.stringify(report)).not.toContain(twinScript);
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
  });

  it("generates a large Flappy eval family with held-out commitments only", () => {
    const report = buildFlappyEvalFactoryReport({
      familyId: "flappy-heldout-v1",
      totalCases: 500,
      trainCases: 320,
      generatedAt: "2026-07-04T00:20:00.000Z"
    });
    const privateHeldOut = buildFlappyPrivateHeldOutBundle({
      familyId: "flappy-heldout-v1",
      totalCases: 500,
      trainCases: 320,
      generatedAt: "2026-07-04T00:20:00.000Z"
    });
    const commitmentJson = JSON.stringify(report.heldOutCommitment);
    const trainingJson = JSON.stringify(report.trainingManifest);
    const repairedScript = renderFlappyPygameRepairScript({
      sourceText: [
        "import pygame",
        "WIDTH, HEIGHT = 420, 640",
        "GRAVITY = 0.0",
        "PIPE_SPEED = 0",
        "JUMP_VELOCITY = -360.0",
        "PIPE_GAP = 160",
        "FPS = 60"
      ].join("\n"),
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      frames: 300
    });
    const heldOutScore = scoreFlappyHeldOutArtifact({
      artifactText: repairedScript,
      commitment: report.heldOutCommitment,
      generatedAt: "2026-07-04T00:21:00.000Z"
    });

    expect(report.totalCases).toBe(500);
    expect(report.trainingCases).toBe(320);
    expect(report.heldOutCases).toBe(180);
    expect(report.trainingManifest.cases).toHaveLength(320);
    expect(report.trainingManifest.cases.every((testCase) => testCase.defectIds.length >= 2)).toBe(true);
    expect(new Set(report.trainingManifest.cases.flatMap((testCase) => testCase.defectIds)).size).toBe(8);
    expect(report.heldOutCommitment.casesCommitted).toBe(180);
    expect(report.heldOutCommitment.manifestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(report.heldOutCommitment.answerKeyCommitment.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(privateHeldOut.heldOutManifest).toHaveLength(180);
    expect(privateHeldOut.answerKey).toHaveLength(180);
    expect(privateHeldOut.manifestHash).toBe(report.heldOutCommitment.manifestHash);
    expect(privateHeldOut.answerKeyHash).toBe(report.heldOutCommitment.answerKeyCommitment.hash);
    expect(privateHeldOut.storagePolicy).toBe("outside-repo-private");
    expect(report.heldOutCommitment.rawCasesIncluded).toBe(false);
    expect(report.heldOutCommitment.answerKeyIncluded).toBe(false);
    expect(commitmentJson).not.toContain("caseId");
    expect(commitmentJson).not.toContain("mutationRecipe");
    expect(commitmentJson).not.toContain("expectedRepairProperties");
    expect(trainingJson).not.toContain("import pygame");
    expect(heldOutScore.casesScored).toBe(180);
    expect(heldOutScore.passRate).toBeGreaterThanOrEqual(0.8);
    expect(heldOutScore.rawCasesIncluded).toBe(false);
    expect(heldOutScore.answerKeyIncluded).toBe(false);
    expect(heldOutScore.artifactIncluded).toBe(false);
    expect(JSON.stringify(heldOutScore)).not.toContain(repairedScript);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
  });

  it("builds an asset-clone eval family with scorer-only pixel-diff proof", () => {
    const goal = compileNavigatorGoal(
      "Make asset-clone image_create runs descend held-out pixel diff",
      "2026-07-04T01:00:00.000Z",
      "asset-clone"
    );
    const family = buildAssetCloneEvalFactoryReport({
      familyId: "asset-clone-heldout-v1",
      totalCases: 240,
      trainCases: 144,
      generatedAt: "2026-07-04T01:01:00.000Z"
    });
    const privateHeldOut = buildAssetClonePrivateHeldOutBundle({
      familyId: "asset-clone-heldout-v1",
      totalCases: 240,
      trainCases: 144,
      generatedAt: "2026-07-04T01:01:00.000Z"
    });
    const baselineArtifact = {
      artifactLabel: "reports/navigator/test/asset-clone-baseline-arm.json",
      cases: privateHeldOut.answerKey.map((entry) => ({
        caseId: entry.caseId,
        pixels: entry.targetPixels.map((row) => row.map((value) => (value + 96) % 256))
      }))
    };
    const navigatorArtifact = {
      artifactLabel: "reports/navigator/test/asset-clone-navigator-arm.json",
      cases: privateHeldOut.answerKey.map((entry) => ({
        caseId: entry.caseId,
        pixels: entry.targetPixels
      }))
    };
    const baselineScore = scoreAssetClonePixelDiffArtifact({
      artifact: baselineArtifact,
      commitment: family.heldOutCommitment,
      generatedAt: "2026-07-04T01:02:00.000Z"
    });
    const navigatorScore = scoreAssetClonePixelDiffArtifact({
      artifact: navigatorArtifact,
      commitment: family.heldOutCommitment,
      generatedAt: "2026-07-04T01:02:00.000Z"
    });
    const preRegistration = buildAssetCloneHeldOutPreRegistration({
      goal,
      commitment: family.heldOutCommitment,
      expectedPixelSimilarityScore: 0.98,
      candidateArtifactLabel: "reports/navigator/test/asset-clone-navigator-arm.json",
      candidateArtifactHash: createHash("sha256").update(JSON.stringify(navigatorArtifact)).digest("hex"),
      registeredAt: "2026-07-04T01:02:30.000Z"
    });
    const heldOutResult = scoreAssetCloneHeldOut({
      preRegistration,
      commitment: family.heldOutCommitment,
      artifact: navigatorArtifact,
      scoredAt: "2026-07-04T01:03:00.000Z"
    });
    const proof = buildAssetCloneProofReport({
      goal,
      heldOutPreRegistration: preRegistration,
      heldOutResult,
      generatedAt: "2026-07-04T01:03:10.000Z"
    });
    const markdown = renderAssetCloneProofMarkdown(proof);
    const commitmentJson = JSON.stringify(family.heldOutCommitment);
    const proofJson = JSON.stringify(proof);

    expect(goal.domain).toBe("asset-clone");
    expect(goal.lossFunction.target.name).toBe("asset_clone_pixel_similarity");
    expect(goal.lossFunction.target.primaryMetric).toBe("pixelSimilarityScore");
    expect(goal.lossFunction.target.blindedEvalRef).toBe("scorer-only:asset-clone-heldout-v1");
    expect(family.totalCases).toBe(240);
    expect(family.trainingCases).toBe(144);
    expect(family.heldOutCases).toBe(96);
    expect(family.heldOutCommitment.casesCommitted).toBe(96);
    expect(family.heldOutCommitment.manifestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(family.heldOutCommitment.answerKeyCommitment.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(privateHeldOut.heldOutManifest).toHaveLength(96);
    expect(privateHeldOut.answerKey).toHaveLength(96);
    expect(privateHeldOut.manifestHash).toBe(family.heldOutCommitment.manifestHash);
    expect(privateHeldOut.answerKeyHash).toBe(family.heldOutCommitment.answerKeyCommitment.hash);
    expect(commitmentJson).not.toContain("targetPixels");
    expect(commitmentJson).not.toContain('"pixels"');
    expect(commitmentJson).not.toContain('"answerKey":');
    expect(baselineScore.pixelSimilarityScore).toBeLessThan(navigatorScore.pixelSimilarityScore);
    expect(navigatorScore.pixelDiffRatio).toBe(0);
    expect(navigatorScore.pixelSimilarityScore).toBe(1);
    expect(heldOutResult.preRegistrationHash).toBe(createHash("sha256").update(JSON.stringify(preRegistration)).digest("hex"));
    expect(Date.parse(heldOutResult.registeredAt)).toBeLessThanOrEqual(Date.parse(heldOutResult.scoredAt));
    expect(heldOutResult.metExpectedSimilarity).toBe(true);
    expect(proof.passed).toBe(true);
    expect(proof.observations).toHaveLength(2);
    expect(proof.observations.some((observation) => observation.metric === "pixelSimilarityScore")).toBe(true);
    expect(proof.observations.every((observation) => observation.sourceLayer === "heldOut")).toBe(true);
    expect(markdown).toContain("Asset Clone Proof");
    expect(markdown).toContain("Pixel similarity score: 1.0000");
    expect(proofJson).not.toContain("targetPixels");
    expect(proofJson).not.toContain('"pixels"');
    expect(proofJson).not.toContain('"answerKey":');
    expect(proofJson).not.toContain("promptText");
    expect(proofJson).not.toContain("data:image");
    expect(proofJson).not.toContain("https://");
  });

  it("builds a guarded direct source mutation proof without storing raw source", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const sourceText = [
      "import pygame",
      "WIDTH, HEIGHT = 420, 640",
      "GRAVITY = 0.0",
      "PIPE_SPEED = 0",
      "JUMP_VELOCITY = -360.0",
      "PIPE_GAP = 160",
      "FPS = 60",
      "for event in pygame.event.get():",
      "    if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE: pass",
      "print('Final Score: 0')"
    ].join("\n");
    const repairedScript = renderFlappyPygameRepairScript({
      sourceText,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      frames: 300
    });
    const sourceHash = createHash("sha256").update(sourceText).digest("hex");
    const execution = {
      probeName: "flappy-original-source-repaired",
      commandLabel: "python3.11 original flappy source",
      cwdLabel: "playbasis-platform/seeds/agent-harness",
      status: 0,
      ok: true,
      durationMs: 140,
      stdoutHash: "a".repeat(64),
      stderrHash: "b".repeat(64),
      detectedFailure: null
    };
    const summary = coerceFlappyPygameRuntimeSummary({
      schemaVersion: 1,
      sourceHash,
      frames: 300,
      score: 1,
      pipesAdvanced: 650,
      gravitySamples: 300,
      collisionChecks: 600,
      boundsChecks: 300,
      collisions: 0,
      finalBirdY: 312.4,
      events: ["repair:gravity-active", "score:increment"],
      ok: true
    });
    const report = buildFlappySourceMutationProofReport({
      goal,
      sourceLabel: "playbasis-platform/seeds/agent-harness/flappy_bird_broken.py",
      preSourceText: sourceText,
      repairedSourceText: repairedScript,
      mutationObservedText: repairedScript,
      finalSourceText: sourceText,
      applyMode: "applied",
      restoredAfterProof: true,
      execution,
      runtimeSummary: summary,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderFlappySourceMutationProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.preSourceHash).toBe(sourceHash);
    expect(report.mutationObservedHash).toBe(report.repairedSourceHash);
    expect(report.finalSourceHash).toBe(report.preSourceHash);
    expect(report.fixedRuleIds).toEqual(expect.arrayContaining(["gravity-active", "pipe-motion", "score-progresses", "collision-or-bounds"]));
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(markdown).toContain("Navigator Source Repair Proof");
    expect(JSON.stringify(report)).not.toContain(sourceText);
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
  });

  it("builds a safe monorepo primitive proof from BIE, conformal, and swarm summaries", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const source = (kind: "bie-frontier" | "bie-elo" | "conformal" | "swarm-harness", label: string, symbols: string[]) => ({
      kind,
      sourceLabel: label,
      sourceHash: kind.padEnd(64, "0").slice(0, 64),
      loc: 25,
      detectedSymbols: symbols
    });
    const sources = [
      source("bie-frontier", "playbasis-platform/packages/bie/src/portfolio/frontier.ts", ["computeEfficientFrontier"]),
      source("bie-elo", "playbasis-platform/packages/bie/src/tournament/elo.ts", ["runEloTournament"]),
      source("conformal", "client_test/pb-healthcare-demo/services/queue-analytics/forecasting/conformal.py", ["apply_conformal_intervals"]),
      source("swarm-harness", "playbasis-platform/scripts/agentic-text-harness/bie-swarm.ts", ["runSwarmPhase"]),
      source("swarm-harness", "playbasis-platform/scripts/agentic-text-harness/bie-swarm-worker.ts", ["process.send"]),
      source("swarm-harness", "playbasis-platform/scripts/run-bie-swarm.sh", ["PB_BIE_WORKERS"])
    ];
    const execution = {
      probeName: "queue-analytics-conformal-probe",
      commandLabel: "python conformal probe",
      cwdLabel: "playbasis-agent-os-pov",
      status: 0,
      ok: true,
      durationMs: 80,
      stdoutHash: "5".repeat(64),
      stderrHash: "6".repeat(64),
      detectedFailure: null
    };
    const report = buildNavigatorMonorepoPrimitiveProofReport({
      goal,
      paths,
      sources,
      bie: {
        directImport: true,
        moduleLabel: "playbasis-platform/packages/bie/dist/index.js",
        moduleHash: "7".repeat(64),
        ideasEvaluated: 12,
        frontierPoints: 12,
        allocations: 6,
        maxSharpeRatio: 1.25,
        minVarianceRisk: 0.14,
        selectedPathIds: [paths[0].pathId, paths[1].pathId],
        topEloPathId: paths[0].pathId,
        eloMatches: 96,
        outputHash: "8".repeat(64)
      },
      conformal: {
        directExecution: true,
        sourceLabel: sources[2].sourceLabel,
        sourceHash: sources[2].sourceHash,
        execution,
        forecastsCalibrated: 3,
        confidenceLevels: [0.8, 0.9, 0.95],
        coverage90: 0.9,
        firstForecast: {
          predicted: 15.2,
          ci80Lower: 14.6,
          ci80Upper: 15.9,
          ci90Lower: 14.4,
          ci90Upper: 16.1,
          ci95Lower: 14.1,
          ci95Upper: 16.4
        },
        outputHash: "9".repeat(64)
      },
      swarm: {
        coordinator: sources[3],
        worker: sources[4],
        launcher: sources[5],
        modes: ["draft", "judge", "research"],
        envKeys: ["PB_BIE_MAX_IDEAS", "PB_BIE_WORKERS"],
        hasChildProcessFork: true,
        hasIpcProtocol: true,
        executionPolicy: "provenance-only-requires-credentials"
      },
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorMonorepoPrimitiveProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.acceptanceGates.every((gate) => gate.status === "pass")).toBe(true);
    expect(report.bie.directImport).toBe(true);
    expect(report.conformal.directExecution).toBe(true);
    expect(report.swarm.executionPolicy).toBe("provenance-only-requires-credentials");
    expect(markdown).toContain("Navigator Monorepo Primitive Proof");
    expect(markdown).toContain("BIE Direct Import");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
    expect(JSON.stringify(report)).not.toContain("selectedFields");
  });

  it("builds Prompt Twin proof evidence without letting taste override failed reality", () => {
    const goal = compileNavigatorGoal(objective, "2026-07-04T00:00:00.000Z");
    const paths = generateNavigationPaths(goal, 20);
    const evidenceSummary = JSON.stringify({
      validator: { passed: true, validatorLift: 0.25 },
      primitives: { passed: true, bieFrontierPoints: 12 }
    });
    const judgment = buildFixturePromptTwinJudgmentEvidence({
      goal,
      candidatePathId: paths[0].pathId,
      evidenceSummary,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const report = buildNavigatorPromptTwinProofReport({
      goal,
      paths,
      candidatePathId: paths[0].pathId,
      validatorPassed: true,
      primitiveProofPassed: true,
      requireLive: false,
      judgment,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const failedRealityReport = buildNavigatorPromptTwinProofReport({
      goal,
      paths,
      candidatePathId: paths[0].pathId,
      validatorPassed: false,
      primitiveProofPassed: true,
      requireLive: false,
      judgment,
      generatedAt: "2026-07-04T00:10:00.000Z"
    });
    const markdown = renderNavigatorPromptTwinProofMarkdown(report);

    expect(report.passed).toBe(true);
    expect(report.observation.sourceLayer).toBe("promptTwin");
    expect(report.observation.actual).toBeGreaterThanOrEqual(0.8);
    expect(failedRealityReport.passed).toBe(false);
    expect(failedRealityReport.acceptanceGates.find((gate) => gate.name === "reality-gates-not-overridden")?.status).toBe("fail");
    expect(markdown).toContain("Navigator Prompt Twin Proof");
    expect(markdown).toContain("Reality evidence");
    expect(JSON.stringify(report)).not.toContain("OPENAI_API_KEY");
    expect(JSON.stringify(report)).not.toContain("https://");
    expect(JSON.stringify(report)).not.toContain("selectedFields");
  });
});
