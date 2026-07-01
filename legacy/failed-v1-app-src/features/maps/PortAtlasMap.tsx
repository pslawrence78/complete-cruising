import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import maplibregl, { type LngLatBoundsLike, type Map as MapLibreMap, type Marker } from "maplibre-gl";
import { CruiseMapCard } from "./CruiseMapCard";
import { mapProviderConfig, defaultAtlasMapOptions } from "./mapConfig";
import { deriveAtlasBounds, deriveAtlasCentre, getAtlasSummary, getMissingAtlasPoints, getOrderedRoutePoints, getValidAtlasPoints, hasAtlasFallback } from "./mapUtils";
import type { AtlasInteraction, AtlasMode, AtlasPoint, AtlasFallbackMetadata } from "./mapTypes";
import { PortAtlasFallback } from "./PortAtlasFallback";
import "./maps.css";

interface PortAtlasMapProps {
  caption?: string;
  fallbackMetadata?: AtlasFallbackMetadata;
  interaction?: AtlasInteraction;
  mode?: AtlasMode;
  points: readonly AtlasPoint[];
  selectedPointId?: string;
  title: string;
}

function providerAttribution() {
  return <span dangerouslySetInnerHTML={{ __html: mapProviderConfig.attributionHtml }} />;
}

function markerElement(point: AtlasPoint, selected: boolean) {
  const element = document.createElement("div");
  element.className = `port-atlas-marker${selected ? " port-atlas-marker--selected" : ""}`;
  element.dataset.kind = point.kind ?? "port";
  element.setAttribute("aria-label", point.label);
  element.innerHTML = `<span></span><strong>${point.label}</strong>`;
  return element;
}

function routeFeature(points: ReturnType<typeof getOrderedRoutePoints>) {
  return {
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: points.map((point) => [point.longitude, point.latitude]),
    },
    properties: {},
  };
}

export function PortAtlasMap({
  caption,
  fallbackMetadata,
  interaction = "curated",
  mode = "overview",
  points,
  selectedPointId,
  title,
}: PortAtlasMapProps) {
  const mapId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRefs = useRef<Marker[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">(hasAtlasFallback(points) ? "ready" : "loading");
  const validPoints = useMemo(() => getValidAtlasPoints(points), [points]);
  const routePoints = useMemo(() => getOrderedRoutePoints(points), [points]);
  const missing = useMemo(() => getMissingAtlasPoints(points), [points]);
  const summary = useMemo(() => getAtlasSummary(points), [points]);
  const hasMap = !hasAtlasFallback(points);
  const centre = useMemo(() => deriveAtlasCentre(points, selectedPointId), [points, selectedPointId]);
  const bounds = useMemo(() => deriveAtlasBounds(points), [points]);

  useEffect(() => {
    if (!hasMap || !containerRef.current) return undefined;

    const map = new maplibregl.Map({
      attributionControl: false,
      center: [centre.longitude, centre.latitude],
      container: containerRef.current,
      cooperativeGestures: interaction === "explore",
      dragPan: interaction === "explore",
      interactive: interaction === "explore",
      maxZoom: defaultAtlasMapOptions.maxZoom,
      minZoom: defaultAtlasMapOptions.minZoom,
      pitchWithRotate: false,
      scrollZoom: false,
      style: mapProviderConfig.styleUrl,
      zoom: mode === "single-port" ? defaultAtlasMapOptions.singlePortZoom : defaultAtlasMapOptions.defaultZoom,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.AttributionControl({ compact: false, customAttribution: mapProviderConfig.attributionHtml }), "bottom-right");
    if (interaction === "explore") map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const onError = () => setState("error");
    map.on("error", onError);
    map.on("load", () => {
      setState("ready");
      if (routePoints.length > 1) {
        map.addSource("complete-cruising-route", { type: "geojson", data: routeFeature(routePoints) });
        map.addLayer({
          id: "complete-cruising-route-glow",
          type: "line",
          source: "complete-cruising-route",
          paint: { "line-color": "#d8b56d", "line-opacity": 0.38, "line-width": 7 },
        });
        map.addLayer({
          id: "complete-cruising-route",
          type: "line",
          source: "complete-cruising-route",
          paint: { "line-color": "#8ee4e1", "line-opacity": 0.86, "line-width": 2.6 },
        });
      }
      if (bounds) {
        map.fitBounds([[bounds.west, bounds.south], [bounds.east, bounds.north]] as LngLatBoundsLike, {
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700,
          padding: defaultAtlasMapOptions.routePadding,
        });
      }
    });

    markerRefs.current = validPoints.map((point) => {
      const marker = new maplibregl.Marker({ element: markerElement(point, point.id === selectedPointId), anchor: "bottom" })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
      return marker;
    });

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [bounds, centre.latitude, centre.longitude, hasMap, interaction, mode, routePoints, selectedPointId, validPoints]);

  if (!hasMap) {
    return (
      <CruiseMapCard
        attribution={<span>{mapProviderConfig.attributionLabel}</span>}
        caption="Coordinates are required before a map can be shown."
        title={title}
      >
        <PortAtlasFallback metadata={fallbackMetadata} title={title} />
      </CruiseMapCard>
    );
  }

  const notice = missing.length
    ? `${missing.length} port${missing.length === 1 ? "" : "s"} omitted until reviewed coordinates are available.`
    : "All coordinate-bearing port calls are included.";

  return (
    <CruiseMapCard
      attribution={providerAttribution()}
      caption={caption ?? "Voyage context line - visual sequence, not navigational routing."}
      description={`${title}. ${summary.markerCount} atlas markers. ${notice}`}
      title={title}
    >
      <div className="port-atlas-map" data-state={state} data-mode={mode}>
        <div id={mapId} ref={containerRef} className="port-atlas-map__canvas" aria-label={`${title} map canvas`} />
        {state === "loading" ? <PortAtlasFallback metadata={fallbackMetadata} reason="loading" title={title} /> : null}
        {state === "error" ? <PortAtlasFallback metadata={fallbackMetadata} reason="unavailable" title={title} /> : null}
        <div className="port-atlas-map__caption">
          <strong>{summary.markerCount} atlas position{summary.markerCount === 1 ? "" : "s"}</strong>
          <span>{notice}</span>
        </div>
      </div>
    </CruiseMapCard>
  );
}
