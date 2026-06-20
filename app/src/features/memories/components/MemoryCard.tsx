import type { MemoryPrompt } from "../../../data/sampleExperienceData";

export function MemoryCard({ memory, sequence }: { memory: MemoryPrompt; sequence: number }) {
  return (
    <article className="memory-card" data-tone={memory.tone}>
      <div className="memory-card__number">{String(sequence).padStart(2, "0")}</div>
      <p>{memory.label}</p>
      <h2>{memory.prompt}</h2>
      <span>{memory.response}</span>
    </article>
  );
}
