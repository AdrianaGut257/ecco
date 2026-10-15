import type { User } from "../types";
import { createStore } from "./createStore";

interface SessionState {
  accessToken: string | null;
  user: User | null;
}

const store = createStore<SessionState>({ accessToken: null, user: null });

export const sessionStore = {
  get: store.get,
  use: store.use,
  setSession: (accessToken: string, user: User) =>
    store.set({ accessToken, user }),
  updateUser: (patch: Partial<User>) => {
    const user = store.get().user;
    if (user) store.set({ user: { ...user, ...patch } });
  },
  clear: store.reset,
};
