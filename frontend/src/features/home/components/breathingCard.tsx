import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Text from "../../../components/ui/text";

const PHASE_MS = 4000;
const CYCLES = 3;

export default function BreathingCard() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (!running) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PHASE_MS, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: PHASE_MS, easing: Easing.inOut(Easing.ease) }),
      ),
      CYCLES,
    );
    let ticks = 0;
    setPhase("in");
    const id = setInterval(() => {
      ticks += 1;
      if (ticks >= CYCLES * 2) {
        clearInterval(id);
        setRunning(false);
        return;
      }
      setPhase(ticks % 2 === 0 ? "in" : "out");
    }, PHASE_MS);
    return () => {
      clearInterval(id);
      cancelAnimation(scale);
    };
  }, [running, scale]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View className="flex-row items-center gap-4 rounded-field bg-tertiary-light-active p-3">
      <View className="h-14 w-14 items-center justify-center">
        <Animated.View
          style={circle}
          className="h-14 w-14 rounded-full bg-tertiary-normal"
        />
      </View>
      <View className="flex-1">
        {running ? (
          <Text
            variant="body3"
            className="text-tertiary-darker"
            accessibilityLiveRegion="polite"
          >
            {phase === "in" ? "Inhala despacio…" : "Suelta el aire…"}
          </Text>
        ) : (
          <>
            <Text variant="body3" className="text-tertiary-darker">
              ¿Respiramos un momento?
            </Text>
            <Pressable
              onPress={() => setRunning(true)}
              accessibilityRole="button"
              hitSlop={8}
              className="mt-1 self-start"
            >
              <Text variant="caption1" className="text-tertiary-darker underline">
                Empezar (25 segundos)
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
