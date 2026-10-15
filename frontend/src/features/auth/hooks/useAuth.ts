import { useRouter } from "expo-router";
import { useCallback } from "react";
import { sessionStore } from "../../../store/session";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken } = sessionStore.use();

  const signOut = useCallback(() => {
    sessionStore.clear();
    router.replace("/");
  }, [router]);

  return { user, isAuthenticated: !!accessToken, signOut };
}
