import type { Ionicons } from "@expo/vector-icons";
import type { MoodId } from "./emotions";

export type ToneId =
  | "warm"
  | "joke"
  | "cheer"
  | "curious"
  | "thanks"
  | "serious";

export interface Tone {
  id: ToneId;
  label: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  border: string;
  ink: string;
  // Versión para el modo oscuro: fondo profundo, borde medio y tinta clara (también pasan WCAG AA).
  dark: { bg: string; border: string; ink: string };
}

// Tintes claros con texto oscuro: todos pasan WCAG AA sobre su fondo.
export const TONES: Tone[] = [
  {
    id: "warm",
    label: "Con cariño",
    hint: "con cariño",
    icon: "heart",
    bg: "#FCEEEE",
    border: "#F7CBCC",
    ink: "#893437",
    dark: { bg: "#3A2224", border: "#8E4A4F", ink: "#F6B8BB" },
  },
  {
    id: "joke",
    label: "En broma",
    hint: "en broma",
    icon: "happy",
    bg: "#FFF8DA",
    border: "#F7D86A",
    ink: "#6D4D34",
    dark: { bg: "#352E19", border: "#857034", ink: "#F3DC8A" },
  },
  {
    id: "cheer",
    label: "Para animarte",
    hint: "para animar",
    icon: "sunny",
    bg: "#F2F7E7",
    border: "#C9DE9E",
    ink: "#4C5B2C",
    dark: { bg: "#26311C", border: "#5E7A36", ink: "#CFE3A3" },
  },
  {
    id: "curious",
    label: "Con curiosidad",
    hint: "con curiosidad",
    icon: "help-circle",
    bg: "#F1F8FB",
    border: "#BFE2EF",
    ink: "#485F68",
    dark: { bg: "#1D2D35", border: "#4C7486", ink: "#B9DDEB" },
  },
  {
    id: "thanks",
    label: "Con gratitud",
    hint: "para agradecer",
    icon: "flower",
    bg: "#FDF2EA",
    border: "#F5C7A3",
    ink: "#6D4D34",
    dark: { bg: "#382A20", border: "#8A5E3E", ink: "#F4C6A0" },
  },
  {
    id: "serious",
    label: "En serio",
    hint: "en serio",
    icon: "chatbox-ellipses",
    bg: "#F1EEFB",
    border: "#D3CBF3",
    ink: "#4B3F8A",
    dark: { bg: "#2A2540", border: "#6B5EA8", ink: "#CFC6F5" },
  },
];

export const toneById = (id?: ToneId | null) => TONES.find((t) => t.id === id);

// El tono con los colores del modo activo.
export const themedTone = (tone: Tone, dark: boolean): Tone => (dark ? { ...tone, ...tone.dark } : tone);

export const REACTIONS: { id: MoodId; label: string }[] = [
  { id: "feliz", label: "Me alegra" },
  { id: "bien", label: "Me gusta" },
  { id: "normal", label: "Entiendo" },
  { id: "mal", label: "Lo siento" },
  { id: "fatal", label: "Te abrazo" },
];

export const reactionLabel = (id?: MoodId | null) =>
  REACTIONS.find((r) => r.id === id)?.label;
