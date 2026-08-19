import { describe, expect, it } from "vitest";
import { runtimeInfoRequestSchema, runtimeInfoResponseSchema } from "./runtime-info";

describe("runtime info contracts", () => {
  it("accepts the empty request and a valid macOS response", () => {
    expect(runtimeInfoRequestSchema.parse({})).toEqual({});
    expect(
      runtimeInfoResponseSchema.parse({
        appName: "AI Architecture",
        appVersion: "0.1.0",
        platform: "darwin",
      }),
    ).toEqual({
      appName: "AI Architecture",
      appVersion: "0.1.0",
      platform: "darwin",
    });
  });

  it.each([
    { appName: "AI Architecture", appVersion: "not-a-version", platform: "darwin" },
    { appName: "AI Architecture", appVersion: "0.1.0", platform: "win32" },
    { appName: "AI Architecture", appVersion: "0.1.0", extra: true, platform: "darwin" },
  ])("rejects an invalid response: %o", (response) => {
    expect(() => runtimeInfoResponseSchema.parse(response)).toThrow();
  });

  it("rejects request fields outside the proof contract", () => {
    expect(() => runtimeInfoRequestSchema.parse({ includeEnvironment: true })).toThrow();
  });
});
