import { INTEREST_CATEGORIES } from "../../constants/interests";
import type { Match } from "../../types";

const CATEGORY_STARTERS: Record<string, string[]> = {
  Entretenimiento: [
    "¿Qué podrías ver o jugar mil veces sin cansarte?",
    "¿Descubriste algo hace poco que te haya gustado?",
  ],
  Música: [
    "¿Qué canción te está acompañando estos días?",
    "¿Hay alguna canción que te cambie el ánimo?",
  ],
  Cultura: [
    "¿Qué tema podrías escuchar horas sin aburrirte?",
    "¿Hay algún libro, obra o lugar que te haya marcado?",
  ],
  "Cocina y gastronomía": [
    "¿Cuál es tu comida favorita para un día difícil?",
    "¿Qué plato te gustaría aprender a preparar?",
  ],
  Bebidas: [
    "¿Cuál es tu bebida favorita para empezar el día?",
    "¿Tienes algún lugar favorito para tomar algo?",
  ],
  Deportes: [
    "¿Cómo empezaste a practicarlo o a seguirlo?",
    "¿Cuál es el mejor momento deportivo que recuerdas?",
  ],
  "Actividades al aire libre": [
    "¿Tienes algún lugar al aire libre favorito?",
    "¿Prefieres montaña, río o mar?",
  ],
  "Estilo de vida": [
    "¿Qué pequeña cosa hace que tu día sea mejor?",
    "Si pudieras viajar mañana, ¿a dónde irías?",
  ],
  Bienestar: [
    "¿Qué haces para cuidarte cuando el día pesa?",
    "¿Hay algún hábito que te haya hecho bien?",
  ],
  Creatividad: [
    "¿Qué es lo último que creaste y te hizo sentir orgullo?",
    "¿Dónde encuentras inspiración?",
  ],
  "Social y comunidad": [
    "¿Qué es lo que más valoras en una amistad?",
    "¿Hay alguna causa o grupo que te importe mucho?",
  ],
};

const CATEGORY_OF = new Map(
  INTEREST_CATEGORIES.flatMap((c) => c.items.map((item) => [item, c.title])),
);

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
  const favorites = match.sharedFavorites.map((f) =>
    f.kind === "item"
      ? `¡A los dos nos gusta ${f.label}! ¿Qué es lo que más te gusta?`
      : `Vi que también te gusta ${f.label.toLowerCase()} en ${f.interest.toLowerCase()}. ¿Qué me recomiendas?`,
  );
  const topics = [
    ...favorites,
    ...match.hobbies.flatMap((h) => INTEREST_TEMPLATES.map((t) => t(h))),
    ...[...new Set(match.hobbies.map((h) => CATEGORY_OF.get(h)))].flatMap(
      (c) => (c ? (CATEGORY_STARTERS[c] ?? []) : []),
    ),
    ...match.commonInterests
      .flatMap((g) => g.items)
      .flatMap((item) => INTEREST_TEMPLATES.map((t) => t(item))),
  ];
  const seed = hash(`${match.id}:${match.day}`) + round;
  const pickedTopics = favorites.length && !hasMessages
    ? [...rotate(favorites, seed), ...rotate(topics, seed)]
    : rotate(topics, seed);
  const pickedWarm = rotate(WARM, seed);

  const ideas = hasMessages
    ? [pickedWarm[0], pickedTopics[0], pickedWarm[1]]
    : [pickedTopics[0], pickedTopics[1], pickedWarm[2]];

  return [...new Set(ideas.filter(Boolean))].slice(0, 3);
}
