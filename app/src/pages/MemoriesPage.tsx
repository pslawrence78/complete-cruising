import { guidebook } from "../services/guidebook";

export function MemoriesPage() {
  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">Lightweight memory layer</p>
        <h2>Daily prompts, not a heavy journal</h2>
        <p className="lede">The fresh base keeps memory capture simple and emotionally useful rather than operationally busy.</p>
      </section>

      <div className="grid grid--two">
        {guidebook.memoryPrompts.slice(0, 8).map((prompt) => (
          <article key={prompt.id} className="card">
            <p className="eyebrow">{prompt.title}</p>
            <p>{prompt.prompt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
