import type { DashboardStatusCard } from "../../../data/sampleDashboardData";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";
import { FamilyFocusCard } from "./FamilyFocusCard";
import { NextPortCard } from "./NextPortCard";
import { VoyageStatusCard } from "./VoyageStatusCard";

interface VoyageStatusGridProps {
  items: readonly DashboardStatusCard[];
}

export function VoyageStatusGrid({ items }: VoyageStatusGridProps) {
  return (
    <section className="voyage-status" aria-labelledby="voyage-status-title">
      <div className="dashboard-section-heading">
        <div>
          <p className="section-kicker">Voyage intelligence</p>
          <h2 id="voyage-status-title">
            A richer layer over the cruise booking.
          </h2>
          <p>
            Readiness, refresh status and family focus stay concise, visible
            and calm—never spreadsheet-like.
          </p>
        </div>
        <div className="dashboard-section-heading__legend" aria-label="Dashboard trust legend">
          <StatusChip label="Reviewed" tone="confirmed" />
          <StatusChip label="Needs review" tone="review" />
          <ConfidenceChip level="medium" />
        </div>
      </div>

      <div className="voyage-status__grid">
        {items.map((item, index) => {
          if (item.id === "next-port") {
            return <NextPortCard item={item} key={item.id} />;
          }

          if (item.id === "family") {
            return <FamilyFocusCard item={item} key={item.id} />;
          }

          return (
            <VoyageStatusCard
              item={item}
              key={item.id}
              sequence={index + 1}
            />
          );
        })}
      </div>
    </section>
  );
}
