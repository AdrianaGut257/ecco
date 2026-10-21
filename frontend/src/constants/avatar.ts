import type {
  AvatarConfig,
  AvatarKind,
  Bangs,
  Earrings,
  FacialHair,
  Glasses,
  HairStyle,
  Outfit,
  Swatch,
  TopColor,
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

// En el diseño la barba es más cálida que el cabello negro; con los demás colores, toma el mismo del cabello.
export const BEARD: Record<Swatch, string> = { ...HAIR, "1": "#411B10" };

export const TOP: Record<TopColor, string> = {
  "1": "#A5A4FF",
  "2": "#A9CA62",
  "3": "#9FD3E6",
  "4": "#F2AA74",
  "5": "#F7D86A",
  "6": "#E8E2DA",
  "7": "#214185",
  "8": "#027E7E",
  "9": "#FD4D6B",
  "10": "#9B3D35",
  "11": "#5EB2CA",
  "12": "#438EAF",
  "13": "#8FAF7E",
  "14": "#E0A93B",
  "15": "#9AA3AD",
};

// Ocho colores por grupo. Los de chico parten de los dibujos de la autora (azul marino, celeste, azul acero, verde azulado y guindo) y evitan rosas y lilas sin quedarse solo en tonos oscuros.
export const TOP_BY_KIND: Record<AvatarKind, TopColor[]> = {
  girl: ["1", "9", "4", "5", "2", "3", "8", "6"],
  boy: ["7", "12", "11", "8", "13", "14", "10", "15"],
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

export const BACKGROUND_BY_KIND: Record<AvatarKind, Swatch[]> = {
  girl: SWATCHES,
  boy: ["1", "2", "3", "4", "5"],
};

export const KINDS: { id: AvatarKind; label: string }[] = [
  { id: "girl", label: "Chica" },
  { id: "boy", label: "Chico" },
];

type Option<T> = { id: T; label: string; kind?: AvatarKind };

export const HAIR_STYLES: (Option<HairStyle> & { bangs: Bangs })[] = [
  { id: "bob", label: "Bob", bangs: "swept", kind: "girl" },
  { id: "flip", label: "Melena con puntas", bangs: "lock", kind: "girl" },
  { id: "blunt", label: "Melena recta", bangs: "straightCut", kind: "girl" },
  { id: "pixie", label: "Corto", bangs: "short", kind: "girl" },
  { id: "long", label: "Largo", bangs: "wispy", kind: "girl" },
  { id: "straight", label: "Largo recto", bangs: "choppy", kind: "girl" },
  { id: "layered", label: "Largo en capas", bangs: "full", kind: "girl" },
  { id: "volume", label: "Con volumen", bangs: "sweep", kind: "girl" },
  { id: "wavy", label: "Ondulado", bangs: "middle", kind: "girl" },
  { id: "curly", label: "Rizado", bangs: "middle", kind: "girl" },
  { id: "bun", label: "Moño", bangs: "full", kind: "girl" },
  { id: "halfBun", label: "Medio moño", bangs: "full", kind: "girl" },
  { id: "classic", label: "Clásico", bangs: "tuft", kind: "boy" },
  { id: "sidePart", label: "Raya al costado", bangs: "parted", kind: "boy" },
  { id: "fringe", label: "Con flequillo", bangs: "messyFringe", kind: "boy" },
  { id: "shortWaves", label: "Ondas", bangs: "waves", kind: "boy" },
  { id: "spiky", label: "Con puntas", bangs: "spiky", kind: "boy" },
  { id: "shaggy", label: "Revuelto", bangs: "shaggy", kind: "boy" },
  { id: "curtains", label: "Cortina", bangs: "curtains", kind: "boy" },
  { id: "quiff", label: "Tupé", bangs: "quiff", kind: "boy" },
  { id: "afro", label: "Afro", bangs: "curls", kind: "boy" },
  { id: "bald", label: "Sin cabello", bangs: "none", kind: "boy" },
];

export const BANGS: Option<Bangs>[] = [
  { id: "full", label: "Flequillo", kind: "girl" },
  { id: "straightCut", label: "Recto", kind: "girl" },
  { id: "choppy", label: "Recto en puntas", kind: "girl" },
  { id: "wispy", label: "Desfilado", kind: "girl" },
  { id: "swept", label: "De lado", kind: "girl" },
  { id: "lock", label: "Mechón", kind: "girl" },
  { id: "middle", label: "Raya al medio", kind: "girl" },
  { id: "sweep", label: "Cortina de lado", kind: "girl" },
  { id: "short", label: "Corto", kind: "girl" },
  { id: "tuft", label: "Mechón arriba", kind: "boy" },
  { id: "parted", label: "Peinado de lado", kind: "boy" },
  { id: "messyFringe", label: "Flequillo", kind: "boy" },
  { id: "sideFringe", label: "Flequillo de lado", kind: "boy" },
  { id: "waves", label: "Ondas", kind: "boy" },
  { id: "spiky", label: "Puntas", kind: "boy" },
  { id: "shaggy", label: "Revuelto", kind: "boy" },
  { id: "curtains", label: "Cortina", kind: "boy" },
  { id: "quiff", label: "Tupé", kind: "boy" },
  { id: "curls", label: "Rizos", kind: "boy" },
];

export const FACIAL_HAIR: Option<FacialHair>[] = [
  { id: "none", label: "Sin barba" },
  { id: "short", label: "Barba corta" },
  { id: "chinstrap", label: "Barba fina" },
  { id: "goatee", label: "Candado" },
  { id: "full", label: "Barba completa" },
];

export const OUTFITS: Option<Outfit>[] = [
  { id: "tee", label: "Polera", kind: "girl" },
  { id: "vneck", label: "Cuello en V", kind: "girl" },
  { id: "tank", label: "Blusa", kind: "girl" },
  { id: "strap", label: "Tirantes", kind: "girl" },
  { id: "shirt", label: "Camisa", kind: "boy" },
  { id: "tie", label: "Con corbata", kind: "boy" },
  { id: "crew", label: "Polera", kind: "boy" },
  { id: "vneckWide", label: "Cuello en V", kind: "boy" },
  { id: "raglan", label: "Raglán", kind: "boy" },
  { id: "jersey", label: "Deportiva", kind: "boy" },
  { id: "hoodie", label: "Con capucha", kind: "boy" },
];

export const forKind = <T extends { kind?: AvatarKind }>(items: T[], kind: AvatarKind) =>
  items.filter((item) => !item.kind || item.kind === kind);

export const GLASSES: Option<Glasses>[] = [
  { id: "none", label: "Sin lentes" },
  { id: "round", label: "Redondos" },
  { id: "square", label: "Cuadrados" },
  { id: "wide", label: "Rectangulares" },
];

export const EARRINGS: Option<Earrings>[] = [
  { id: "none", label: "Sin aretes" },
  { id: "hoops", label: "Argollas" },
  { id: "small", label: "Argollas pequeñas" },
  { id: "studs", label: "De botón" },
];

export const DETAILS: { id: "freckles" | "mole"; label: string }[] = [
  { id: "freckles", label: "Pecas" },
  { id: "mole", label: "Lunar" },
];

export const KIND_LOOK: Record<
  AvatarKind,
  Pick<AvatarConfig, "hair" | "bangs" | "outfit" | "top" | "facialHair" | "headband" | "earrings">
> = {
  girl: { hair: "bob", bangs: "swept", outfit: "tee", top: "1", facialHair: "none", headband: false, earrings: "none" },
  boy: { hair: "classic", bangs: "tuft", outfit: "shirt", top: "7", facialHair: "none", headband: false, earrings: "none" },
};

export const DEFAULT_AVATAR: AvatarConfig = {
  kind: "girl",
  ...KIND_LOOK.girl,
  skin: "2",
  hairColor: "1",
  glasses: "none",
  freckles: false,
  mole: false,
  background: "1",
};
