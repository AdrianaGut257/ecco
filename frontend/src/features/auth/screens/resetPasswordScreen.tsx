import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import CodeInput from "../../../components/ui/codeInput";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { PASSWORD_RULES, isStrongPassword } from "../../../utils/validation";
import { RESEND_SECONDS, useCooldown } from "./verifyEmailScreen";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email = "" } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const cooldown = useCooldown(RESEND_SECONDS);

  const matches = password.length > 0 && password === confirm;
  const canSubmit =
    !!email && code.length === 6 && isStrongPassword(password) && matches && !loading;

  const resend = async () => {
    if (cooldown.left > 0 || !email) return;
    setError(null);
    try {
      await authService.requestPasswordReset(email);
      cooldown.restart();
      setNotice("Te enviamos un código nuevo. El anterior ya no sirve.");
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      await authService.resetPassword(email, code, password);
      setDone(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Container
        center
        footer={
          <Button onPress={() => router.replace("/login")}>Iniciar sesión</Button>
        }
      >
        <View className="items-center">
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.secondary["dark-hover"]}
          />
          <Text variant="h3" className="mt-3 text-center">
            Listo, ya puedes entrar
          </Text>
          <Text
            variant="body3"
            className="mt-1 text-center text-primary-dark-hover"
          >
            Tu nueva contraseña quedó guardada.
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container scroll>
      <BackButton className="mb-8" fallbackRoute="/forgotPassword" />
      <Text variant="h2" className="mb-1">
        Crea una nueva contraseña
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        {email
          ? `Escribe el código de 6 números que enviamos a ${email} y elige una contraseña que recuerdes con facilidad.`
          : "Vuelve a «¿Olvidaste tu contraseña?» y escribe tu correo para recibir un código."}
      </Text>

      <Text variant="caption1" className="mb-1.5 ml-1 text-primary-dark-hover">
        Código
      </Text>
      <CodeInput
        value={code}
        onChange={(value) => {
          setCode(value);
          setError(null);
        }}
        error={!!error}
      />
      <Pressable
        onPress={resend}
        disabled={cooldown.left > 0}
        hitSlop={8}
        accessibilityRole="button"
        className="mb-6 mt-3 self-start"
      >
        <Text
          variant="caption1"
          className={
            cooldown.left > 0 ? "text-primary-dark-hover" : "text-primary-darker underline"
          }
        >
          {cooldown.left > 0
            ? `Puedes pedir otro código en ${cooldown.left} s`
            : "Enviar un código nuevo"}
        </Text>
      </Pressable>
      {notice && <Banner tone="info" message={notice} className="mb-4" />}

      <Input
        label="Nueva contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
        secure
      />
      <View className="mb-1 mt-2.5 gap-1.5">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(password);
          return (
            <View key={rule.label} className="flex-row items-center gap-1.5">
              <Ionicons
                name={passed ? "checkmark-circle" : "ellipse-outline"}
                size={14}
                color={
                  passed ? colors.secondary["dark-hover"] : colors.primary["dark-hover"]
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
      <Input
        label="Confirmar contraseña"
        value={confirm}
        onChangeText={setConfirm}
        error={
          confirm.length > 0 && !matches
            ? "Las contraseñas aún no coinciden."
            : undefined
        }
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
        secure
        className="mb-6 mt-4"
      />

      {error && <Banner tone="error" message={error} className="mb-4" />}

      <Button loading={loading} disabled={!canSubmit} onPress={submit}>
        Guardar contraseña
      </Button>
    </Container>
  );
}
