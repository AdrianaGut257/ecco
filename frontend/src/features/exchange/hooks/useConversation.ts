import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, friendlyError } from "../../../services/api";
import { chatService } from "../../../services/chatService";
import { matchService } from "../../../services/matchService";
import type { ChatMessage, Match } from "../../../types";

export const MAX_MESSAGE_LENGTH = 500;
const POLL_MS = 4000;

const merge = (current: ChatMessage[], incoming: ChatMessage[]) => {
  if (incoming.length === 0) return current;
  const known = new Set(current.map((m) => m.id));
  const fresh = incoming.filter((m) => !known.has(m.id));
  return fresh.length ? [...current, ...fresh] : current;
};

export function useConversation(matchId: string, initial?: Match | null) {
  const focused = useIsFocused();
  const [match, setMatch] = useState<Match | null>(initial ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const lastSeen = useRef<string | undefined>(undefined);

  const track = (list: ChatMessage[]) => {
    const sent = list.filter((m) => m.status === "sent");
    if (sent.length) lastSeen.current = sent[sent.length - 1].createdAt;
  };

  const refreshMatch = useCallback(async () => {
    setMatch(await matchService.get(matchId));
  }, [matchId]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [m, list] = await Promise.all([
        matchService.get(matchId),
        chatService.list(matchId),
      ]);
      setMatch(m);
      setMessages(list);
      track(list);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!focused || loading) return;
    const id = setInterval(async () => {
      try {
        const [m, incoming] = await Promise.all([
          matchService.get(matchId),
          chatService.list(matchId, lastSeen.current),
        ]);
        setMatch(m);
        setMessages((prev) => {
          const next = merge(prev, incoming);
          track(next);
          return next;
        });
      } catch {}
    }, POLL_MS);
    return () => clearInterval(id);
  }, [focused, loading, matchId]);

  const deliver = useCallback(
    async (draft: ChatMessage) => {
      setSendError(null);
      try {
        const saved = await chatService.send(matchId, draft.text);
        setMessages((prev) => {
          const next = prev.some((m) => m.id === saved.id)
            ? prev.filter((m) => m.id !== draft.id)
            : prev.map((m) => (m.id === draft.id ? saved : m));
          track(next);
          return next;
        });
      } catch (e) {
        const blocked = e instanceof ApiError && e.kind === "validation";
        setMessages((prev) =>
          blocked
            ? prev.filter((m) => m.id !== draft.id)
            : prev.map((m) =>
                m.id === draft.id ? { ...m, status: "failed" } : m,
              ),
        );
        if (blocked) setSendError(friendlyError(e));
      } finally {
        refreshMatch().catch(() => undefined);
      }
    },
    [matchId, refreshMatch],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || !match) return;
      const draft: ChatMessage = {
        id: `tmp-${Date.now()}`,
        matchId,
        text,
        fromMe: true,
        day: match.day,
        createdAt: new Date().toISOString(),
        status: "sending",
      };
      setMessages((prev) => [...prev, draft]);
      setMatch((m) =>
        m
          ? {
              ...m,
              messagesLeft: Math.max(m.messagesLeft - 1, 0),
              canWrite: m.messagesLeft - 1 > 0,
            }
          : m,
      );
      deliver(draft);
    },
    [match, matchId, deliver],
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

  return {
    match,
    setMatch,
    messages,
    loading,
    error,
    sendError,
    reload: load,
    send,
    retry,
  };
}
