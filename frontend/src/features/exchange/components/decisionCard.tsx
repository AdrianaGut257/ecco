import { useState } from "react";
import { View } from "react-native";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { DECISION_GRACE_DAYS, CHAT_DAYS } from "../../../constants/plant";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { Match, MatchDecision } from "../../../types";

interface Props {
  match: Match;
  onDecided: (updated: Match, decision: MatchDecision) => void;
}

export default function DecisionCard({ match, onDecided }: Props) {
  const [loading, setLoading] = useState<MatchDecision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const daysLeft = CHAT_DAYS + DECISION_GRACE_DAYS - match.day;

  const decide = async (decision: MatchDecision) => {
    setLoading(decision);
    setError(null);
    try {
      onDecided(await matchService.decide(match.id, decision), decision);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card tone="green" className="gap-3">
      <Text variant="subtitle2" className="text-secondary-dark-hover">
        {`¿Te gustaría seguir en contacto con ${match.partner.username}?`}
      </Text>
      <Text variant="caption1" className="text-secondary-dark-active">
        {`Tu respuesta es privada: solo se abre la conexión si ambos dicen que sí. ${
          daysLeft > 0
            ? `Tienes ${daysLeft === 1 ? "1 día más" : `${daysLeft} días más`} para pensarlo.`
            : "Hoy es el último día para responder."
        }`}
      </Text>
      {error && <Banner tone="error" message={error} />}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            color="secondary"
            size="small"
            loading={loading === "continue"}
            disabled={loading !== null}
            onPress={() => decide("continue")}
          >
            Sí, seguir
          </Button>
        </View>
        <View className="flex-1">
          <Button
            color="secondary"
            variant="outlined"
            size="small"
            loading={loading === "leave"}
            disabled={loading !== null}
            onPress={() => decide("leave")}
          >
            Cerrar aquí
          </Button>
        </View>
      </View>
    </Card>
  );
}
