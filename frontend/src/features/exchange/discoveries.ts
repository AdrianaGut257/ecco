import type { Match } from "../../types";

export interface Discovery {
  title: string;
  detail: string;
}

// Coincidencias de la pareja, de la más específica a la más general: la misma película
// antes que el mismo género, y el género antes que el interés.
function allDiscoveries(match: Match): Discovery[] {
  const items = match.sharedFavorites
    .filter((f) => f.kind === "item")
    .map((f) => ({ title: `A los dos les gusta ${f.label}`, detail: f.interest }));
  const subtopics = match.sharedFavorites
    .filter((f) => f.kind === "subtopic")
    .map((f) => ({ title: `A los dos les gusta ${f.label.toLowerCase()}`, detail: f.interest }));
  const themes = new Set(match.hobbies);
  const interests = match.commonInterests.flatMap((group) =>
    group.items
      .filter((item) => !themes.has(item))
      .map((item) => ({ title: `Los dos disfrutan de ${item.toLowerCase()}`, detail: group.category })),
  );
  return [...items, ...subtopics, ...interests];
}

// Se revela una coincidencia por día de conversación.
export function discoveryFor(match: Match, day: number): Discovery | null {
  return allDiscoveries(match)[day - 1] ?? null;
}
