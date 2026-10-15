import { Pressable, View } from "react-native";
import MoodFace from "../../../components/avatar/moodFace";
import Text from "../../../components/ui/text";
import { MOODS, MoodId } from "../../../constants/emotions";

interface Props {
  value: MoodId | null;
  onSelect: (id: MoodId) => void;
  disabled?: boolean;
}

export default function EmotionSelector({ value, onSelect, disabled }: Props) {
  return (
    <View className="flex-row justify-between">
      {MOODS.map((mood) => {
        const active = value === mood.id;
        return (
          <Pressable
            key={mood.id}
            disabled={disabled}
            onPress={() => onSelect(mood.id)}
            accessibilityRole="button"
            accessibilityLabel={`Me siento ${mood.label.toLowerCase()}`}
            accessibilityState={{ selected: active, disabled }}
            className={`items-center ${disabled ? "opacity-60" : ""}`}
          >
            <View
              className={`rounded-full p-0.5 ${
                active
                  ? "border-2 border-primary-normal-active"
                  : "border-2 border-transparent"
              }`}
            >
              <MoodFace mood={mood.id} size={46} />
            </View>
            <Text
              variant="caption2"
              className={`mt-1 ${active ? "text-primary-normal-active" : "text-primary-dark-hover"}`}
            >
              {mood.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
