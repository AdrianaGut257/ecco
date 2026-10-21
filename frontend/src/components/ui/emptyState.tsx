import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { colors } from "../../constants/colors";
import Button from "./button";
import Text from "./text";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View className="items-center px-6 py-10">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary-light-active">
        <Ionicons name={icon} size={36} color={colors.primary["dark-hover"]} />
      </View>
      <Text variant="subtitle2" className="mb-1 text-center">
        {title}
      </Text>
      <Text
        variant="body3"
        className="mb-5 max-w-[260px] text-center text-primary-dark-hover"
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button fullWidth={false} onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
