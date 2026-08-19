export const databaseRuntime = "node" as const;

export interface DatabasePackageBoundary {
  readonly driver: "not-selected";
  readonly runtime: typeof databaseRuntime;
}
