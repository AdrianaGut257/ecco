import { useRouter } from "expo-router";
import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import type { InterestDetails } from "../../../types";
import InterestPicker from "../../onboarding/components/interestPicker";
import InterestDetailsScreen, {
  pickDetails,
} from "../../onboarding/screens/interestDetailsScreen";
import { MIN_INTERESTS } from "../../onboarding/screens/interestsScreen";

export default function EditInterestsScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [step, setStep] = useState<"pick" | "details">("pick");
  const [selected, setSelected] = useState<string[]>(user?.interests ?? []);
  const [details, setDetails] = useState<InterestDetails>(
    user?.interestDetails ?? {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (item: string) =>
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  const save = async (next: InterestDetails) => {
    setDetails(next);
    setSaving(true);
    setError(null);
    try {
      await authService.updateProfile({
        interests: selected,
        interestDetails: pickDetails(next, selected),
      });
      router.back();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  if (step === "details") {
    return (
      <InterestDetailsScreen
        selectedInterests={selected}
        initialDetails={details}
        onBack={() => setStep("pick")}
        onComplete={save}
        submitLabel="Guardar cambios"
        loading={saving}
        footerExtra={
          error ? <Banner tone="error" message={error} className="mb-3" /> : null
        }
      />
    );
  }

  const missing = MIN_INTERESTS - selected.length;

  return (
    <Container
      scroll
      footer={
        <Button disabled={missing > 0} onPress={() => setStep("details")}>
          {missing > 0 ? `Elige ${missing} más` : "Continuar"}
        </Button>
      }
    >
      <BackButton className="mb-4" fallbackRoute="/(tabs)/profile" />
      <Text variant="h2" className="mb-1">
        Mis intereses
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Cambia lo que quieras. En el siguiente paso puedes contar más de cada
        uno.
      </Text>
      <InterestPicker selected={selected} onToggle={toggle} />
    </Container>
  );
}
