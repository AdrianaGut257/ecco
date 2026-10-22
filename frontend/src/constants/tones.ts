import type { Ionicons } from "@expo/vector-icons";
import type { MoodId } from "./emotions";

export type ToneId = "warm" | "joke" | "cheer" | "curious" | "thanks" | "serious";

export interface Tone {
  id: ToneId;
  label: string;
  // Completa "Escribe algo …" en el campo de texto.
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  border: string;
  ink: string;
}

// Tintes claros con texto oscuro: todos pasan WCAG AA sobre su fondo.
export const TONES: Tone[] = [
  { id: "warm", label: "Con cariño", hint: "con cariño", icon: "heart", bg: "#FCEEEE", border: "#F7CBCC", ink: "#893437" },
  { id: "joke", label: "En broma", hint: "en broma", icon: "happy", bg: "#FFF8DA", border: "#F7D86A", ink: "#6D4D34" },
  { id: "cheer", label: "Para animarte", hint: "para animar", icon: "sunny", bg: "#F2F7E7", border: "#C9DE9E", ink: "#4C5B2C" },
  { id: "curious", label: "Con curiosidad", hint: "con curiosidad", icon: "help-circle", bg: "#F1F8FB", border: "#BFE2EF", ink: "#485F68" },
  { id: "thanks", label: "Con gratitud", hint: "para agradecer", icon: "flower", bg: "#FDF2EA", border: "#F5C7A3", ink: "#6D4D34" },
  { id: "serious", label: "En serio", hint: "en serio", icon: "chatbox-ellipses", bg: "#F1EEFB", border: "#D3CBF3", ink: "#4B3F8A" },
];

export const toneById = (id?: ToneId | null) => TONES.find((t) => t.id === id);

// Las reacciones usan las caras de ánimo de la autora, con un sentido de respuesta empática.
export const REACTIONS: { id: MoodId; label: string }[] = [
  { id: "feliz", label: "Me alegra" },
  { id: "bien", label: "Me gusta" },
  { id: "normal", label: "Entiendo" },
  { id: "mal", label: "Lo siento" },
  { id: "fatal", label: "Te abrazo" },
];

export const reactionLabel = (id?: MoodId | null) =>
  REACTIONS.find((r) => r.id === id)?.label;
