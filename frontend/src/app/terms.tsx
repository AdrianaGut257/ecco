import Container from "../components/layout/container";
import BackButton from "../components/ui/backButton";
import Text from "../components/ui/text";
import TermsList from "../features/onboarding/components/termsList";

export default function TermsRoute() {
  return (
    <Container scroll>
      <BackButton className="mb-4" fallbackRoute="/(tabs)/settings" />
      <Text variant="h2" className="mb-5">
        Nuestros acuerdos
      </Text>
      <TermsList />
    </Container>
  );
}
