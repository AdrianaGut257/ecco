import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { PLANT_STAGES } from "../../constants/plant";
import {
  FLOWER_ROOT,
  FLOWER_SOIL,
  FLOWER_STAGES,
  FLOWER_VIEWBOX,
} from "./flowerParts";

interface Props {
  stage: number;
  size?: number;
  // Al aparecer, recorre las etapas desde `from` (la semilla, si no se indica) hasta la actual, como un time-lapse.
  growIn?: boolean;
  from?: number;
}

export const STEP_MS = 520;
const { x: VX, y: VY, w: VW, h: VH } = FLOWER_VIEWBOX;
const xml = (inner: string) =>
  `<svg viewBox="${VX} ${VY} ${VW} ${VH}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const SOIL_XML = xml(FLOWER_SOIL);
const STAGE_XML = FLOWER_STAGES.map((s) => ({
  back: s.back ? xml(s.back) : null,
  front: s.front ? xml(s.front) : null,
}));

const clamp = (stage: number) =>
  Math.min(Math.max(Math.round(stage), 0), PLANT_STAGES - 1);

export default function Plant({
  stage,
  size = 120,
  growIn = false,
  from = 0,
}: Props) {
  const reduced = useReducedMotion();
  const target = clamp(stage);
  const [current, setCurrent] = useState(
    growIn && !reduced ? Math.min(clamp(from), target) : target,
  );
  const [previous, setPrevious] = useState<number | null>(null);
  const progress = useSharedValue(1);
  const first = useRef(true);

  // Avanza de a una etapa: si sube varias de golpe, se ve crecer paso a paso.
  useEffect(() => {
    if (current === target) return;
    if (reduced || target < current) {
      setPrevious(null);
      setCurrent(target);
      return;
    }
    const id = setTimeout(
      () => {
        setPrevious(current);
        setCurrent(current + 1);
        progress.value = 0;
        progress.value = withTiming(1, {
          duration: STEP_MS,
          easing: Easing.out(Easing.back(1.8)),
        });
      },
      first.current ? 250 : STEP_MS * 0.75,
    );
    first.current = false;
    return () => clearTimeout(id);
  }, [current, target, reduced, progress]);

  const height = size;
  const width = (size * VW) / VH;
  const pivotX = ((FLOWER_ROOT.x - VX) / VW) * width - width / 2;
  const pivotY = ((FLOWER_ROOT.y - VY) / VH) * height - height / 2;

  // La etapa nueva crece desde donde el tallo sale de la tierra.
  const entering = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: Math.min(1, p * 3),
      transform: [
        { translateX: pivotX },
        { translateY: pivotY },
        { scaleX: 0.82 + 0.18 * p },
        { scaleY: 0.55 + 0.45 * p },
        { translateX: -pivotX },
        { translateY: -pivotY },
      ],
    };
  });
  const leaving = useAnimatedStyle(() => ({
    opacity: Math.max(0, 1 - progress.value * 2.5),
  }));

  const layer = {
    position: "absolute" as const,
    left: 0,
    top: 0,
    width,
    height,
  };
  const draw = (source: string | null, key: string, style?: object) =>
    source ? (
      <Animated.View key={key} style={[layer, style]} pointerEvents="none">
        <SvgXml xml={source} width={width} height={height} />
      </Animated.View>
    ) : null;

  const now = STAGE_XML[current];
  const before = previous !== null ? STAGE_XML[previous] : null;

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <View style={{ width, height }}>
        {before && draw(before.back, `out-back-${previous}`, leaving)}
        {draw(now.back, `in-back-${current}`, entering)}
        {draw(SOIL_XML, "soil")}
        {before && draw(before.front, `out-front-${previous}`, leaving)}
        {draw(now.front, `in-front-${current}`, entering)}
      </View>
    </View>
  );
}
