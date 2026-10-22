import Animated, { ZoomIn } from "react-native-reanimated";
import LivingMoodFace from "../../../components/avatar/livingMoodFace";
import PressableScale from "../../../components/ui/pressableScale";
import Text from "../../../components/ui/text";
import type { MoodId } from "../../../constants/emotions";
import { REACTIONS } from "../../../constants/tones";

interface Props {
  current?: MoodId | null;
  onPick: (reaction: MoodId | null) => void;
}

// Cinco reacciones con las caras propias de la app. Tocar la que ya elegiste la quita.
export default function ReactionBar({ current, onPick }: Props) {
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(16)}
      accessibilityRole="menu"
      className="mt-1.5 flex-row rounded-[24px] border border-primary-light-active bg-white p-1"
      style={{
        shadowColor: "#553B29",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      {REACTIONS.map((r, i) => {
        const selected = current === r.id;
        return (
          <PressableScale
            key={r.id}
            scaleTo={0.85}
            onPress={() => onPick(selected ? null : r.id)}
            accessibilityRole="menuitem"
            accessibilityLabel={selected ? `Quitar "${r.label}"` : r.label}
            accessibilityState={{ selected }}
            className={`w-[60px] items-center rounded-2xl py-1 ${
              selected ? "bg-primary-light-active" : ""
            }`}
          >
            <LivingMoodFace mood={r.id} size={34} delay={i * 180} />
            <Text
              variant="caption1"
              numberOfLines={1}
              className="mt-0.5 tracking-normal text-primary-dark-active"
            >
              {r.label}
            </Text>
          </PressableScale>
        );
      })}
    </Animated.View>
  );
}
