import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import LivingMoodFace from "../../../components/avatar/livingMoodFace";
import MoodFace from "../../../components/avatar/moodFace";
import Text from "../../../components/ui/text";
import { MOODS, MoodId } from "../../../constants/emotions";
import { MOOD_SOUND, playSound } from "../../../lib/sound";
import { moodService } from "../../../services/moodService";

type LowMood = "fatal" | "mal";
type Stage = "intro" | "breathing" | "done";

// Respiración lenta (~6 por minuto): inhalar 4 s y exhalar 6 s.
const INHALE_MS = 4000;
const EXHALE_MS = 6000;
const CYCLES = 3;
const INTRO_MS = 3200;
const CIRCLE = 240;
const FACE = 92;

// Al exhalar, ondas suaves se alejan del círculo y se desvanecen, como el aire que se suelta.
function Ripple({
  index,
  wave,
  blow,
  color,
}: {
  index: number;
  wave: SharedValue<number>;
  blow: SharedValue<number>;
  color: string;
}) {
  const style = useAnimatedStyle(() => {
    const k = (wave.value + index / 3) % 1;
    return {
      opacity: blow.value * (1 - k) * 0.55,
      transform: [{ scale: 0.6 + 0.65 * k }],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: "absolute",
          width: CIRCLE,
          height: CIRCLE,
          borderRadius: CIRCLE / 2,
          borderWidth: 2,
          borderColor: color,
        },
      ]}
    />
  );
}

const THEMES: Record<
  LowMood,
  {
    gradient: [string, string];
    circle: string;
    text: string;
    intro: string;
  }
> = {
  fatal: {
    gradient: ["#262A4F", "#474C8A"],
    circle: "#CFCAF3",
    text: "#2B2F57",
    intro:
      "Gracias por contarnos cómo estás. Antes de seguir, respiremos juntos un momento.",
  },
  mal: {
    gradient: ["#1B3450", "#36658D"],
    circle: "#C6E2F4",
    text: "#1E3A57",
    intro:
      "Un día difícil se lleva mejor con calma. Respiremos juntos un momento.",
  },
};

const ease = Easing.inOut(Easing.sin);

