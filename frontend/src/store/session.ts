import type { User } from "../types";
import { createStore } from "./createStore";
import { tokenStorage } from "./tokenStorage";

interface SessionState {
  accessToken: string | null;
  user: User | null;
  ready: boolean;
}

const store = createStore<SessionState>({
  accessToken: null,
  user: null,
  ready: false,
});

export const sessionStore = {
  get: store.get,
  use: store.use,
  setSession: (accessToken: string, user: User) => {
    store.set({ accessToken, user, ready: true });
    tokenStorage.set(accessToken);
  },
  setToken: (accessToken: string) => store.set({ accessToken }),
  setUser: (user: User) => store.set({ user }),
  updateUser: (patch: Partial<User>) => {
    const user = store.get().user;
    if (user) store.set({ user: { ...user, ...patch } });
  },
  markReady: () => store.set({ ready: true }),
  clear: () => {
    store.set({ accessToken: null, user: null, ready: true });
    tokenStorage.remove();
  },
};
