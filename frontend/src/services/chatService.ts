import type { ChatMessage } from "../types";
import { api } from "./api";
import { MOCK_MESSAGES, USE_MOCKS, wait } from "./mocks";

let mockStore: ChatMessage[] = [...MOCK_MESSAGES];

export const chatService = {
  async list(matchId: string): Promise<ChatMessage[]> {
    if (!USE_MOCKS) return api.get<ChatMessage[]>(`/matches/${matchId}/messages`);
    await wait(500);
    return mockStore.filter((m) => m.matchId === matchId);
  },

  async send(matchId: string, text: string, day: number): Promise<ChatMessage> {
    if (!USE_MOCKS) {
      return api.post<ChatMessage>(`/matches/${matchId}/messages`, { text });
    }
    await wait(350);
    const message: ChatMessage = {
      id: `c-${Date.now()}`,
      matchId,
      text,
      fromMe: true,
      day,
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    mockStore = [...mockStore, message];
    return message;
  },
};
