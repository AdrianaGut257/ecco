import { useRouter } from "expo-router";
import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { isValidEmail } from "../../../utils/validation";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError =
    touched && email.length > 0 && !isValidEmail(email)
      ? "Parece que a ese correo le falta algo. Revísalo con calma."
      : undefined;

  const send = async () => {
    if (!isValidEmail(email) || loading) return;
    const clean = email.trim().toLowerCase();
    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(clean);
      router.push({ pathname: "/resetPassword", params: { email: clean } });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container scroll>
      <BackButton className="mb-8" fallbackRoute="/login" />
      <Text variant="h2" className="mb-1">
        ¿Olvidaste tu contraseña?
      </Text>
      <Text variant="body3" className="mb-8 text-primary-dark-hover">
        No pasa nada. Escribe tu correo y te enviamos un código de 6 números
        para crear una nueva.
      </Text>
      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setTouched(true)}
        error={emailError}
        placeholder="tucorreo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        rightIcon="mail-outline"
        className="mb-6"
      />
      {error && <Banner tone="error" message={error} className="mb-4" />}
      <Button
        loading={loading}
        disabled={!isValidEmail(email)}
        onPress={send}
      >
        Enviar código
      </Button>
    </Container>
  );
}
