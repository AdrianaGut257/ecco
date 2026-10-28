import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import MeadowScene from "../../../components/illustrations/meadowScene";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { MOOD_REPLIES, MoodId } from "../../../constants/emotions";
import { friendlyError } from "../../../services/api";
import { moodService } from "../../../services/moodService";
import { moodCheckIn } from "../../../store/moodCheckIn";
import { sessionStore } from "../../../store/session";
import { greeting } from "../../../utils/greeting";
import EmotionSelector from "../components/emotionSelector";

const BREATHE_DELAY_MS = 1100;

// Primera pantalla del día: antes de entrar, la persona cuenta cómo se siente sobre el paisaje con sol.
export default function CheckInScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const sky = Math.min(width, 520) * 0.3;
  const hills = Math.min(width, 520) * 0.24;

  const goHome = () => router.replace("/(tabs)/home");

  const choose = async (id: MoodId) => {
    setMood(id);
    setSaving(true);
    setError(null);
    try {
      await moodService.save(id);
      if (id === "mal" || id === "fatal") {
        setTimeout(
          () => router.replace({ pathname: "/breathe", params: { mood: id } }),
          BREATHE_DELAY_MS,
        );
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  const skip = async () => {
    await moodCheckIn.skip();
    goHome();
  };

  const saved = mood && !saving && !error;
  const low = mood === "mal" || mood === "fatal";

  return (
    <View className="flex-1">
      <MeadowScene />
      <SafeAreaView edges={["top", "bottom"]} className="flex-1">
        <ScrollView
          contentContainerClassName="grow items-center justify-center px-6"
          contentContainerStyle={{ paddingTop: sky, paddingBottom: hills }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(500)}
            className="w-full max-w-[420px] gap-4 rounded-card px-5 pb-6 pt-7"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              shadowColor: "#4C5B2C",
              shadowOpacity: 0.12,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <View className="items-center">
              <Text variant="body3" className="text-secondary-darker">
                {`${greeting()}, ${user?.username ?? ""}`}
              </Text>
              <Text variant="h3" className="mt-1 text-center">
                ¿Cómo te sientes hoy?
              </Text>
            </View>

            <EmotionSelector value={mood} onSelect={choose} disabled={saving} />

            <Text
              variant="caption1"
              className="text-center text-primary-dark-hover"
              accessibilityLiveRegion="polite"
            >
              {mood
                ? MOOD_REPLIES[mood]
                : "No hay respuestas correctas. Solo cuéntanos cómo estás."}
            </Text>

            {error && (
              <Banner
                tone="error"
                message={error}
                actionLabel="Reintentar"
                onAction={() => mood && choose(mood)}
              />
            )}

            {saved && !low ? (
              <Animated.View entering={FadeIn.duration(300)}>
                <Button color="secondary" icon="arrow-forward" onPress={goHome}>
                  Entrar
                </Button>
              </Animated.View>
            ) : (
              !mood && (
                <Pressable
                  onPress={skip}
                  hitSlop={8}
                  accessibilityRole="button"
                  className="min-h-[40px] items-center justify-center"
                >
                  <Text variant="body3" className="text-primary-dark-hover underline">
                    Ahora no
                  </Text>
                </Pressable>
              )
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
