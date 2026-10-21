import { sessionStore } from "../store/session";
import { tokenStorage } from "../store/tokenStorage";
import type {
  AuthSession,
  LoginPayload,
  ProfilePatch,
  RegisterPayload,
  User,
} from "../types";
import { ApiError, api } from "./api";

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthSession>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthSession>("/auth/register", payload),

  requestPasswordReset: (email: string) =>
    api.post<void>("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post<void>("/auth/reset-password", { token, password }),

  async updateProfile(patch: ProfilePatch): Promise<User> {
    const user = await api.put<User>("/users/me", patch);
    sessionStore.setUser(user);
    return user;
  },

  async restoreSession(): Promise<void> {
    const token = await tokenStorage.get();
    if (!token) return sessionStore.markReady();
    sessionStore.setToken(token);
    try {
      const user = await api.get<User>("/users/me");
      sessionStore.setSession(token, user);
    } catch (error) {
      if (error instanceof ApiError && error.kind === "unauthorized") {
        sessionStore.clear();
      } else {
        sessionStore.markReady();
      }
    }
  },
};
