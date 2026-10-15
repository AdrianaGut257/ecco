import { useCallback, useEffect, useState } from "react";
import { friendlyError } from "../../../services/api";
import { chatService } from "../../../services/chatService";
import type { ChatMessage } from "../../../types";

export const MAX_MESSAGE_LENGTH = 500;

export function useMessageFlow(matchId: string, day: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMessages(await chatService.list(matchId));
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const deliver = useCallback(
    async (draft: ChatMessage) => {
      try {
        const saved = await chatService.send(matchId, draft.text, day);
        setMessages((prev) => prev.map((m) => (m.id === draft.id ? saved : m)));
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.id === draft.id ? { ...m, status: "failed" } : m)),
        );
      }
    },
    [matchId, day],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text) return;
      const draft: ChatMessage = {
        id: `tmp-${Date.now()}`,
        matchId,
        text,
        fromMe: true,
        day,
        createdAt: new Date().toISOString(),
        status: "sending",
      };
      setMessages((prev) => [...prev, draft]);
      deliver(draft);
    },
    [matchId, day, deliver],
  );

  const retry = useCallback(
    (id: string) => {
      const failed = messages.find((m) => m.id === id);
      if (!failed) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "sending" } : m)),
      );
      deliver({ ...failed, status: "sending" });
    },
    [messages, deliver],
  );

  return { messages, loading, error, reload: load, send, retry };
}
