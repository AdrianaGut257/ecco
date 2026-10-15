import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { colors } from "../../constants/colors";
import Text from "./text";

type Tone = "primary" | "secondary";

interface Props {
  label: string;
  selected?: boolean;
  tone?: Tone;
  onPress?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const IDLE: Record<Tone, string> = {
  primary: "bg-primary-light border-primary-light-active",
  secondary: "bg-secondary-light border-secondary-light-active",
};

const ACTIVE: Record<Tone, string> = {
  primary: "bg-primary-normal border-primary-normal",
  secondary: "bg-secondary-normal border-secondary-normal",
};

const IDLE_LABEL: Record<Tone, string> = {
  primary: "text-primary-dark-hover",
  secondary: "text-secondary-dark-hover",
};

export default function Chip({
  label,
  selected = false,
  tone = "primary",
  onPress,
  onRemove,
  disabled,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-chip border px-3 py-1.5 ${
        selected ? ACTIVE[tone] : IDLE[tone]
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Text
        variant="caption1"
        className={selected ? "text-white" : IDLE_LABEL[tone]}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Quitar ${label}`}
        >
          <Ionicons name="close" size={12} color={colors.white} />
        </Pressable>
      )}
    </Pressable>
  );
}
