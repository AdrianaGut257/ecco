import Svg, { Ellipse, G, Path } from "react-native-svg";
import { colors } from "../../constants/colors";
import { PLANT_STAGES } from "../../constants/plant";

interface Props {
  stage: number;
  size?: number;
}

const SOIL = colors.primary["dark-hover"];
const STEM = colors.secondary["dark-hover"];
const LEAF = colors.secondary.normal;
const PETAL = colors.error["light-active"];
const PETAL_EDGE = colors.error.normal;
const CENTER = colors.mood.bien;

const petals = (count: number, radius: number, cx: number, cy: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i;
    return (
      <Ellipse
        key={i}
        cx={cx}
        cy={cy - radius}
        rx={radius * 0.62}
        ry={radius}
        fill={PETAL}
        stroke={PETAL_EDGE}
        strokeWidth={0.8}
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });

export default function Plant({ stage, size = 120 }: Props) {
  const level = Math.min(Math.max(Math.round(stage), 0), PLANT_STAGES - 1);
  const top = [86, 70, 56, 44, 40, 34][level];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx={50} cy={88} rx={22} ry={6} fill={SOIL} opacity={0.35} />
      {level === 0 && (
        <Ellipse
          cx={50}
          cy={83}
          rx={6}
          ry={4.5}
          fill={SOIL}
          transform="rotate(-18 50 83)"
        />
      )}
      {level >= 1 && (
        <Path
          d={`M50 86 C49 ${(86 + top) / 2} 51 ${(86 + top) / 2} 50 ${top}`}
          stroke={STEM}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {level >= 1 && (
        <G>
          <Ellipse
            cx={42}
            cy={top + 8}
            rx={8}
            ry={4.5}
            fill={LEAF}
            transform={`rotate(-30 42 ${top + 8})`}
          />
          <Ellipse
            cx={58}
            cy={top + 14}
            rx={8}
            ry={4.5}
            fill={LEAF}
            transform={`rotate(30 58 ${top + 14})`}
          />
        </G>
      )}
      {level === 3 && (
        <Ellipse cx={50} cy={top - 2} rx={6} ry={8} fill={PETAL_EDGE} />
      )}
      {level === 4 && (
        <G>
          {petals(5, 8, 50, top)}
          <Ellipse cx={50} cy={top} rx={4} ry={4} fill={CENTER} />
        </G>
      )}
      {level === 5 && (
        <G>
          {petals(8, 10, 50, top)}
          <Ellipse cx={50} cy={top} rx={5.5} ry={5.5} fill={CENTER} />
        </G>
      )}
    </Svg>
  );
}
