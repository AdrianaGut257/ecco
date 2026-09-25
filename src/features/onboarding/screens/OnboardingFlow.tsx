import { useRouter } from "expo-router";
import { useState } from "react";
import AvatarScreen from "./AvatarScreen";
import InterestDetailsScreen from "./InterestDetailsScreen";
import InterestsScreen from "./InterestsScreen";
import OnboardingSlidesScreen from "./OnboardingSlidesScreen";
import TermsScreen from "./TermsScreen";

export default function OnboardingFlow() {
  const [step, setStep] = useState<
    "terms" | "avatar" | "interests" | "details" | "slides"
  >("terms");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const router = useRouter();

  if (step === "terms") {
    return <TermsScreen onComplete={() => setStep("avatar")} />;
  }

  if (step === "avatar") {
    return <AvatarScreen onComplete={() => setStep("interests")} />;
  }

  if (step === "interests") {
    return (
      <InterestsScreen
        onComplete={(selected) => {
          setSelectedInterests(selected);
          setStep("details");
        }}
      />
    );
  }

  if (step === "details") {
    return (
      <InterestDetailsScreen
        selectedInterests={selectedInterests}
        onComplete={() => setStep("slides")}
      />
    );
  }

  return (
    <OnboardingSlidesScreen onComplete={() => router.replace("/(tabs)/home")} />
  );
}
