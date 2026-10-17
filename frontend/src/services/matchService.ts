import type {
  Match,
  MatchDecision,
  ReportReason,
  SearchState,
} from "../types";
import { api } from "./api";

export const matchService = {
  current: () => api.get<Match | null>("/matches/current"),

  get: (matchId: string) => api.get<Match>(`/matches/${matchId}`),

  startSearch: (hobbies: string[]) =>
    api.post<SearchState>("/matches", { hobbies }),

  searchState: () => api.get<SearchState>("/matches/search"),

  cancelSearch: () => api.delete<void>("/matches/search"),

  decide: (matchId: string, decision: MatchDecision) =>
    api.post<Match>(`/matches/${matchId}/decision`, { decision }),

  end: (matchId: string, reason?: ReportReason, note?: string) =>
    api.post<void>(`/matches/${matchId}/end`, {
      reason: reason ?? null,
      note: note ?? null,
    }),
};
