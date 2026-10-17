import type { ChatMessage } from "../types";
import { api } from "./api";

export const chatService = {
  list: (matchId: string, after?: string) =>
    api.get<ChatMessage[]>(
      `/matches/${matchId}/messages${after ? `?after=${encodeURIComponent(after)}` : ""}`,
    ),

  send: (matchId: string, text: string) =>
    api.post<ChatMessage>(`/matches/${matchId}/messages`, { text }),
};
