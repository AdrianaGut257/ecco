import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline" | "white";
type Size = "sm" | "md" | "lg";
type IconName = ComponentProps<typeof Ionicons>["name"];

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
}

const containerStyles: Record<Variant, string> = {
  primary: "bg-primaryNormal",
  secondary: "bg-secondaryNormal",
  outline: "bg-transparent border border-primaryNormal",
  white: "bg-white",
};

const textStyles: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-primaryNormal",
  white: "text-primaryNormal",
};

const disabledContainerStyles: Record<Variant, string> = {
  primary: "bg-primaryLightActive",
  secondary: "bg-secondaryLightActive",
  outline: "bg-transparent border border-primaryLightActive",
  white: "bg-white/60",
};

const iconColors: Record<Variant, string> = {
  primary: "#FFFFFF",
  secondary: "#FFFFFF",
  outline: "#E8A77B",
  white: "#E8A77B",
};

const sizeStyles: Record<Size, string> = {
  sm: "py-2.5 px-4",
  md: "py-3.5 px-6",
  lg: "py-4 px-8",
};

const textSizeStyles: Record<Size, string> = {
  sm: "text-button text-sm",
  md: "text-button",
  lg: "text-button text-lg",
};

const iconSizes: Record<Size, number> = {
  sm: 16,
  md: 20,
  lg: 22,
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const iconColor = iconColors[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      className={`rounded-chip items-center justify-center flex-row gap-2 ${sizeStyles[size]} ${
        isDisabled ? disabledContainerStyles[variant] : containerStyles[variant]
      }`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "white" ? "#E8A77B" : "#FFFFFF"
          }
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons name={icon} size={iconSizes[size]} color={iconColor} />
          )}
          <Text
            className={`font-heading-semibold ${textSizeStyles[size]} ${textStyles[variant]}`}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons name={icon} size={iconSizes[size]} color={iconColor} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
