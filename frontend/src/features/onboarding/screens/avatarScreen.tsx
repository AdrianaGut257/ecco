import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import type { AvatarConfig } from "../../../types";
import AvatarCustomizer from "../../profile/components/avatarCustomizer";

const NAME_PATTERN = /^[\p{L}\p{N}_.-]{2,20}$/u;

interface Props {
  initialAvatar: AvatarConfig;
  initialName: string;
  onBack: () => void;
  onComplete: (avatar: AvatarConfig, name: string) => void;
}

export default function AvatarScreen({
  initialAvatar,
  initialName,
  onBack,
  onComplete,
}: Props) {
  const [avatar, setAvatar] = useState<AvatarConfig>(initialAvatar);
  const [name, setName] = useState(initialName);
  const [touched, setTouched] = useState(false);

  const trimmed = name.trim();
  const nameValid = NAME_PATTERN.test(trimmed);
  const nameError =
    touched && trimmed.length > 0 && !nameValid
      ? "Usa entre 2 y 20 letras o números, sin espacios."
      : undefined;

  return (
    <Container
      scroll
      footer={
        <Button disabled={!nameValid} onPress={() => onComplete(avatar, trimmed)}>
          Continuar
        </Button>
      }
    >
      <BackButton className="mb-4" onPress={onBack} />
      <Text variant="h2" className="mb-1">
        Crea tu avatar
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Sin fotos: muéstrate como quieras. Podrás cambiarlo cuando quieras.
      </Text>

      <AvatarCustomizer value={avatar} onChange={setAvatar} />

      <Input
        label="¿Cómo quieres que te llamen?"
        value={name}
        onChangeText={setName}
        onBlur={() => setTouched(true)}
        error={nameError}
        hint="Es el nombre que verá la otra persona. Puede ser un apodo."
        placeholder="Tu nombre o apodo"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        className="mt-2"
      />
    </Container>
  );
}
