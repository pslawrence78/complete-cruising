import { TrustMetadataRow } from "../../components/status/TrustMetadataRow";
import { sampleMemories } from "../../data/sampleExperienceData";
import "../experience-pages.css";
import { AdventureAlmanacExportPreview } from "./components/AdventureAlmanacExportPreview";
import { MemoryCard } from "./components/MemoryCard";

export function MemoriesPage() {
  const memories = sampleMemories;
  return (
    <div className="experience-page memories-page">
      <header className="experience-hero experience-hero--memories">
        <div><p className="eyebrow">Naples · travel journal preview</p><h1>Keep the feeling, <em>not just the facts.</em></h1><p>Gentle prompts for the detail everyone will otherwise swear they could never forget.</p></div>
        <aside className="memory-status"><span>{memories.day}</span><strong>{memories.status}</strong><dl><div><dt>Would return?</dt><dd>{memories.wouldReturn}</dd></div><div><dt>Almanac</dt><dd>{memories.almanacReadiness}</dd></div></dl></aside>
      </header>
      <section aria-labelledby="memory-prompts-title">
        <div className="experience-heading"><div><p className="section-kicker">Port reflections</p><h2 id="memory-prompts-title">Five small doors back into the day.</h2></div><TrustMetadataRow metadata={memories.trust} /></div>
        <div className="memory-grid">{memories.prompts.map((memory, index) => <MemoryCard key={memory.id} memory={memory} sequence={index + 1} />)}</div>
      </section>
      <AdventureAlmanacExportPreview preview={memories.exportPreview} />
    </div>
  );
}
