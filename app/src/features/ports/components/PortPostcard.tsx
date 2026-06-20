import type { PortGuideData } from "../../../data/samplePortData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";
import { PortFactChips } from "./PortFactChips";

interface PortPostcardProps {
  facts: PortGuideData["facts"];
  identity: PortGuideData["identity"];
  metadata: PortGuideData["metadata"];
}

function BayMap() {
  return (
    <svg className="port-postcard__map" viewBox="0 0 720 460" aria-hidden="true">
      <path d="M-30 88c112 12 164 67 231 91 72 25 126-19 188-4 72 18 75 89 153 113 74 23 134-10 206 28" />
      <path d="M-9 244c101-24 156 4 218 49 55 40 101 67 176 48 90-22 125-96 231-86 52 5 98 27 141 50" />
      <path d="M103 5c-4 75 29 131 74 171 43 39 50 92 34 154-12 46 7 89 51 135" />
      <circle cx="447" cy="191" r="8" />
      <circle cx="447" cy="191" r="30" className="port-postcard__map-halo" />
      <text x="468" y="183">NAPOLI</text>
    </svg>
  );
}

export function PortPostcard({ facts, identity, metadata }: PortPostcardProps) {
  return (
    <CardSurface as="section" className="port-postcard" variant="paper" aria-labelledby="port-title">
      <BayMap />
      <div className="port-postcard__stamp" aria-hidden="true">
        <span>{identity.flag}</span>
        <strong>NA</strong>
        <small>Guide 01</small>
      </div>

      <div className="port-postcard__copy">
        <p className="paper-kicker">{identity.guideLabel}</p>
        <p className="port-postcard__region">{identity.region} · {identity.country}</p>
        <h1 id="port-title">{identity.name}, <em>{identity.country}</em></h1>
        <p className="port-postcard__overview">{identity.overview}</p>

        <div className="port-postcard__trust">
          <StatusChip label={metadata.reviewStatus} tone="review" />
          <ConfidenceChip level={metadata.confidence} />
        </div>
      </div>

      <PortFactChips facts={facts} />
      <p className="port-postcard__scope">{metadata.recordScope}</p>
    </CardSurface>
  );
}
