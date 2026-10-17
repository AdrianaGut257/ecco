import { useId } from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Path,
  Rect,
} from "react-native-svg";
import {
  BACKGROUND,
  DEFAULT_AVATAR,
  HAIR,
  SKIN,
  TOP,
} from "../../constants/avatar";
import { colors } from "../../constants/colors";
import type { MoodId } from "../../constants/emotions";
import type { AvatarConfig } from "../../types";

interface Props {
  config?: Partial<AvatarConfig> | null;
  mood?: MoodId | null;
  size?: number;
  label?: string;
}

const INK = colors.primary.darker;
const DEEP_INK = "#140B07";
const BLUSH = colors.error.normal;

const MOUTHS: Record<MoodId, { d: string; filled?: boolean }> = {
  fatal: { d: "M44 59 Q50 54 56 59" },
  mal: { d: "M45 58 Q50 55.5 55 58" },
  normal: { d: "M45 57 L55 57" },
  bien: { d: "M44 55.5 Q50 61 56 55.5" },
  feliz: { d: "M43 54.5 Q50 64 57 54.5 Z", filled: true },
};

const CURLS = [
  [29, 40],
  [31, 31],
  [37, 24],
  [45, 20],
  [55, 20],
  [63, 24],
  [69, 31],
  [71, 40],
];

function BackHair({ hair, color }: { hair: AvatarConfig["hair"]; color: string }) {
  if (hair === "long") {
    return (
      <Path
        d="M26 46 C24 24 38 15 50 15 C62 15 76 24 74 46 L77 76 C71 80 64 78 62 73 L62 52 L38 52 L38 73 C36 78 29 80 23 76 Z"
        fill={color}
      />
    );
  }
  if (hair === "bun") return <Circle cx={50} cy={15} r={8.5} fill={color} />;
  return null;
}

function FrontHair({ hair, color }: { hair: AvatarConfig["hair"]; color: string }) {
  switch (hair) {
    case "buzz":
      return (
        <Path
          d="M29 41 C29 27 39 20 50 20 C61 20 71 27 71 41 C66 33 58 29.5 50 29.5 C42 29.5 34 33 29 41 Z"
          fill={color}
          opacity={0.75}
        />
      );
    case "curly":
      return (
        <G>
          <Path
            d="M29 42 C28 26 39 18 50 18 C61 18 72 26 71 42 C66 33 58 30 50 30 C42 30 34 33 29 42 Z"
            fill={color}
          />
          {CURLS.map(([cx, cy]) => (
            <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6.5} fill={color} />
          ))}
        </G>
      );
    case "long":
      return (
        <Path
          d="M29 43 C28 26 39 19 51 19 C63 19 73 27 71 43 C67 33 57 28 46 30 C39 32 33 37 29 43 Z"
          fill={color}
        />
      );
    default:
      return (
        <Path
          d="M28 44 C27 26 38 18 51 18 C64 18 74 27 72 44 C70 36 64 31.5 58 30.5 C50 34 40 34.5 33 33 C30 36 29 40 28 44 Z"
          fill={color}
        />
      );
  }
}

