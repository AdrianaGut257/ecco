import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import LivingMoodFace from "../../../components/avatar/livingMoodFace";
import MoodFace from "../../../components/avatar/moodFace";
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
import { MOOD_REPLIES, MOODS, MoodId } from "../../../constants/emotions";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import { moodService } from "../../../services/moodService";
import { sessionStore } from "../../../store/session";
import type { Match, MoodEntry } from "../../../types";
import { greeting, isToday } from "../../../utils/greeting";
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
        <Text variant="subtitle2" className="text-secondary-dark-hover">
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

const SEARCH_POLL_MS = 5000;
const COLLAPSE_MS = 2200;
const BREATHE_DELAY_MS = 1100;

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });

// Historial del día: cada vez que la persona actualiza su ánimo queda un registro con la hora.
function TodayMoods({ entries }: { entries: MoodEntry[] }) {
  return (
    <Card tone="white" className="gap-3">
      <View>
        <Text variant="subtitle2">Tu día</Text>
        <Text variant="caption1" className="text-primary-dark-hover">
          Así te has sentido hoy. Puedes actualizarlo cuando quieras.
        </Text>
      </View>
      {[...entries].reverse().map((entry, i) => (
        <Animated.View
          key={entry.createdAt}
          entering={i === 0 ? FadeIn.duration(300) : undefined}
          className="flex-row items-center gap-3"
        >
          <Text variant="caption1" className="w-12 text-primary-dark-hover">
            {timeOf(entry.createdAt)}
          </Text>
          <MoodFace mood={entry.mood} size={28} />
          <Text variant="body3">
            {MOODS.find((m) => m.id === entry.mood)?.label}
          </Text>
        </Animated.View>
      ))}
    </Card>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [match, setMatch] = useState<Match | null>(null);
  const [searching, setSearching] = useState(false);
  const [justFound, setJustFound] = useState(false);
  const focused = useIsFocused();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [todayMoods, setTodayMoods] = useState<MoodEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
  }, []);

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
          const today = history.filter((m) => isToday(m.createdAt));
          setTodayMoods(today);
          if (today.length) setMood(today[today.length - 1].mood);
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

  const breathe = (id: MoodId) => router.push({ pathname: "/breathe", params: { mood: id } });

  // Tras elegir, la cara reacciona y se muestra la respuesta; luego la tarjeta se recoge en un resumen.
  // Con "mal" o "fatal" se abre antes la pantalla de respiración.
  const selectMood = async (id: MoodId) => {
    setMood(id);
    setEditing(true);
    setSaving(true);
    setError(null);
    if (collapseTimer.current) clearTimeout(collapseTimer.current);
    try {
      const entry = await moodService.save(id);
      setTodayMoods((prev) => [...prev, entry]);
      const isLow = id === "fatal" || id === "mal";
      collapseTimer.current = setTimeout(
        () => {
          setEditing(false);
          if (isLow) breathe(id);
        },
        isLow ? BREATHE_DELAY_MS : COLLAPSE_MS,
      );
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

  const portrait = (
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
  );

  const moodLabel = MOODS.find((m) => m.id === mood)?.label.toLowerCase();

  const moodSummary = mood && (
    <Animated.View
      key="summary"
      entering={FadeIn.duration(350)}
      exiting={FadeOut.duration(150)}
      className="gap-2 rounded-card bg-white/90 p-4"
    >
      <View className="flex-row items-center gap-3">
        <LivingMoodFace mood={mood} size={44} />
        <View className="flex-1">
          <Text variant="subtitle2">
            {`Hoy te sientes ${moodLabel}`}
          </Text>
          <Text variant="caption1" className="text-primary-dark-hover">
            {MOOD_REPLIES[mood]}
          </Text>
        </View>
      </View>
      <View className="flex-row flex-wrap justify-end gap-2">
        {low && (
          <Button
            color="tertiary"
            variant="outlined"
            size="small"
            fullWidth={false}
            icon="leaf-outline"
            onPress={() => breathe(mood)}
          >
            Respirar
          </Button>
        )}
        <Button
          color="primary"
          variant="outlined"
          size="small"
          fullWidth={false}
          icon="refresh"
          onPress={() => setEditing(true)}
        >
          Actualizar
        </Button>
      </View>
    </Animated.View>
  );

  const moodCard = !editing && mood ? moodSummary : (
          <Animated.View
            key="selector"
            entering={FadeIn.duration(350)}
            exiting={FadeOut.duration(150)}
            className="gap-3 rounded-card bg-white/90 p-4"
          >
            <Text variant="subtitle2" className="text-center">
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
            {error && (
              <Banner
                tone="error"
                message={error}
                actionLabel="Reintentar"
                onAction={() => mood && selectMood(mood)}
              />
            )}
          </Animated.View>
  );

  const actions = (
          <View className="gap-3">
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
            {todayMoods.length > 0 && <TodayMoods entries={todayMoods} />}
          </View>
  );

  return (
    <Scenery>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerClassName="grow px-6 pb-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="-mx-6">
            <AppHeader showSettings={false} />
          </View>
          <Text variant="h4" className="mt-2 text-primary-dark-active">
            {`${greeting()}, ${user?.username ?? ""}`}
          </Text>
          {portrait}
          {moodCard}
          <Animated.View layout={LinearTransition.duration(300)} className="mt-3">
            {actions}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Scenery>
  );
}
