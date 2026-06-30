import { useEffect, useMemo, useState } from "react";
import { LocalDataState } from "../../components/states/LocalDataState";
import { useSailingDashboard } from "../../hooks/useLocalData";
import { commitGuidePack, createGuidePackPreview, type GuideLoaderPreviewResult, type GuideLoaderTargetRef } from "./guidePackService";
import "./GuideLoaderPage.css";

type LoaderType = "ship" | "port" | "shore_plan" | "day_guide" | "sailing";

const loaderLabels: Record<LoaderType, string> = {
  ship: "Ship guide pack",
  port: "Port guide pack",
  shore_plan: "Shore plan pack",
  day_guide: "Day guide pack",
  sailing: "Sailing guide pack",
};

const initialPreview: GuideLoaderPreviewResult = {
  status: "idle",
  summary: "Paste a guide pack to begin.",
  affectedAreas: [],
  sections: [],
  protectedFieldWarnings: [],
  technicalDetails: [],
  errors: [],
};

function buildPrompt(type: LoaderType, targetLabel: string) {
  const typeLabel = loaderLabels[type];
  return `Create one ${typeLabel.toLowerCase()} for ${targetLabel}. Return only valid JSON matching complete-cruising-guide-pack-v1. Keep it concise, cruise-useful, British English, local-first, and preserve confidence, reviewStatus and refreshRecommended metadata.`;
}

