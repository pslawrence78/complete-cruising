import type { TodayData } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";

interface SebDiscoveryPreviewProps {
  local: TodayData["local"];
  sebDiscovery: TodayData["sebDiscovery"];
}

export function SebDiscoveryPreview({
  local,
  sebDiscovery,
}: SebDiscoveryPreviewProps) {
  return (
    <CardSurface as="aside" className="seb-discovery" variant="paper" aria-labelledby="seb-discovery-title">
      <div className="seb-discovery__stamp" aria-hidden="true">Napoli</div>
      <p className="paper-kicker">Seb discovery</p>
      <h2 id="seb-discovery-title">One thing to spot ashore.</h2>
      <p className="seb-discovery__prompt">{sebDiscovery.prompt}</p>

      <dl className="seb-discovery__local">
        <div>
          <dt>Language</dt>
          <dd>{local.language}</dd>
        </div>
        <div>
          <dt>Currency</dt>
          <dd>{local.currency}</dd>
        </div>
      </dl>

      <div className="seb-discovery__phrase">
        <span>Try saying</span>
        <strong>{local.phrase}</strong>
        <small>{local.phraseMeaning}</small>
      </div>

      <div className="seb-discovery__notes">
        <p><strong>Quick fact</strong>{sebDiscovery.fact}</p>
        <p><strong>Photo prompt</strong>{sebDiscovery.photoPrompt}</p>
      </div>
      <ConfidenceChip label="Illustrative discovery prompt" level="medium" />
    </CardSurface>
  );
}
