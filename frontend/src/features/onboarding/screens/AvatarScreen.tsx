import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Text from "../../../components/ui/text";
import AvatarPicker from "../components/avatarPicker";

const NAME_PATTERN = /^[\p{L}\p{N}_.-]{2,20}$/u;

interface Props {
  onBack: () => void;
  onComplete: (avatarId: string, name: string) => void;
}

export default function AvatarScreen({ onBack, onComplete }: Props) {
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [name, setName] = useState("");
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
        <Button
          disabled={!avatarId || !nameValid}
          onPress={() => avatarId && onComplete(avatarId, trimmed)}
        >
          Continuar
        </Button>
      }
    >
      <BackButton className="mb-4" onPress={onBack} />
      <Text variant="h2" className="mb-1">
        Crea un avatar
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Elige uno para empezar. Podrás cambiarlo cuando quieras.
      </Text>

      <AvatarPicker value={avatarId} onChange={setAvatarId} />

      <Input
        label="¿Cómo te llamas?"
        value={name}
        onChangeText={setName}
        onBlur={() => setTouched(true)}
        error={nameError}
        hint="Es el nombre que verá la otra persona."
        placeholder="Tu nombre o apodo"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        className="mt-6"
      />
    </Container>
  );
}
