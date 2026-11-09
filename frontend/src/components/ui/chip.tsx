import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { useColors } from "../../theme";
import PressableScale from "./pressableScale";
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
  primary: "text-primary-ink",
  secondary: "text-secondary-ink",
};

export default function Chip({
  label,
  selected = false,
  tone = "primary",
  onPress,
  onRemove,
  disabled,
}: Props) {
  const c = useColors();
  const activeIcon = c[tone].ink;
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
            <Ionicons name="close" size={14} color={activeIcon} />
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <PressableScale
      scaleTo={0.93}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={className}
    >
      {selected && (
        <Animated.View entering={ZoomIn.springify().damping(11)}>
          <Ionicons name="checkmark" size={13} color={activeIcon} />
        </Animated.View>
      )}
      <Text
        variant="caption1"
        className={selected ? ACTIVE_LABEL[tone] : IDLE_LABEL[tone]}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
