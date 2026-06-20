import type { sampleMemories } from "../../../data/sampleExperienceData";

export function AdventureAlmanacExportPreview({ preview }: { preview: typeof sampleMemories.exportPreview }) {
  const fields = [
    ["Sailing", preview.sailingName], ["Day or port", preview.dayOrPort],
    ["Country", preview.country], ["Ship", preview.ship],
    ["Port memory summary", preview.memorySummary],
    ["Seb learning moment", preview.sebLearningMoment],
    ["Best photo prompt", preview.bestPhotoPrompt],
  ];
  return (
    <section className="almanac-preview" aria-labelledby="almanac-title">
      <header><div><p className="paper-kicker">Adventure Almanac</p><h2 id="almanac-title">A future page in the family story.</h2></div><div className="almanac-preview__seal" aria-hidden="true">AA</div></header>
      <dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <footer><div><span>Export readiness</span><strong>{preview.readiness}</strong></div><p>Illustrative preview only. No export file is created and no memory data is persisted.</p></footer>
    </section>
  );
}
