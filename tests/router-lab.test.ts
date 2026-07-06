import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  appendRouterTelemetryRecord,
  assertRouterTelemetryCompleteness,
  buildFixtureModelCatalog,
  buildRouterTelemetryRecord,
  estimateProviderCostUsd,
  normalizeProviderUsage,
  parseModelCatalogFromInventoryMarkdown,
  readRouterTelemetryJsonl,
  selectRouterModelForStage,
  syncModelCatalogFromFile,
  summarizeRouterTelemetry,
  validateModelConfig,
  validateModelCatalog,
  writeModelCatalog,
  type RouterModelConfig
} from "@playbasis-agent-os/router-lab";

describe("router-lab catalog and telemetry primitives", () => {
  it("syncs a safe model catalog from inventory markdown without pricing or env values", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "pbos-router-catalog-"));
    const inventoryPath = path.join(dir, "AZURE_RESOURCE_INVENTORY.md");
    await writeFile(inventoryPath, inventoryMarkdown(), "utf8");

    const catalog = await syncModelCatalogFromFile({
      inventoryPath,
      generatedAt: "2026-07-05T00:00:00.000Z"
    });
    const gpt55 = catalog.models.find((entry) => entry.deployment === "gpt-5.5");
    const outputPath = path.join(dir, "reports/model-catalog.json");
    await writeModelCatalog(outputPath, catalog);
    const serialized = await readFile(outputPath, "utf8");

    expect(catalog.models.some((entry) => entry.id === "fixture/echo")).toBe(true);
    expect(gpt55).toMatchObject({
      provider: "azure-openai",
      family: "gpt-5.5",
      capacity: 15000,
      inventorySource: "AZURE_RESOURCE_INVENTORY.md"
    });
    expect(gpt55?.capabilities).toEqual(expect.arrayContaining(["chat", "responses", "structured-output"]));
    expect(gpt55?.candidateDeploymentEnvKeys).toContain("PB_AZURE_OPENAI_GPT55_DEPLOYMENT");
    expect(catalog.safety).toEqual({
      pricingOverlayIncluded: false,
      envValuesIncluded: false,
      rawApiKeysIncluded: false
    });
    expect(serialized).not.toContain("secret");
    expect(serialized).not.toContain("api-key");
  });

  it("normalizes provider usage shapes and estimates cost from an explicit overlay only", () => {
    const openAiUsage = normalizeProviderUsage({
      input_tokens: 1200,
      output_tokens: 500,
      total_tokens: 1700,
      input_tokens_details: { cached_tokens: 200 },
      output_tokens_details: { reasoning_tokens: 80 }
    });
    const geminiUsage = normalizeProviderUsage({
      promptTokenCount: 10,
      candidatesTokenCount: 20,
      totalTokenCount: 30
    });

    expect(openAiUsage).toEqual({
      inputTokens: 1200,
      outputTokens: 500,
      totalTokens: 1700,
      cachedInputTokens: 200,
      reasoningTokens: 80
    });
    expect(geminiUsage.totalTokens).toBe(30);
    expect(estimateProviderCostUsd(openAiUsage)).toBe(0);
    expect(estimateProviderCostUsd(openAiUsage, {
      inputPerMtokUsd: 1,
      cachedInputPerMtokUsd: 0.25,
      outputPerMtokUsd: 5
    })).toBe(0.00355);
  });

  it("selects models per stage and records hash-only telemetry", async () => {
    const catalog = parseModelCatalogFromInventoryMarkdown(inventoryMarkdown(), {
      sourcePath: "../playbasis-platform/AZURE_RESOURCE_INVENTORY.md",
      generatedAt: "2026-07-05T00:00:00.000Z"
    });
    validateModelCatalog(catalog);
    const gpt55 = catalog.models.find((entry) => entry.deployment === "gpt-5.5");
    expect(gpt55).toBeTruthy();
    const config: RouterModelConfig = {
      schemaVersion: 1,
      configId: "tiered-test",
      defaultModelId: "fixture/echo",
      stageModels: {
        S3: gpt55?.id ?? "missing"
      }
    };
    const selected = selectRouterModelForStage({ stage: "S3", config, catalog });
    const record = buildRouterTelemetryRecord({
      context: {
        runId: "run-1",
        mission: "mission-1",
        seed: 7,
        stage: "S3",
        step: 4,
        attempt: 2,
        traceId: "trace-1",
        configId: config.configId
      },
      callKind: "azure.responses",
      provider: "azure-openai",
      modelEntry: selected.model,
      deploymentKey: "PB_AZURE_OPENAI_GPT55_DEPLOYMENT",
      deployment: "private-deployment-name",
      responseId: "resp_private",
      usage: {
        input_tokens: 42,
        output_tokens: 18,
        total_tokens: 60
      },
      latencyMs: 123.4,
      outcome: "accepted",
      qualitySignals: {
        gatePassed: true
      },
      recordedAt: "2026-07-05T00:00:01.000Z"
    });
    const dir = await mkdtemp(path.join(os.tmpdir(), "pbos-router-telemetry-"));
    const telemetryPath = path.join(dir, "router-telemetry.jsonl");
    await mkdir(path.dirname(telemetryPath), { recursive: true });
    await appendRouterTelemetryRecord(telemetryPath, record);
    const telemetry = await readFile(telemetryPath, "utf8");

    expect(selected.status).toBe("selected");
    expect(record.stage).toBe("S3");
    expect(record.model).toBe(selected.model?.id);
    expect(record.tokensIn).toBe(42);
    expect(record.tokensOut).toBe(18);
    expect(record.deploymentHash).toHaveLength(64);
    expect(record.responseIdHash).toHaveLength(64);
    expect(record.hash).toHaveLength(64);
    expect(telemetry).not.toContain("private-deployment-name");
    expect(telemetry).not.toContain("resp_private");
  });

  it("validates router configs and rejects unknown stages or models", () => {
    const catalog = buildFixtureModelCatalog("2026-07-05T00:00:00.000Z");
    const valid: RouterModelConfig = {
      schemaVersion: 1,
      configId: "fixture-echo",
      defaultModelId: "fixture/echo",
      stageModels: {
        S1: "fixture/echo",
        S9: "fixture/echo"
      }
    };
    validateModelConfig(valid, catalog);
    expect(() => validateModelConfig({
      ...valid,
      stageModels: {
        ...valid.stageModels,
        SX: "fixture/echo"
      } as RouterModelConfig["stageModels"]
    }, catalog)).toThrow(/stageModels key must be one of/);
    expect(() => validateModelConfig({
      ...valid,
      stageModels: {
        S1: "missing/model"
      }
    }, catalog)).toThrow(/unknown model id/);
  });

  it("reads telemetry JSONL strictly and reports completeness failures", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "pbos-router-telemetry-strict-"));
    const goodPath = path.join(dir, "router-telemetry.jsonl");
    const badPath = path.join(dir, "bad-telemetry.jsonl");
    const record = buildRouterTelemetryRecord({
      context: {
        runId: "run-1",
        mission: "mission-1",
        stage: "S4",
        step: "research",
        configId: "fixture-echo"
      },
      callKind: "provider.research.brief",
      provider: "fixture",
      model: "fixture/echo",
      outcome: "accepted",
      qualitySignals: { fixture: true },
      recordedAt: "2026-07-05T00:00:01.000Z"
    });
    await appendRouterTelemetryRecord(goodPath, record);
    await writeFile(badPath, "{not-json}\n", "utf8");

    const records = await readRouterTelemetryJsonl(goodPath);
    const summary = summarizeRouterTelemetry([...records, { ...record }], 2);

    expect(records).toHaveLength(1);
    expect(summary.duplicateHashes).toEqual([record.hash]);
    expect(() => assertRouterTelemetryCompleteness({
      records,
      expectedCallCount: 2,
      mission: "mission-1",
      configId: "fixture-echo"
    })).toThrow(/expected 2 records/);
    expect(() => assertRouterTelemetryCompleteness({
      records: [{ ...record, hash: "" }],
      expectedCallCount: 1
    })).toThrow(/without hashes/);
    await expect(readRouterTelemetryJsonl(badPath)).rejects.toThrow(/not valid JSON/);
  });
});

function inventoryMarkdown(): string {
  return `# Azure Resource Inventory for Playbasis Platform

**Last Updated:** July 5, 2026 for model-catalog notes

### Azure OpenAI GPT-5.6 / GPT-5.5 Pro Availability Note

Re-check on 2026-07-05 was still negative for the GPT-5.6 family.

| Resource Group | Resource | Region | Deployment | Backing model | Version | Capacity |
| --- | --- | --- | --- | --- | --- | ---: |
| \`rg-pb-codex-eus2\` | \`oai-playbasis-codex-gpt52\` | \`eastus2\` | \`gpt-5.5\` | \`gpt-5.5\` | \`2026-04-24\` | \`15000\` |
| \`rg-pb-team-openai\` | \`oai-playbasis-user-a-scus\` | \`southcentralus\` | \`gpt-5.5\` | \`gpt-5.5\` | \`2026-04-24\` | \`15000\` |

Routing env reference: \`PB_AZURE_OPENAI_GPT55_DEPLOYMENT\`.
`;
}
