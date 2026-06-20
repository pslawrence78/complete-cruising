import type { TodayChecklistItem } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { StatusChip } from "../../../components/status/StatusChip";

interface TakeAshoreChecklistProps {
  items: readonly TodayChecklistItem[];
}

export function TakeAshoreChecklist({ items }: TakeAshoreChecklistProps) {
  return (
    <CardSurface
      as="section"
      className="take-ashore"
      variant="glass"
      aria-labelledby="take-ashore-title"
    >
      <div className="today-card__heading">
        <div>
          <p className="section-kicker">Before the gangway</p>
          <h2 id="take-ashore-title">Take ashore</h2>
        </div>
        <StatusChip label="Checks reset on reload" tone="confirmed" />
      </div>
      <p className="take-ashore__intro">
        A practical, temporary checklist for this sample day. Nothing is saved.
      </p>
      <div className="take-ashore__grid">
        {items.map((item) => (
          <label className="take-ashore__item" key={item.id}>
            <input type="checkbox" name={item.id} />
            <span className="take-ashore__check" aria-hidden="true" />
            <span>
              <strong>{item.label}</strong>
              {item.note ? <small>{item.note}</small> : null}
            </span>
          </label>
        ))}
      </div>
    </CardSurface>
  );
}
