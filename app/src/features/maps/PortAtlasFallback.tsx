import type { AtlasFallbackMetadata } from "./mapTypes";
import { mapProviderConfig } from "./mapConfig";

interface PortAtlasFallbackProps {
  metadata?: AtlasFallbackMetadata;
  reason?: "missing-coordinates" | "loading" | "unavailable";
  title: string;
}

const fallbackCopy = {
  "missing-coordinates": {
    heading: "Map position pending",
    body: "The atlas card will appear once this port has reviewed location data. Guidebook content is still available below.",
  },
  loading: {
    heading: "Preparing atlas view",
    body: "The chart is getting its bearings. Guidebook content is still available below.",
  },
  unavailable: {
    heading: "Atlas unavailable",
    body: "The guidebook is still available. Map tiles may require a connection or the selected map source may be unavailable.",
  },
} as const;

export function PortAtlasFallback({ metadata, reason = "missing-coordinates", title }: PortAtlasFallbackProps) {
  const copy = fallbackCopy[reason];
  const facts = [
    ["Port", title],
    ["Country", metadata?.country],
    ["Region", metadata?.region],
    ["Port character", metadata?.portType],
    ["Language", metadata?.language],
    ["Currency", metadata?.currency],
    ["Review", metadata?.reviewStatus],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <div className="port-atlas-fallback" role="status" aria-live={reason === "loading" ? "polite" : undefined}>
      <div className="port-atlas-fallback__compass" aria-hidden="true">
        <span>N</span>
        <i />
      </div>
      <div>
        <p className="section-kicker">Atlas pending</p>
        <h3>{copy.heading}</h3>
        <p>{copy.body}</p>
        {metadata?.locationNotes ? <p className="port-atlas-fallback__note">{metadata.locationNotes}</p> : null}
      </div>
      {facts.length ? (
        <dl>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <small>{mapProviderConfig.providerName} attribution remains visible on rendered atlas maps.</small>
    </div>
  );
}
