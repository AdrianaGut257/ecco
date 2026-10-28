import type { GardenEntry, GardenMemory } from "../types";
import { api } from "./api";

export const gardenService = {
  list: () => api.get<GardenEntry[]>("/garden"),

  memory: (id: string) => api.get<GardenMemory>(`/garden/${id}`),
};
