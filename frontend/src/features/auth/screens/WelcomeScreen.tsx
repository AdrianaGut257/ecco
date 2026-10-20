import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import WelcomeSeed from "../../../components/illustrations/welcomeSeed";
import Container from "../../../components/layout/container";
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
        <Animated.View entering={FadeIn.delay(1600).duration(400)}>
          <Button onPress={() => router.replace("/(tabs)/home")}>
            Continuar
          </Button>
        </Animated.View>
      }
    >
      <View className="items-center">
        <Wordmark size="lg" />
        <View className="my-6">
          <WelcomeSeed height={220} />
        </View>
        <Animated.View
          entering={FadeInDown.delay(1100).duration(500)}
          className="items-center"
        >
          <Text variant="h3" className="text-primary-dark-hover">
            Te damos la bienvenida
          </Text>
          <Text variant="h3" className="text-primary-dark-hover">
            {user.username}
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(1400).duration(500)}>
          <Text variant="body3" className="mt-2 text-primary-dark-hover">
            Qué bueno verte de nuevo
          </Text>
        </Animated.View>
      </View>
    </Container>
  );
}
