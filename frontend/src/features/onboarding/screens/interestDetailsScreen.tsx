import { ReactNode, useState } from "react";
import { Pressable } from "react-native";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import type { InterestDetails } from "../../../types";
import InterestDetailsEditor from "../components/interestDetailsEditor";

interface Props {
  selectedInterests: string[];
  initialDetails?: InterestDetails;
  onBack: () => void;
  onComplete: (details: InterestDetails) => void;
  submitLabel?: string;
  loading?: boolean;
  footerExtra?: ReactNode;
}

export const pickDetails = (details: InterestDetails, interests: string[]) =>
  Object.fromEntries(
    Object.entries(details).filter(([interest]) => interests.includes(interest)),
  );

export default function InterestDetailsScreen({
  selectedInterests,
  initialDetails = {},
  onBack,
  onComplete,
  submitLabel = "Continuar",
  loading,
  footerExtra,
}: Props) {
  const [details, setDetails] = useState<InterestDetails>(
    pickDetails(initialDetails, selectedInterests),
  );

  return (
    <Container
      scroll
      footer={
        <>
          {footerExtra}
          <Button loading={loading} onPress={() => onComplete(details)}>
            {submitLabel}
          </Button>
          <Pressable
            onPress={() => onComplete(details)}
            disabled={loading}
            className="min-h-[44px] items-center justify-center"
            hitSlop={8}
          >
            <Text variant="caption1" className="text-primary-dark-hover">
              Prefiero hacerlo después
            </Text>
          </Pressable>
        </>
      }
    >
      <BackButton className="mb-4" onPress={onBack} />
      <Text variant="h2" className="mb-1">
        Cuéntanos más
      </Text>
      <Text variant="body3" className="mb-6 text-primary-dark-hover">
        Elige subtemas y agrega ejemplos que te gusten. Mientras más detalle,
        más fácil será encontrar a alguien con quien la conversación fluya. Es
        opcional.
      </Text>
      <InterestDetailsEditor
        interests={selectedInterests}
        value={details}
        onChange={setDetails}
      />
    </Container>
  );
}
