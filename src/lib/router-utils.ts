const MORAMORA_HOME = "/moramora";

export function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get("suivant");
  return next && next.startsWith(MORAMORA_HOME) && !next.startsWith("//")
    ? next
    : MORAMORA_HOME;
}
