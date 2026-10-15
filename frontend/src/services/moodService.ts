import type { MoodId } from "../constants/emotions";
import { api } from "./api";
import { USE_MOCKS, wait } from "./mocks";

export const moodService = {
  async save(mood: MoodId): Promise<void> {
    if (!USE_MOCKS) return api.post("/moods", { mood });
    await wait(300);
  },
};
