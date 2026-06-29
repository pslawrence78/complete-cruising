import { useEffect, useMemo, useState } from "react";
import { LocalDataState } from "../../components/states/LocalDataState";
import { useLocalQuery } from "../../hooks/useLocalData";
import { db } from "../../db/completeCruisingDb";
import { downloadJson } from "../import-export/downloadJson";
import {
  enrichmentRequestDefinitions,
  portPackTypes,
  requestDefinitionByType,
  shipPackTypes,
  type EnrichmentRequestContract,
  type EnrichmentRequestType,
  type FilterRequirement,
  type PortPackType,
  type ShipPackType,
} from "./enrichmentRequestTypes";
import { createEnrichmentRequest } from "./enrichmentRequestService";
import { buildPrompt } from "./promptTemplates";
import "../sailing-setup/SailingSetupPage.css";

function label(value: string) {
  return value.replaceAll("_", " ");
}

function filterSuffix(requirement: FilterRequirement) {
  if (requirement === "required") return "required";
  if (requirement === "optional") return "optional";
  return "not used for this request";
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function EnrichmentRequestsPage() {
  const query = useLocalQuery(async () => {
    const [sailings, ports, days, ships] = await Promise.all([
      db.sailings.orderBy("departureDate").toArray(),
      db.ports.orderBy("name").toArray(),
      db.itineraryDays.orderBy("dayNumber").toArray(),
      db.ships.orderBy("name").toArray(),
    ]);
    return { sailings, ports, days, ships };
  }, []);
  const [requestType, setRequestType] = useState<EnrichmentRequestType>("sailing_shell_enrichment");
  const [sailingId, setSailingId] = useState("");
  const [shipId, setShipId] = useState("");
  const [portId, setPortId] = useState("");
  const [itineraryDayId, setItineraryDayId] = useState("");
  const [shipPackType, setShipPackType] = useState<ShipPackType>("ship_identity_character");
  const [portPackType, setPortPackType] = useState<PortPackType>("port_fact_file");
  const [request, setRequest] = useState<EnrichmentRequestContract>();
  const [copyMessage, setCopyMessage] = useState<string>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const definition = requestDefinitionByType[requestType];
  const sailings = query.data?.sailings ?? [];
  const ships = query.data?.ships ?? [];
  const allDays = query.data?.days ?? [];
  const allPorts = query.data?.ports ?? [];
  const selectedSailing = sailings.find((sailing) => sailing.id === sailingId) ?? sailings[0];
  const sailingDays = selectedSailing
    ? allDays.filter((day) => day.sailingId === selectedSailing.id)
    : allDays;
  const sailingPortIds = Array.from(new Set(sailingDays.map((day) => day.portId).filter(Boolean)));
  const sailingPorts = sailingPortIds.length
    ? allPorts.filter((port) => sailingPortIds.includes(port.id))
    : allPorts;
  const selectedShip = ships.find((ship) => ship.id === shipId)
    ?? ships.find((ship) => ship.id === selectedSailing?.shipId)
    ?? ships[0];
  const prompt = useMemo(() => request ? buildPrompt(request) : "", [request]);

  useEffect(() => {
    if (selectedSailing && sailingId !== selectedSailing.id) setSailingId(selectedSailing.id);
  }, [sailingId, selectedSailing]);

  useEffect(() => {
    const nextShipId = selectedShip?.id;
    if (nextShipId && shipId !== nextShipId) setShipId(nextShipId);
  }, [selectedShip, shipId]);

  useEffect(() => {
    const nextDay = sailingDays[0];
    if (nextDay && !sailingDays.some((day) => day.id === itineraryDayId)) setItineraryDayId(nextDay.id);
  }, [itineraryDayId, sailingDays]);

  useEffect(() => {
    const nextPort = sailingPorts[0];
    if (nextPort && !sailingPorts.some((port) => port.id === portId)) setPortId(nextPort.id);
  }, [portId, sailingPorts]);

  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;

  const generate = async () => {
    setCopyMessage(undefined);
    setRequest(await createEnrichmentRequest({
      requestType,
      sailingId,
      shipId,
      portId,
      itineraryDayId,
      shipPackType,
      portPackType,
    }));
  };

  const copy = async (text: string, name: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopyMessage(`${name} copied. Manual selection remains available if clipboard access is blocked.`);
    } catch {
      setCopyMessage("Clipboard access was blocked. Select the text manually from the preview.");
    }
  };

  return <div className="enrichment-page">
    <header className="enrichment-hero">
      <div>
        <p className="eyebrow">Enrichment requests</p>
        <h1>Controlled prompts for careful cruise research.</h1>
        <p>Choose the enrichment type first, then bring in only the filters that genuinely matter. Every prompt now asks ChatGPT for one import-ready JSON object only, ready for Import / Export preview.</p>
      </div>
      <aside>
        <strong>Review-led</strong>
        <span>Returned JSON stays outside the database until it passes preview and an explicit local commit.</span>
      </aside>
    </header>

    <section className="enrichment-workbench">
      <div className="setup-section-heading">
        <div>
          <p className="section-kicker">01 - Request type first</p>
          <h2>Pick the enrichment contract</h2>
        </div>
        <span className="meta-chip confidence-chip" data-level="medium">Six governed types</span>
      </div>
      <div className="enrichment-type-grid" role="radiogroup" aria-label="Enrichment request type">
        {enrichmentRequestDefinitions.map((item) => <button
          key={item.requestType}
          type="button"
          role="radio"
          aria-checked={requestType === item.requestType}
          className="enrichment-type-card"
          data-active={requestType === item.requestType}
          onClick={() => setRequestType(item.requestType)}
        >
          <strong>{item.label}</strong>
          <span>{item.importNote}</span>
        </button>)}
      </div>

      <article className="setup-panel setup-panel--wide">
        <p className="section-kicker">02 - Request settings</p>
        <h3>{definition.requestLabel}</h3>
        <p>{definition.filterSummary}</p>
        <div className="chip-group">
          <span className="meta-chip confidence-chip" data-level="high">Return schema: {definition.returnSchemaName}</span>
          <span className="meta-chip confidence-chip" data-level="medium">Suggested file: {request?.task.suggestedImportFilename ?? `${definition.suggestedFilenamePrefix}-YYYYMMDD.json`}</span>
        </div>

        <button
          type="button"
          className="setup-secondary"
          onClick={() => setShowAdvancedFilters((current) => !current)}
          aria-expanded={showAdvancedFilters}
        >
          {showAdvancedFilters ? "Hide advanced filters" : "Show advanced filters"}
        </button>

        <div className={`enrichment-controls${showAdvancedFilters ? " enrichment-controls--open" : ""}`}>
          <label>
            Sailing <span>{filterSuffix(definition.filters.sailing)}</span>
            <select
              value={sailingId}
              onChange={(event) => setSailingId(event.target.value)}
              disabled={definition.filters.sailing === "disabled"}
            >
              {sailings.map((sailing) => <option key={sailing.id} value={sailing.id}>{sailing.name}</option>)}
            </select>
          </label>
          <label>
            Itinerary day <span>{filterSuffix(definition.filters.day)}</span>
            <select
              value={itineraryDayId}
              onChange={(event) => setItineraryDayId(event.target.value)}
              disabled={definition.filters.day === "disabled"}
            >
              {sailingDays.map((day) => <option key={day.id} value={day.id}>Day {day.dayNumber}: {day.title ?? day.dayType}</option>)}
            </select>
          </label>
          <label>
            Port <span>{filterSuffix(definition.filters.port)}</span>
            <select
              value={portId}
              onChange={(event) => setPortId(event.target.value)}
              disabled={definition.filters.port === "disabled"}
            >
              {sailingPorts.map((port) => <option key={port.id} value={port.id}>{port.name}</option>)}
            </select>
          </label>
          <label>
            Ship <span>{filterSuffix(definition.filters.ship)}</span>
            <select
              value={shipId}
              onChange={(event) => setShipId(event.target.value)}
              disabled={definition.filters.ship === "disabled"}
            >
              {ships.map((ship) => <option key={ship.id} value={ship.id}>{ship.name}</option>)}
            </select>
          </label>
          <label>
            Pack <span>{filterSuffix(definition.filters.pack)}</span>
            <select
              value={definition.packSelector === "ship" ? shipPackType : portPackType}
              onChange={(event) => definition.packSelector === "ship"
                ? setShipPackType(event.target.value as ShipPackType)
                : setPortPackType(event.target.value as PortPackType)}
              disabled={definition.filters.pack === "disabled"}
            >
              {(definition.packSelector === "ship" ? shipPackTypes : portPackTypes).map((packType) => (
                <option key={packType} value={packType}>{label(packType)}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="enrichment-actions">
          <button type="button" onClick={generate}>Generate request and prompt</button>
        </div>
      </article>
    </section>

    <section className="enrichment-preview">
      <div className="setup-section-heading">
        <div>
          <p className="section-kicker">03 - Governed output</p>
          <h2>{request ? request.task.title : "Waiting for request generation"}</h2>
        </div>
        {request && <span className="meta-chip confidence-chip" data-level="medium">Import-ready JSON requested</span>}
      </div>
      {request ? <>
        <p>Returned JSON must be previewed through Import / Export. If ChatGPT returns the JSON in chat, save it as a <code>.json</code> file before importing if needed.</p>
        <div className="enrichment-actions">
          <button type="button" onClick={() => copy(JSON.stringify(request, null, 2), "Request JSON")}>Copy JSON</button>
          <button type="button" onClick={() => copy(prompt, "Prompt")}>Copy prompt</button>
          <button type="button" onClick={() => downloadJson(`${request.requestId}.json`, request)}>Export JSON</button>
          <button type="button" onClick={() => downloadText(`${request.requestId}.txt`, prompt)}>Export prompt text</button>
        </div>
        {copyMessage && <p className="setup-message">{copyMessage}</p>}
        <h3>Request JSON</h3>
        <pre>{JSON.stringify(request, null, 2)}</pre>
        <h3>Copy-ready ChatGPT prompt</h3>
        <textarea value={prompt} readOnly spellCheck={false} />
      </> : <p>Choose one of the six supported request types, adjust only the relevant filters, then generate the governed JSON and prompt. No external calls are made here.</p>}
    </section>
  </div>;
}
