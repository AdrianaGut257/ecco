import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { colors } from "../../constants/colors";
import Wordmark from "../ui/wordmark";

interface Props {
  onBack?: () => void;
  showBack?: boolean;
  showSettings?: boolean;
  onScenery?: boolean;
}

export default function AppHeader({
  onBack,
  showBack = false,
  showSettings = true,
  onScenery = false,
}: Props) {
  const router = useRouter();
  const tint = onScenery ? colors.primary.darker : colors.primary["dark-hover"];

  const goBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  return (
    <View className="h-12 flex-row items-center justify-between px-6">
      <View className="flex-row items-center gap-2">
        {showBack && (
          <Pressable
            onPress={goBack}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Ionicons name="arrow-back" size={22} color={tint} />
          </Pressable>
        )}
        <Wordmark className={onScenery ? "text-primary-darker" : ""} />
      </View>
      {showSettings ? (
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Ajustes"
        >
          <Ionicons name="settings-outline" size={22} color={tint} />
        </Pressable>
      ) : (
        <View />
      )}
    </View>
  );
}
