import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../../components/avatar/avatar";
import Plant from "../../../components/garden/plant";
import AppHeader from "../../../components/layout/appHeader";
import Scenery from "../../../components/layout/scenery";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Card from "../../../components/ui/card";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { MOOD_REPLIES, MoodId } from "../../../constants/emotions";
import { useTimeOfDay } from "../../../hooks/useTimeOfDay";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import { moodService } from "../../../services/moodService";
import { sessionStore } from "../../../store/session";
import type { Match } from "../../../types";
import BreathingCard from "../components/breathingCard";
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
        <Text variant="body2" className="font-heading-semibold text-secondary-darker">
          {title}
        </Text>
        <Text variant="caption1" className="mb-3 text-secondary-dark-active">
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
        <Ionicons name={icon} size={26} color={colors.secondary["dark-active"]} />
      </View>
    </Card>
  );
}

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "Buenas noches";
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
};

const SEARCH_POLL_MS = 5000;

const isToday = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString();

export default function HomeScreen() {
  const router = useRouter();
  const time = useTimeOfDay();
  const { user } = sessionStore.use();
  const [match, setMatch] = useState<Match | null>(null);
  const [searching, setSearching] = useState(false);
  const [justFound, setJustFound] = useState(false);
  const focused = useIsFocused();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [current, history] = await Promise.all([
            matchService.current(),
            moodService.history(1),
          ]);
          if (!active) return;
          setMatch(current);
          const today = history.filter((m) => isToday(m.createdAt)).pop();
          if (today) setMood(today.mood);
          if (!current) {
            const search = await matchService.searchState();
            if (active) setSearching(search.status === "searching");
          } else {
            setSearching(false);
          }
        } catch {}
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!focused || !searching) return;
    const id = setInterval(async () => {
      try {
        const state = await matchService.searchState();
        if (state.status === "matched" && state.match) {
          setMatch(state.match);
          setSearching(false);
          setJustFound(true);
        } else if (state.status === "idle") {
          setSearching(false);
        }
      } catch {}
    }, SEARCH_POLL_MS);
    return () => clearInterval(id);
  }, [focused, searching]);

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

  const low = mood === "fatal" || mood === "mal";

  const conversation = match
    ? justFound
      ? {
          title: "¡Encontramos a alguien!",
          caption: `${match.partner.username} comparte tus gustos. Salúdale cuando quieras.`,
          action: "Conocer",
        }
      : {
          title: `Tu conversación con ${match.partner.username}`,
          caption:
            match.status === "deciding"
              ? "Llegó el momento de decidir si quieren seguir."
              : match.canWrite
                ? `Día ${match.day} · te quedan ${match.messagesLeft} mensajes hoy`
                : "Ya compartiste tus mensajes de hoy. Mañana sigue.",
          action: match.status === "deciding" ? "Decidir" : "Abrir",
        }
    : searching
      ? {
          title: "Estamos buscando",
          caption: "Te avisamos aquí apenas encontremos a alguien.",
          action: "Ver búsqueda",
        }
      : {
          title: "Conoce a alguien",
          caption: "Una persona con tus gustos, una semana para conocerse.",
          action: "Empezar",
        };

  return (
    <Scenery time={time}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <AppHeader showSettings={false} />
        <ScrollView
          contentContainerClassName="grow px-6 pb-6"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="h4" className="mt-2 pr-16 text-primary-dark-active">
            {`${greeting()}, ${user?.username ?? ""}`}
          </Text>

          <View className="flex-row items-end justify-center py-4">
            <Animated.View key={mood ?? "none"} entering={FadeIn.duration(300)}>
              <Avatar
                config={user?.avatar}
                mood={mood}
                size={120}
                label="Tu avatar"
              />
            </Animated.View>
            {match && (
              <View className="-ml-6">
                <Plant stage={match.stage} size={90} />
              </View>
            )}
          </View>

          <View className="gap-3 rounded-card bg-white/90 p-4">
            <Text variant="body2" className="text-center font-heading-semibold text-primary-dark-active">
              ¿Cómo te sientes hoy?
            </Text>
            <EmotionSelector value={mood} onSelect={selectMood} disabled={saving} />
            <Text
              variant="caption1"
              className="text-center text-primary-dark-hover"
              accessibilityLiveRegion="polite"
            >
              {mood
                ? MOOD_REPLIES[mood]
                : "No hay respuestas correctas. Solo cuéntanos cómo estás."}
            </Text>
            {mood && match && user?.shareMood && (
              <Text variant="caption2" className="text-center text-primary-dark-hover">
                {`${match.partner.username} verá tu ánimo en la cara de tu avatar.`}
              </Text>
            )}
            {low && <BreathingCard />}
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
              title={conversation.title}
              caption={conversation.caption}
              action={conversation.action}
              icon="chatbubble-ellipses-outline"
              onPress={() => router.navigate("/(tabs)/exchange")}
            />
            <ActionCard
              title="Tu jardín"
              caption="Mira lo que han hecho crecer juntos."
              action="Visitar"
              icon="flower-outline"
              onPress={() => router.navigate("/(tabs)/garden")}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Scenery>
  );
}
