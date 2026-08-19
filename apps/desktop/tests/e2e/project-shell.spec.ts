import { expect, test } from "@playwright/test";
import { launchDesktopApp } from "./electron-app";

test("opens the secure project shell and exits cleanly", async () => {
  const electronApp = await launchDesktopApp();
  const page = await electronApp.firstWindow();
  const pageErrors: string[] = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));

  try {
    await electronApp.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows()[0]?.webContents.setZoomFactor(1);
    });

    await expect(page.getByRole("heading", { level: 1, name: "AI Architecture" })).toBeVisible();
    await expect(page.getByRole("status")).toHaveText("Desktop shell ready · v0.1.0 · macOS");
    await expect(page.getByRole("button")).toHaveCount(0);
    await expect(page.getByRole("link")).toHaveCount(0);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.locator("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])"),
    ).toHaveCount(0);

    expect(
      await page.evaluate(() => ({
        desktopApiKeys: Object.keys(window.desktop),
        hasNodeProcess: Reflect.has(window, "process"),
        hasNodeRequire: Reflect.has(window, "require"),
      })),
    ).toEqual({
      desktopApiKeys: ["getRuntimeInfo"],
      hasNodeProcess: false,
      hasNodeRequire: false,
    });
    expect(await page.evaluate(() => window.open("https://example.com"))).toBeNull();

    const initialLayout = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>("[data-slot='card']");
      const main = document.querySelector<HTMLElement>("main");

      if (!card || !main) {
        throw new Error("The project shell layout is incomplete.");
      }

      const cardRect = card.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();

      return {
        cardWidth: cardRect.width,
        horizontalCenterOffset: Math.abs(cardRect.left + cardRect.width / 2 - mainRect.width / 2),
        verticalCenterOffset: Math.abs(cardRect.top + cardRect.height / 2 - mainRect.height / 2),
      };
    });

    expect(initialLayout.cardWidth).toBeLessThanOrEqual(480);
    expect(initialLayout.horizontalCenterOffset).toBeLessThanOrEqual(1);
    expect(initialLayout.verticalCenterOffset).toBeLessThanOrEqual(1);

    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    const lightColors = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      foreground: getComputedStyle(document.body).color,
    }));
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    const darkColors = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      foreground: getComputedStyle(document.body).color,
    }));
    expect(darkColors).not.toEqual(lightColors);
    expect(lightColors.background).not.toBe(lightColors.foreground);
    expect(darkColors.background).not.toBe(darkColors.foreground);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);

    await page.setViewportSize({ width: 720, height: 520 });
    await electronApp.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows()[0]?.webContents.setZoomFactor(2);
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);

    expect(pageErrors).toEqual([]);
  } finally {
    await electronApp
      .evaluate(({ BrowserWindow }) => {
        BrowserWindow.getAllWindows()[0]?.webContents.setZoomFactor(1);
      })
      .catch(() => undefined);
    await electronApp.close();
  }
});
