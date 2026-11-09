import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

// Versión de noche de los paisajes de la autora: los mismos dibujos, con cada color cambiado por su
// equivalente nocturno (verdes más profundos con un toque azul, cielo azul noche, luna en lugar de sol).
const NIGHT: Record<string, string> = {
  // Colinas y arbustos (background1, background2).
  "#B7D264": "#4A6340",
  "#8DB85E": "#3A5536",
  "#73A15C": "#2C452E",
  // Inicio (background3).
  "#B2D37A": "#46603D",
  "#92AD31": "#44562A",
  "#80B24A": "#34512C",
  // Nubes y sol → nubes de noche y luna.
  WHITE: "#2B3656",
  "#E9D96B": "#EEE7C9",
  "#F5EAA0": "#F8F3DE",
};

export const NIGHT_SKY = ["#111833", "#1A2443", "#27374A"] as const;
export const NIGHT_HOME_SKY = "#131A33";
export const NIGHT_GLOW = "#E6E0C0";
// Cráteres suaves para que el disco se lea como luna (en el marco del sol de background1).
export const MOON_CRATERS =
  '<g fill="#DCD3AE" opacity="0.7"><circle cx="322" cy="82" r="9"/><circle cx="354" cy="118" r="12"/><circle cx="361" cy="76" r="6"/><circle cx="331" cy="122" r="5"/></g>';

export const nightColor = (color: string) => NIGHT[color.toUpperCase()] ?? color;

// Cambia los colores de un SVG a los de la noche. `overrides` reemplaza colores puntuales antes.
export const toNight = (xml: string, overrides: Record<string, string> = {}) =>
  xml.replace(/(fill|stroke|stop-color)="([^"]+)"/g, (_m, attr: string, color: string) => {
    const own = overrides[color] ?? overrides[color.toUpperCase()];
    return `${attr}="${own ?? nightColor(color)}"`;
  });

// Posiciones fijas (fracciones del ancho y del alto disponibles) para que las estrellas no salten.
const STARS: [number, number, number][] = [
  [0.06, 0.18, 1.3], [0.14, 0.62, 1], [0.21, 0.34, 1.6], [0.29, 0.81, 1.1], [0.36, 0.12, 1],
  [0.43, 0.52, 1.4], [0.5, 0.27, 1], [0.57, 0.74, 1.2], [0.63, 0.41, 1.7], [0.7, 0.92, 1],
  [0.77, 0.6, 1.3], [0.84, 0.22, 1], [0.9, 0.48, 1.5], [0.96, 0.78, 1.1], [0.1, 0.95, 1.2],
  [0.47, 0.88, 1], [0.32, 0.47, 1.1], [0.74, 0.08, 1.2],
];

function StarGroup({ stars, width, height, delay }: {
  stars: [number, number, number][];
  width: number;
  height: number;
  delay: number;
}) {
  const reduced = useReducedMotion();
  const glow = useSharedValue(0.8);
  useEffect(() => {
    if (reduced) return;
    glow.value = withRepeat(
      withTiming(0.35, { duration: 2600 + delay, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(glow);
  }, [reduced, glow, delay]);
  const style = useAnimatedStyle(() => ({ opacity: glow.value }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, width, height }, style]}>
      <Svg width={width} height={height}>
        {stars.map(([fx, fy, r], i) => (
          <Circle key={i} cx={fx * width} cy={fy * height} r={r} fill="#F8F3DE" />
        ))}
      </Svg>
    </Animated.View>
  );
}

// Estrellas que titilan despacio, en dos grupos desfasados. Quietas con "reducir movimiento".
export function Stars({ top, width, height, count = STARS.length }: {
  top: number;
  width: number;
  height: number;
  count?: number;
}) {
  if (width <= 0 || height <= 0) return null;
  const stars = STARS.slice(0, count);
  return (
    <View pointerEvents="none" style={{ position: "absolute", top, left: 0, width, height }}>
      <StarGroup stars={stars.filter((_, i) => i % 2 === 0)} width={width} height={height} delay={0} />
      <StarGroup stars={stars.filter((_, i) => i % 2 === 1)} width={width} height={height} delay={900} />
    </View>
  );
}
