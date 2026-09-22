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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && passwordsMatch;

  const handleRegister = () => {
    router.replace("/onboarding");
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
        <View className="flex-1 justify-center py-12">
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="font-body-medium text-sm text-primaryNormalHover">
              ← Volver
            </Text>
          </Pressable>

          <Text className="font-body-medium text-xs text-primaryNormalHover tracking-[3px] mb-2 uppercase">
            ECCO
          </Text>
          <Text className="font-heading-semibold text-[28px] text-primaryNormalActive mb-1">
            Crea tu cuenta
          </Text>
          <Text className="font-body text-sm text-primaryNormalHover mb-8">
            Empieza a conectar con calma, sin prisas.
          </Text>

          <View className="mb-4">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Nombre
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor="#A27556"
              autoCapitalize="words"
              className="font-body border border-primaryLightActive rounded-field px-4 py-3 text-primaryNormalActive bg-white"
            />
          </View>

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

          <View className="mb-4">
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

          <View className="mb-2">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Confirmar contraseña
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              placeholderTextColor="#A27556"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              className="font-body border border-primaryLightActive rounded-field px-4 py-3 text-primaryNormalActive bg-white"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="font-body text-xs text-destructive mt-1.5">
                Las contraseñas no coinciden.
              </Text>
            )}
          </View>

          <TouchableOpacity
            className={`rounded-chip py-3.5 items-center mt-6 mb-4 ${
              canSubmit ? "bg-primaryNormal" : "bg-primaryLightActive"
            }`}
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            <Text className="font-heading-semibold text-base text-white">
              Crear cuenta
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center">
            <Text className="font-body text-sm text-primaryNormalHover">
              ¿Ya tienes cuenta?{" "}
            </Text>
            <Pressable onPress={() => router.replace("/login")}>
              <Text className="font-body-medium text-sm text-primaryNormal">
                Inicia sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
