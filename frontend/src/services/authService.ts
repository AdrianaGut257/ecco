import type { AuthSession, LoginPayload, RegisterPayload } from "../types";
import { ApiError, api } from "./api";
import { MOCK_USER, USE_MOCKS, wait } from "./mocks";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (!USE_MOCKS) return api.post<AuthSession>("/auth/login", payload);
    await wait();
    if (payload.password === "fallo") {
      throw new ApiError(
        "unauthorized",
        "El correo o la contraseña no coinciden. Prueba de nuevo.",
        401,
      );
    }
    return {
      accessToken: "mock-token",
      user: { ...MOCK_USER, email: payload.email },
    };
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    if (!USE_MOCKS) return api.post<AuthSession>("/auth/register", payload);
    await wait();
    return {
      accessToken: "mock-token",
      user: { ...MOCK_USER, username: payload.name, email: payload.email },
    };
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (!USE_MOCKS) return api.post("/auth/forgot-password", { email });
    await wait();
  },

  async saveProfile(avatarId: string, interests: string[]): Promise<void> {
    if (!USE_MOCKS) return api.put("/users/me", { avatarId, interests });
    await wait(400);
  },
};
