import Constants from "expo-constants";
import { Platform } from "react-native";
import { sessionStore } from "../store/session";

const resolveBaseUrl = () => {
  const configured =
    process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api";
  // En web se usa el mismo host desde el que se abrió la app (127.0.0.1 o la IP de la PC desde otro dispositivo).
  if (Platform.OS === "web") {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    return host ? configured.replace(/localhost|127\.0\.0\.1/, host) : configured;
  }
  const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
  return devHost
    ? configured.replace(/localhost|127\.0\.0\.1/, devHost)
    : configured;
};

const BASE_URL = resolveBaseUrl();
const TIMEOUT_MS = 10000;

export type ApiErrorKind =
  | "network"
  | "timeout"
  | "unauthorized"
  | "validation"
  | "notFound"
  | "server"
  | "unknown";

export class ApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
  }
}

const FRIENDLY: Record<ApiErrorKind, string> = {
  network: "No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.",
  timeout:
    "Esto está tardando más de lo normal. Prueba de nuevo en un momento.",
  unauthorized: "Tu sesión terminó. Vuelve a entrar cuando quieras.",
  validation: "Hay algo que revisar en lo que enviaste.",
  notFound: "No encontramos lo que buscabas.",
  server: "Algo salió mal de nuestro lado. Ya lo estamos mirando.",
  unknown: "Algo no salió como esperábamos. Inténtalo otra vez.",
};

const kindFromStatus = (status: number): ApiErrorKind => {
  if (status === 401) return "unauthorized";
  if (status === 403) return "validation";
  if (status === 404) return "notFound";
  if (status === 400 || status === 409 || status === 422 || status === 429)
    return "validation";
  if (status >= 500) return "server";
  return "unknown";
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const token = sessionStore.get().accessToken;

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
      const kind = kindFromStatus(response.status);
      if (kind === "unauthorized" && token) sessionStore.clear();
      const data = await response.json().catch(() => null);
      const detail = typeof data?.detail === "string" ? data.detail : null;
      const code = typeof data?.code === "string" ? data.code : undefined;
      throw new ApiError(kind, detail ?? FRIENDLY[kind], response.status, code);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("timeout", FRIENDLY.timeout);
    }
    throw new ApiError("network", FRIENDLY.network);
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

export const friendlyError = (error: unknown) =>
  error instanceof ApiError ? error.message : FRIENDLY.unknown;
