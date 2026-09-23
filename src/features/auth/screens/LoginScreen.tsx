import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../../components/ui/Button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  const handleLogin = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primaryClear"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-8"
      >
        <View className="flex-1 justify-center">
          <Text className="font-heading-medium text-xs text-primaryNormalHover tracking-[3px] mb-2 uppercase">
            ECCO
          </Text>
          <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-1">
            Bienvenida de nuevo
          </Text>
          <Text className="font-body text-sm text-primaryNormalHover mb-8">
            Inicia sesión para seguir tu conversación.
          </Text>

          <View className="mb-4">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Correo electrónico
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEmailTouched(true)}
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="#A27556"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className={`font-body border rounded-field px-4 py-3 text-primaryNormalActive bg-white ${
                showEmailError
                  ? "border-destructive"
                  : "border-primaryLightActive"
              }`}
            />
            {showEmailError && (
              <Text className="font-body text-xs text-destructive mt-1.5">
                Ingresa un correo válido.
              </Text>
            )}
          </View>

          <View className="mb-2">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Contraseña
            </Text>
            <View className="relative justify-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#A27556"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="font-body border border-primaryLightActive rounded-field pl-4 pr-12 py-3 text-primaryNormalActive bg-white"
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={8}
                className="absolute right-4"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#A27556"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/forgotPassword")}
            className="self-end mb-8"
          >
            <Text className="font-body-medium text-xs text-primaryNormalHover">
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <Button variant="primary" onPress={handleLogin} disabled={!canSubmit}>
            Iniciar sesión
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="font-body text-sm text-primaryNormalHover">
              ¿No tienes cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="font-body-medium text-sm text-primaryNormal">
                Regístrate
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
