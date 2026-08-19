export const diagramLanguageStatus = "grammar-not-specified" as const;

export interface DiagramLanguagePackageBoundary {
  readonly runtime: "platform-independent";
  readonly status: typeof diagramLanguageStatus;
}
