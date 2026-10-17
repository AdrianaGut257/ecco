import { View } from "react-native";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import GrowthPlant from "../../../components/garden/growthPlant";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import type { Match } from "../../../types";

interface Props {
  match: Match;
  onKeepTalking: () => void;
  onNewConnection: () => void;
  onGarden: () => void;
}

const COPY = {
  bloomed: {
    title: "¡Ambos quisieron seguir!",
    message:
      "Su flor ya está en tu jardín. Pueden seguir conversando cuando quieran, con calma.",
  },
  waiting: {
    title: "Tu respuesta quedó guardada",
    message:
      "Si ambos quieren seguir, su flor aparecerá en tu jardín. Mientras tanto, puedes conocer a alguien más.",
  },
  rested: {
    title: "Gracias por esta semana",
    message:
      "Cada conversación deja algo bonito. Su planta queda en tu jardín para que la recuerdes.",
  },
  closed: {
    title: "La conversación se cerró",
    message:
      "Gracias por el tiempo que compartiste. Cuando quieras, puedes conocer a alguien nuevo.",
  },
} as const;

export default function OutcomeScreen({
  match,
  onKeepTalking,
  onNewConnection,
  onGarden,
}: Props) {
  const key =
    match.status === "bloomed" || match.status === "waiting" || match.status === "closed"
      ? match.status
      : "rested";
  const copy = COPY[key];

  return (
    <Container
      center
      footer={
        <View className="gap-3">
          {key === "bloomed" ? (
            <Button color="secondary" onPress={onKeepTalking}>
              Seguir conversando
            </Button>
          ) : (
            <Button onPress={onNewConnection}>Conocer a alguien más</Button>
          )}
          <Button variant="outlined" onPress={onGarden}>
            Ir a mi jardín
          </Button>
        </View>
      }
    >
      <View className="items-center">
        <Animated.View entering={ZoomIn.springify().damping(10)}>
          <GrowthPlant stage={match.stage} size={180} />
        </Animated.View>
        {key === "bloomed" && (
          <Animated.View entering={FadeInUp.delay(300)} className="-mt-8">
            <Avatar config={match.partner.avatar} mood="feliz" size={64} />
          </Animated.View>
        )}
        <Animated.View entering={FadeInUp.delay(200)} className="mt-5 items-center">
          <Text variant="h3" className="text-center">
            {copy.title}
          </Text>
          <Text
            variant="body2"
            className="mt-2 max-w-[300px] text-center text-primary-dark-hover"
          >
            {copy.message}
          </Text>
        </Animated.View>
      </View>
    </Container>
  );
}
