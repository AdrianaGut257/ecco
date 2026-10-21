import type {
  AvatarConfig,
  Bangs,
  Earrings,
  Glasses,
  HairStyle,
  Outfit,
  Swatch,
} from "../types";

export interface SkinTone {
  base: string;
  blush: string;
  line: string;
  mouth: string;
}

// 1–4 son los tonos de assets/svg/avatars/base/skinTones.svg; 5 y 6 amplían la gama hacia tonos más profundos.
export const SKIN: Record<Swatch, SkinTone> = {
  "1": { base: "#FFD5CD", blush: "#FA9983", line: "#FFC2B7", mouth: "#E0786A" },
  "2": { base: "#FECD9C", blush: "#FD9979", line: "#FFB770", mouth: "#D9734F" },
  "3": { base: "#E1AB79", blush: "#D69170", line: "#DD9A5C", mouth: "#A85C3C" },
  "4": { base: "#A47A51", blush: "#AF6752", line: "#A16327", mouth: "#5E3420" },
  "5": { base: "#7B5034", blush: "#8C4A3A", line: "#6B3E22", mouth: "#3A2014" },
  "6": { base: "#553423", blush: "#6B3527", line: "#452717", mouth: "#24130B" },
};

export const SKIN_SWATCH = Object.fromEntries(
  Object.entries(SKIN).map(([id, tone]) => [id, tone.base]),
) as Record<Swatch, string>;

export const HAIR: Record<Swatch, string> = {
  "1": "#22160E",
  "2": "#5B3726",
  "3": "#A0623A",
  "4": "#E3B26B",
  "5": "#C9502F",
  "6": "#8E7CC3",
};

export const TOP: Record<Swatch, string> = {
  "1": "#A5A4FF",
  "2": "#A9CA62",
  "3": "#9FD3E6",
  "4": "#F2AA74",
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

export const HAIR_STYLES: { id: HairStyle; label: string; bangs: Bangs }[] = [
  { id: "bob", label: "Bob", bangs: "swept" },
  { id: "flip", label: "Melena con puntas", bangs: "lock" },
  { id: "blunt", label: "Melena recta", bangs: "straightCut" },
  { id: "pixie", label: "Corto", bangs: "short" },
  { id: "long", label: "Largo", bangs: "wispy" },
  { id: "straight", label: "Largo recto", bangs: "choppy" },
  { id: "layered", label: "Largo en capas", bangs: "full" },
  { id: "volume", label: "Con volumen", bangs: "sweep" },
  { id: "wavy", label: "Ondulado", bangs: "middle" },
  { id: "curly", label: "Rizado", bangs: "middle" },
  { id: "bun", label: "Moño", bangs: "full" },
  { id: "halfBun", label: "Medio moño", bangs: "full" },
];

export const BANGS: { id: Bangs; label: string }[] = [
  { id: "full", label: "Flequillo" },
  { id: "straightCut", label: "Recto" },
  { id: "choppy", label: "Recto en puntas" },
  { id: "wispy", label: "Desfilado" },
  { id: "swept", label: "De lado" },
  { id: "lock", label: "Mechón" },
  { id: "middle", label: "Raya al medio" },
  { id: "sweep", label: "Cortina de lado" },
  { id: "short", label: "Corto" },
];

export const OUTFITS: { id: Outfit; label: string }[] = [
  { id: "tee", label: "Polera" },
  { id: "vneck", label: "Cuello en V" },
  { id: "tank", label: "Blusa" },
  { id: "strap", label: "Tirantes" },
];

export const GLASSES: { id: Glasses; label: string }[] = [
  { id: "none", label: "Sin lentes" },
  { id: "round", label: "Redondos" },
  { id: "square", label: "Cuadrados" },
  { id: "wide", label: "Rectangulares" },
];

export const EARRINGS: { id: Earrings; label: string }[] = [
  { id: "none", label: "Sin aretes" },
  { id: "hoops", label: "Argollas" },
  { id: "small", label: "Argollas pequeñas" },
  { id: "studs", label: "De botón" },
];

export const DETAILS: { id: "freckles" | "mole"; label: string }[] = [
  { id: "freckles", label: "Pecas" },
  { id: "mole", label: "Lunar" },
];

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "2",
  hair: "bob",
  bangs: "swept",
  hairColor: "1",
  glasses: "none",
  earrings: "none",
  headband: false,
  freckles: false,
  mole: false,
  outfit: "tee",
  top: "1",
  background: "1",
};
