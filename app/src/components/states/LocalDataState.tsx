type StateKind = "loading" | "empty" | "error";

const copy: Record<StateKind, { eyebrow: string; title: string; message: string }> = {
  loading: { eyebrow: "Local voyage library", title: "Opening the guidebook...", message: "Reading the sailing records held on this device." },
  empty: { eyebrow: "Local voyage library", title: "Guide pending.", message: "This section is ready for its first cruise-relevant guidebook layer." },
  error: { eyebrow: "Local voyage library", title: "The guidebook could not be opened.", message: "Your local records have not been changed. Try reopening this screen." },
};

export function LocalDataState({ kind, detail }: { kind: StateKind; detail?: string }) {
  const state = copy[kind];
  return (
    <section className={`local-data-state local-data-state--${kind}`} role={kind === "error" ? "alert" : "status"}>
      <p className="section-kicker">{state.eyebrow}</p>
      <h1>{state.title}</h1>
      <p>{detail ?? state.message}</p>
    </section>
  );
}
