import { LocalDataState } from "../../components/states/LocalDataState";
import { mapShorePlans } from "../../data/viewModelMappers";
import { useTodayGuide } from "../../hooks/useLocalData";
import "../experience-pages.css";
import { ShorePlanCard } from "./components/ShorePlanCard";

export function PlansPage() {
  const query = useTodayGuide();
  if (query.loading) return <LocalDataState kind="loading" />;
  if (query.error) return <LocalDataState kind="error" />;
  if (!query.data) return <LocalDataState kind="empty" />;
  if (!("plans" in query.data) || !query.data.plans?.length) return <LocalDataState kind="empty" detail="No local shore plans have been prepared for the selected day." />;
  const plans = mapShorePlans(query.data.plans);
  const place = query.data.port?.name ?? query.data.day?.title ?? "the port";
  const selected = plans.find((plan) => plan.selected);
  return (
    <div className="experience-page plans-page">
      <header className="experience-hero experience-hero--plans">
        <div>
          <p className="eyebrow">{place} · sailing-specific plans</p>
          <h1>{plans.length} ways to meet <em>{place}.</em></h1>
          <p>Compare energy, weather and the journey back to the ship—not just the list of things to see.</p>
        </div>
        <aside><span>Selected balance</span><strong>{selected?.duration ?? "Not selected"}</strong><p>{selected?.summary ?? "Choose a local plan when the family is ready."}</p></aside>
      </header>
      <section className="plans-comparison" aria-labelledby="plans-title">
        <div className="experience-heading">
          <div><p className="section-kicker">Decision support</p><h2 id="plans-title">Choose the shape of the day.</h2></div>
          <p>All timings, transport assumptions and suitability notes are illustrative and unconfirmed.</p>
        </div>
        <div className="plans-comparison__grid">
          {plans.map((plan, index) => <ShorePlanCard key={plan.id} plan={plan} sequence={index + 1} />)}
        </div>
      </section>
    </div>
  );
}
