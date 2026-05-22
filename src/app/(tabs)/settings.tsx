import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

type SettingItem =
  | {
      label: string;
      type: "switch";
      value: boolean;
      onValueChange: (value: boolean) => void;
    }
  | { label: string; type: "link"; value?: string }
  | { label: string; type: "button"; value?: string }
  | { label: string; type: "info"; value?: string };

type SettingSection = {
  title: string;
  items: SettingItem[];
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("Español");
  const [privacy, setPrivacy] = useState("Solo amigos");

  const settingsSections: SettingSection[] = [
    {
      title: "Preferencias",
      items: [
        {
          label: "Notificaciones",
          type: "switch",
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          label: "Modo oscuro",
          type: "switch",
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          label: "Idioma",
          type: "link",
          value: language,
        },
      ],
    },
    {
      title: "Privacidad",
      items: [
        {
          label: "Perfil público",
          type: "link",
          value: privacy,
        },
        {
          label: "Borrar historial",
          type: "button",
          value: "Borrar",
        },
      ],
    },
    {
      title: "Acerca de",
      items: [
        { label: "Versión", type: "info", value: "1.0.0" },
        { label: "Términos y condiciones", type: "link" },
        { label: "Política de privacidad", type: "link" },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-14 pb-4 px-6 bg-white border-b border-gray-200">
        <Text className="text-3xl font-chewy text-gray-800">Ajustes</Text>
        <Text className="text-gray-500 mt-1">Personaliza tu experiencia</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {settingsSections.map((section, idx) => (
          <View key={idx} className="mb-8">
            <Text className="text-gray-500 text-sm mb-3 uppercase tracking-wide">
              {section.title}
            </Text>

            <View className="bg-white rounded-xl overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  className={`flex-row justify-between items-center p-4 ${
                    itemIdx !== section.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  activeOpacity={item.type === "switch" ? 1 : 0.7}
                  disabled={item.type === "switch"}
                  onPress={() => {
                    if (item.type === "link" && item.label === "Idioma") {
                      // Aquí iría la navegación a pantalla de idiomas
                      console.log("Cambiar idioma");
                    } else if (
                      item.type === "link" &&
                      item.label === "Perfil público"
                    ) {
                      console.log("Cambiar privacidad");
                    } else if (
                      item.type === "link" &&
                      item.label === "Términos y condiciones"
                    ) {
                      console.log("Abrir términos");
                    } else if (
                      item.type === "link" &&
                      item.label === "Política de privacidad"
                    ) {
                      console.log("Abrir política");
                    } else if (item.type === "button") {
                      console.log("Borrar historial");
                    }
                  }}
                >
                  <Text className="text-gray-700">{item.label}</Text>

                  {item.type === "switch" && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: "#D1D5DB", true: "#C484FF" }}
                      thumbColor={item.value ? "#FFFFFF" : "#FFFFFF"}
                    />
                  )}

                  {item.type === "link" && (
                    <View className="flex-row items-center">
                      {item.value && (
                        <Text className="text-gray-400 mr-2">{item.value}</Text>
                      )}
                      <Text className="text-gray-400 text-lg">›</Text>
                    </View>
                  )}

                  {item.type === "info" && (
                    <Text className="text-gray-400">{item.value}</Text>
                  )}

                  {item.type === "button" && (
                    <Text className="text-red-500">{item.value}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
