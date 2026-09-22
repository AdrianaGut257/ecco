import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // TODO: conectar con el servicio de auth
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
          <Text className="font-body-medium text-xs text-primaryNormalHover tracking-[3px] mb-2 uppercase">
            ECCO
          </Text>
          <Text className="font-heading-semibold text-[28px] text-primaryNormalActive mb-1">
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
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor="#A27556"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="font-body border border-primaryLightActive rounded-field px-4 py-3 text-primaryNormalActive bg-white"
            />
          </View>

          <View className="mb-2">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Contraseña
            </Text>
            <View className="flex-row items-center border border-primaryLightActive rounded-field bg-white pr-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#A27556"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className="font-body flex-1 px-4 py-3 text-primaryNormalActive"
              />
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Text className="font-body-medium text-xs text-primaryNormalHover">
                  {showPassword ? "Ocultar" : "Ver"}
                </Text>
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

          <TouchableOpacity
            className="bg-primaryNormal rounded-chip py-3.5 items-center mb-4"
            onPress={handleLogin}
          >
            <Text className="font-heading-semibold text-base text-white">
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
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
