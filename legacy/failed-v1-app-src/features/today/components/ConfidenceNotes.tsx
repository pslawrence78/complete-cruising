import type { TodayConfidenceNote } from "../../../data/sampleTodayData";
import { CardSurface } from "../../../components/surfaces/CardSurface";
import { ConfidenceChip } from "../../../components/status/ConfidenceChip";
import { StatusChip } from "../../../components/status/StatusChip";

interface ConfidenceNotesProps {
  notes: readonly TodayConfidenceNote[];
}

export function ConfidenceNotes({ notes }: ConfidenceNotesProps) {
  return (
    <CardSurface
      as="section"
      className="confidence-notes"
      variant="glass"
      aria-labelledby="confidence-notes-title"
    >
      <div className="today-card__heading">
        <div>
          <p className="section-kicker">Before relying on Today</p>
          <h2 id="confidence-notes-title">Confidence and refresh notes</h2>
        </div>
        <ConfidenceChip level="medium" />
      </div>

      <div className="confidence-notes__grid">
        {notes.map((note) => (
          <article className="confidence-note" key={note.id}>
            <h3>{note.label}</h3>
            <p>{note.description}</p>
            <div className="today-card__metadata">
              <StatusChip label={note.status.label} tone={note.status.tone} />
              <ConfidenceChip
                label={note.confidence.label}
                level={note.confidence.level}
              />
            </div>
          </article>
        ))}
      </div>
    </CardSurface>
  );
}
