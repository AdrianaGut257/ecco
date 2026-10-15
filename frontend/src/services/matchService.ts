import type { Match, MatchDecision } from "../types";
import { api } from "./api";
import { MOCK_MATCH, USE_MOCKS, wait } from "./mocks";

let mockCurrent: Match | null = null;

export const matchService = {
  async getCurrent(): Promise<Match | null> {
    if (!USE_MOCKS) return api.get<Match | null>("/matches/current");
    await wait(400);
    return mockCurrent;
  },

  async find(hobbies: string[]): Promise<Match> {
    if (!USE_MOCKS) return api.post<Match>("/matches", { hobbies });
    await wait(4200);
    mockCurrent = MOCK_MATCH;
    return MOCK_MATCH;
  },

  async decide(matchId: string, decision: MatchDecision): Promise<void> {
    if (!USE_MOCKS) return api.post(`/matches/${matchId}/decision`, { decision });
    await wait(500);
    mockCurrent = null;
  },
};
