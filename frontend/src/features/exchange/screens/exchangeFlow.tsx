import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppHeader from "../../../components/layout/appHeader";
import Container from "../../../components/layout/container";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import { colors } from "../../../constants/colors";
import type { Match } from "../../../types";
import { useActiveMatch } from "../hooks/useActiveMatch";
import ComposeScreen from "./composeScreen";
import ConnectionActiveScreen from "./connectionActiveScreen";
import MatchFoundScreen from "./matchFoundScreen";
import MatchingScreen from "./matchingScreen";
import ThemeSelectionScreen from "./themeSelectionScreen";

type Step = "active" | "theme" | "matching" | "found" | "chat";

export default function ExchangeFlow() {
  const router = useRouter();
  const {
    match: current,
    setMatch: setCurrent,
    loading,
    error,
    refresh,
  } = useActiveMatch();
  const [step, setStep] = useState<Step | null>(null);
  const [hobbies, setHobbies] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !error && step === null) {
      setStep(current ? "active" : "theme");
    }
  }, [loading, error, current, step]);

  const goHome = useCallback(() => router.replace("/(tabs)/home"), [router]);

  const handleFound = useCallback(
    (found: Match) => {
      setCurrent(found);
      setStep("found");
    },
    [setCurrent],
  );

  const handleFinished = useCallback(() => {
    setCurrent(null);
    goHome();
  }, [setCurrent, goHome]);

  if (error) {
    return (
      <Container flush padded={false}>
        <AppHeader showBack onBack={goHome} showSettings={false} />
        <View className="flex-1 justify-center gap-4 px-7">
          <Banner tone="error" message={error} />
          <Button onPress={refresh}>Intentar de nuevo</Button>
        </View>
      </Container>
    );
  }

  if (loading || step === null) {
    return (
      <Container center>
        <ActivityIndicator color={colors.primary.normal} />
      </Container>
    );
  }

  if (step === "matching") {
    return (
      <MatchingScreen
        hobbies={hobbies}
        onCancel={() => setStep("theme")}
        onFound={handleFound}
      />
    );
  }

  if (step === "theme" || !current) {
    return (
      <ThemeSelectionScreen
        onBack={goHome}
        onSelect={(selected) => {
          setHobbies(selected);
          setStep("matching");
        }}
      />
    );
  }

  if (step === "found") {
    return (
      <MatchFoundScreen match={current} onContinue={() => setStep("chat")} />
    );
  }

  if (step === "chat") {
    return (
      <ComposeScreen
        match={current}
        onBack={() => setStep("active")}
        onFinished={handleFinished}
      />
    );
  }

  return (
    <ConnectionActiveScreen
      match={current}
      onContinue={() => setStep("chat")}
    />
  );
}
