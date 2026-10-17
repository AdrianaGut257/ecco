import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
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

const ACTIVE_LABEL: Record<Tone, string> = {
  primary: "text-primary-darker",
  secondary: "text-secondary-darker",
};

const ACTIVE_ICON: Record<Tone, string> = {
  primary: colors.primary.darker,
  secondary: colors.secondary.darker,
};

export default function Chip({
  label,
  selected = false,
  tone = "primary",
  onPress,
  onRemove,
  disabled,
}: Props) {
  const className = `min-h-[36px] flex-row items-center gap-1.5 rounded-chip border px-3.5 py-2 ${
    selected ? ACTIVE[tone] : IDLE[tone]
  } ${disabled ? "opacity-50" : ""}`;

  if (!onPress) {
    return (
      <View className={className}>
        <Text
          variant="caption1"
          className={selected ? ACTIVE_LABEL[tone] : IDLE_LABEL[tone]}
        >
          {label}
        </Text>
        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`Quitar ${label}`}
          >
            <Ionicons name="close" size={14} color={ACTIVE_ICON[tone]} />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={className}
    >
      {selected && (
        <Ionicons name="checkmark" size={13} color={ACTIVE_ICON[tone]} />
      )}
      <Text
        variant="caption1"
        className={selected ? ACTIVE_LABEL[tone] : IDLE_LABEL[tone]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
