import { Redirect, useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
const PROGRESS: Step[] = ["terms", "avatar", "interests", "details"];

// Barra delgada arriba: muestra cuánto falta para terminar (visibilidad del estado del sistema).
function WithProgress({ step, children }: { step: Step; children: ReactNode }) {
  const index = PROGRESS.indexOf(step);
  return (
    <View style={{ flex: 1 }}>
      {children}
      <SafeAreaView
        edges={["top"]}
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <View
          className="mx-7 mt-2 flex-row gap-1.5"
          accessible
          accessibilityLabel={`Paso ${index + 1} de ${PROGRESS.length}`}
        >
          {PROGRESS.map((s, i) => (
            <View
              key={s}
              className={`h-1 flex-1 rounded-full ${
                i < index
                  ? "bg-secondary-normal"
                  : i === index
                    ? "bg-primary-normal"
                    : "bg-primary-light-active"
              }`}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

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
  if (!user.emailVerified) return <Redirect href="/verifyEmail" />;

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

  const screen = (() => {
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
  })();

  return step === "slides" ? (
    screen
  ) : (
    <WithProgress step={step}>{screen}</WithProgress>
  );
}
