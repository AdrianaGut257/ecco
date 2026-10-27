import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Plant, { STEP_MS } from "../../../components/garden/plant";
import MeadowScene from "../../../components/illustrations/meadowScene";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS, STAGE_NAMES } from "../../../constants/plant";
import { tabBarBackdrop } from "../../../store/tabBarBackdrop";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  // Etapa en la que la persona vio la planta la última vez (0 si es la primera).
  from: number;
  firstTime: boolean;
  onContinue: () => void;
}

const PLANT = 168;
// Verde de la colina de adelante: así la muesca de la barra continúa el paisaje.
const GROUND = "#73A15C";

function copyFor(match: Match, grew: boolean, firstTime: boolean) {
  const name = match.partner.username;
  if (match.status === "bloomed") {
    return {
      title: "Su flor sigue viva",
      message: `Florece mientras tú y ${name} sigan conversando.`,
    };
  }
  if (grew) {
    return {
      title: "¡Su planta creció!",
      message: `Ahora es "${STAGE_NAMES[match.stage]}". Da un paso más cada día en que tú y ${name} se escriben.`,
    };
  }
  if (match.day > CHAT_DAYS) {
    return {
      title: STAGE_NAMES[match.stage],
      message: "Los 7 días terminaron. Mira lo que cultivaron antes de decidir.",
    };
  }
  if (firstTime && match.stage === 0) {
    return {
      title: "Aquí empieza su planta",
      message: `Hay una conversación esperándote. La semilla crece cada día en que tú y ${name} se escriben.`,
    };
  }
  return {
    title: STAGE_NAMES[match.stage],
    message: `Hay una conversación esperándote. Hoy pueden hacerla crecer si tú y ${name} se escriben.`,
  };
}

// Pantalla breve que abre la conversación una vez al día: la planta recorre su crecimiento antes del chat.
export default function DailyGrowthScreen({
  match,
  from,
  firstTime,
  onContinue,
}: Props) {
  const reduced = useReducedMotion();
  const grew = !firstTime && match.stage > from;
  const start = grew ? from : 0;
  const steps = match.stage - start;
  const growMs =
    reduced || steps === 0 ? 0 : 250 + (steps - 1) * STEP_MS * 0.75 + STEP_MS;
  const textDelay = Math.max(400, growMs);
  const copy = copyFor(match, grew, firstTime);
  const dayLabel =
    match.status === "bloomed"
      ? "Conexión florecida"
      : `Día ${Math.min(match.day, CHAT_DAYS)} de ${CHAT_DAYS}`;

  // Deja ver las nubes y el sol arriba y las colinas abajo.
  const { width } = useWindowDimensions();
  const sky = Math.min(width, 520) * 0.3;
  const hills = Math.min(width, 520) * 0.24;

  useEffect(() => {
    tabBarBackdrop.set(GROUND);
    return tabBarBackdrop.reset;
  }, []);

  return (
    <View className="flex-1">
      <MeadowScene />
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          contentContainerClassName="grow items-center justify-center px-6"
          contentContainerStyle={{ paddingTop: sky, paddingBottom: hills }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(500)}
            className="w-full max-w-[420px] items-center rounded-card px-6 pb-6 pt-7"
            style={{
              backgroundColor: "rgba(228, 239, 206, 0.94)",
              shadowColor: "#4C5B2C",
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <Text
              variant="subtitle1"
              className="uppercase tracking-widest text-secondary-darker"
            >
              {dayLabel}
            </Text>

            <View
              className="mt-3 items-center justify-center"
              accessible
              accessibilityLabel={`Su planta: ${STAGE_NAMES[match.stage]}`}
            >
              <Plant stage={match.stage} size={PLANT} growIn from={start} />
              {grew && (
                <Animated.View
                  entering={ZoomIn.delay(growMs).springify().damping(8)}
                  className="absolute right-6 top-4"
                >
                  <Ionicons name="sparkles" size={30} color={colors.mood.bien} />
                </Animated.View>
              )}
            </View>

            <Animated.View
              entering={FadeInDown.delay(textDelay).duration(500)}
              className="mt-3 items-center"
            >
              <Text
                variant="subtitle2"
                className="text-center"
                accessibilityLiveRegion="polite"
              >
                {copy.title}
              </Text>
              <Text
                variant="body3"
                className="mt-1.5 text-center text-secondary-darker"
              >
                {copy.message}
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeIn.delay(textDelay + 250).duration(400)}
              className="mt-6 w-full"
            >
              <Button color="secondary" icon="arrow-forward" onPress={onContinue}>
                Continuar
              </Button>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
