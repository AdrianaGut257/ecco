import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { DEFAULT_AVATAR } from "../../../constants/avatar";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import type { AvatarConfig, InterestDetails } from "../../../types";
import AvatarScreen from "./avatarScreen";
import InterestDetailsScreen, { pickDetails } from "./interestDetailsScreen";
import InterestsScreen from "./interestsScreen";
import OnboardingSlidesScreen from "./onboardingSlidesScreen";
import TermsScreen from "./termsScreen";

type Step = "terms" | "avatar" | "interests" | "details" | "slides";

export default function OnboardingFlow() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [step, setStep] = useState<Step>("terms");
  const [avatar, setAvatar] = useState<AvatarConfig>(
    user?.avatar ?? DEFAULT_AVATAR,
  );
  const [username, setUsername] = useState(user?.username ?? "");
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [details, setDetails] = useState<InterestDetails>(
    user?.interestDetails ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return <Redirect href="/login" />;

  const finish = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateProfile({
        username,
        avatar,
        interests,
        interestDetails: pickDetails(details, interests),
        termsAccepted: true,
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
          initialAvatar={avatar}
          initialName={username}
          onBack={() => setStep("terms")}
          onComplete={(nextAvatar, name) => {
            setAvatar(nextAvatar);
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
          initialDetails={details}
          onBack={() => setStep("interests")}
          onComplete={(next) => {
            setDetails({ ...details, ...next });
            setStep("slides");
          }}
        />
      );
    default:
      return (
        <OnboardingSlidesScreen
          avatar={avatar}
          loading={saving}
          error={error}
          onComplete={finish}
        />
      );
  }
}
