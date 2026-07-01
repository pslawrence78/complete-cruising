import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getRouteFromHash, routes } from "../routes/routeConfig";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(testDirectory, "../..");
const repositoryRoot = path.resolve(appRoot, "..");

function readAppFile(...segments: string[]) {
  return readFileSync(path.join(appRoot, ...segments), "utf8");
}

function readRepositoryFile(...segments: string[]) {
  return readFileSync(path.join(repositoryRoot, ...segments), "utf8");
}

describe("fresh-base deployment readiness", () => {
  it("keeps only the active fresh-base routes", () => {
    expect(routes.map((route) => route.path)).toEqual([
      "/",
      "/today",
      "/itinerary",
      "/ports",
      "/ship",
      "/plans",
      "/memories",
      "/about",
    ]);
    expect(routes.some((route) => route.path === "/guide-loader")).toBe(false);
  });

  it("falls back to the dashboard for removed routes", () => {
    expect(getRouteFromHash("#/guide-loader").path).toBe("/");
    expect(getRouteFromHash("#/backstage").path).toBe("/");
  });

  it("declares fresh-base metadata in the HTML entry", () => {
    const html = readAppFile("index.html");

    expect(html).toContain("Complete Cruising | Sun Princess Mediterranean 2026");
    expect(html).toContain("cruise-stable fresh base");
    expect(html).toContain("%BASE_URL%manifest.webmanifest");
    expect(html).toContain("%BASE_URL%icons/apple-touch-icon.png");
    expect(html).toContain('name="theme-color" content="#082b43"');
  });

  it("keeps the GitHub Pages base path in Vite config", () => {
    const viteConfig = readAppFile("vite.config.ts");
    expect(viteConfig).toContain('base: "/complete-cruising/"');
  });

  it("ships a path-safe manifest for the fresh base", () => {
    const manifest = JSON.parse(readAppFile("public", "manifest.webmanifest")) as {
      description: string;
      icons: Array<{ purpose?: string; src: string }>;
      name: string;
      scope: string;
      start_url: string;
    };

    expect(manifest.name).toBe("Complete Cruising");
    expect(manifest.description).toContain("Sun Princess Mediterranean 2026");
    expect(manifest.start_url).toBe("/complete-cruising/#/");
    expect(manifest.scope).toBe("/complete-cruising/");
    expect(manifest.icons.map((icon) => icon.src)).toEqual([
      "/complete-cruising/icons/icon-192.png",
      "/complete-cruising/icons/icon-512.png",
      "/complete-cruising/icons/icon-512-maskable.png",
    ]);
    expect(manifest.icons.some((icon) => icon.purpose === "maskable")).toBe(true);
  });

  it("documents the deployment contract and removed guide loader", () => {
    const rootReadme = readRepositoryFile("README.md");
    const checklist = readRepositoryFile("docs", "fresh-base", "04-deployment-checklist.md");

    expect(rootReadme).toContain("fresh-base/sun-princess-2026");
    expect(rootReadme).toContain("/#/about");
    expect(rootReadme).toContain("/#/guide-loader");
    expect(checklist).toContain("falls back to the dashboard");
    expect(checklist).toContain("legacy/");
  });
});
