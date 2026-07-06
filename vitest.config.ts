import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@playbasis-agent-os/kernel": path.resolve(__dirname, "packages/kernel/src/index.ts"),
      "@playbasis-agent-os/evals": path.resolve(__dirname, "packages/evals/src/index.ts"),
      "@playbasis-agent-os/hill-climber": path.resolve(__dirname, "packages/hill-climber/src/index.ts"),
      "@playbasis-agent-os/mission-optimizer": path.resolve(__dirname, "packages/mission-optimizer/src/index.ts"),
      "@playbasis-agent-os/navigator": path.resolve(__dirname, "packages/navigator/src/index.ts"),
      "@playbasis-agent-os/router-lab": path.resolve(__dirname, "packages/router-lab/src/index.ts"),
      "@playbasis-agent-os/run-warehouse": path.resolve(__dirname, "packages/run-warehouse/src/index.ts")
    }
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    restoreMocks: true
  }
});
