import { useEffect } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Plant from "../../../components/garden/plant";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { STAGE_NAMES } from "../../../constants/plant";
import type { GardenEntry, MatchStatus } from "../../../types";

const SWAY_MS = 3600;
export const LABEL_H = 58;
// Dónde empieza el dibujo de cada etapa (fracción del alto, medido en flower.svg): la etiqueta
// baja hasta ahí para quedar justo encima de la planta, sea semilla o flor.
export const PLANT_TOP = [0.8, 0.6, 0.53, 0.41, 0.22, 0.12, 0];

// La conversación de esta semana dice cómo va; las demás, su fecha. Las florecidas se distinguen
// por el aro amarillo de la foto y las mariposas.
const NOTE: Partial<Record<MatchStatus, string>> = {
  active: "Esta semana",
  deciding: "Hora de decidir",
  waiting: "Esperando",
};

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("es", { day: "numeric", month: "short" });

// Una planta del jardín: arriba, una etiqueta con la foto, el nombre y la fecha; debajo, la planta
// que se mece desde su raíz.
export default function GardenPlot({
  entry,
  index,
  size,
  onPress,
}: {
  entry: GardenEntry;
  index: number;
  size: number;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const sway = useSharedValue(0);
  const bloomed = entry.status === "bloomed";

  useEffect(() => {
    if (reduced) return;
    sway.value = withRepeat(
      withTiming(1, { duration: SWAY_MS + (index % 4) * 420, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    return () => cancelAnimation(sway);
  }, [reduced, sway, index]);

  // Gira desde la raíz de la planta (pivote con translate, igual en web y en el teléfono).
  const plantStyle = useAnimatedStyle(
    () =>
      ({
        transform: [
          { translateY: size * 0.34 },
          { rotate: `${(index % 2 ? 1 : -1) * (sway.value * 5 - 2.5)}deg` },
          { translateY: -size * 0.34 },
        ],
      }) as ViewStyle,
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 110).duration(500)} className="items-center">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Planta con ${entry.partnerName}: ${STAGE_NAMES[entry.stage]}. Ver el recuerdo`}
        className="items-center"
      >
        <View style={{ height: LABEL_H }} className="items-center justify-end">
          <View
            className="flex-row items-center gap-2 rounded-2xl bg-white px-2.5 py-1.5"
            style={{
              shadowColor: "#4C5B2C",
              shadowOpacity: 0.16,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,
            }}
          >
            <View
              className="overflow-hidden rounded-full border-2"
              style={{ borderColor: bloomed ? colors.mood.bien : colors.secondary["light-active"] }}
            >
              <Avatar config={entry.partnerAvatar} size={26} />
            </View>
            <View>
              <Text variant="caption2" className="text-primary-dark-active" numberOfLines={1}>
                {entry.partnerName}
              </Text>
              <Text variant="caption1" className="text-primary-dark-hover">
                {NOTE[entry.status] ?? dateOf(entry.startedAt)}
              </Text>
            </View>
          </View>
          <View className="-mt-1.5 h-3 w-3 rotate-45 bg-white" />
        </View>

        <View style={{ width: size, height: size, marginTop: -size * (PLANT_TOP[entry.stage] ?? 0) + 2 }}>
          <Animated.View style={plantStyle}>
            <Plant stage={entry.stage} size={size} growIn />
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
