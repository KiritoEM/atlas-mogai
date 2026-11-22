import type { AppId } from "./content";

export const appDot: Record<AppId, string> = {
  moramora: "bg-moramora",
  aiza: "bg-aiza",
  gaspika: "bg-gaspika",
};

export const heroTheme = {
  globe: "#292823",
  grid: "#b5b9ad",
  glow: "#ff8b52",
  city: "#ff5a1f",
} as const;
