import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Text from "../../../components/ui/text";
import type { Tone } from "../../../constants/tones";

// Cada tono tiene su gesto: el corazón late, la carita se ríe, el sol gira, la duda se inclina y la flor se abre.
export default function ToneTag({ tone, animate }: { tone: Tone; animate: boolean }) {
  const reduced = useReducedMotion();
  const k = useSharedValue(animate && !reduced ? 0 : 1);

  useEffect(() => {
    if (!animate || reduced) return;
    k.value = withDelay(
      250,
      withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
    );
  }, [animate, reduced, k]);

  const style = useAnimatedStyle(() => {
    const p = k.value;
    const wave = Math.sin(p * Math.PI * 4) * (1 - p);
    switch (tone.id) {
      case "warm":
        return { transform: [{ scale: 1 + 0.45 * Math.abs(wave) }] };
      case "joke":
        return { transform: [{ rotate: `${22 * wave}deg` }] };
      case "cheer":
        return { transform: [{ rotate: `${360 * p}deg` }, { scale: 1 + 0.3 * Math.sin(p * Math.PI) }] };
      case "curious":
        return { transform: [{ rotate: `${-20 * Math.sin(p * Math.PI)}deg` }, { translateY: -3 * Math.sin(p * Math.PI) }] };
      case "thanks":
        return { transform: [{ scale: 0.4 + 0.6 * p + 0.25 * Math.sin(p * Math.PI) }, { rotate: `${90 * (1 - p)}deg` }] };
      default:
        return {};
    }
  });

  return (
    <View className="mb-1 flex-row items-center gap-1">
      <Animated.View style={style}>
        <Ionicons name={tone.icon} size={13} color={tone.ink} />
      </Animated.View>
      <Text variant="caption2" style={{ color: tone.ink }}>
        {tone.label.toLowerCase()}
      </Text>
    </View>
  );
}
