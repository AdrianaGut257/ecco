import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { colors } from "../../constants/colors";
import type { MoodId } from "../../constants/emotions";

interface Props {
  mood: MoodId;
  size?: number;
}

const INK = colors.primary.darker;

const MOUTHS: Record<MoodId, string> = {
  fatal: "M36 70 Q50 56 64 70",
  mal: "M38 68 Q50 60 62 68",
  normal: "M38 66 L62 66",
  bien: "M38 62 Q50 72 62 62",
  feliz: "M34 60 Q50 80 66 60",
};

export default function MoodFace({ mood, size = 56 }: Props) {
  const closedEyes = mood === "fatal";

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={46} fill={colors.mood[mood]} />
      {closedEyes ? (
        <>
          <Path d="M28 44 L42 44" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <Path d="M58 44 L72 44" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Ellipse cx={35} cy={44} rx={5} ry={6.5} fill={INK} />
          <Ellipse cx={65} cy={44} rx={5} ry={6.5} fill={INK} />
        </>
      )}
      <Path
        d={MOUTHS[mood]}
        stroke={INK}
        strokeWidth={4}
        strokeLinecap="round"
        fill={mood === "feliz" ? INK : "none"}
      />
    </Svg>
  );
}
