import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
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
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError =
    touched && email.length > 0 && !isValidEmail(email)
      ? "Parece que a ese correo le falta algo. Revísalo con calma."
      : undefined;

  const send = async () => {
    if (!isValidEmail(email) || loading) return;
    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(email.trim());
      setSent(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container scroll center>
      <BackButton className="mb-8" fallbackRoute="/login" />

      {sent ? (
        <>
          <Text variant="h2" className="mb-1">
            Revisa tu correo
          </Text>
          <Text variant="body3" className="mb-8 text-primary-dark-hover">
            Si {email.trim()} tiene una cuenta, te enviamos un enlace para
            recuperarla. Si no lo ves, mira también en spam.
          </Text>
          <Button className="mb-4" onPress={() => router.replace("/login")}>
            Volver a iniciar sesión
          </Button>
          {error && <Banner tone="error" message={error} className="mb-3" />}
          <Pressable
            onPress={send}
            disabled={loading}
            className="items-center"
            hitSlop={8}
          >
            <Text variant="body3" className="text-primary-normal-active">
              {loading ? "Enviando…" : "Enviar de nuevo"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text variant="h2" className="mb-1">
            ¿Olvidaste tu contraseña?
          </Text>
          <Text variant="body3" className="mb-8 text-primary-dark-hover">
            No pasa nada. Escribe tu correo y te enviamos un enlace para crear
            una nueva.
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
            Enviar enlace
          </Button>
        </>
      )}
    </Container>
  );
}
