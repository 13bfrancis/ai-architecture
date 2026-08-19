// @vitest-environment jsdom

import { runtimeInfoResponseSchema } from "@ai-architecture/contracts/runtime-info";
import { projectShellDescriptor } from "@ai-architecture/core/project-shell";
import { diagramLanguageStatus } from "@ai-architecture/diagram-language/package-boundary";
import { cn } from "@ai-architecture/ui/lib/utils";
import { describe, expect, it } from "vitest";

describe("browser-safe workspace source resolution", () => {
  it("resolves package subpaths directly from TypeScript source", () => {
    const runtimeInfo = runtimeInfoResponseSchema.parse({
      appName: projectShellDescriptor.productName,
      appVersion: "0.1.0",
      platform: "darwin",
    });

    expect(runtimeInfo.appName).toBe("AI Architecture");
    expect(diagramLanguageStatus).toBe("grammar-not-specified");
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
