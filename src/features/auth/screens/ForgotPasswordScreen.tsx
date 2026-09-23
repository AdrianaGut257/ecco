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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [sent, setSent] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  const handleSend = () => {
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
              <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-1">
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
                  style={{ outlineStyle: "none" } as any}
                />
                {showEmailError && (
                  <Text className="font-body text-xs text-destructive mt-1.5">
                    Ingresa un correo válido.
                  </Text>
                )}
              </View>

              <Button
                variant="primary"
                onPress={handleSend}
                disabled={!isEmailValid}
              >
                Enviar enlace
              </Button>
            </>
          ) : (
            <>
              <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-1">
                Revisa tu correo
              </Text>
              <Text className="font-body text-sm text-primaryNormalHover mb-8">
                Enviamos un enlace de recuperación a {email}. Si no lo ves,
                revisa la carpeta de spam.
              </Text>

              <Button
                variant="primary"
                onPress={() => router.replace("/login")}
                className="mb-4"
              >
                Volver a iniciar sesión
              </Button>

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
