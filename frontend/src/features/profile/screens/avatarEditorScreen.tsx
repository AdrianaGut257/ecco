import { useRouter } from "expo-router";
import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { DEFAULT_AVATAR } from "../../../constants/avatar";
import { friendlyError } from "../../../services/api";
import { authService } from "../../../services/authService";
import { sessionStore } from "../../../store/session";
import type { AvatarConfig } from "../../../types";
import AvatarCustomizer from "../components/avatarCustomizer";

export default function AvatarEditorScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();
  const [avatar, setAvatar] = useState<AvatarConfig>(user?.avatar ?? DEFAULT_AVATAR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await authService.updateProfile({ avatar });
      router.back();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container
      scroll
      footer={
        <>
          {error && <Banner tone="error" message={error} className="mb-3" />}
          <Button loading={saving} onPress={save}>
            Guardar avatar
          </Button>
        </>
      }
    >
      <BackButton className="mb-4" fallbackRoute="/(tabs)/profile" />
      <Text variant="h2" className="mb-1">
        Tu avatar
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Muéstrate como te sientes hoy. Puedes cambiarlo cuando quieras.
      </Text>
      <AvatarCustomizer value={avatar} onChange={setAvatar} />
    </Container>
  );
}
