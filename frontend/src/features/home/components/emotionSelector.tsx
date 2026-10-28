import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import LivingMoodFace from "../../../components/avatar/livingMoodFace";
import Text from "../../../components/ui/text";
import { MOODS, MoodId } from "../../../constants/emotions";
import { MOOD_SOUND, playSound } from "../../../lib/sound";

interface Props {
  value: MoodId | null;
  onSelect: (id: MoodId) => void;
  disabled?: boolean;
}

const ease = Easing.inOut(Easing.ease);

function MoodOption({
  id,
  label,
  index,
  active,
  disabled,
  onSelect,
}: {
  id: MoodId;
  label: string;
  index: number;
  active: boolean;
  disabled?: boolean;
  onSelect: (id: MoodId) => void;
}) {
  const reduced = useReducedMotion();
  const enter = useSharedValue(reduced ? 1 : 0);
  const lift = useSharedValue(0);
  const tilt = useSharedValue(0);
  const pulse = useSharedValue(1);
  const chosen = useSharedValue(active ? 1.12 : 1);

  useEffect(() => {
    chosen.value = withSpring(active ? 1.12 : 1, { damping: 12 });
  }, [active, chosen]);

  useEffect(() => {
    if (reduced) return;
    enter.value = withDelay(
      index * 70,
      withSpring(1, { damping: 11, stiffness: 140 }),
    );
  }, [reduced, enter, index]);

  // Cada emoción reacciona con su propia personalidad al elegirla.
  const react = () => {
    if (reduced) return;
    switch (id) {
      case "feliz":
        lift.value = withSequence(
          withTiming(-12, { duration: 160, easing: Easing.out(Easing.quad) }),
          withSpring(0, { damping: 6, stiffness: 180 }),
        );
        tilt.value = withSequence(
          withTiming(-12, { duration: 110 }),
          withTiming(12, { duration: 140 }),
          withTiming(-6, { duration: 120 }),
          withSpring(0),
        );
        break;
      case "bien":
        tilt.value = withSequence(
          withTiming(-10, { duration: 160 }),
          withTiming(10, { duration: 200 }),
          withSpring(0, { damping: 8 }),
        );
        break;
      case "normal":
        pulse.value = withSequence(
          withTiming(1.12, { duration: 220, easing: ease }),
          withSpring(1, { damping: 10 }),
        );
        break;
      case "mal":
        lift.value = withSequence(
          withTiming(5, { duration: 600, easing: ease }),
          withTiming(0, { duration: 700, easing: ease }),
        );
        pulse.value = withSequence(
          withTiming(0.94, { duration: 600, easing: ease }),
          withTiming(1, { duration: 700, easing: ease }),
        );
        break;
      case "fatal":
        tilt.value = withSequence(
          withTiming(-4, { duration: 70 }),
          withRepeat(withTiming(4, { duration: 90 }), 4, true),
          withTiming(0, { duration: 80 }),
        );
        lift.value = withDelay(
          420,
          withSequence(
            withTiming(6, { duration: 700, easing: ease }),
            withTiming(0, { duration: 800, easing: ease }),
          ),
        );
        break;
    }
  };

  const style = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: lift.value + (1 - enter.value) * 10 },
      { rotate: `${tilt.value}deg` },
      { scale: pulse.value * chosen.value * (0.6 + 0.4 * enter.value) },
    ],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        react();
        playSound(MOOD_SOUND[id]);
        onSelect(id);
      }}
      accessibilityRole="radio"
      accessibilityLabel={`Me siento ${label.toLowerCase()}`}
      accessibilityState={{ selected: active, disabled }}
      className="min-w-[52px] items-center"
    >
      <Animated.View
        style={style}
        className={`rounded-full p-0.5 ${
          active
            ? "border-2 border-primary-dark-hover"
            : "border-2 border-transparent"
        }`}
      >
        <LivingMoodFace mood={id} size={46} delay={index * 350} />
      </Animated.View>
      <Text
        variant="caption2"
        className={`mt-1 ${active ? "text-primary-dark-active" : "text-primary-dark-hover"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function EmotionSelector({ value, onSelect, disabled }: Props) {
  return (
    <View accessibilityRole="radiogroup" className="flex-row justify-between">
      {MOODS.map((mood, index) => (
        <MoodOption
          key={mood.id}
          id={mood.id}
          label={mood.label}
          index={index}
          active={value === mood.id}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}
