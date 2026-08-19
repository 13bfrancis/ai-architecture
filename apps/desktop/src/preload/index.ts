import {
  runtimeInfoChannel,
  runtimeInfoRequestSchema,
  runtimeInfoResponseSchema,
} from "@ai-architecture/contracts/runtime-info";
import { contextBridge, ipcRenderer } from "electron";

const desktopApi = {
  getRuntimeInfo: async () => {
    const request = runtimeInfoRequestSchema.parse({});
    const response: unknown = await ipcRenderer.invoke(runtimeInfoChannel, request);
    return runtimeInfoResponseSchema.parse(response);
  },
};

contextBridge.exposeInMainWorld("desktop", desktopApi);
