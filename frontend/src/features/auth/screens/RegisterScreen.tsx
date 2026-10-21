import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import {
  PASSWORD_RULES,
  isStrongPassword,
  isValidEmail,
} from "../../../utils/validation";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? "Parece que a ese correo le falta algo. Revísalo con calma."
      : undefined;
  const matches = password.length > 0 && password === confirm;
  const confirmError =
    confirm.length > 0 && !matches
      ? "Las contraseñas aún no coinciden."
      : undefined;
  const canSubmit =
    name.trim().length >= 2 &&
    isValidEmail(email) &&
    isStrongPassword(password) &&
    matches &&
    !loading;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const session = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      sessionStore.setSession(session.accessToken, session.user);
      router.replace("/onboarding");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container scroll>
      <BackButton className="mb-6" fallbackRoute="/login" />
      <Wordmark className="mb-2 text-primary-dark-hover" size="sm" />
      <Text variant="h2" className="mb-1">
        Crea tu cuenta
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Empieza a conectar con calma, sin prisas.
      </Text>

      <Input
        label="Nombre"
        value={name}
        onChangeText={setName}
        placeholder="Tu nombre"
        autoCapitalize="words"
        autoComplete="name"
        rightIcon="person-outline"
        className="mb-4"
      />
      <Input
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setEmailTouched(true)}
        error={emailError}
        placeholder="tucorreo@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        rightIcon="mail-outline"
        className="mb-4"
      />
      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
        secure
      />

      {(passwordFocused || password.length > 0) && (
        <View className="mb-1 mt-2.5 gap-1.5">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <View key={rule.label} className="flex-row items-center gap-1.5">
                <Ionicons
                  name={passed ? "checkmark-circle" : "ellipse-outline"}
                  size={14}
                  color={
                    passed
                      ? colors.secondary.dark
                      : colors.primary["normal-hover"]
                  }
                />
                <Text
                  variant="caption1"
                  className={
                    passed ? "text-secondary-dark-hover" : "text-primary-dark-hover"
                  }
                >
                  {rule.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Input
        label="Confirmar contraseña"
        value={confirm}
        onChangeText={setConfirm}
        error={confirmError}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
        secure
        className="mb-6 mt-4"
      />

      {error && <Banner tone="error" message={error} className="mb-4" />}

      <Button loading={loading} disabled={!canSubmit} onPress={submit}>
        Crear cuenta
      </Button>

      <View className="mt-5 flex-row items-center justify-center gap-1">
        <Text variant="caption1" className="text-primary-dark-hover">
          ¿Ya tienes cuenta?
        </Text>
        <Pressable onPress={() => router.replace("/login")} hitSlop={8}>
          <Text variant="caption1" className="text-primary-dark-active">
            Inicia sesión
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
