import { useRouter } from "expo-router";
import { useState } from "react";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import AvatarScreen from "./avatarScreen";
import InterestDetailsScreen from "./interestDetailsScreen";
import InterestsScreen from "./interestsScreen";
import OnboardingSlidesScreen from "./onboardingSlidesScreen";
import TermsScreen from "./termsScreen";

type Step = "terms" | "avatar" | "interests" | "details" | "slides";

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("terms");
  const [avatarId, setAvatarId] = useState("a1");
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.saveProfile(avatarId, interests);
      sessionStore.updateUser({
        avatarId,
        interests,
        ...(username ? { username } : {}),
      });
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  switch (step) {
    case "terms":
      return <TermsScreen onComplete={() => setStep("avatar")} />;
    case "avatar":
      return (
        <AvatarScreen
          onBack={() => setStep("terms")}
          onComplete={(id, name) => {
            setAvatarId(id);
            setUsername(name);
            setStep("interests");
          }}
        />
      );
    case "interests":
      return (
        <InterestsScreen
          initialSelected={interests}
          onBack={() => setStep("avatar")}
          onComplete={(selected) => {
            setInterests(selected);
            setStep("details");
          }}
        />
      );
    case "details":
      return (
        <InterestDetailsScreen
          selectedInterests={interests}
          onBack={() => setStep("interests")}
          onComplete={() => setStep("slides")}
        />
      );
    default:
      return (
        <OnboardingSlidesScreen
          loading={saving}
          error={error}
          onComplete={finish}
        />
      );
  }
}
