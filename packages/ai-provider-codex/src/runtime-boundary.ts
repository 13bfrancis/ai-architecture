import type { AiProviderDescriptor } from "@ai-architecture/ai/provider-contract";

export interface CodexAdapterPlaceholder {
  readonly provider: AiProviderDescriptor;
  readonly runtime: "node";
  readonly status: "not-configured";
}

export const codexAdapterRuntime = "node" as const;
