import { ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg from "react-native-svg";
import type { MoodId } from "../../constants/emotions";
import type { AvatarConfig } from "../../types";
import {
  AVATAR_VIEWBOX,
  EYES_Y,
  EyesArt,
  HandArt,
  OverArt,
  SMILE,
  UnderArt,
  avatarLook,
} from "./avatar";

export type AvatarGesture = "wave" | "cheer" | "nod";

interface Props {
  config?: Partial<AvatarConfig> | null;
  mood?: MoodId | null;
  size?: number;
  label?: string;
  // Saluda al aparecer, tras `greetDelay` ms.
  greet?: boolean;
  greetDelay?: number;
  // Cambiar `key` dispara el gesto desde fuera (por ejemplo, al guardar el ánimo).
  gesture?: { type: AvatarGesture; key: number } | null;
  // Tocar el avatar lo hace saludar.
  interactive?: boolean;
  // Cada tanto hace algo por su cuenta: mira a los lados, se estira o, con ánimo bajo, suspira.
  spontaneous?: boolean;
}

// Cómo está en reposo según su ánimo: cuánto respira y se mece, si está un poco caído
// y, si está feliz, si rebota de vez en cuando (se estira y se aplasta sin despegarse del piso).
const IDLE: Record<MoodId, { period: number; breath: number; sway: number; droop: number; hop: number }> = {
  feliz: { period: 3600, breath: 0.018, sway: 2.2, droop: 0, hop: 0.6 },
  bien: { period: 4400, breath: 0.016, sway: 2.4, droop: 0, hop: 0 },
  normal: { period: 5000, breath: 0.013, sway: 1, droop: 0, hop: 0 },
  mal: { period: 6200, breath: 0.012, sway: 0.7, droop: 2.5, hop: 0 },
  fatal: { period: 7200, breath: 0.01, sway: 0.5, droop: 3.5, hop: 0 },
};

// Cuánto sube la mano al saludar (en unidades del dibujo): de la cadera a la altura del hombro.
const RAISE = { x: 10, y: 30 };
// Cuánto miran los ojos a los lados: poco, para que no lleguen a las mejillas.
const LOOK = 1.2;
const TAU = Math.PI * 2;

function Layer({ size, style, children }: { size: number; style?: object; children: ReactNode }) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", top: 0, left: 0, width: size, height: size }, style]}
    >
      <Svg width={size} height={size} viewBox={AVATAR_VIEWBOX}>
        {children}
      </Svg>
    </Animated.View>
  );
}

