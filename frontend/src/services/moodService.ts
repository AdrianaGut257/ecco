import type { MoodId } from "../constants/emotions";
import type { MoodEntry } from "../types";
import { api } from "./api";

export const moodService = {
  save: (mood: MoodId) => api.post<MoodEntry>("/moods", { mood }),

  history: (days = 7) => api.get<MoodEntry[]>(`/moods/me?days=${days}`),
};
