import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { Match } from "../../../types";

type Status = "idle" | "searching" | "found" | "error";

export function useMatching() {
  const [status, setStatus] = useState<Status>("idle");
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const start = useCallback(async (hobbies: string[]) => {
    setStatus("searching");
    setError(null);
    try {
      const found = await matchService.find(hobbies);
      if (!alive.current) return;
      setMatch(found);
      setStatus("found");
    } catch (e) {
      if (!alive.current) return;
      setError(friendlyError(e));
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setMatch(null);
    setError(null);
  }, []);

  return { status, match, error, start, reset };
}
