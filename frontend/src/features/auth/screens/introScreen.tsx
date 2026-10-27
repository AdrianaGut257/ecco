import { useRouter } from "expo-router";
import { View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import WelcomeSeed from "../../../components/illustrations/welcomeSeed";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import Wordmark from "../../../components/ui/wordmark";

export default function IntroScreen() {
  const router = useRouter();

  return (
    <Container
      center
      footer={
        <Animated.View entering={FadeIn.delay(1600).duration(400)}>
          <Button onPress={() => router.push("/login")}>Continuar</Button>
        </Animated.View>
      }
    >
      <View className="items-center">
        <Wordmark size="lg" />
        <View className="my-6">
          <WelcomeSeed height={220} />
        </View>
        <Animated.View entering={FadeInDown.delay(1100).duration(500)}>
          <Text variant="h1" className="text-center">
            ¡Llegaste!
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(1400).duration(500)}>
          <Text variant="body3" className="mt-2 text-primary-dark-hover">
            Aquí empieza algo nuevo
          </Text>
        </Animated.View>
      </View>
    </Container>
  );
}
