import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Ellipse, Path, SvgXml } from "react-native-svg";
import type { MoodId } from "../../constants/emotions";
import { FACE_PARTS } from "./faceParts";

interface Props {
  mood: MoodId;
  size?: number;
  // alive: cada emoción expresa su sentimiento en bucle. breathe: sigue a `breath` (0 exhalado, 1 inhalado) y `blow` (soplar).
  mode?: "alive" | "still" | "breathe";
  breath?: SharedValue<number>;
  blow?: SharedValue<number>;
  delay?: number;
}

const CYCLE_MS: Record<MoodId, number> = {
  feliz: 2600,
  bien: 3200,
  normal: 4000,
  mal: 4400,
  fatal: 4800,
};

// Sube de 0 a 1 y vuelve a 0 dentro del tramo [a, b] del ciclo.
const bump = (t: number, a: number, b: number) => {
  "worklet";
  if (t < a || t > b) return 0;
  return Math.sin(Math.PI * ((t - a) / (b - a)));
};

// Igual que bump, pero se queda en 1 en el medio (para miradas que se sostienen).
const hold = (t: number, a: number, b: number) => {
  "worklet";
  if (t < a || t > b) return 0;
  const edge = (b - a) * 0.2;
  if (t < a + edge) return Math.sin((Math.PI / 2) * ((t - a) / edge));
  if (t > b - edge) return Math.sin((Math.PI / 2) * ((b - t) / edge));
  return 1;
};

