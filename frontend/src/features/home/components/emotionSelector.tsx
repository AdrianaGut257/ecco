import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import MoodFace from "../../../components/avatar/moodFace";
import Text from "../../../components/ui/text";
import { MOODS, MoodId } from "../../../constants/emotions";

interface Props {
  value: MoodId | null;
  onSelect: (id: MoodId) => void;
  disabled?: boolean;
}

function MoodOption({
  id,
  label,
  active,
  disabled,
  onSelect,
}: {
  id: MoodId;
  label: string;
  active: boolean;
  disabled?: boolean;
  onSelect: (id: MoodId) => void;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(active ? 1.12 : 1, { damping: 12 }) }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onSelect(id)}
      accessibilityRole="radio"
      accessibilityLabel={`Me siento ${label.toLowerCase()}`}
      accessibilityState={{ selected: active, disabled }}
      className="min-w-[52px] items-center"
    >
      <Animated.View
        style={style}
        className={`rounded-full p-0.5 ${
          active ? "border-2 border-primary-dark-hover" : "border-2 border-transparent"
        }`}
      >
        <MoodFace mood={id} size={46} />
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
      {MOODS.map((mood) => (
        <MoodOption
          key={mood.id}
          id={mood.id}
          label={mood.label}
          active={value === mood.id}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}
