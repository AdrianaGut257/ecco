import { useRouter } from "expo-router";
import { useState } from "react";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import { isValidEmail } from "../../../utils/validation";

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? "Parece que a ese correo le falta algo. Revísalo con calma."
      : undefined;
  const canSubmit = isValidEmail(email) && password.length > 0 && !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const session = await authService.login({
        email: email.trim(),
        password,
      });
      sessionStore.setSession(session.accessToken, session.user);
      router.replace("/welcome");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail: (value: string) => {
      setEmail(value);
      setError(null);
    },
    password,
    setPassword: (value: string) => {
      setPassword(value);
      setError(null);
    },
    markEmailTouched: () => setEmailTouched(true),
    emailError,
    error,
    loading,
    canSubmit,
    submit,
  };
}
