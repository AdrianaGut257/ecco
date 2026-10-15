import Svg, { Circle, Ellipse, Path } from "react-native-svg";
import { findAvatar } from "../../constants/avatars";
import { colors } from "../../constants/colors";

interface Props {
  id: string;
  size?: number;
}

const INK = colors.primary.darker;

export default function Avatar({ id, size = 96 }: Props) {
  const { face, mouth } = findAvatar(id);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle
        cx={20}
        cy={80}
        r={9}
        fill={face}
        stroke={INK}
        strokeOpacity={0.15}
      />
      <Circle
        cx={80}
        cy={80}
        r={9}
        fill={face}
        stroke={INK}
        strokeOpacity={0.15}
      />
      <Ellipse cx={50} cy={50} rx={40} ry={36} fill={face} />
      <Ellipse cx={35} cy={46} rx={5} ry={6.5} fill={INK} />
      <Ellipse cx={65} cy={46} rx={5} ry={6.5} fill={INK} />
      <Circle cx={36.8} cy={43.5} r={1.8} fill={colors.white} />
      <Circle cx={66.8} cy={43.5} r={1.8} fill={colors.white} />
      <Ellipse
        cx={24}
        cy={58}
        rx={6}
        ry={4}
        fill={colors.error.normal}
        opacity={0.35}
      />
      <Ellipse
        cx={76}
        cy={58}
        rx={6}
        ry={4}
        fill={colors.error.normal}
        opacity={0.35}
      />
      {mouth === "smile" ? (
        <Path
          d="M42 60 Q50 68 58 60"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <Path d="M42 59 Q50 72 58 59 Z" fill={INK} />
      )}
    </Svg>
  );
}
