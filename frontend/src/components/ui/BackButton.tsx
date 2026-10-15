import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { colors } from "../../constants/colors";
import Text from "./text";

interface Props {
  className?: string;
  label?: string;
  light?: boolean;
  onPress?: () => void;
  fallbackRoute?: string;
}

export default function BackButton({
  className = "",
  label = "Volver",
  light = false,
  onPress,
  fallbackRoute = "/(tabs)/home",
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (router.canGoBack()) return router.back();
    router.replace(fallbackRoute as never);
  };

  const tint = light ? colors.white : colors.primary["dark-hover"];

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-row items-center gap-1.5 self-start ${className}`}
    >
      <Ionicons name="arrow-back" size={18} color={tint} />
      <Text
        variant="body3"
        className={light ? "text-white" : "text-primary-dark-hover"}
      >
        {label}
      </Text>
    </Pressable>
  );
}
