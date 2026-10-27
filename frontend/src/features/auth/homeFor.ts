import type { User } from "../../types";

// A dónde va alguien con sesión: primero confirma su correo, luego completa el onboarding.
export const homeFor = (user: User) =>
  !user.emailVerified
    ? "/verifyEmail"
    : user.onboarded
      ? "/welcome"
      : "/onboarding";
