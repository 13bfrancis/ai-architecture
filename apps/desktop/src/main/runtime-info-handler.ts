import {
  runtimeInfoChannel,
  runtimeInfoRequestSchema,
  runtimeInfoResponseSchema,
} from "@ai-architecture/contracts/runtime-info";
import { app, ipcMain } from "electron";

export const registerRuntimeInfoHandler = (): void => {
  ipcMain.removeHandler(runtimeInfoChannel);
  ipcMain.handle(runtimeInfoChannel, (_event, rawRequest: unknown) => {
    runtimeInfoRequestSchema.parse(rawRequest);

    return runtimeInfoResponseSchema.parse({
      appName: app.getName(),
      appVersion: app.getVersion(),
      platform: process.platform,
    });
  });
};

export const disposeRuntimeInfoHandler = (): void => {
  ipcMain.removeHandler(runtimeInfoChannel);
};
