import { useEffect, useMemo, useState } from "react";
import { ConfidenceChip } from "../../components/status/ConfidenceChip";
import { LocalDataState } from "../../components/states/LocalDataState";
import { db } from "../../db/completeCruisingDb";
import { useLocalQuery } from "../../hooks/useLocalData";
import {
  applyPortLabelsToRows,
  archiveSailing,
  createSailingShell,
  deleteSailingSafely,
  generateItineraryRowsFromDates,
  getSailingDeleteGuardrail,
  loadSailingShellInput,
  summariseSetup,
  updateSailingShell,
  type SailingSetupInput,
  type SailingSetupItineraryDayInput,
  type SetupDayType,
  type SetupTenderStatus,
} from "./sailingSetupService";
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

const stepLabels = [
  "Sailing management",
  "Sailing basics",
  "Ship and cruise line",
  "Dates and voyage code",
  "Itinerary shell",
  "Review and save",
];

interface PendingAction {
  type: "archive" | "delete";
  sailingId: string;
  sailingName: string;
}

export function SailingSetupPage() {
  const query = useLocalQuery(async () => {
    const [sailings, cruiseLines, ships] = await Promise.all([
      db.sailings.orderBy("departureDate").toArray(),
      db.cruiseLines.toArray(),
      db.ships.toArray(),
    ]);
    const cruiseLineById = new Map(cruiseLines.map((cruiseLine) => [cruiseLine.id, cruiseLine]));
    const shipById = new Map(ships.map((ship) => [ship.id, ship]));
    const managed = await Promise.all(sailings.map(async (sailing) => ({
      sailing,
      cruiseLineName: cruiseLineById.get(sailing.cruiseLineId)?.name ?? "Cruise line to confirm",
      shipName: shipById.get(sailing.shipId)?.name ?? "Ship to confirm",
      deleteGuardrail: await getSailingDeleteGuardrail(sailing.id),
    })));
    return managed;
  }, []);

  const [input, setInput] = useState<SailingSetupInput>(initialInput);
  const [message, setMessage] = useState<string>();
  const [pastedPorts, setPastedPorts] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingSailingId, setEditingSailingId] = useState<string>();
  const [baselineDayCount, setBaselineDayCount] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction>();
  const [actionMessage, setActionMessage] = useState<string>();
  const summary = useMemo(() => summariseSetup(input), [input]);
  const managedSailings = query.data ?? [];
  const isEditing = Boolean(editingSailingId);

  useEffect(() => {
    if (!editingSailingId) {
      setInput(initialInput);
      setBaselineDayCount(1);
      return;
    }
    let active = true;
    loadSailingShellInput(editingSailingId)
      .then((loaded) => {
        if (!active) return;
        setInput(loaded);
        setBaselineDayCount(loaded.itineraryDays.length);
        setMessage(undefined);
      })
      .catch((error) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "The sailing could not be loaded for editing.");
      });
    return () => {
      active = false;
    };
  }, [editingSailingId]);

  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;

  const update = (patch: Partial<SailingSetupInput>) => setInput((current) => ({ ...current, ...patch }));
  const updateDay = (index: number, patch: Partial<SailingSetupItineraryDayInput>) => setInput((current) => ({
    ...current,
    itineraryDays: current.itineraryDays.map((day, dayIndex) => dayIndex === index ? { ...day, ...patch } : day),
  }));
  const addDay = () => setInput((current) => ({
    ...current,
    itineraryDays: [...current.itineraryDays, emptyDay(current.itineraryDays.length + 1)],
  }));
  const generateDays = () => setInput((current) => ({
    ...current,
    itineraryDays: generateItineraryRowsFromDates(current.departureDate, current.returnDate),
  }));
  const applyPastedPorts = () => setInput((current) => ({
    ...current,
    itineraryDays: applyPortLabelsToRows(current.itineraryDays, pastedPorts),
  }));
  const removeDay = (index: number) => setInput((current) => ({
    ...current,
    itineraryDays: current.itineraryDays
      .filter((_, dayIndex) => dayIndex !== index)
      .map((day, dayIndex) => ({ ...day, dayNumber: dayIndex + 1 })),
  }));
  const startCreate = () => {
    setEditingSailingId(undefined);
    setInput(initialInput);
    setBaselineDayCount(1);
    setMessage(undefined);
    setActionMessage(undefined);
  };

  const canSave = input.sailingName.trim()
    && input.cruiseLineName.trim()
    && input.shipName.trim()
    && input.departureDate
    && input.returnDate
    && input.itineraryDays.length > 0;

  const save = async () => {
    setSaving(true);
    setMessage(undefined);
    try {
      const result = editingSailingId
        ? await updateSailingShell(editingSailingId, input)
        : await createSailingShell(input);
      setEditingSailingId(result.sailing.id);
      setBaselineDayCount(result.itineraryDays.length);
      setMessage(editingSailingId
        ? `Updated ${result.sailing.name}. Existing guidebook and enrichment records were left in place.`
        : `Created ${result.sailing.name}. Reused ${result.reused.cruiseLine ? "existing" : "new"} cruise line and ${result.reused.ship ? "existing" : "new"} ship records.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `The sailing could not be ${editingSailingId ? "updated" : "created"}.`);
    } finally {
      setSaving(false);
    }
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    setActionMessage(undefined);
    try {
      if (pendingAction.type === "archive") {
        await archiveSailing(pendingAction.sailingId);
        if (editingSailingId === pendingAction.sailingId) startCreate();
        setActionMessage(`${pendingAction.sailingName} was archived locally. Linked itinerary and enrichment records were preserved.`);
      } else {
        await deleteSailingSafely(pendingAction.sailingId);
        if (editingSailingId === pendingAction.sailingId) startCreate();
        setActionMessage(`${pendingAction.sailingName} was deleted because no linked local records were present.`);
      }
      setPendingAction(undefined);
    } catch (error) {
      setActionMessage(error instanceof Error ? error.message : "The requested sailing action could not be completed.");
    }
  };

  return <div className="setup-page">
    <header className="setup-hero">
      <div>
        <p className="eyebrow">Sailing setup</p>
        <h1>Build and manage the sailing shell before enrichment begins.</h1>
        <p>Create new sailings, reopen existing shells for careful editing, and archive with guardrails so trusted local work is never lost quietly.</p>
      </div>
      <aside>
        <strong>Local-first</strong>
        <span>No APIs, no scraping, no automatic research.</span>
      </aside>
    </header>

    <nav className="setup-steps" aria-label="Sailing setup steps">
      {stepLabels.map((label, index) => <span key={label}><b>{index + 1}</b>{label}</span>)}
    </nav>

    <section className="setup-panel setup-panel--wide">
      <div className="setup-section-heading">
        <div>
          <p className="section-kicker">01 - Sailing management</p>
          <h2>{managedSailings.length ? "Existing sailings" : "No local sailings yet"}</h2>
        </div>
        <button type="button" className="setup-secondary" onClick={startCreate}>
          {isEditing ? "Start a new sailing shell" : "Blank create form"}
        </button>
      </div>
      {managedSailings.length ? <div className="managed-sailing-grid">
        {managedSailings.map((entry) => <article key={entry.sailing.id} className="managed-sailing-card" data-active={editingSailingId === entry.sailing.id}>
          <div>
            <p className="section-kicker">{entry.sailing.status}</p>
            <h3>{entry.sailing.name}</h3>
            <p>{entry.sailing.routeSummary ?? "Route summary still to confirm."}</p>
            <p>{entry.cruiseLineName} · {entry.shipName}</p>
          </div>
          <div className="chip-group">
            <ConfidenceChip level={entry.sailing.confidence?.confidence ?? "unknown"} label={entry.sailing.confidence?.reviewStatus?.replaceAll("_", " ") ?? "Needs review"} />
          </div>
          <div className="managed-sailing-actions">
            <button type="button" onClick={() => setEditingSailingId(entry.sailing.id)}>Edit shell</button>
            <button type="button" onClick={() => setPendingAction({ type: "archive", sailingId: entry.sailing.id, sailingName: entry.sailing.name })}>Archive</button>
            <button
              type="button"
              onClick={() => setPendingAction({ type: "delete", sailingId: entry.sailing.id, sailingName: entry.sailing.name })}
              disabled={!entry.deleteGuardrail.allowed}
            >
              Delete empty draft
            </button>
          </div>
          {!entry.deleteGuardrail.allowed && <p className="managed-sailing-note">{entry.deleteGuardrail.reason}</p>}
        </article>)}
      </div> : <p className="managed-sailing-note">No local sailing shells are stored yet. Start with the key dates, ship and itinerary spine, then enrich in small passes.</p>}

      {pendingAction && <article className="pending-sailing-action">
        <p className="section-kicker">Confirmation required</p>
        <h3>{pendingAction.type === "archive" ? "Archive this sailing?" : "Delete this sailing?"}</h3>
        <p>{pendingAction.type === "archive"
          ? `${pendingAction.sailingName} will move out of the main flow, while linked itinerary, enrichment and guidebook work remains intact.`
          : `${pendingAction.sailingName} will only be deleted if no linked itinerary, guidebook or enrichment records exist locally.`}</p>
        <div className="managed-sailing-actions">
          <button type="button" onClick={confirmAction}>{pendingAction.type === "archive" ? "Confirm archive" : "Confirm delete"}</button>
          <button type="button" className="setup-secondary" onClick={() => setPendingAction(undefined)}>Keep sailing</button>
        </div>
      </article>}
      {actionMessage && <p className="setup-message">{actionMessage}</p>}
    </section>

    <section className="setup-grid">
      <article className="setup-panel">
        <p className="section-kicker">02 - Sailing basics</p>
        <label>Sailing name<input value={input.sailingName} onChange={(event) => update({ sailingName: event.target.value })} placeholder="Sun Princess Mediterranean 2026" /></label>
        <label>Route summary<input value={input.routeSummary} onChange={(event) => update({ routeSummary: event.target.value })} placeholder="Rome to Barcelona" /></label>
        <label>Status<select value={input.status} onChange={(event) => update({ status: event.target.value as SailingSetupInput["status"] })}><option value="draft">Draft</option><option value="planned">Planned</option><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed</option><option value="archived">Archived</option></select></label>
        <label>Notes <span>optional</span><textarea value={input.notes} onChange={(event) => update({ notes: event.target.value })} /></label>
      </article>

      <article className="setup-panel">
        <p className="section-kicker">03 - Ship and cruise line</p>
        <label>Cruise line<input value={input.cruiseLineName} onChange={(event) => update({ cruiseLineName: event.target.value })} /></label>
        <label>Display name <span>optional</span><input value={input.cruiseLineDisplayName} onChange={(event) => update({ cruiseLineDisplayName: event.target.value })} /></label>
        <label>Ship<input value={input.shipName} onChange={(event) => update({ shipName: event.target.value })} /></label>
        <label>Ship notes <span>optional reusable guidebook context</span><textarea value={input.shipNotes} onChange={(event) => update({ shipNotes: event.target.value })} /></label>
      </article>

      <article className="setup-panel setup-panel--wide">
        <p className="section-kicker">04 - Dates and voyage code</p>
        <div className="setup-inline">
          <label>Departure date<input type="date" value={input.departureDate} onChange={(event) => update({ departureDate: event.target.value })} /></label>
          <label>Return date<input type="date" value={input.returnDate} onChange={(event) => update({ returnDate: event.target.value })} /></label>
          <label>Voyage code <span>optional local-only</span><input value={input.voyageCode} onChange={(event) => update({ voyageCode: event.target.value })} /></label>
        </div>
        <button type="button" className="setup-secondary" onClick={generateDays} disabled={!input.departureDate || !input.returnDate}>Generate itinerary dates</button>
        <div className="setup-inline">
          <label>Embarkation port <span>optional</span><input value={input.embarkationPortName} onChange={(event) => update({ embarkationPortName: event.target.value })} /></label>
          <label>Disembarkation port <span>optional</span><input value={input.disembarkationPortName} onChange={(event) => update({ disembarkationPortName: event.target.value })} /></label>
        </div>
      </article>
    </section>

    <section className="setup-panel setup-panel--wide">
      <div className="setup-section-heading">
        <div>
          <p className="section-kicker">05 - Itinerary shell</p>
          <h2>{isEditing ? "Edit the local itinerary spine" : "Generated day entries"}</h2>
        </div>
        <button type="button" onClick={addDay}>Add day</button>
      </div>
      {isEditing && <p className="managed-sailing-note">Existing itinerary rows stay in their current order during management mode so linked local day guidance, shore plans and enrichment work do not drift silently. You can still edit the row fields and add extra days when needed.</p>}
      <div className="setup-paste-panel">
        <label>Paste ports or sea days <span>one per day, commas also work</span><textarea value={pastedPorts} onChange={(event) => setPastedPorts(event.target.value)} placeholder={"Civitavecchia\nNaples\nAt sea\nSouda Bay / Chania"} /></label>
        <button type="button" onClick={applyPastedPorts} disabled={!input.itineraryDays.length || !pastedPorts.trim()}>Apply labels</button>
      </div>
      <div className="setup-days">
        {input.itineraryDays.map((day, index) => {
          const managedRow = isEditing && index < baselineDayCount;
          return <article key={index} className="setup-day-card">
            <header>
              <strong>Day {day.dayNumber}</strong>
              <div>
                <button type="button" onClick={() => removeDay(index)} disabled={managedRow || input.itineraryDays.length === 1}>Remove</button>
              </div>
            </header>
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
          </article>;
        })}
      </div>
    </section>

    <section className="setup-review">
      <article>
        <p className="section-kicker">06 - Review and save</p>
        <h2>{input.sailingName || "New sailing shell"}</h2>
        <p>{input.routeSummary || "Route summary not entered yet."}</p>
        <div className="setup-stats"><span>{summary.nights} nights</span><span>{summary.itineraryDayCount} days</span><span>{summary.portDays} port days</span><span>{summary.seaDays} sea days</span></div>
        <div className="chip-group"><ConfidenceChip level="medium" label="User-entered" /><ConfidenceChip level="unknown" label="Needs review" /></div>
        <h3>Missing or awaiting verification</h3>
        <ul>{summary.missingFields.length ? summary.missingFields.map((field) => <li key={field}>{field}</li>) : <li>Core shell fields look ready for a local draft.</li>}</ul>
        <button type="button" className="setup-primary" onClick={save} disabled={!canSave || saving}>{saving ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save sailing changes" : "Create sailing"}</button>
        {message && <p className="setup-message">{message}</p>}
      </article>
      <aside>
        <p className="section-kicker">Next enrichment requests</p>
        <h2>{isEditing ? "Ready for another controlled pass" : "After creation"}</h2>
        <p>Generate sailing, itinerary, ship, port, shore plan and day guide prompts from the Enrichment Requests page. Returned JSON still goes through Import / Export preview and commit.</p>
        <a href="#/enrichment-requests">Open enrichment requests</a>
      </aside>
    </section>
  </div>;
}
