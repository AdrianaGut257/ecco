import { useId } from "react";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, Rect } from "react-native-svg";
import { BACKGROUND, BEARD, DEFAULT_AVATAR, HAIR, SKIN, TOP } from "../../constants/avatar";
import type { MoodId } from "../../constants/emotions";
import type { AvatarConfig } from "../../types";
import {
  BACK_HAIR,
  BEARD_PATHS,
  EARRING_PATHS,
  EARS,
  FRONT_HAIR,
  GLASSES_PATHS,
  HEADBAND,
  OUTFIT_LAYERS,
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

// Cabeza, cuello y cuerpo de base/skinTones.svg (primer tono), en el marco del avatar.
const HEAD =
  "M91 41.5C91 64.42 75.78 83 57 83C38.22 83 23 64.42 23 41.5C23 18.58 38.22 0 57 0C75.78 0 91 18.58 91 41.5Z";
const TORSO = "M88 132H26C26 132 37.17 92 57 92C76.83 92 88 132 88 132Z";

export type EyeShape = "open" | "happy" | "closed";

const FACES: Record<MoodId, { eyes: EyeShape; mouth: string; filled?: boolean }> = {
  fatal: { eyes: "closed", mouth: "M50 58.5C50 58.5 52.6 53.5 57 53.5C61.4 53.5 64 58.5 64 58.5" },
  mal: { eyes: "open", mouth: "M50.5 57C50.5 57 53.3 54.5 57 54.5C60.7 54.5 63.5 57 63.5 57" },
  normal: { eyes: "open", mouth: "M51 55.5H63" },
  bien: { eyes: "open", mouth: "M50 53C50 53 52.58 58 57 58C61.42 58 64 53 64 53" },
  feliz: { eyes: "happy", mouth: "M49.5 52.5C49.5 52.5 51 61 57 61C63 61 64.5 52.5 64.5 52.5Z", filled: true },
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
        <Ellipse cx={46} cy={38.5} rx={2} ry={4.5} />
        <Ellipse cx={68} cy={38.5} rx={2} ry={4.5} />
      </G>
    );
  }
  const d =
    shape === "happy"
      ? "M43.5 40Q46 34.5 48.5 40M65.5 40Q68 34.5 70.5 40"
      : "M43.5 38.5Q46 42 48.5 38.5M65.5 38.5Q68 42 70.5 38.5";
  return <Path d={d} stroke={ink} strokeWidth={2.2} strokeLinecap="round" fill="none" />;
}

function shade(hex: string, amount = 0.18) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((n >> shift) & 255) * (1 - amount));
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

// Capucha de chico: en el dibujo es más clara que las mangas.
function lighten(hex: string, amount = 0.22) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = (n >> shift) & 255;
    return Math.round(c + (255 - c) * amount);
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

function Outfit({ outfit, color }: { outfit: AvatarConfig["outfit"]; color: string }) {
  const layers = OUTFIT_LAYERS[outfit] ?? OUTFIT_LAYERS.tee;
  return (
    <G>
      {layers.map((layer, i) => {
        if (layer.stroke) {
          return <Path key={i} d={layer.d} stroke={layer.stroke} strokeWidth={1} fill="none" />;
        }
        const fill =
          layer.fill === "main"
            ? color
            : layer.fill === "shade"
              ? shade(color)
              : layer.fill === "light"
                ? lighten(color)
                : layer.fill;
        const cover = layer.cover === true ? 1 : layer.cover || 0;
        return (
          <Path
            key={i}
            d={layer.d}
            fill={fill}
            {...(cover ? { stroke: fill, strokeWidth: cover, strokeLinejoin: "round" as const } : {})}
          />
        );
      })}
    </G>
  );
}

function Earrings({ style }: { style: AvatarConfig["earrings"] }) {
  if (style === "none") return null;
  const [left, right] = EARRING_PATHS[style];
  if (style === "studs") {
    const stud = { stroke: "#6D4116", strokeWidth: 2, strokeLinecap: "square", fill: "none" } as const;
    return (
      <G>
        <Path d={left} {...stud} />
        <Path d={right} {...stud} />
      </G>
    );
  }
  const fill = style === "hoops" ? "#FECD9C" : "#A67D54";
  return (
    <G fill={fill}>
      <Path d={left} />
      <Path d={right} />
    </G>
  );
}

// Datos de dibujo comunes a la versión fija y a la animada.
export function avatarLook(config?: Partial<AvatarConfig> | null, mood?: MoodId | null) {
  const look = { ...DEFAULT_AVATAR, ...(config ?? {}) };
  const tone = SKIN[look.skin] ?? SKIN[DEFAULT_AVATAR.skin];
  return {
    look,
    tone,
    hair: HAIR[look.hairColor],
    back: BACK_HAIR[look.hair] ?? BACK_HAIR[DEFAULT_AVATAR.hair],
    front:
      look.hair === "bald" || look.bangs === "none" ? null : FRONT_HAIR[look.bangs] ?? FRONT_HAIR.swept,
    face: FACES[mood ?? "bien"],
    eyeInk: look.skin === "5" || look.skin === "6" ? DEEP_EYE : EYE,
    background: BACKGROUND[look.background],
  };
}
export type AvatarLook = ReturnType<typeof avatarLook>;

