import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

export default function BackButton({
  className = "",
  onPress,
  fallbackRoute = "/(tabs)/home",
}: {
  className?: string;
  onPress?: () => void;
  fallbackRoute?: string;
}) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-center gap-1.5 ${className}`}
      hitSlop={8}
    >
      <Ionicons name="arrow-back" size={18} color="#8E664B" />
      <Text className="font-body-medium text-sm text-primaryNormalHover">
        Volver
      </Text>
    </Pressable>
  );
}
