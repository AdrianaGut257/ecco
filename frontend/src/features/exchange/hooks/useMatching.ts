import { useCallback, useEffect, useRef, useState } from "react";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { Match, SearchState } from "../../../types";

type Status = "searching" | "found" | "error" | "expired";

const POLL_MS = 3000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useMatching(hobbies: string[], resume: boolean) {
  const [status, setStatus] = useState<Status>("searching");
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = useRef(0);
  const key = hobbies.join("|");

  const loop = useCallback(async (first: () => Promise<SearchState>) => {
    const id = ++run.current;
    setStatus("searching");
    setError(null);
    let request = first;
    while (run.current === id) {
      try {
        const state = await request();
        if (run.current !== id) return;
        if (state.status === "matched" && state.match) {
          setMatch(state.match);
          setStatus("found");
          return;
        }
        if (state.status === "idle") {
          setStatus("expired");
          return;
        }
      } catch (e) {
        if (run.current !== id) return;
        setError(friendlyError(e));
        setStatus("error");
        return;
      }
      await wait(POLL_MS);
      request = matchService.searchState;
    }
  }, []);

  const start = useCallback(
    () => loop(() => matchService.startSearch(key.split("|"))),
    [loop, key],
  );

  useEffect(() => {
    if (resume) loop(matchService.searchState);
    else start();
    return () => {
      run.current++;
    };
  }, [resume, loop, start]);

  const cancel = useCallback(async () => {
    run.current++;
    await matchService.cancelSearch().catch(() => undefined);
  }, []);

  return { status, match, error, retry: start, cancel };
}
