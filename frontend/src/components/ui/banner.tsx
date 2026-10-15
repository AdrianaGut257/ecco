import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { colors } from "../../constants/colors";
import Text from "./text";

type Tone = "error" | "info" | "success";

interface Props {
  message: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const SURFACE: Record<Tone, string> = {
  error: "bg-error-light border-error-light-active",
  info: "bg-tertiary-light-active border-tertiary-normal",
  success: "bg-secondary-light-active border-secondary-normal",
};

const TEXT: Record<Tone, string> = {
  error: "text-error-dark-active",
  info: "text-tertiary-dark-active",
  success: "text-secondary-dark-active",
};

const ICON: Record<Tone, keyof typeof Ionicons.glyphMap> = {
  error: "alert-circle-outline",
  info: "information-circle-outline",
  success: "checkmark-circle-outline",
};

const ICON_COLOR: Record<Tone, string> = {
  error: colors.error["dark-active"],
  info: colors.tertiary["dark-active"],
  success: colors.secondary["dark-active"],
};

export default function Banner({
  message,
  tone = "info",
  actionLabel,
  onAction,
  className = "",
}: Props) {
  return (
    <View
      accessibilityRole="alert"
      className={`flex-row items-center gap-2.5 rounded-field border px-3.5 py-3 ${SURFACE[tone]} ${className}`}
    >
      <Ionicons name={ICON[tone]} size={20} color={ICON_COLOR[tone]} />
      <Text variant="body3" className={`flex-1 ${TEXT[tone]}`}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text variant="caption1" className={`underline ${TEXT[tone]}`}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
