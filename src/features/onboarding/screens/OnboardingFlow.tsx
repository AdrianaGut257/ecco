import { useRouter } from "expo-router";
import { useState } from "react";
import AvatarScreen from "./AvatarScreen";
import InterestsScreen from "./InterestsScreen";
import OnboardingSlidesScreen from "./OnboardingSlidesScreen";
import TermsScreen from "./TermsScreen";

export default function OnboardingFlow() {
  const [step, setStep] = useState<"terms" | "avatar" | "interests" | "slides">(
    "terms",
  );
  const router = useRouter();

  if (step === "terms") {
    return <TermsScreen onComplete={() => setStep("avatar")} />;
  }

  if (step === "avatar") {
    return <AvatarScreen onComplete={() => setStep("interests")} />;
  }

  if (step === "interests") {
    return <InterestsScreen onComplete={() => setStep("slides")} />;
  }

  return (
    <OnboardingSlidesScreen onComplete={() => router.replace("/(tabs)/home")} />
  );
}
