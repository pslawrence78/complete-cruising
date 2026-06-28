import { useMemo, useState } from "react";
import { ConfidenceChip } from "../../components/status/ConfidenceChip";
import { createSailingShell, summariseSetup, type SailingSetupInput, type SailingSetupItineraryDayInput, type SetupDayType, type SetupTenderStatus } from "./sailingSetupService";
import "./SailingSetupPage.css";

const emptyDay = (dayNumber: number): SailingSetupItineraryDayInput => ({
  dayNumber,
  date: "",
  dayType: dayNumber === 1 ? "embarkation" : "port",
  portName: "",
  countryName: "",
  tenderStatus: "unknown",
});

const initialInput: SailingSetupInput = {
  sailingName: "",
  routeSummary: "",
  status: "draft",
  notes: "",
  cruiseLineName: "",
  cruiseLineDisplayName: "",
  shipName: "",
  shipNotes: "",
  departureDate: "",
  returnDate: "",
  voyageCode: "",
  embarkationPortName: "",
  disembarkationPortName: "",
  itineraryDays: [emptyDay(1)],
};

const stepLabels = ["Sailing basics", "Ship and cruise line", "Dates and voyage code", "Itinerary shell", "Review and create", "Next enrichment requests"];

export function SailingSetupPage() {
  const [input, setInput] = useState<SailingSetupInput>(initialInput);
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [createdSailingName, setCreatedSailingName] = useState<string>();
  const summary = useMemo(() => summariseSetup(input), [input]);

  const update = (patch: Partial<SailingSetupInput>) => setInput((current) => ({ ...current, ...patch }));
  const updateDay = (index: number, patch: Partial<SailingSetupItineraryDayInput>) => setInput((current) => ({
    ...current,
    itineraryDays: current.itineraryDays.map((day, dayIndex) => dayIndex === index ? { ...day, ...patch } : day),
  }));
  const addDay = () => setInput((current) => ({ ...current, itineraryDays: [...current.itineraryDays, emptyDay(current.itineraryDays.length + 1)] }));
  const removeDay = (index: number) => setInput((current) => ({
    ...current,
    itineraryDays: current.itineraryDays.filter((_, dayIndex) => dayIndex !== index).map((day, dayIndex) => ({ ...day, dayNumber: dayIndex + 1 })),
  }));
  const moveDay = (index: number, direction: -1 | 1) => setInput((current) => {
    const next = [...current.itineraryDays];
    const target = index + direction;
    if (target < 0 || target >= next.length) return current;
    [next[index], next[target]] = [next[target], next[index]];
    return { ...current, itineraryDays: next.map((day, dayIndex) => ({ ...day, dayNumber: dayIndex + 1 })) };
  });

  const canSave = input.sailingName.trim() && input.cruiseLineName.trim() && input.shipName.trim() && input.departureDate && input.returnDate && input.itineraryDays.length > 0;
  const save = async () => {
    setSaving(true);
    setMessage(undefined);
    try {
      const result = await createSailingShell(input);
      setCreatedSailingName(result.sailing.name);
      setMessage(`Created ${result.sailing.name}. Reused ${result.reused.cruiseLine ? "existing" : "new"} cruise line and ${result.reused.ship ? "existing" : "new"} ship records.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The sailing could not be created.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="setup-page">
    <header className="setup-hero">
      <div>
        <p className="eyebrow">Create sailing</p>
        <h1>Build the sailing shell before enrichment begins.</h1>
        <p>Enter the known spine of the cruise, keep it marked as user-entered, then generate controlled enrichment requests for manual ChatGPT research.</p>
      </div>
      <aside>
        <strong>Local-first</strong>
        <span>No APIs, no scraping, no automatic research.</span>
      </aside>
    </header>

    <nav className="setup-steps" aria-label="Sailing setup steps">
      {stepLabels.map((label, index) => <span key={label}><b>{index + 1}</b>{label}</span>)}
    </nav>

    <section className="setup-grid">
      <article className="setup-panel">
        <p className="section-kicker">01 - Sailing basics</p>
        <label>Sailing name<input value={input.sailingName} onChange={(event) => update({ sailingName: event.target.value })} placeholder="Sun Princess Mediterranean 2026" /></label>
        <label>Route summary<input value={input.routeSummary} onChange={(event) => update({ routeSummary: event.target.value })} placeholder="Rome to Barcelona" /></label>
        <label>Status<select value={input.status} onChange={(event) => update({ status: event.target.value as SailingSetupInput["status"] })}><option value="draft">Draft</option><option value="planned">Planned</option><option value="upcoming">Upcoming</option></select></label>
        <label>Notes <span>optional</span><textarea value={input.notes} onChange={(event) => update({ notes: event.target.value })} /></label>
      </article>

      <article className="setup-panel">
        <p className="section-kicker">02 - Ship and cruise line</p>
        <label>Cruise line<input value={input.cruiseLineName} onChange={(event) => update({ cruiseLineName: event.target.value })} /></label>
        <label>Display name <span>optional</span><input value={input.cruiseLineDisplayName} onChange={(event) => update({ cruiseLineDisplayName: event.target.value })} /></label>
        <label>Ship<input value={input.shipName} onChange={(event) => update({ shipName: event.target.value })} /></label>
        <label>Ship notes <span>optional</span><textarea value={input.shipNotes} onChange={(event) => update({ shipNotes: event.target.value })} /></label>
      </article>

      <article className="setup-panel setup-panel--wide">
        <p className="section-kicker">03 - Dates and voyage code</p>
        <div className="setup-inline">
          <label>Departure date<input type="date" value={input.departureDate} onChange={(event) => update({ departureDate: event.target.value })} /></label>
          <label>Return date<input type="date" value={input.returnDate} onChange={(event) => update({ returnDate: event.target.value })} /></label>
          <label>Voyage code <span>optional local-only</span><input value={input.voyageCode} onChange={(event) => update({ voyageCode: event.target.value })} /></label>
        </div>
        <div className="setup-inline">
          <label>Embarkation port <span>optional</span><input value={input.embarkationPortName} onChange={(event) => update({ embarkationPortName: event.target.value })} /></label>
          <label>Disembarkation port <span>optional</span><input value={input.disembarkationPortName} onChange={(event) => update({ disembarkationPortName: event.target.value })} /></label>
        </div>
      </article>
    </section>

    <section className="setup-panel setup-panel--wide">
      <div className="setup-section-heading"><div><p className="section-kicker">04 - Itinerary shell</p><h2>Manual day entries</h2></div><button type="button" onClick={addDay}>Add day</button></div>
      <div className="setup-days">
        {input.itineraryDays.map((day, index) => <article key={index} className="setup-day-card">
          <header><strong>Day {day.dayNumber}</strong><div><button type="button" onClick={() => moveDay(index, -1)} disabled={index === 0}>Up</button><button type="button" onClick={() => moveDay(index, 1)} disabled={index === input.itineraryDays.length - 1}>Down</button><button type="button" onClick={() => removeDay(index)} disabled={input.itineraryDays.length === 1}>Remove</button></div></header>
          <div className="setup-day-fields">
            <label>Date<input type="date" value={day.date} onChange={(event) => updateDay(index, { date: event.target.value })} /></label>
            <label>Day type<select value={day.dayType} onChange={(event) => updateDay(index, { dayType: event.target.value as SetupDayType })}><option value="embarkation">Embarkation</option><option value="port">Port</option><option value="sea">Sea day</option><option value="scenic_cruising">Scenic cruising</option><option value="overnight_port">Overnight port</option><option value="disembarkation">Disembarkation</option></select></label>
            <label>Port <span>where applicable</span><input value={day.portName ?? ""} onChange={(event) => updateDay(index, { portName: event.target.value })} /></label>
            <label>Country <span>optional</span><input value={day.countryName ?? ""} onChange={(event) => updateDay(index, { countryName: event.target.value })} /></label>
            <label>Arrive <span>optional</span><input value={day.arrivalTime ?? ""} onChange={(event) => updateDay(index, { arrivalTime: event.target.value })} placeholder="08:00" /></label>
            <label>Depart <span>optional</span><input value={day.departureTime ?? ""} onChange={(event) => updateDay(index, { departureTime: event.target.value })} placeholder="18:00" /></label>
            <label>All aboard <span>optional</span><input value={day.allAboardTime ?? ""} onChange={(event) => updateDay(index, { allAboardTime: event.target.value })} placeholder="17:30" /></label>
            <label>Tender<select value={day.tenderStatus ?? "unknown"} onChange={(event) => updateDay(index, { tenderStatus: event.target.value as SetupTenderStatus })}><option value="unknown">Unknown</option><option value="likely">Likely</option><option value="confirmed">Confirmed</option><option value="not_applicable">Not applicable</option></select></label>
          </div>
          <label className="setup-confirm"><input type="checkbox" checked={Boolean(day.userConfirmed)} onChange={(event) => updateDay(index, { userConfirmed: event.target.checked })} /> Mark this row as confirmed by user</label>
        </article>)}
      </div>
    </section>

    <section className="setup-review">
      <article>
        <p className="section-kicker">05 - Review and create</p>
        <h2>{input.sailingName || "New sailing shell"}</h2>
        <p>{input.routeSummary || "Route summary not entered yet."}</p>
        <div className="setup-stats"><span>{summary.nights} nights</span><span>{summary.itineraryDayCount} days</span><span>{summary.portDays} port days</span><span>{summary.seaDays} sea days</span></div>
        <div className="chip-group"><ConfidenceChip level="medium" label="User-entered" /><ConfidenceChip level="unknown" label="Needs review" /></div>
        <h3>Missing or awaiting verification</h3>
        <ul>{summary.missingFields.length ? summary.missingFields.map((field) => <li key={field}>{field}</li>) : <li>Core shell fields look ready for a draft sailing.</li>}</ul>
        <button type="button" className="setup-primary" onClick={save} disabled={!canSave || saving}>{saving ? "Creating..." : "Create sailing"}</button>
        {message && <p className="setup-message">{message}</p>}
      </article>
      <aside>
        <p className="section-kicker">06 - Next enrichment requests</p>
        <h2>{createdSailingName ? "Ready for controlled enrichment" : "After creation"}</h2>
        <p>Generate sailing, itinerary, ship, port, shore plan and day guide prompts from the Enrichment Requests page. Returned JSON still goes through Import / Export preview and commit.</p>
        <a href="#/enrichment-requests">Open enrichment requests</a>
      </aside>
    </section>
  </div>;
}
