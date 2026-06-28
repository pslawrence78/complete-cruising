import { LocalDataState } from "../../components/states/LocalDataState";
import { mapPortGuide } from "../../data/viewModelMappers";
import { usePortGuide, useSailingDashboard } from "../../hooks/useLocalData";
import { useMemo } from "react";
import { PortAtlasMap } from "../maps/PortAtlasMap";
import { getAtlasSummary } from "../maps/mapUtils";
import { AttractionHighlightCard } from "./components/AttractionHighlightCard";
import { FamilyLensCard } from "./components/FamilyLensCard";
import { HintsWatchoutsCard } from "./components/HintsWatchoutsCard";
import { PhotoPromptCard } from "./components/PhotoPromptCard";
import { PortGuideSection } from "./components/PortGuideSection";
import { PortPostcard } from "./components/PortPostcard";
import { buildAtlasCaption, buildPortFallbackMetadata, buildVoyageAtlasPoints } from "./portAtlasViewModel";
import "./PortGuidePage.css";

export function PortGuidePage() {
  const query = usePortGuide();
  const sailingQuery = useSailingDashboard();
  const atlasPoints = useMemo(
    () => sailingQuery.data ? buildVoyageAtlasPoints(sailingQuery.data.itinerary) : [],
    [sailingQuery.data],
  );
  if (query.loading || sailingQuery.loading) return <LocalDataState kind="loading" />;
  if (query.error || sailingQuery.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  const port = mapPortGuide(query.data);
  if (!port) return <LocalDataState kind="empty" detail="The selected day does not have a local port guide yet." />;
  const selectedPointId = "day" in query.data && query.data.day ? query.data.day.id : undefined;
  const fallbackMetadata = "guide" in query.data ? buildPortFallbackMetadata(query.data.guide?.port, query.data.guide?.country) : undefined;
  const atlasSummary = getAtlasSummary(atlasPoints);
  return (
    <div className="port-page">
      <PortPostcard
        facts={port.facts}
        identity={port.identity}
        metadata={port.metadata}
      />

      <div className="port-page__atlas">
        <PortAtlasMap
          caption={buildAtlasCaption(atlasSummary.missingCount)}
          fallbackMetadata={fallbackMetadata}
          mode="overview"
          points={atlasPoints}
          selectedPointId={selectedPointId}
          title="Cartographic Port Atlas"
        />
      </div>

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
        <PortAtlasMap
          caption="Where this port sits. Approximate port area, not exact terminal."
          fallbackMetadata={fallbackMetadata}
          interaction="curated"
          mode="single-port"
          points={atlasPoints.filter((point) => point.id === selectedPointId)}
          selectedPointId={selectedPointId}
          title={`Where ${port.identity.name} sits`}
        />
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
