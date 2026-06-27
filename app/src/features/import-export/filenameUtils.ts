export function safeFilenamePart(value: string | undefined, fallback = "export") {
  const safe = (value ?? fallback)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return safe || fallback;
}

export function exportDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
