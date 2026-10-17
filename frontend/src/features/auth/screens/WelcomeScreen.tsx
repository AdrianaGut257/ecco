import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";
import Container from "../../../components/layout/container";
import { Image } from "expo-image";
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
          <Image
            source={require("../../../../assets/svg/semilla.svg")}
            style={{ width: 113, height: 220 }}
            contentFit="contain"
            accessibilityLabel="Una semilla que empieza a brotar"
          />
        </View>
        <Text variant="h3" className="text-primary-dark-hover">
          Te damos la bienvenida
        </Text>
        <Text variant="h3" className="text-primary-dark-hover">
          {user.username}
        </Text>
        <Text variant="body3" className="mt-2 text-primary-dark-hover">
          Qué bueno verte de nuevo
        </Text>
      </View>
    </Container>
  );
}
