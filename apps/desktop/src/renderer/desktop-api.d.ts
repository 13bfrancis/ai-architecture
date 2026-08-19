import type { RuntimeInfo } from "@ai-architecture/contracts/runtime-info";

declare global {
  interface Window {
    readonly desktop: {
      getRuntimeInfo: () => Promise<RuntimeInfo>;
    };
  }
}
