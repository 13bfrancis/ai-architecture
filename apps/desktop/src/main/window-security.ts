import type { BrowserWindow } from "electron";

export const secureWindowNavigation = (window: BrowserWindow): void => {
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
};
