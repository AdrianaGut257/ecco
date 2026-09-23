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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    // TODO: conectar con el servicio de auth (enviar correo de recuperación)
    setSent(true);
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
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="font-body-medium text-sm text-primaryNormalHover">
              ← Volver
            </Text>
          </Pressable>

          {!sent ? (
            <>
              <Text className="font-heading-semibold text-[28px] text-primaryNormalActive mb-1">
                ¿Olvidaste tu contraseña?
              </Text>
              <Text className="font-body text-sm text-primaryNormalHover mb-8">
                Escribe tu correo y te enviaremos un enlace para recuperarla.
              </Text>

              <View className="mb-8">
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

              <TouchableOpacity
                className="bg-primaryNormal rounded-chip py-3.5 items-center"
                onPress={handleSend}
                disabled={!email}
              >
                <Text className="font-heading-semibold text-base text-white">
                  Enviar enlace
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="font-heading-semibold text-[28px] text-primaryNormalActive mb-1">
                Revisa tu correo
              </Text>
              <Text className="font-body text-sm text-primaryNormalHover mb-8">
                Enviamos un enlace de recuperación a {email}. Si no lo ves,
                revisa la carpeta de spam.
              </Text>

              <TouchableOpacity
                className="bg-primaryNormal rounded-chip py-3.5 items-center mb-4"
                onPress={() => router.replace("/login")}
              >
                <Text className="font-heading-semibold text-base text-white">
                  Volver a iniciar sesión
                </Text>
              </TouchableOpacity>

              <Pressable onPress={handleSend} className="items-center">
                <Text className="font-body-medium text-sm text-primaryNormal">
                  Reenviar enlace
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
