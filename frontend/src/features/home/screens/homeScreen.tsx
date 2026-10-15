import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Plant from "../../../components/garden/plant";
import AppHeader from "../../../components/layout/appHeader";
import Scenery from "../../../components/layout/scenery";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { MOOD_REPLIES, MoodId } from "../../../constants/emotions";
import { stageForDay } from "../../../constants/plant";
import { useTimeOfDay } from "../../../hooks/useTimeOfDay";
import { friendlyError } from "../../../services/api";
import { moodService } from "../../../services/moodService";
import { useActiveMatch } from "../../exchange/hooks/useActiveMatch";
import EmotionSelector from "../components/emotionSelector";

interface ActionProps {
  title: string;
  caption: string;
  action: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function ActionCard({ title, caption, action, icon, onPress }: ActionProps) {
  return (
    <Card tone="green" className="flex-row items-center justify-between">
      <View className="flex-1 pr-3">
        <Text variant="subtitle2" className="text-secondary-dark-active">
          {title}
        </Text>
        <Text variant="caption1" className="mb-3 text-secondary-dark-hover">
          {caption}
        </Text>
        <Button
          color="secondary"
          size="small"
          fullWidth={false}
          icon="arrow-forward"
          onPress={onPress}
        >
          {action}
        </Button>
      </View>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-white/70">
        <Ionicons name={icon} size={26} color={colors.secondary.dark} />
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const time = useTimeOfDay();
  const { match } = useActiveMatch();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectMood = async (id: MoodId) => {
    setMood(id);
    setSaving(true);
    setError(null);
    try {
      await moodService.save(id);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Scenery time={time}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader showSettings={false} />
        <View className="items-center pt-4">
          <Plant stage={match ? stageForDay(match.day) : 1} size={150} />
        </View>

        <View className="flex-1 justify-end px-6 pb-4">
          <View className="gap-3 rounded-card bg-white/80 p-4">
            <View>
              <Text
                variant="subtitle2"
                className="text-center text-primary-normal-active"
              >
                ¿Cómo te sientes?
              </Text>
              <Text
                variant="caption1"
                className="mb-3 text-center text-primary-dark-hover"
              >
                {mood ? MOOD_REPLIES[mood] : "Cuéntanos cómo estás hoy"}
              </Text>
              <EmotionSelector
                value={mood}
                onSelect={selectMood}
                disabled={saving}
              />
            </View>
            {error && (
              <Banner
                tone="error"
                message={error}
                actionLabel="Reintentar"
                onAction={() => mood && selectMood(mood)}
              />
            )}
          </View>

          <View className="mt-3 gap-3">
            <ActionCard
              title="Conversa"
              caption={
                match
                  ? `${match.partner.username} te está esperando`
                  : "Comienza una nueva conexión"
              }
              action={match ? "Continuar" : "Iniciar"}
              icon="chatbubble-ellipses-outline"
              onPress={() => router.push("/(tabs)/exchange")}
            />
            <ActionCard
              title="Ver jardín"
              caption="Cuida lo que has hecho crecer"
              action="Regar"
              icon="water-outline"
              onPress={() => router.push("/(tabs)/garden")}
            />
          </View>
        </View>
      </SafeAreaView>
    </Scenery>
  );
}
