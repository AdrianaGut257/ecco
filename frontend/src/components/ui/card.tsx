import { ReactNode } from "react";
import { View, ViewProps } from "react-native";

type Tone = "soft" | "white" | "green" | "blue";

interface Props extends ViewProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const TONES: Record<Tone, string> = {
  soft: "bg-primary-light-active",
  white: "bg-white border border-primary-light-active",
  green: "bg-secondary-light-active",
  blue: "bg-tertiary-light-active",
};

export default function Card({
  tone = "soft",
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <View className={`rounded-card p-4 ${TONES[tone]} ${className}`} {...rest}>
      {children}
    </View>
  );
}
