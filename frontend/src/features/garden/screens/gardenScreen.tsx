import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Avatar from "../../../components/avatar/avatar";
import Plant from "../../../components/garden/plant";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import EmptyState from "../../../components/ui/emptyState";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { STAGE_NAMES } from "../../../constants/plant";
import { friendlyError } from "../../../services/api";
import { gardenService } from "../../../services/gardenService";
import type { GardenEntry, MatchStatus } from "../../../types";

const GROUPS: { title: string; hint: string; statuses: MatchStatus[] }[] = [
  {
    title: "Siguen floreciendo",
    hint: "Conexiones en las que ambos quisieron seguir.",
    statuses: ["bloomed"],
  },
  {
    title: "Creciendo ahora",
    hint: "Tu conversación de esta semana.",
    statuses: ["active", "deciding", "waiting"],
  },
  {
    title: "Recuerdos",
    hint: "Conversaciones que dejaron algo bonito.",
    statuses: ["rested", "closed"],
  },
];

const STATUS_LABEL: Partial<Record<MatchStatus, string>> = {
  deciding: "Es momento de decidir",
  waiting: "Esperando respuesta",
};

function PlantCard({
  entry,
  index,
  onPress,
}: {
  entry: GardenEntry;
  index: number;
  onPress?: () => void;
}) {
  const bloomed = entry.status === "bloomed";
  return (
    <Animated.View entering={FadeInDown.delay(index * 60)} className="w-[48%]">
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={`${entry.partnerName}, ${STAGE_NAMES[entry.stage]}`}
        className={`items-center rounded-card p-4 ${
          bloomed ? "bg-secondary-light-active" : "border border-primary-light-active bg-white"
        }`}
      >
        <Plant stage={entry.stage} size={92} />
        <View className="mt-1 flex-row items-center gap-1.5">
          <Avatar config={entry.partnerAvatar} size={22} />
          <Text variant="body3" className="text-primary-dark-active">
            {entry.partnerName}
          </Text>
        </View>
        <Text variant="caption2" className="mt-0.5 text-primary-dark-hover">
          {STATUS_LABEL[entry.status] ??
            new Date(entry.startedAt).toLocaleDateString("es", {
              day: "numeric",
              month: "short",
            })}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

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

  const open = (entry: GardenEntry) => {
    if (entry.status === "bloomed") return () => router.push(`/conversation/${entry.id}`);
    if (entry.status === "active" || entry.status === "deciding")
      return () => router.navigate("/(tabs)/exchange");
    return undefined;
  };

  return (
    <Container flush padded={false} scroll>
      <AppHeader />
      <View className="px-7 pb-8 pt-4">
        <Text variant="h3">Tu jardín</Text>
        <Text variant="body3" className="mb-5 text-primary-dark-hover">
          Cada conversación deja una planta. Crece con cada día compartido.
        </Text>

        {error && (
          <Banner tone="error" message={error} actionLabel="Reintentar" onAction={load} />
        )}

        {!entries && !error && (
          <ActivityIndicator color={colors.primary["dark-hover"]} />
        )}

        {entries && entries.length === 0 && (
          <EmptyState
            icon="flower-outline"
            title="Tu jardín está esperando"
            message="Cuando empieces tu primera conversación, aquí brotará tu primera planta."
            actionLabel="Conocer a alguien"
            onAction={() => router.navigate("/(tabs)/exchange")}
          />
        )}

        {entries &&
          GROUPS.map((group) => {
            const items = entries.filter((e) => group.statuses.includes(e.status));
            if (items.length === 0) return null;
            return (
              <View key={group.title} className="mb-6">
                <Text variant="body2" className="font-heading-semibold text-primary-dark-active">
                  {group.title}
                </Text>
                <Text variant="caption1" className="mb-3 text-primary-dark-hover">
                  {group.hint}
                </Text>
                <View className="flex-row flex-wrap justify-between gap-y-3">
                  {items.map((entry, i) => (
                    <PlantCard key={entry.id} entry={entry} index={i} onPress={open(entry)} />
                  ))}
                </View>
              </View>
            );
          })}
      </View>
    </Container>
  );
}
