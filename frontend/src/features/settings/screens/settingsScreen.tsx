import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Card from "../../../components/ui/card";
import ConfirmSheet from "../../../components/ui/confirmSheet";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { useAuth } from "../../auth/hooks/useAuth";

type Item = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function Section({ title, items }: { title: string; items: Item[] }) {
  return (
    <View className="mb-5">
      <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
        {title}
      </Text>
      <Card tone="white" className="p-0">
        {items.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            accessibilityRole="button"
            className={`min-h-[56px] flex-row items-center px-4 py-4 ${
              i !== items.length - 1 ? "border-b border-primary-light-active" : ""
            }`}
          >
            <Ionicons name={item.icon} size={20} color={colors.primary["dark-hover"]} />
            <Text variant="body3" className="ml-3 flex-1">
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.primary["dark-hover"]} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMood = async (value: boolean) => {
    setError(null);
    try {
      await authService.updateProfile({ shareMood: value });
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  return (
    <Container flush padded={false} scroll>
      <AppHeader showSettings={false} />
      <View className="px-7 pb-8 pt-4">
        <Text variant="h3" className="mb-5">
          Ajustes
        </Text>

        <Section
          title="Cuenta"
          items={[
            {
              icon: "person-outline",
              label: "Mi perfil",
              onPress: () => router.navigate("/(tabs)/profile"),
            },
            {
              icon: "lock-closed-outline",
              label: "Cambiar contraseña",
              onPress: () => router.push("/forgotPassword"),
            },
          ]}
        />

        <View className="mb-5">
          <Text variant="caption1" className="mb-2 ml-1 text-primary-dark-hover">
            Privacidad
          </Text>
          <Card tone="white" className="gap-1 px-4 py-3">
            <View className="flex-row items-center">
              <Ionicons name="happy-outline" size={20} color={colors.primary["dark-hover"]} />
              <Text variant="body3" className="ml-3 flex-1">
                Mostrar mi ánimo en mi avatar
              </Text>
              <Switch
                value={user?.shareMood ?? true}
                onValueChange={toggleMood}
                accessibilityLabel="Mostrar mi ánimo en mi avatar"
                trackColor={{
                  false: colors.primary["light-active"],
                  true: colors.secondary["dark-hover"],
                }}
                thumbColor={colors.white}
                {...({ activeThumbColor: colors.white } as object)}
              />
            </View>
            <Text variant="caption1" className="ml-8 text-primary-dark-hover">
              Solo lo ve la persona con quien conversas, y solo el ánimo de las
              últimas 24 horas.
            </Text>
          </Card>
          {error && <Banner tone="error" message={error} className="mt-2" />}
        </View>

        <Section
          title="Ayuda"
          items={[
            {
              icon: "document-text-outline",
              label: "Nuestros acuerdos",
              onPress: () => router.push("/terms"),
            },
          ]}
        />

        <Pressable
          onPress={() => setConfirming(true)}
          accessibilityRole="button"
          className="min-h-[48px] flex-row items-center justify-center gap-2 py-3"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error["normal-active"]} />
          <Text variant="body3" className="text-error-normal-active">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>

      <ConfirmSheet
        visible={confirming}
        title="¿Quieres cerrar sesión?"
        message="Tu jardín seguirá aquí cuando vuelvas."
        confirmLabel="Cerrar sesión"
        cancelLabel="Quedarme"
        destructive
        onConfirm={() => {
          setConfirming(false);
          signOut();
        }}
        onClose={() => setConfirming(false)}
      />
    </Container>
  );
}
