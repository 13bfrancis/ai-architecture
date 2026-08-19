import type { BrowserWindowConstructorOptions } from "electron";

export const createMainWindowOptions = (preloadPath: string): BrowserWindowConstructorOptions => ({
  width: 1200,
  height: 800,
  minWidth: 720,
  minHeight: 520,
  show: false,
  title: "AI Architecture",
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    preload: preloadPath,
    sandbox: true,
  },
});
