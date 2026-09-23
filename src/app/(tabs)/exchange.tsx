import { useRouter } from "expo-router";
import { useState } from "react";
import ComposeScreen from "../../features/exchange/screens/composeScreen";
import EmpathyScreen from "../../features/exchange/screens/empathyScreen";
import MatchingScreen from "../../features/exchange/screens/matchingScreen";
import ThemeSelectionScreen from "../../features/exchange/screens/themeSelectionScreen";

export default function ExchangeTab() {
  const [step, setStep] = useState<
    "theme" | "matching" | "empathy" | "compose"
  >("theme");
  const router = useRouter();

  if (step === "theme") {
    return <ThemeSelectionScreen onSelect={() => setStep("matching")} />;
  }

  if (step === "matching") {
    return <MatchingScreen onComplete={() => setStep("empathy")} />;
  }

  if (step === "empathy") {
    return <EmpathyScreen onComplete={() => setStep("compose")} />;
  }

  return <ComposeScreen onComplete={() => router.replace("/home")} />;
}
