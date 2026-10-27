import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import {
  MEADOW_BOTTOM,
  MEADOW_BUSH_ROOTS,
  MEADOW_PARTS,
  MEADOW_SKY,
  MEADOW_SUN_CENTER,
  MEADOW_TOP,
  MEADOW_WIDTH,
} from "./meadowParts";

const LOOP_MS = 12000;
const TAU = Math.PI * 2;

// Cada capa se dibuja con margen a los lados: al moverse no deja ver su borde.
const PAD = 40;
const band = (y: number, h: number, inner: string) =>
  `<svg viewBox="${-PAD} ${y} ${MEADOW_WIDTH + PAD * 2} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const top = (inner: string) => band(MEADOW_TOP.y, MEADOW_TOP.h, inner);
const bottom = (inner: string) => band(MEADOW_BOTTOM.y, MEADOW_BOTTOM.h, inner);

const { x: SX, y: SY, r: SR } = MEADOW_SUN_CENTER;
const XML = {
  glow: top(`<circle cx="${SX}" cy="${SY}" r="${SR + 14}" fill="#F5EAA0"/>`),
  sun: top(MEADOW_PARTS.sun),
  clouds: top(MEADOW_PARTS.clouds),
  bushLeft: bottom(MEADOW_PARTS.bushLeft),
  bushRight: bottom(MEADOW_PARTS.bushRight),
  hillBack: bottom(MEADOW_PARTS.hillBack),
  hillMid: bottom(MEADOW_PARTS.hillMid),
  hillFront: bottom(MEADOW_PARTS.hillFront),
};

type Motion = (t: number, unit: number) => object[];

// Una capa del paisaje; `motion` recibe el avance del ciclo (0–1) y cuántos px mide una unidad del dibujo.
function Layer({
  xml,
  width,
  height,
  t,
  unit,
  motion,
  style,
}: {
  xml: string;
  width: number;
  height: number;
  t: SharedValue<number>;
  unit: number;
  motion?: Motion;
  style?: (t: number) => object;
}) {
  const pad = PAD * unit;
  const animated = useAnimatedStyle(
    () =>
      ({
        ...(style ? style(t.value) : {}),
        transform: motion ? motion(t.value, unit) : [],
      }) as ViewStyle,
  );
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", left: -pad, top: 0, width: width + pad * 2, height },
        animated,
      ]}
    >
      <SvgXml xml={xml} width={width + pad * 2} height={height} />
    </Animated.View>
  );
}

const pivot = (
  px: number,
  py: number,
  inner: object[],
): object[] => [{ translateX: px }, { translateY: py }, ...inner, { translateX: -px }, { translateY: -py }];

// Paisaje de fondo: las nubes van y vienen, el sol brilla y las colinas y arbustos se mecen con la brisa.
export default function MeadowScene() {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    t.value = withRepeat(withTiming(1, { duration: LOOP_MS, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [reduced, t]);

  const unit = width / MEADOW_WIDTH;
  const topH = MEADOW_TOP.h * unit;
  const bottomH = MEADOW_BOTTOM.h * unit;

  // Pivotes en px respecto del centro de cada franja.
  const sunPivot = { x: SX * unit - width / 2, y: (SY - MEADOW_TOP.y) * unit - topH / 2 };
  const root = (p: { x: number; y: number }) => ({
    x: p.x * unit - width / 2,
    y: (p.y - MEADOW_BOTTOM.y) * unit - bottomH / 2,
  });
  const leftRoot = root(MEADOW_BUSH_ROOTS.left);
  const rightRoot = root(MEADOW_BUSH_ROOTS.right);
  const ground = bottomH / 2;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <LinearGradient
        colors={[...MEADOW_SKY]}
        locations={[0, 0.42, 0.95]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      {width > 0 && (
        <>
          <View style={{ position: "absolute", top: 0, left: 0, width, height: topH }}>
            <Layer
              xml={XML.glow}
              width={width}
              height={topH}
              t={t}
              unit={unit}
              style={(p) => {
                "worklet";
                return { opacity: 0.35 + 0.25 * Math.sin(TAU * 3 * p) };
              }}
              motion={(p) => {
                "worklet";
                return pivot(sunPivot.x, sunPivot.y, [{ scale: 1.04 + 0.08 * Math.sin(TAU * 3 * p) }]);
              }}
            />
            <Layer xml={XML.sun} width={width} height={topH} t={t} unit={unit} />
            <Layer
              xml={XML.clouds}
              width={width}
              height={topH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return [
                  { translateX: 12 * u * Math.sin(TAU * p) },
                  { translateY: 1.5 * u * Math.sin(TAU * 2 * p) },
                ];
              }}
            />
          </View>

          <View style={{ position: "absolute", bottom: 0, left: 0, width, height: bottomH }}>
            <Layer
              xml={XML.bushLeft}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p) => {
                "worklet";
                return pivot(leftRoot.x, leftRoot.y, [{ rotate: `${4 * Math.sin(TAU * 3 * p)}deg` }]);
              }}
            />
            <Layer
              xml={XML.bushRight}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p) => {
                "worklet";
                return pivot(rightRoot.x, rightRoot.y, [{ rotate: `${-4 * Math.sin(TAU * 3 * p + 1)}deg` }]);
              }}
            />
            <Layer
              xml={XML.hillBack}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return pivot(0, ground, [
                  { translateX: 5 * u * Math.sin(TAU * p + 0.5) },
                  { scaleY: 1 + 0.03 * Math.sin(TAU * 2 * p) },
                ]);
              }}
            />
            <Layer
              xml={XML.hillMid}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return pivot(0, ground, [
                  { translateX: -6 * u * Math.sin(TAU * p + 1.4) },
                  { scaleY: 1 + 0.025 * Math.sin(TAU * 2 * p + 1) },
                ]);
              }}
            />
            <Layer
              xml={XML.hillFront}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return [{ translateX: 4 * u * Math.sin(TAU * p + 2.4) }];
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}