export const AVATAR_VIEWBOX = "-24 -24 162 162";
// Centro de cada mano (las bolitas de abajo) y de los ojos, en coordenadas del dibujo.
export const HANDS = { left: { x: 28, y: 129 }, right: { x: 86, y: 129 } };
export const EYES_Y = 38.5;

// Debajo de los ojos: pelo de atrás, cuello, orejas, cabeza, pecas y rubor.
export function UnderArt({ a, id }: { a: AvatarLook; id: string }) {
  return (
    <>
      <Defs>
        <ClipPath id={`hair${id}`}>
          <Rect x={-24} y={-24} width={162} height={156} />
        </ClipPath>
      </Defs>
      {a.back ? (
        <G clipPath={`url(#hair${id})`}>
          <Path d={a.back} fill={a.hair} />
        </G>
      ) : null}
      <Rect x={47} y={80} width={20} height={23} fill={a.tone.base} />
      <Path d={EARS.right} fill={a.tone.base} />
      <Path d={EARS.rightInner} fill={a.tone.blush} />
      <Path d={EARS.left} fill={a.tone.base} />
      <Path d={EARS.leftInner} fill={a.tone.blush} />
      <Path d={HEAD} fill={a.tone.base} />
      <Ellipse cx={57} cy={41.5} rx={33.5} ry={41} stroke={a.tone.line} strokeWidth={1} fill="none" />
      {a.look.freckles && (
        <G fill={a.tone.mouth} opacity={0.45}>
          {FRECKLES.map(([cx, cy]) => (
            <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.9} />
          ))}
        </G>
      )}
      <Ellipse cx={43.4} cy={46} rx={4.08} ry={2.14} transform="rotate(12.7 43.4 46)" fill={a.tone.blush} />
      <Ellipse cx={70.6} cy={46} rx={4.08} ry={2.14} transform="rotate(-12.7 70.6 46)" fill={a.tone.blush} />
    </>
  );
}

export function EyesArt({ a, shape }: { a: AvatarLook; shape?: EyeShape }) {
  return <Eyes shape={shape ?? a.face.eyes} ink={a.eyeInk} />;
}

// Encima de los ojos: boca, lunar, barba, cuerpo, ropa, lentes, flequillo, diadema y aretes.
export function OverArt({ a, mouth }: { a: AvatarLook; mouth?: { mouth: string; filled?: boolean } }) {
  const m = mouth ?? a.face;
  return (
    <>
      <Path
        d={m.mouth}
        stroke={a.tone.mouth}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={m.filled ? a.tone.mouth : "none"}
      />
      {a.look.mole && <Circle cx={66.5} cy={56} r={1.1} fill={a.eyeInk} opacity={0.75} />}
      {a.look.facialHair !== "none" && BEARD_PATHS[a.look.facialHair] && (
        <Path d={BEARD_PATHS[a.look.facialHair]} fill={BEARD[a.look.hairColor]} />
      )}
      <Path d={TORSO} fill={a.tone.base} />
      <Outfit outfit={a.look.outfit} color={TOP[a.look.top] ?? TOP["1"]} />
      {a.look.glasses !== "none" && (
        <Path d={GLASSES_PATHS[a.look.glasses]} stroke={EYE} strokeWidth={1} strokeLinecap="square" fill="none" />
      )}
      {a.front && <Path d={a.front} fill={a.hair} stroke={a.hair} strokeWidth={1.2} strokeLinejoin="round" />}
      {a.look.headband && <Path d={HEADBAND} fill={HEADBAND_COLOR} />}
      {a.look.kind !== "boy" && <Earrings style={a.look.earrings} />}
    </>
  );
}

// Las manos son las bolitas redondas de abajo: no hay brazos.
export function HandArt({ a, side }: { a: AvatarLook; side: "left" | "right" }) {
  const { x, y } = HANDS[side];
  return <Circle cx={x} cy={y} r={10} fill={a.tone.base} />;
}

export const SMILE = FACES.feliz;

export default function Avatar({ config, mood = null, size = 96, label }: Props) {
  const a = avatarLook(config, mood);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <Svg
      width={size}
      height={size}
      viewBox={AVATAR_VIEWBOX}
      {...(label ? { accessibilityLabel: label, role: "img" as const } : {})}
    >
      <Defs>
        <ClipPath id={`frame${id}`}>
          <Circle cx={57} cy={57} r={81} />
        </ClipPath>
      </Defs>
      <Circle cx={57} cy={57} r={81} fill={a.background} />
      <G clipPath={`url(#frame${id})`}>
        <UnderArt a={a} id={id} />
        <EyesArt a={a} />
        <OverArt a={a} />
        <HandArt a={a} side="left" />
        <HandArt a={a} side="right" />
      </G>
    </Svg>
  );
}
