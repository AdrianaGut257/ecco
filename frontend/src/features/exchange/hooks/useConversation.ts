import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, friendlyError } from "../../../services/api";
import { chatService } from "../../../services/chatService";
import { matchService } from "../../../services/matchService";
import type { MoodId } from "../../../constants/emotions";
import type { ToneId } from "../../../constants/tones";
import type { ChatMessage, Match } from "../../../types";

export const MAX_MESSAGE_LENGTH = 500;

export type SendOutcome =
  | { kind: "sent" }
  | { kind: "failed" }
  | { kind: "review"; message: string }
  | { kind: "blocked"; message: string };
const POLL_MS = 4000;

// Los mensajes que ya están se reemplazan (pudo cambiar su reacción) y los nuevos se agregan al final.
const merge = (
  current: ChatMessage[],
  incoming: ChatMessage[],
  pending: Set<string>,
) => {
  if (incoming.length === 0) return current;
  const byId = new Map(incoming.map((m) => [m.id, m]));
  const known = new Set(current.map((m) => m.id));
  const updated = current.map((m) => {
    const next = byId.get(m.id);
    return next && !pending.has(m.id) ? { ...next, localKey: m.localKey } : m;
  });
  return [...updated, ...incoming.filter((m) => !known.has(m.id))];
};

const lastChange = (m: ChatMessage) =>
  m.reactedAt && Date.parse(m.reactedAt) > Date.parse(m.createdAt)
    ? m.reactedAt
    : m.createdAt;

export function useConversation(matchId: string, initial?: Match | null) {
  const focused = useIsFocused();
  const [match, setMatch] = useState<Match | null>(initial ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const lastSeen = useRef<string | undefined>(undefined);
  const pendingReactions = useRef(new Set<string>());

  const track = (list: ChatMessage[]) => {
    for (const m of list) {
      if (m.status !== "sent") continue;
      const at = lastChange(m);
      if (!lastSeen.current || Date.parse(at) > Date.parse(lastSeen.current)) {
        lastSeen.current = at;
      }
    }
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
          const next = merge(prev, incoming, pendingReactions.current);
          track(next);
          return next;
        });
      } catch {}
    }, POLL_MS);
    return () => clearInterval(id);
  }, [focused, loading, matchId]);

  const deliver = useCallback(
    async (draft: ChatMessage, confirmed = false): Promise<SendOutcome> => {
      setSendError(null);
      try {
        const saved = await chatService.send(
          matchId,
          draft.text,
          confirmed,
          draft.tone,
        );
        setMessages((prev) => {
          const next = prev.some((m) => m.id === saved.id)
            ? prev.filter((m) => m.id !== draft.id)
            : prev.map((m) =>
                m.id === draft.id ? { ...saved, localKey: draft.localKey } : m,
              );
          track(next);
          return next;
        });
        return { kind: "sent" };
      } catch (e) {
        const code = e instanceof ApiError ? e.code : undefined;
        if (code === "gentle_check" || code === "blocked") {
          setMessages((prev) => prev.filter((m) => m.id !== draft.id));
          return {
            kind: code === "blocked" ? "blocked" : "review",
            message: friendlyError(e),
          };
        }
        const blocked = e instanceof ApiError && e.kind === "validation";
        setMessages((prev) =>
          blocked
            ? prev.filter((m) => m.id !== draft.id)
            : prev.map((m) =>
                m.id === draft.id ? { ...m, status: "failed" } : m,
              ),
        );
        if (blocked) setSendError(friendlyError(e));
        return { kind: "failed" };
      } finally {
        refreshMatch().catch(() => undefined);
      }
    },
    [matchId, refreshMatch],
  );

  const send = useCallback(
    async (
      raw: string,
      confirmed = false,
      tone: ToneId | null = null,
    ): Promise<SendOutcome | null> => {
      const text = raw.trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!text || !match) return null;
      const id = `tmp-${Date.now()}`;
      const draft: ChatMessage = {
        id,
        localKey: id,
        matchId,
        text,
        fromMe: true,
        day: match.day,
        createdAt: new Date().toISOString(),
        tone,
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
      return deliver(draft, confirmed);
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

  const react = useCallback(
    async (id: string, reaction: MoodId | null) => {
      const before = messages.find((m) => m.id === id)?.reaction ?? null;
      const set = (value: MoodId | null) =>
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, reaction: value } : m)),
        );
      set(reaction);
      pendingReactions.current.add(id);
      try {
        await chatService.react(matchId, id, reaction);
      } catch (e) {
        set(before);
        setSendError(friendlyError(e));
      } finally {
        pendingReactions.current.delete(id);
      }
    },
    [matchId, messages],
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
    react,
  };
}
