import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const MOCK_NAME = "Naty09";
const MOCK_EMAIL = "naty09@ejemplo.com";

const OPTIONS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}[] = [
  { icon: "eye-outline", label: "Mis intereses", route: "/onboarding" },
  { icon: "create-outline", label: "Editar avatar", route: "/onboarding" },
  {
    icon: "shield-checkmark-outline",
    label: "Privacidad y seguridad",
    route: "/(tabs)/settings",
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-primaryClear px-6 pt-8">
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full items-center justify-center mb-4 bg-primaryNormal">
          <Text className="font-heading-bold text-h1 text-white">
            {MOCK_NAME.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="font-heading-semibold text-h4 text-primaryNormalActive">
          {MOCK_NAME}
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover">
          {MOCK_EMAIL}
        </Text>
      </View>

      <View className="bg-white rounded-card border border-primaryLight">
        {OPTIONS.map((option, i) => (
          <Pressable
            key={option.label}
            onPress={() => router.push(option.route as any)}
            className={`flex-row items-center px-4 py-4 ${
              i !== OPTIONS.length - 1 ? "border-b border-primaryLight" : ""
            }`}
          >
            <Ionicons name={option.icon} size={20} color="#8E664B" />
            <Text className="font-body-medium text-sm text-primaryNormalActive flex-1 ml-3">
              {option.label}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#ECB691" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
