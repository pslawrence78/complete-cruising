import { LocalDataState } from "../../components/states/LocalDataState";
import { mapPortGuide } from "../../data/viewModelMappers";
import { usePortGuide } from "../../hooks/useLocalData";
import { AttractionHighlightCard } from "./components/AttractionHighlightCard";
import { FamilyLensCard } from "./components/FamilyLensCard";
import { HintsWatchoutsCard } from "./components/HintsWatchoutsCard";
import { PhotoPromptCard } from "./components/PhotoPromptCard";
import { PortGuideSection } from "./components/PortGuideSection";
import { PortPostcard } from "./components/PortPostcard";
import "./PortGuidePage.css";

export function PortGuidePage() {
  const query = usePortGuide();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const port = mapPortGuide(query.data);
  if (!port) return <LocalDataState kind="empty" detail="The selected day does not have a local port guide yet." />;
  return (
    <div className="port-page">
      <PortPostcard
        facts={port.facts}
        identity={port.identity}
        metadata={port.metadata}
      />

      <section className="port-practical" aria-label="Port practical guide">
        {port.sections.slice(0, 2).map((section) => (
          <PortGuideSection key={section.id} section={section} />
        ))}
      </section>

      <section className="port-highlights" aria-labelledby="port-highlights-title">
        <div className="port-section-heading">
          <div>
            <p className="section-kicker">Guidebook highlights</p>
            <h2 id="port-highlights-title">Possible port-day stories.</h2>
          </div>
          <p>
            Short ideas to compare, not a ranked plan, confirmed shortlist or
            promise of access.
          </p>
        </div>
        <div className="port-highlights__grid">
          {port.attractions.map((attraction, index) => (
            <AttractionHighlightCard attraction={attraction} index={index} key={attraction.id} />
          ))}
        </div>
      </section>

      <div className="port-page__editorial">
        <FamilyLensCard family={port.familyLens} />
        <PortGuideSection section={port.sections[2]} />
      </div>

      <div className="port-page__closing">
        <PhotoPromptCard photo={port.photoPrompt} />
        <HintsWatchoutsCard hints={port.hints} />
      </div>

      <section className="port-confidence" aria-labelledby="port-confidence-title">
        <div>
          <p className="section-kicker">Confidence and refresh state</p>
          <h2 id="port-confidence-title">Useful now. Authoritative later.</h2>
          <p>{port.caveat}</p>
        </div>
        <dl>
          <div><dt>Review</dt><dd>{port.metadata.reviewStatus}</dd></div>
          <div><dt>Refresh</dt><dd>{port.metadata.refreshStatus}</dd></div>
          <div><dt>Reviewed</dt><dd>{port.metadata.lastReviewed}</dd></div>
          <div><dt>Scope</dt><dd>{port.metadata.recordScope}</dd></div>
        </dl>
      </section>
    </div>
  );
}
