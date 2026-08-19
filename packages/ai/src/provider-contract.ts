import type { ModelMessage } from "ai";

export type AiProviderCapability = "structured-output" | "text-streaming";

export interface AiRequestEnvelope {
  readonly messages: readonly ModelMessage[];
}

export interface AiProviderDescriptor {
  readonly capabilities: readonly AiProviderCapability[];
  readonly id: string;
}
