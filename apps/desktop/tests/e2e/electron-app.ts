import { _electron as electron, type ElectronApplication } from "@playwright/test";

export const launchDesktopApp = (): Promise<ElectronApplication> => {
  const desktopRoot = process.cwd();

  return electron.launch({
    args: [desktopRoot],
    cwd: desktopRoot,
    env: {
      ...process.env,
      AI_ARCHITECTURE_E2E: "1",
    },
  });
};
