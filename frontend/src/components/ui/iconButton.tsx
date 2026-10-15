import { Ionicons } from "@expo/vector-icons";
import { Pressable, PressableProps } from "react-native";
import { colors } from "../../constants/colors";
import type { IconName } from "./button";

type Tone = "primary" | "secondary" | "tertiary" | "error";

interface Props extends Omit<PressableProps, "children"> {
  icon: IconName;
  label: string;
  tone?: Tone;
  variant?: "filled" | "outlined";
  size?: number;
  className?: string;
}

const FILLED: Record<Tone, string> = {
  primary: "bg-primary-normal active:bg-primary-normal-active",
  secondary: "bg-secondary-normal active:bg-secondary-normal-active",
  tertiary: "bg-tertiary-normal active:bg-tertiary-normal-active",
  error: "bg-error-normal active:bg-error-normal-active",
};

const OUTLINED: Record<Tone, string> = {
  primary: "border border-primary-normal active:bg-primary-light-active",
  secondary: "border border-secondary-normal active:bg-secondary-light-active",
  tertiary: "border border-tertiary-normal active:bg-tertiary-light-active",
  error: "border border-error-normal active:bg-error-light-active",
};

export default function IconButton({
  icon,
  label,
  tone = "primary",
  variant = "filled",
  size = 36,
  disabled,
  className = "",
  ...rest
}: Props) {
  const filled = variant === "filled";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={8}
      style={{ width: size, height: size }}
      className={`items-center justify-center rounded-full ${
        filled ? FILLED[tone] : OUTLINED[tone]
      } ${disabled ? "opacity-50" : ""} ${className}`}
      {...rest}
    >
      <Ionicons
        name={icon}
        size={size * 0.5}
        color={filled ? colors.white : colors[tone]["normal-active"]}
      />
    </Pressable>
  );
}
