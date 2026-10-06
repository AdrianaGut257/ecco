import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

type OptionItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  toggle?: boolean;
};

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);

  const accountOptions: OptionItem[] = [
    {
      icon: "person-outline",
      label: "Editar perfil",
      onPress: () => router.push("/(tabs)/profile"),
    },
    { icon: "shield-checkmark-outline", label: "Privacidad" },
    {
      icon: "lock-closed-outline",
      label: "Cambiar contraseña",
      onPress: () => router.push("/forgotPassword"),
    },
  ];

  const supportOptions: OptionItem[] = [
    { icon: "help-circle-outline", label: "Ayuda y soporte" },
    { icon: "document-text-outline", label: "Términos y condiciones" },
    { icon: "flag-outline", label: "Reportar un problema" },
  ];

  const handleLogout = () => {
    // TODO: conectar con el servicio de auth (cerrar sesión real)
    router.replace("/welcome");
  };

  return (
    <ScrollView className="flex-1 bg-primaryClear px-6 pt-8">
      <Text className="font-heading-bold text-h2 text-primaryNormalActive mb-6">
        Ajustes
      </Text>

      <Text className="font-body-medium text-xs text-primaryNormalHover uppercase mb-2 ml-1">
        Cuenta
      </Text>
      <View className="bg-white rounded-card border border-primaryLight mb-6">
        {accountOptions.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            className={`flex-row items-center px-4 py-4 ${
              i !== accountOptions.length - 1
                ? "border-b border-primaryLight"
                : ""
            }`}
          >
            <Ionicons name={item.icon} size={20} color="#8E664B" />
            <Text className="font-body-medium text-sm text-primaryNormalActive flex-1 ml-3">
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#ECB691" />
          </Pressable>
        ))}
      </View>

      <Text className="font-body-medium text-xs text-primaryNormalHover uppercase mb-2 ml-1">
        Preferencias
      </Text>
      <View className="bg-white rounded-card border border-primaryLight mb-6">
        <View className="flex-row items-center px-4 py-4">
          <Ionicons name="notifications-outline" size={20} color="#8E664B" />
          <Text className="font-body-medium text-sm text-primaryNormalActive flex-1 ml-3">
            Notificaciones
          </Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#F6DBC9", true: "#E8A77B" }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <Text className="font-body-medium text-xs text-primaryNormalHover uppercase mb-2 ml-1">
        Soporte
      </Text>
      <View className="bg-white rounded-card border border-primaryLight mb-6">
        {supportOptions.map((item, i) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            className={`flex-row items-center px-4 py-4 ${
              i !== supportOptions.length - 1
                ? "border-b border-primaryLight"
                : ""
            }`}
          >
            <Ionicons name={item.icon} size={20} color="#8E664B" />
            <Text className="font-body-medium text-sm text-primaryNormalActive flex-1 ml-3">
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#ECB691" />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-center gap-2 py-4 mb-10"
      >
        <Ionicons name="log-out-outline" size={20} color="#C97B63" />
        <Text className="font-body-medium text-sm text-destructive">
          Cerrar sesión
        </Text>
      </Pressable>
    </ScrollView>
  );
}
