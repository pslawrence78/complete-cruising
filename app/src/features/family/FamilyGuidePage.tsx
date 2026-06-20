import { TrustMetadataRow } from "../../components/status/TrustMetadataRow";
import { sampleFamilyGuide } from "../../data/sampleExperienceData";
import "../experience-pages.css";
import { SebDiscoveryCard } from "./components/SebDiscoveryCard";

export function FamilyGuidePage() {
  const guide = sampleFamilyGuide;
  return (
    <div className="experience-page family-page">
      <header className="experience-hero experience-hero--family">
        <div>
          <p className="eyebrow">Family Guide · Naples</p>
          <h1>A port to notice, <em>not just visit.</em></h1>
          <p>Small clues turn the city into a shared story: a word, a skyline, a question and something worth remembering.</p>
        </div>
        <div className="flag-tile" aria-label="Italian flag"><span>{guide.flag}</span><small>Italy</small><strong>Italia</strong></div>
        <div className="passport-stamp" aria-hidden="true"><small>Discovered</small><strong>NAP</strong><span>Family edition</span></div>
      </header>
      <section className="family-discovery-grid" aria-label="Naples family discovery guide">
        <article className="paper-discovery-card phrase-card"><p className="paper-kicker">A word to carry</p><h2>{guide.phrase.local}</h2><p>{guide.phrase.meaning}</p></article>
        <article className="paper-discovery-card map-fact-card"><p className="paper-kicker">Map fact</p><h2>Bay, city, volcano.</h2><p>{guide.geographyFact}</p></article>
        <article className="quiz-card"><p className="section-kicker">Port quiz</p><h2>{guide.quiz.question}</h2><details><summary>Reveal the answer</summary><p>{guide.quiz.answer}</p></details></article>
        <SebDiscoveryCard guide={guide} />
      </section>
      <section className="family-notes">
        <div><p className="section-kicker">Family comfort</p><h2>Leave room for the day to breathe.</h2><ul>{guide.comfortNotes.map((note) => <li key={note}>{note}</li>)}</ul></div>
        <blockquote><span>Memory prompt</span>“{guide.memoryPrompt}”</blockquote>
        <TrustMetadataRow metadata={guide.trust} />
      </section>
    </div>
  );
}