export function GuideLoaderPage() {
  const query = useSailingDashboard();
  const [loaderType, setLoaderType] = useState<LoaderType>("ship");
  const [targetId, setTargetId] = useState("");
  const [json, setJson] = useState("");
  const [preview, setPreview] = useState<GuideLoaderPreviewResult>(initialPreview);
  const [commitMessage, setCommitMessage] = useState<string>();
  const [promptMessage, setPromptMessage] = useState<string>();
  const [working, setWorking] = useState(false);

  const targetOptions = useMemo(() => {
    if (!query.data) return [];
    if (loaderType === "ship") return query.data.ship ? [{ id: query.data.ship.id, label: query.data.ship.name }] : [];
    if (loaderType === "sailing") return [{ id: query.data.sailing.id, label: query.data.sailing.name }];
    const dayOptions = query.data.itinerary.map(({ day, port }) => ({
      id: day.id,
      label: `Day ${day.dayNumber} · ${port?.name ?? day.title ?? "At sea"}`,
    }));
    if (loaderType === "day_guide" || loaderType === "shore_plan") return dayOptions;
    const seen = new Set<string>();
    return query.data.itinerary
      .filter(({ port }) => port)
      .map(({ port }) => port!)
      .filter((port) => {
        if (seen.has(port.id)) return false;
        seen.add(port.id);
        return true;
      })
      .map((port) => ({ id: port.id, label: port.name }));
  }, [loaderType, query.data]);

  useEffect(() => {
    if (!targetOptions.length) return;
    setTargetId((current) => current && targetOptions.some((option) => option.id === current) ? current : targetOptions[0].id);
    setPreview(initialPreview);
    setCommitMessage(undefined);
  }, [loaderType, targetOptions]);

  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;

  const selectedTarget = targetOptions.find((option) => option.id === targetId);
  const targetRef: GuideLoaderTargetRef | undefined = targetId
    ? { kind: loaderType, id: targetId }
    : undefined;

  const runPreview = async () => {
    setWorking(true);
    setCommitMessage(undefined);
    try {
      setPreview(await createGuidePackPreview(json, targetRef));
    } finally {
      setWorking(false);
    }
  };

  const applyGuide = async () => {
    setWorking(true);
    try {
      const result = await commitGuidePack(preview);
      setCommitMessage(result.message);
      if (result.status === "committed") {
        setPreview(initialPreview);
        setJson("");
      }
    } finally {
      setWorking(false);
    }
  };

  const copyPrompt = async (type: LoaderType) => {
    const text = buildPrompt(type, selectedTarget?.label ?? "the active target");
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      setPromptMessage(`Copied ${loaderLabels[type].toLowerCase()} prompt.`);
      return;
    }
    setPromptMessage(text);
  };

  return (
    <div className="guide-loader-page">
      <header className="guide-loader-hero">
        <div>
          <p className="eyebrow">Guide Loader</p>
          <h1>Bring guide content in without opening the whole workshop.</h1>
          <p>
            Paste one JSON guide pack, preview the visible impact, then apply it
            safely to the active sailing.
          </p>
        </div>
        <aside>
          <span>Paste first</span>
          <strong>Compact preview</strong>
          <p>Technical detail stays collapsed until you need it.</p>
        </aside>
      </header>

      <section className="guide-loader-controls">
        <div className="guide-loader-card">
          <p className="section-kicker">1 · Guide type</p>
          <div className="guide-loader-type-grid" role="radiogroup" aria-label="Guide pack type">
            {(Object.keys(loaderLabels) as LoaderType[]).map((type) => (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={loaderType === type}
                className="guide-loader-type"
                onClick={() => setLoaderType(type)}
              >
                <strong>{loaderLabels[type]}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="guide-loader-card">
          <p className="section-kicker">2 · Confirm target</p>
          <label className="guide-loader-label" htmlFor="guide-loader-target">
            Target
          </label>
          <select
            id="guide-loader-target"
            className="guide-loader-select"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value)}
          >
            {targetOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="guide-loader-input">
        <div className="guide-loader-card guide-loader-card--input">
          <div className="guide-loader-heading">
            <div>
              <p className="section-kicker">3 · Paste JSON</p>
              <h2>Guide pack</h2>
            </div>
            <button
              type="button"
              className="guide-loader-action"
              onClick={runPreview}
              disabled={!json.trim() || working}
            >
              {working ? "Checking..." : "Preview guide"}
            </button>
          </div>
          <textarea
            aria-label="Guide pack JSON"
            value={json}
            onChange={(event) => {
              setJson(event.target.value);
              setPreview(initialPreview);
              setCommitMessage(undefined);
            }}
            spellCheck={false}
            placeholder='{"schema":"complete-cruising-guide-pack-v1","schemaVersion":1,...}'
          />
        </div>

        <aside className="guide-loader-card guide-loader-card--status" aria-live="polite">
          <p className="section-kicker">4 · Preview status</p>
          <h2>{preview.status === "valid" ? "Ready to apply" : preview.status === "idle" ? "Waiting for a guide pack" : "Needs attention"}</h2>
          <p>{preview.summary}</p>
          {preview.targetLabel ? (
            <dl>
              <div>
                <dt>Target</dt>
                <dd>{preview.targetLabel}</dd>
              </div>
              <div>
                <dt>Visible in</dt>
                <dd>{preview.affectedAreas.join(", ")}</dd>
              </div>
            </dl>
          ) : null}
        </aside>
      </section>

      <section className="guide-loader-preview">
        <div className="guide-loader-heading">
          <div>
            <p className="section-kicker">5 · Compact preview</p>
            <h2>What this will touch</h2>
          </div>
          {preview.status === "valid" ? (
            <button
              type="button"
              className="guide-loader-action"
              onClick={applyGuide}
              disabled={working}
            >
              Apply to guide
            </button>
          ) : null}
        </div>

        {preview.sections.length ? (
          <div className="guide-loader-preview-grid">
            {preview.sections.map((section) => (
              <article key={section.id} className="guide-loader-preview-card">
                <p className="section-kicker">{section.sectionType}</p>
                <h3>{section.title}</h3>
                <p>{section.destination}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="guide-loader-empty">No guide sections previewed yet.</p>
        )}

        {preview.protectedFieldWarnings.length ? (
          <article className="guide-loader-warning">
            <h3>Protected-field warnings</h3>
            <ul>
              {preview.protectedFieldWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </article>
        ) : null}

        {preview.errors.length ? (
          <article className="guide-loader-warning">
            <h3>What needs fixing</h3>
            <ul>
              {preview.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </article>
        ) : null}

        <details className="guide-loader-details">
          <summary>Show technical details</summary>
          <ul>
            {preview.technicalDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </details>

        {commitMessage ? <p className="guide-loader-commit">{commitMessage}</p> : null}
      </section>

      <section className="guide-loader-prompts">
        <div className="guide-loader-heading">
          <div>
            <p className="section-kicker">Starter prompts</p>
            <h2>Copy one of these and ask for JSON only.</h2>
          </div>
          {promptMessage ? <p className="guide-loader-prompt-message">{promptMessage}</p> : null}
        </div>
        <div className="guide-loader-prompt-grid">
          {(["ship", "port", "shore_plan", "day_guide"] as LoaderType[]).map((type) => (
            <article key={type} className="guide-loader-prompt-card">
              <h3>{loaderLabels[type]}</h3>
              <p>{buildPrompt(type, selectedTarget?.label ?? "the active target")}</p>
              <button type="button" className="guide-loader-action" onClick={() => copyPrompt(type)}>
                Copy prompt
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
