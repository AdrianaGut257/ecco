import { useFocusEffect } from "expo-router";
import { ReactNode, useCallback, useEffect, useState } from "react";
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
import { tabBarBackdrop } from "../../store/tabBarBackdrop";
import { HOME_BACK_BASE, HOME_BUSH_ROOTS, HOME_PARTS, HOME_SKY, HOME_VIEW } from "./homeParts";

interface Props {
  children: ReactNode;
}

const LOOP_MS = 14000;
const TAU = Math.PI * 2;
// Solo se dibuja la parte de arriba del paisaje: debajo, la colina ya se volvió blanca.
const BAND_H = 420;
// Margen a los lados para que las capas no dejen ver su borde al moverse.
const PAD = 45;

const layer = (inner: string) =>
  `<svg viewBox="${-PAD} 0 ${HOME_VIEW.w + PAD * 2} ${BAND_H}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const XML = {
  backHill: layer(HOME_PARTS.backHill),
  bushLeft: layer(HOME_PARTS.bushLeft),
  bushRight: layer(HOME_PARTS.bushRight),
  frontHill: layer(HOME_PARTS.frontHill),
};

const pivot = (px: number, py: number, inner: object[]): object[] => {
  "worklet";
  return [{ translateX: px }, { translateY: py }, ...inner, { translateX: -px }, { translateY: -py }];
};

function Layer({ xml, width, height, t, motion }: {
  xml: string;
  width: number;
  height: number;
  t: SharedValue<number>;
  motion: (p: number) => object[];
}) {
  const pad = (PAD * width) / HOME_VIEW.w;
  const style = useAnimatedStyle(() => ({ transform: motion(t.value) }) as ViewStyle);
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: -pad, top: 0, width: width + pad * 2, height }, style]}
    >
      <SvgXml xml={xml} width={width + pad * 2} height={height} />
    </Animated.View>
  );
}

// Fondo de Inicio (assets/svg/background/home.svg) animado: la colina de adelante se mece
// con la brisa, la de atrás un poco menos y los arbustos se mueven con ella. Respeta "reducir movimiento".
export default function Scenery({ children }: Props) {
  const [width, setWidth] = useState(0);
  const reduced = useReducedMotion();
  const t = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      tabBarBackdrop.set("#FFFFFF");
      return tabBarBackdrop.reset;
    }, []),
  );

  useEffect(() => {
    if (reduced) return;
    t.value = withRepeat(withTiming(1, { duration: LOOP_MS, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [reduced, t]);

  const u = width / HOME_VIEW.w;
  const height = BAND_H * u;
  const at = (x: number, y: number) => ({ x: x * u - width / 2, y: y * u - height / 2 });
  const back = at(0, HOME_BACK_BASE);
  const left = at(HOME_BUSH_ROOTS.left.x, HOME_BUSH_ROOTS.left.y);
  const right = at(HOME_BUSH_ROOTS.right.x, HOME_BUSH_ROOTS.right.y);

  // Colina de atrás: se mueve poco.
  const backMotion = (p: number) => {
    "worklet";
    return pivot(0, back.y, [
      { translateX: -3 * u * Math.sin(TAU * p + 1.2) },
      { scaleY: 1 + 0.02 * Math.sin(TAU * 2 * p) },
    ]);
  };

  return (
    <View className="flex-1 bg-white" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, width, height }}>
          <View style={{ position: "absolute", top: 0, left: 0, width, height: HOME_SKY.h * u, backgroundColor: HOME_SKY.color }} />
          <Layer xml={XML.backHill} width={width} height={height} t={t} motion={backMotion} />
          <Layer
            xml={XML.bushLeft}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return [...backMotion(p), ...pivot(left.x, left.y, [{ skewX: `${3 * Math.sin(TAU * 3 * p)}deg` }])];
            }}
          />
          <Layer
            xml={XML.bushRight}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return [...backMotion(p), ...pivot(right.x, right.y, [{ skewX: `${-3 * Math.sin(TAU * 3 * p + 1)}deg` }])];
            }}
          />
          {/* Colina de adelante: la que más se mueve. */}
          <Layer
            xml={XML.frontHill}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return [
                { translateX: 9 * u * Math.sin(TAU * p + 0.6) },
                { translateY: 3 * u * Math.sin(TAU * 2 * p) },
              ];
            }}
          />
        </View>
      )}
      {children}
    </View>
  );
}
