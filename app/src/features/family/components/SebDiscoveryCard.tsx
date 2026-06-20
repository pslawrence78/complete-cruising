import { TrustMetadataRow } from "../../../components/status/TrustMetadataRow";
import type { sampleFamilyGuide } from "../../../data/sampleExperienceData";

export function SebDiscoveryCard({ guide }: { guide: typeof sampleFamilyGuide }) {
  return (
    <article className="seb-discovery-card">
      <div className="seb-discovery-card__orbit" aria-hidden="true"><span>01</span></div>
      <p className="section-kicker">Seb’s Discovery</p>
      <h2>Read the landscape.</h2>
      <p>{guide.sebChallenge}</p>
      <div className="seb-discovery-card__spot"><span>Thing to spot</span><strong>{guide.thingToSpot}</strong></div>
      <TrustMetadataRow metadata={guide.trust} />
    </article>
  );
}