// Avatar animado por capas (cuerpo, ojos y cada mano). Respira, parpadea y se mece según su
// ánimo; saluda inclinando el cuerpo y moviendo la bolita de la mano, celebra con las dos manos
// arriba y asiente. Sin movimiento con "reducir movimiento".
export default function LivingAvatar({
  config,
  mood = null,
  size = 120,
  label,
  greet = false,
  greetDelay = 600,
  gesture = null,
  interactive = false,
  spontaneous = false,
}: Props) {
  const reduced = useReducedMotion();
  const a = avatarLook(config, mood);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const idle = IDLE[mood ?? "bien"];
  const low = mood === "mal" || mood === "fatal";
  // El ánimo puede llegar después de montar: los gestos leen siempre el actual.
  const lowRef = useRef(low);
  lowRef.current = low;
  const [joy, setJoy] = useState(false);
  const [restEyes, setRestEyes] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const t = useSharedValue(0);
  const blink = useSharedValue(0);
  const lean = useSharedValue(0);
  const raiseR = useSharedValue(0);
  const raiseL = useSharedValue(0);
  const wiggle = useSharedValue(0);
  const hop = useSharedValue(0);
  const nod = useSharedValue(0);
  const lookX = useSharedValue(0);
  const stretch = useSharedValue(0);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // Respiración y vaivén en bucle, al ritmo del ánimo.
  useEffect(() => {
    if (reduced) return;
    t.value = 0;
    t.value = withRepeat(withTiming(1, { duration: idle.period, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(t);
  }, [reduced, t, idle.period]);

  // Parpadeo cada 3 a 5 s; a veces doble. Solo con los ojos abiertos.
  useEffect(() => {
    if (reduced || a.face.eyes !== "open") return;
    let alive = true;
    const next = () => {
      const wait = 2800 + Math.random() * 2400;
      const id = setTimeout(() => {
        if (!alive) return;
        const twice = Math.random() < 0.25;
        blink.value = twice
          ? withSequence(
              withTiming(1, { duration: 70 }),
              withTiming(0, { duration: 90 }),
              withTiming(1, { duration: 70 }),
              withTiming(0, { duration: 110 }),
            )
          : withSequence(withTiming(1, { duration: 70 }), withTiming(0, { duration: 120 }));
        next();
      }, wait);
      timers.current.push(id);
    };
    next();
    return () => {
      alive = false;
    };
  }, [reduced, a.face.eyes, blink]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  const smile = (ms: number) => {
    if (lowRef.current) return;
    setJoy(true);
    later(() => setJoy(false), ms);
  };

  // Cada gesto: sube, se mueve y, pasado un tiempo, vuelve a su lugar. Las vueltas se programan
  // con temporizadores (no con withDelay anidado) para que siempre terminen en reposo.
  const play = useCallback(
    (type: AvatarGesture) => {
      if (reduced) return;
      const out = Easing.out(Easing.cubic);
      const pop = Easing.out(Easing.back(1.8));
      const settle = { duration: 380, easing: Easing.inOut(Easing.cubic) };
      if (type === "wave") {
        smile(2300);
        lean.value = withTiming(1, { duration: 300, easing: out });
        raiseR.value = withTiming(1, { duration: 420, easing: pop });
        later(() => {
          wiggle.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 160 }),
              withTiming(-1, { duration: 300 }),
              withTiming(0, { duration: 160 }),
            ),
            2,
            false,
          );
        }, 420);
        later(() => {
          lean.value = withTiming(0, settle);
          raiseR.value = withTiming(0, settle);
          wiggle.value = withTiming(0, { duration: 200 });
        }, 1750);
      } else if (type === "cheer") {
        smile(2000);
        raiseR.value = withTiming(1, { duration: 380, easing: pop });
        raiseL.value = withTiming(1, { duration: 420, easing: pop });
        hop.value = withSequence(
          withTiming(-0.5, { duration: 120, easing: out }),
          withTiming(1, { duration: 180, easing: out }),
          withTiming(-0.4, { duration: 160, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.7, { duration: 160, easing: out }),
          withTiming(0, { duration: 220, easing: Easing.inOut(Easing.quad) }),
        );
        later(() => {
          wiggle.value = withRepeat(
            withSequence(withTiming(0.5, { duration: 150 }), withTiming(-0.5, { duration: 300 }), withTiming(0, { duration: 150 })),
            2,
            false,
          );
        }, 380);
        later(() => {
          raiseR.value = withTiming(0, settle);
          raiseL.value = withTiming(0, settle);
          wiggle.value = withTiming(0, { duration: 200 });
        }, 1650);
      } else {
        nod.value = withSequence(
          withTiming(1, { duration: 180, easing: out }),
          withTiming(0, { duration: 220 }),
          withTiming(1, { duration: 180, easing: out }),
          withTiming(0, { duration: 260 }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced, low],
  );

  useEffect(() => {
    if (greet) later(() => play("wave"), greetDelay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greet]);

  // Momentos espontáneos mientras está en reposo.
  useEffect(() => {
    if (!spontaneous || reduced) return;
    let alive = true;
    const out = Easing.out(Easing.cubic);
    const calm = Easing.inOut(Easing.sin);
    const act = () => {
      const options = low ? ["sigh", "look"] : mood === "feliz" ? ["look", "stretch", "hop"] : ["look", "stretch"];
      const pick = options[Math.floor(Math.random() * options.length)];
      if (pick === "look") {
        lookX.value = withSequence(
          withTiming(-LOOK, { duration: 260, easing: out }),
          withTiming(-LOOK, { duration: 700 }),
          withTiming(LOOK, { duration: 380, easing: calm }),
          withTiming(LOOK, { duration: 700 }),
          withTiming(0, { duration: 300, easing: calm }),
        );
      } else if (pick === "stretch") {
        setRestEyes(true);
        stretch.value = withTiming(1, { duration: 900, easing: calm });
        raiseR.value = withTiming(0.55, { duration: 900, easing: calm });
        raiseL.value = withTiming(0.55, { duration: 900, easing: calm });
        later(() => {
          stretch.value = withTiming(0, { duration: 700, easing: calm });
          raiseR.value = withTiming(0, { duration: 700, easing: calm });
          raiseL.value = withTiming(0, { duration: 700, easing: calm });
          setRestEyes(false);
        }, 1600);
      } else if (pick === "sigh") {
        setRestEyes(true);
        stretch.value = withSequence(
          withTiming(-1, { duration: 1200, easing: calm }),
          withTiming(0, { duration: 1500, easing: calm }),
        );
        later(() => setRestEyes(false), 2200);
      } else {
        hop.value = withSequence(
          withTiming(-0.4, { duration: 110, easing: out }),
          withTiming(0.8, { duration: 170, easing: out }),
          withTiming(0, { duration: 230, easing: Easing.inOut(Easing.quad) }),
        );
      }
    };
    const next = () => {
      later(() => {
        if (!alive) return;
        act();
        next();
      }, 9000 + Math.random() * 7000);
    };
    next();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spontaneous, reduced, low, mood]);

  useEffect(() => {
    if (gesture) play(gesture.type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gesture?.key]);

  // De coordenadas del dibujo a px, relativas al centro de la capa.
  const k = size / 162;
  const half = size / 2;
  const eyeY = (EYES_Y + 24) * k - half;

  // El cuerpo gira y se estira desde abajo al centro (sus "pies"); nunca se despega del piso,
  // así no se ve el borde de la ropa. Los ojos y las manos van DENTRO del cuerpo: heredan su
  // movimiento y solo agregan el propio, así nunca se desfasan de la cara.
  const bodyStyle = useAnimatedStyle(() => {
    const p = t.value;
    const breath = Math.sin(TAU * 2 * p);
    const idleBounce = idle.hop > 0 && p < 0.16 ? idle.hop * Math.sin((Math.PI * p) / 0.16) : 0;
    const bounce = hop.value + idleBounce;
    return {
      transform: [
        { translateX: -3 * k * lean.value },
        { translateY: (idle.droop + 4 * nod.value + 3 * Math.max(0, -stretch.value)) * k },
        { translateY: half },
        { rotate: `${idle.sway * Math.sin(TAU * p) - 6 * lean.value}deg` },
        { scaleY: 1 + idle.breath * breath + 0.04 * Math.max(0, stretch.value) + 0.07 * bounce },
        { scaleX: 1 - 0.03 * bounce },
        { translateY: -half },
      ],
    } as ViewStyle;
  });
  const eyesStyle = useAnimatedStyle(
    () =>
      ({
        transform: [
          { translateX: lookX.value * k },
          { translateY: eyeY },
          { scaleY: 1 - 0.9 * blink.value },
          { translateY: -eyeY },
        ],
      }) as ViewStyle,
  );
  const hand = (raise: SharedValue<number>, side: 1 | -1): object[] => {
    "worklet";
    const r = raise.value;
    const bob = Math.sin(TAU * 2 * t.value + (side > 0 ? 0 : 1.5)) * 1.2;
    return [
      { translateX: side * (RAISE.x * r + 5 * wiggle.value * r) * k },
      { translateY: (-RAISE.y * r + bob * (1 - r) - Math.abs(wiggle.value) * 1.5 * r) * k },
      { scale: 1 + 0.05 * r },
    ];
  };
  const rightStyle = useAnimatedStyle(() => ({ transform: hand(raiseR, 1) }) as ViewStyle);
  const leftStyle = useAnimatedStyle(() => ({ transform: hand(raiseL, -1) }) as ViewStyle);

  const art = (
    <View
      style={{ width: size, height: size, borderRadius: half, overflow: "hidden", backgroundColor: a.background }}
      {...(label ? { accessible: true, accessibilityLabel: label, accessibilityRole: "image" as const } : {})}
    >
      <Animated.View
        pointerEvents="none"
        style={[{ position: "absolute", top: 0, left: 0, width: size, height: size }, bodyStyle]}
      >
        <Layer size={size}>
          <UnderArt a={a} id={id} />
        </Layer>
        <Layer size={size} style={eyesStyle}>
          <EyesArt a={a} shape={joy ? "happy" : restEyes ? "closed" : undefined} />
        </Layer>
        <Layer size={size}>
          <OverArt a={a} mouth={joy ? SMILE : undefined} />
        </Layer>
        <Layer size={size} style={leftStyle}>
          <HandArt a={a} side="left" />
        </Layer>
        <Layer size={size} style={rightStyle}>
          <HandArt a={a} side="right" />
        </Layer>
      </Animated.View>
    </View>
  );

  if (!interactive) return art;
  return (
    <Pressable
      onPress={() => play("wave")}
      accessibilityRole="button"
      accessibilityLabel={label ? `${label}. Toca para que salude` : "Toca para que salude"}
    >
      {art}
    </Pressable>
  );
}
