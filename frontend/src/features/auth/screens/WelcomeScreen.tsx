import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";
import Container from "../../../components/layout/container";
import Plant from "../../../components/garden/plant";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";
import { sessionStore } from "../../../store/session";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = sessionStore.use();

  if (!user) return <Redirect href="/login" />;

  return (
    <Container
      center
      footer={
        <Button onPress={() => router.replace("/(tabs)/home")}>
          Continuar
        </Button>
      }
    >
      <View className="items-center">
        <Wordmark size="lg" />
        <View className="my-6">
          <Plant stage={1} size={200} />
        </View>
        <Text variant="h3" className="text-primary-normal">
          Te damos la bienvenida
        </Text>
        <Text variant="h3" className="text-primary-normal">
          {user.username}
        </Text>
        <Text variant="body3" className="mt-2 text-primary-dark-hover">
          Qué bueno verte de nuevo
        </Text>
      </View>
    </Container>
  );
}
