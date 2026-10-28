import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
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
import Svg, { Path } from "react-native-svg";

// Trazos de assets/svg/background/butterfly1.svg (29 × 29): mariposa de perfil en vuelo.
const VIEW = 29;
const BACK_WING =
  "M11.04 15.36C5.53 9.23 8.62 2.87 12.49 4.28C15.81 6.52 14.81 10.67 11.86 15.92L11.04 15.36ZM12.69 16.48C15.49 12.34 19.39 10.15 22.14 13.22C23.51 16.55 18.22 19.02 12.69 16.48Z";
const FRONT_WING =
  "M11.97 16.15C7.98 8.93 12.41 3.43 15.87 5.67C18.6 8.6 16.7 12.42 12.65 16.88L11.97 16.15ZM13.33 17.61C16.99 14.2 21.28 12.93 23.28 16.54C23.86 20.1 18.16 21.32 13.33 17.61Z";
const BODY =
  "M16.36 20.45C16.74 19.98 15.29 18.2 13.12 16.49C10.95 14.78 8.89 13.78 8.51 14.26C8.14 14.73 9.59 16.51 11.76 18.22C13.92 19.93 15.99 20.93 16.36 20.45Z";
// Las alas se pliegan hacia el cuerpo, que va en diagonal (unos 38°) y pasa por este punto.
const PIVOT = { x: 12.4, y: 17.3 };
const BODY_ANGLE = 38;

export const BUTTERFLY_COLORS = {
  yellow: { back: "#F7D86A", front: "#F6E45A" },
  lilac: { back: "#9286D6", front: "#A79BE3" },
  blue: { back: "#79B3DB", front: "#8EC3E6" },
};
export type ButterflyColor = keyof typeof BUTTERFLY_COLORS;

const FLAP_MS = 200;
// Rulos que da en cada cruce.
const LOOPS = 3;

function Wing({ d, color, flap, size, depth, lag }: {
  d: string;
  color: string;
  flap: SharedValue<number>;
  size: number;
  // Cuánto se pliega (0–1) y con qué retraso de fase respecto del ala de adelante.
  depth: number;
  lag: number;
}) {
  const k = size / VIEW;
  const px = (PIVOT.x - VIEW / 2) * k;
  const py = (PIVOT.y - VIEW / 2) * k;
  const style = useAnimatedStyle(() => {
    const f = Math.max(0, Math.min(1, flap.value - lag));
    return {
      transform: [
        { translateX: px },
        { translateY: py },
        { rotate: `${BODY_ANGLE}deg` },
        { scaleY: 1 - depth * f },
        { rotate: `${-BODY_ANGLE}deg` },
        { translateX: -px },
        { translateY: -py },
      ],
    } as ViewStyle;
  });
  return (
    <Animated.View style={[{ position: "absolute", width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${VIEW} ${VIEW}`}>
        <Path d={d} fill={color} />
      </Svg>
    </Animated.View>
  );
}

// Mariposa que vuela libre por el jardín: cruza la pantalla de un lado a otro subiendo y bajando
// suavemente, aletea y vuelve a empezar. Quieta con "reducir movimiento".
export function FlyingButterfly({
  color = "yellow",
  size = 28,
  width,
  top,
  height = 120,
  duration = 20000,
  delay = 0,
  reverse = false,
}: {
  color?: ButterflyColor;
  size?: number;
  // Ancho del área por donde vuela, en px.
  width: number;
  // Altura del centro de su vuelo y cuánto sube y baja, en px.
  top: number;
  height?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
}) {
  const reduced = useReducedMotion();
  const flap = useSharedValue(0);
  const t = useSharedValue(reduced ? 0.4 : 0);
  const tones = BUTTERFLY_COLORS[color];

  useEffect(() => {
    if (reduced) return;
    flap.value = withRepeat(
      withTiming(1.15, { duration: FLAP_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
    return () => {
      cancelAnimation(flap);
      cancelAnimation(t);
    };
  }, [reduced, flap, t, delay, duration]);

  // Entra por un borde, cruza dando rulos mientras sube y baja, y sale por el otro; como empieza
  // y termina fuera de la pantalla, el salto al volver a empezar no se ve.
  // Radio del rulo: lo bastante grande para que retroceda un poco y cierre la vuelta.
  const loop = Math.max(22, width * 0.085);
  const flight = useAnimatedStyle(() => {
    const p = reverse ? 1 - t.value : t.value;
    const a = 2 * Math.PI * t.value;
    const spin = a * LOOPS;
    const travel = -size - loop + p * (width + (size + loop) * 2);
    const dir = reverse ? -1 : 1;
    return {
      transform: [
        { translateX: travel + dir * loop * Math.sin(spin) },
        { translateY: top + (height / 2) * Math.sin(a * 2) - loop * (1 - Math.cos(spin)) * 0.8 },
        { rotate: `${-dir * 14 * Math.cos(spin)}deg` },
        // El dibujo mira a la izquierda (la cabeza es la punta de arriba del cuerpo):
        // se voltea cuando vuela hacia la derecha para ir siempre de frente.
        { scaleX: reverse ? 1 : -1 },
      ],
    } as ViewStyle;
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: 0, top: 0, width: size, height: size }, flight]}
    >
      <View style={{ width: size, height: size }}>
        <Wing d={BACK_WING} color={tones.back} flap={flap} size={size} depth={0.6} lag={0.15} />
        <Wing d={FRONT_WING} color={tones.front} flap={flap} size={size} depth={0.75} lag={0} />
        <Svg width={size} height={size} viewBox={`0 0 ${VIEW} ${VIEW}`} style={{ position: "absolute" }}>
          <Path d={BODY} fill="#553B29" />
        </Svg>
      </View>
    </Animated.View>
  );
}
