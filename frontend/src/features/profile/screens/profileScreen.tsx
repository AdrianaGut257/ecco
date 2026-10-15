import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import Avatar from "../../../components/avatar/avatar";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Card from "../../../components/ui/card";
import Chip from "../../../components/ui/chip";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { useAuth } from "../../auth/hooks/useAuth";

const OPTIONS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
}[] = [
  { icon: "heart-outline", label: "Mis intereses", route: "/editInterests" },
  { icon: "happy-outline", label: "Cambiar avatar", route: "/avatarEditor" },
  {
    icon: "shield-checkmark-outline",
    label: "Privacidad y seguridad",
    route: "/(tabs)/settings",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Container flush padded={false} scroll>
      <AppHeader />
      <View className="px-7 pt-4">
        <View className="mb-6 items-center">
          <View className="mb-3 h-28 w-28 items-center justify-center rounded-full bg-primary-light-active">
            <Avatar id={user?.avatarId ?? "a1"} size={92} />
          </View>
          <Text variant="subtitle1">{user?.username ?? "Tu perfil"}</Text>
          <Text variant="caption1" className="text-primary-dark-hover">
            {user?.email}
          </Text>
        </View>

        {user && user.interests.length > 0 && (
          <View className="mb-6 flex-row flex-wrap justify-center gap-2">
            {user.interests.slice(0, 8).map((interest) => (
              <Chip key={interest} label={interest} selected />
            ))}
          </View>
        )}

        <Card tone="white" className="p-0">
          {OPTIONS.map((option, i) => (
            <Pressable
              key={option.label}
              onPress={() => router.push(option.route as never)}
              accessibilityRole="button"
              className={`flex-row items-center px-4 py-4 ${
                i !== OPTIONS.length - 1
                  ? "border-b border-primary-light-active"
                  : ""
              }`}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={colors.primary["normal-active"]}
              />
              <Text variant="body3" className="ml-3 flex-1">
                {option.label}
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
    </Container>
  );
}
