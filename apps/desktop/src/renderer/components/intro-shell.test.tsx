// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import type { RuntimeInfo } from "@ai-architecture/contracts/runtime-info";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroShell } from "./intro-shell";

const installDesktopApi = (getRuntimeInfo: () => Promise<RuntimeInfo>): void => {
  Object.defineProperty(window, "desktop", {
    configurable: true,
    value: { getRuntimeInfo },
  });
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Reflect.deleteProperty(window, "desktop");
});

describe("IntroShell", () => {
  it("renders the semantic shell and validated runtime information", async () => {
    installDesktopApi(() =>
      Promise.resolve({
        appName: "AI Architecture",
        appVersion: "0.1.0",
        platform: "darwin",
      }),
    );

    render(<IntroShell />);

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "AI Architecture" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Checking desktop runtime…");
    expect(await screen.findByText("Desktop shell ready · v0.1.0 · macOS")).toBeVisible();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("renders only the safe error message when the bridge rejects", async () => {
    const bridgeError = new Error("internal bridge detail");
    installDesktopApi(() => Promise.reject(bridgeError));

    render(<IntroShell />);

    expect(await screen.findByText("Desktop runtime details are unavailable.")).toBeVisible();
    expect(screen.queryByText(bridgeError.message)).not.toBeInTheDocument();
  });
});
