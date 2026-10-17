import type { GardenEntry } from "../types";
import { api } from "./api";

export const gardenService = {
  list: () => api.get<GardenEntry[]>("/garden"),
};
