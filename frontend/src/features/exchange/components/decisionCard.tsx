import { useState } from "react";
import { View } from "react-native";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { MatchDecision } from "../../../types";

interface Props {
  matchId: string;
  partnerName: string;
  onDecided: () => void;
}

export default function DecisionCard({
  matchId,
  partnerName,
  onDecided,
}: Props) {
  const [loading, setLoading] = useState<MatchDecision | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const decide = async (decision: MatchDecision) => {
    setLoading(decision);
    setError(null);
    try {
      await matchService.decide(matchId, decision);
      setDone(true);
      onDecided();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(null);
    }
  };

  if (done) {
    return (
      <Banner
        tone="success"
        message="Gracias. Tu respuesta es privada y solo se abre la conexión si ambos quieren."
      />
    );
  }

  return (
    <Card tone="green" className="gap-3">
      <Text variant="body3" className="text-secondary-dark-active">
        {`Llegó el día 7. ¿Te gustaría seguir en contacto con ${partnerName}?`}
      </Text>
      <Text variant="caption1" className="text-secondary-dark-hover">
        Nadie verá tu respuesta a menos que ambos digan que sí.
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
            Mejor no
          </Button>
        </View>
      </View>
    </Card>
  );
}
