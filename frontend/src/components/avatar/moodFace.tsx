import { Image } from "expo-image";
import type { MoodId } from "../../constants/emotions";

interface Props {
  mood: MoodId;
  size?: number;
}

const SOURCES: Record<MoodId, number> = {
  fatal: require("../../../assets/svg/emotions/awful.svg"),
  mal: require("../../../assets/svg/emotions/bad.svg"),
  normal: require("../../../assets/svg/emotions/okay.svg"),
  bien: require("../../../assets/svg/emotions/good.svg"),
  feliz: require("../../../assets/svg/emotions/happy.svg"),
};

export default function MoodFace({ mood, size = 56 }: Props) {
  return (
    <Image
      source={SOURCES[mood]}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}
