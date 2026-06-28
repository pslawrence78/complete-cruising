import { useEffect, useState } from "react";
import { downloadJson } from "../import-export/downloadJson";
import {
  clearAllCompleteCruisingData,
  createDataManagementBackup,
  DATA_MANAGEMENT_CONFIRMATIONS,
  getDataManagementSummary,
  removeSampleData,
  reseedSampleData,
  resetActiveSailing,
  seedRealSunPrincess2026,
} from "./dataManagementService";
import "./DataManagementPage.css";

type ActionKey = keyof typeof DATA_MANAGEMENT_CONFIRMATIONS;

const actions: { key: ActionKey; title: string; body: string; destructive?: boolean }[] = [
  { key: "seedReal", title: "Onboard Sun Princess 2026", body: "Create or select the real Eastern Mediterranean Cruise shell without duplicating an existing local record." },
  { key: "resetActiveSailing", title: "Reset active sailing", body: "Remove the selected sailing and its sailing-specific itinerary, planning, memory and enrichment records.", destructive: true },
  { key: "removeSample", title: "Remove sample data", body: "Clear records still marked as illustrative sample data so the real sailing leads the app.", destructive: true },
  { key: "clearAll", title: "Clear Complete Cruising data", body: "Empty the local IndexedDB stores for a clean start on this browser.", destructive: true },
  { key: "seedSample", title: "Reseed demo data", body: "Restore curated illustrative records for testing the app experience." },
];

export function DataManagementPage() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getDataManagementSummary>>>();
  const [confirmations, setConfirmations] = useState<Record<string, string>>({});
  const [backupExported, setBackupExported] = useState(false);
  const [message, setMessage] = useState<string>();

  const refresh = () => getDataManagementSummary().then(setSummary);
  useEffect(() => { void refresh(); }, []);

  const exportBackup = async () => {
    const backup = await createDataManagementBackup();
    downloadJson(backup.filename, backup.payload);
    setBackupExported(true);
    setMessage("Full local backup exported. Destructive actions are now available for this session.");
  };

  const runAction = async (key: ActionKey) => {
    setMessage(undefined);
    const action = { confirmation: confirmations[key] ?? "", backupExported };
    try {
      if (key === "seedReal") await seedRealSunPrincess2026(action);
      if (key === "resetActiveSailing") await resetActiveSailing(action);
      if (key === "removeSample") await removeSampleData(action);
      if (key === "clearAll") await clearAllCompleteCruisingData(action);
      if (key === "seedSample") await reseedSampleData(action);
      setConfirmations((current) => ({ ...current, [key]: "" }));
      await refresh();
      setMessage("Local data action completed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The local data action could not be completed.");
    }
  };

  return <div className="data-management-page">
    <header className="data-management-hero">
      <div>
        <p className="eyebrow">Data Management</p>
        <h1>Local data, handled carefully.</h1>
        <p>Reset, clear or reseed browser storage with explicit guardrails. Complete Cruising stays local-first: no account, backend or network connection is required.</p>
      </div>
      <aside>
        <strong>Backup first</strong>
        <span>Export a full local JSON backup before any destructive change.</span>
        <button type="button" onClick={exportBackup}>Export full backup</button>
      </aside>
    </header>

    <section className="mvp-readiness" aria-label="MVP readiness">
      <article><span>{summary?.realSailingPresent ? "Ready" : "Missing"}</span><strong>Sun Princess shell</strong></article>
      <article><span>{summary?.realSailingIsActive ? "Active" : "Not active"}</span><strong>Real sailing selected</strong></article>
      <article><span>{summary?.itineraryDayCount ?? "-"}</span><strong>Itinerary rows</strong></article>
      <article><span>{summary?.sampleSailingCount ?? "-"}</span><strong>Sample sailings</strong></article>
      <article><span>{summary?.importBatchCount ?? "-"}</span><strong>Import batches</strong></article>
      <article><span>Protected</span><strong>Operational times</strong></article>
    </section>

    <section className="data-actions" aria-label="Local data actions">
      {actions.map((action) => {
        const phrase = DATA_MANAGEMENT_CONFIRMATIONS[action.key];
        const confirmation = confirmations[action.key] ?? "";
        const disabled = confirmation.trim() !== phrase || (action.destructive && !backupExported);
        return <article key={action.key} className={action.destructive ? "data-action data-action--destructive" : "data-action"}>
          <div>
            <p className="section-kicker">{action.destructive ? "Guarded action" : "Local setup"}</p>
            <h2>{action.title}</h2>
            <p>{action.body}</p>
          </div>
          <label>Type <code>{phrase}</code><input value={confirmation} onChange={(event) => setConfirmations((current) => ({ ...current, [action.key]: event.target.value }))} /></label>
          <button type="button" disabled={disabled} onClick={() => void runAction(action.key)}>{action.title}</button>
        </article>;
      })}
    </section>

    {message && <p className="data-management-message">{message}</p>}
  </div>;
}
