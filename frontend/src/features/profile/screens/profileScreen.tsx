import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import LivingAvatar from "../../../components/avatar/livingAvatar";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { useAuth } from "../../auth/hooks/useAuth";
import MoodWeek from "../components/moodWeek";

const OPTIONS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: "/avatarEditor" | "/editInterests";
}[] = [
  { icon: "color-palette-outline", label: "Personalizar mi avatar", route: "/avatarEditor" },
  { icon: "heart-outline", label: "Mis intereses", route: "/editInterests" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Container flush padded={false} scroll>
      <AppHeader />
      <View className="px-7 pb-8 pt-4">
        <View className="mb-6 items-center">
          <LivingAvatar config={user?.avatar} size={120} label="Tu avatar" greet interactive spontaneous />
          <Text variant="subtitle1" className="mt-3">
            {user?.username ?? "Tu perfil"}
          </Text>
          <Text variant="caption1" className="text-primary-dark-hover">
            {user?.email}
          </Text>
        </View>

        {user && user.interests.length > 0 && (
          <View className="mb-6 flex-row flex-wrap justify-center gap-2">
            {user.interests.slice(0, 10).map((interest) => (
              <Chip key={interest} label={interest} />
            ))}
          </View>
        )}

        <MoodWeek />

        <Card tone="white" className="p-0">
          {OPTIONS.map((option, i) => (
            <Pressable
              key={option.label}
              onPress={() => router.push(option.route)}
              accessibilityRole="button"
              className={`min-h-[56px] flex-row items-center px-4 py-4 ${
                i !== OPTIONS.length - 1 ? "border-b border-primary-light-active" : ""
              }`}
            >
              <Ionicons name={option.icon} size={20} color={colors.primary["dark-hover"]} />
              <Text variant="body3" className="ml-3 flex-1">
                {option.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.primary["dark-hover"]} />
            </Pressable>
          ))}
        </Card>
      </View>
    </Container>
  );
}
