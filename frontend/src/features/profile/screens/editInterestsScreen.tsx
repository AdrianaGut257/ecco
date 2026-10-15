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
import InterestPicker from "../../onboarding/components/interestPicker";
import { MIN_INTERESTS } from "../../onboarding/screens/interestsScreen";

export default function EditInterestsScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [selected, setSelected] = useState<string[]>(user?.interests ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (item: string) =>
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await authService.saveProfile(user.avatarId, selected);
      sessionStore.updateUser({ interests: selected });
      router.back();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  const missing = MIN_INTERESTS - selected.length;

  return (
    <Container
      scroll
      footer={
        <>
          {error && <Banner tone="error" message={error} className="mb-3" />}
          <Button loading={saving} disabled={missing > 0} onPress={save}>
            {missing > 0 ? `Elige ${missing} más` : "Guardar cambios"}
          </Button>
        </>
      }
    >
      <BackButton className="mb-4" fallbackRoute="/(tabs)/profile" />
      <Text variant="h2" className="mb-1">
        Mis intereses
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Cambia lo que quieras. Tus próximas conexiones lo tendrán en cuenta.
      </Text>
      <InterestPicker selected={selected} onToggle={toggle} />
    </Container>
  );
}
