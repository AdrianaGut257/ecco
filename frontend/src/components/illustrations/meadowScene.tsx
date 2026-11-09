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
  GARDEN_HILLS,
  MEADOW_BUSH_ROOTS,
  MEADOW_PARTS,
  MEADOW_SKY,
  MEADOW_SUN_CENTER,
  MEADOW_TOP,
  MEADOW_WIDTH,
} from "./meadowParts";
import { useIsDark } from "../../theme";
import { MOON_CRATERS, NIGHT_GLOW, NIGHT_SKY, Stars, nightColor, toNight } from "./night";

const LOOP_MS = 12000;
const FRONT_HILL = "#73A15C";

// Verde de la colina de adelante, para lo que queda detrás de la barra de pestañas.
export const meadowGround = (dark: boolean) => (dark ? nightColor(FRONT_HILL) : FRONT_HILL);
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
  gardenMid: bottom(GARDEN_HILLS.hillMid),
  gardenFront: bottom(GARDEN_HILLS.hillFront),
};

// De noche: el sol es una luna con cráteres suaves y un halo más tenue.
const XML_NIGHT: typeof XML = {
  glow: top(`<circle cx="${SX}" cy="${SY}" r="${SR + 14}" fill="${NIGHT_GLOW}"/>`),
  sun: top(toNight(MEADOW_PARTS.sun) + MOON_CRATERS),
  clouds: top(toNight(MEADOW_PARTS.clouds)),
  bushLeft: bottom(toNight(MEADOW_PARTS.bushLeft)),
  bushRight: bottom(toNight(MEADOW_PARTS.bushRight)),
  hillBack: bottom(toNight(MEADOW_PARTS.hillBack)),
  hillMid: bottom(toNight(MEADOW_PARTS.hillMid)),
  hillFront: bottom(toNight(MEADOW_PARTS.hillFront)),
  gardenMid: bottom(toNight(GARDEN_HILLS.hillMid)),
  gardenFront: bottom(toNight(GARDEN_HILLS.hillFront)),
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

const pivot = (px: number, py: number, inner: object[]): object[] => {
  "worklet";
  return [{ translateX: px }, { translateY: py }, ...inner, { translateX: -px }, { translateY: -py }];
};

// Paisaje de fondo: las nubes van y vienen, el sol brilla y las colinas y arbustos se mecen con la brisa.
// En modo oscuro es de noche: la luna reemplaza al sol y titilan algunas estrellas.
// Los arbustos se inclinan desde la base (skew): la raíz queda fija y no se abren huecos.
// `variant="garden"` usa background2.svg: sin arbustos y con las colinas de adelante más planas.
export default function MeadowScene({ variant = "meadow" }: { variant?: "meadow" | "garden" }) {
  const garden = variant === "garden";
  const dark = useIsDark();
  const xml = dark ? XML_NIGHT : XML;
  const glowBase = dark ? 0.22 : 0.35;
  const glowSwing = dark ? 0.12 : 0.25;
  const reduced = useReducedMotion();
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });
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
  // Los arbustos están apoyados en la colina de atrás: se mueven con ella y además se mecen desde la base.
  const backHill = (p: number, u: number) => {
    "worklet";
    return pivot(0, ground, [
      { translateX: 5 * u * Math.sin(TAU * p + 0.5) },
      { scaleY: 1 + 0.03 * Math.sin(TAU * 2 * p) },
    ]);
  };

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, overflow: "hidden" }}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      <LinearGradient
        colors={[...(dark ? NIGHT_SKY : MEADOW_SKY)]}
        locations={[0, 0.42, 0.95]}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
      {width > 0 && (
        <>
          {dark && <Stars top={topH * 0.55} width={width} height={Math.max(0, height - bottomH - topH * 0.55)} />}
          <View style={{ position: "absolute", top: 0, left: 0, width, height: topH }}>
            <Layer
              xml={xml.glow}
              width={width}
              height={topH}
              t={t}
              unit={unit}
              style={(p) => {
                "worklet";
                return { opacity: glowBase + glowSwing * Math.sin(TAU * 3 * p) };
              }}
              motion={(p) => {
                "worklet";
                return pivot(sunPivot.x, sunPivot.y, [{ scale: 1.04 + 0.08 * Math.sin(TAU * 3 * p) }]);
              }}
            />
            <Layer xml={xml.sun} width={width} height={topH} t={t} unit={unit} />
            <Layer
              xml={xml.clouds}
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
            {!garden && (
            <Layer
              xml={xml.bushLeft}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return [
                  ...backHill(p, u),
                  ...pivot(leftRoot.x, leftRoot.y, [{ skewX: `${5 * Math.sin(TAU * 3 * p)}deg` }]),
                ];
              }}
            />
            )}
            {!garden && (
            <Layer
              xml={xml.bushRight}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return [
                  ...backHill(p, u),
                  ...pivot(rightRoot.x, rightRoot.y, [{ skewX: `${-5 * Math.sin(TAU * 3 * p + 1)}deg` }]),
                ];
              }}
            />
            )}
            <Layer
              xml={xml.hillBack}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={backHill}
            />
            <Layer
              xml={garden ? xml.gardenMid : xml.hillMid}
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
              xml={garden ? xml.gardenFront : xml.hillFront}
              width={width}
              height={bottomH}
              t={t}
              unit={unit}
              motion={(p, u) => {
                "worklet";
                return [{ translateX: 4 * u * Math.sin(TAU * p + 2.4) }];
              }}
            />
            {/* Al escalar, el borde de abajo de la colina queda a medio píxel y deja ver el cielo:
                esta franja lo cubre para que no aparezca una línea clara sobre la barra de pestañas. */}
            <View
              style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, backgroundColor: meadowGround(dark) }}
            />
          </View>
        </>
      )}
    </View>
  );
}
