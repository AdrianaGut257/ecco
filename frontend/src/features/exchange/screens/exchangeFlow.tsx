import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { Match } from "../../../types";
import ConnectionActiveScreen from "./connectionActiveScreen";
import ConversationScreen from "./conversationScreen";
import MatchFoundScreen from "./matchFoundScreen";
import MatchingScreen from "./matchingScreen";
import ThemeSelectionScreen from "./themeSelectionScreen";

type Step =
  | { name: "loading" }
  | { name: "error"; message: string }
  | { name: "theme" }
  | { name: "matching"; hobbies: string[]; resume: boolean }
  | { name: "found"; match: Match }
  | { name: "active"; match: Match }
  | { name: "chat"; match: Match };

export default function ExchangeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: "loading" });

  const load = useCallback(async () => {
    try {
      const current = await matchService.current();
      if (current) return setStep({ name: "active", match: current });
      const search = await matchService.searchState();
      if (search.status === "matched" && search.match) {
        return setStep({ name: "found", match: search.match });
      }
      if (search.status === "searching") {
        return setStep({ name: "matching", hobbies: search.hobbies, resume: true });
      }
      setStep({ name: "theme" });
    } catch (e) {
      setStep({ name: "error", message: friendlyError(e) });
    }
  }, []);

  const stepRef = useRef(step);
  stepRef.current = step;

  useFocusEffect(
    useCallback(() => {
      const busy = ["chat", "matching", "found"].includes(stepRef.current.name);
      if (!busy) load();
    }, [load]),
  );

  const goHome = useCallback(() => router.navigate("/(tabs)/home"), [router]);
  const goGarden = useCallback(() => router.navigate("/(tabs)/garden"), [router]);
  const onFound = useCallback((match: Match) => setStep({ name: "found", match }), []);

  switch (step.name) {
    case "loading":
      return (
        <Container center>
          <ActivityIndicator color={colors.primary["dark-hover"]} />
        </Container>
      );
    case "error":
      return (
        <Container flush padded={false}>
          <AppHeader showBack onBack={goHome} showSettings={false} />
          <View className="flex-1 justify-center gap-4 px-7">
            <Banner tone="error" message={step.message} />
            <Button onPress={load}>Intentar de nuevo</Button>
          </View>
        </Container>
      );
    case "matching":
      return (
        <MatchingScreen
          hobbies={step.hobbies}
          resume={step.resume}
          onCancel={() => setStep({ name: "theme" })}
          onLeave={goHome}
          onFound={onFound}
        />
      );
    case "found":
      return (
        <MatchFoundScreen
          match={step.match}
          onContinue={() => setStep({ name: "chat", match: step.match })}
        />
      );
    case "active":
      return (
        <ConnectionActiveScreen
          match={step.match}
          onContinue={() => setStep({ name: "chat", match: step.match })}
        />
      );
    case "chat":
      return (
        <ConversationScreen
          matchId={step.match.id}
          initial={step.match}
          onBack={load}
          onNewConnection={() => setStep({ name: "theme" })}
          onGarden={goGarden}
        />
      );
    default:
      return (
        <ThemeSelectionScreen
          onBack={goHome}
          onSelect={(hobbies) =>
            setStep({ name: "matching", hobbies, resume: false })
          }
        />
      );
  }
}