const layerXml = (w: number, h: number, inner: string) =>
  `<svg viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export default function LivingMoodFace({
  mood,
  size = 56,
  mode = "alive",
  breath,
  blow,
  delay = 0,
}: Props) {
  const reduced = useReducedMotion();
  const parts = FACE_PARTS[mood];
  const width = size;
  const height = (size * parts.h) / parts.w;
  const unit = size / parts.w;
  const t = useSharedValue(0);
  const animate = mode === "alive" && !reduced;
  const breathing = mode === "breathe";

  useEffect(() => {
    if (!animate) {
      cancelAnimation(t);
      t.value = 0;
      return;
    }
    t.value = 0;
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: CYCLE_MS[mood], easing: Easing.linear }),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(t);
  }, [animate, mood, delay, t]);

  const eyePivot = (parts.eyes[1] - parts.h / 2) * unit;
  const mouthPivotX = (parts.mouth[0] - parts.w / 2) * unit;
  const mouthPivotY = (parts.mouth[1] - parts.h / 2) * unit;

  const body = useAnimatedStyle(() => {
    let lift = 0;
    let tilt = 0;
    let sx = 1;
    let sy = 1;
    if (breathing) {
      const b = breath?.value ?? 0;
      sx = 0.95 + 0.1 * b;
      sy = 0.92 + 0.15 * b;
      lift = -4 * b;
    } else {
      const p = t.value;
      switch (mood) {
        case "feliz":
          lift = -7 * bump(p, 0, 0.18) - 3 * bump(p, 0.22, 0.34);
          sy = 1 - 0.09 * bump(p, 0.17, 0.24) + 0.04 * bump(p, 0.02, 0.14);
          sx = 1 + 0.07 * bump(p, 0.17, 0.24) - 0.02 * bump(p, 0.02, 0.14);
          tilt = 4 * Math.sin(2 * Math.PI * p);
          break;
        case "bien":
          tilt = 5 * Math.sin(2 * Math.PI * p);
          lift = -1.5 * Math.abs(Math.sin(2 * Math.PI * p));
          break;
        case "normal":
          lift = -1 * Math.sin(2 * Math.PI * p);
          break;
        case "mal":
          sy = 1 - 0.06 * bump(p, 0.1, 0.6);
          sx = 1 + 0.03 * bump(p, 0.1, 0.6);
          lift = 2 * bump(p, 0.1, 0.6);
          tilt = -2 * bump(p, 0.1, 0.6);
          break;
        case "fatal":
          tilt = 2.5 * Math.sin(2 * Math.PI * p);
          lift = 1.5 + 1.5 * Math.sin(4 * Math.PI * p);
          sy = 0.98;
          break;
      }
    }
    return {
      transform: [
        { translateY: lift },
        { rotate: `${tilt}deg` },
        { translateY: height / 2 },
        { scaleX: sx },
        { scaleY: sy },
        { translateY: -height / 2 },
      ],
    };
  });

  const eyes = useAnimatedStyle(() => {
    let open = 1;
    let gx = 0;
    let gy = 0;
    if (breathing) {
      open = 0.14;
    } else {
      const p = t.value;
      switch (mood) {
        case "feliz":
          open = 1 - 0.9 * bump(p, 0.6, 0.64);
          break;
        case "bien":
          open = 1 - 0.9 * bump(p, 0.75, 0.79);
          break;
        case "normal":
          gx = -1.6 * hold(p, 0.1, 0.4) + 1.6 * hold(p, 0.5, 0.8);
          open = 1 - 0.9 * bump(p, 0.44, 0.47) - 0.9 * bump(p, 0.9, 0.93);
          break;
        case "mal":
          gy = 1.2;
          open = 1 - 0.85 * bump(p, 0.7, 0.8);
          break;
        case "fatal":
          gy = 0.8;
          open = 1 - 0.85 * bump(p, 0.82, 0.93);
          break;
      }
    }
    return {
      transform: [
        { translateX: gx * unit },
        { translateY: gy * unit + eyePivot },
        { scaleY: open },
        { translateY: -eyePivot },
      ],
    };
  });

  const mouth = useAnimatedStyle(() => {
    let sx = 1;
    let rot = 0;
    let opacity = 1;
    if (breathing) {
      opacity = 1 - (blow?.value ?? 0);
    } else {
      const p = t.value;
      switch (mood) {
        case "feliz":
          sx = 1 + 0.2 * bump(p, 0, 0.3);
          break;
        case "bien":
          sx = 1 + 0.14 * bump(p, 0.25, 0.55);
          break;
        case "normal":
          rot = 7 * bump(p, 0.55, 0.8);
          break;
        case "mal":
          sx = 1 - 0.08 * bump(p, 0.1, 0.6);
          break;
      }
    }
    return {
      opacity,
      transform: [
        { translateX: mouthPivotX },
        { translateY: mouthPivotY },
        { rotate: `${rot}deg` },
        { scaleX: sx },
        { translateX: -mouthPivotX },
        { translateY: -mouthPivotY },
      ],
    };
  });

  const blowMouth = useAnimatedStyle(() => {
    const b = breathing ? (blow?.value ?? 0) : 0;
    return {
      opacity: b,
      transform: [
        { translateX: mouthPivotX },
        { translateY: mouthPivotY },
        { scale: 0.4 + 0.6 * b },
        { translateX: -mouthPivotX },
        { translateY: -mouthPivotY },
      ],
    };
  });

  // Solo "fatal": una lágrima que baja desde el ojo izquierdo.
  const tear = useAnimatedStyle(() => {
    if (mood !== "fatal" || breathing) return { opacity: 0 };
    const p = t.value;
    const k = p < 0.15 || p > 0.75 ? 0 : (p - 0.15) / 0.6;
    const opacity = Math.min(1, k * 5) * (k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1);
    return { opacity, transform: [{ translateY: k * 9 * unit }] };
  });

  const layer = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width,
    height,
  };
  const [ex, ey] = parts.leftEye;

  return (
    <View style={{ width, height }}>
      <Animated.View style={[{ width, height }, body]}>
        <View style={layer}>
          <SvgXml
            xml={layerXml(parts.w, parts.h, parts.layers.body)}
            width={width}
            height={height}
          />
        </View>
        {parts.layers.extra ? (
          <View style={layer}>
            <SvgXml
              xml={layerXml(parts.w, parts.h, parts.layers.extra)}
              width={width}
              height={height}
            />
          </View>
        ) : null}
        <Animated.View style={[layer, eyes]}>
          <SvgXml
            xml={layerXml(parts.w, parts.h, parts.layers.eyes)}
            width={width}
            height={height}
          />
        </Animated.View>
        <Animated.View style={[layer, mouth]}>
          <SvgXml
            xml={layerXml(parts.w, parts.h, parts.layers.mouth)}
            width={width}
            height={height}
          />
        </Animated.View>
        {breathing && (
          <Animated.View style={[layer, blowMouth]}>
            <Svg
              width={width}
              height={height}
              viewBox={`0 0 ${parts.w} ${parts.h}`}
            >
              <Ellipse
                cx={parts.mouth[0]}
                cy={parts.mouth[1]}
                rx={2.6}
                ry={3.2}
                fill="#282828"
              />
            </Svg>
          </Animated.View>
        )}
        {mood === "fatal" && (
          <Animated.View style={[layer, tear]}>
            <Svg
              width={width}
              height={height}
              viewBox={`0 0 ${parts.w} ${parts.h}`}
            >
              <Path
                d={`M${ex} ${ey + 4}C${ex - 2.2} ${ey + 7} ${ex - 2.2} ${ey + 9.5} ${ex} ${ey + 9.5}C${ex + 2.2} ${ey + 9.5} ${ex + 2.2} ${ey + 7} ${ex} ${ey + 4}Z`}
                fill="#DDEFFB"
              />
            </Svg>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
