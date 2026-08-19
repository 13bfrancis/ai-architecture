import { describe, expect, it } from "vitest";
import { createMainWindowOptions } from "./main-window-options";

describe("main window options", () => {
  it("locks the project shell to its approved geometry and security boundary", () => {
    const options = createMainWindowOptions("/test/preload.js");

    expect(options).toMatchObject({
      width: 1200,
      height: 800,
      minWidth: 720,
      minHeight: 520,
      show: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: "/test/preload.js",
        sandbox: true,
      },
    });
  });
});
