import { useEffect, useMemo, useState } from "react";
import { LocalDataState } from "../../components/states/LocalDataState";
import { downloadJson } from "../import-export/downloadJson";
import { useLocalQuery } from "../../hooks/useLocalData";
import { db } from "../../db/completeCruisingDb";
import { createEnrichmentRequest } from "./enrichmentRequestService";
import { buildPrompt } from "./promptTemplates";
import { enrichmentRequestTypes, portPackTypes, shipPackTypes, type EnrichmentRequestContract, type EnrichmentRequestType, type PortPackType, type ShipPackType } from "./enrichmentRequestTypes";
import "../sailing-setup/SailingSetupPage.css";

const label = (value: string) => value.replaceAll("_", " ");

export function EnrichmentRequestsPage() {
  const query = useLocalQuery(async () => {
    const [sailings, ports, days] = await Promise.all([
      db.sailings.orderBy("departureDate").toArray(),
      db.ports.orderBy("name").toArray(),
      db.itineraryDays.orderBy("dayNumber").toArray(),
    ]);
    return { sailings, ports, days };
  }, []);
  const [requestType, setRequestType] = useState<EnrichmentRequestType>("sailing_shell_enrichment");
  const [sailingId, setSailingId] = useState("");
  const [portId, setPortId] = useState("");
  const [itineraryDayId, setItineraryDayId] = useState("");
  const [shipPackType, setShipPackType] = useState<ShipPackType>("ship_identity_character");
  const [portPackType, setPortPackType] = useState<PortPackType>("port_fact_file");
  const [request, setRequest] = useState<EnrichmentRequestContract>();
  const [copyMessage, setCopyMessage] = useState<string>();

  useEffect(() => {
    if (query.data?.sailings[0] && !sailingId) setSailingId(query.data.sailings[0].id);
    if (query.data?.ports[0] && !portId) setPortId(query.data.ports[0].id);
    if (query.data?.days[0] && !itineraryDayId) setItineraryDayId(query.data.days[0].id);
  }, [itineraryDayId, portId, query.data, sailingId]);

  const prompt = useMemo(() => request ? buildPrompt(request) : "", [request]);
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;

  const generate = async () => {
    setCopyMessage(undefined);
    setRequest(await createEnrichmentRequest({ requestType, sailingId, portId, itineraryDayId, shipPackType, portPackType }));
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
        <p>Generate request JSON and copy-ready ChatGPT prompts. Complete Cruising does not research or import this automatically. Paste the prompt into ChatGPT, then import the returned JSON through Import / Export for preview and commit.</p>
      </div>
      <aside>
        <strong>Review-led</strong>
        <span>All returned enrichment stays outside the database until previewed and committed.</span>
      </aside>
    </header>

    <section className="enrichment-workbench">
      <p className="section-kicker">01 - Request settings</p>
      <div className="enrichment-controls">
        <label>Selected sailing<select value={sailingId} onChange={(event) => setSailingId(event.target.value)}>{query.data?.sailings.map((sailing) => <option key={sailing.id} value={sailing.id}>{sailing.name}</option>)}</select></label>
        <label>Request type<select value={requestType} onChange={(event) => setRequestType(event.target.value as EnrichmentRequestType)}>{enrichmentRequestTypes.map((type) => <option key={type} value={type}>{label(type)}</option>)}</select></label>
        <label>Target port<select value={portId} onChange={(event) => setPortId(event.target.value)}>{query.data?.ports.map((port) => <option key={port.id} value={port.id}>{port.name}</option>)}</select></label>
        <label>Itinerary day<select value={itineraryDayId} onChange={(event) => setItineraryDayId(event.target.value)}>{query.data?.days.map((day) => <option key={day.id} value={day.id}>Day {day.dayNumber}: {day.title ?? day.dayType}</option>)}</select></label>
        <label>Ship pack<select value={shipPackType} onChange={(event) => setShipPackType(event.target.value as ShipPackType)}>{shipPackTypes.map((type) => <option key={type} value={type}>{label(type)}</option>)}</select></label>
        <label>Port pack<select value={portPackType} onChange={(event) => setPortPackType(event.target.value as PortPackType)}>{portPackTypes.map((type) => <option key={type} value={type}>{label(type)}</option>)}</select></label>
      </div>
      <div className="enrichment-actions">
        <button type="button" onClick={generate}>Generate request and prompt</button>
      </div>
    </section>

    <section className="enrichment-preview">
      <div className="setup-section-heading"><div><p className="section-kicker">02 - Generated artefacts</p><h2>{request ? request.task.title : "Waiting for request generation"}</h2></div>{request && <span className="meta-chip confidence-chip" data-level="medium">Needs review</span>}</div>
      {request ? <>
        <p>Returned JSON must be imported through Import / Export. Protected fields remain guarded by preview warnings and commit confirmation.</p>
        <div className="enrichment-actions">
          <button type="button" onClick={() => copy(JSON.stringify(request, null, 2), "Request JSON")}>Copy JSON</button>
          <button type="button" onClick={() => copy(prompt, "Prompt")}>Copy prompt</button>
          <button type="button" onClick={() => downloadJson(`${request.requestId}.json`, request)}>Export JSON</button>
        </div>
        {copyMessage && <p className="setup-message">{copyMessage}</p>}
        <h3>Request JSON</h3>
        <pre>{JSON.stringify(request, null, 2)}</pre>
        <h3>Copy-ready ChatGPT prompt</h3>
        <textarea value={prompt} readOnly spellCheck={false} />
      </> : <p>Choose a request type and target, then generate a structured request. No external calls are made.</p>}
    </section>
  </div>;
}
