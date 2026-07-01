import type { PortGuideData } from "../../../data/samplePortData";

interface PortFactChipsProps {
  facts: PortGuideData["facts"];
}

export function PortFactChips({ facts }: PortFactChipsProps) {
  return (
    <dl className="port-fact-chips" aria-label="Illustrative Naples facts">
      {facts.map((fact) => (
        <div className="port-fact-chip" key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}
