import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("PWA assets", () => {
  it("defines an installable web app manifest for the GitHub Pages base path", () => {
    const manifest = JSON.parse(
      readFileSync(join(appRoot, "public", "manifest.webmanifest"), "utf8"),
    );

    expect(manifest.name).toBe("Complete Cruising");
    expect(manifest.short_name).toBe("Complete Cruising");
    expect(manifest.display).toBe("standalone");
    expect(manifest.lang).toBe("en-GB");
    expect(manifest.start_url).toBe("/complete-cruising/");
    expect(manifest.scope).toBe("/complete-cruising/");
    expect(manifest.theme_color).toBe("#082b43");
    expect(manifest.background_color).toBe("#03111d");
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "icons/complete-cruising-icon.svg",
          sizes: "any",
          type: "image/svg+xml",
        }),
        expect.objectContaining({
          src: "icons/complete-cruising-maskable.svg",
          purpose: "maskable",
        }),
      ]),
    );
  });

  it("caches the static app shell without introducing live API dependencies", () => {
    const serviceWorker = readFileSync(join(appRoot, "public", "sw.js"), "utf8");

    expect(serviceWorker).toContain("complete-cruising-shell-v2");
    expect(serviceWorker).toContain("manifest.webmanifest");
    expect(serviceWorker).toContain("offline.html");
    expect(serviceWorker).toContain("request.mode === \"navigate\"");
    expect(serviceWorker).toContain("[...new Set(shellAssetUrls)]");
    expect(serviceWorker).not.toMatch(/fetch\(["'`]https?:/);
    expect(serviceWorker).not.toContain("openfreemap");
    expect(serviceWorker).not.toContain("tiles.openfreemap.org");
  });
});
