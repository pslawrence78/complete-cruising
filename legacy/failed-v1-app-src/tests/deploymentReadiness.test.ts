import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { routeConfig } from "../routes/routeConfig";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const repoRoot = join(appRoot, "..");

describe("GitHub Pages deployment readiness", () => {
  it("builds beneath the documented GitHub Pages base path", () => {
    const viteConfig = readFileSync(join(appRoot, "vite.config.ts"), "utf8");
    expect(viteConfig).toContain('base: "/complete-cruising/"');
  });

  it("keeps public PWA assets publishable from the app dist root", () => {
    for (const relativePath of [
      "manifest.webmanifest",
      "sw.js",
      "offline.html",
      "icons/complete-cruising-icon.svg",
      "icons/complete-cruising-maskable.svg",
    ]) {
      expect(existsSync(join(appRoot, "public", relativePath))).toBe(true);
    }
  });

  it("preserves hash-safe route paths for static hosting", () => {
    const implementedPaths = routeConfig
      .filter((route) => route.status === "implemented")
      .map((route) => route.path);

    expect(implementedPaths).toEqual(
      expect.arrayContaining([
        "/",
        "/itinerary",
        "/today",
        "/ship",
        "/ports",
        "/import-export",
      ]),
    );
    expect(implementedPaths.every((path) => path.startsWith("/"))).toBe(true);
    expect(implementedPaths.some((path) => path.includes("complete-cruising"))).toBe(false);
  });

  it("uses the GitHub Pages Actions deployment flow", () => {
    const workflow = readFileSync(
      join(repoRoot, ".github", "workflows", "deploy.yml"),
      "utf8",
    );

    expect(workflow).toContain("actions/configure-pages@v6");
    expect(workflow).toContain("actions/upload-pages-artifact@v5");
    expect(workflow).toContain("actions/deploy-pages@v5");
    expect(workflow).toContain("working-directory: app");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run typecheck");
    expect(workflow).toContain("npm run test");
    expect(workflow).toContain("npm run build");
    expect(workflow).toContain("path: app/dist");
    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("id-token: write");
  });
});
