import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Switch, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { useAuth } from "../../auth/hooks/useAuth";

type Item = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
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
            disabled={!item.onPress}
            accessibilityRole="button"
            className={`flex-row items-center px-4 py-4 ${
              i !== items.length - 1
                ? "border-b border-primary-light-active"
                : ""
            }`}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={colors.primary["normal-active"]}
            />
            <Text variant="body3" className="ml-3 flex-1">
              {item.label}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.primary.normal}
            />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const confirmSignOut = () =>
    Alert.alert(
      "¿Quieres cerrar sesión?",
      "Tu jardín seguirá aquí cuando vuelvas.",
      [
        { text: "Quedarme", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: signOut },
      ],
    );

  return (
    <Container flush padded={false} scroll>
      <AppHeader showSettings={false} />
      <View className="px-7 pt-4">
        <Text variant="h3" className="mb-5">
          Ajustes
        </Text>

        <Section
          title="Cuenta"
          items={[
            {
              icon: "person-outline",
              label: "Mi perfil",
              onPress: () => router.push("/(tabs)/profile"),
            },
            {
              icon: "lock-closed-outline",
              label: "Cambiar contraseña",
              onPress: () => router.push("/forgotPassword"),
            },
          ]}
        />

        <View className="mb-5">
          <Text
            variant="caption1"
            className="mb-2 ml-1 text-primary-dark-hover"
          >
            Preferencias
          </Text>
          <Card tone="white" className="flex-row items-center px-4 py-3">
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.primary["normal-active"]}
            />
            <Text variant="body3" className="ml-3 flex-1">
              Notificaciones
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              accessibilityLabel="Notificaciones"
              trackColor={{
                false: colors.primary["light-active"],
                true: colors.primary.normal,
              }}
              thumbColor={colors.white}
            />
          </Card>
        </View>

        <Section
          title="Ayuda"
          items={[
            { icon: "help-circle-outline", label: "Ayuda y soporte" },
            { icon: "document-text-outline", label: "Términos y condiciones" },
            { icon: "flag-outline", label: "Cuéntanos si algo no va bien" },
          ]}
        />

        <Pressable
          onPress={confirmSignOut}
          accessibilityRole="button"
          className="mb-8 flex-row items-center justify-center gap-2 py-3"
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.error["normal-active"]}
          />
          <Text variant="body3" className="text-error-normal-active">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}
