import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Plant from "../../../components/garden/plant";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Card from "../../../components/ui/card";
import EmptyState from "../../../components/ui/emptyState";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { gardenService } from "../../../services/gardenService";
import type { GardenEntry } from "../../../types";

export default function GardenScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<GardenEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setEntries(await gardenService.list());
    } catch (e) {
      setError(friendlyError(e));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Container flush padded={false} scroll>
      <AppHeader />
      <View className="px-7 pt-4">
        <Text variant="h3">Tu jardín</Text>
        <Text variant="body3" className="mb-5 text-primary-dark-hover">
          Cada conversación deja una planta que sigue creciendo.
        </Text>

        {error && (
          <Banner
            tone="error"
            message={error}
            actionLabel="Reintentar"
            onAction={load}
          />
        )}

        {!entries && !error && (
          <ActivityIndicator color={colors.primary.normal} />
        )}

        {entries && entries.length === 0 && (
          <EmptyState
            icon="flower-outline"
            title="Tu jardín está esperando"
            message="Cuando termines tu primera conversación, aquí florecerá tu primera planta."
            actionLabel="Empezar una conversación"
            onAction={() => router.push("/(tabs)/exchange")}
          />
        )}

        {entries && entries.length > 0 && (
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                tone="green"
                className="w-[48%] items-center"
              >
                <Plant stage={entry.stage} size={96} />
                <Text variant="body3" className="text-secondary-dark-active">
                  {entry.partnerName}
                </Text>
                <Text variant="caption2" className="text-secondary-dark-hover">
                  {new Date(entry.startedAt).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </View>
    </Container>
  );
}
