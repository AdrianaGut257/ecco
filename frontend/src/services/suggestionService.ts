import type { Suggestion } from "../types";
import { api } from "./api";

export const suggestionService = {
  search: (q: string, interest: string) =>
    api.get<Suggestion[]>(
      `/suggestions?q=${encodeURIComponent(q)}&interest=${encodeURIComponent(interest)}`,
    ),
};
