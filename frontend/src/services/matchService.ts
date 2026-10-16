import type { Match, MatchDecision } from "../types";
import { ApiError, api } from "./api";
import { MOCK_MATCH, USE_MOCKS, wait } from "./mocks";

interface SearchState {
  status: "idle" | "searching" | "matched";
  match: Match | null;
}

let mockCurrent: Match | null = null;

export const matchService = {
  async getCurrent(): Promise<Match | null> {
    if (!USE_MOCKS) return api.get<Match | null>("/matches/current");
    await wait(400);
    return mockCurrent;
  },

  async find(hobbies: string[]): Promise<Match> {
    if (USE_MOCKS) {
      await wait(4200);
      mockCurrent = MOCK_MATCH;
      return MOCK_MATCH;
    }

    let state = await api.post<SearchState>("/matches", { hobbies });
    while (state.status !== "matched") {
      if (state.status === "idle") {
        throw new ApiError(
          "notFound",
          "La búsqueda terminó. Intenta de nuevo.",
        );
      }
      await wait(2500);
      state = await api.get<SearchState>("/matches/search");
    }
    return state.match as Match;
  },

  async cancel(): Promise<void> {
    if (!USE_MOCKS) await api.delete("/matches/search");
  },

  async decide(matchId: string, decision: MatchDecision): Promise<void> {
    if (!USE_MOCKS)
      return api.post(`/matches/${matchId}/decision`, { decision });
    await wait(500);
    mockCurrent = null;
  },
};
