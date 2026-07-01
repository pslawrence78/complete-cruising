import { guidebook } from "../services/guidebook";

export function AboutPage() {
  return (
    <div className="page">
      <section className="card card--hero-soft">
        <p className="eyebrow">About this guide</p>
        <h2>Static, local-first and cruise-stable</h2>
        <p className="lede">This branch is intended to stay attached to the live cruise period, so the app favours clarity and reliability over platform ambition.</p>
      </section>

      <div className="grid grid--two">
        <article className="card">
          <p className="eyebrow">Version</p>
          <h3>{guidebook.product.version}</h3>
          <p>{guidebook.product.status}</p>
          <p className="supporting-copy">Branch: {guidebook.product.branch}</p>
        </article>
        <article className="card">
          <p className="eyebrow">Static status</p>
          <h3>Static guidebook shell</h3>
          <p>No backend, no authentication, no paid APIs, no import workbench and no backstage runtime.</p>
          <p className="supporting-copy">Confirm against Princess and booking documents before relying on live operational detail.</p>
        </article>
      </div>
    </div>
  );
}
