import { useRouter } from "expo-router";
import { View } from "react-native";
import Container from "../../../components/layout/container";
import Plant from "../../../components/garden/plant";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";

export default function IntroScreen() {
  const router = useRouter();

  return (
    <Container
      center
      footer={<Button onPress={() => router.push("/login")}>Continuar</Button>}
    >
      <View className="items-center">
        <Wordmark size="lg" />
        <View className="my-6">
          <Plant stage={1} size={200} />
        </View>
        <Text variant="h1">
          ¡Llegaste!
        </Text>
        <Text variant="body3" className="mt-1 text-primary-dark-hover">
          Aquí empieza algo nuevo
        </Text>
      </View>
    </Container>
  );
}
