import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Background = "light" | "primary" | "secondary" | "tertiary";

interface Props {
  children: ReactNode;
  footer?: ReactNode;
  background?: Background;
  scroll?: boolean;
  padded?: boolean;
  flush?: boolean;
  center?: boolean;
  className?: string;
}

const BACKGROUNDS: Record<Background, string> = {
  light: "bg-primary-light",
  primary: "bg-primary-dark-hover",
  secondary: "bg-secondary-dark-hover",
  tertiary: "bg-tertiary-dark-active",
};

export default function Container({
  children,
  footer,
  background = "light",
  scroll = false,
  padded = true,
  flush = false,
  center = false,
  className = "",
}: Props) {
  const padding = padded ? "px-7" : "";
  const vertical = flush ? "" : "py-6";
  const alignment = center ? "justify-center" : "";

  return (
    <SafeAreaView className={`flex-1 ${BACKGROUNDS[background]}`}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={`grow ${vertical} ${padding} ${alignment} ${className}`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View
            className={`flex-1 ${vertical} ${padding} ${alignment} ${className}`}
          >
            {children}
          </View>
        )}
        {footer && <View className={`pb-6 pt-2 ${padding}`}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
