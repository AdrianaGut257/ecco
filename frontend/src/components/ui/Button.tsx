import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import Text from "./text";

export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "white";
type Variant = "filled" | "outlined";
type Size = "big" | "small";
export type IconName = ComponentProps<typeof Ionicons>["name"];

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: ReactNode;
  color?: ButtonColor;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

const FILLED: Record<ButtonColor, string> = {
  primary:
    "bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active",
  secondary:
    "bg-secondary-normal hover:bg-secondary-normal-hover active:bg-secondary-normal-active",
  tertiary:
    "bg-tertiary-normal hover:bg-tertiary-normal-hover active:bg-tertiary-normal-active",
  error:
    "bg-error-normal hover:bg-error-normal-hover active:bg-error-normal-active",
  white: "bg-white hover:bg-primary-light-hover active:bg-primary-light-active",
};

const FILLED_DISABLED: Record<ButtonColor, string> = {
  primary: "bg-primary-light-active",
  secondary: "bg-secondary-light-active",
  tertiary: "bg-tertiary-light-active",
  error: "bg-error-light-active",
  white: "bg-white/60",
};

const OUTLINED: Record<ButtonColor, string> = {
  primary:
    "border border-primary-normal hover:bg-primary-light-hover active:bg-primary-light-active",
  secondary:
    "border border-secondary-normal hover:bg-secondary-light-hover active:bg-secondary-light-active",
  tertiary:
    "border border-tertiary-normal hover:bg-tertiary-light-hover active:bg-tertiary-light-active",
  error:
    "border border-error-normal hover:bg-error-light-hover active:bg-error-light-active",
  white: "border border-white active:bg-white/20",
};

const OUTLINED_DISABLED: Record<ButtonColor, string> = {
  primary: "border border-primary-light-active",
  secondary: "border border-secondary-light-active",
  tertiary: "border border-tertiary-light-active",
  error: "border border-error-light-active",
  white: "border border-white/50",
};

const LABEL_FILLED: Record<ButtonColor, string> = {
  primary: "text-white",
  secondary: "text-white",
  tertiary: "text-white",
  error: "text-white",
  white: "text-primary-normal-active",
};

const LABEL_OUTLINED: Record<ButtonColor, string> = {
  primary: "text-primary-normal-active",
  secondary: "text-secondary-dark",
  tertiary: "text-tertiary-dark",
  error: "text-error-normal-active",
  white: "text-white",
};

const LABEL_DISABLED: Record<ButtonColor, string> = {
  primary: "text-primary-normal",
  secondary: "text-secondary-normal",
  tertiary: "text-tertiary-normal",
  error: "text-error-light-active",
  white: "text-primary-normal",
};

const iconColor = (color: ButtonColor, variant: Variant, disabled: boolean) => {
  if (color === "white") {
    return variant === "outlined" && !disabled
      ? colors.white
      : colors.primary["normal-active"];
  }
  if (disabled) return colors[color].normal;
  return variant === "filled" ? colors.white : colors[color]["normal-active"];
};

export default function Button({
  children,
  color = "primary",
  variant = "filled",
  size = "big",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "right",
  fullWidth = true,
  className = "",
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  const filled = variant === "filled";

  const surface = filled
    ? inactive
      ? FILLED_DISABLED[color]
      : FILLED[color]
    : inactive
      ? OUTLINED_DISABLED[color]
      : OUTLINED[color];

  const label = inactive
    ? LABEL_DISABLED[color]
    : filled
      ? LABEL_FILLED[color]
      : LABEL_OUTLINED[color];

  const padding = size === "big" ? "px-6 py-3.5" : "px-4 py-2";
  const iconSize = size === "big" ? 20 : 16;
  const glyph = icon ? (
    <Ionicons
      name={icon}
      size={iconSize}
      color={iconColor(color, variant, inactive)}
    />
  ) : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={`flex-row items-center justify-center gap-2 rounded-chip ${padding} ${surface} ${fullWidth ? "w-full" : "self-start"} ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={iconColor(color, variant, false)}
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {iconPosition === "left" && glyph}
          <Text
            variant={size === "big" ? "button1" : "button2"}
            className={label}
          >
            {children}
          </Text>
          {iconPosition === "right" && glyph}
        </View>
      )}
    </Pressable>
  );
}
