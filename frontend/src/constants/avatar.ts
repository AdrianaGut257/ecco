import type { AvatarConfig, Swatch } from "../types";

export const SKIN: Record<Swatch, string> = {
  "1": "#FBE0CC",
  "2": "#F2C1A2",
  "3": "#DDA27C",
  "4": "#B97A56",
  "5": "#8D5B3E",
  "6": "#5E3B28",
};

export const HAIR: Record<Swatch, string> = {
  "1": "#2B1D16",
  "2": "#5B3726",
  "3": "#A0623A",
  "4": "#E3B26B",
  "5": "#C9502F",
  "6": "#8E7CC3",
};

export const TOP: Record<Swatch, string> = {
  "1": "#F2AA74",
  "2": "#A9CA62",
  "3": "#9FD3E6",
  "4": "#A79BE3",
  "5": "#F7D86A",
  "6": "#E8E2DA",
};

export const BACKGROUND: Record<Swatch, string> = {
  "1": "#FBE5D4",
  "2": "#E4EFCE",
  "3": "#E1F1F7",
  "4": "#ECE8FA",
  "5": "#FDF3C8",
  "6": "#F7CBCC",
};

export const SWATCHES: Swatch[] = ["1", "2", "3", "4", "5", "6"];

export const HAIR_STYLES: { id: AvatarConfig["hair"]; label: string }[] = [
  { id: "short", label: "Corto" },
  { id: "long", label: "Largo" },
  { id: "curly", label: "Rizado" },
  { id: "bun", label: "Moño" },
  { id: "buzz", label: "Rapado" },
];

export const GLASSES: { id: AvatarConfig["glasses"]; label: string }[] = [
  { id: "none", label: "Sin lentes" },
  { id: "round", label: "Redondos" },
  { id: "square", label: "Cuadrados" },
];

export const DETAILS: {
  id: "freckles" | "mole" | "earring";
  label: string;
}[] = [
  { id: "freckles", label: "Pecas" },
  { id: "mole", label: "Lunar" },
  { id: "earring", label: "Arete" },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "2",
  hair: "short",
  hairColor: "2",
  glasses: "none",
  freckles: false,
  mole: false,
  earring: false,
  top: "1",
  background: "1",
};
