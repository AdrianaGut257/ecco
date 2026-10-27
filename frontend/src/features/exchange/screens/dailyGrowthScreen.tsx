import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
  ZoomIn,
} from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Plant, { STEP_MS } from "../../../components/garden/plant";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { CHAT_DAYS, STAGE_NAMES } from "../../../constants/plant";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  // Etapa en la que la persona vio la planta la última vez (0 si es la primera).
  from: number;
  firstTime: boolean;
  onContinue: () => void;
}

const PLANT = 230;

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
      message: `Ahora está en la etapa "${STAGE_NAMES[match.stage]}". Da un paso más cada día en que tú y ${name} se escriben.`,
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
      message: `Es una semilla. Crece cada día en que tú y ${name} se escriben.`,
    };
  }
  return {
    title: STAGE_NAMES[match.stage],
    message: `Hoy pueden hacerla crecer: basta con que tú y ${name} se escriban.`,
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
  const growMs = reduced || steps === 0 ? 0 : 250 + (steps - 1) * STEP_MS * 0.75 + STEP_MS;
  const textDelay = Math.max(500, growMs);
  const copy = copyFor(match, grew, firstTime);
  const dayLabel =
    match.status === "bloomed"
      ? "Conexión florecida"
      : `Día ${Math.min(match.day, CHAT_DAYS)} de ${CHAT_DAYS}`;

  return (
    <Container
      center
      footer={
        <Animated.View entering={FadeIn.delay(textDelay + 300).duration(400)}>
          <Button
            color="secondary"
            icon="arrow-forward"
            onPress={onContinue}
          >
            Ir a la conversación
          </Button>
        </Animated.View>
      }
    >
      <View className="items-center">
        <Animated.View entering={FadeIn.duration(400)}>
          <Text
            variant="caption2"
            className="rounded-chip bg-secondary-light-active px-3 py-1 uppercase tracking-widest text-secondary-darker"
          >
            {dayLabel}
          </Text>
        </Animated.View>

        <View
          className="mt-6 items-center justify-center rounded-full bg-secondary-light"
          style={{ width: PLANT + 30, height: PLANT + 30 }}
          accessible
          accessibilityLabel={`Su planta: ${STAGE_NAMES[match.stage]}`}
        >
          <Plant stage={match.stage} size={PLANT} growIn from={start} />
          {grew && (
            <Animated.View
              entering={ZoomIn.delay(growMs).springify().damping(8)}
              className="absolute right-6 top-8"
            >
              <Ionicons name="sparkles" size={34} color={colors.mood.bien} />
            </Animated.View>
          )}
        </View>

        <Animated.View
          entering={FadeInDown.delay(textDelay).duration(500)}
          className="mt-6 items-center"
        >
          <Text variant="h3" className="text-center" accessibilityLiveRegion="polite">
            {copy.title}
          </Text>
          <Text
            variant="body2"
            className="mt-2 max-w-[300px] text-center text-primary-dark-hover"
          >
            {copy.message}
          </Text>
          <View className="mt-4 flex-row items-center gap-2">
            <Avatar
              config={match.partner.avatar}
              mood={match.partner.mood}
              size={32}
              label={`Avatar de ${match.partner.username}`}
            />
            <Text variant="body3" className="text-primary-dark-active">
              {`Tu planta con ${match.partner.username}`}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Container>
  );
}
