import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { PASSWORD_RULES, isStrongPassword } from "../../../utils/validation";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = password.length > 0 && password === confirm;
  const canSubmit = !!token && isStrongPassword(password) && matches && !loading;

  const submit = async () => {
    if (!canSubmit || !token) return;
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, password);
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
    <Container scroll center>
      <Text variant="h2" className="mb-1">
        Crea una nueva contraseña
      </Text>
      <Text variant="body3" className="mb-8 text-primary-dark-hover">
        Elige una que recuerdes con facilidad.
      </Text>

      {!token && (
        <Banner
          tone="error"
          message="Este enlace no es válido. Pide uno nuevo desde «¿Olvidaste tu contraseña?»."
          className="mb-4"
        />
      )}

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
