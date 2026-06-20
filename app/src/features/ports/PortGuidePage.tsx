import { samplePortData } from "../../data/samplePortData";
import { AttractionHighlightCard } from "./components/AttractionHighlightCard";
import { FamilyLensCard } from "./components/FamilyLensCard";
import { HintsWatchoutsCard } from "./components/HintsWatchoutsCard";
import { PhotoPromptCard } from "./components/PhotoPromptCard";
import { PortGuideSection } from "./components/PortGuideSection";
import { PortPostcard } from "./components/PortPostcard";
import "./PortGuidePage.css";

export function PortGuidePage() {
  return (
    <div className="port-page">
      <PortPostcard
        facts={samplePortData.facts}
        identity={samplePortData.identity}
        metadata={samplePortData.metadata}
      />

      <section className="port-practical" aria-label="Naples practical guide">
        {samplePortData.sections.slice(0, 2).map((section) => (
          <PortGuideSection key={section.id} section={section} />
        ))}
      </section>

      <section className="port-highlights" aria-labelledby="port-highlights-title">
        <div className="port-section-heading">
          <div>
            <p className="section-kicker">Separate attraction records</p>
            <h2 id="port-highlights-title">Four possible Naples stories.</h2>
          </div>
          <p>
            Illustrative ideas to compare—not a ranked plan, confirmed shortlist
            or promise of access.
          </p>
        </div>
        <div className="port-highlights__grid">
          {samplePortData.attractions.map((attraction, index) => (
            <AttractionHighlightCard attraction={attraction} index={index} key={attraction.id} />
          ))}
        </div>
      </section>

      <div className="port-page__editorial">
        <FamilyLensCard family={samplePortData.familyLens} />
        <PortGuideSection section={samplePortData.sections[2]} />
      </div>

      <div className="port-page__closing">
        <PhotoPromptCard photo={samplePortData.photoPrompt} />
        <HintsWatchoutsCard hints={samplePortData.hints} />
      </div>

      <section className="port-confidence" aria-labelledby="port-confidence-title">
        <div>
          <p className="section-kicker">Confidence and refresh state</p>
          <h2 id="port-confidence-title">Useful now. Authoritative later.</h2>
          <p>{samplePortData.caveat}</p>
        </div>
        <dl>
          <div><dt>Review</dt><dd>{samplePortData.metadata.reviewStatus}</dd></div>
          <div><dt>Refresh</dt><dd>{samplePortData.metadata.refreshStatus}</dd></div>
          <div><dt>Reviewed</dt><dd>{samplePortData.metadata.lastReviewed}</dd></div>
          <div><dt>Scope</dt><dd>{samplePortData.metadata.recordScope}</dd></div>
        </dl>
      </section>
    </div>
  );
}
