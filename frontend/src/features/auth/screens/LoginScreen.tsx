import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {
  const router = useRouter();
  const form = useLogin();

  return (
    <Container scroll center>
      <Wordmark className="mb-2 text-primary-dark-hover" size="sm" />
      <Text variant="h2" className="mb-1">
        Qué alegría verte de nuevo
      </Text>
      <Text variant="body3" className="mb-8 text-primary-dark-hover">
        Entra para seguir con tu conversación.
      </Text>

      <Input
        label="Correo electrónico"
        value={form.email}
        onChangeText={form.setEmail}
        onBlur={form.markEmailTouched}
        error={form.emailError}
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
        value={form.password}
        onChangeText={form.setPassword}
        placeholder="••••••••"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        secure
        onSubmitEditing={form.submit}
        returnKeyType="go"
      />

      <Pressable
        onPress={() => router.push("/forgotPassword")}
        hitSlop={8}
        className="mb-6 mt-2 self-end"
      >
        <Text variant="caption1" className="text-primary-dark-hover">
          ¿Olvidaste tu contraseña?
        </Text>
      </Pressable>

      {form.error && (
        <Banner tone="error" message={form.error} className="mb-4" />
      )}

      <Button
        loading={form.loading}
        disabled={!form.canSubmit}
        onPress={form.submit}
      >
        Iniciar sesión
      </Button>

      <View className="mt-5 flex-row items-center justify-center gap-1">
        <Text variant="caption1" className="text-primary-dark-hover">
          ¿Aún no tienes cuenta?
        </Text>
        <Pressable onPress={() => router.push("/register")} hitSlop={8}>
          <Text variant="caption1" className="text-primary-dark-active">
            Regístrate
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
