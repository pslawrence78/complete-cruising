import { sampleShorePlans } from "../../data/sampleExperienceData";
import "../experience-pages.css";
import { ShorePlanCard } from "./components/ShorePlanCard";

export function PlansPage() {
  return (
    <div className="experience-page plans-page">
      <header className="experience-hero experience-hero--plans">
        <div>
          <p className="eyebrow">Naples · sailing-specific plans</p>
          <h1>Three ways to meet <em>Naples.</em></h1>
          <p>Compare energy, weather and the journey back to the ship—not just the list of things to see.</p>
        </div>
        <aside><span>Selected balance</span><strong>5 hours</strong><p>Flexible enough for family rhythm, substantial enough to feel like an adventure.</p></aside>
      </header>
      <section className="plans-comparison" aria-labelledby="plans-title">
        <div className="experience-heading">
          <div><p className="section-kicker">Decision support</p><h2 id="plans-title">Choose the shape of the day.</h2></div>
          <p>All timings, transport assumptions and suitability notes are illustrative and unconfirmed.</p>
        </div>
        <div className="plans-comparison__grid">
          {sampleShorePlans.map((plan, index) => <ShorePlanCard key={plan.id} plan={plan} sequence={index + 1} />)}
        </div>
      </section>
    </div>
  );
}
