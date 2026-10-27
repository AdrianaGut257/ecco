import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import CodeInput from "../../../components/ui/codeInput";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import { homeFor } from "../homeFor";

export const RESEND_SECONDS = 60;

// Cuenta regresiva para no pedir códigos sin parar.
export function useCooldown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return { left, restart: () => setLeft(seconds) };
}

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const cooldown = useCooldown(RESEND_SECONDS);

  if (!user) return <Redirect href="/login" />;
  if (user.emailVerified && !done) return <Redirect href={homeFor(user)} />;

  const verify = async (value = code) => {
    if (value.length !== 6 || loading) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const updated = await authService.verifyEmail(value);
      setDone(true);
      setTimeout(() => router.replace(homeFor(updated)), 1200);
    } catch (e) {
      setError(friendlyError(e));
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown.left > 0) return;
    setError(null);
    try {
      await authService.resendVerification();
      cooldown.restart();
      setNotice("Te enviamos un código nuevo. El anterior ya no sirve.");
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  if (done) {
    return (
      <Container center>
        <View className="items-center">
          <Animated.View entering={ZoomIn.springify().damping(10)}>
            <Ionicons
              name="checkmark-circle"
              size={72}
              color={colors.secondary["dark-hover"]}
            />
          </Animated.View>
          <Text variant="h3" className="mt-3 text-center">
            ¡Correo confirmado!
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container
      scroll
      footer={
        <Button loading={loading} disabled={code.length !== 6} onPress={() => verify()}>
          Confirmar
        </Button>
      }
    >
      <View className="mb-6 mt-4 h-16 w-16 items-center justify-center rounded-full bg-secondary-light-active">
        <Ionicons name="mail-open-outline" size={30} color={colors.secondary.darker} />
      </View>
      <Text variant="h2" className="mb-1">
        Confirma tu correo
      </Text>
      <Text variant="body3" className="mb-8 text-primary-dark-hover">
        {`Te enviamos un código de 6 números a ${user.email}. Escríbelo aquí. Si no lo ves, revisa también en spam.`}
      </Text>

      <CodeInput
        value={code}
        onChange={(value) => {
          setCode(value);
          setError(null);
        }}
        onComplete={verify}
        error={!!error}
      />

      {error && <Banner tone="error" message={error} className="mt-4" />}
      {notice && (
        <Animated.View entering={FadeIn}>
          <Banner tone="info" message={notice} className="mt-4" />
        </Animated.View>
      )}

      <View className="mt-6 items-center gap-4">
        <Pressable
          onPress={resend}
          disabled={cooldown.left > 0}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityState={{ disabled: cooldown.left > 0 }}
        >
          <Text
            variant="body3"
            className={
              cooldown.left > 0 ? "text-primary-dark-hover" : "text-primary-darker underline"
            }
          >
            {cooldown.left > 0
              ? `Puedes pedir otro código en ${cooldown.left} s`
              : "Enviar un código nuevo"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            sessionStore.clear();
            router.replace("/register");
          }}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text variant="caption1" className="text-center text-primary-dark-hover underline">
            ¿Te equivocaste de correo? Crea la cuenta de nuevo
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