function Eyes({ mood, ink }: { mood: MoodId | null; ink: string }) {
  if (mood === "fatal") {
    return (
      <G stroke={ink} strokeWidth={1.8} strokeLinecap="round">
        <Path d="M39 47 Q42 49 45 47" fill="none" />
        <Path d="M55 47 Q58 49 61 47" fill="none" />
      </G>
    );
  }
  if (mood === "feliz") {
    return (
      <G stroke={ink} strokeWidth={1.8} strokeLinecap="round" fill="none">
        <Path d="M39 47 Q42 43.5 45 47" />
        <Path d="M55 47 Q58 43.5 61 47" />
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={42} cy={46} rx={2.6} ry={3.2} fill={ink} />
      <Ellipse cx={58} cy={46} rx={2.6} ry={3.2} fill={ink} />
      <Circle cx={42.9} cy={44.9} r={0.9} fill={colors.white} />
      <Circle cx={58.9} cy={44.9} r={0.9} fill={colors.white} />
    </G>
  );
}

function Brows({ mood, color }: { mood: MoodId | null; color: string }) {
  const sad = mood === "fatal" || mood === "mal";
  return (
    <G stroke={color} strokeWidth={1.6} strokeLinecap="round" fill="none">
      <Path d={sad ? "M38.5 40 Q42 38 45 39" : "M38.5 40 Q42 37.5 45.5 39.5"} />
      <Path d={sad ? "M55 39 Q58 38 61.5 40" : "M54.5 39.5 Q58 37.5 61.5 40"} />
    </G>
  );
}

function Glasses({ style, ink }: { style: AvatarConfig["glasses"]; ink: string }) {
  if (style === "none") return null;
  const common = { stroke: ink, strokeWidth: 1.5, fill: "none" } as const;
  return (
    <G>
      {style === "round" ? (
        <>
          <Circle cx={42} cy={46} r={6.2} {...common} />
          <Circle cx={58} cy={46} r={6.2} {...common} />
        </>
      ) : (
        <>
          <Rect x={35.5} y={41} width={13} height={10} rx={2} {...common} />
          <Rect x={51.5} y={41} width={13} height={10} rx={2} {...common} />
        </>
      )}
      <Path d="M48 46 L52 46" {...common} />
    </G>
  );
}

export default function Avatar({ config, mood = null, size = 96, label }: Props) {
  const look = { ...DEFAULT_AVATAR, ...(config ?? {}) };
  const clipId = `avatar-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const skin = SKIN[look.skin];
  const hair = HAIR[look.hairColor];
  const mouth = MOUTHS[mood ?? "bien"];
  const ink = look.skin === "5" || look.skin === "6" ? DEEP_INK : INK;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      {...(label ? { accessibilityLabel: label, role: "img" as const } : {})}
    >
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx={50} cy={50} r={50} />
        </ClipPath>
      </Defs>
      <Circle cx={50} cy={50} r={50} fill={BACKGROUND[look.background]} />
      <G clipPath={`url(#${clipId})`}>
        <BackHair hair={look.hair} color={hair} />
        <Path
          d="M14 104 C16 82 30 73 50 73 C70 73 84 82 86 104 Z"
          fill={TOP[look.top]}
        />
        <Rect x={44} y={60} width={12} height={15} rx={5} fill={skin} />
        <Path d="M44 66 Q50 70 56 66 L56 62 L44 62 Z" fill={INK} opacity={0.08} />
        <Circle cx={29} cy={47} r={4.5} fill={skin} />
        <Circle cx={71} cy={47} r={4.5} fill={skin} />
        {look.earring && <Circle cx={29} cy={53} r={1.8} fill="#E3B26B" />}
        <Ellipse cx={50} cy={45} rx={21} ry={23} fill={skin} />
        <FrontHair hair={look.hair} color={hair} />
        <Brows mood={mood} color={hair} />
        <Eyes mood={mood} ink={ink} />
        <Ellipse cx={36} cy={53.5} rx={3.6} ry={2.1} fill={BLUSH} opacity={0.22} />
        <Ellipse cx={64} cy={53.5} rx={3.6} ry={2.1} fill={BLUSH} opacity={0.22} />
        {look.freckles && (
          <G fill={ink} opacity={0.4}>
            <Circle cx={37} cy={51} r={0.7} />
            <Circle cx={39.5} cy={52.6} r={0.7} />
            <Circle cx={35.5} cy={53.2} r={0.7} />
            <Circle cx={63} cy={51} r={0.7} />
            <Circle cx={60.5} cy={52.6} r={0.7} />
            <Circle cx={64.5} cy={53.2} r={0.7} />
          </G>
        )}
        {look.mole && <Circle cx={61} cy={58} r={0.9} fill={ink} opacity={0.75} />}
        <Path
          d={mouth.d}
          stroke={ink}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={mouth.filled ? ink : "none"}
        />
        <Glasses style={look.glasses} ink={ink} />
      </G>
    </Svg>
  );
}
