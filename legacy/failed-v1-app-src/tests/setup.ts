import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

class MockMap {
  handlers = new Map<string, Set<() => void>>();

  constructor() {
    window.setTimeout(() => this.emit("load"), 0);
  }

  addControl = vi.fn();
  addLayer = vi.fn();
  addSource = vi.fn();
  fitBounds = vi.fn();
  remove = vi.fn();

  on(event: string, handler: () => void) {
    const handlers = this.handlers.get(event) ?? new Set<() => void>();
    handlers.add(handler);
    this.handlers.set(event, handlers);
  }

  emit(event: string) {
    this.handlers.get(event)?.forEach((handler) => handler());
  }
}

class MockMarker {
  addTo = vi.fn(() => this);
  remove = vi.fn();
  setLngLat = vi.fn(() => this);
}

vi.mock("maplibre-gl", () => ({
  default: {
    AttributionControl: vi.fn(),
    Map: MockMap,
    Marker: MockMarker,
    NavigationControl: vi.fn(),
  },
  AttributionControl: vi.fn(),
  Map: MockMap,
  Marker: MockMarker,
  NavigationControl: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
});