export default function BreatheScreen() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const params = useLocalSearchParams<{ mood?: string }>();
  const mood: LowMood = params.mood === "fatal" ? "fatal" : "mal";
  const theme = THEMES[mood];
  const [stage, setStage] = useState<Stage>("intro");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [cycle, setCycle] = useState(0);
  const [after, setAfter] = useState<MoodId | null>(null);
  const open = useSharedValue(0);
  const blow = useSharedValue(0);
  const wave = useSharedValue(0);

  const close = () =>
    router.canGoBack() ? router.back() : router.replace("/(tabs)/home");

  useEffect(() => {
    if (stage !== "intro") return;
    const id = setTimeout(() => setStage("breathing"), INTRO_MS);
    return () => clearTimeout(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== "breathing") return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = (n: number) => {
      setCycle(n);
      setPhase("in");
      playSound("breathe-in");
      blow.value = withTiming(0, { duration: 300 });
      open.value = reduced
        ? 0.6
        : withTiming(1, { duration: INHALE_MS, easing: ease });
      timers.push(
        setTimeout(() => {
          setPhase("out");
          playSound("breathe-out");
          blow.value = withSequence(
            withTiming(1, { duration: 500 }),
            withDelay(EXHALE_MS - 1300, withTiming(0, { duration: 800 })),
          );
          open.value = reduced
            ? 0.6
            : withTiming(0, { duration: EXHALE_MS, easing: ease });
          timers.push(
            setTimeout(
              () => (n + 1 >= CYCLES ? setStage("done") : run(n + 1)),
              EXHALE_MS,
            ),
          );
        }, INHALE_MS),
      );
    };
    run(0);
    if (!reduced) {
      wave.value = 0;
      wave.value = withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.linear }),
        -1,
        false,
      );
    }
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimation(open);
      cancelAnimation(wave);
      blow.value = 0;
    };
  }, [stage, open, blow, wave, reduced]);

  useEffect(() => {
    if (stage === "done") playSound("breathe-done");
  }, [stage]);

  // El círculo crece al inhalar y se encoge al exhalar; el halo de atrás respira con más amplitud.
  const circle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.45 + 0.45 * open.value }],
  }));
  const halo = useAnimatedStyle(() => ({
    transform: [{ scale: 0.4 + 0.75 * open.value }],
    opacity: 0.18 + 0.12 * open.value,
  }));

  const chooseAfter = async (id: MoodId) => {
    setAfter(id);
    playSound(MOOD_SOUND[id]);
    try {
      await moodService.save(id);
    } catch {}
    setTimeout(close, 900);
  };

  const title =
    stage === "intro"
      ? "Tómate un respiro"
      : stage === "done"
        ? "Bien hecho"
        : phase === "in"
          ? "Inhala…"
          : "Exhala…";

  const subtitle =
    stage === "intro"
      ? theme.intro
      : stage === "done"
        ? "Date el tiempo que necesites. Cuando quieras, sigue."
        : phase === "in"
          ? "Llena tu pecho despacio"
          : "Suelta el aire sin prisa";

  return (
    <LinearGradient colors={theme.gradient} style={{ flex: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-7">
          <View className="flex-row justify-end pt-2">
            {stage !== "done" && (
              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Saltar la respiración"
                hitSlop={8}
                className="min-h-[44px] flex-row items-center gap-1 rounded-chip bg-white/15 px-4"
              >
                <Text variant="button2" className="text-white">
                  Saltar
                </Text>
                <Ionicons name="close" size={18} color="#FFFFFF" />
              </Pressable>
            )}
          </View>

          <View className="flex-1 items-center justify-center">
            <View
              style={{ width: CIRCLE, height: CIRCLE }}
              className="items-center justify-center"
            >
              <Animated.View
                style={[
                  halo,
                  {
                    position: "absolute",
                    width: CIRCLE,
                    height: CIRCLE,
                    borderRadius: CIRCLE / 2,
                    backgroundColor: theme.circle,
                  },
                ]}
              />
              <Animated.View
                style={[
                  circle,
                  {
                    position: "absolute",
                    width: CIRCLE,
                    height: CIRCLE,
                    borderRadius: CIRCLE / 2,
                    backgroundColor: theme.circle,
                    opacity: 0.6,
                  },
                ]}
              />
              {!reduced &&
                [0, 1, 2].map((i) => (
                  <Ripple key={i} index={i} wave={wave} blow={blow} color={theme.circle} />
                ))}
              <View className="absolute">
                <LivingMoodFace
                  mood={after ?? mood}
                  size={FACE}
                  mode={stage === "breathing" ? "breathe" : "alive"}
                  breath={open}
                  blow={blow}
                />
              </View>
            </View>

            <Animated.View
              key={title}
              entering={FadeIn.duration(500)}
              className="mt-10 items-center"
            >
              <Text
                variant="h3"
                className="text-center text-white"
                accessibilityLiveRegion="polite"
              >
                {title}
              </Text>
              <Text variant="body2" className="mt-2 text-center text-white/90">
                {subtitle}
              </Text>
            </Animated.View>

            {stage === "breathing" && (
              <View
                className="mt-6 flex-row gap-2"
                accessibilityLabel={`Respiración ${cycle + 1} de ${CYCLES}`}
              >
                {Array.from({ length: CYCLES }, (_, i) => (
                  <View
                    key={i}
                    className={`h-2 w-2 rounded-full ${i <= cycle ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </View>
            )}
          </View>

          {stage === "done" && (
            <Animated.View entering={FadeIn.duration(500)} className="pb-6">
              <Text
                variant="caption1"
                className="mb-3 text-center text-white/90"
              >
                ¿Cómo te sientes ahora? (opcional)
              </Text>
              <View
                accessibilityRole="radiogroup"
                className="mb-6 flex-row justify-between"
              >
                {MOODS.map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => chooseAfter(m.id)}
                    disabled={after !== null}
                    accessibilityRole="radio"
                    accessibilityLabel={`Ahora me siento ${m.label.toLowerCase()}`}
                    accessibilityState={{ selected: after === m.id }}
                    className="min-w-[52px] items-center"
                  >
                    <View
                      className={`rounded-full p-0.5 ${
                        after === m.id
                          ? "border-2 border-white"
                          : "border-2 border-transparent"
                      }`}
                    >
                      <MoodFace mood={m.id} size={40} />
                    </View>
                    <Text variant="caption2" className="mt-1 text-white">
                      {m.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={close}
                accessibilityRole="button"
                className="min-h-[48px] items-center justify-center rounded-chip bg-white"
              >
                <Text variant="button1" style={{ color: theme.text }}>
                  {after ? "Gracias por contarnos" : "Listo"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAfter(null);
                  setStage("breathing");
                }}
                accessibilityRole="button"
                className="mt-2 min-h-[44px] items-center justify-center"
              >
                <Text variant="button2" className="text-white underline">
                  Respirar otra vez
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
