import { app, BrowserWindow } from "electron";
import path from "node:path";
import { createMainWindowOptions } from "./main-window-options";
import { disposeRuntimeInfoHandler, registerRuntimeInfoHandler } from "./runtime-info-handler";
import { secureWindowNavigation } from "./window-security";

const createMainWindow = async (): Promise<BrowserWindow> => {
  const window = new BrowserWindow(createMainWindowOptions(path.join(__dirname, "preload.js")));

  secureWindowNavigation(window);
  window.once("ready-to-show", () => window.show());

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    await window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    await window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  return window;
};

app.setName("AI Architecture");

app.whenReady().then(async () => {
  registerRuntimeInfoHandler();
  await createMainWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("before-quit", disposeRuntimeInfoHandler);
app.on("window-all-closed", () => app.quit());
