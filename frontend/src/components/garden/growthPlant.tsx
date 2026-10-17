import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../constants/colors";
import { PLANT_STAGES, STAGE_NAMES } from "../../constants/plant";
import Plant from "./plant";

interface Props {
  stage: number;
  size?: number;
  onGrow?: () => void;
}

export default function GrowthPlant({ stage, size = 170, onGrow }: Props) {
  const previous = useRef(stage);
  const scale = useSharedValue(1);
  const sparkle = useSharedValue(0);

  useEffect(() => {
    if (stage > previous.current) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 6, stiffness: 220 }),
        withSpring(1, { damping: 10, stiffness: 160 }),
      );
      sparkle.value = withSequence(
        withTiming(1, { duration: 250 }),
        withDelay(900, withTiming(0, { duration: 500 })),
      );
      onGrow?.();
    }
    previous.current = stage;
  }, [stage, scale, sparkle, onGrow]);

  const plantStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
    transform: [{ translateY: -10 * sparkle.value }],
  }));

  return (
    <View
      accessible
      accessibilityLabel={`Su planta: ${STAGE_NAMES[stage] ?? ""}, etapa ${stage + 1} de ${PLANT_STAGES}`}
      style={{ width: size, height: size }}
      className="items-center justify-center rounded-full bg-secondary-light-active"
    >
      <Animated.View style={plantStyle}>
        <Plant stage={stage} size={size * 0.8} />
      </Animated.View>
      <Animated.View style={sparkleStyle} className="absolute right-1 top-1">
        <Ionicons name="sparkles" size={size * 0.2} color={colors.mood.bien} />
      </Animated.View>
    </View>
  );
}
