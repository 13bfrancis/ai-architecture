import { runtimeInfoResponseSchema } from "@ai-architecture/contracts/runtime-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@ai-architecture/ui/components/card";
import { useEffect, useState } from "react";

type RuntimeState =
  | { status: "loading" }
  | { appVersion: string; status: "ready" }
  | { status: "error" };

const runtimeStatusText = (state: RuntimeState): string => {
  switch (state.status) {
    case "loading":
      return "Checking desktop runtime…";
    case "ready":
      return `Desktop shell ready · v${state.appVersion} · macOS`;
    case "error":
      return "Desktop runtime details are unavailable.";
  }
};

export const IntroShell = () => {
  const [runtimeState, setRuntimeState] = useState<RuntimeState>({ status: "loading" });

  useEffect(() => {
    let isActive = true;

    const loadRuntimeInfo = async (): Promise<void> => {
      try {
        const rawRuntimeInfo: unknown = await window.desktop.getRuntimeInfo();
        const runtimeInfo = runtimeInfoResponseSchema.parse(rawRuntimeInfo);

        if (isActive) {
          setRuntimeState({ appVersion: runtimeInfo.appVersion, status: "ready" });
        }
      } catch {
        if (isActive) {
          setRuntimeState({ status: "error" });
        }
      }
    };

    void loadRuntimeInfo();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-[clamp(1.5rem,4vw,4rem)] py-[clamp(1.5rem,4vw,4rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--shell-glow),transparent_55%)]"
      />
      <Card className="w-full max-w-[30rem] bg-card/95 py-0 shadow-lg shadow-black/5 backdrop-blur-sm">
        <CardHeader className="gap-0 px-6 pt-6 md:px-8 md:pt-8">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.08em] uppercase">
            Initialized desktop shell
          </p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)] leading-[1.05] font-bold tracking-tight">
            AI Architecture
          </h1>
          <CardDescription className="mt-3 text-base leading-relaxed">
            A secure foundation for diagram-first architecture work with an AI collaborator.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-6 pb-6 md:px-8 md:pb-8">
          <div
            role="status"
            aria-atomic="true"
            aria-live="polite"
            className="bg-muted text-muted-foreground rounded-md px-3 py-2 text-[0.8125rem] leading-[1.4] font-medium"
          >
            {runtimeStatusText(runtimeState)}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
