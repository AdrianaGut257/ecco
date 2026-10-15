import type { GardenEntry } from "../types";
import { api } from "./api";
import { USE_MOCKS, wait } from "./mocks";

const MOCK_GARDEN: GardenEntry[] = [
  { id: "g-1", partnerName: "Lu_22", stage: 5, startedAt: "2026-08-03" },
  { id: "g-2", partnerName: "Marco", stage: 5, startedAt: "2026-08-24" },
  { id: "g-3", partnerName: "Vale", stage: 3, startedAt: "2026-09-14" },
];

export const gardenService = {
  async list(): Promise<GardenEntry[]> {
    if (!USE_MOCKS) return api.get<GardenEntry[]>("/garden");
    await wait(500);
    return MOCK_GARDEN;
  },
};
