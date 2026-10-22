import type { MoodId } from "../constants/emotions";
import type { ToneId } from "../constants/tones";
import type { ChatMessage } from "../types";
import { api } from "./api";

export const chatService = {
  list: (matchId: string, after?: string) =>
    api.get<ChatMessage[]>(
      `/matches/${matchId}/messages${after ? `?after=${encodeURIComponent(after)}` : ""}`,
    ),

  send: (matchId: string, text: string, confirmed = false, tone?: ToneId | null) =>
    api.post<ChatMessage>(`/matches/${matchId}/messages`, {
      text,
      confirmed,
      tone: tone ?? null,
    }),

  react: (matchId: string, messageId: string, reaction: MoodId | null) =>
    api.put<ChatMessage>(`/matches/${matchId}/messages/${messageId}/reaction`, {
      reaction,
    }),
};
