import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type Theme = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgClass: string;
  iconColor: string;
};

const THEMES: Theme[] = [
  {
    id: "viajes",
    label: "Viajes",
    icon: "airplane",
    bgClass: "bg-primaryLight",
    iconColor: "#E8A77B",
  },
  {
    id: "naturaleza",
    label: "Naturaleza",
    icon: "leaf",
    bgClass: "bg-secondaryLight",
    iconColor: "#9CAF88",
  },
  {
    id: "musica",
    label: "Música",
    icon: "musical-notes",
    bgClass: "bg-primaryLight",
    iconColor: "#E8A77B",
  },
  {
    id: "suenos",
    label: "Sueños",
    icon: "moon",
    bgClass: "bg-secondaryLight",
    iconColor: "#9CAF88",
  },
  {
    id: "cocina",
    label: "Cocina",
    icon: "restaurant",
    bgClass: "bg-primaryLight",
    iconColor: "#E8A77B",
  },
];

export default function ThemeSelectionScreen({
  onSelect,
}: {
  onSelect: (themeId: string) => void;
}) {
  return (
    <ScrollView className="flex-1 bg-primaryClear px-6 pt-8">
      <Text className="font-heading-bold text-h1 text-primaryNormalActive mb-1">
        ¿De qué quieres hablar?
      </Text>
      <Text className="font-body text-sm text-primaryNormalHover mb-6">
        Elige un tema para esta semana.
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {THEMES.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            onPress={() => onSelect(theme.id)}
            activeOpacity={0.85}
            className={`w-[47%] rounded-card p-4 h-28 justify-between ${theme.bgClass}`}
          >
            <View className="w-9 h-9 rounded-full items-center justify-center bg-white/60">
              <Ionicons name={theme.icon} size={18} color={theme.iconColor} />
            </View>
            <Text className="font-heading-semibold text-sm text-primaryNormalActive">
              {theme.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
