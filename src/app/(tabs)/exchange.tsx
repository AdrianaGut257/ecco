import { useRouter } from "expo-router";
import { useState } from "react";
import ComposeScreen from "../../features/exchange/screens/ComposeScreen";
import EmpathyScreen from "../../features/exchange/screens/EmpathyScreen";
import MatchingScreen from "../../features/exchange/screens/MatchingScreen";

export default function ExchangeTab() {
  const [step, setStep] = useState<"matching" | "empathy" | "compose">(
    "matching",
  );
  const router = useRouter();

  if (step === "matching") {
    return <MatchingScreen onComplete={() => setStep("empathy")} />;
  }

  if (step === "empathy") {
    return <EmpathyScreen onComplete={() => setStep("compose")} />;
  }

  return <ComposeScreen onComplete={() => router.replace("/home")} />;
}
