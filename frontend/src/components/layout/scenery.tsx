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
import { HOME_GRASS_ROOTS, HOME_GROUND, HOME_PARTS, HOME_SKY, HOME_VIEW } from "./homeParts";

interface Props {
  children: ReactNode;
}

const LOOP_MS = 14000;
const TAU = Math.PI * 2;
// Solo se dibuja la parte de arriba del paisaje: debajo, el suelo ya se volvió blanco.
const BAND_H = 420;
// Margen a los lados para que las capas no dejen ver su borde al moverse.
const PAD = 45;

const layer = (inner: string) =>
  `<svg viewBox="${-PAD} 0 ${HOME_VIEW.w + PAD * 2} ${BAND_H}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const XML = {
  cloudLeft: layer(HOME_PARTS.cloudLeft),
  cloudRight: layer(HOME_PARTS.cloudRight),
  mountain: layer(HOME_PARTS.mountain),
  tree: layer(HOME_PARTS.tree),
  grassLeft: layer(HOME_PARTS.grassLeft),
  grassRight: layer(HOME_PARTS.grassRight),
  ground: layer(HOME_PARTS.ground),
};

const pivot = (px: number, py: number, inner: object[]): object[] => {
  "worklet";
  return [{ translateX: px }, { translateY: py }, ...inner, { translateX: -px }, { translateY: -py }];
};

const still = () => {
  "worklet";
  return [] as object[];
};

function Layer({ xml, width, height, t, motion = still }: {
  xml: string;
  width: number;
  height: number;
  t: SharedValue<number>;
  motion?: (p: number) => object[];
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

// Fondo de Inicio (assets/svg/background/background3.svg) animado: las nubes van y vienen,
// la montaña de arriba se mueve despacio y la hierba se mece desde su base. El árbol y el suelo
// quedan quietos. Respeta "reducir movimiento".
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
  const ground = at(0, HOME_GROUND);
  const left = at(HOME_GRASS_ROOTS.left.x, HOME_GRASS_ROOTS.left.y);
  const right = at(HOME_GRASS_ROOTS.right.x, HOME_GRASS_ROOTS.right.y);

  return (
    <View className="flex-1 bg-white" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, width, height }}>
          <View style={{ position: "absolute", top: 0, left: 0, width, height: HOME_SKY.h * u, backgroundColor: HOME_SKY.color }} />
          <Layer
            xml={XML.cloudLeft}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return [
                { translateX: 14 * u * Math.sin(TAU * p) },
                { translateY: 1.5 * u * Math.sin(TAU * 2 * p + 0.5) },
              ];
            }}
          />
          <Layer
            xml={XML.cloudRight}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return [
                { translateX: -11 * u * Math.sin(TAU * p + 0.8) },
                { translateY: 1.5 * u * Math.sin(TAU * 2 * p + 2) },
              ];
            }}
          />
          {/* Montaña de arriba: se mueve poco; su base queda tapada por el suelo. */}
          <Layer
            xml={XML.mountain}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return pivot(0, ground.y, [
                { translateX: -4 * u * Math.sin(TAU * p + 1.2) },
                { scaleY: 1 + 0.025 * Math.sin(TAU * 2 * p) },
              ]);
            }}
          />
          <Layer xml={XML.tree} width={width} height={height} t={t} />
          <Layer
            xml={XML.grassLeft}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return pivot(left.x, left.y, [
                { skewX: `${4 * Math.sin(TAU * 3 * p)}deg` },
                { scaleY: 1 + 0.04 * Math.sin(TAU * 3 * p + 1.5) },
              ]);
            }}
          />
          <Layer
            xml={XML.grassRight}
            width={width}
            height={height}
            t={t}
            motion={(p) => {
              "worklet";
              return pivot(right.x, right.y, [
                { skewX: `${-4 * Math.sin(TAU * 3 * p + 1)}deg` },
                { scaleY: 1 + 0.04 * Math.sin(TAU * 3 * p + 2.5) },
              ]);
            }}
          />
          <Layer xml={XML.ground} width={width} height={height} t={t} />
        </View>
      )}
      {children}
    </View>
  );
}
