import { codexAdapterRuntime } from "@ai-architecture/ai-provider-codex/runtime-boundary";
import { databaseRuntime } from "@ai-architecture/database/runtime-boundary";
import { describe, expect, it } from "vitest";

describe("Node-only workspace source resolution", () => {
  it("resolves Node package subpaths without importing them into the renderer", () => {
    expect(process.release.name).toBe("node");
    expect(codexAdapterRuntime).toBe("node");
    expect(databaseRuntime).toBe("node");
  });
});
