import { sessionStore } from "../store/session";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api";
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
  ) {
    super(message);
  }
}

const FRIENDLY: Record<ApiErrorKind, string> = {
  network: "No pudimos conectarnos. Revisa tu internet e inténtalo de nuevo.",
  timeout: "Esto está tardando más de lo normal. Prueba de nuevo en un momento.",
  unauthorized: "Tu sesión terminó. Vuelve a entrar cuando quieras.",
  validation: "Hay algo que revisar en lo que enviaste.",
  notFound: "No encontramos lo que buscabas.",
  server: "Algo salió mal de nuestro lado. Ya lo estamos mirando.",
  unknown: "Algo no salió como esperábamos. Inténtalo otra vez.",
};

const kindFromStatus = (status: number): ApiErrorKind => {
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 404) return "notFound";
  if (status === 400 || status === 409 || status === 422) return "validation";
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
      if (kind === "unauthorized") sessionStore.clear();
      const detail = await response
        .json()
        .then((data) => (typeof data?.detail === "string" ? data.detail : null))
        .catch(() => null);
      throw new ApiError(kind, detail ?? FRIENDLY[kind], response.status);
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
};

export const friendlyError = (error: unknown) =>
  error instanceof ApiError ? error.message : FRIENDLY.unknown;
