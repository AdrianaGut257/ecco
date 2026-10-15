import { useState } from "react";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import InterestPicker from "../components/interestPicker";

export const MIN_INTERESTS = 3;

interface Props {
  initialSelected?: string[];
  onBack: () => void;
  onComplete: (selected: string[]) => void;
}

export default function InterestsScreen({
  initialSelected = [],
  onBack,
  onComplete,
}: Props) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggle = (item: string) =>
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  const missing = MIN_INTERESTS - selected.length;
  const hint =
    missing > 0
      ? `Elige ${missing} más para continuar.`
      : `${selected.length} elegidos. ¡Se ve genial!`;

  return (
    <Container
      scroll
      footer={
        <>
          <Text
            variant="caption1"
            className="mb-3 text-center text-primary-dark-hover"
          >
            {hint}
          </Text>
          <Button disabled={missing > 0} onPress={() => onComplete(selected)}>
            Continuar
          </Button>
        </>
      }
    >
      <BackButton className="mb-4" onPress={onBack} />
      <Text variant="h2" className="mb-1">
        ¿Qué te gusta?
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Elige los temas que te gustaría compartir.
      </Text>
      <InterestPicker selected={selected} onToggle={toggle} />
    </Container>
  );
}
