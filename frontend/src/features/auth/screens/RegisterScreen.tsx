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

const PASSWORD_RULES = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "Un carácter especial (!@#$...)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email);
  const showEmailError = emailTouched && email.length > 0 && !isEmailValid;

  const passedRules = PASSWORD_RULES.filter((rule) => rule.test(password));
  const isPasswordStrong = passedRules.length === PASSWORD_RULES.length;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const canSubmit =
    name.trim().length > 0 &&
    isEmailValid &&
    isPasswordStrong &&
    passwordsMatch;

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

          <Text className="font-heading-medium text-xs text-primaryNormalHover tracking-[3px] mb-2 uppercase">
            ECCO
          </Text>
          <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-1">
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

          <View className="mb-3">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Contraseña
            </Text>
            <View className="relative justify-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
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

            {(passwordFocused || password.length > 0) && (
              <View className="mt-2.5 gap-1.5">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <View
                      key={rule.label}
                      className="flex-row items-center gap-1.5"
                    >
                      <Ionicons
                        name={passed ? "checkmark-circle" : "ellipse-outline"}
                        size={14}
                        color={passed ? "#9CAF88" : "#A27556"}
                      />
                      <Text
                        className={`font-body text-xs ${
                          passed
                            ? "text-secondaryNormal"
                            : "text-primaryNormalHover"
                        }`}
                      >
                        {rule.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View className="mb-2">
            <Text className="font-body-medium text-xs text-primaryNormalActive mb-1.5">
              Confirmar contraseña
            </Text>
            <View className="relative justify-center">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#A27556"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                className={`font-body border rounded-field pl-4 pr-12 py-3 text-primaryNormalActive bg-white ${
                  showMatchError
                    ? "border-destructive"
                    : "border-primaryLightActive"
                }`}
              />
              <Pressable
                onPress={() => setShowConfirmPassword((v) => !v)}
                hitSlop={8}
                className="absolute right-4"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#A27556"
                />
              </Pressable>
            </View>
            {showMatchError && (
              <Text className="font-body text-xs text-destructive mt-1.5">
                Las contraseñas no coinciden.
              </Text>
            )}
          </View>

          <Button
            variant="primary"
            onPress={handleRegister}
            disabled={!canSubmit}
          >
            Crear cuenta
          </Button>

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
