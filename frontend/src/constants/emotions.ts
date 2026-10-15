export type MoodId = "fatal" | "mal" | "normal" | "bien" | "feliz";

export interface Mood {
  id: MoodId;
  label: string;
  value: number;
  bgClass: string;
}

export const MOODS: Mood[] = [
  { id: "fatal", label: "Fatal", value: 1, bgClass: "bg-mood-fatal" },
  { id: "mal", label: "Mal", value: 2, bgClass: "bg-mood-mal" },
  { id: "normal", label: "Normal", value: 3, bgClass: "bg-mood-normal" },
  { id: "bien", label: "Bien", value: 4, bgClass: "bg-mood-bien" },
  { id: "feliz", label: "Feliz", value: 5, bgClass: "bg-mood-feliz" },
];

export const MOOD_REPLIES: Record<MoodId, string> = {
  fatal: "Gracias por contarlo. Aquí no hay prisa, ve a tu ritmo.",
  mal: "Los días difíciles también pasan. Estás en un lugar tranquilo.",
  normal: "Un día tranquilo también vale. Cuida de ti.",
  bien: "Qué bueno saberlo. Que siga así.",
  feliz: "Nos alegra mucho. Tu alegría hace crecer el jardín.",
};
