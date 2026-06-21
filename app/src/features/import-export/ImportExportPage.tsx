import { useRef, useState, type ChangeEvent } from "react";
import { createImportPreview, importTypeOptions } from "./importPreviewService";
import type { ImportPreviewResult, ImportType } from "./importPreviewTypes";
import { getSampleImport } from "./sampleImports";
import "./ImportExportPage.css";

const initialResult = (selectedImportType: ImportType): ImportPreviewResult => ({ status: "idle", selectedImportType, summary: "Waiting for a structured import file.", recordsToCreate: [], recordsToUpdate: [], recordsUnchanged: [], protectedFieldImpacts: [], warnings: [], errors: [], previewOnly: true });
const labels: Record<ImportType, string> = { sailing_shell: "Sailing shell", itinerary: "Itinerary", ship_enrichment: "Ship enrichment", port_enrichment: "Port enrichment", day_guide: "Day guide" };

function CountTile({ value, label, tone = "default" }: { value: number; label: string; tone?: string }) {
  return <div className="import-count" data-tone={tone}><strong>{value}</strong><span>{label}</span></div>;
}

export function ImportExportPage() {
  const [type, setType] = useState<ImportType>("sailing_shell");
  const [json, setJson] = useState("");
  const [fileName, setFileName] = useState<string>();
  const [result, setResult] = useState<ImportPreviewResult>(initialResult(type));
  const [validating, setValidating] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const selectType = (next: ImportType) => { setType(next); setResult(initialResult(next)); };
  const clear = () => { setJson(""); setFileName(undefined); setResult(initialResult(type)); if (fileInput.current) fileInput.current.value = ""; };
  const validate = async () => { setValidating(true); try { setResult(await createImportPreview(json, type)); } finally { setValidating(false); } };
  const loadSample = () => { setJson(getSampleImport(type)); setFileName(undefined); setResult(initialResult(type)); };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) { setResult({ ...initialResult(type), status: "parse_error", summary: "Choose a JSON file.", errors: [{ id: "file-type", title: "Unsupported file", message: "Only .json files can be previewed.", fieldPath: "file", code: "file_type" }] }); return; }
    setJson(await file.text()); setFileName(file.name); setResult(initialResult(type));
  };

  return <div className="import-page">
    <header className="import-hero">
      <div><p className="eyebrow">Local data harbour · preview only</p><h1>Import <em>Preview</em></h1><p>Validate cruise JSON before anything changes. Check its shape, target, warnings and proposed changes in a calm, local review.</p></div>
      <aside><span className="import-hero__lock" aria-hidden="true">◇</span><p>Safe waters</p><strong>Nothing is committed</strong><small>Your local guidebooks and sailing records remain untouched.</small></aside>
    </header>

    <section className="import-workbench" aria-labelledby="import-type-title">
      <div className="import-section-heading"><div><p className="section-kicker">01 · Choose the chart</p><h2 id="import-type-title">What kind of record are we reading?</h2></div><p>Guidebook enrichment stays reusable; itinerary and day-guide data stays with its sailing.</p></div>
      <div className="import-types" role="radiogroup" aria-label="Import type">
        {importTypeOptions.map((option) => <button key={option.value} type="button" role="radio" aria-checked={type === option.value} className="import-type" onClick={() => selectType(option.value)}><span>{String(importTypeOptions.indexOf(option) + 1).padStart(2, "0")}</span><strong>{option.label}</strong><small>{option.note}</small></button>)}
      </div>

      <div className="import-input-grid">
        <div className="import-input-card">
          <div className="import-card-heading"><div><p className="section-kicker">02 · Add the manifest</p><h2>Paste or upload JSON</h2></div>{fileName && <span className="import-file-chip">{fileName}</span>}</div>
          <label className="sr-only" htmlFor="import-json">Complete Cruising JSON</label>
          <textarea id="import-json" value={json} onChange={(event) => { setJson(event.target.value); setResult(initialResult(type)); }} spellCheck={false} placeholder={'{\n  "kind": "sailing_shell",\n  "header": { ... }\n}'} />
          <div className="import-input-actions">
            <label className="import-button import-button--secondary">Upload .json<input ref={fileInput} type="file" accept="application/json,.json" onChange={upload} /></label>
            <button type="button" className="import-text-action" onClick={loadSample}>Load illustrative sample</button>
            <button type="button" className="import-text-action" onClick={clear} disabled={!json}>Clear</button>
            <button type="button" className="import-button import-button--primary" onClick={validate} disabled={!json.trim() || validating}>{validating ? "Reading chart…" : "Validate preview"}<span aria-hidden="true">→</span></button>
          </div>
          <p className="import-privacy-note"><span aria-hidden="true">◎</span> Processed only in this browser. Avoid booking references, cabin numbers and personal documents.</p>
        </div>

        <aside className="import-status-card" data-status={result.status} aria-live="polite">
          <p className="section-kicker">03 · Signal check</p>
          <div className="import-status-mark" aria-hidden="true">{result.status === "valid" ? "✓" : result.status === "idle" ? "· · ·" : "!"}</div>
          <p className="import-status-label">{result.status.replace("_", " ")}</p>
          <h2>{result.status === "valid" ? "Ready to review" : result.status === "idle" ? "Waiting for input" : "Needs attention"}</h2>
          <p>{result.summary}</p>
          <dl><div><dt>Selected</dt><dd>{labels[type]}</dd></div><div><dt>Detected</dt><dd>{result.detectedImportType ? labels[result.detectedImportType] : "—"}</dd></div><div><dt>Schema</dt><dd>{result.schemaVersion ? `Version ${result.schemaVersion}` : "—"}</dd></div></dl>
        </aside>
      </div>
    </section>

    {result.status !== "idle" && <section className="import-results" aria-labelledby="preview-title">
      <div className="import-section-heading"><div><p className="section-kicker">04 · Review the proposed course</p><h2 id="preview-title">{result.status === "valid" ? "Import preview" : "What needs fixing"}</h2></div><span className="import-preview-chip">Preview only</span></div>
      {result.status === "valid" && <>
        <article className="import-summary-card"><div><p className="paper-kicker">Likely target</p><h3>{result.targetName}</h3><p>{result.targetType}</p><code>{result.targetId}</code></div><dl><div><dt>Detected schema</dt><dd>{result.schema}</dd></div><div><dt>Source app</dt><dd>{result.sourceApp ?? "Not supplied"}</dd></div><div><dt>Record boundary</dt><dd>{type === "ship_enrichment" || type === "port_enrichment" ? "Reusable guidebook" : "Sailing-specific"}</dd></div></dl></article>
        <div className="import-counts"><CountTile value={result.recordsToCreate.length} label="To create" tone="create"/><CountTile value={result.recordsToUpdate.length} label="To update" tone="update"/><CountTile value={result.recordsUnchanged.length} label="Unchanged"/><CountTile value={result.protectedFieldImpacts.length} label="Protected fields" tone="protected"/><CountTile value={result.warnings.length} label="Warnings" tone="warning"/><CountTile value={result.errors.length} label="Errors"/></div>
      </>}

      {(result.errors.length > 0 || result.warnings.length > 0) && <div className="import-notice-grid">
        {result.errors.length > 0 && <article className="import-notice-panel import-notice-panel--errors"><p className="section-kicker">Errors · {result.errors.length}</p><h3>Correct these before previewing</h3><ul>{result.errors.map((notice) => <li key={notice.id}><span>!</span><div><strong>{notice.title}</strong><p>{notice.message}</p>{notice.fieldPath && <code>{notice.fieldPath}</code>}</div></li>)}</ul></article>}
        {result.warnings.length > 0 && <article className="import-notice-panel"><p className="section-kicker">Watchlist · {result.warnings.length}</p><h3>Review before any future commit</h3><ul>{result.warnings.map((notice) => <li key={notice.id}><span>◇</span><div><strong>{notice.title}</strong><p>{notice.message}</p>{notice.fieldPath && <code>{notice.fieldPath}</code>}</div></li>)}</ul></article>}
      </div>}

      {result.status === "valid" && <article className="import-conflict-card"><div className="import-conflict-card__heading"><div><p className="section-kicker">Conflict preview</p><h3>A conservative look at local impact</h3></div><span>Preview capability</span></div><div className="import-conflict-columns"><div><h4>Record course</h4>{result.recordsToCreate.map((id) => <p key={id}><span>+</span><code>{id}</code> would be created</p>)}{result.recordsToUpdate.map((id) => <p key={id}><span>↻</span><code>{id}</code> matches a local record</p>)}{result.recordsUnchanged.map((id) => <p key={id}><span>=</span><code>{id}</code> appears unchanged</p>)}</div><div><h4>Protected waters</h4>{result.protectedFieldImpacts.length ? result.protectedFieldImpacts.map((impact) => <p key={`${impact.recordId}-${impact.fieldPath}`}><span>!</span><code>{impact.recordId}.{impact.fieldPath}</code> is protected</p>) : <p><span>✓</span>No protected fields detected.</p>}</div></div></article>}

      <div className="import-commit-bar"><div><p>End of preview</p><strong>No local data has changed.</strong></div><button type="button" disabled>Commit import — available in Tranche 13</button></div>
    </section>}
  </div>;
}

