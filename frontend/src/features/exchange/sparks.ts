import type { Match } from "../../types";

const HOBBY_STARTERS: Record<string, string[]> = {
  Viajes: [
    "¿Cuál es el lugar más bonito que has visitado?",
    "Si pudieras viajar mañana, ¿a dónde irías?",
  ],
  Música: [
    "¿Qué canción te está acompañando estos días?",
    "¿Hay alguna canción que te cambie el ánimo?",
  ],
  Juegos: [
    "¿A qué estás jugando últimamente?",
    "¿Cuál es el juego que más recuerdas?",
  ],
  Comida: [
    "¿Cuál es tu comida favorita para un día difícil?",
    "¿Qué plato te gustaría aprender a preparar?",
  ],
  Naturaleza: [
    "¿Tienes algún lugar al aire libre favorito?",
    "¿Prefieres montaña, río o mar?",
  ],
  Películas: [
    "¿Qué película podrías ver mil veces?",
    "¿Viste algo hace poco que te haya gustado?",
  ],
};

const INTEREST_TEMPLATES = [
  (x: string) => `Vi que te gusta ${x.toLowerCase()}. ¿Cómo empezaste?`,
  (x: string) => `¿Qué me recomendarías de ${x.toLowerCase()}?`,
];

const WARM = [
  "Gracias por escribirme hoy.",
  "Me alegra que coincidamos en esto.",
  "Qué bueno leerte. ¿Cómo va tu día?",
  "Me gustó mucho lo que contaste.",
  "Gracias por quedarte en la conversación.",
  "Aquí estoy si quieres contarme algo más.",
];

const hash = (text: string) =>
  [...text].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);

const rotate = <T,>(items: T[], seed: number) =>
  items.length === 0
    ? items
    : items.map((_, i) => items[(i + seed) % items.length]);

export function sparksFor(match: Match, hasMessages: boolean, round: number) {
  const topics = [
    ...match.hobbies.flatMap((h) => HOBBY_STARTERS[h] ?? []),
    ...match.commonInterests
      .flatMap((g) => g.items)
      .flatMap((item) => INTEREST_TEMPLATES.map((t) => t(item))),
  ];
  const seed = hash(`${match.id}:${match.day}`) + round;
  const pickedTopics = rotate(topics, seed);
  const pickedWarm = rotate(WARM, seed);

  const ideas = hasMessages
    ? [pickedWarm[0], pickedTopics[0], pickedWarm[1]]
    : [pickedTopics[0], pickedTopics[1], pickedWarm[2]];

  return [...new Set(ideas.filter(Boolean))].slice(0, 3);
}
