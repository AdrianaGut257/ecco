import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { Match } from "../../../types";

export function useActiveMatch() {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setMatch(await matchService.getCurrent());
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { match, setMatch, loading, error, refresh };
}
