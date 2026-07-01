import type { ReactNode } from "react";

interface CruiseMapCardProps {
  attribution?: ReactNode;
  caption?: string;
  children: ReactNode;
  className?: string;
  description?: string;
  eyebrow?: string;
  title: string;
}

export function CruiseMapCard({
  attribution,
  caption,
  children,
  className = "",
  description,
  eyebrow = "Port atlas",
  title,
}: CruiseMapCardProps) {
  return (
    <section className={`cruise-map-card ${className}`.trim()} aria-label={description ?? title}>
      <div className="cruise-map-card__chrome" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="cruise-map-card__header">
        <div>
          <p className="section-kicker">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {caption ? <p>{caption}</p> : null}
      </div>
      <div className="cruise-map-card__viewport">{children}</div>
      {attribution ? <div className="cruise-map-card__attribution">{attribution}</div> : null}
    </section>
  );
}
