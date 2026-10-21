import { useId } from "react";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from "react-native-svg";
import { BACKGROUND, DEFAULT_AVATAR, HAIR, SKIN, TOP } from "../../constants/avatar";
import type { MoodId } from "../../constants/emotions";
import type { AvatarConfig } from "../../types";
import {
  BACK_HAIR,
  EARRING_PATHS,
  EARS,
  FRONT_HAIR,
  GLASSES_PATHS,
  HEADBAND,
  OUTFIT_PATHS,
} from "./parts";

interface Props {
  config?: Partial<AvatarConfig> | null;
  mood?: MoodId | null;
  size?: number;
  label?: string;
}

const EYE = "#2F3432";
const HEADBAND_COLOR = "#1E9C9A";
const DEEP_EYE = "#140B07";

const HEAD =
  "M91.5 41.5C91.5 64.42 76.05 83 57 83C37.95 83 22.5 64.42 22.5 41.5C22.5 18.58 37.95 0 57 0C76.05 0 91.5 18.58 91.5 41.5Z";
const TORSO = "M86.5 131H27.5C27.5 131 37.5 92 57 92C76.5 92 86.5 131 86.5 131Z";

type EyeShape = "open" | "happy" | "closed";

const FACES: Record<MoodId, { eyes: EyeShape; mouth: string; filled?: boolean }> = {
  fatal: { eyes: "closed", mouth: "M50.5 58.5C50.5 58.5 52.9 53.5 57 53.5C61.1 53.5 63.5 58.5 63.5 58.5" },
  mal: { eyes: "open", mouth: "M51 57C51 57 53.5 54.5 57 54.5C60.5 54.5 63 57 63 57" },
  normal: { eyes: "open", mouth: "M51.5 55.5H62.5" },
  bien: { eyes: "open", mouth: "M50.5 53C50.5 53 52.89 58 57 58C61.11 58 63.5 53 63.5 53" },
  feliz: { eyes: "happy", mouth: "M50 52.5C50 52.5 51.5 61 57 61C62.5 61 64 52.5 64 52.5Z", filled: true },
};

const FRECKLES = [
  [38.5, 44],
  [42, 43],
  [45, 44.5],
  [75.5, 44],
  [72, 43],
  [69, 44.5],
];

function Eyes({ shape, ink }: { shape: EyeShape; ink: string }) {
  if (shape === "open") {
    return (
      <G fill={ink}>
        <Ellipse cx={46.5} cy={38.5} rx={2} ry={4.5} />
        <Ellipse cx={67.5} cy={38.5} rx={2} ry={4.5} />
      </G>
    );
  }
  const d =
    shape === "happy"
      ? "M44 40Q46.5 34.5 49 40M65 40Q67.5 34.5 70 40"
      : "M44 38.5Q46.5 42 49 38.5M65 38.5Q67.5 42 70 38.5";
  return <Path d={d} stroke={ink} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
}

function Earrings({ style }: { style: AvatarConfig["earrings"] }) {
  if (style === "none") return null;
  const [left, right] = EARRING_PATHS[style];
  if (style === "studs") {
    const stud = { stroke: "#AA7137", strokeWidth: 2, strokeLinecap: "square", fill: "none" } as const;
    return (
      <G>
        <Path d={left} {...stud} />
        <Path d={right} {...stud} />
      </G>
    );
  }
  const fill = style === "hoops" ? "#FECD9C" : "#D5A26E";
  return (
    <G fill={fill}>
      <Path d={left} />
      <Path d={right} />
    </G>
  );
}

export default function Avatar({ config, mood = null, size = 96, label }: Props) {
  const look = { ...DEFAULT_AVATAR, ...(config ?? {}) };
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const tone = SKIN[look.skin] ?? SKIN[DEFAULT_AVATAR.skin];
  const hair = HAIR[look.hairColor];
  const face = FACES[mood ?? "bien"];
  const eyeInk = look.skin === "5" || look.skin === "6" ? DEEP_EYE : EYE;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="-24 -24 162 162"
      {...(label ? { accessibilityLabel: label, role: "img" as const } : {})}
    >
      <Defs>
        <ClipPath id={`frame${id}`}>
          <Circle cx={57} cy={57} r={81} />
        </ClipPath>
        <ClipPath id={`hair${id}`}>
          <Rect x={-24} y={-24} width={162} height={155} />
        </ClipPath>
      </Defs>
      <Circle cx={57} cy={57} r={81} fill={BACKGROUND[look.background]} />
      <G clipPath={`url(#frame${id})`}>
        <G clipPath={`url(#hair${id})`}>
          <Path d={BACK_HAIR[look.hair] ?? BACK_HAIR[DEFAULT_AVATAR.hair]} fill={hair} />
        </G>
        <Rect x={47.5} y={80} width={19} height={23} fill={tone.base} />
        <Path d={EARS.right} fill={tone.base} />
        <Path d={EARS.rightInner} fill={tone.blush} />
        <Path d={EARS.left} fill={tone.base} />
        <Path d={EARS.leftInner} fill={tone.blush} />
        <Path d={HEAD} fill={tone.base} />
        <Ellipse cx={57} cy={41.5} rx={34} ry={41} stroke={tone.line} strokeWidth={1} fill="none" />
        {look.freckles && (
          <G fill={tone.mouth} opacity={0.45}>
            {FRECKLES.map(([cx, cy]) => (
              <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.9} />
            ))}
          </G>
        )}
        <Ellipse cx={42.64} cy={46.25} rx={4.5} ry={2.23} transform="rotate(11.92 42.64 46.25)" fill={tone.blush} />
        <Ellipse cx={71.36} cy={46.25} rx={4.5} ry={2.23} transform="rotate(-11.92 71.36 46.25)" fill={tone.blush} />
        <Eyes shape={face.eyes} ink={eyeInk} />
        <Path
          d={face.mouth}
          stroke={tone.mouth}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={face.filled ? tone.mouth : "none"}
        />
        {look.mole && <Circle cx={66.5} cy={56} r={1.1} fill={eyeInk} opacity={0.75} />}
        <Path d={TORSO} fill={tone.base} />
        <Path d={OUTFIT_PATHS[look.outfit] ?? OUTFIT_PATHS.tee} fill={TOP[look.top]} />
        <Ellipse cx={28} cy={129} rx={9.5} ry={10} fill={tone.base} />
        <Ellipse cx={86} cy={129} rx={9.5} ry={10} fill={tone.base} />
        {look.glasses !== "none" && (
          <Path d={GLASSES_PATHS[look.glasses]} stroke={EYE} strokeWidth={1} strokeLinecap="square" fill="none" />
        )}
        <Path
          d={FRONT_HAIR[look.bangs] ?? FRONT_HAIR[DEFAULT_AVATAR.bangs]}
          fill={hair}
          stroke={hair}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        {look.headband && <Path d={HEADBAND} fill={HEADBAND_COLOR} />}
        <Earrings style={look.earrings} />
      </G>
    </Svg>
  );
}
