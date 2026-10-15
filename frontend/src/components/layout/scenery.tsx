import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import { colors } from "../../constants/colors";
import type { TimeOfDay } from "../../hooks/useTimeOfDay";

interface Props {
  time: TimeOfDay;
  children: ReactNode;
}

const SKY: Record<TimeOfDay, [string, string, string]> = {
  day: [
    colors.mood.normal,
    colors.secondary["light-active"],
    colors.secondary.light,
  ],
  night: [
    colors.tertiary["light-active"],
    colors.secondary["light-active"],
    colors.secondary.light,
  ],
};

export default function Scenery({ time, children }: Props) {
  return (
    <View className="flex-1">
      <LinearGradient colors={SKY[time]} style={StyleSheet.absoluteFill} />
      <View className="absolute right-6 top-14">
        <Ionicons
          name={time === "day" ? "sunny" : "moon"}
          size={44}
          color={colors.mood.bien}
        />
      </View>
      <View className="absolute inset-x-0 bottom-0" pointerEvents="none">
        <Svg
          width="100%"
          height={140}
          viewBox="0 0 400 140"
          preserveAspectRatio="none"
        >
          <Ellipse
            cx={90}
            cy={140}
            rx={190}
            ry={90}
            fill={colors.secondary.normal}
            opacity={0.55}
          />
          <Ellipse
            cx={320}
            cy={150}
            rx={200}
            ry={90}
            fill={colors.secondary["normal-hover"]}
            opacity={0.5}
          />
        </Svg>
      </View>
      {children}
    </View>
  );
}
